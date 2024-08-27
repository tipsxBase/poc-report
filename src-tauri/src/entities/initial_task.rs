use anyhow::anyhow;
use rbatis::{
    crud, dark_std::defer, executor::Executor, html_sql, htmlsql_select_page, rbdc::db::ExecResult,
    Page, PageRequest, RBatis,
};

use super::{shared_types::EntityResult, PageResult};

#[derive(serde::Serialize, serde::Deserialize, Debug)]
pub struct PocInitialTask {
    pub task_id: Option<u64>,
    pub category_id: Option<i64>,
    pub category_name: Option<String>,
    pub task_name: Option<String>,
    pub task_description: Option<String>,
    pub task_config: Option<String>,
}

crud!(PocInitialTask {});

htmlsql_select_page!(select_list_page(task: &PocInitialTask) -> PocInitialTask => "mapper/initial_task.html");

#[html_sql("mapper/initial_task.html")]
async fn insert(rb: &dyn Executor, args: &PocInitialTask) -> ExecResult {
    impled!()
}

async fn init_rb() -> EntityResult<RBatis> {
    let rb: RBatis = RBatis::new();

    let driver_url = shared::sqlite::get_driver_url();
    rb.init(rbdc_sqlite::driver::SqliteDriver {}, &driver_url)
        .map_err(|e| {
            eprintln!("Failed to initialize RBatis: {}", e);
            // Return a suitable error result
            anyhow::Error::msg(e.to_string())
        })?;
    Ok(rb)
}

pub async fn add(task: PocInitialTask) -> EntityResult<ExecResult> {
    _ = fast_log::init(
        fast_log::Config::new()
            .console()
            .level(log::LevelFilter::Debug),
    );
    defer!(|| {
        log::logger().flush();
    });

    let rb = init_rb().await?;

    let table: PocInitialTask = PocInitialTask {
        task_id: None,
        category_id: task.category_id,
        category_name: None,
        task_name: task.task_name,
        task_description: task.task_description,
        task_config: task.task_config,
    };
    log::debug!("table {:?}", table);
    let data = insert(&rb, &table).await?;
    Ok(data)
}

pub async fn query(
    mut task: PocInitialTask,
    current: u64,
    size: u64,
) -> EntityResult<PageResult<PocInitialTask>> {
    _ = fast_log::init(
        fast_log::Config::new()
            .console()
            .level(log::LevelFilter::Debug),
    );
    defer!(|| {
        log::logger().flush();
    });

    let rb = init_rb().await?;

    task.task_name = shared::util::like_pattern(&task.task_name);

    let data: Page<PocInitialTask> =
        select_list_page(&rb, &PageRequest::new(current, size), &task).await?;

    let page_result = PageResult {
        records: data.records,
        total: data.total,
        page_no: data.page_no,
        page_size: data.page_size,
    };
    Ok(page_result)
}

pub async fn delete(task: PocInitialTask) -> EntityResult<ExecResult> {
    _ = fast_log::init(
        fast_log::Config::new()
            .console()
            .level(log::LevelFilter::Debug),
    );
    defer!(|| {
        log::logger().flush();
    });

    let rb: RBatis = init_rb().await?;

    let task_id = task
        .task_id
        .ok_or_else(|| anyhow!("task_id cannot be null"))?;

    let data = PocInitialTask::delete_by_column(&rb, "task_id", task_id).await?;
    Ok(data)
}

pub async fn update(task: PocInitialTask) -> EntityResult<ExecResult> {
    _ = fast_log::init(
        fast_log::Config::new()
            .console()
            .level(log::LevelFilter::Debug),
    );
    defer!(|| {
        log::logger().flush();
    });

    let rb = init_rb().await?;

    let data = PocInitialTask::update_by_column(&rb, &task, "task_id").await?;
    Ok(data)
}
