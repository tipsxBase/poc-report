// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use refinery::Migration;
use rusqlite::Connection;

use tauri::Manager;
pub mod command;
pub mod entities;
pub mod request;
pub mod shell;

refinery::embed_migrations!("migrations");

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
            command::common::download_file,
            command::category::insert_category,
            command::category::query_category_list,
            command::category::update_category,
            command::category::delete_category,
            command::category::query_category_all,
            command::case::insert_case,
            command::case::query_case_list,
            command::case::update_case,
            command::case::delete_case,
            command::case::run_case,
            command::case::download_image,
            command::case::reset_order,
            command::metric::insert_metric,
            command::metric::select_metric,
            command::statics::insert_statics,
            command::statics::select_statics,
            command::server::insert_server,
            command::server::query_all_server_list,
            command::server::query_server_list,
            command::server::update_server,
            command::server::delete_server,
            command::server::update_server_check_default,
            command::server::server_init,
            command::ddl::insert_ddl,
            command::ddl::query_ddl_list,
            command::ddl::update_ddl,
            command::ddl::delete_ddl,
            command::ddl::upload_ddl,
            command::resource::query_resource_list,
            command::resource::download_zip,
            command::resource::upload_resource_by_sftp,
            command::task::download_file_from_oss,
            command::task::query_task_list,
            command::task::delete_completed_task,
            command::task::delete_by_id,
            command::initial_task::insert_initial_task,
            command::initial_task::query_initial_task_list,
            command::initial_task::update_initial_task,
            command::initial_task::delete_initial_task
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
