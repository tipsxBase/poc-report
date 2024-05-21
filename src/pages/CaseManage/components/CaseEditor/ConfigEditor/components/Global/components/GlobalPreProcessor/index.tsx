import {
  Button,
  Form,
  FormInstance,
  Input,
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

export interface GlobalPreProcessorConfigProps {
  parentField: string;
  removeGlobalPreProcessor: (id: string) => void;
  form: FormInstance<GlobalPreProcessor>;
}

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
        <Form.Item hidden field={toFormPath(parentField, "klass")}>
          <Input />
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
        <Form.Item required label="结果列定义">
          <div>
            <div className={styles.resultOperation}>
              <Button
                onClick={addResultDefine}
                type="outline"
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
                      <div key={item.key} className={styles.resultDefine}>
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
                              options={enumToSelectOptions(ResultDataType)}
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
