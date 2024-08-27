import { toFormPath } from "@/shared/path";
import { Form, Input } from "@arco-design/web-react";

export interface DatabaseTaskProps {
  parentField: string;
}

/**
 *
 */
const DatabaseTask = (props: DatabaseTaskProps) => {
  const { parentField } = props;
  return (
    <>
      <Form.Item
        label="数据库名"
        rules={[{ required: true, message: "请输入数据库名" }]}
        field={toFormPath(parentField, "database_name")}
      >
        <Input placeholder="请输入数据库名" />
      </Form.Item>
      <Form.Item
        label="用户名"
        rules={[{ required: true, message: "请输入用户名" }]}
        field={toFormPath(parentField, "username")}
      >
        <Input placeholder="请输入用户名" />
      </Form.Item>
      <Form.Item
        label="密码"
        rules={[{ required: true, message: "请输入密码" }]}
        field={toFormPath(parentField, "password")}
      >
        <Input placeholder="请输入密码" />
      </Form.Item>
      <Form.Item label="Schema" field={toFormPath(parentField, "schema")}>
        <Input placeholder="请输入Schema" />
      </Form.Item>
    </>
  );
};

export default DatabaseTask;
