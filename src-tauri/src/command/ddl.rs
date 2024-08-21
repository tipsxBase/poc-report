use rbatis::rbdc::Error;
use shared::util::is_empty;

use crate::{
    entities::{self, ddl::PocDdl, shared_types::RResult, PageResult},
    shell,
};

#[tauri::command]
pub async fn insert_ddl(ddl: PocDdl) -> RResult<rbatis::rbdc::db::ExecResult> {
    let result = entities::ddl::add(ddl).await;
    result
}

#[tauri::command]
pub async fn query_ddl_list(ddl: PocDdl, current: u64, size: u64) -> RResult<PageResult<PocDdl>> {
    let result = entities::ddl::query(ddl, current, size).await;
    result
}

#[tauri::command]
pub async fn update_ddl(ddl: PocDdl) -> RResult<rbatis::rbdc::db::ExecResult> {
    let result = entities::ddl::update(ddl).await;
    result
}

#[tauri::command]
pub async fn delete_ddl(ddl: PocDdl) -> RResult<rbatis::rbdc::db::ExecResult> {
    println!("{:?}", ddl);
    let result = entities::ddl::delete(ddl).await;
    result
}

#[tauri::command]
pub async fn upload_ddl(ddl_content: String, ddl_name: String) -> Result<i32, Error> {
    let server = match entities::server::select_default_server().await {
        Ok(server) => server,
        Err(error) => return Err(error),
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
    let path = format!("{}/ddl/{}.sql", working_directory, ddl_name);
    Ok(shell::upload_content(&session, &path, &ddl_content))
}
