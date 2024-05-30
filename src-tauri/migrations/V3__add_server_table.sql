

CREATE TABLE poc_server(
  server_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, -- 主键
  server_name TEXT NOT NULL,
  category_id INTEGER NOT NULL,
  host TEXT,
  port INTEGER DEFAULT (22),
  username TEXT,
  password TEXT,
  is_default INTEGER DEFAULT (0), -- 是否是默认服务 0 表示否，1表示是
  created_at TimeStamp default (datetime(CURRENT_TIMESTAMP, 'localtime')),
  updated_at TimeStamp default (datetime(CURRENT_TIMESTAMP, 'localtime'))
);

-- 创建统一索引
CREATE UNIQUE INDEX poc_server_server_name_IDX ON poc_server (server_name);
