use rbatis::{dark_std::defer, executor::Executor, html_sql, htmlsql_select_page, plugin::page::PageRequest, snowflake::new_snowflake_id, Page, RBatis};
use serde_json::json;

use super::shared_types::RResult;

#[derive(serde::Serialize, serde::Deserialize, Clone)]
pub struct PocMetric {
    pub metric_id: Option<i64>, 
    pub case_id: Option<i64>,
    pub job_id:  Option<String>,
    pub total_statement:  Option<i64>,
    pub avg_statement_cast_mills:  Option<f64>,
    pub avg_sql_cast_mills:  Option<f64>,
    pub statement_qps:  Option<f64>,
    pub sql_qps:  Option<f64>,
    pub write_mib_pre_second:  Option<f64>,
    pub start_mills:  Option<i64>,
    pub end_mills:  Option<i64>,
    pub execute_time:  Option<String>,
    pub p80:  Option<i64>,
    pub p95:  Option<i64>,
    pub avg_row_width: Option<f64> 
}



#[html_sql("mapper/metric.html")]
async fn insert(
    rb: &dyn Executor,
    args: &PocMetric,
) -> std::result::Result<rbatis::rbdc::db::ExecResult, rbatis::rbdc::Error> {
    impled!()
}

#[html_sql("mapper/metric.html")]
async fn delete_by_case_id(
    rb: &dyn Executor,
    case_id: i64,
) -> std::result::Result<rbatis::rbdc::db::ExecResult, rbatis::rbdc::Error> {
    impled!()
}





pub async fn add(metric: PocMetric) -> RResult<std::result::Result<rbatis::rbdc::db::ExecResult, rbatis::rbdc::Error>>{
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

  rb.init(
      rbdc_sqlite::driver::SqliteDriver {},
      &url,
  )
  .unwrap();

  println!("{}", json!(metric));

  let _ = delete_by_case_id(&rb, metric.case_id.unwrap()).await;

  let table: PocMetric = PocMetric {
    metric_id: None,
    case_id: metric.case_id,
    job_id: metric.job_id,
    total_statement: metric.total_statement,
    avg_statement_cast_mills: metric.avg_statement_cast_mills,
    avg_sql_cast_mills: metric.avg_sql_cast_mills,
    statement_qps: metric.statement_qps,
    sql_qps: metric.sql_qps,
    write_mib_pre_second: metric.write_mib_pre_second,
    start_mills: metric.start_mills,
    end_mills: metric.end_mills,
    execute_time: metric.execute_time,
    p80: metric.p80,
    p95: metric.p95,
    avg_row_width: metric.avg_row_width 
  };
  let data = insert(&rb, &table).await;
  Ok(data)
}