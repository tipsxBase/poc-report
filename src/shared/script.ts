export const generateShellScript = (task: any) => {
  const { database_name, password, username, schema } = task;

  const snippets: string[] = ["#!/bin/bash"];
  snippets.push(
    `gsql -r -p 26700 -d postgres -c "create user ${username} sysadmin password '${password}';"`
  );

  snippets.push(
    `gsql -r -p 26700 -d postgres -c "CREATE DATABASE ${database_name} owner ${username} ENCODING 'UTF8' dbcompatibility = 'PG';"`
  );

  if (schema) {
    snippets.push(
      `gsql -r -p 26700 -U ${username} -W ${password} -d poc_test_1 -c "CREATE SCHEMA ${schema}";`
    );
  }

  return snippets.join("\n");
};
