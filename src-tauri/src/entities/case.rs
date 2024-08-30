use anyhow::Error;
use rbatis::{
    crud, dark_std::defer, executor::Executor, html_sql, htmlsql_select_page, impl_select,
    plugin::page::PageRequest, Page, RBatis,
};

use crate::entities::PageResult;

use super::shared_types::RResult;

#[derive(serde::Serialize, serde::Deserialize, Clone)]
pub struct PocCase {
    pub case_id: Option<i64>,
    pub category_id: Option<i64>,
    pub category_name: Option<String>,
    pub category_type: Option<i8>,
    pub case_name: Option<String>,
    pub case_content: Option<String>,
    pub case_description: Option<String>,
    pub case_order: Option<i64>,
    pub server_id: Option<i64>,
}

crud!(PocCase {});

impl_select!(PocCase{select_by_id(case_id: i64) -> Option => "`where case_id = #{case_id} limit 1`"});

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

#[html_sql("mapper/case.html")]
async fn max_case_order(rb: &dyn Executor) -> i64 {
    impled!()
}

#[html_sql("mapper/case.html")]
async fn select_next(rb: &dyn Executor, case: &PocCase, case_order: i64) -> PocCase {
    impled!()
}

#[html_sql("mapper/case.html")]
async fn select_prev(rb: &dyn Executor, case: &PocCase, case_order: i64) -> PocCase {
    impled!()
}

#[html_sql("mapper/case.html")]
async fn update_order_by_id(
    rb: &dyn Executor,
    case: &PocCase,
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

    let current_order = max_case_order(&rb).await.unwrap_or(0);

    let table: PocCase = PocCase {
        case_id: None,
        category_id: case.category_id,
        category_type: None,
        category_name: None,
        case_name: case.case_name,
        case_content: case.case_content,
        case_description: case.case_description,
        case_order: Some(current_order + 1),
        server_id: case.server_id,
    };

    let data = insert(&rb, &table).await;
    Ok(data)
}

pub async fn query(mut case: PocCase, current: u64, size: u64) -> RResult<PageResult<PocCase>> {
    _ = fast_log::init(
        fast_log::Config::new()
            .console()
            .level(log::LevelFilter::Debug),
    );
    defer!(|| {
        log::logger().flush();
    });

    let rb = RBatis::new();

    let get_driver_url = shared::sqlite::get_driver_url();

    rb.init(rbdc_sqlite::driver::SqliteDriver {}, &get_driver_url)
        .unwrap();

    case.case_name = shared::util::like_pattern(&case.case_name);

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

pub async fn reset_order(
    case_id: i64,
    search_case: PocCase,
    direction: String,
) -> Result<(), Error> {
    _ = fast_log::init(
        fast_log::Config::new()
            .console()
            .level(log::LevelFilter::Debug),
    );
    defer!(|| {
        log::logger().flush();
    });

    let rb = RBatis::new();

    let drive_url = shared::sqlite::get_driver_url();
    rb.init(rbdc_sqlite::driver::SqliteDriver {}, &drive_url)
        .unwrap();

    let mut case = match PocCase::select_by_id(&rb, case_id).await {
        Ok(case) => case.expect("msg"),
        Err(err) => return Err(Error::msg(String::from(err.to_string()))),
    };

    let case_order = case.case_order.unwrap_or(0);

    if &direction == "backward" {
        let mut next_case = match select_next(&rb, &search_case, case_order).await {
            Ok(case) => case,
            Err(_) => return Err(Error::msg(String::from("当前记录已经在最后，无法下移"))),
        };
        case.case_order = next_case.case_order;
        next_case.case_order = Some(case_order);

        let _ = update_order_by_id(&rb, &case).await;
        let _ = update_order_by_id(&rb, &next_case).await;
    } else if &direction == "forward" {
        let mut next_case = match select_prev(&rb, &search_case, case_order).await {
            Ok(case) => case,
            Err(_) => return Err(Error::msg(String::from("当前记录已经在最前面，无法上移"))),
        };
        case.case_order = next_case.case_order;
        next_case.case_order = Some(case_order);

        let _ = update_order_by_id(&rb, &case).await;
        let _ = update_order_by_id(&rb, &next_case).await;
    }

    Ok(())
}
