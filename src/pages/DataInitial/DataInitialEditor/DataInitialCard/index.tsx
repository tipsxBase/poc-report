import { Button, Form, Popconfirm, Select } from "@arco-design/web-react";
import styles from "./index.module.less";
import UseInitialStore, { DataInitialTaskType } from "@/stores/initial";
import { IconDelete, IconInfoCircle } from "@arco-design/web-react/icon";
import get from "lodash/get";
import set from "lodash/set";
import { useMemoizedFn } from "ahooks";
import TaskConfig from "./TaskConfig";
import { toFormPath } from "@/shared/path";
import { useContext } from "react";
import DataInitialContext from "../DataInitialContext";
import CollapseWrapper from "@/components/CollapseWrapper";

export interface DataInitialCardProps {
  onDeleteTask: () => void;
  parentField: string;
}
/**
 *
 */
const DataInitialCard = (props: DataInitialCardProps) => {
  const { taskTypeOptions } = UseInitialStore();
  const { parentField, onDeleteTask } = props;
  const { form } = useContext(DataInitialContext);

  const renderDescription = useMemoizedFn((taskType: DataInitialTaskType) => {
    switch (taskType) {
      case DataInitialTaskType.DATABASE_INITIAL:
        return (
          <span>
            根据配置生成数据库初始化脚本，包括创建库、创建用户、创建 schema
          </span>
        );
      case DataInitialTaskType.DATA_INITIAL: {
        return <span>根据配置生成数据初始化脚本</span>;
      }
    }
  });

  const onTaskTypeChange = useMemoizedFn((task_type: DataInitialTaskType) => {
    const values = form.getFieldsValue();
    let task;
    switch (task_type) {
      case DataInitialTaskType.DATABASE_INITIAL: {
        task = {
          task_type,
          database_name: undefined,
          username: undefined,
          password: undefined,
          schema: undefined,
        };
        break;
      }
      case DataInitialTaskType.DATA_INITIAL: {
        task = {
          task_type,
          seller_number: 10,
          seller_to_brand: 10,
          brand_to_product: 100,
          product_to_order: 1000,
          category_number: 1000,
          user_number: 100000,
        };
        break;
      }
      default: {
        task = {};
      }
    }
    set(values, parentField, task);
    form.setFieldsValue(values);
  });

  return (
    <CollapseWrapper
      actionRender={() => (
        <Popconfirm
          title="确定删除此任务？"
          position="right"
          onOk={onDeleteTask}
        >
          <Button icon={<IconDelete />} />
        </Popconfirm>
      )}
      leftWrapperClassName={styles.formWrapper}
      className={styles.processorUnit}
      collapseHeight={60}
    >
      <Form.Item
        field={toFormPath(parentField, "task_type")}
        rules={[{ required: true, message: "请选择任务类型" }]}
        label="任务类型"
      >
        <Select
          onChange={onTaskTypeChange}
          options={taskTypeOptions}
          placeholder="请选择任务类型"
        />
      </Form.Item>
      <Form.Item
        noStyle
        shouldUpdate={(prev, next) =>
          get(prev, toFormPath(parentField, "task_type")) !==
          get(next, toFormPath(parentField, "task_type"))
        }
      >
        {(values) => {
          const taskType = get(values, toFormPath(parentField, "task_type"));
          return (
            <>
              <div className="flex pl-[120px] gap-1 items-baseline text-slate-500">
                <IconInfoCircle />
                {renderDescription(taskType)}
              </div>
              <div className="font-semibold my-3">任务配置</div>
              <TaskConfig parentField={parentField} taskType={taskType} />
            </>
          );
        }}
      </Form.Item>
    </CollapseWrapper>
  );
};

export default DataInitialCard;
