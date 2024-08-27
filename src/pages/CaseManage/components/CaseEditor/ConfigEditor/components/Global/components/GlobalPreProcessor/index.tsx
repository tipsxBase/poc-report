import {
  Button,
  Form,
  FormInstance,
  Input,
  InputTag,
  Select,
} from "@arco-design/web-react";
import styles from "./index.module.less";
import { IconDelete, IconPlus } from "@arco-design/web-react/icon";
import { toFormPath } from "@/shared/path";
import SqlEditor from "@/components/SqlEditor";
import { useMemoizedFn } from "ahooks";
import { enumToSelectOptions } from "@/shared/emum";
import {
  GlobalPreProcessor,
  ResultDataDefine,
  ResultDataType,
} from "../../../../sharedType";
import { SelectProps } from "@arco-design/web-react/es/Select";
import get from "lodash/get";

export interface GlobalPreProcessorConfigProps {
  parentField: string;
  removeGlobalPreProcessor: (id: string) => void;
  form: FormInstance<GlobalPreProcessor>;
}

const GLOBAL_PRE_PROCESSOR_OPTIONS: SelectProps["options"] = [
  {
    label: "数据预查询",
    value: "PreQueryExistDataProcessor",
  },
  {
    label: "枚举定义",
    value: "PreEnumProcessor",
  },
];

/**
 *
 */
const GlobalPreProcessorConfig = (props) => {
  const { parentField, removeGlobalPreProcessor, form } = props;

  const id = form.getFieldValue(toFormPath(parentField, "id"));

  const addResultDefine = useMemoizedFn(() => {
    let resultDefineList: ResultDataDefine[] = form.getFieldValue(
      toFormPath(parentField, "dataDefineList")
    );
    if (!resultDefineList) {
      resultDefineList = [];
    }
    const define: ResultDataDefine = {
      klass: "ResultDataDefine",
      name: undefined,
      type: ResultDataType.STRING,
    };
    resultDefineList.push(define);
    form.setFieldValue(
      toFormPath(parentField, "dataDefineList"),
      resultDefineList
    );
  });

  return (
    <div className={styles.globalPreProcessor}>
      <div className={styles.formWrapper}>
        <Form.Item
          label="预处理器类型"
          tooltip={
            <div>
              <p>数据预查询：对有关联关系的数据表提前查询关联数据</p>
              <p>枚举定义： 定义枚举值，可以在数据 Mock 中引用</p>
            </div>
          }
          field={toFormPath(parentField, "klass")}
        >
          <Select
            placeholder="请选择预处理器类型"
            options={GLOBAL_PRE_PROCESSOR_OPTIONS}
          />
        </Form.Item>
        <Form.Item hidden field={toFormPath(parentField, "id")}>
          <Input />
        </Form.Item>
        <Form.Item
          rules={[
            {
              required: true,
              message: "预处器名称不能为空",
            },
          ]}
          label="预处器名称"
          field={toFormPath(parentField, "name")}
        >
          <Input placeholder="请输入预处器名称" />
        </Form.Item>
        <Form.Item
          noStyle
          shouldUpdate={(prev, next) =>
            get(prev, toFormPath(parentField, "klass")) !==
            get(next, toFormPath(parentField, "klass"))
          }
        >
          {(values) => {
            const type = get(values, toFormPath(parentField, "klass"));
            if (type === "PreQueryExistDataProcessor") {
              return (
                <>
                  <Form.Item
                    rules={[
                      {
                        required: true,
                        message: "要执行的SQL不能为空",
                      },
                    ]}
                    label="要执行的SQL"
                    field={toFormPath(parentField, "sql")}
                  >
                    <SqlEditor />
                  </Form.Item>
                  <Form.Item
                    required
                    tooltip="定义数据预查询中查询的数据的结构，在 Mock 配置中，可以取结果列中相应名称的值"
                    label="结果列定义"
                  >
                    <div>
                      <div className={styles.resultOperation}>
                        <Button
                          onClick={addResultDefine}
                          type="primary"
                          icon={<IconPlus />}
                        >
                          添加结果列
                        </Button>
                      </div>

                      <Form.List
                        rules={[
                          {
                            required: true,
                            message: "结果列不能为空",
                          },
                        ]}
                        field={toFormPath(parentField, "dataDefineList")}
                      >
                        {(fields, { remove }) => {
                          return (
                            <div className={styles.dataDefineList}>
                              {fields.map((item, index) => (
                                <div
                                  key={item.key}
                                  className={styles.resultDefine}
                                >
                                  <div className={styles.defineItem}>
                                    <Form.Item
                                      hidden
                                      field={toFormPath(item.field, "klass")}
                                    >
                                      <Input />
                                    </Form.Item>
                                    <Form.Item
                                      label="结果列名称"
                                      rules={[
                                        {
                                          required: true,
                                          message: "结果列名称不能为空",
                                        },
                                      ]}
                                      field={toFormPath(item.field, "name")}
                                    >
                                      <Input placeholder="结果列名称" />
                                    </Form.Item>
                                    <Form.Item
                                      label="结果列类型"
                                      field={toFormPath(item.field, "type")}
                                    >
                                      <Select
                                        placeholder="请选择结果列类型"
                                        options={enumToSelectOptions(
                                          ResultDataType
                                        )}
                                      />
                                    </Form.Item>
                                  </div>
                                  <div className={styles.defineOperation}>
                                    <Button
                                      onClick={() => remove(index)}
                                      icon={<IconDelete />}
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          );
                        }}
                      </Form.List>
                    </div>
                  </Form.Item>
                </>
              );
            } else {
              return (
                <Form.Item
                  rules={[
                    {
                      required: true,
                      message: "预处器名称不能为空",
                    },
                  ]}
                  field={toFormPath(parentField, "enums")}
                  label="枚举值"
                >
                  <InputTag placeholder="请输入枚举值" />
                </Form.Item>
              );
            }
          }}
        </Form.Item>
      </div>
      <div className={styles.operationWrapper}>
        <Button onClick={() => removeGlobalPreProcessor(id)}>
          <IconDelete />
        </Button>
      </div>
    </div>
  );
};

export default GlobalPreProcessorConfig;
