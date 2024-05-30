import { useMemoizedFn } from "ahooks";
import MockRuleConfig from "../..";
import styles from "./index.module.less";
import { IconPlus } from "@arco-design/web-react/icon";
import { Button, Form } from "@arco-design/web-react";
import { MockDataDefine } from "@/pages/CaseManage/components/CaseEditor/ConfigEditor/sharedType";
import { forwardRef, useImperativeHandle } from "react";

export type JsonConfigValue = { meta: MockDataDefine[] };

export interface JsonConfigProps {
  getRefGlobals: () => any[];
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
    const { getRefGlobals, initialValues } = props;
    const [form] = Form.useForm();
    const addMockRule = useMemoizedFn(() => {
      let meta: MockDataDefine[] = form.getFieldValue("meta");
      if (!meta) {
        meta = [];
      }

      const define: MockDataDefine = {
        klass: "SqlDataDefine",
        key: undefined,
        type: undefined,
        mockRule: undefined,
        nullPercent: 0,
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
                      <MockRuleConfig
                        getRefGlobals={getRefGlobals}
                        parentField={item.field}
                        key={item.key}
                        remove={() => remove(index)}
                      />
                    );
                  })}
                </div>
              );
            }}
          </Form.List>
        </Form>

        <Button onClick={addMockRule} type="outline" icon={<IconPlus />}>
          添加规则
        </Button>
      </div>
    );
  }
);

export default JsonConfig;
