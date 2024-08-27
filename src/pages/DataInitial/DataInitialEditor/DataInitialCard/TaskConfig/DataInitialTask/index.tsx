import { Form, InputNumber } from "@arco-design/web-react";
import styles from "./index.module.less";
import { formPathGenerator, toFormPath } from "@/shared/path";
import { useCallback, useContext, useMemo, useState } from "react";
import DataInitialContext from "../../../DataInitialContext";
import useWatch from "@arco-design/web-react/es/Form/hooks/useWatch";
import get from "lodash/get";
import { useMemoizedFn } from "ahooks";
import { IconDown, IconUp } from "@arco-design/web-react/icon";
import classNames from "classnames";
import Summary from "./Summary";
import { isNullOrUndefined } from "@/shared/is";
import { formatNumber, unformatNumber } from "@/shared/numbro";

export interface DataInitialTaskProps {
  parentField: string;
}

const watchFields = [
  "seller_number",
  "category_number",
  "user_number",
  "seller_to_brand",
  "brand_to_product",
  "product_to_order",
];

/**
 *
 */
const DataInitialTask = (props: DataInitialTaskProps) => {
  const { parentField } = props;

  const { form } = useContext(DataInitialContext);

  const getFormPath = useMemo(
    () => formPathGenerator(parentField),
    [parentField]
  );

  const watchedValues = useWatch(
    watchFields.map((field) => getFormPath(field)),
    form
  );

  const [collapse, setCollapse] = useState(true);

  const toggleCollapse = useMemoizedFn(() => {
    setCollapse((c) => !c);
  });

  const calcValue = useCallback(
    (...fields: string[]) => {
      const result = fields.reduce((prev, current) => {
        if (prev === -1) {
          return prev;
        }
        const currentValue = get(watchedValues, getFormPath(current));
        if (isNullOrUndefined(currentValue)) {
          return -1;
        }
        return currentValue * prev;
      }, 1);

      if (result > 0) {
        return formatNumber(result);
      }
      return "-";
    },
    [getFormPath, watchedValues]
  );

  const dataSource = useMemo(() => {
    const values = [
      {
        label: "poc_category",
        value: calcValue("category_number"),
      },
      {
        label: "poc_sellers",
        value: calcValue("seller_number"),
      },
      {
        label: "poc_brands",
        value: calcValue("seller_number", "seller_to_brand"),
      },
      {
        label: "poc_product",
        value: calcValue(
          "seller_number",
          "seller_to_brand",
          "brand_to_product"
        ),
      },
      {
        label: "poc_order",
        value: calcValue(
          "seller_number",
          "seller_to_brand",
          "brand_to_product",
          "product_to_order"
        ),
      },
      {
        label: "poc_user",
        value: calcValue("user_number"),
      },
      {
        label: "poc_product_user_relation",
        value: calcValue(
          "seller_number",
          "seller_to_brand",
          "brand_to_product"
        ),
      },
    ];

    const total = values.reduce((prev, current) => {
      if (prev === -1) {
        return prev;
      }
      const currentValue = current.value;
      if (currentValue === "-") {
        return -1;
      }
      return unformatNumber(currentValue) + prev;
    }, 0);

    values.unshift({
      label: "总数据量",
      value: total > 0 ? formatNumber(total) : "-",
    });
    return values;
  }, [calcValue]);

  return (
    <div className={styles.dataInitialTask}>
      <h1>基本配置</h1>
      <Form.Item
        label="卖家数量"
        rules={[{ required: true, message: "请输入卖家数量" }]}
        field={getFormPath("seller_number")}
      >
        <InputNumber min={1} step={1} placeholder="请输入卖家数量" />
      </Form.Item>
      <div
        className={classNames(
          "mb-4 transition-[height]",
          collapse ? "h-[30px] overflow-hidden" : "un-collapse h-auto"
        )}
      >
        <h1 className="cursor-pointer py-2" onClick={toggleCollapse}>
          高级配置 {collapse ? <IconDown /> : <IconUp />}
        </h1>
        <Form.Item
          label="卖家->品牌"
          tooltip="一个卖家对应多少个品牌"
          rules={[{ required: true, message: "请输入卖家数量" }]}
          field={getFormPath("seller_to_brand")}
        >
          <InputNumber min={1} placeholder="请输入" />
        </Form.Item>
        <Form.Item
          label="品牌->产品"
          tooltip="一个品牌对应多少个产品"
          rules={[{ required: true, message: "请输入卖家数量" }]}
          field={getFormPath("brand_to_product")}
        >
          <InputNumber min={1} placeholder="请输入" />
        </Form.Item>
        <Form.Item
          label="产品->订单"
          tooltip="一个产品对应多少个订单"
          rules={[{ required: true, message: "请输入卖家数量" }]}
          field={getFormPath("product_to_order")}
        >
          <InputNumber min={1} placeholder="请输入" />
        </Form.Item>
        <Form.Item
          label="类别数量"
          rules={[{ required: true, message: "请输入卖家数量" }]}
          field={toFormPath(parentField, "category_number")}
        >
          <InputNumber min={1} step={1} placeholder="请输入类别数量" />
        </Form.Item>
        <Form.Item
          label="用户数"
          rules={[{ required: true, message: "请输入卖家数量" }]}
          field={toFormPath(parentField, "user_number")}
        >
          <InputNumber min={1} step={1} placeholder="请输入用户数量" />
        </Form.Item>
      </div>

      <div className="">
        <h3 className="mb-2">汇总信息</h3>
        <Summary fields={dataSource} />
      </div>
    </div>
  );
};

export default DataInitialTask;
