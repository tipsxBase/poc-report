use serde_json::json;

use crate::entities::{self, metric::PocMetric, shared_types::RResult};

#[tauri::command]
pub async fn insert_metric(metrics: Vec<PocMetric>) -> RResult<rbatis::rbdc::db::ExecResult> {
    println!("{}", json!(metrics));
    let result = entities::metric::insert_batch(metrics).await;
    result
}

#[tauri::command]
pub async fn select_metric(case_id: i64) -> RResult<Vec<PocMetric>> {
    let result = entities::metric::select_metrics(case_id).await;
    result
}
