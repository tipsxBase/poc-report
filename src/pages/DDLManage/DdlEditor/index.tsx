import { Form, Input } from "@arco-design/web-react";
import styles from "./index.module.less";
import { forwardRef, useImperativeHandle, useMemo } from "react";
import { DdlEntity } from "@/service/ddl";
import CategorySelect from "@/components/CategorySelect";
import SqlEditor from "@/components/SqlEditor";

export interface DdlEditorProps {
  action: "add" | "update";
  rawEntity?: DdlEntity;
}

export interface DdlEditorInstance {
  getValues: () => Promise<DdlEntity>;
}

/**
 *
 */
const DdlEditor = forwardRef<DdlEditorInstance, DdlEditorProps>(
  (props, ref) => {
    const { action, rawEntity } = props;

    const [form] = Form.useForm();

    const initialValues = useMemo(() => {
      if (action === "update") {
        return rawEntity;
      }
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
      <div className={styles.ddlEditor}>
        <Form form={form} initialValues={initialValues}>
          <Form.Item
            field="category_id"
            rules={[{ required: true, message: "请选择项目名称" }]}
            label="项目名称"
          >
            <CategorySelect />
          </Form.Item>
          <Form.Item
            rules={[
              {
                required: true,
                message: "请输入DDL名称",
              },
            ]}
            label="脚本名称"
            field="ddl_name"
          >
            <Input placeholder="请输入DDL名称" />
          </Form.Item>
          <Form.Item label="DDL内容" field="ddl_content">
            <SqlEditor height="calc(100vh - 300px)" />
          </Form.Item>
        </Form>
      </div>
    );
  }
);

export default DdlEditor;
