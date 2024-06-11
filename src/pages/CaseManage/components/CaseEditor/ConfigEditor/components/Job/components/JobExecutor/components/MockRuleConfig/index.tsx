import {
  Button,
  Form,
  Input,
  InputNumber,
  InputTag,
  Select,
} from "@arco-design/web-react";
import styles from "./index.module.less";
import { toFormPath } from "@/shared/path";
import { enumToSelectOptions } from "@/shared/emum";
import {
  MockRuleType,
  SQLDataType,
  getValidateTypeFn,
  isSnowflake,
  needEnum,
  needFakerExpression,
  needFakerPath,
  needGlobalRef,
  needMeta,
  needMinAndMax,
  needScale,
} from "@/pages/CaseManage/components/CaseEditor/ConfigEditor/sharedType";
import get from "lodash/get";
import { ReactNode } from "react";
import { IconDelete } from "@arco-design/web-react/icon";
import JsonStructure from "./JsonStructure";
export interface MockRuleConfigProps {
  parentField: string;
  getRefGlobals: () => any[];
  remove: () => void;
}

/**
 *
 */
const MockRuleConfig = (props: MockRuleConfigProps) => {
  const { parentField, getRefGlobals, remove } = props;
  return (
    <div className={styles.mockRuleConfig}>
      <div className={styles.formWrapper}>
        <Form.Item hidden field={toFormPath(parentField, "klass")}>
          <Input />
        </Form.Item>
        <Form.Item
          rules={[{ required: true, message: "请输入字符名称" }]}
          label="字段名称"
          field={toFormPath(parentField, "key")}
        >
          <Input placeholder="请输入规则Key" />
        </Form.Item>
        <Form.Item
          // rules={[{ required: true, message: "请输入空值比例" }]}
          label="空值比例"
          field={toFormPath(parentField, "nullPercent")}
        >
          <InputNumber
            placeholder="请输入空值比例"
            min={0}
            max={1}
            precision={2}
          />
        </Form.Item>
        <Form.Item
          rules={[{ required: true, message: "请输入字段类型" }]}
          label="字段类型"
          field={toFormPath(parentField, "type")}
        >
          <Select
            placeholder="请选择数据类型"
            options={enumToSelectOptions(SQLDataType)}
          />
        </Form.Item>
        <Form.Item
          noStyle
          shouldUpdate={(prev, next) =>
            get(prev, toFormPath(parentField, "type")) !==
            get(next, toFormPath(parentField, "type"))
          }
        >
          {(values) => {
            const type = get(values, toFormPath(parentField, "type"));
            return (
              <Form.Item
                label="Mock规则"
                field={toFormPath(parentField, "mockRule")}
                rules={[{ required: true, message: "请选择Mock规则" }]}
              >
                <Select
                  placeholder="请选择Mock规则"
                  options={enumToSelectOptions(
                    MockRuleType,
                    getValidateTypeFn(type)
                  )}
                />
              </Form.Item>
            );
          }}
        </Form.Item>
        <Form.Item
          noStyle
          shouldUpdate={(prev, next) =>
            get(prev, toFormPath(parentField, "mockRule")) !==
            get(next, toFormPath(parentField, "mockRule"))
          }
        >
          {(values) => {
            const mockRule = get(values, toFormPath(parentField, "mockRule"));
            const items: ReactNode[] = [];

            if (isSnowflake(mockRule)) {
              items.push(
                <Form.Item
                  key="refPercent"
                  tooltip="会有部分数据从全局中获取，其它数据是重新生成的, upsert 时更新的比例"
                  label="引用全局的比例"
                  field={toFormPath(parentField, "refPercent")}
                >
                  <InputNumber
                    placeholder="请输入引用全局的比例"
                    min={0}
                    max={1}
                    precision={2}
                  />
                </Form.Item>
              );
            }

            if (needMinAndMax(mockRule)) {
              items.push(
                <Form.Item
                  key="min"
                  label="最小值"
                  field={toFormPath(parentField, "min")}
                >
                  <Input placeholder="请输入最小值" />
                </Form.Item>
              );

              items.push(
                <Form.Item
                  key="max"
                  label="最大值"
                  field={toFormPath(parentField, "max")}
                >
                  <Input placeholder="请输入最大值" />
                </Form.Item>
              );
            }

            if (needScale(mockRule)) {
              items.push(
                <Form.Item
                  key="scale"
                  label="精度"
                  field={toFormPath(parentField, "scale")}
                >
                  <InputNumber placeholder="请输入最小值" min={0} />
                </Form.Item>
              );
            }

            if (needFakerExpression(mockRule)) {
              items.push(
                <Form.Item
                  key="fakerExpression"
                  label="Faker表达式"
                  field={toFormPath(parentField, "fakerExpression")}
                >
                  <Input placeholder="请输入Faker表达式" />
                </Form.Item>
              );
            }

            if (needFakerPath(mockRule)) {
              items.push(
                <Form.Item
                  key="path"
                  label="Faker方法路径"
                  field={toFormPath(parentField, "path")}
                >
                  <Input placeholder="请输入Faker方法路径" />
                </Form.Item>
              );
            }

            if (needGlobalRef(mockRule)) {
              items.push(
                <Form.Item
                  key="ref"
                  label="引用全局"
                  field={toFormPath(parentField, "ref")}
                >
                  {() => {
                    const refGlobals = getRefGlobals();
                    return (
                      <Select
                        placeholder="请选择引用的全局处理器"
                        options={refGlobals}
                      />
                    );
                  }}
                </Form.Item>
              );

              items.push(
                <Form.Item
                  key="globalRule"
                  label="引用规则"
                  tooltip={
                    <div>
                      <p>从全局取数的规则</p>
                      <p>只支持以下三种情况，默认是increment</p>
                      <p>random: 随机取数</p>
                      <p>increment: 顺序取数</p>
                      <p>数字: 指定数字位置取数</p>
                    </div>
                  }
                  field={toFormPath(parentField, "globalRule")}
                >
                  {() => {
                    return (
                      <Input placeholder="请输入取数规则, random、increment或数字" />
                    );
                  }}
                </Form.Item>
              );
            }

            if (needEnum(mockRule)) {
              items.push(
                <Form.Item
                  key="enums"
                  label="枚举值"
                  field={toFormPath(parentField, "enums")}
                >
                  <InputTag placeholder="请输入枚举值" />
                </Form.Item>
              );
            }

            if (needMeta(mockRule)) {
              items.push(
                <Form.Item
                  key="array"
                  label="数组长度"
                  tooltip="0表示是对象，大于0表示数组长度。默认是0"
                  field={toFormPath(parentField, "array")}
                >
                  <InputNumber placeholder="请输入数组长度" />
                </Form.Item>
              );
              items.push(
                <Form.Item
                  key="meta"
                  label="JSON结构"
                  field={toFormPath(parentField, "meta")}
                >
                  <JsonStructure getRefGlobals={getRefGlobals} />
                </Form.Item>
              );
            }

            return items;
          }}
        </Form.Item>
      </div>
      <div>
        <Button icon={<IconDelete />} onClick={remove} />
      </div>
    </div>
  );
};

export default MockRuleConfig;
