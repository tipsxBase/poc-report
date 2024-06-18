

CREATE TABLE poc_ddl(
  ddl_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, -- 主键
  ddl_name TEXT NOT NULL,
  category_id INTEGER NOT NULL,
  ddl_content TEXT,  
  created_at TimeStamp default (datetime(CURRENT_TIMESTAMP, 'localtime')),
  updated_at TimeStamp default (datetime(CURRENT_TIMESTAMP, 'localtime'))
);

-- 创建统一索引
CREATE UNIQUE INDEX poc_ddl_ddl_name_IDX ON poc_ddl (ddl_name);
