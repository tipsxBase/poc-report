use std::{collections::HashMap, fs::File, io::Write};

use rbatis::rbatis_codegen::ops::AsProxy;
use shared::util::is_empty;
use zip::{write::SimpleFileOptions, ZipWriter};

use crate::{
    entities::{
        self,
        initial_task::PocInitialTask,
        shared_types::{CommandPageResult, CommandResult, PageResponse, Response},
    },
    shell,
};

#[tauri::command]
pub async fn insert_initial_task(task: PocInitialTask) -> CommandResult<u64> {
    match entities::initial_task::add(task).await {
        Ok(data) => Ok(Response {
            message: format!("success"),
            success: true,
            data: Some(data.last_insert_id.u64()),
        }),
        Err(err) => Err(Response {
            message: err.to_string(),
            success: false,
            data: None,
        }),
    }
}

#[tauri::command]
pub async fn query_initial_task_list(
    task: PocInitialTask,
    current: u64,
    size: u64,
) -> CommandPageResult<Vec<PocInitialTask>> {
    match entities::initial_task::query(task, current, size).await {
        Ok(data) => Ok(PageResponse {
            message: String::from("success"),
            success: true,
            data: Some(data.records),
            total: data.total,
            page_no: data.page_no,
            page_size: data.page_size,
        }),
        Err(err) => Err(PageResponse {
            message: err.to_string(),
            success: false,
            data: None,
            total: 0,
            page_no: 0,
            page_size: 0,
        }),
    }
}

#[tauri::command]
pub async fn update_initial_task(task: PocInitialTask) -> CommandResult<u64> {
    match entities::initial_task::update(task).await {
        Ok(data) => Ok(Response {
            message: format!("success"),
            success: true,
            data: Some(data.rows_affected),
        }),
        Err(err) => Err(Response {
            message: err.to_string(),
            success: false,
            data: None,
        }),
    }
}

#[tauri::command]
pub async fn delete_initial_task(task: PocInitialTask) -> CommandResult<u64> {
    match entities::initial_task::delete(task).await {
        Ok(data) => Ok(Response {
            message: format!("success"),
            success: true,
            data: Some(data.rows_affected),
        }),
        Err(err) => Err(Response {
            message: err.to_string(),
            success: false,
            data: None,
        }),
    }
}

#[tauri::command]
pub fn download_script(
    script_data: HashMap<String, String>,
    file_dir: String,
    file_name: String,
) -> CommandResult<String> {
    let file = File::create(format!("{}/{}.zip", file_dir, file_name)).map_err(|e| {
        return Response {
            message: e.to_string(),
            success: false,
            data: None,
        };
    })?;

    let mut zip = ZipWriter::new(file);
    let options = SimpleFileOptions::default()
        .compression_method(zip::CompressionMethod::Stored)
        .unix_permissions(0o755);

    for (name, script) in &script_data {
        zip.start_file(format!("{}", name), options).unwrap();
        zip.write_all(&script.as_bytes()).map_err(|e| {
            return Response {
                message: e.to_string(),
                success: false,
                data: None,
            };
        })?;
    }
    zip.finish().map_err(|e| {
        return Response {
            message: e.to_string(),
            success: false,
            data: None,
        };
    })?;
    Ok(Response {
        message: String::from("success"),
        success: true,
        data: None,
    })
}

#[tauri::command]
pub async fn upload_script(script_data: HashMap<String, String>) -> CommandResult<String> {
    let server = match entities::server::select_default_server().await {
        Ok(server) => server,
        Err(e) => {
            return Err(Response {
                message: e.to_string(),
                success: false,
                data: None,
            })
        }
    };

    if is_empty(&server) {
        return Err(Response {
            message: String::from("server is empty"),
            success: false,
            data: None,
        });
    }
    let working_directory = server.working_directory.unwrap_or(String::from("poc"));
    let session = shell::create_session(
        &server.host.unwrap(),
        server.port.unwrap(),
        &server.username.unwrap(),
        &server.password.unwrap(),
    )
    .map_err(|e| {
        return Response {
            message: e.to_string(),
            success: false,
            data: None,
        };
    })?;

    for (name, script) in &script_data {
        let path = format!("{}/{}", working_directory, &name);
        shell::upload_content(&session, &path, &script);
    }

    Ok(Response {
        message: String::from("success"),
        success: true,
        data: None,
    })
}
