import {
  getBrandJob,
  getCategoryJob,
  getClearJob,
  getInitialConfig,
  getOrderJob,
  getProductJob,
  getSellersJob,
  getUserJob,
} from "./job";
import { parseJsonToYml } from "./yaml";

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

export const generateYmlScript = (task: any) => {
  const {
    clear_data,
    brand_to_product,
    category_number,
    product_to_order,
    seller_number,
    seller_to_brand,
    user_number,
  } = task;
  const config = getInitialConfig();

  if (clear_data) {
    config.jobs.push(getClearJob());
  }

  config.jobs.push(getCategoryJob(category_number));

  config.jobs.push(getUserJob(user_number));

  config.jobs.push(getSellersJob(seller_number));

  config.jobs.push(getBrandJob(seller_number * seller_to_brand));

  config.jobs.push(
    getProductJob(seller_number * seller_to_brand * brand_to_product)
  );

  config.jobs.push(
    getOrderJob(
      seller_number * seller_to_brand * brand_to_product * product_to_order
    )
  );

  return parseJsonToYml(config);
};
