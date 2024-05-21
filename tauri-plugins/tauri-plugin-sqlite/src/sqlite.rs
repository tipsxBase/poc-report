use rusqlite::{types::Value as SqliteValue, Connection, OpenFlags, ToSql};
use std::collections::HashMap;
use tauri::command;
use serde::{Serialize, Serializer};
use serde_json::Value as JsonValue;
mod utils;

#[derive(Debug, thiserror::Error)]
pub enum Error {
    #[error(transparent)]
    Anyhow(#[from] anyhow::Error),
    #[error(transparent)]
    Sqlite(#[from] rusqlite::Error),
}






impl Serialize for Error {
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        serializer.serialize_str(self.to_string().as_ref())
    }
}

type Result<T> = std::result::Result<T, Error>;

#[command]
pub async fn open() -> Result<bool> {
  Connection::open(shared::sqlite::get_database_path()).expect("Failed to open database");  
  Ok(true)
}

#[command]
pub async fn open_with_flags() -> Result<bool> {
    let flags = OpenFlags::default();
    Connection::open_with_flags(shared::sqlite::get_database_path(), flags)?;  
    Ok(true)
}

#[command]
pub async fn close() -> Result<bool> {
    let arc_conn = Connection::open(shared::sqlite::get_database_path())?;
    drop(arc_conn);
    Ok(true)
}

#[command]
pub async fn execute_sql(sql: String) -> Result<usize> {
  let arc_conn = Connection::open(shared::sqlite::get_database_path())?;
  let res = arc_conn.execute(&sql, [])?;
  Ok(res)
}

#[command]
pub async fn execute_batch(sql: String) -> Result<bool> {
  let arc_conn = Connection::open(shared::sqlite::get_database_path())?;
  arc_conn.execute_batch(sql.as_str())?;
  Ok(true)
}

#[command]
pub async fn execute(sql: String, args: JsonValue) -> Result<usize> {
  let conn = Connection::open(shared::sqlite::get_database_path())?;
  let mut args_sqlite_values = HashMap::<String, SqliteValue>::new();
  let mut named_args: Vec<(&str, &dyn ToSql)> = vec![];

  if let JsonValue::Object(json_value) = args {
      for (k, v) in json_value {
          args_sqlite_values.insert(k.clone(), utils::sqlite_utils::value_to_rusqlite_value(&v)?);
      }
  }

  for (k, v) in &args_sqlite_values {
      named_args.push((k, v as &dyn ToSql));
  }

  println!("{:#?}", sql);
  let res = conn.execute(sql.as_str(), &*named_args)?;
  Ok(res)
}

#[command]
pub async fn query_with_args(
    sql: String,
    args: JsonValue,
) -> Result<Vec<HashMap<String, JsonValue>>> {
    let conn = Connection::open(shared::sqlite::get_database_path())?;
    let mut stmt: rusqlite::Statement = conn.prepare(sql.as_str())?;

    let mut names: Vec<String> = Vec::new();
    for name in stmt.column_names() {
        names.push(name.to_string());
    }

    let mut args_sqlite_values = HashMap::<String, SqliteValue>::new();
    let mut named_args: Vec<(&str, &dyn ToSql)> = vec![];

    if let JsonValue::Object(json_value) = args {
        for (k, v) in json_value {
            let mut new_k = k.clone();
            new_k.insert_str(0, ":");
            args_sqlite_values.insert(new_k, utils::sqlite_utils::value_to_rusqlite_value(&v)?);
        }
    }

    for (k, v) in &args_sqlite_values {
        named_args.push((k, v as &dyn ToSql));
    }

    let schema_iter = stmt.query_map(&*named_args, |row| {
        utils::sqlite_utils::rusqlite_row_to_map(row, &names)
            .map_err(|_e| rusqlite::Error::ExecuteReturnedResults)
    })?;

    let mut result = Vec::<HashMap<String, JsonValue>>::new();

    for table_result in schema_iter {
        if let Ok(row_value) = table_result {
            //
            result.push(row_value);
        }
    }
    Ok(result)
}