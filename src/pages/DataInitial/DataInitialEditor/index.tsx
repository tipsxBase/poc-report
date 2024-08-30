import { Form, Input, Message } from "@arco-design/web-react";
import DataInitialCard from "./DataInitialCard";
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
      task_config: [
        {
          task_type: DataInitialTaskType.DATABASE_INITIAL,
        },
        {
          task_type: DataInitialTaskType.DATA_INITIAL,
          clear_data: false,
          num_of_thread: 10,
          batch: 1000,
          seller_number: 10,
          seller_to_brand: 10,
          brand_to_product: 100,
          product_to_order: 1000,
          category_number: 1000,
          user_number: 100000,
        },
      ],
    };
  }, [action, rawEntity]);

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
            <Form.List field="task_config">
              {(fields) => {
                return (
                  <div className="flex flex-col gap-4">
                    {fields.map((field) => (
                      <DataInitialCard
                        key={field.key}
                        parentField={field.field}
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
