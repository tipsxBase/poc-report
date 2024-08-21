import { useMemoizedFn } from "ahooks";
import styles from "./index.module.less";
import { IconPlus } from "@arco-design/web-react/icon";
import { Button, Form } from "@arco-design/web-react";
import {
  JsonElementDefine,
  MockDataDefine,
} from "@/pages/CaseManage/components/CaseEditor/ConfigEditor/sharedType";
import { forwardRef, useImperativeHandle } from "react";
import JsonElementConfig from "./JsonElementConfig";

export type JsonConfigValue = { meta: MockDataDefine[] };

export interface JsonConfigProps {
  initialValues: JsonConfigValue;
}

export interface JsonConfigInstance {
  getValues: () => Promise<JsonConfigValue>;
}
/**
 *
 */
const JsonConfig = forwardRef<JsonConfigInstance, JsonConfigProps>(
  (props, ref) => {
    const { initialValues } = props;
    const [form] = Form.useForm();
    const addMockRule = useMemoizedFn(() => {
      let meta: JsonElementDefine[] = form.getFieldValue("meta");
      if (!meta) {
        meta = [];
      }

      const define: JsonElementDefine = {
        key: undefined,
        type: undefined,
        mockRule: undefined,
      };
      meta.push(define);
      form.setFieldValue("meta", meta);
    });

    useImperativeHandle(
      ref,
      () => {
        return {
          getValues() {
            return form.validate();
          },
        };
      },
      [form]
    );

    return (
      <div className={styles.jsonConfig}>
        <Form initialValues={initialValues} form={form}>
          <Form.List field="meta">
            {(fields, { remove }) => {
              return (
                <div className={styles.defineList}>
                  {fields.map((item, index) => {
                    return (
                      <>
                        <JsonElementConfig
                          parentField={item.field}
                          key={item.key}
                          remove={() => remove(index)}
                        />
                        <div className={styles.divider} />
                      </>
                    );
                  })}
                </div>
              );
            }}
          </Form.List>
        </Form>

        <Button onClick={addMockRule} type="primary" icon={<IconPlus />}>
          添加规则
        </Button>
      </div>
    );
  }
);

export default JsonConfig;
