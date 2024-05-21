-- poc_cases definition

CREATE TABLE poc_case (
	case_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, -- id
  category_id INTEGER NOT NULL, -- 类别ID
	case_name TEXT NOT NULL, -- 用例名称
	case_content TEXT NOT NULL -- 用例内容YAML
);

CREATE INDEX poc_case_case_id_IDX ON poc_case (case_id,case_name);
CREATE UNIQUE INDEX poc_case_case_name_IDX ON poc_case (case_name);


-- poc_category definition

CREATE TABLE poc_category (
	category_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, -- 类别ID
	category_name TEXT NOT NULL, -- 类别名称
  category_type INTEGER NOT NULL DEFAULT 2
);

INSERT INTO poc_category (category_name, category_type) values ('系统用例库', 1);

-- poc_metric definition

CREATE TABLE poc_metric(
  metric_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, -- 主键
  case_id INTEGER NOT NULL,
  total_statement  INTEGER, -- 总的事务数
  avg_statement_cast_mills  REAL, -- 平均每个事务耗时(ms)
  avg_sql_cast_mills  REAL, -- 平均每个SQL的耗时(ms)
  statement_qps  REAL, -- 平均每秒执行事务数
  sql_qps  REAL, -- 平均每秒执行SQL数
  write_mib_pre_second  REAL, -- 每秒写入的数据量
  p80  INTEGER, -- P80
  p95  INTEGER, -- P95
  avg_row_width REAL -- 平均行宽
);


-- poc_server_statics definition

CREATE TABLE poc_server_statics(
  statics_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, -- 主键
  case_id INTEGER NOT NULL,
  time  INTEGER, -- 时间点
  value  TEXT, -- JSON
  type INTEGER -- 类型 1 SAR 2 ActiveConnection
);