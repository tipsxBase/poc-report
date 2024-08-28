import { InitialTaskEntity } from "@/service/initial_task";
import { useMemo } from "react";
import ShellEditor from "@/components/ShellEditor";
import UseInitialStore, { DataInitialTaskType } from "@/stores/initial";
import YamlEditor from "@/components/YamlEditor";
import { generateShellScript, generateYmlScript } from "@/shared/script";

export interface DataInitialScriptProps {
  rawEntity: InitialTaskEntity;
}

/**
 *
 */
const DataInitialScript = (props: DataInitialScriptProps) => {
  const { rawEntity } = props;
  const { getTaskTypeLabel } = UseInitialStore();
  const task_config = useMemo(() => {
    let config;
    try {
      config = JSON.parse(JSON.parse(rawEntity.task_config));
    } catch (error) {
      /* empty */
      config = [] as any;
    }
    return config;
  }, [rawEntity.task_config]);

  return (
    <div className="px-3 py-4 flex flex-col gap-4">
      {task_config.map((task) => (
        <div className="flex flex-col gap-1">
          <h3 className="tracking-tight text-sm font-medium">
            {getTaskTypeLabel(task.task_type)}
          </h3>
          {task.task_type === DataInitialTaskType.DATABASE_INITIAL && (
            <ShellEditor readOnly value={generateShellScript(task)} />
          )}

          {task.task_type === DataInitialTaskType.DATA_INITIAL && (
            <YamlEditor readOnly value={generateYmlScript(task)} />
          )}
        </div>
      ))}
    </div>
  );
};

export default DataInitialScript;
