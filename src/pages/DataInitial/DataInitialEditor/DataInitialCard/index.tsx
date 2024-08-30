import { Form } from "@arco-design/web-react";
import styles from "./index.module.less";
import { DataInitialTaskType } from "@/stores/initial";
import { IconInfoCircle } from "@arco-design/web-react/icon";
import get from "lodash/get";
import { useMemoizedFn } from "ahooks";
import TaskConfig from "./TaskConfig";
import { toFormPath } from "@/shared/path";
import CollapseWrapper from "@/components/CollapseWrapper";
import TaskTypeLabel from "./TaskTypeLabel";

export interface DataInitialCardProps {
  parentField: string;
}
/**
 *
 */
const DataInitialCard = (props: DataInitialCardProps) => {
  const { parentField } = props;

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

  return (
    <CollapseWrapper
      leftWrapperClassName={styles.formWrapper}
      className={styles.processorUnit}
      collapseHeight={60}
    >
      <Form.Item field={toFormPath(parentField, "task_type")} label="任务类型">
        <TaskTypeLabel />
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
