use rbatis::{
    dark_std::defer, executor::Executor, html_sql, htmlsql_select_page, plugin::page::PageRequest,
    snowflake::new_snowflake_id, Page, RBatis,
};
use shared::util::like_pattern;

use crate::entities::PageResult;

use super::{
    server::PocServer,
    shared_types::{EntityResult, RResult},
};

pub enum CategoryType {
    BuiltIn,
    UserDefine,
}

fn get_category_type_value(category_type: CategoryType) -> Option<i8> {
    match category_type {
        CategoryType::BuiltIn => Some(1),
        CategoryType::UserDefine => Some(2),
    }
}

#[derive(serde::Serialize, serde::Deserialize)]
pub struct PocCategory {
    pub category_id: Option<i64>,
    pub category_name: Option<String>,
    pub category_type: Option<i8>,
    pub server_id: Option<i64>,
    pub server_name: Option<String>,
    pub cn_url: Option<String>,
}

#[html_sql("mapper/category.html")]
async fn insert(
    rb: &dyn Executor,
    args: &PocCategory,
) -> std::result::Result<rbatis::rbdc::db::ExecResult, rbatis::rbdc::Error> {
    impled!()
}

htmlsql_select_page!(select_list(category_name: &str) -> PocCategory => "mapper/category.html");

#[html_sql("mapper/category.html")]
async fn delete_by_id(
    rb: &dyn Executor,
    category_id: i64,
) -> std::result::Result<rbatis::rbdc::db::ExecResult, rbatis::rbdc::Error> {
    impled!()
}

#[html_sql("mapper/category.html")]
async fn update_by_id(rb: &dyn Executor, category: &PocCategory) -> rbatis::rbdc::db::ExecResult {
    impled!()
}

#[html_sql("mapper/category.html")]
async fn select_all(rb: &dyn Executor) -> Vec<PocCategory> {
    impled!()
}

#[html_sql("mapper/category.html")]
async fn select_enable_select(rb: &dyn Executor) -> Vec<PocCategory> {
    impled!()
}

#[html_sql("mapper/category.html")]
async fn select_server_by_category_id(rb: &dyn Executor, category_id: i64) -> PocServer {
    impled!()
}

pub async fn add(
    category: PocCategory,
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

    let table: PocCategory = PocCategory {
        category_id: Some(new_snowflake_id()),
        category_name: category.category_name,
        category_type: get_category_type_value(CategoryType::UserDefine),
        server_id: category.server_id,
        server_name: None,
        cn_url: None,
    };
    let data = insert(&rb, &table).await;
    Ok(data)
}

pub async fn query(
    category: PocCategory,
    current: u64,
    size: u64,
) -> RResult<PageResult<PocCategory>> {
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

    let category_name = shared::util::like_pattern(&category.category_name);

    rb.init(rbdc_sqlite::driver::SqliteDriver {}, &url).unwrap();
    let data: Page<PocCategory> = select_list(
        &rb,
        &PageRequest::new(current, size),
        like_pattern(&category_name).unwrap().as_str(),
    )
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

pub async fn query_all() -> RResult<Vec<PocCategory>> {
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
    let data: Vec<PocCategory> = select_all(&rb).await.unwrap();
    Ok(data)
}

pub async fn delete(
    category: PocCategory,
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

    let driver_url = shared::sqlite::get_driver_url();

    rb.init(rbdc_sqlite::driver::SqliteDriver {}, &driver_url)
        .unwrap();
    let data = delete_by_id(&rb, category.category_id.unwrap()).await;
    Ok(data)
}

pub async fn update(
    category: PocCategory,
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

    let driver_url = shared::sqlite::get_driver_url();

    rb.init(rbdc_sqlite::driver::SqliteDriver {}, &driver_url)
        .map_err(|err| {
            eprintln!("{}", err.to_string());
        })
        .unwrap();

    let data = update_by_id(&rb, &category).await;
    Ok(data)
}

pub async fn select_ref_server_by_category_id(category_id: i64) -> EntityResult<PocServer> {
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
        .map_err(|err| {
            eprintln!("{}", err.to_string());
            anyhow::Error::msg(err.to_string())
        })?;

    let server = select_server_by_category_id(&rb, category_id).await?;
    Ok(server)
}
