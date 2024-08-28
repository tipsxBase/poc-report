import { Button, Form, Input, Message } from "@arco-design/web-react";
import { GrTask } from "react-icons/gr";
import DataInitialCard from "./DataInitialCard";
import { useMemoizedFn } from "ahooks";
import { forwardRef, useImperativeHandle, useMemo } from "react";
import DataInitialContext from "./DataInitialContext";
import { DataInitialTaskType } from "@/stores/initial";
import { DataInitialAction } from "..";
import CategorySelect from "@/components/CategorySelect";
import Scrollbars from "react-custom-scrollbars-2";
import { InitialTaskEntity } from "@/service/initial_task";
import classNames from "classnames";
import styles from "./index.module.less";

export interface DataInitialEditorProps {
  action: DataInitialAction;
  rawEntity: InitialTaskEntity;
}

export interface DataInitialEditorInstance {
  getValues: () => Promise<InitialTaskEntity>;
}

/**
 *
 */
const DataInitialEditor = forwardRef<
  DataInitialEditorInstance,
  DataInitialEditorProps
>((props, ref) => {
  const { action, rawEntity } = props;

  const [form] = Form.useForm();

  const initialValues = useMemo(() => {
    if (action === "copy" || action === "update") {
      const values: InitialTaskEntity = {
        task_name: rawEntity.task_name,
        category_id: rawEntity.category_id,
        task_description: rawEntity.task_description,
      };
      try {
        values.task_config = JSON.parse(JSON.parse(rawEntity.task_config));
      } catch (error) {
        /* empty */
        values.task_config = [] as any;
      }
      return values;
    }
    return {
      task_name: undefined,
      category_id: undefined,
      task_description: undefined,
      task_config: [],
    };
  }, [action, rawEntity]);

  const addTask = useMemoizedFn(() => {
    let task_config = form.getFieldValue("task_config");
    if (!task_config) {
      task_config = [];
    }
    task_config.push({
      task_type: DataInitialTaskType.DATABASE_INITIAL,
    });

    form.setFieldValue("task_config", task_config);
  });

  const providerValue = useMemo(() => {
    return {
      form,
    };
  }, [form]);

  useImperativeHandle(
    ref,
    () => {
      return {
        getValues: () => {
          return form.validate().then((values: InitialTaskEntity) => {
            const { task_config, ...rest } = values;
            if (!task_config || task_config.length === 0) {
              Message.warning("请添加任务");
              return Promise.reject("请添加任务");
            }
            return {
              ...rest,
              task_config: JSON.stringify(JSON.stringify(task_config)),
            };
          });
        },
      };
    },
    [form]
  );

  return (
    <Scrollbars>
      <div
        className={classNames(
          styles.dataInitialEditor,
          "flex flex-col gap-2 px-3 py-4"
        )}
      >
        <Form form={form} initialValues={initialValues}>
          <DataInitialContext.Provider value={providerValue}>
            <Form.Item
              label="任务名称"
              field="task_name"
              rules={[{ required: true, message: "请输入任务名称" }]}
            >
              <Input placeholder="任务名称" />
            </Form.Item>
            <Form.Item
              field="category_id"
              rules={[{ required: true, message: "请选择项目名称" }]}
              label="项目名称"
            >
              <CategorySelect />
            </Form.Item>
            <Form.Item field="task_description" label="任务描述">
              <Input.TextArea placeholder="请输入任务描述" />
            </Form.Item>
            <div>
              <Button
                className="mb-2"
                icon={<GrTask className="arco-icon" />}
                type="primary"
                onClick={addTask}
              >
                新建任务
              </Button>
            </div>

            <Form.List field="task_config">
              {(fields, { remove }) => {
                return (
                  <div className="flex flex-col gap-4">
                    {fields.map((field, index) => (
                      <DataInitialCard
                        key={field.key}
                        parentField={field.field}
                        onDeleteTask={() => remove(index)}
                      />
                    ))}
                  </div>
                );
              }}
            </Form.List>
          </DataInitialContext.Provider>
        </Form>
      </div>
    </Scrollbars>
  );
});

export default DataInitialEditor;
