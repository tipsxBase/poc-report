import { Button, Modal, Steps } from "@arco-design/web-react";
import styles from "./index.module.less";
import { useRef, useState } from "react";
import { useMemoizedFn } from "ahooks";
import ConfigEditor from "./components/ConfigEditor";
import ImportConfig, {
  ImportConfigInstance,
} from "./components/ConfigEditor/components/ImportConfig";
export interface ConfigProps {}

const Step = Steps.Step;

/**
 * 配置
 */
const Config = () => {
  const [step, setStep] = useState(1);
  const [importVisible, setImportVisible] = useState(false);
  const [historyConfig, setHistoryConfig] = useState({});
  const [editorKey, setEditorKey] = useState(0);
  const toPrev = useMemoizedFn(() => {
    if (step === 1) {
      return;
    }
    setStep(step - 1);
  });

  const toNext = useMemoizedFn(() => {
    if (step === 7) {
      return;
    }
    setStep(step + 1);
  });

  const doImportConfig = useMemoizedFn(() => {
    setImportVisible(true);
  });

  const doCancelImport = useMemoizedFn(() => {
    setImportVisible(false);
  });

  const importInstance = useRef<ImportConfigInstance>();

  const doConfirmImport = useMemoizedFn(() => {
    Modal.confirm({
      title: "提示",
      content: "导入历史配置会覆盖当前的有配置，确认继续？",
      onOk: () => {
        const historyConfig = importInstance.current.getRawValues();
        setHistoryConfig(historyConfig);
        setStep(1);
        setImportVisible(false);
        setEditorKey((k) => k + 1);
      },
    });
  });

  return (
    <div className={styles.config}>
      <div className={styles.steps}>
        <Steps direction="vertical" type="dot" current={step}>
          <Step
            title="配置全局预处理器"
            description="全局预处理器负责提前执行查询SQL，返回结果可以在执行单元中使用"
          />
          <Step
            title="配置Job"
            description="每个Job可以包括多个执行单元，不同Job是按序执行的"
          />
          <Step
            title="配置监听器"
            description="监听器负责监听整个过程中的一些指标"
          />
          <Step
            title="配置数据源"
            description="配置POC过程中的数据库连接信息"
          />
          <Step
            title="基本信息配置"
            description="配置POC过程中的数据库连接信息"
          />
          <Step title="结果查看" description="配置POC过程中的数据库连接信息" />
        </Steps>
        <Button onClick={doImportConfig} className={styles.importConfig}>
          导入历史配置
        </Button>
      </div>
      <ConfigEditor
        key={editorKey}
        historyConfig={historyConfig}
        step={step}
        toPrev={toPrev}
        toNext={toNext}
      />
      <Modal
        title="导入历史配置"
        onCancel={doCancelImport}
        visible={importVisible}
        onConfirm={doConfirmImport}
        unmountOnExit
      >
        <ImportConfig ref={importInstance} />
      </Modal>
    </div>
  );
};

export default Config;
