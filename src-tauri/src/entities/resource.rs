use rbatis::{dark_std::defer, executor::Executor, html_sql, RBatis};

use super::shared_types::RResult;

#[derive(serde::Serialize, serde::Deserialize)]
pub struct PocResource {
    pub resource_id: Option<i64>,
    pub resource_name: Option<String>,
    pub resource_url: Option<String>,
    pub resource_size: Option<f64>,
    pub resource_description: Option<String>,
    pub resource_required: Option<i8>,
}

#[html_sql("mapper/resource.html")]
async fn select_all(rb: &dyn Executor) -> Vec<PocResource> {
    impled!()
}

pub async fn query_all() -> RResult<Vec<PocResource>> {
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

    match rb.init(rbdc_sqlite::driver::SqliteDriver {}, &driver_url) {
        Ok(_) => println!("query_all 创建连接成功"),
        Err(err) => println!("query_all 创建连接失败 {}", err),
    };

    match select_all(&rb).await {
        Ok(data) => Ok(data),
        Err(err) => Err(err),
    }
}
