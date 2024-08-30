import UseInitialStore, { DataInitialTaskType } from "@/stores/initial";
import InputText from "@/components/InputText";
export interface TaskTypeLabelProps {
  value?: DataInitialTaskType;
}

/**
 *
 */
const TaskTypeLabel = (props: TaskTypeLabelProps) => {
  const { getTaskTypeLabel } = UseInitialStore();
  const { value } = props;

  return <InputText value={getTaskTypeLabel(value)} />;
};

export default TaskTypeLabel;
