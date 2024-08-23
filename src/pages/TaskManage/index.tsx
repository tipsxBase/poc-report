import useTaskStore, { taskStatusOption, taskTypeOption } from "@/stores/task";
import {
  Empty,
  Form,
  Grid,
  Pagination,
  Popconfirm,
  Select,
  Spin,
} from "@arco-design/web-react";
import { useMemoizedFn, useMount } from "ahooks";
import Scrollbars from "react-custom-scrollbars-2";
import TaskCard from "./TaskCard";
import { GrRefresh } from "react-icons/gr";
import { MdDeleteSweep } from "react-icons/md";
import TButton from "@/components/TButton";

const { Row, Col } = Grid;

const TaskManage = () => {
  const {
    records,
    fetchTaskList,
    loading,
    pagination,
    deleteCompletedTask,
    resetPagination,
    deleteTask,
  } = useTaskStore();
  const [form] = Form.useForm();
  const doSearch = useMemoizedFn(() => {
    const values = form.getFieldsValue();
    fetchTaskList(values);
  });

  useMount(() => {
    doSearch();
  });

  const doClear = useMemoizedFn(() => {
    deleteCompletedTask().then(() => {
      resetPagination();
      doSearch();
    });
  });

  const doDeleteTask = useMemoizedFn((taskId: number) => {
    return deleteTask(taskId).then(() => {
      resetPagination();
      doSearch();
    });
  });

  return (
    <div className="w-[300px] h-[500px]  flex flex-col">
      <div className="flex items-center justify-between p-4">
        <span className="text-xl font-semibold">任务中心</span>
        <div className="flex gap-2">
          <Popconfirm title="确认清除已经完成和失败的任务" onOk={doClear}>
            <TButton
              tooltip="清除已完成的任务"
              className="flex items-center justify-center"
              icon={<MdDeleteSweep />}
            />
          </Popconfirm>

          <TButton
            tooltip="刷新"
            className="flex items-center justify-center"
            icon={<GrRefresh />}
            onClick={doSearch}
          />
        </div>
      </div>
      <Form
        className="px-4"
        form={form}
        wrapperCol={{ span: 24 }}
        onValuesChange={doSearch}
      >
        <Row gutter={8}>
          <Col span={12}>
            <Form.Item field="task_status">
              <Select
                className="w-full"
                placeholder="任务状态"
                allowClear
                options={taskStatusOption}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item field="task_type">
              <Select
                className="w-full"
                placeholder="任务类型"
                allowClear
                options={taskTypeOption}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <div className="flex-1 flex flex-col overflow-hidden items-center justify-center">
        {loading ? (
          <Spin />
        ) : (
          <Scrollbars>
            <div className="flex flex-col gap-2 px-4">
              {records && records.length > 0 ? (
                records.map((item) => (
                  <TaskCard
                    deleteTask={doDeleteTask}
                    key={item.task_id}
                    task={item}
                  />
                ))
              ) : (
                <Empty />
              )}
            </div>
          </Scrollbars>
        )}
      </div>
      <div className="py-2 px-4 text-right flex justify-end">
        <Pagination
          showTotal
          size="small"
          total={pagination.total}
          pageSize={pagination.pageSize}
          current={pagination.current}
        />
      </div>
    </div>
  );
};

export default TaskManage;
