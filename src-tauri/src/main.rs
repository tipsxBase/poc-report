// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use entities::case::PocCase;
use entities::category::PocCategory;
use entities::metric::PocMetric;
use entities::server::PocServer;
use entities::shared_types::RResult;
use entities::statics::PocServerStatics;
use entities::PageResult;
use refinery::Migration;
use rusqlite::Connection;
use serde_json::json;
use std::collections::HashMap;
use std::fs::File;
use std::io::Write;
use std::mem;
use tauri::Manager;
use zip::write::SimpleFileOptions;
use zip::ZipWriter;
pub mod entities;
pub mod request;
pub mod shell;
use base64::{engine::general_purpose::STANDARD, Engine as _};

refinery::embed_migrations!("migrations");

#[tauri::command]
fn download_file(file_name: String, content: String) -> Result<(), String> {
    let mut file = File::create(file_name).map_err(|e| e.to_string())?;
    file.write_all(content.as_bytes())
        .map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
async fn insert_category(
    category: PocCategory,
) -> RResult<std::result::Result<rbatis::rbdc::db::ExecResult, rbatis::rbdc::Error>> {
    let result: Result<
        Result<rbatis::rbdc::db::ExecResult, rbatis::rbdc::Error>,
        rbatis::rbdc::Error,
    > = entities::category::add(category).await;
    result
}

#[tauri::command]
async fn query_category_list(
    category: PocCategory,
    current: u64,
    size: u64,
) -> RResult<PageResult<PocCategory>> {
    let result = entities::category::query(category, current, size).await;
    result
}

#[tauri::command]
async fn update_category(
    category: PocCategory,
) -> RResult<std::result::Result<rbatis::rbdc::db::ExecResult, rbatis::rbdc::Error>> {
    let result = entities::category::update(category).await;
    result
}

#[tauri::command]
async fn delete_category(
    category: PocCategory,
) -> RResult<std::result::Result<rbatis::rbdc::db::ExecResult, rbatis::rbdc::Error>> {
    let result = entities::category::delete(category).await;
    result
}

#[tauri::command]
async fn query_category_all() -> RResult<Vec<PocCategory>> {
    let result = entities::category::query_all().await;
    result
}

#[tauri::command]
async fn insert_case(
    case: PocCase,
) -> RResult<std::result::Result<rbatis::rbdc::db::ExecResult, rbatis::rbdc::Error>> {
    let result: Result<
        Result<rbatis::rbdc::db::ExecResult, rbatis::rbdc::Error>,
        rbatis::rbdc::Error,
    > = entities::case::add(case).await;
    result
}

#[tauri::command]
async fn query_case_list(case: PocCase, current: u64, size: u64) -> RResult<PageResult<PocCase>> {
    let result = entities::case::query(case, current, size).await;
    result
}

#[tauri::command]
async fn update_case(
    case: PocCase,
) -> RResult<std::result::Result<rbatis::rbdc::db::ExecResult, rbatis::rbdc::Error>> {
    let result = entities::case::update(case).await;
    result
}

#[tauri::command]
async fn delete_case(
    case: PocCase,
) -> RResult<std::result::Result<rbatis::rbdc::db::ExecResult, rbatis::rbdc::Error>> {
    let result = entities::case::delete(case).await;
    result
}

#[tauri::command]
async fn insert_metric(metrics: Vec<PocMetric>) -> RResult<rbatis::rbdc::db::ExecResult> {
    println!("{}", json!(metrics));
    let result = entities::metric::insert_batch(metrics).await;
    result
}

#[tauri::command]
async fn insert_statics(statics: Vec<PocServerStatics>) -> RResult<rbatis::rbdc::db::ExecResult> {
    println!("{}", json!(statics));
    let result = entities::statics::insert_batch(statics).await;
    result
}

#[tauri::command]
async fn select_metric(case_id: i64) -> RResult<Vec<PocMetric>> {
    let result = entities::metric::select_metrics(case_id).await;
    result
}

#[tauri::command]
async fn select_statics(case_id: i64, static_type: i8) -> RResult<Vec<PocServerStatics>> {
    let result = entities::statics::select_statics(case_id, static_type).await;
    result
}

#[tauri::command]
async fn insert_server(server: PocServer) -> RResult<rbatis::rbdc::db::ExecResult> {
    let result = entities::server::add(server).await;
    result
}

#[tauri::command]
async fn query_server_list(
    server: PocServer,
    current: u64,
    size: u64,
) -> RResult<PageResult<PocServer>> {
    let result = entities::server::query(server, current, size).await;
    result
}

#[tauri::command]
async fn update_server(server: PocServer) -> RResult<rbatis::rbdc::db::ExecResult> {
    let result = entities::server::update(server).await;
    result
}

#[tauri::command]
async fn delete_server(server: PocServer) -> RResult<rbatis::rbdc::db::ExecResult> {
    let result = entities::server::delete(server).await;
    result
}

#[tauri::command]
async fn update_server_check_default(server_id: i64) -> RResult<rbatis::rbdc::db::ExecResult> {
    let result = entities::server::update_check(server_id).await;
    result
}

#[tauri::command]
async fn server_init(server_id: i64) -> bool {
    let server = entities::server::select_server_by_id(server_id).await;

    let session = shell::create_session(
        &server.host.unwrap(),
        server.port.unwrap(),
        &server.username.unwrap(),
        &server.password.unwrap(),
    );

    shell::exec_command(&session, "mkdir poc");
    shell::exec_command(&session, "mkdir poc/logs");
    shell::exec_command(&session, "mkdir poc/poc-cases");
    let data = request::upload_jar(&session, "poc/hexadb-poc.jar")
        .await
        .unwrap();
    data
}

fn is_empty<T>(_: &T) -> bool {
    mem::size_of::<T>() == 0
}

#[tauri::command]
async fn run_case(case_content: String, case_name: String) -> i32 {
    let server = entities::server::select_default_server().await;
    if is_empty(&server) {
        return -1;
    }
    let session = shell::create_session(
        &server.host.unwrap(),
        server.port.unwrap(),
        &server.username.unwrap(),
        &server.password.unwrap(),
    );
    let path = format!("poc/poc-cases/{}.yml", case_name);
    shell::upload_case(&session, &path, &case_content)
    // let command = format!(
    //     "nohup java -jar poc/hexadb-poc.jar -config {} > poc/logs/poc_log.log 2>&1 &",
    //     path
    // );
    // shell::exec_command(&session, &command)
}

#[tauri::command]
fn download_image(
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

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            #[cfg(debug_assertions)]
            {
                let window = app.get_window("main").unwrap();
                window.open_devtools();
            };
            let mut conn = Connection::open(shared::sqlite::get_database_path()).unwrap();

            let use_iteration = std::env::args().any(|a| a.to_lowercase().eq("--iterate"));

            if use_iteration {
                // create an iterator over migrations as they run
                for migration in migrations::runner().run_iter(&mut conn) {
                    process_migration(migration.expect("Migration failed!"));
                }
            } else {
                // or run all migrations in one go
                migrations::runner().run(&mut conn).unwrap();
            }

            Ok({})
        })
        .invoke_handler(tauri::generate_handler![
            download_file,
            insert_category,
            query_category_list,
            update_category,
            delete_category,
            query_category_all,
            insert_case,
            query_case_list,
            update_case,
            delete_case,
            insert_metric,
            insert_statics,
            select_metric,
            select_statics,
            insert_server,
            query_server_list,
            update_server,
            delete_server,
            update_server_check_default,
            server_init,
            run_case,
            download_image
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn process_migration(migration: Migration) {
    #[cfg(not(feature = "enums"))]
    {
        // run something after each migration
        println!("Post-processing a migration: {}", migration)
    }

    #[cfg(feature = "enums")]
    {
        // or with the `enums` feature enabled, match against migrations to run specific post-migration steps
        use migrations::EmbeddedMigration;
        match migration.into() {
            EmbeddedMigration::Initial(m) => info!("V{}: Initialized the database!", m.version()),
            m => info!("Got a migration: {:?}", m),
        }
    }
}
