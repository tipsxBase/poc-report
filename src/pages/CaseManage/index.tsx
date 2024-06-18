import {
  Button,
  Divider,
  Form,
  Input,
  Link,
  Message,
  Modal,
  Popconfirm,
  Space,
  Table,
  Tooltip,
} from "@arco-design/web-react";
import styles from "./index.module.less";
import {
  IconPlus,
  IconRefresh,
  IconSearch,
  IconUpload,
} from "@arco-design/web-react/icon";
import { useMemo, useRef, useState } from "react";
import { useMemoizedFn, useMount } from "ahooks";
import { ColumnProps } from "@arco-design/web-react/es/Table";
import { CaseEntity, updateCase } from "@/service/case";
import useCaseStore from "@/stores/case";
import ListSearchLayout from "@/components/ListSearchLayout";
import CaseEditor, { CaseEditorInstance } from "./components/CaseEditor";
import CasePreviewer from "./components/CasePreviewer";
import { dialog } from "@tauri-apps/api";
import { invoke } from "@tauri-apps/api/tauri";
import { parseJsonToYml } from "@/shared/yaml";
import UpdateMetric from "./components/UpdateMetric";
import Statics from "./components/Statics";
import ImportConfig, { ImportConfigInstance } from "./components/ImportConfig";
import TableActionColumn from "@/components/TableActionColumn";
import CategorySelectIncludeBuiltIn from "@/components/CategorySelectIncludeBuiltIn";
import LuBanDrawer from "@/components/LuBanDrawer";

/**
 * 用例管理
 */
