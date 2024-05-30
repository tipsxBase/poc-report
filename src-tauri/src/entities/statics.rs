use rbatis::{
    dark_std::defer, executor::Executor, html_sql, impl_insert, rbdc::db::ExecResult, RBatis,
};
use serde_json::json;

use super::shared_types::RResult;

#[derive(serde::Serialize, serde::Deserialize, Clone)]
pub struct PocServerStatics {
    pub statics_id: Option<i64>,
    pub case_id: i64,
    pub time: i64,
    pub value: String,
    pub static_type: i8,
}

impl_insert!(PocServerStatics {});

#[html_sql("mapper/statics.html")]
async fn delete_by_case_id(
    rb: &dyn Executor,
    case_id: i64,
) -> std::result::Result<rbatis::rbdc::db::ExecResult, rbatis::rbdc::Error> {
    impled!()
}

#[html_sql("mapper/statics.html")]
async fn select_by_case_id(
    rb: &dyn Executor,
    case_id: i64,
    static_type: i8,
) -> Vec<PocServerStatics> {
    impled!()
}

pub async fn insert_batch(statics: Vec<PocServerStatics>) -> RResult<ExecResult> {
    _ = fast_log::init(
        fast_log::Config::new()
            .console()
            .level(log::LevelFilter::Debug),
    );
    defer!(|| {
        log::logger().flush();
    });

    let rb = RBatis::new();

    let url = shared::sqlite::get_driver_url();

    rb.init(rbdc_sqlite::driver::SqliteDriver {}, &url).unwrap();

    println!("{}", json!(statics));

    // 删除之前的 case_id对应的统计数据
    let _ = delete_by_case_id(&rb, statics[0].case_id).await;

    let data = PocServerStatics::insert_batch(&rb, &statics, 100).await;
    data
}

pub async fn select_statics(case_id: i64, static_type: i8) -> RResult<Vec<PocServerStatics>> {
    _ = fast_log::init(
        fast_log::Config::new()
            .console()
            .level(log::LevelFilter::Debug),
    );
    defer!(|| {
        log::logger().flush();
    });

    let rb = RBatis::new();

    let url = shared::sqlite::get_driver_url();

    rb.init(rbdc_sqlite::driver::SqliteDriver {}, &url).unwrap();

    select_by_case_id(&rb, case_id, static_type).await
}
