import {
  Button,
  Divider,
  Empty,
  Form,
  Input,
  Message,
  Pagination,
  Space,
} from "@arco-design/web-react";
import styles from "./index.module.less";
import { useMemoizedFn, useMount } from "ahooks";
import ListSearchLayout from "@/components/ListSearchLayout";
import { IconPlus, IconRefresh, IconSearch } from "@arco-design/web-react/icon";
import CategorySelectIncludeBuiltIn from "@/components/CategorySelectIncludeBuiltIn";
import LuBanDrawer from "@/components/LuBanDrawer";
import DataInitialEditor, {
  DataInitialEditorInstance,
} from "./DataInitialEditor";
import { useMemo, useRef, useState } from "react";
import UseInitialStore, { DataInitialTaskType } from "@/stores/initial";
import Scrollbars from "react-custom-scrollbars-2";
import DataInitialCard from "./DataInitialCard";
import { InitialTaskEntity } from "@/service/initial_task";
import DataInitialScript from "./DataInitialScript";
import { dialog } from "@tauri-apps/api";
import { generateShellScript, generateYmlScript } from "@/shared/script";
import useCategoryStore from "@/stores/category";
import { ServerEntity } from "@/service/server";

export type DataInitialAction = "add" | "update" | "copy" | "viewScript";

const EditorAction = ["add", "copy", "update"];

/**
 *
 */
