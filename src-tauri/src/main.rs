// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Manager;
use std::fs::File;
use std::io::Write;


#[tauri::command]
fn download_file(fileName: String, content: String) -> Result<(), String> {
  let mut file = File::create(fileName).map_err(|e| e.to_string())?;
  file.write_all(content.as_bytes()).map_err(|e| e.to_string())?;
  Ok(())
}



fn main() {
  tauri::Builder::default().setup(|app| {
    #[cfg(debug_assertions)]
    {
        let window = app.get_window("main").unwrap();
        window.open_devtools();
    }
    Ok({}
    )})
    .plugin(tauri_plugin_sqlite::init())
    .invoke_handler(tauri::generate_handler![download_file])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}


