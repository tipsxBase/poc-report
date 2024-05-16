import { forwardRef, useImperativeHandle } from "react";
import styles from "./index.module.less";
import { DataSource, SharedInstance } from "../../sharedType";
import { Form, Input } from "@arco-design/web-react";
import { toFormPath } from "@/shared/path";

export interface DataSourceConfigProps {
  initialValues: DataSourceValue;
}

interface DataSourceValue {
  dataSource: DataSource;
}

export interface DataSourceConfigInstance extends SharedInstance<any> {}
/**
 *
 */
const DataSourceConfig = forwardRef<
  DataSourceConfigInstance,
  DataSourceConfigProps
>((props, ref) => {
  const { initialValues } = props;
  const [form] = Form.useForm();

  useImperativeHandle(
    ref,
    () => {
      return {
        getValues() {
          return form.validate();
        },
        getRawValues() {
          return form.getFieldsValue() as any;
        },
      };
    },
    [form]
  );

  return (
    <div className={styles.dataSource}>
      <Form form={form} initialValues={initialValues}>
        <Form.Item
          rules={[
            {
              required: true,
              message: "请输入连接信息",
            },
          ]}
          label="JDBC连接"
          field={toFormPath("dataSource", "jdbcUrl")}
        >
          <Input placeholder="请输入JDBC连接信息" />
        </Form.Item>
        <Form.Item
          rules={[
            {
              required: true,
              message: "请输入用户名",
            },
          ]}
          label="用户名"
          field={toFormPath("dataSource", "username")}
        >
          <Input placeholder="请输入用户名" />
        </Form.Item>
        <Form.Item
          rules={[
            {
              required: true,
              message: "请输入密码",
            },
          ]}
          label="密码"
          field={toFormPath("dataSource", "password")}
        >
          <Input placeholder="请输入密码" />
        </Form.Item>
      </Form>
    </div>
  );
});

export default DataSourceConfig;
