import { DataInitialTaskType } from "@/stores/initial";
import { useMemo } from "react";
import DatabaseTask from "./DatabaseTask";
import DataInitialTask from "./DataInitialTask";

export interface TaskConfigProps {
  taskType: DataInitialTaskType;
  parentField: string;
}

/**
 *
 */
const TaskConfig = (props: TaskConfigProps) => {
  const { taskType, parentField } = props;

  const taskConfigComponent = useMemo(() => {
    switch (taskType) {
      case DataInitialTaskType.DATABASE_INITIAL:
        return <DatabaseTask parentField={parentField} />;
      case DataInitialTaskType.DATA_INITIAL:
        return <DataInitialTask parentField={parentField} />;
    }
  }, [parentField, taskType]);

  return taskConfigComponent;
};

export default TaskConfig;
