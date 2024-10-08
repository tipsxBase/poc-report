import { forwardRef, useImperativeHandle } from "react";
import styles from "./index.module.less";
import { Listener, ListenerType, SharedInstance } from "../../sharedType";
import { Button, Form, Input, Select } from "@arco-design/web-react";
import { useMemoizedFn } from "ahooks";
import { IconDelete, IconPlus } from "@arco-design/web-react/icon";
import { toFormPath } from "@/shared/path";
import { enumToSelectOptions } from "@/shared/emum";
import get from "lodash/get";
import set from "lodash/set";

interface ListenerValue {
  listeners: Listener[];
}

export interface ListenerConfigProps {
  initialValues: ListenerValue;
}
export interface ListenerInstance extends SharedInstance<any> {}
/**
 *
 */
const ListenerConfig = forwardRef<ListenerInstance, ListenerConfigProps>(
  (props, ref) => {
    const [form] = Form.useForm();
    const { initialValues } = props;
    useImperativeHandle(
      ref,
      () => {
        return {
          getValues() {
            return form.validate().then((res) => {
              return set({}, "listeners", get(res, "listeners", []));
            });
          },
          getRawValues() {
            return form.getFieldsValue() as any;
          },
        };
      },
      [form]
    );

    const addListener = useMemoizedFn(() => {
      let listeners: Listener[] = form.getFieldValue("listeners");
      if (!listeners) {
        listeners = [];
      }
      const listener: Listener = {
        klass: undefined,
        name: undefined,
        cronExpression: "0/5 * * * * ?",
      };
      listeners.push(listener);
      form.setFieldValue("listeners", listeners);
    });

    const updateListenerName = useMemoizedFn((index: number, v: string) => {
      const listeners: Listener[] = form.getFieldValue("listeners");
      if (v === "NodeMetricListener") {
        listeners[index].name = "metricForSar";
      } else if (v === "DbActiveConnectionListener") {
        listeners[index].name = "metricForActiveConnection";
      }
      form.setFieldValue("listeners", listeners);
    });

    return (
      <div className={styles.listener}>
        <div className={styles.actionWrapper}>
          <Button onClick={addListener} type="primary" icon={<IconPlus />}>
            添加监听器
          </Button>
        </div>
        <Form initialValues={initialValues} form={form}>
          <Form.List field="listeners">
            {(fields, { remove }) => {
              return (
                <div className={styles.listenerList}>
                  {fields.map((item, index) => {
                    return (
                      <div key={item.key} className={styles.formWrapper}>
                        <div className={styles.formItem}>
                          <Form.Item
                            rules={[
                              {
                                required: true,
                                message: "请选择监听器类型",
                              },
                            ]}
                            field={toFormPath(item.field, "klass")}
                            label="监听器类型"
                          >
                            <Select
                              onChange={(v) => updateListenerName(index, v)}
                              placeholder="请选择监听器类型"
                              options={enumToSelectOptions(ListenerType)}
                            />
                          </Form.Item>
                          <Form.Item
                            field={toFormPath(item.field, "name")}
                            hidden
                          >
                            <Input placeholder="请输入监控器名称" />
                          </Form.Item>

                          <Form.Item
                            rules={[
                              {
                                required: true,
                                message: "请输入调度周期",
                              },
                            ]}
                            field={toFormPath(item.field, "cronExpression")}
                            label="调度周期"
                          >
                            <Input placeholder="请输入调度器周期" />
                          </Form.Item>
                        </div>
                        <div>
                          <Button
                            onClick={() => remove(index)}
                            icon={<IconDelete />}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            }}
          </Form.List>
        </Form>
      </div>
    );
  }
);

export default ListenerConfig;
