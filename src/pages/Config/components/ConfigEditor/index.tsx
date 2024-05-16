import { Button } from "@arco-design/web-react";
import styles from "./index.module.less";
import Global from "./components/Global";
import Scrollbars from "react-custom-scrollbars-2";
import Job from "./components/Job";
import { useMemo, useRef, useState } from "react";
import get from "lodash/get";
import set from "lodash/set";
import { useMemoizedFn } from "ahooks";
import { SharedInstance } from "./sharedType";
import { ConfigContext, ConfigContextProps } from "./ConfigContext";
import Listener from "./components/Listener";
import DataSource from "./components/DataSource";
import BasicConfig from "./components/BasicConfig";
import ConfigPreview from "./components/ConfigPreview";
export interface ConfigEditorProps {
  step: number;
  historyConfig: any;
  toPrev: () => void;
  toNext: () => void;
}

const stepConfig = {
  1: "globalPreProcessors",
  2: "jobs",
  3: "listeners",
  4: "dataSource",
  5: "__basic__",
  6: "__config__",
};

const basicKeys = ["logPath", "writeLogCronExpression"];

/**
 *
 */
const ConfigEditor = (props: ConfigEditorProps) => {
  const { step, toPrev, toNext, historyConfig } = props;
  const [config, setConfig] = useState(historyConfig);

  const instance = useRef<SharedInstance<any>>();

  const getConfig = useMemoizedFn((path: string) => {
    return get(config, path);
  });

  const renderStep = useMemoizedFn((step: number) => {
    const stepKey = stepConfig[step];
    let initialValues;
    if (stepKey === "__config__") {
      initialValues = config;
    } else if (stepKey === "__basic__") {
      initialValues = basicKeys.reduce((prev, current) => {
        prev[current] = get(config, current);
        return prev;
      }, {} as any);
    } else {
      initialValues = set({}, stepKey, get(config, stepKey));
    }
    switch (step) {
      case 1:
        return <Global ref={instance} initialValues={initialValues} />;
      case 2:
        return <Job ref={instance} initialValues={initialValues} />;
      case 3:
        return <Listener ref={instance} initialValues={initialValues} />;
      case 4:
        return <DataSource ref={instance} initialValues={initialValues} />;
      case 5:
        return <BasicConfig ref={instance} initialValues={initialValues} />;
      case 6:
        return <ConfigPreview initialValues={initialValues} />;
    }
  });

  const toNextStep = useMemoizedFn(() => {
    instance.current?.getValues().then((values) => {
      const nextConfig = { ...config, ...values };
      setConfig(nextConfig);
      toNext();
    });
  });

  const context = useMemo<ConfigContextProps>(() => {
    return {
      getConfig,
    };
  }, [getConfig]);

  const saveTemporarily = useMemoizedFn(() => {
    const values = instance.current?.getRawValues();
    const nextConfig = { ...config, ...values };
    setConfig(nextConfig);
  });

  return (
    <div className={styles.configEditor}>
      <div className={styles.wrapper}>
        <Scrollbars>
          <div className={styles.formWrapper}>
            <ConfigContext.Provider value={context}>
              {renderStep(step)}
            </ConfigContext.Provider>{" "}
          </div>
        </Scrollbars>
      </div>
      <div className={styles.footer}>
        <Button onClick={saveTemporarily}>暂存</Button>
        <Button onClick={toPrev}>上一步</Button>
        <Button type="outline" onClick={toNextStep}>
          下一步
        </Button>
      </div>
    </div>
  );
};

export default ConfigEditor;
