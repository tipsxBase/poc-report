import {
  Button,
  Divider,
  Form,
  Input,
  Link,
  Message,
  Popconfirm,
  Space,
  Table,
} from "@arco-design/web-react";
import styles from "./index.module.less";
import ListSearchLayout from "@/components/ListSearchLayout";
import { useMemoizedFn, useMount } from "ahooks";
import { IconPlus, IconRefresh, IconSearch } from "@arco-design/web-react/icon";
import { useMemo, useRef, useState } from "react";
import { ColumnProps } from "@arco-design/web-react/es/Table";
import useDdlStore from "@/stores/ddl";
import { DdlEntity } from "@/service/ddl";
import DdlEditor, { DdlEditorInstance } from "./DdlEditor";
import LuBanDrawer from "@/components/LuBanDrawer";
import CategorySelectIncludeBuiltIn from "@/components/CategorySelectIncludeBuiltIn";
import { dialog, invoke } from "@tauri-apps/api";
import { isBuildInCategory } from "@/shared/isBuildInCategory";
/**
 *
 */
const BusinessManage = () => {
  const [form] = Form.useForm();
  const [action, setAction] = useState<"update" | "add">();
  const rawEntityRef = useRef<DdlEntity>();
  const ddlEditorInstance = useRef<DdlEditorInstance>();
  const {
    records,
    pagination,
    fetchDdlList,
    onPaginationChange,
    deleteDdl,
    resetPagination,
    insertDdl,
    updateDdl,
    uploadDdl,
  } = useDdlStore();

  const doSearch = useMemoizedFn(() => {
    const values = form.getFieldsValue();
    fetchDdlList(values);
  });

  const onReset = useMemoizedFn(() => {
    form.resetFields();
    doSearch();
  });

  const onUpdate = useMemoizedFn((row: DdlEntity) => {
    setAction("update");
    rawEntityRef.current = row;
  });

  const doDelete = useMemoizedFn((row: DdlEntity) => {
    deleteDdl(row).then(() => {
      Message.success("删除成功");
      resetPagination();
      doSearch();
    });
  });

  const doConfirm = useMemoizedFn(() => {
    ddlEditorInstance.current.getValues().then((res) => {
      if (action === "add") {
        insertDdl(res).then(() => {
          Message.success("新建成功");
          resetPagination();
          doSearch();
          clearAction();
        });
      } else {
        res.ddl_id = rawEntityRef.current.ddl_id;
        updateDdl(res).then(() => {
          Message.success("修改成功");
          doSearch();
          clearAction();
        });
      }
    });
  });

  const onDownload = useMemoizedFn(async (entity: DdlEntity) => {
    const { ddl_name, ddl_content } = entity;
    // 选择下载目录
    const selectedDirectory = await dialog.open({
      directory: true,
      multiple: false,
      title: "选择下载目录",
    });

    const fileName = `${selectedDirectory}/${ddl_name}.sql`;
    await invoke("download_file", {
      fileName: fileName,
      content: ddl_content,
    });
    Message.success(`文件下载成功->${fileName}`);
  });

  const onUpload = useMemoizedFn((entity: DdlEntity) => {
    const { ddl_name, ddl_content } = entity;
    uploadDdl(ddl_name, ddl_content).then((res) => {
      if ((res as any) > 0) {
        Message.success("上传成功");
      }
    });
  });

  useMount(() => {
    doSearch();
  });

  const columns = useMemo<ColumnProps[]>(() => {
    return [
      {
        dataIndex: "__seriesNumber__",
        title: "序号",
        key: "__seriesNumber__",
        width: 100,
      },
      {
        dataIndex: "category_name",
        title: "项目名称",
        key: "category_name",
      },
      {
        dataIndex: "ddl_name",
        title: "脚本名称",
        key: "ddl_name",
      },
      {
        dataIndex: "action",
        title: "操作",
        key: "action",
        width: 280,
        render: (_, item) => {
          return (
            <Space>
              <Link
                disabled={isBuildInCategory(item.category_type)}
                onClick={() => onUpdate(item)}
              >
                修改
              </Link>
              <Popconfirm title="确认删除？" onOk={() => doDelete(item)}>
                <Link disabled={isBuildInCategory(item.category_type)}>
                  删除
                </Link>
              </Popconfirm>
              <Link onClick={() => onUpload(item)}>上传至当前环境</Link>
              <Link onClick={() => onDownload(item)}>下载</Link>
            </Space>
          );
        },
      },
    ];
  }, [doDelete, onDownload, onUpdate, onUpload]);

  const onPaginationUpdate = useMemoizedFn(
    (pageNumber: number, pageSize: number) => {
      onPaginationChange(pageNumber, pageSize);
      doSearch();
    }
  );

  const onAddDdl = useMemoizedFn(() => {
    setAction("add");
  });

  const clearAction = useMemoizedFn(() => {
    setAction(null);
    rawEntityRef.current = null;
  });

  const editorTitle = useMemo(() => {
    if (action === "add") {
      return "新建脚本";
    } else if (action === "update") {
      return "修改脚本";
    }
    return "";
  }, [action]);

  return (
    <div className={styles.ddlManage}>
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
              <Button type="secondary" onClick={onReset} icon={<IconRefresh />}>
                重 置
              </Button>
            </>
          }
        >
          <Form.Item label="归属项目" field="category_id">
            <CategorySelectIncludeBuiltIn />
          </Form.Item>
          <Form.Item label="脚本名称" field="ddl_name">
            <Input placeholder="脚本名称" />
          </Form.Item>
        </ListSearchLayout>
      </Form>
      <Divider type="horizontal" />
      <div>
        <Button onClick={onAddDdl} icon={<IconPlus />} type="primary">
          新建脚本
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
          rowKey="ddl_id"
          columns={columns}
        />
      </div>
      <LuBanDrawer
        title={editorTitle}
        width={1200}
        visible={!!action}
        onCancel={clearAction}
        unmountOnExit
        onOk={doConfirm}
      >
        <DdlEditor
          ref={ddlEditorInstance}
          action={action}
          rawEntity={rawEntityRef.current}
        />
      </LuBanDrawer>
    </div>
  );
};

export default BusinessManage;
