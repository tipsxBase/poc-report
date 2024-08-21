use std::{fs::File, io::Write};

use futures::StreamExt;

use crate::{
    entities::{
        self,
        shared_types::{CommandPageResult, CommandResult, PageResponse, Response},
        task::{get_task_status, get_task_type, PocTask, PocTaskStatus, PocTaskType},
    },
    request,
};

#[tauri::command]
pub async fn query_task_list(
    task: PocTask,
    current: u64,
    size: u64,
) -> CommandPageResult<Vec<PocTask>> {
    match entities::task::query_page(task, current, size).await {
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
pub async fn download_file_from_oss(
    url: String,
    file_dir: String,
    file_name: String,
) -> Result<Response<String>, String> {
    tauri::async_runtime::spawn(async move {
        let mut file = File::create(format!("{}/{}", file_dir, file_name)).unwrap();
        let task = PocTask {
            task_id: None,
            task_name: Some(format!("{}", file_name)),
            task_status: get_task_status(PocTaskStatus::NotStarted),
            task_type: get_task_type(PocTaskType::DownloadTask),
            task_progress: Some(0.0),
            task_payload: None,
        };

        let execute_result = entities::task::add_task(task).await.unwrap();
        let last_insert_id = execute_result.last_insert_id.as_u64();
        let response = request::get_by_url(url.as_str()).await;
        let content_length = match response.content_length() {
            Some(content_length) => content_length,
            _ => 0,
        };
        println!("content_length: {}", content_length);
        let mut uploaded_length: usize = 0;

        // 从下载流中读取数据并写入远程文件
        let mut stream = response.bytes_stream();

        while let Some(chunk) = stream.next().await {
            let chunk = chunk.map_err(|e| e.to_string()).unwrap();
            println!("chunk{}", chunk.len());
            uploaded_length += chunk.len();

            match file.write_all(&chunk).map_err(|e| e.to_string()) {
                Ok(_) => {
                    entities::task::update_task(PocTask {
                        task_id: last_insert_id,
                        task_status: get_task_status(PocTaskStatus::InProgress),
                        task_progress: Some(uploaded_length as f64 / content_length as f64),
                        task_name: None,
                        task_type: None,
                        task_payload: None,
                    })
                    .await
                    .unwrap();
                }
                Err(_) => {
                    entities::task::update_task(PocTask {
                        task_id: last_insert_id,
                        task_status: get_task_status(PocTaskStatus::Failed),
                        task_progress: Some(uploaded_length as f64 / content_length as f64),
                        task_name: None,
                        task_type: None,
                        task_payload: None,
                    })
                    .await
                    .unwrap();
                }
            };
        }
        match file.flush() {
            Ok(_) => {
                entities::task::update_task(PocTask {
                    task_id: last_insert_id,
                    task_status: get_task_status(PocTaskStatus::Completed),
                    task_progress: Some(1.0),
                    task_name: None,
                    task_type: None,
                    task_payload: None,
                })
                .await
                .unwrap();
            }
            Err(err) => {
                println!("{}", err);
                entities::task::update_task(PocTask {
                    task_id: last_insert_id,
                    task_status: get_task_status(PocTaskStatus::Failed),
                    task_progress: None,
                    task_name: None,
                    task_type: None,
                    task_payload: None,
                })
                .await
                .unwrap();
            }
        };
    });

    Ok(Response {
        message: String::from("文件开始下载，请在任务中心查看"),
        success: true,
        data: Some(String::from("文件开始下载，请在任务中心查看")),
    })
}

#[tauri::command]
pub async fn delete_completed_task() -> CommandResult<u64> {
    match entities::task::delete_completed_task().await {
        Ok(data) => Ok(Response {
            message: String::from("success"),
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
pub async fn delete_by_id(task_id: u64) -> CommandResult<u64> {
    match entities::task::delete_by_id(task_id).await {
        Ok(data) => Ok(Response {
            message: String::from("success"),
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
