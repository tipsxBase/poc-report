use rbatis::{
    dark_std::defer, executor::Executor, html_sql, htmlsql_select_page, plugin::page::PageRequest,
    Page, RBatis,
};

use crate::entities::PageResult;

use super::shared_types::RResult;

#[derive(serde::Serialize, serde::Deserialize, Clone, Debug)]
pub struct PocDdl {
    pub ddl_id: Option<i64>,
    pub category_id: Option<i64>,
    pub category_name: Option<String>,
    pub ddl_name: Option<String>,
    pub ddl_content: Option<String>,
}

#[html_sql("mapper/ddl.html")]
async fn insert(rb: &dyn Executor, args: &PocDdl) -> rbatis::rbdc::db::ExecResult {
    impled!()
}

htmlsql_select_page!(select_list(ddl: &PocDdl) -> PocDdl => "mapper/ddl.html");

#[html_sql("mapper/ddl.html")]
async fn update_by_id(rb: &dyn Executor, ddl: &PocDdl) -> rbatis::rbdc::db::ExecResult {
    impled!()
}

#[html_sql("mapper/ddl.html")]
async fn delete_by_id(rb: &dyn Executor, ddl_id: i64) -> rbatis::rbdc::db::ExecResult {
    impled!()
}

pub async fn add(ddl: PocDdl) -> RResult<rbatis::rbdc::db::ExecResult> {
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

    let table: PocDdl = PocDdl {
        ddl_id: None,
        category_id: ddl.category_id,
        category_name: None,
        ddl_name: ddl.ddl_name,
        ddl_content: ddl.ddl_content,
    };
    let data = insert(&rb, &table).await?;
    Ok(data)
}

pub async fn query(ddl: PocDdl, current: u64, size: u64) -> RResult<PageResult<PocDdl>> {
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

    let data: Page<PocDdl> = select_list(&rb, &PageRequest::new(current, size), &ddl).await?;

    let page_result = PageResult {
        records: data.records,
        total: data.total,
        page_no: data.page_no,
        page_size: data.page_size,
    };
    Ok(page_result)
}

pub async fn delete(ddl: PocDdl) -> RResult<rbatis::rbdc::db::ExecResult> {
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

    let data = delete_by_id(&rb, ddl.ddl_id.unwrap()).await?;
    Ok(data)
}

pub async fn update(ddl: PocDdl) -> RResult<rbatis::rbdc::db::ExecResult> {
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

    let data = update_by_id(&rb, &ddl).await?;
    Ok(data)
}
