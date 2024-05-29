import ActiveConnection from "@/pages/CaseManage/components/Statics/components/Db/ActiveConnection";
import Qps from "@/pages/CaseManage/components/Statics/components/Qps";
import Sar from "@/pages/CaseManage/components/Statics/components/Sar";
import styles from "./index.module.less";
import { CaseEntity } from "@/service/case";

export interface StaticsProps {
  rawEntity: CaseEntity;
}

/**
 * 指标统计
 */
const Statics = (props: StaticsProps) => {
  const { rawEntity } = props;

  return (
    <div className={styles.statics}>
      <Qps rawEntity={rawEntity} />
      <Sar rawEntity={rawEntity} />
      <ActiveConnection rawEntity={rawEntity} />
    </div>
  );
};

export default Statics;
