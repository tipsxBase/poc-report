import { InitialTaskEntity } from "@/service/initial_task";
import { useMemo } from "react";
import ShellEditor from "@/components/ShellEditor";
import UseInitialStore, { DataInitialTaskType } from "@/stores/initial";
import YamlEditor from "@/components/YamlEditor";
import { generateShellScript, generateYmlScript } from "@/shared/script";
import { ServerEntity } from "@/service/server";
import { Button } from "@arco-design/web-react";
import Scrollbars from "react-custom-scrollbars-2";

export interface DataInitialScriptProps {
  rawEntity: InitialTaskEntity;
  serverEntity: ServerEntity;
  onDownload: (entity: InitialTaskEntity) => void;
}

/**
 *
 */
const DataInitialScript = (props: DataInitialScriptProps) => {
  const { rawEntity, serverEntity, onDownload } = props;
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

  const database = task_config.find(
    (t) => t.task_type === DataInitialTaskType.DATABASE_INITIAL
  );

  return (
    <div className="px-3 h-full py-4 flex flex-col gap-4">
      <Button
        className="w-fit"
        onClick={() => onDownload(rawEntity)}
        type="primary"
      >
        下载
      </Button>
      <div className="flex-1 overflow-hidden">
        <Scrollbars>
          {task_config.map((task) => (
            <div key={task.task_type} className="flex flex-col gap-1">
              <h3 className="tracking-tight text-sm font-medium">
                {getTaskTypeLabel(task.task_type)}
              </h3>
              {task.task_type === DataInitialTaskType.DATABASE_INITIAL && (
                <ShellEditor readOnly value={generateShellScript(task)} />
              )}

              {task.task_type === DataInitialTaskType.DATA_INITIAL && (
                <YamlEditor
                  readOnly
                  value={generateYmlScript(task, database, serverEntity)}
                />
              )}
            </div>
          ))}
        </Scrollbars>
      </div>
    </div>
  );
};

export default DataInitialScript;
