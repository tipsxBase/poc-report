import {
  Button,
  Form,
  FormInstance,
  Input,
  InputNumber,
  Select,
  Switch,
} from "@arco-design/web-react";
import styles from "./index.module.less";
import { toFormPath } from "@/shared/path";
import { useMemo } from "react";
import { IconDelete, IconPlus } from "@arco-design/web-react/icon";
import TaskUnit from "./components/TaskUnit";
import { useMemoizedFn } from "ahooks";
import { useConfig } from "../../../../ConfigContext";
import { GlobalPreProcessor, Tasklet } from "../../../../sharedType";
import { randomId } from "@/shared/randomId";

export interface JobExecutorProps {
  parentField: string;
  form: FormInstance<any>;
  removeJob: (jobId: string) => void;
}

/**
 *
 */
const JobExecutor = (props: JobExecutorProps) => {
  const { form, parentField, removeJob } = props;

  const { getConfig } = useConfig();
  const id = useMemo(() => {
    return form.getFieldValue(toFormPath(parentField, "id"));
  }, [form, parentField]);

  const addTasklet = useMemoizedFn(() => {
    const formField = toFormPath(parentField, "taskletQueue");
    let taskletQueue: Tasklet[] = form.getFieldValue(formField);
    if (!taskletQueue) {
      taskletQueue = [];
    }
    const tasklet: Tasklet = {
      name: undefined,
      loopCount: 0,
      id: randomId("task"),
      numOfThread: 0,
      mockDataLine: {
        batch: 1,
        dataDefineList: [],
      },
      processors: [],
    };
    taskletQueue.push(tasklet);
    form.setFieldValue(formField, taskletQueue);
  });

  const globalPreProcessorsOptions = useMemo(() => {
    const _globalPreProcessors: GlobalPreProcessor[] = getConfig(
      "globalPreProcessors"
    );
    if (!_globalPreProcessors) {
      return [];
    }
    return _globalPreProcessors.map(({ id, name }) => {
      return {
        label: name,
        value: id,
      };
    });
  }, [getConfig]);

  const getRefGlobals = useMemoizedFn(() => {
    const refGlobals =
      form.getFieldValue(toFormPath(parentField, "refGlobals")) || [];
    return globalPreProcessorsOptions.filter((g) =>
      refGlobals.includes(g.value)
    );
  });

  return (
    <div className={styles.jobExecutor}>
      <div className={styles.formWrapper}>
        <Form.Item hidden field={toFormPath(parentField, "id")}>
          <Input />
        </Form.Item>
        <Form.Item
          rules={[
            {
              required: true,
              message: "Job名称不能为空",
            },
          ]}
          label="Job名称"
          field={toFormPath(parentField, "name")}
        >
          <Input placeholder="请输入Job名称" />
        </Form.Item>
        <Form.Item
          label="线程数"
          field={toFormPath(parentField, "numOfThread")}
        >
          <InputNumber placeholder="请输入Job名称" min={1} />
        </Form.Item>
        <Form.Item
          label="线程暂停时间"
          field={toFormPath(parentField, "pauseTime")}
        >
          <InputNumber placeholder="暂停时间" suffix="ms" min={0} />
        </Form.Item>
        <Form.Item
          label="是否启用"
          field={toFormPath(parentField, "enable")}
          triggerPropName="checked"
        >
          <Switch />
        </Form.Item>
        <Form.Item
          label="全局预处理"
          field={toFormPath(parentField, "refGlobals")}
        >
          <Select
            mode="multiple"
            options={globalPreProcessorsOptions}
            placeholder="请选择全局处理器"
          />
        </Form.Item>
        <Form.Item label="执行单元定义">
          <div>
            <div className={styles.resultOperation}>
              <Button onClick={addTasklet} type="outline" icon={<IconPlus />}>
                添加执行单元
              </Button>
            </div>
            <div className={styles.taskletQueue}>
              <Form.List field={toFormPath(parentField, "taskletQueue")}>
                {(fields, { remove }) => {
                  return fields.map((item, index) => {
                    return (
                      <TaskUnit
                        form={form}
                        parentField={item.field}
                        key={item.key}
                        remove={() => remove(index)}
                        getRefGlobals={getRefGlobals}
                      />
                    );
                  });
                }}
              </Form.List>
            </div>
          </div>
        </Form.Item>
      </div>
      <div className={styles.operationWrapper}>
        <Button onClick={() => removeJob(id)}>
          <IconDelete />
        </Button>
      </div>
    </div>
  );
};

export default JobExecutor;
