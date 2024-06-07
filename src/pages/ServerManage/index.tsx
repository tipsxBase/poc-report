import {
  Button,
  Divider,
  Drawer,
  Form,
  Input,
  Link,
  Message,
  Popconfirm,
  Space,
  Table,
  Tag,
  Tooltip,
} from "@arco-design/web-react";
import styles from "./index.module.less";
import {
  IconInfoCircleFill,
  IconPlus,
  IconRefresh,
  IconSearch,
} from "@arco-design/web-react/icon";
import { useEffect, useMemo, useRef, useState } from "react";
import { useMemoizedFn, useMount } from "ahooks";
import { ColumnProps } from "@arco-design/web-react/es/Table";
import { ServerEntity } from "@/service/server";
import ListSearchLayout from "@/components/ListSearchLayout";
import useServerStore from "@/stores/server";
import ServerEditor, { ServerEditorInstance } from "./ServerEditor";
import { listen } from "@tauri-apps/api/event";
import CategorySelectIncludeBuiltIn from "@/components/CategorySelectIncludeBuiltIn";

/**
 * 用例管理
 */
const ServerManage = () => {
  const [form] = Form.useForm();
  const [action, setAction] = useState<"update" | "add">();
  const rawEntityRef = useRef<ServerEntity>();
  const serverEditorInstance = useRef<ServerEditorInstance>();

  const {
    records,
    pagination,
    fetchServerList,
    onPaginationChange,
    deleteServer,
    resetPagination,
    insertServer,
    updateServer,
    updateCheckDefaultServer,
    initServer,
  } = useServerStore();

  const doSearch = useMemoizedFn(() => {
    const values = form.getFieldsValue();

    fetchServerList(values);
  });

  const onReset = useMemoizedFn(() => {
    form.resetFields();
    doSearch();
  });

  const onUpdate = useMemoizedFn((row: ServerEntity) => {
    setAction("update");
    rawEntityRef.current = row;
  });

  const doDelete = useMemoizedFn((row: ServerEntity) => {
    deleteServer(row).then(() => {
      Message.success("删除成功");
      resetPagination();
      doSearch();
    });
  });

  const doConfirm = useMemoizedFn(() => {
    serverEditorInstance.current.getValues().then((res) => {
      if (action === "add") {
        insertServer(res).then(() => {
          Message.success("新建成功");
          resetPagination();
          doSearch();
          clearAction();
        });
      } else {
        res.server_id = rawEntityRef.current.category_id;
        updateServer(res).then(() => {
          Message.success("修改成功");
          resetPagination();
          doSearch();
          clearAction();
        });
      }
    });
  });

  useEffect(() => {
    const listenPromise = listen("event", (event) => {
      console.log("event -> ", event);
    });
    return () => {
      listenPromise.then((f) => f());
    };
  }, []);

  useMount(() => {
    doSearch();
  });

  const updateCheckDefault = useMemoizedFn((entity: ServerEntity) => {
    updateCheckDefaultServer(entity.server_id).then(() => {
      Message.success("更新成功");
      doSearch();
    });
  });

  const doServerInitial = useMemoizedFn((entity: ServerEntity) => {
    initServer(entity.server_id).then(() => {
      Message.success("初始化成功");
    });
  });

  const columns = useMemo<ColumnProps[]>(() => {
    return [
      {
        dataIndex: "__seriesNumber__",
        title: "序号",
        key: "__seriesNumber__",
        width: 80,
      },
      {
        dataIndex: "category_name",
        title: "项目名称",
        key: "category_name",
      },
      {
        dataIndex: "server_name",
        title: "服务名称",
        key: "server_name",
      },
      {
        dataIndex: "server_address",
        title: "服务地址",
        key: "server_address",
        render: (_, item) => {
          return (
            <span>
              {item.host}:{item.port}
            </span>
          );
        },
      },
      {
        dataIndex: "is_default",
        title: (
          <span>
            是否默认服务
            <Tooltip content="用例执行时默认会使用此服务，只能指定一个默认服务">
              <IconInfoCircleFill />
            </Tooltip>
          </span>
        ),
        width: 150,
        key: "is_default",
        render: (is_default) => {
          if (is_default === 0) {
            return <Tag>否</Tag>;
          }
          if (is_default === 1) {
            return <Tag color="arcoblue">是</Tag>;
          }
        },
      },
      {
        dataIndex: "initial_state",
        title: "是否初始化",
        key: "initial_state",
        width: 120,
        render: (initial_state) => {
          if (initial_state === 0) {
            return <Tag>示初始化</Tag>;
          }
          if (initial_state === 1) {
            return <Tag color="arcoblue">已初始化</Tag>;
          }
        },
      },

      {
        dataIndex: "action",
        title: "操作",
        key: "action",
        width: 300,
        render: (_, item) => {
          return (
            <Space
              split={<Divider style={{ margin: "0 4px" }} type="vertical" />}
            >
              <Link onClick={() => onUpdate(item)}>修改</Link>
              <Tooltip content="初始化会在服务器上创建相应的服务并且上传测试Jar包、JDK。">
                <Link onClick={() => doServerInitial(item)}>初始化</Link>
              </Tooltip>
              <Link onClick={() => updateCheckDefault(item)}>设为默认服务</Link>
              <Popconfirm title="确认删除？" onOk={() => doDelete(item)}>
                <Link>删除</Link>
              </Popconfirm>
            </Space>
          );
        },
      },
    ];
  }, [doDelete, doServerInitial, onUpdate, updateCheckDefault]);

  const onPaginationUpdate = useMemoizedFn(
    (pageNumber: number, pageSize: number) => {
      onPaginationChange(pageNumber, pageSize);
      doSearch();
    }
  );

  const onAddCase = useMemoizedFn(() => {
    setAction("add");
  });

  const clearAction = useMemoizedFn(() => {
    setAction(null);
    rawEntityRef.current = null;
  });

  const editorTitle = useMemo(() => {
    if (action === "add") {
      return "新建服务";
    } else if (action === "update") {
      return "修改服务";
    }
    return "";
  }, [action]);

  return (
    <div className={styles.serverManage}>
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
              <Button htmlType="submit" type="outline" icon={<IconSearch />}>
                搜 索
              </Button>
              <Button type="secondary" onClick={onReset} icon={<IconRefresh />}>
                重 置
              </Button>
            </>
          }
        >
          <Form.Item label="归属项目" field="category_id">
            <CategorySelectIncludeBuiltIn />
          </Form.Item>
          <Form.Item label="用例名称" field="case_name">
            <Input placeholder="用例名称" />
          </Form.Item>
        </ListSearchLayout>
      </Form>
      <Divider type="horizontal" />
      <div>
        <Button onClick={onAddCase} icon={<IconPlus />}>
          新建服务
        </Button>
      </div>
      <div className={styles.table}>
        <Table
          data={records}
          pagination={{
            pageSize: pagination.pageSize,
            total: pagination.total,
            current: pagination.current,
            showJumper: true,
            showTotal: true,
            sizeCanChange: true,
            onChange: onPaginationUpdate,
            size: "small",
          }}
          scroll={{ y: true }}
          rowKey="server_id"
          columns={columns}
        />
      </div>
      <Drawer
        visible={!!action}
        title={editorTitle}
        onCancel={clearAction}
        onOk={doConfirm}
        unmountOnExit
        width={640}
      >
        <ServerEditor
          action={action}
          ref={serverEditorInstance}
          rawEntity={rawEntityRef.current}
        />
      </Drawer>
    </div>
  );
};

export default ServerManage;
