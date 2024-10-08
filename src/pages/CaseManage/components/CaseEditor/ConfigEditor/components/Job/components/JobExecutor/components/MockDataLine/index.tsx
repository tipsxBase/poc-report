import {
  Button,
  Form,
  FormInstance,
  InputNumber,
} from "@arco-design/web-react";
import styles from "./index.module.less";
import { toFormPath } from "@/shared/path";
import { useMemoizedFn } from "ahooks";
import { IconPlus } from "@arco-design/web-react/icon";
import { MockDataDefine } from "@/pages/CaseManage/components/CaseEditor/ConfigEditor/sharedType";
import MockRuleConfig from "../MockRuleConfig";

export interface MockDataLineProps {
  parentField: string;
  form: FormInstance;
  getRefGlobals: () => any[];
}

/**
 *
 */
const MockDataLine = (props: MockDataLineProps) => {
  const { parentField, form, getRefGlobals } = props;

  const addMockRule = useMemoizedFn(() => {
    let dataDefineList: MockDataDefine[] = form.getFieldValue(
      toFormPath(parentField, "dataDefineList")
    );
    if (!dataDefineList) {
      dataDefineList = [];
    }

    const define: MockDataDefine = {
      klass: "SqlDataDefine",
      key: undefined,
      type: undefined,
      mockRule: undefined,
      nullPercent: 0,
    };
    dataDefineList.push(define);
    form.setFieldValue(
      toFormPath(parentField, "dataDefineList"),
      dataDefineList
    );
  });

  return (
    <div className={styles.mockDataLine}>
      <Form.Item
        label="批次大小"
        tooltip="一个事务提交 SQL 的条数，查询时一般为1，更新时对对应批处理的大小"
        field={toFormPath(parentField, "batch")}
      >
        <InputNumber placeholder="一个批次的大小" />
      </Form.Item>
      <div className={styles.dataDefineList}>
        <Form.List field={toFormPath(parentField, "dataDefineList")}>
          {(fields, { remove }) => {
            return fields.map((item, index) => {
              return (
                <MockRuleConfig
                  getRefGlobals={getRefGlobals}
                  parentField={item.field}
                  key={item.key}
                  remove={() => {
                    remove(index);
                  }}
                />
              );
            });
          }}
        </Form.List>
      </div>
      <Button
        size="small"
        onClick={addMockRule}
        type="primary"
        icon={<IconPlus />}
      >
        添加规则
      </Button>
    </div>
  );
};

export default MockDataLine;
