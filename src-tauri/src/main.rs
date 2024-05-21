// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]


use std::fs::File;
use std::io::Write;
use entities::case::PocCase;
use entities::category::PocCategory;
use entities::metric::PocMetric;
use entities::shared_types::RResult;
use entities::PageResult;
use rusqlite::Connection;
use tauri::Manager;
use refinery::Migration;
pub mod entities;

refinery::embed_migrations!("migrations");

#[tauri::command]
fn download_file(file_name: String, content: String) -> Result<(), String> {
  let mut file = File::create(file_name).map_err(|e| e.to_string())?;
  file.write_all(content.as_bytes()).map_err(|e| e.to_string())?;
  Ok(())
}

#[tauri::command]
async fn insert_category(category: PocCategory) -> RResult<std::result::Result<rbatis::rbdc::db::ExecResult, rbatis::rbdc::Error>> {
    let result: Result<Result<rbatis::rbdc::db::ExecResult, rbatis::rbdc::Error>, rbatis::rbdc::Error> = entities::category::add(category).await;
    result
}

#[tauri::command]
async fn query_category_list(category: PocCategory, current: u64, size: u64) -> RResult<PageResult<PocCategory>>{
    let result = entities::category::query(category, current, size).await;
    result
}

#[tauri::command]
async fn update_category(category: PocCategory) -> RResult<std::result::Result<rbatis::rbdc::db::ExecResult, rbatis::rbdc::Error>> {
    let result = entities::category::update(category).await;
    result
}

#[tauri::command]
async fn delete_category(category: PocCategory) -> RResult<std::result::Result<rbatis::rbdc::db::ExecResult, rbatis::rbdc::Error>> {
    let result = entities::category::delete(category).await;
    result
}

#[tauri::command]
async fn query_category_all() -> RResult<Vec<PocCategory>>{
    let result = entities::category::query_all().await;
    result
}




#[tauri::command]
async fn insert_case(case: PocCase) -> RResult<std::result::Result<rbatis::rbdc::db::ExecResult, rbatis::rbdc::Error>> {
    let result: Result<Result<rbatis::rbdc::db::ExecResult, rbatis::rbdc::Error>, rbatis::rbdc::Error> = entities::case::add(case).await;
    result
}

#[tauri::command]
async fn query_case_list(case: PocCase, current: u64, size: u64) -> RResult<PageResult<PocCase>>{
    let result = entities::case::query(case, current, size).await;
    result
}

#[tauri::command]
async fn update_case(case: PocCase) -> RResult<std::result::Result<rbatis::rbdc::db::ExecResult, rbatis::rbdc::Error>> {
    let result = entities::case::update(case).await;
    result
}

#[tauri::command]
async fn delete_case(case: PocCase) -> RResult<std::result::Result<rbatis::rbdc::db::ExecResult, rbatis::rbdc::Error>> {
    let result = entities::case::delete(case).await;
    result
}


#[tauri::command]
async fn insert_metric(metric: PocMetric) -> RResult<std::result::Result<rbatis::rbdc::db::ExecResult, rbatis::rbdc::Error>> {
    let result = entities::metric::add(metric).await;
    result
}






fn main() {
  tauri::Builder::default().setup(|app| {
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


    Ok({}
    )})
    .invoke_handler(tauri::generate_handler![download_file, insert_category, query_category_list, update_category, delete_category, query_category_all, insert_case, query_case_list, update_case, delete_case, insert_metric])
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