use std::{collections::HashMap, fs::File, io::Write};

use base64::{engine::general_purpose::STANDARD, Engine as _};

use rbatis::rbdc::Error;
use shared::util::is_empty;
use zip::{write::SimpleFileOptions, ZipWriter};

use crate::{
    entities::{
        self,
        case::PocCase,
        shared_types::{CommandResult, RResult, Response},
        PageResult,
    },
    shell,
};

#[tauri::command]
pub async fn insert_case(
    case: PocCase,
) -> RResult<std::result::Result<rbatis::rbdc::db::ExecResult, rbatis::rbdc::Error>> {
    let result: Result<
        Result<rbatis::rbdc::db::ExecResult, rbatis::rbdc::Error>,
        rbatis::rbdc::Error,
    > = entities::case::add(case).await;
    result
}

#[tauri::command]
pub async fn query_case_list(
    case: PocCase,
    current: u64,
    size: u64,
) -> RResult<PageResult<PocCase>> {
    let result = entities::case::query(case, current, size).await;
    result
}

#[tauri::command]
pub async fn update_case(
    case: PocCase,
) -> RResult<std::result::Result<rbatis::rbdc::db::ExecResult, rbatis::rbdc::Error>> {
    let result = entities::case::update(case).await;
    result
}

#[tauri::command]
pub async fn delete_case(
    case: PocCase,
) -> RResult<std::result::Result<rbatis::rbdc::db::ExecResult, rbatis::rbdc::Error>> {
    let result = entities::case::delete(case).await;
    result
}

/**
 * 上传
 */
#[tauri::command]
pub async fn run_case(case_content: String, case_name: String) -> Result<i32, Error> {
    let server = match entities::server::select_default_server().await {
        Ok(server) => server,
        Err(_) => return Err(Error::E(String::from("server is empty"))),
    };

    if is_empty(&server) {
        return Err(Error::E(String::from("server is empty")));
    }
    let working_directory = server.working_directory.unwrap_or(String::from("poc"));
    let session = shell::create_session(
        &server.host.unwrap(),
        server.port.unwrap(),
        &server.username.unwrap(),
        &server.password.unwrap(),
    )
    .expect("创建会话失败");
    let path = format!("{}/poc-cases/{}.yml", working_directory, case_name);
    Ok(shell::upload_content(&session, &path, &case_content))
    // TODO 目前还不支持获取执行的进度，先把这里注释掉
    // let command = format!(
    //     "nohup java -jar poc/hexadb-poc.jar -config {} > poc/logs/poc_log.log 2>&1 &",
    //     path
    // );
    // shell::exec_command(&session, &command)
}

#[tauri::command]
pub fn download_image(
    image_data: HashMap<String, String>,
    file_dir: String,
    case_name: String,
) -> &'static str {
    let file = File::create(format!("{}/{case_name}.zip", file_dir)).unwrap();
    let mut zip = ZipWriter::new(file);
    let options = SimpleFileOptions::default()
        .compression_method(zip::CompressionMethod::Stored)
        .unix_permissions(0o755);

    for (name, base64_data) in &image_data {
        let decoded_data = STANDARD.decode(&base64_data[22..]);
        match decoded_data {
            Ok(data) => {
                zip.start_file(format!("{}.png", name), options).unwrap();
                zip.write_all(&data).unwrap();
            }
            Err(err) => {
                println!("{}", err)
            }
        }
    }
    zip.finish().unwrap();
    "success"
}

#[tauri::command]
pub async fn reset_order(
    case_id: i64,
    search_case: PocCase,
    direction: String,
) -> CommandResult<String> {
    match entities::case::reset_order(case_id, search_case, direction).await {
        Ok(_) => Ok(Response {
            message: format!("成功"),
            success: true,
            data: Some(format!("成功")),
        }),
        Err(err) => Err(Response {
            message: err.to_string(),
            success: false,
            data: None,
        }),
    }
}
