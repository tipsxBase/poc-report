import { forwardRef, useImperativeHandle } from "react";
import styles from "./index.module.less";
import { Form, Input } from "@arco-design/web-react";
import { Basic, SharedInstance } from "../../sharedType";

interface BasicConfigValue {
  __basic__: Basic;
}

export interface BasicConfigProps {
  initialValues: BasicConfigValue;
}
export interface BasicConfigInstance extends SharedInstance<any> {}

/**
 * 基本信息配置
 */
const BasicConfig = forwardRef<BasicConfigInstance, BasicConfigProps>(
  (props, ref) => {
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
      <div className={styles.basicConfig}>
        <Form form={form} initialValues={initialValues}>
          <Form.Item
            rules={[
              {
                required: true,
                message: "请输入日志路径",
              },
            ]}
            label="日志路径"
            field="logPath"
          >
            <Input placeholder="请输入日志路径" />
          </Form.Item>

          <Form.Item
            rules={[
              {
                required: true,
                message: "日志写入周期",
              },
            ]}
            label="日志写入周期"
            field="writeLogCronExpression"
          >
            <Input placeholder="请输入日志写入周期" />
          </Form.Item>
        </Form>
      </div>
    );
  }
);

export default BasicConfig;
