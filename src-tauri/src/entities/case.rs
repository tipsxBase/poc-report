use rbatis::{
    dark_std::defer, executor::Executor, html_sql, htmlsql_select_page, plugin::page::PageRequest,
    Page, RBatis,
};

use crate::entities::PageResult;

use super::shared_types::RResult;

#[derive(serde::Serialize, serde::Deserialize, Clone)]
pub struct PocCase {
    pub case_id: Option<i64>,
    pub category_id: Option<i64>,
    pub category_name: Option<String>,
    pub case_name: Option<String>,
    pub case_content: Option<String>,
}

#[html_sql("mapper/case.html")]
async fn insert(
    rb: &dyn Executor,
    args: &PocCase,
) -> std::result::Result<rbatis::rbdc::db::ExecResult, rbatis::rbdc::Error> {
    impled!()
}

htmlsql_select_page!(select_list(case: &PocCase) -> PocCase => "mapper/case.html");

#[html_sql("mapper/case.html")]
async fn update_by_id(
    rb: &dyn Executor,
    case: &PocCase,
) -> std::result::Result<rbatis::rbdc::db::ExecResult, rbatis::rbdc::Error> {
    impled!()
}

#[html_sql("mapper/case.html")]
async fn delete_by_id(
    rb: &dyn Executor,
    case_id: i64,
) -> std::result::Result<rbatis::rbdc::db::ExecResult, rbatis::rbdc::Error> {
    impled!()
}

pub async fn add(
    case: PocCase,
) -> RResult<std::result::Result<rbatis::rbdc::db::ExecResult, rbatis::rbdc::Error>> {
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

    let table: PocCase = PocCase {
        case_id: None,
        category_id: case.category_id,
        category_name: None,
        case_name: case.case_name,
        case_content: case.case_content,
    };
    let data = insert(&rb, &table).await;
    Ok(data)
}

pub async fn query(case: PocCase, current: u64, size: u64) -> RResult<PageResult<PocCase>> {
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
    let data: Page<PocCase> = select_list(&rb, &PageRequest::new(current, size), &case)
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

pub async fn delete(
    case: PocCase,
) -> RResult<std::result::Result<rbatis::rbdc::db::ExecResult, rbatis::rbdc::Error>> {
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
    let data = delete_by_id(&rb, case.case_id.unwrap()).await;
    Ok(data)
}

pub async fn update(
    case: PocCase,
) -> RResult<std::result::Result<rbatis::rbdc::db::ExecResult, rbatis::rbdc::Error>> {
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
    let data = update_by_id(&rb, &case).await;
    Ok(data)
}
