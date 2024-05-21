import { Form, Input } from "@arco-design/web-react";
import styles from "./index.module.less";
import { forwardRef, useImperativeHandle, useMemo } from "react";
import { CategoryEntity } from "@/service/category";

export interface BusinessEditorProps {
  action: "add" | "update";
  rawEntity?: CategoryEntity;
}

export interface BusinessEditorInstance {
  getValues: () => Promise<CategoryEntity>;
}

/**
 *
 */
const BusinessEditor = forwardRef<BusinessEditorInstance, BusinessEditorProps>(
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
      <div className={styles.businessEditor}>
        <Form form={form} initialValues={initialValues}>
          <Form.Item
            rules={[
              {
                required: true,
                message: "请输入项目名称",
              },
            ]}
            label="项目名称"
            field="category_name"
          >
            <Input placeholder="请输入项目名称" />
          </Form.Item>
        </Form>
      </div>
    );
  }
);

export default BusinessEditor;
