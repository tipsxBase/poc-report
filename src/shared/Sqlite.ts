import { invoke } from "@tauri-apps/api/tauri";

export class SQLite {
  constructor() {}

  static async open(): Promise<SQLite> {
    await invoke<string>("plugin:sqlite|open");
    return new SQLite();
  }

  async close(): Promise<boolean> {
    return await invoke("plugin:sqlite|close");
  }

  async execute(sql: string, values?: Record<string, any>): Promise<boolean> {
    return values
      ? await invoke("plugin:sqlite|execute", {
          sql,
          args: values,
        })
      : await invoke("plugin:sqlite|execute_sql", { sql });
  }

  async queryWithArgs<T>(
    sql: string,
    values?: Record<string, any>
  ): Promise<T> {
    return await invoke("plugin:sqlite|query_with_args", {
      sql,
      args: values ?? {},
    });
  }

  async executeBatch(sql: string): Promise<boolean> {
    return await invoke("plugin:sqlite|execute_batch", { sql });
  }
}

export default SQLite;
