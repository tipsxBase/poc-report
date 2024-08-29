use futures::StreamExt;
use shared::util::is_empty;
use std::{fs::File, io::Write};
use tauri::VERSION;
use zip::{write::SimpleFileOptions, ZipWriter};

use crate::{
    entities::{
        self,
        resource::PocResource,
        shared_types::{CommandResult, Response},
        task::{get_task_status, get_task_type, PocTask, PocTaskStatus, PocTaskType},
    },
    request, shell,
};

#[tauri::command]
pub async fn query_resource_list() -> CommandResult<Vec<PocResource>> {
    match entities::resource::query_all().await {
        Ok(data) => Ok(Response {
            message: String::from("success"),
            success: true,
            data: Some(data),
        }),
        Err(err) => Err(Response {
            message: err.to_string(),
            success: false,
            data: None,
        }),
    }
}
#[tauri::command]
pub async fn download_zip(file_dir: String, zip_name: String) -> CommandResult<String> {
    tauri::async_runtime::spawn(async move {
        // 创建任务
        let task = PocTask {
            task_id: None,
            task_name: Some(zip_name.clone()),
            task_status: get_task_status(PocTaskStatus::NotStarted),
            task_type: get_task_type(PocTaskType::DownloadTask),
            task_progress: Some(0.0),
            task_payload: None,
        };

        // 插入任务到数据库并获取任务ID
        let last_insert_id = match entities::task::add_task(task).await {
            Ok(result) => result.last_insert_id.as_u64(),
            Err(err) => {
                println!("创建任务失败: {}", err);
                None
            }
        };

        if is_empty(&last_insert_id) {
            return;
        }

        // 创建 zip 文件
        let file_path = format!("{}/{}.zip", file_dir, zip_name);
        let file = match File::create(&file_path) {
            Ok(f) => f,
            Err(err) => {
                println!("创建 zip 文件失败: {}", err);
                update_task_status(last_insert_id, PocTaskStatus::Failed, Some(0.0))
                    .await
                    .unwrap();
                return;
            }
        };

        let mut zip = ZipWriter::new(file);
        let options = SimpleFileOptions::default()
            .compression_method(zip::CompressionMethod::Stored)
            .unix_permissions(0o755);

        // 查询所有资源
        let resources = match entities::resource::query_all().await {
            Ok(data) => data,
            Err(err) => {
                println!("查询资源失败: {}", err);
                let _ = update_task_status(last_insert_id, PocTaskStatus::Failed, Some(0.0)).await;
                return;
            }
        };

        let total_resources = resources.len() as f64;

        // 下载并写入每个资源到 ZIP 文件
        for (index, resource) in resources.iter().enumerate() {
            if let Some(url) = &resource.resource_url {
                match request::get_by_url_safe(url).await {
                    Ok(response) => {
                        let file_name = resource
                            .resource_name
                            .as_deref()
                            .unwrap_or("unnamed")
                            .to_string();

                        // 开始写入文件到 ZIP
                        if let Err(err) = zip.start_file(file_name, options) {
                            let _ = update_task_status(
                                last_insert_id,
                                PocTaskStatus::Failed,
                                Some(0.0),
                            )
                            .await;
                            eprintln!("启动 zip 文件失败: {}", err);
                            return;
                        }

                        let mut stream = response.bytes_stream();
                        while let Some(chunk) = stream.next().await {
                            let chunk = match chunk {
                                Ok(chunk) => chunk,
                                Err(err) => {
                                    let _ = update_task_status(
                                        last_insert_id,
                                        PocTaskStatus::Failed,
                                        Some(0.0),
                                    )
                                    .await;
                                    eprintln!("获取数据 chunk 失败: {}", err);
                                    return;
                                }
                            };

                            // 将数据写入 ZIP
                            if let Err(err) = zip.write_all(&chunk) {
                                let _ = update_task_status(
                                    last_insert_id,
                                    PocTaskStatus::Failed,
                                    Some(0.0),
                                )
                                .await;
                                eprintln!("写入 zip 文件失败: {}", err);
                                return;
                            }
                        }
                        // 更新任务进度
                        let progress = (index as f64 + 1.0) / total_resources;
                        if let Err(err) = update_task_status(
                            last_insert_id,
                            PocTaskStatus::InProgress,
                            Some(progress),
                        )
                        .await
                        {
                            eprintln!("更新任务进度失败: {}", err);
                        }
                    }
                    Err(err) => {
                        let _ =
                            update_task_status(last_insert_id, PocTaskStatus::Failed, Some(0.0))
                                .await;
                        eprintln!("下载资源失败: {}", err);
                        return;
                    }
                }
            } else {
                let _ = update_task_status(last_insert_id, PocTaskStatus::Failed, Some(0.0)).await;
                eprintln!("资源 URL 缺失");
                return;
            }
        }

        // 完成 ZIP 文件
        if let Err(err) = zip.finish() {
            let _ = update_task_status(last_insert_id, PocTaskStatus::Failed, Some(0.0)).await;
            eprintln!("完成 zip 文件失败: {}", err);
            return;
        }

        // 更新任务为已完成
        if let Err(err) =
            update_task_status(last_insert_id, PocTaskStatus::Completed, Some(1.0)).await
        {
            eprintln!("更新任务状态失败: {}", err);
        }
    });

    Ok(Response {
        message: String::from("文件开始下载，请在任务中心查看"),
        success: true,
        data: Some(String::from("文件开始下载，请在任务中心查看")),
    })
}

// 更新任务状态的辅助函数
async fn update_task_status(
    task_id: Option<u64>,
    status: PocTaskStatus,
    progress: Option<f64>,
) -> Result<(), String> {
    let _ = entities::task::update_task(PocTask {
        task_id,
        task_status: get_task_status(status),
        task_progress: progress,
        task_name: None,
        task_type: None,
        task_payload: None,
    })
    .await
    .map_err(|err| format!("更新任务状态失败: {}", err));
    Ok(())
}

#[tauri::command]
pub async fn upload_resource_by_sftp(url: String, file_name: String) -> CommandResult<String> {
    let server = match entities::server::select_default_server().await {
        Ok(s) => s,
        Err(_) => {
            return Ok(Response {
                message: format!("请先指定默认环境"),
                success: false,
                data: Some(format!("请先指定默认环境")),
            });
        }
    };

    if is_empty(&server) {
        return Ok(Response {
            message: format!("请先指定默认环境"),
            success: false,
            data: Some(format!("请先指定默认环境")),
        });
    }
    tauri::async_runtime::spawn(async move {
        let session = shell::create_session(
            &server.host.unwrap(),
            server.port.unwrap(),
            &server.username.unwrap(),
            &server.password.unwrap(),
        )
        .expect("创建会话失败");

        let sftp = session.sftp().expect("创建sftp失败");
        let working_directory = server.working_directory.unwrap_or(String::from("poc"));

        let _ = shell::download_and_upload_sftp(
            url.as_str(),
            &sftp,
            &file_name,
            format!("{}/{}", working_directory, file_name).as_str(),
        )
        .await;
    });

    Ok(Response {
        message: format!("创建上传任务成功"),
        success: true,
        data: Some(format!("创建上传任务成功")),
    })
}
