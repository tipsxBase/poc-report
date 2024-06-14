import {
  Button,
  Form,
  Input,
  InputNumber,
  Select,
} from "@arco-design/web-react";
import styles from "./index.module.less";
import { toFormPath } from "@/shared/path";
import { enumToSelectOptions } from "@/shared/emum";
import {
  JsonElementMockRuleType,
  JsonElementType,
  getValidateTypeFn,
  jsonNeedArrayLength,
  jsonNeedJson,
  needFakerExpression,
  needFakerPath,
  needMinAndMax,
  needMockRule,
  needScale,
} from "@/pages/CaseManage/components/CaseEditor/ConfigEditor/sharedType";
import get from "lodash/get";
import JsonStructure from "../..";
import { IconDelete } from "@arco-design/web-react/icon";
import { ReactNode } from "react";

export interface JsonElementConfigProps {
  parentField: string;
  remove: () => void;
}

/**
 *
 */
const JsonElementConfig = (props: JsonElementConfigProps) => {
  const { parentField, remove } = props;
  return (
    <div className={styles.jsonElementConfig}>
      <div className={styles.formWrapper}>
        <Form.Item
          rules={[{ required: true, message: "请输入字段名称" }]}
          label="字段名称"
          field={toFormPath(parentField, "key")}
        >
          <Input placeholder="请输入规则Key" />
        </Form.Item>
        <Form.Item
          rules={[{ required: true, message: "请输入字段类型" }]}
          label="字段类型"
          field={toFormPath(parentField, "type")}
        >
          <Select
            placeholder="请选择数据类型"
            options={enumToSelectOptions(JsonElementType)}
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
            const items = [];
            if (jsonNeedArrayLength(type)) {
              items.push(
                <Form.Item
                  key="arrayLength"
                  label="数组长度"
                  field={toFormPath(parentField, "arrayLength")}
                  rules={[{ required: true, message: "请输入数组长度" }]}
                >
                  <InputNumber placeholder="请输入数组长度" min={1} />
                </Form.Item>
              );
            }

            if (jsonNeedJson(type)) {
              items.push(
                <Form.Item
                  key="meta"
                  label="Object结构"
                  field={toFormPath(parentField, "meta")}
                >
                  <JsonStructure />
                </Form.Item>
              );
            }

            if (needMockRule(type)) {
              items.push(
                <Form.Item
                  key="mockRule"
                  label="Mock规则"
                  field={toFormPath(parentField, "mockRule")}
                  rules={[{ required: true, message: "请选择Mock规则" }]}
                >
                  <Select
                    placeholder="请选择Mock规则"
                    options={enumToSelectOptions(
                      JsonElementMockRuleType,
                      getValidateTypeFn(type)
                    )}
                  />
                </Form.Item>
              );
            }

            return items;
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
            return items;
          }}
        </Form.Item>
      </div>
      <Button icon={<IconDelete />} onClick={remove} />
    </div>
  );
};

export default JsonElementConfig;
