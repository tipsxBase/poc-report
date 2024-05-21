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
} from "@arco-design/web-react";
import styles from "./index.module.less";
import ListSearchLayout from "@/components/ListSearchLayout";
import { useMemoizedFn, useMount } from "ahooks";
import { IconPlus, IconRefresh, IconSearch } from "@arco-design/web-react/icon";
import { useMemo, useRef, useState } from "react";
import { ColumnProps } from "@arco-design/web-react/es/Table";
import useCategoryStore from "@/stores/category";
import { CategoryEntity, updateCategory } from "@/service/category";
import BusinessEditor, { BusinessEditorInstance } from "./BusinessEditor";

/**
 *
 */
const BusinessManage = () => {
  const [form] = Form.useForm();
  const [action, setAction] = useState<"update" | "add">();
  const rawEntityRef = useRef<CategoryEntity>();
  const businessEditorInstance = useRef<BusinessEditorInstance>();
  const {
    records,
    pagination,
    fetchCategoryList,
    onPaginationChange,
    deleteCategory,
    resetPagination,
    insertCategory,
  } = useCategoryStore();

  const doSearch = useMemoizedFn(() => {
    const values = form.getFieldsValue();
    fetchCategoryList(values);
  });

  const onReset = useMemoizedFn(() => {});

  const onUpdate = useMemoizedFn((row: CategoryEntity) => {
    setAction("update");
    rawEntityRef.current = row;
  });

  const doDelete = useMemoizedFn((row: CategoryEntity) => {
    deleteCategory(row).then(() => {
      Message.success("删除成功");
      resetPagination();
      doSearch();
    });
  });

  const doConfirm = useMemoizedFn(() => {
    businessEditorInstance.current.getValues().then((res) => {
      console.log(res);
      if (action === "add") {
        insertCategory(res).then(() => {
          Message.success("新建成功");
          resetPagination();
          doSearch();
          clearAction();
        });
      } else {
        res.category_id = rawEntityRef.current.category_id;
        updateCategory(res).then(() => {
          Message.success("修改成功");
          resetPagination();
          doSearch();
          clearAction();
        });
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
        dataIndex: "action",
        title: "操作",
        key: "action",
        width: 120,
        render: (_, item) => {
          return (
            <Space>
              <Link
                disabled={item.category_type === 1}
                onClick={() => onUpdate(item)}
              >
                修改
              </Link>
              <Popconfirm title="确认删除？" onOk={() => doDelete(item)}>
                <Link disabled={item.category_type === 1}>删除</Link>
              </Popconfirm>
            </Space>
          );
        },
      },
    ];
  }, [doDelete, onUpdate]);

  const onPaginationUpdate = useMemoizedFn(
    (pageNumber: number, pageSize: number) => {
      onPaginationChange(pageNumber, pageSize);
      doSearch();
    }
  );

  const onAddCategory = useMemoizedFn(() => {
    setAction("add");
  });

  const clearAction = useMemoizedFn(() => {
    setAction(null);
    rawEntityRef.current = null;
  });

  const editorTitle = useMemo(() => {
    if (action === "add") {
      return "新建项目";
    } else if (action === "update") {
      return "修改项目";
    }
    return "";
  }, [action]);

  return (
    <div className={styles.businessManage}>
      <Form
        className="has-divider"
        form={form}
        onSubmit={doSearch}
        autoComplete="off"
      >
        <ListSearchLayout
          cols={{
            xs: 1,
            sm: 1,
            md: 1,
            lg: 1,
            xl: 1,
            xxl: 1,
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
          <Form.Item label="项目名称" field="category_name">
            <Input placeholder="项目名称" />
          </Form.Item>
        </ListSearchLayout>
      </Form>
      <Divider type="horizontal" />
      <div>
        <Button onClick={onAddCategory} icon={<IconPlus />} type="outline">
          新建项目
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
          rowKey="category_id"
          columns={columns}
        />
      </div>
      <Drawer
        title={editorTitle}
        width={640}
        visible={!!action}
        onCancel={clearAction}
        unmountOnExit
        onOk={doConfirm}
      >
        <BusinessEditor
          ref={businessEditorInstance}
          action={action}
          rawEntity={rawEntityRef.current}
        />
      </Drawer>
    </div>
  );
};

export default BusinessManage;
