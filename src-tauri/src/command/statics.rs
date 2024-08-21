use serde_json::json;

use crate::entities::{self, shared_types::RResult, statics::PocServerStatics};

#[tauri::command]
pub async fn insert_statics(
    statics: Vec<PocServerStatics>,
) -> RResult<rbatis::rbdc::db::ExecResult> {
    println!("{}", json!(statics));
    let result = entities::statics::insert_batch(statics).await;
    result
}

#[tauri::command]
pub async fn select_statics(case_id: i64, static_type: i8) -> RResult<Vec<PocServerStatics>> {
    let result = entities::statics::select_statics(case_id, static_type).await;
    result
}