const DataInitial = () => {
  const [form] = Form.useForm();
  const [action, setAction] = useState<DataInitialAction>();

  const {
    records,
    pagination,
    fetchTaskList,
    onPaginationChange,
    resetPagination,
    insertInitialTask,
    deleteInitialTask,
    updateInitialTask,
    downloadScript,
    uploadScript,
  } = UseInitialStore();

  const { queryRefServer } = useCategoryStore();

  const rawEntityRef = useRef<InitialTaskEntity>();
  const rawServerRef = useRef<ServerEntity>();
  const DataInitialEditorInstance = useRef<DataInitialEditorInstance>();

  const doSearch = useMemoizedFn(() => {
    const values = form.getFieldsValue();
    fetchTaskList(values);
  });

  const doReset = useMemoizedFn(() => {
    form.resetFields();
    doSearch();
  });

  useMount(() => {
    doSearch();
  });

  const onAdd = useMemoizedFn(() => {
    setAction("add");
  });

  const onClose = useMemoizedFn(() => {
    setAction(undefined);
  });

  const onPaginationUpdate = useMemoizedFn(
    (pageNumber: number, pageSize: number) => {
      onPaginationChange(pageNumber, pageSize);
      doSearch();
    }
  );

  const editorDrawerTitle = useMemo(() => {
    switch (action) {
      case "add":
        return "新建初始化任务";
      case "copy":
        return "复制初始化任务";
      case "update":
        return "修改初始化任务";
      case "viewScript": {
        return "查看脚本";
      }
      default: {
        return "";
      }
    }
  }, [action]);

  const onConfirm = useMemoizedFn(() => {
    DataInitialEditorInstance.current.getValues().then((values) => {
      if (action === "add" || action === "copy") {
        insertInitialTask(values).then(() => {
          Message.success("添加成功");
          resetPagination();
          onClose();
          doSearch();
        });
      } else if (action === "update") {
        values.task_id = rawEntityRef.current.task_id;
        updateInitialTask(values).then(() => {
          Message.success("修改成功");
          onClose();
          doSearch();
        });
      }
    });
  });

  const onUpdate = useMemoizedFn((entity: InitialTaskEntity) => {
    rawEntityRef.current = entity;
    setAction("update");
  });

  const onCopy = useMemoizedFn((entity: InitialTaskEntity) => {
    rawEntityRef.current = entity;
    setAction("copy");
  });

  const onDelete = useMemoizedFn((entity: InitialTaskEntity) => {
    deleteInitialTask(entity).then(() => {
      Message.success("删除成功");
      resetPagination();
      doSearch();
    });
  });

  const onViewScript = useMemoizedFn((entity: InitialTaskEntity) => {
    rawEntityRef.current = entity;

    queryServer(entity.category_id).then((res) => {
      const { data } = res;
      rawServerRef.current = data;
      setAction("viewScript");
    });
  });

  const getScript = useMemoizedFn(async (entity: InitialTaskEntity) => {
    let config: any[];
    try {
      config = JSON.parse(JSON.parse(entity.task_config));
    } catch (error) {
      /* empty */
      config = [] as any;
    }

    const { data: server } = await queryRefServer(entity.category_id);

    const database = config.find(
      (c) => c.task_type === DataInitialTaskType.DATABASE_INITIAL
    );

    const script = config.reduce((prev, current) => {
      const { task_type } = current;
      if (task_type === DataInitialTaskType.DATABASE_INITIAL) {
        prev[`${task_type}.sh`] = generateShellScript(current);
      } else if (task_type === DataInitialTaskType.DATA_INITIAL) {
        prev[`${task_type}.yml`] = generateYmlScript(current, database, server);
      }
      return prev;
    }, {});

    return script;
  });

  const onDownload = useMemoizedFn(async (entity: InitialTaskEntity) => {
    // 选择下载目录
    const selectedDirectory = await dialog.open({
      directory: true,
      multiple: false,
      title: "选择下载目录",
    });

    const script = await getScript(entity);

    await downloadScript(script, selectedDirectory as string, "数据初始化脚本");
    Message.success("脚本下载成功。");
  });

  const onUpload = useMemoizedFn(async (entity: InitialTaskEntity) => {
    const script = await getScript(entity);
    await uploadScript(script);
    Message.success("脚本上传成功。");
  });

  const queryServer = useMemoizedFn((category_id) => {
    return queryRefServer(category_id);
  });

  return (
    <>
      <div className={styles.dataInitial}>
        <Form
          className="has-divider"
          form={form}
          onSubmit={doSearch}
          autoComplete="off"
        >
          <ListSearchLayout
            cols={{
              xs: 2,
              sm: 2,
              md: 2,
              lg: 2,
              xl: 2,
              xxl: 2,
            }}
            submitButton={
              <>
                <Button htmlType="submit" type="primary" icon={<IconSearch />}>
                  搜 索
                </Button>
                <Button
                  type="secondary"
                  onClick={doReset}
                  icon={<IconRefresh />}
                >
                  重 置
                </Button>
              </>
            }
          >
            <Form.Item label="归属项目" field="category_id">
              <CategorySelectIncludeBuiltIn />
            </Form.Item>
            <Form.Item label="任务名称" field="task_name">
              <Input placeholder="任务名称" />
            </Form.Item>
          </ListSearchLayout>
        </Form>
        <Divider type="horizontal" />
        <div className="flex-1 overflow-hidden flex flex-col gap-4">
          <Space>
            <Button onClick={onAdd} type="primary" icon={<IconPlus />}>
              新建初始化任务
            </Button>
          </Space>
          <div className="flex-1 overflow-hidden flex flex-col">
            <div className="flex-1 overflow-hidden">
              {records && records.length > 0 ? (
                <Scrollbars>
                  <div className="flex flex-col gap-2">
                    {records.map((task) => (
                      <DataInitialCard
                        onUpdate={onUpdate}
                        onCopy={onCopy}
                        onDelete={onDelete}
                        onViewScript={onViewScript}
                        onDownload={onDownload}
                        onUpload={onUpload}
                        key={task.task_id}
                        entity={task}
                      />
                    ))}
                  </div>
                </Scrollbars>
              ) : (
                <Empty />
              )}
            </div>
            <div className="flex justify-end">
              <Pagination
                showTotal
                size="small"
                showJumper
                sizeCanChange
                onChange={onPaginationUpdate}
                total={pagination.total}
                pageSize={pagination.pageSize}
                current={pagination.current}
              />
            </div>
          </div>
        </div>
      </div>
      <LuBanDrawer
        title={editorDrawerTitle}
        onCancel={onClose}
        width={EditorAction.includes(action) ? 640 : 1200}
        visible={!!action}
        unmountOnExit
        onOk={onConfirm}
        footer={EditorAction.includes(action) ? undefined : null}
        bodyStyle={{ padding: 0 }}
      >
        {EditorAction.includes(action) ? (
          <DataInitialEditor
            action={action}
            ref={DataInitialEditorInstance}
            rawEntity={rawEntityRef.current}
          />
        ) : action === "viewScript" ? (
          <DataInitialScript
            onDownload={onDownload}
            serverEntity={rawServerRef.current}
            rawEntity={rawEntityRef.current}
          />
        ) : null}
      </LuBanDrawer>
    </>
  );
};

export default DataInitial;
