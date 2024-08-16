use rbatis::{
    dark_std::defer, executor::Executor, html_sql, htmlsql_select_page, plugin::page::PageRequest,
    Page, RBatis,
};

use crate::entities::PageResult;

use super::shared_types::RResult;

#[derive(serde::Serialize, serde::Deserialize, Clone, Debug)]
pub struct PocServer {
    pub server_id: Option<i64>,
    pub server_name: Option<String>,
    pub host: Option<String>,
    pub port: Option<i32>,
    pub username: Option<String>,
    pub password: Option<String>,
    pub is_default: Option<Option<i8>>,
    pub initial_state: Option<Option<i8>>,
    pub working_directory: Option<String>,
}

#[html_sql("mapper/server.html")]
async fn insert(rb: &dyn Executor, args: &PocServer) -> rbatis::rbdc::db::ExecResult {
    impled!()
}

htmlsql_select_page!(select_list(server: &PocServer) -> PocServer => "mapper/server.html");

#[html_sql("mapper/server.html")]
async fn select_all(rb: &dyn Executor) -> Vec<PocServer> {
    impled!()
}

#[html_sql("mapper/server.html")]
async fn update_by_id(rb: &dyn Executor, server: &PocServer) -> rbatis::rbdc::db::ExecResult {
    impled!()
}

#[html_sql("mapper/server.html")]
async fn delete_by_id(rb: &dyn Executor, server_id: i64) -> rbatis::rbdc::db::ExecResult {
    impled!()
}

#[html_sql("mapper/server.html")]
async fn update_check_default_by_id(
    rb: &dyn Executor,
    server_id: i64,
) -> rbatis::rbdc::db::ExecResult {
    impled!()
}

#[html_sql("mapper/server.html")]
async fn select_by_id(rb: &dyn Executor, server_id: i64) -> PocServer {
    impled!()
}

#[html_sql("mapper/server.html")]
async fn select_default(rb: &dyn Executor) -> PocServer {
    impled!()
}

#[html_sql("mapper/server.html")]
async fn update_initial_state_by_id(
    rb: &dyn Executor,
    server_id: i64,
    initial_state: i8,
) -> rbatis::rbdc::db::ExecResult {
    impled!()
}

pub async fn add(server: PocServer) -> RResult<rbatis::rbdc::db::ExecResult> {
    _ = fast_log::init(
        fast_log::Config::new()
            .console()
            .level(log::LevelFilter::Debug),
    );
    defer!(|| {
        log::logger().flush();
    });

    let rb = RBatis::new();

    let database = shared::sqlite::get_database_path();
    let mut url = String::from("sqlite://");
    url.push_str(&database);

    rb.init(rbdc_sqlite::driver::SqliteDriver {}, &url).unwrap();

    let table: PocServer = PocServer {
        server_id: None,
        server_name: server.server_name,
        host: server.host,
        port: server.port,
        username: server.username,
        password: server.password,
        working_directory: server.working_directory,
        is_default: None,
        initial_state: None,
    };
    let data = insert(&rb, &table).await.unwrap();
    Ok(data)
}

pub async fn query(server: PocServer, current: u64, size: u64) -> RResult<PageResult<PocServer>> {
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
        .unwrap();
    let data: Page<PocServer> = select_list(&rb, &PageRequest::new(current, size), &server)
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

pub async fn query_all_servers() -> RResult<Vec<PocServer>> {
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
        .unwrap();
    let data = select_all(&rb).await?;
    Ok(data)
}

pub async fn delete(server: PocServer) -> RResult<rbatis::rbdc::db::ExecResult> {
    _ = fast_log::init(
        fast_log::Config::new()
            .console()
            .level(log::LevelFilter::Debug),
    );
    defer!(|| {
        log::logger().flush();
    });

    let rb = RBatis::new();

    let database = shared::sqlite::get_database_path();
    let mut url = String::from("sqlite://");
    url.push_str(&database);

    rb.init(rbdc_sqlite::driver::SqliteDriver {}, &url).unwrap();
    let data = delete_by_id(&rb, server.server_id.unwrap()).await.unwrap();
    Ok(data)
}

pub async fn update(server: PocServer) -> RResult<rbatis::rbdc::db::ExecResult> {
    _ = fast_log::init(
        fast_log::Config::new()
            .console()
            .level(log::LevelFilter::Debug),
    );
    defer!(|| {
        log::logger().flush();
    });

    let rb = RBatis::new();

    let database = shared::sqlite::get_database_path();
    let mut url = String::from("sqlite://");
    url.push_str(&database);

    rb.init(rbdc_sqlite::driver::SqliteDriver {}, &url).unwrap();
    let data = update_by_id(&rb, &server).await.unwrap();
    Ok(data)
}

pub async fn update_check(server_id: i64) -> RResult<rbatis::rbdc::db::ExecResult> {
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
        .unwrap();

    let data = update_check_default_by_id(&rb, server_id).await.unwrap();
    Ok(data)
}

pub async fn select_server_by_id(server_id: i64) -> PocServer {
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
        .unwrap();

    let data = select_by_id(&rb, server_id).await.unwrap();
    data
}

pub async fn select_default_server() -> RResult<PocServer> {
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
        .unwrap();

    let data = select_default(&rb).await;
    data
}

pub async fn update_server_initial_state(
    server_id: i64,
    initial_state: i8,
) -> RResult<rbatis::rbdc::db::ExecResult> {
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
        .unwrap();

    let data = update_initial_state_by_id(&rb, server_id, initial_state).await?;
    Ok(data)
}
