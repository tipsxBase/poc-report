import { Form } from "@arco-design/web-react";
import styles from "./index.module.less";
import UploadSar from "./components/UploadSar";
import UploadSnapshot from "./components/UploadSnapshot";
import { CaseEntity } from "@/service/case";

export interface UpdateMetricProps {
  rawEntity: CaseEntity;
}

/**
 *
 */
const UpdateMetric = (props: UpdateMetricProps) => {
  const { rawEntity } = props;

  return (
    <div className={styles.updateMetric}>
      <h1>请上传指标统计文件</h1>
      <div className={styles.formWrapper}>
        <Form>
          <Form.Item label="过程快照" layout="vertical">
            <UploadSnapshot rawEntity={rawEntity} />
          </Form.Item>
          <Form.Item label="监控数据" layout="vertical">
            <UploadSar rawEntity={rawEntity} />
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default UpdateMetric;
