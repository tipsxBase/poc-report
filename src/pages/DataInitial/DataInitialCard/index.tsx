import { InitialTaskEntity } from "@/service/initial_task";
import TextRender from "@/components/TextRender";
import { Divider, Link, Popconfirm, Space, Tag } from "@arco-design/web-react";
import { useMemo } from "react";
import { useMemoizedFn } from "ahooks";
import UseInitialStore, { DataInitialTaskType } from "@/stores/initial";

export interface DataInitialCardProps {
  entity: InitialTaskEntity;
  onUpdate: (entity: InitialTaskEntity) => void;
  onCopy: (entity: InitialTaskEntity) => void;
  onDelete: (entity: InitialTaskEntity) => void;
  onViewScript: (entity: InitialTaskEntity) => void;
}

/**
 *
 */
const DataInitialCard = (props: DataInitialCardProps) => {
  const { entity, onUpdate, onCopy, onDelete, onViewScript } = props;
  const { task_id, task_name, task_description, task_config } = entity;
  const { getTaskTypeLabel } = UseInitialStore();
  const tasks = useMemo(() => {
    try {
      const tasks = JSON.parse(JSON.parse(task_config));
      return tasks;
    } catch (error) {
      return [];
    }
  }, [task_config]);

  const getTask = useMemoizedFn((taskType: DataInitialTaskType) => {
    switch (taskType) {
      case DataInitialTaskType.DATABASE_INITIAL: {
        return {
          label: getTaskTypeLabel(taskType),
          style: {
            color: "#165dff",
          },
        };
      }
      case DataInitialTaskType.DATA_INITIAL: {
        return {
          label: getTaskTypeLabel(taskType),
          style: {
            color: "#00b42a",
          },
        };
      }
    }
  });

  return (
    <div
      key={task_id}
      className="w-full flex rounded-lg border gap-2 px-3 py-4"
    >
      <div className="flex-1 flex flex-col gap-2 overflow-hidden">
        <h3 className="tracking-tight text-sm font-medium">
          <TextRender
            className="tracking-tight text-sm font-medium"
            text={task_name}
          />
        </h3>
        <div>
          <TextRender text={task_description} />
        </div>
        <div className="flex gap-2">
          {tasks.map((t) => {
            const { label, style } = getTask(t.task_type);
            return (
              <Tag key={t.task_type} {...style}>
                {label}
              </Tag>
            );
          })}
        </div>
      </div>
      <Space split={<Divider style={{ margin: "0 4px" }} type="vertical" />}>
        <Link onClick={() => onCopy(entity)}>复制</Link>
        <Link onClick={() => onUpdate(entity)}>修改</Link>
        <Link onClick={() => onViewScript(entity)}>查看脚本</Link>
        <Link onClick={() => onUpdate(entity)}>下载脚本</Link>
        <Link onClick={() => onUpdate(entity)}>上传脚本</Link>
        <Popconfirm
          title="确认删除？"
          position="right"
          onOk={() => onDelete(entity)}
        >
          <Link>删除</Link>
        </Popconfirm>
      </Space>
    </div>
  );
};

export default DataInitialCard;