const CaseManage = () => {
  const [form] = Form.useForm();
  const [action, setAction] = useState<
    | "update"
    | "add"
    | "copy"
    | "view"
    | "uploadResult"
    | "viewUploadResult"
    | "uploadCase"
  >();
  const [uploadCaseVisible, setUploadCaseVisible] = useState(false);
  const rawEntityRef = useRef<CaseEntity>();
  const importConfigInstance = useRef<ImportConfigInstance>();
  const caseEditorInstance = useRef<CaseEditorInstance>();

  const {
    records,
    pagination,
    fetchCaseList,
    onPaginationChange,
    deleteCase,
    resetPagination,
    insertCase,
    runCase,
  } = useCaseStore();

  const doSearch = useMemoizedFn(() => {
    const values = form.getFieldsValue();
    fetchCaseList(values);
  });

  const onReset = useMemoizedFn(() => {
    form.resetFields();
    doSearch();
  });

  const onUpdate = useMemoizedFn((row: CaseEntity) => {
    setAction("update");
    rawEntityRef.current = row;
  });

  const onCopy = useMemoizedFn((row: CaseEntity) => {
    setAction("copy");
    rawEntityRef.current = row;
  });

  const onView = useMemoizedFn((row: CaseEntity) => {
    setAction("view");
    rawEntityRef.current = row;
  });

  const doDelete = useMemoizedFn((row: CaseEntity) => {
    deleteCase(row).then(() => {
      Message.success("删除成功");
      resetPagination();
      doSearch();
    });
  });

  const doConfirm = useMemoizedFn(() => {
    if (action === "view" || action === "viewUploadResult") {
      clearAction();
      return;
    }

    caseEditorInstance.current.getValues().then((res) => {
      const { case_name, case_content, category_id } = res;

      if (action === "add" || action === "copy" || action === "uploadCase") {
        insertCase({
          category_id,
          case_name,
          case_content,
        })
          .then((res) => {
            console.log(res);
            Message.success("新增成功");
            resetPagination();
            clearAction();
            doSearch();
          })
          .catch((err) => {
            Message.error(err);
            console.log("err", err);
          });
      } else if (action === "update") {
        updateCase({
          case_id: rawEntityRef.current.case_id,
          category_id,
          case_name,
          case_content,
        })
          .then((res) => {
            console.log(res);
            Message.success("修改成功");
            clearAction();
            doSearch();
          })
          .catch((err) => {
            Message.error(err);
            console.log("err", err);
          });
      }
    });
  });

  useMount(() => {
    doSearch();
  });

  const onDownload = useMemoizedFn(async (entity: CaseEntity) => {
    const { case_name, case_content } = entity;
    // 选择下载目录
    const selectedDirectory = await dialog.open({
      directory: true,
      multiple: false,
      title: "选择下载目录",
    });

    const fileName = `${selectedDirectory}/${case_name}.yml`;
    await invoke("download_file", {
      fileName: fileName,
      content: parseJsonToYml(JSON.parse(JSON.parse(case_content))),
    });
    Message.success(`文件下载成功->${fileName}`);
  });

  const onUploadResult = useMemoizedFn((row: CaseEntity) => {
    setAction("uploadResult");
    rawEntityRef.current = row;
  });

  const onViewResult = useMemoizedFn((row: CaseEntity) => {
    setAction("viewUploadResult");
    rawEntityRef.current = row;
  });

  const doExecute = useMemoizedFn((row: CaseEntity) => {
    const case_json = JSON.parse(JSON.parse(row.case_content));
    const case_content = parseJsonToYml(case_json);
    runCase(row.case_name, case_content).then(() => {
      Message.success("上传成功。");
    });
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
        dataIndex: "case_name",
        title: "用例名称",
        key: "case_name",
      },
      {
        dataIndex: "action",
        title: "操作",
        key: "action",
        width: 320,
        render: (_, item) => {
          return (
            <TableActionColumn maxDisplayAction={5}>
              <Link onClick={() => onView(item)}>查看</Link>
              <Link onClick={() => onCopy(item)}>复制</Link>
              <Tooltip
                content="系统内置用例不允许修改"
                disabled={item.category_type !== 1}
              >
                <Link
                  disabled={item.category_type === 1}
                  onClick={() => onUpdate(item)}
                >
                  修改
                </Link>
              </Tooltip>
              <Tooltip content="上传至默认服务">
                <Link onClick={() => doExecute(item)}>上传</Link>
              </Tooltip>
              {item.category_type === 1 ? (
                <Tooltip content="系统内置用例不允许删除">
                  <Link disabled>删除</Link>
                </Tooltip>
              ) : (
                <Popconfirm title="确认删除？" onOk={() => doDelete(item)}>
                  <Link>删除</Link>
                </Popconfirm>
              )}

              <Link onClick={() => onDownload(item)}>下载</Link>
              <Link onClick={() => onUploadResult(item)}>上传测试结果</Link>
              <Link onClick={() => onViewResult(item)}>查看测试结果</Link>
            </TableActionColumn>
          );
        },
      },
    ];
  }, [
    doDelete,
    doExecute,
    onCopy,
    onDownload,
    onUpdate,
    onUploadResult,
    onView,
    onViewResult,
  ]);

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

  const onUploadCase = useMemoizedFn(() => {
    setUploadCaseVisible(true);
  });

  const onCloseCase = useMemoizedFn(() => {
    setUploadCaseVisible(false);
  });

  const doImport = useMemoizedFn(() => {
    const config = importConfigInstance.current.getRawValues();
    const { case_name, case_content } = config;
    rawEntityRef.current = {
      case_name,
      case_content,
    };
    setUploadCaseVisible(false);
    setAction("uploadCase");
  });

  const editorTitle = useMemo(() => {
    if (action === "add") {
      return "新建用例";
    } else if (action === "update") {
      return "修改用例";
    } else if (action === "copy") {
      return "复制用例";
    } else if (action === "view") {
      return "查看用例";
    } else if (action === "uploadCase") {
      return "上传用例";
    } else if (action === "uploadResult") {
      return "上传测试结果";
    } else if (action === "viewUploadResult") {
      return "查看测试结果";
    }
    return "";
  }, [action]);

  return (
    <div className={styles.caseManage}>
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
        <Space>
          <Button onClick={onAddCase} icon={<IconPlus />}>
            新建用例
          </Button>
          <Button onClick={onUploadCase} icon={<IconUpload />}>
            导入用例
          </Button>
        </Space>
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
          rowKey="case_id"
          columns={columns}
        />
      </div>
      <LuBanDrawer
        visible={!!action}
        title={editorTitle}
        onCancel={clearAction}
        onOk={doConfirm}
        unmountOnExit
        width="100%"
        footer={
          action === "view" ||
          action === "viewUploadResult" ||
          action === "uploadResult" ? (
            <Button onClick={clearAction}>返回</Button>
          ) : (
            <Space>
              <Button type="outline" onClick={doConfirm}>
                确认
              </Button>{" "}
              <Button onClick={clearAction}>取消</Button>
            </Space>
          )
        }
      >
        {action === "view" && <CasePreviewer config={rawEntityRef.current} />}
        {(action === "add" ||
          action === "copy" ||
          action === "update" ||
          action === "uploadCase") && (
          <CaseEditor
            rawEntity={rawEntityRef.current}
            action={action}
            ref={caseEditorInstance}
          />
        )}
        {action === "uploadResult" && (
          <UpdateMetric rawEntity={rawEntityRef.current} />
        )}
        {action === "viewUploadResult" && (
          <Statics rawEntity={rawEntityRef.current} />
        )}
      </LuBanDrawer>
      <Modal
        title="导入用例"
        visible={uploadCaseVisible}
        onCancel={onCloseCase}
        onOk={doImport}
        unmountOnExit
      >
        <ImportConfig ref={importConfigInstance} />
      </Modal>
    </div>
  );
};

export default CaseManage;
