use rbatis::{
    dark_std::defer, executor::Executor, html_sql, impl_insert, rbdc::db::ExecResult, RBatis,
};

use super::shared_types::RResult;

#[derive(serde::Serialize, serde::Deserialize, Clone)]
pub struct PocMetric {
    pub metric_id: Option<i64>,
    pub case_id: i64,
    pub total_statement: i64,
    pub avg_statement_cast_mills: f64,
    pub avg_sql_cast_mills: f64,
    pub statement_qps: f64,
    pub sql_qps: f64,
    pub write_mib_pre_second: f64,
    pub p80: i64,
    pub p95: i64,
    pub avg_row_width: f64,
}

impl_insert!(PocMetric {});

#[html_sql("mapper/metric.html")]
async fn delete_by_case_id(
    rb: &dyn Executor,
    case_id: i64,
) -> std::result::Result<rbatis::rbdc::db::ExecResult, rbatis::rbdc::Error> {
    impled!()
}

#[html_sql("mapper/metric.html")]
async fn select_by_case_id(rb: &dyn Executor, case_id: i64) -> Vec<PocMetric> {
    impled!()
}

pub async fn insert_batch(metrics: Vec<PocMetric>) -> RResult<ExecResult> {
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

    // 删除之前的 case_id对应的统计数据
    let _ = delete_by_case_id(&rb, metrics[0].case_id).await;

    let data = PocMetric::insert_batch(&rb, &metrics, 100).await;
    data
}

pub async fn select_metrics(case_id: i64) -> RResult<Vec<PocMetric>> {
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

    select_by_case_id(&rb, case_id).await
}
