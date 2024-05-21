import { Button, Form, FormInstance } from "@arco-design/web-react";
import styles from "./index.module.less";
import { useMemoizedFn } from "ahooks";
import { IconPlus } from "@arco-design/web-react/icon";
import { toFormPath } from "@/shared/path";
import ProcessorUnit from "../ProcessorUnit";
import { TaskletProcessor } from "@/pages/CaseManage/components/CaseEditor/ConfigEditor/sharedType";

export interface ProcessorConfigProps {
  parentField: string;
  form: FormInstance;
}

/**
 *
 */
const ProcessorConfig = (props: ProcessorConfigProps) => {
  const { parentField, form } = props;
  const addProcessor = useMemoizedFn(() => {
    let processors: TaskletProcessor[] = form.getFieldValue(
      toFormPath(parentField, "processors")
    );
    if (!processors) {
      processors = [];
    }
    const processor: TaskletProcessor = {
      klzss: undefined,
      name: undefined,
      transactionDelayTime: 0,
    };
    processors.push(processor);
    form.setFieldValue(toFormPath(parentField, "processors"), processors);
  });
  return (
    <div className={styles.processorConfig}>
      <div className={styles.operator}>
        <Button
          onClick={addProcessor}
          type="outline"
          icon={<IconPlus />}
          size="small"
        >
          添加执行器
        </Button>
      </div>
      <Form.List
        rules={[{ required: true, message: "执行器不能为空" }]}
        field={toFormPath(parentField, "processors")}
      >
        {(fields, { remove }) => {
          return (
            <div className={styles.processorList}>
              {fields.map((item, index) => {
                return (
                  <ProcessorUnit
                    parentField={item.field}
                    key={item.field}
                    remove={() => remove(index)}
                  />
                );
              })}
            </div>
          );
        }}
      </Form.List>
    </div>
  );
};

export default ProcessorConfig;
