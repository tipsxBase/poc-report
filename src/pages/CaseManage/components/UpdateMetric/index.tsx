import { Form } from "@arco-design/web-react";
import styles from "./index.module.less";
import UploadMetric from "./components/UploadMetric";
import UploadSar from "./components/UploadSar";
import UploadSnapshot from "./components/UploadSnapshot";

export interface UpdateMetricProps {}

/**
 *
 */
const UpdateMetric = () => {
  return (
    <div className={styles.updateMetric}>
      <h1>请上传指标统计文件</h1>
      <div className={styles.formWrapper}>
        <Form>
          <Form.Item label="指标数据" layout="vertical">
            <UploadMetric />
          </Form.Item>
          <Form.Item label="过程快照" layout="vertical">
            <UploadSnapshot />
          </Form.Item>
          <Form.Item label="SAR监控" layout="vertical">
            <UploadSar />
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default UpdateMetric;
