import TextRender from "@/components/TextRender";
import { TaskEntity, TaskStatus, TaskType } from "@/service/task";
import { Message, Popconfirm, Progress, Tag } from "@arco-design/web-react";
import { useMemoizedFn } from "ahooks";
import classNames from "classnames";
import { useMemo } from "react";
import { MdClear } from "react-icons/md";

export interface TaskCardProps {
  task: TaskEntity;
  deleteTask: (taskId: number) => Promise<any>;
}

/**
 *
 */
const TaskCard = (props: TaskCardProps) => {
  const { task, deleteTask } = props;

  const taskStatus = useMemo(() => {
    switch (task.task_status) {
      case TaskStatus.Failed: {
        return {
          color: "#f53f3f",
          label: "失败",
        };
      }
      case TaskStatus.NotStarted: {
        return {
          color: "#86909c",
          label: "未开始",
        };
      }
      case TaskStatus.InProgress: {
        return {
          color: "#165dff",
          label: "进行中",
        };
      }
      case TaskStatus.Completed: {
        return {
          color: "#00b42a",
          label: "已完成",
        };
      }
    }
  }, [task.task_status]);

  const clearTask = useMemoizedFn(() => {
    deleteTask(task.task_id).then(() => {
      Message.success("清除任务成功");
    });
  });

  return (
    <div className="flex flex-col rounded-lg border py-2 px-4">
      <div className="flex items-center">
        <div className="flex-1 overflow-hidden ">
          <TextRender className="text-[16px] font-bold" text={task.task_name} />
        </div>
        {task.task_status === TaskStatus.Completed ||
        task.task_status === TaskStatus.Failed ? (
          <Popconfirm title="确认删除这个任务？" onOk={clearTask}>
            <MdClear className="cursor-pointer" />
          </Popconfirm>
        ) : null}
      </div>

      <div
        className={classNames(
          "flex gap-2",
          task.task_status === TaskStatus.InProgress ? " mb-2" : ""
        )}
      >
        <Tag color="arcoblue">
          {task.task_type === TaskType.DownloadTask && "下载任务"}
          {task.task_type === TaskType.UploadTask && "上传任务"}
        </Tag>
        <Tag color={taskStatus.color}>{taskStatus.label}</Tag>
      </div>
      {task.task_status === TaskStatus.InProgress && (
        <Progress percent={Math.round(task.task_progress * 100)} />
      )}
    </div>
  );
};

export default TaskCard;
