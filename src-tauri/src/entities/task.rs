use anyhow::anyhow;
use rbatis::{
    crud, dark_std::defer, executor::Executor, html_sql, htmlsql_select_page, rbdc::db::ExecResult,
    Page, PageRequest, RBatis,
};

use super::{shared_types::RResult, PageResult};

pub enum PocTaskStatus {
    NotStarted,
    InProgress,
    Completed,
    Failed,
}

pub enum PocTaskType {
    DownloadTask,
    UploadTask,
}

pub fn get_task_status(status: PocTaskStatus) -> Option<i8> {
    match status {
        PocTaskStatus::Failed => Some(0),
        PocTaskStatus::NotStarted => Some(1),
        PocTaskStatus::InProgress => Some(2),
        PocTaskStatus::Completed => Some(3),
    }
}

pub fn get_task_type(task_type: PocTaskType) -> Option<i8> {
    match task_type {
        PocTaskType::DownloadTask => Some(0),
        PocTaskType::UploadTask => Some(1),
    }
}

#[derive(serde::Serialize, serde::Deserialize, Debug)]
pub struct PocTask {
    pub task_id: Option<u64>,
    pub task_name: Option<String>,
    pub task_status: Option<i8>,
    pub task_progress: Option<f64>,
    pub task_type: Option<i8>,
    pub task_payload: Option<String>,
}

htmlsql_select_page!(select_list(task: &PocTask) -> PocTask => "mapper/task.html");
crud!(PocTask {});

#[html_sql("mapper/task.html")]
async fn delete_completed_task_impl(
    rb: &dyn Executor,
) -> std::result::Result<rbatis::rbdc::db::ExecResult, rbatis::rbdc::Error> {
    impled!()
}

#[html_sql("mapper/task.html")]
async fn delete_task_by_id_impl(
    rb: &dyn Executor,
    task_id: u64,
) -> std::result::Result<rbatis::rbdc::db::ExecResult, rbatis::rbdc::Error> {
    impled!()
}

pub async fn add_task(task: PocTask) -> Result<ExecResult, anyhow::Error> {
    _ = fast_log::init(
        fast_log::Config::new()
            .console()
            .level(log::LevelFilter::Debug),
    );
    defer!(|| {
        log::logger().flush();
    });

    let rb = RBatis::new();

    let driver_url = shared::sqlite::get_driver_url();

    rb.init(rbdc_sqlite::driver::SqliteDriver {}, &driver_url)
        .map_err(|err| anyhow!(err.to_string()))?;

    let table: PocTask = PocTask {
        task_id: None,
        task_name: task.task_name,
        task_status: task.task_status,
        task_progress: task.task_progress,
        task_type: task.task_type,
        task_payload: None,
    };
    let data = PocTask::insert(&rb, &table)
        .await
        .map_err(|err| anyhow!(err.to_string()))?;
    Ok(data)
}

pub async fn update_task(task: PocTask) -> Result<ExecResult, anyhow::Error> {
    _ = fast_log::init(
        fast_log::Config::new()
            .console()
            .level(log::LevelFilter::Debug),
    );
    defer!(|| {
        log::logger().flush();
    });

    let rb = RBatis::new();

    let driver_url = shared::sqlite::get_driver_url();

    rb.init(rbdc_sqlite::driver::SqliteDriver {}, &driver_url)
        .map_err(|err| anyhow!(err.to_string()))?;

    let data = PocTask::update_by_column(&rb, &task, "task_id")
        .await
        .map_err(|err| anyhow!(err.to_string()))?;
    Ok(data)
}

pub async fn query_page(task: PocTask, current: u64, size: u64) -> RResult<PageResult<PocTask>> {
    _ = fast_log::init(
        fast_log::Config::new()
            .console()
            .level(log::LevelFilter::Debug),
    );
    defer!(|| {
        log::logger().flush();
    });

    log::debug!("query_page查询参数{:?}", task);

    let rb = RBatis::new();

    let database = shared::sqlite::get_database_path();
    let mut url = String::from("sqlite://");
    url.push_str(&database);

    rb.init(rbdc_sqlite::driver::SqliteDriver {}, &url).unwrap();
    let data: Page<PocTask> = select_list(&rb, &PageRequest::new(current, size), &task)
        .await
        .unwrap();

    let page_result = PageResult {
        records: data.records,
        total: data.total,
        page_no: data.page_no,
        page_size: data.page_size,
    };
    Ok(page_result)
}

pub async fn delete_completed_task() -> Result<ExecResult, anyhow::Error> {
    _ = fast_log::init(
        fast_log::Config::new()
            .console()
            .level(log::LevelFilter::Debug),
    );
    defer!(|| {
        log::logger().flush();
    });

    let rb = RBatis::new();

    let driver_url = shared::sqlite::get_driver_url();

    rb.init(rbdc_sqlite::driver::SqliteDriver {}, &driver_url)
        .map_err(|err| anyhow!(err.to_string()))?;

    let data = delete_completed_task_impl(&rb)
        .await
        .map_err(|err| anyhow!(err.to_string()))?;
    Ok(data)
}

pub async fn delete_by_id(task_id: u64) -> Result<ExecResult, anyhow::Error> {
    _ = fast_log::init(
        fast_log::Config::new()
            .console()
            .level(log::LevelFilter::Debug),
    );
    defer!(|| {
        log::logger().flush();
    });

    let rb = RBatis::new();

    let driver_url = shared::sqlite::get_driver_url();

    rb.init(rbdc_sqlite::driver::SqliteDriver {}, &driver_url)
        .map_err(|err| anyhow!(err.to_string()))?;

    let data = delete_task_by_id_impl(&rb, task_id)
        .await
        .map_err(|err| anyhow!(err.to_string()))?;
    Ok(data)
}
