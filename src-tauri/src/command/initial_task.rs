use rbatis::rbatis_codegen::ops::AsProxy;

use crate::entities::{
    self,
    initial_task::PocInitialTask,
    shared_types::{CommandPageResult, CommandResult, PageResponse, Response},
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
