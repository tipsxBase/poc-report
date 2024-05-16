import {
  Button,
  Form,
  FormInstance,
  Input,
  InputNumber,
} from "@arco-design/web-react";
import styles from "./index.module.less";
import { toFormPath } from "@/shared/path";
import { IconDelete } from "@arco-design/web-react/icon";
import MockDataLine from "../MockDataLine";
import ProcessorConfig from "../ProcessorConfig";
export interface TaskUnitProps {
  parentField: string;
  form: FormInstance;
  getRefGlobals: () => any[];
  remove: () => void;
}

/**
 *
 */
const TaskUnit = (props: TaskUnitProps) => {
  const { parentField, form, getRefGlobals, remove } = props;

  return (
    <div className={styles.taskUnit}>
      <div className={styles.formWrapper}>
        <Form.Item hidden field={toFormPath(parentField, "id")}>
          <Input />
        </Form.Item>
        <Form.Item
          rules={[
            {
              required: true,
              message: "执行单元名称不能为空",
            },
          ]}
          field={toFormPath(parentField, "name")}
          label="执行单元名称"
        >
          <Input placeholder="执行单元名称" />
        </Form.Item>
        <Form.Item
          label="线程数"
          field={toFormPath(parentField, "numOfThread")}
        >
          <InputNumber placeholder="请输入线程数" min={0} />
        </Form.Item>
        <Form.Item
          label="循环次数"
          field={toFormPath(parentField, "loopCount")}
        >
          <InputNumber placeholder="请输入循环次数" min={0} />
        </Form.Item>
        <Form.Item label="Mock规则定义">
          <MockDataLine
            form={form}
            getRefGlobals={getRefGlobals}
            parentField={toFormPath(parentField, "mockDataLine")}
          />
        </Form.Item>
        <Form.Item label="执行器">
          <ProcessorConfig form={form} parentField={parentField} />
        </Form.Item>
      </div>
      <div className={styles.defineOperation}>
        <Button icon={<IconDelete />} onClick={remove} />
      </div>
    </div>
  );
};

export default TaskUnit;
