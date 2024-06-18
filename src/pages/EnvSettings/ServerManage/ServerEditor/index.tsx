import { Form, Input, InputNumber } from "@arco-design/web-react";
import styles from "./index.module.less";
import { forwardRef, useImperativeHandle, useMemo } from "react";
import { ServerEntity } from "@/service/server";

export interface ServerEditorProps {
  action: "add" | "update";
  rawEntity?: ServerEntity;
}

export interface ServerEditorInstance {
  getValues: () => Promise<ServerEntity>;
}

/**
 *
 */
const ServerEditor = forwardRef<ServerEditorInstance, ServerEditorProps>(
  (props, ref) => {
    const { action, rawEntity } = props;

    const [form] = Form.useForm();

    const initialValues = useMemo(() => {
      if (action === "update") {
        return rawEntity;
      }
      return {
        port: 22,
      };
    }, [action, rawEntity]);

    useImperativeHandle(
      ref,
      () => {
        return {
          getValues: () => {
            return form.validate();
          },
        };
      },
      [form]
    );

    return (
      <div className={styles.serverEditor}>
        <Form form={form} initialValues={initialValues}>
          <Form.Item
            rules={[
              {
                required: true,
                message: "请输入服务名称",
              },
            ]}
            label="服务名称"
            field="server_name"
          >
            <Input placeholder="请输入服务名称" />
          </Form.Item>
          <Form.Item
            rules={[
              {
                required: true,
                message: "请输入服务IP",
              },
            ]}
            label="服务IP"
            field="host"
          >
            <Input placeholder="172.16.0.2" />
          </Form.Item>
          <Form.Item
            rules={[
              {
                required: true,
                message: "请输入服务端口",
              },
            ]}
            label="服务端口"
            field="port"
          >
            <InputNumber min={0} placeholder="请输入服务端品" />
          </Form.Item>
          <Form.Item
            rules={[
              {
                required: true,
                message: "请输入用户名",
              },
            ]}
            label="用户名"
            field="username"
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
            field="password"
          >
            <Input.Password placeholder="请输入密码" />
          </Form.Item>
        </Form>
      </div>
    );
  }
);

export default ServerEditor;
