import ActiveConnection from "@/components/db/ActiveConnection";
import Qps from "@/components/qps";
import Sar from "@/components/sar";
import styles from "./index.module.less";

export interface StaticsProps {}

/**
 * 指标统计
 */
const Statics = () => {
  return (
    <div className={styles.statics}>
      <Qps />
      <Sar />
      <ActiveConnection />
    </div>
  );
};

export default Statics;
