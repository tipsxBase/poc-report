import { Button, Form } from "@arco-design/web-react";
import styles from "./index.module.less";
import { IconPlus } from "@arco-design/web-react/icon";
import GlobalPreProcessorConfig from "./components/GlobalPreProcessor";
import { useMemoizedFn } from "ahooks";
import { randomId } from "@/shared/randomId";
import { forwardRef, useImperativeHandle } from "react";
import {
  GlobalPreProcessor,
  PreProcessorResultType,
  SharedInstance,
} from "../../sharedType";
import get from "lodash/get";
import set from "lodash/set";
export interface GlobalConfigProps {
  initialValues: {
    globalPreProcessors: GlobalPreProcessor[];
  };
}

export interface GlobalConfigInstance
  extends SharedInstance<{
    globalPreProcessors: GlobalPreProcessor[];
  }> {}

/**
 *
 */
const GlobalConfig = forwardRef<GlobalConfigInstance, GlobalConfigProps>(
  (props: GlobalConfigProps, ref) => {
    const { initialValues } = props;
    const [form] = Form.useForm();
    const doAddGlobalPreProcessor = useMemoizedFn(() => {
      let globalPreProcessors: GlobalPreProcessor[] = form.getFieldValue(
        "globalPreProcessors"
      );
      if (!globalPreProcessors) {
        globalPreProcessors = [];
      }
      const globalPreProcessor: GlobalPreProcessor = {
        klass: "PreQueryExistDataProcessor",
        name: "",
        id: randomId("g"),
        sql: "select",
        resultType: PreProcessorResultType.LIST_MAP,
        dataDefineList: [],
      };
      globalPreProcessors.push(globalPreProcessor);
      form.setFieldValue("globalPreProcessors", globalPreProcessors);
    });

    const removeGlobalPreProcessor = useMemoizedFn((id: string) => {
      let globalPreProcessors = form.getFieldValue("globalPreProcessors");
      if (!globalPreProcessors) {
        return;
      }
      globalPreProcessors = globalPreProcessors.filter((p) => p.id !== id);
      form.setFieldValue("globalPreProcessors", globalPreProcessors);
    });

    useImperativeHandle(
      ref,
      () => {
        return {
          getValues() {
            return form.validate().then((res) => {
              return set(
                {},
                "globalPreProcessors",
                get(res, "globalPreProcessors", [])
              );
            });
          },
          getRawValues() {
            return form.getFieldsValue() as any;
          },
        };
      },
      [form]
    );

    return (
      <div className={styles.global}>
        <div className={styles.actionWrapper}>
          <Button
            onClick={doAddGlobalPreProcessor}
            type="outline"
            icon={<IconPlus />}
          >
            添加全局预处理器
          </Button>
        </div>
        <Form form={form} initialValues={initialValues}>
          <Form.List field="globalPreProcessors">
            {(fields) => {
              return (
                <div className={styles.globalPreProcessors}>
                  {fields.map((item) => {
                    return (
                      <GlobalPreProcessorConfig
                        removeGlobalPreProcessor={removeGlobalPreProcessor}
                        parentField={item.field}
                        form={form}
                        key={item.key}
                      />
                    );
                  })}
                </div>
              );
            }}
          </Form.List>
        </Form>
      </div>
    );
  }
);

export default GlobalConfig;
