use std::{fs::File, io::Write};

#[tauri::command]
pub fn download_file(file_name: String, content: String) -> Result<(), String> {
    let mut file = File::create(file_name).map_err(|e| e.to_string())?;
    file.write_all(content.as_bytes())
        .map_err(|e| e.to_string())?;
    Ok(())
}
