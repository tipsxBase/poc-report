import {
  Button,
  Form,
  Input,
  InputNumber,
  Select,
} from "@arco-design/web-react";
import styles from "./index.module.less";
import { IconDelete } from "@arco-design/web-react/icon";
import { toFormPath } from "@/shared/path";
import { enumToSelectOptions } from "@/shared/emum";
import { ProcessorType } from "@/pages/CaseManage/components/CaseEditor/ConfigEditor/sharedType";
import get from "lodash/get";
import SqlEditor from "@/components/SqlEditor";
import SqlCollection from "../SqlCollection";

export interface ProcessorUnitProps {
  parentField: string;
  remove: () => void;
}

/**
 *
 */
const ProcessorUnit = (props: ProcessorUnitProps) => {
  const { parentField, remove } = props;
  return (
    <div className={styles.processorUnit}>
      <div className={styles.formWrapper}>
        <Form.Item
          label="执行器类型"
          rules={[
            {
              required: true,
              message: "执行器类型不能为空",
            },
          ]}
          field={toFormPath(parentField, "klass")}
        >
          <Select
            options={enumToSelectOptions(ProcessorType)}
            placeholder="请选择执行器类型"
          />
        </Form.Item>
        <Form.Item
          rules={[
            {
              required: true,
              message: "执行器名称不能为空",
            },
          ]}
          label="执行器名称"
          field={toFormPath(parentField, "name")}
        >
          <Input placeholder="请输入执行器名称" />
        </Form.Item>
        <Form.Item
          label="延迟时间"
          tooltip="事务延迟提交的时间，会计入响应时长"
          field={toFormPath(parentField, "transactionDelayTime")}
        >
          <InputNumber placeholder="请输入事务延迟时间" min={0} />
        </Form.Item>
        <Form.Item
          noStyle
          shouldUpdate={(prev, next) =>
            get(prev, toFormPath(parentField, "klass")) !==
            get(next, toFormPath(parentField, "klass"))
          }
        >
          {(values) => {
            const processorType = get(values, toFormPath(parentField, "klass"));
            if (processorType === "PocSqlQueryExecuteProcessor") {
              return (
                <Form.Item
                  rules={[
                    {
                      required: true,
                      message: "SQL不能为空",
                    },
                  ]}
                  field={toFormPath(parentField, "sql")}
                  label="SQL"
                >
                  <SqlEditor />
                </Form.Item>
              );
            } else if (
              processorType === "PocMultiSqlExecuteProcessor" ||
              processorType === "PocCopyInsertProcessor"
            ) {
              return (
                <Form.Item
                  field={toFormPath(parentField, "sqlCollection")}
                  label="SQL"
                  rules={[
                    {
                      required: true,
                      message: "SQL不能为空",
                    },
                  ]}
                >
                  <SqlCollection />
                </Form.Item>
              );
            } else {
              return null;
            }
          }}
        </Form.Item>
      </div>
      <div>
        <Button icon={<IconDelete />} onClick={remove} />
      </div>
    </div>
  );
};

export default ProcessorUnit;
