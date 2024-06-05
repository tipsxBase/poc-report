use std::{
    io::{Read, Write},
    net::TcpStream,
    path::Path,
};

use crate::request;
use futures::StreamExt;
use ssh2::{Error, Session, Sftp};

pub fn create_session(host: &str, port: i32, username: &str, password: &str) -> Session {
    let ip = format!("{}:{}", &host, &port);

    let tcp = TcpStream::connect(&ip).unwrap();
    let mut session: Session = Session::new().unwrap();
    session.set_tcp_stream(tcp);
    session.handshake().unwrap();
    session.userauth_password(username, password).unwrap();
    session
}

pub fn exec_command(session: &Session, command: &str) -> i32 {
    let mut channel = session.channel_session().unwrap();
    channel.exec(command).unwrap();
    let mut s = String::new();
    channel.read_to_string(&mut s).unwrap();
    println!("{} -> {}", command, s);
    let _ = channel.wait_close();
    channel.exit_status().unwrap()
}

fn create_sftp(session: &Session) -> Result<Sftp, Error> {
    session.sftp()
}

pub fn upload_case(session: &Session, path: &str, content: &str) -> i32 {
    let u_bytes = content.as_bytes();
    let size = u_bytes.len() as u64;
    let mut remote_file = session
        .scp_send(Path::new(path), 0o644, size, None)
        .unwrap();
    println!("{}", content);
    remote_file.write_all(u_bytes).unwrap();
    remote_file.send_eof().unwrap();
    remote_file.wait_eof().unwrap();
    remote_file.close().unwrap();
    remote_file.wait_close().unwrap();
    remote_file.exit_status().unwrap()
}

pub fn sftp_directory_is_exist(sftp: &Sftp, dirname: &Path) -> bool {
    match sftp.opendir(dirname) {
        Ok(_) => {
            println!("{:?}存在", dirname);
            true
        }
        Err(e) => {
            eprintln!("{:?}", e);
            false
        }
    }
}
pub async fn download_and_upload_sftp(
    url: &str,
    sftp: &Sftp,
    remote_path: &str,
) -> Result<(), Box<dyn std::error::Error>> {
    let response = request::get_by_url(url).await;
    let mut remote_file = sftp.create(Path::new(remote_path))?;
    // 从下载流中读取数据并写入远程文件
    let mut stream = response.bytes_stream();

    while let Some(chunk) = stream.next().await {
        let chunk = chunk?;
        remote_file.write_all(&chunk)?;
    }
    remote_file.flush()?;
    Ok(())
}
