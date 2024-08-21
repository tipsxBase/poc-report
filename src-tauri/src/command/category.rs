use crate::entities::{self, category::PocCategory, shared_types::RResult, PageResult};

#[tauri::command]
pub async fn insert_category(
    category: PocCategory,
) -> RResult<std::result::Result<rbatis::rbdc::db::ExecResult, rbatis::rbdc::Error>> {
    let result: Result<
        Result<rbatis::rbdc::db::ExecResult, rbatis::rbdc::Error>,
        rbatis::rbdc::Error,
    > = entities::category::add(category).await;
    result
}

#[tauri::command]
pub async fn query_category_list(
    category: PocCategory,
    current: u64,
    size: u64,
) -> RResult<PageResult<PocCategory>> {
    let result = entities::category::query(category, current, size).await;
    result
}

#[tauri::command]
pub async fn update_category(
    category: PocCategory,
) -> RResult<std::result::Result<rbatis::rbdc::db::ExecResult, rbatis::rbdc::Error>> {
    let result = entities::category::update(category).await;
    result
}

#[tauri::command]
pub async fn delete_category(
    category: PocCategory,
) -> RResult<std::result::Result<rbatis::rbdc::db::ExecResult, rbatis::rbdc::Error>> {
    let result = entities::category::delete(category).await;
    result
}

#[tauri::command]
pub async fn query_category_all() -> RResult<Vec<PocCategory>> {
    let result = entities::category::query_all().await;
    result
}
