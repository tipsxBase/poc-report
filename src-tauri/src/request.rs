use std::{io::Write, path::Path};

use reqwest::Error;
use ssh2::Session;

pub async fn upload_jar(session: &Session, path: &str) -> Result<bool, Error> {
    let response = reqwest::get("https://hexadb-fe.tos-cn-beijing.volces.com/hexadb-poc.jar")
        .await?
        .bytes()
        .await?;
    let size = response.len() as u64;
    let mut remote_file = session
        .scp_send(Path::new(path), 0o644, size, None)
        .unwrap();
    remote_file.write_all(&response.as_ref()).unwrap();
    // Close the channel and wait for the whole content to be transferred
    remote_file.send_eof().unwrap();
    remote_file.wait_eof().unwrap();
    remote_file.close().unwrap();
    remote_file.wait_close().unwrap();
    Ok(true)
}
