use std::path::Path;

use crate::{
    entities::{self, server::PocServer, shared_types::RResult, PageResult},
    shell,
};

#[tauri::command]
pub async fn insert_server(server: PocServer) -> RResult<rbatis::rbdc::db::ExecResult> {
    let result = entities::server::add(server).await;
    result
}

#[tauri::command]
pub async fn query_server_list(
    server: PocServer,
    current: u64,
    size: u64,
) -> RResult<PageResult<PocServer>> {
    let result = entities::server::query(server, current, size).await;
    result
}

#[tauri::command]
pub async fn query_all_server_list() -> RResult<Vec<PocServer>> {
    let result = entities::server::query_all_servers().await;
    result
}

#[tauri::command]
pub async fn update_server(server: PocServer) -> RResult<rbatis::rbdc::db::ExecResult> {
    let result = entities::server::update(server).await;
    result
}

#[tauri::command]
pub async fn delete_server(server: PocServer) -> RResult<rbatis::rbdc::db::ExecResult> {
    let result = entities::server::delete(server).await;
    result
}

#[tauri::command]
pub async fn update_server_check_default(server_id: i64) -> RResult<rbatis::rbdc::db::ExecResult> {
    let result = entities::server::update_check(server_id).await;
    result
}

#[tauri::command]
pub async fn server_init(server_id: i64) -> RResult<rbatis::rbdc::db::ExecResult> {
    let server = entities::server::select_server_by_id(server_id).await;

    let session = shell::create_session(
        &server.host.unwrap(),
        server.port.unwrap(),
        &server.username.unwrap(),
        &server.password.unwrap(),
    )
    .expect("创建会话失败");

    let sftp = session.sftp().expect("创建sftp失败");

    let working_directory = server.working_directory.unwrap_or(String::from("poc"));

    let dirs: Vec<&str> = working_directory.split('/').collect();

    let mut current_path = String::new();

    for dir in dirs {
        current_path = if current_path.is_empty() {
            dir.to_string()
        } else {
            format!("{}/{}", current_path, dir)
        };
        let path = Path::new(&current_path);
        if shell::sftp_directory_is_exist(&sftp, &path) == false {
            sftp.mkdir(path, 0o755)
                .expect(format!("创建{}失败", current_path).as_str());
            println!("创建{}目录成功", current_path);
        }
    }

    let paths_to_be_created = vec!["logs", "poc-cases", "ddl"];

    for path in paths_to_be_created {
        let poc_path_dir = format!("{}/{}", working_directory, path);
        let poc_path = Path::new(&poc_path_dir);
        if shell::sftp_directory_is_exist(&sftp, &poc_path) == false {
            sftp.mkdir(poc_path, 0o755)
                .expect(format!("创建{}失败", poc_path_dir).as_str());
            println!("创建{}目录成功", poc_path_dir);
        }
    }
    entities::server::update_server_initial_state(server_id, 2).await
}
