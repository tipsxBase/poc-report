use std::{
    io::{Read, Write},
    net::TcpStream,
    path::Path,
};

use crate::{
    entities::{
        self,
        task::{get_task_status, get_task_type, PocTask, PocTaskStatus, PocTaskType},
    },
    request,
};
use futures::StreamExt;
use ssh2::{Session, Sftp};

pub fn create_session(
    host: &str,
    port: i32,
    username: &str,
    password: &str,
) -> Result<Session, ssh2::Error> {
    let ip = format!("{}:{}", &host, &port);

    let tcp = TcpStream::connect(&ip).unwrap();
    let mut session: Session = Session::new().unwrap();
    session.set_tcp_stream(tcp);
    session.handshake().unwrap();
    let _ = session.userauth_password(username, password);
    if session.authenticated() {
        Ok(session)
    } else {
        println!("认证失败");
        Err(ssh2::Error::from_session_error(&session, 60)) // Authentication failed
    }
}

pub fn exec_command(session: &Session, command: &str) -> i32 {
    let mut channel = session.channel_session().unwrap();
    channel.exec(command).unwrap();
    let mut s = String::new();
    channel.read_to_string(&mut s).unwrap();
    let _ = channel.wait_close();
    channel.exit_status().unwrap()
}

pub fn upload_content(session: &Session, path: &str, content: &str) -> i32 {
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
    sftp.stat(dirname).is_ok()
}
pub async fn download_and_upload_sftp(
    url: &str,
    sftp: &Sftp,
    file_name: &str,
    remote_path: &str,
) -> Result<(), Box<dyn std::error::Error>> {
    let task = PocTask {
        task_id: None,
        task_name: Some(format!("{}", file_name)),
        task_status: get_task_status(PocTaskStatus::NotStarted),
        task_type: get_task_type(PocTaskType::UploadTask),
        task_progress: Some(0.0),
        task_payload: None,
    };
    let last_insert_id = match entities::task::add_task(task).await {
        Ok(res) => res.last_insert_id.as_u64(),
        Err(err) => {
            println!("创建任务失败: {}", err);
            None
        }
    };

    let response = request::get_by_url(url).await;
    let content_length = match response.content_length() {
        Some(content_length) => content_length,
        _ => 0,
    };
    println!("content_length: {}", content_length);
    let mut uploaded_length: usize = 0;
    let mut remote_file = sftp.create(Path::new(remote_path))?;
    // 从下载流中读取数据并写入远程文件
    let mut stream = response.bytes_stream();

    while let Some(chunk) = stream.next().await {
        let chunk = chunk?;
        println!("chunk{}", chunk.len());
        uploaded_length += chunk.len();
        match remote_file.write_all(&chunk).map_err(|e| e.to_string()) {
            Ok(_) => {
                entities::task::update_task(PocTask {
                    task_id: last_insert_id,
                    task_status: get_task_status(PocTaskStatus::InProgress),
                    task_progress: Some(uploaded_length as f64 / content_length as f64),
                    task_name: None,
                    task_type: None,
                    task_payload: None,
                })
                .await
                .unwrap();
            }
            Err(_) => {
                entities::task::update_task(PocTask {
                    task_id: last_insert_id,
                    task_status: get_task_status(PocTaskStatus::Failed),
                    task_progress: Some(uploaded_length as f64 / content_length as f64),
                    task_name: None,
                    task_type: None,
                    task_payload: None,
                })
                .await
                .unwrap();
            }
        }
    }
    match remote_file.flush() {
        Ok(_) => {
            entities::task::update_task(PocTask {
                task_id: last_insert_id,
                task_status: get_task_status(PocTaskStatus::Completed),
                task_progress: Some(1.0),
                task_name: None,
                task_type: None,
                task_payload: None,
            })
            .await
            .unwrap();
        }
        Err(err) => {
            println!("{}", err);
            entities::task::update_task(PocTask {
                task_id: last_insert_id,
                task_status: get_task_status(PocTaskStatus::Failed),
                task_progress: None,
                task_name: None,
                task_type: None,
                task_payload: None,
            })
            .await
            .unwrap();
        }
    }

    Ok(())
}
