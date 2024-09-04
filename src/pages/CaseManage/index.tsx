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
  IconInfoCircle,
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
import TextRender from "@/components/TextRender";
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
    resetOrder,
  } = useCaseStore();

  const doSearch = useMemoizedFn(() => {
    const values = form.getFieldsValue();
    fetchCaseList(values);
  });

  const onReset = useMemoizedFn(() => {
    form.resetFields();
    resetPagination();
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
      const { case_name, case_content, category_id, case_description } = res;

      if (action === "add" || action === "copy" || action === "uploadCase") {
        insertCase({
          category_id,
          case_name,
          case_content,
          case_description,
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
          case_description,
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
    runCase(row.case_name, case_content)
      .then(() => {
        Message.success("上传成功。");
      })
      .catch(() => {
        Message.warning("请先指定环境");
      });
  });

  const rankOrder = useMemoizedFn((row: CaseEntity, direction) => {
    const values = form.getFieldsValue();

    resetOrder(
      row.case_id,
      {
        ...values,
      },
      direction
    )
      .then(() => {
        doSearch();
        Message.success(`${direction === "forward" ? "上移" : "下移"}成功`);
      })
      .catch((err) => {
        Message.warning(err.message);
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
        width: 200,
        render: (t) => <TextRender text={t} />,
      },
      {
        dataIndex: "case_name",
        title: "用例名称",
        key: "case_name",
        width: 200,
        render: (t) => <TextRender text={t} />,
      },
      {
        dataIndex: "case_description",
        title: "用例描述",
        key: "case_description",
        render: (t) => <TextRender text={t} />,
      },
      {
        dataIndex: "action",
        title: "操作",
        key: "action",
        width: 590,
        render: (_, item) => {
          return (
            <TableActionColumn maxDisplayAction={10}>
              <Link onClick={() => onView(item)}>查看</Link>
              <Link onClick={() => onCopy(item)}>复制</Link>
              <Tooltip
                content="系统内置用例不允许修改"
                disabled={item.category_type !== 1}
              >
                <Link
                  disabled={
                    process.env.NODE_ENV === "production" &&
                    item.category_type === 1
                  }
                  onClick={() => onUpdate(item)}
                >
                  修改
                </Link>
              </Tooltip>
              <Tooltip content="上传至默认服务">
                <Link onClick={() => doExecute(item)}>上传</Link>
              </Tooltip>
              {process.env.NODE_ENV === "production" &&
              item.category_type === 1 ? (
                <Tooltip content="系统内置用例不允许删除">
                  <Link disabled>删除</Link>
                </Tooltip>
              ) : (
                <Popconfirm title="确认删除？" onOk={() => doDelete(item)}>
                  <Link>删除</Link>
                </Popconfirm>
              )}

              <Link onClick={() => onDownload(item)}>下载</Link>
              <Link onClick={() => onUploadResult(item)}>
                导入日志
                <Tooltip content="上传测试用例产生的日志">
                  <IconInfoCircle style={{ marginLeft: 4 }} />
                </Tooltip>
              </Link>
              <Link onClick={() => onViewResult(item)}>查看结果</Link>
              <Link onClick={() => rankOrder(item, "forward")}>上移</Link>
              <Link onClick={() => rankOrder(item, "backward")}>下移</Link>
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
    rankOrder,
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

  const onSearchSubmit = useMemoizedFn(() => {
    resetPagination();
    doSearch();
  });

  return (
    <div className={styles.caseManage}>
      <Form
        className="has-divider"
        form={form}
        onSubmit={onSearchSubmit}
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
          <Form.Item label="用例名称" field="case_name">
            <Input placeholder="用例名称" />
          </Form.Item>
        </ListSearchLayout>
      </Form>
      <Divider type="horizontal" />
      <div>
        <Space>
          <Button type="primary" onClick={onAddCase} icon={<IconPlus />}>
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
              <Button type="primary" onClick={doConfirm}>
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
