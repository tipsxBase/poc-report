import { Button, Drawer } from "@arco-design/web-react";
import styles from "./index.module.less";
import { useMemo, useRef, useState } from "react";
import { useMemoizedFn } from "ahooks";
import JsonConfig, { JsonConfigInstance } from "./JsonConfig";
import { MockDataDefine } from "@/pages/CaseManage/components/CaseEditor/ConfigEditor/sharedType";

export interface JsonStructureProps {
  value?: MockDataDefine[];
  onChange?: (value: MockDataDefine[]) => void;
  getRefGlobals: () => any[];
}

/**
 * JSON配置
 */
const JsonStructure = (props: JsonStructureProps) => {
  const { getRefGlobals, value, onChange } = props;
  const [configVisible, setConfigVisible] = useState(false);
  const jsonConfigInstance = useRef<JsonConfigInstance>();
  const doConfig = useMemoizedFn(() => {
    setConfigVisible(true);
  });

  const closeConfig = useMemoizedFn(() => {
    setConfigVisible(false);
  });

  const doConfirm = useMemoizedFn(() => {
    jsonConfigInstance.current.getValues().then((values) => {
      const { meta } = values;
      onChange && onChange(meta);
      closeConfig();
    });
  });

  const initialValues = useMemo(() => {
    return {
      meta: value,
    };
  }, [value]);

  return (
    <div className={styles.jsonConfig}>
      <Button onClick={doConfig}>配置</Button>
      <Drawer
        title="JSON配置"
        visible={configVisible}
        width={640}
        onCancel={closeConfig}
        onOk={doConfirm}
        unmountOnExit
      >
        <JsonConfig
          initialValues={initialValues}
          ref={jsonConfigInstance}
          getRefGlobals={getRefGlobals}
        />
      </Drawer>
    </div>
  );
};

export default JsonStructure;
