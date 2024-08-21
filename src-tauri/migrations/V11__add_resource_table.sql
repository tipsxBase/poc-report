CREATE TABLE poc_resource (
	resource_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	resource_name TEXT NOT NULL,
	resource_url TEXT,
	resource_size REAL,
	resource_description TEXT,
	resource_required INTEGER DEFAULT (0),
  created_at TimeStamp default (datetime(CURRENT_TIMESTAMP, 'localtime')),
  updated_at TimeStamp default (datetime(CURRENT_TIMESTAMP, 'localtime'))
);

INSERT INTO poc_resource (resource_name, resource_url, resource_description, resource_size, resource_required)
VALUES('hexadb-poc.jar', 'https://hexadb-fe.tos-cn-beijing.volces.com/poc/resources/hexadb-poc.jar', 'POC 测试的 Java 程序', 33489692, 1);

INSERT INTO poc_resource (resource_name, resource_url, resource_description, resource_size, resource_required)
VALUES('jdk-17_linux-x64_bin.tar.gz', 'https://hexadb-fe.tos-cn-beijing.volces.com/poc/resources/jdk-17_linux-x64_bin.tar.gz', 'POC 测试的 Java 程序依赖的 JDK', 182487685, 1);

INSERT INTO poc_resource (resource_name, resource_url, resource_description, resource_size, resource_required)
VALUES('POC测试资产.docx', 'https://hexadb-fe.tos-cn-beijing.volces.com/poc/resources/POC%E6%B5%8B%E8%AF%95%E8%B5%84%E4%BA%A7.docx', 'POC 测试的资产库', 182487685, 0);

INSERT INTO poc_resource (resource_name, resource_url, resource_description, resource_size, resource_required)
VALUES('performance.tar.gz', 'https://hexadb-fe.tos-cn-beijing.volces.com/poc/resources/performance.tar.gz', '海纳性能优化脚本', 182487685, 1);

INSERT INTO poc_resource (resource_name, resource_url, resource_description, resource_size, resource_required)
VALUES('海纳数据库POC测试报告模板.docx', 'https://hexadb-fe.tos-cn-beijing.volces.com/poc/resources/%E6%B5%B7%E7%BA%B3%E6%95%B0%E6%8D%AE%E5%BA%93POC%E6%B5%8B%E8%AF%95%E6%8A%A5%E5%91%8A%E6%A8%A1%E6%9D%BF.docx', '海纳数据库POC测试报告模板', 182487685, 0);


CREATE TABLE poc_task (
	task_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	task_name TEXT NOT NULL,
	task_status INTEGER DEFAULT (0), -- 0 表示未开始 1 表示进行中 2 表示已经完成
	task_progress REAL, -- 进度
	task_type INTEGER DEFAULT (0), -- 任务类型 0 表示下载任务 1 表示上传任务
	task_payload TEXT, -- 任务的额外数据，使用 JSON 存储
	is_deleted INTEGER DEFAULT (0),
  created_at TimeStamp default (datetime(CURRENT_TIMESTAMP, 'localtime')),
  updated_at TimeStamp default (datetime(CURRENT_TIMESTAMP, 'localtime'))
);


