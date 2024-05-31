import ActiveConnection, {
  ActiveConnectionInstance,
} from "@/pages/CaseManage/components/Statics/components/Db/ActiveConnection";
import Qps, {
  QpsInstance,
} from "@/pages/CaseManage/components/Statics/components/Qps";
import Sar, {
  SarInstance,
} from "@/pages/CaseManage/components/Statics/components/Sar";
import styles from "./index.module.less";
import { CaseEntity } from "@/service/case";
import { useRef } from "react";
import { Button, Message } from "@arco-design/web-react";
import { useMemoizedFn } from "ahooks";
import useCaseStore from "@/stores/case";
import { dialog } from "@tauri-apps/api";

export interface StaticsProps {
  rawEntity: CaseEntity;
}

/**
 * 指标统计
 */
const Statics = (props: StaticsProps) => {
  const { rawEntity } = props;
  const { case_name } = rawEntity;
  const qpsInstance = useRef<QpsInstance>();
  const sarInstance = useRef<SarInstance>();
  const activeConnectionInstance = useRef<ActiveConnectionInstance>();

  const { downloadImage } = useCaseStore();

  const doDownload = useMemoizedFn(async () => {
    const result = {
      ...qpsInstance.current.getImage(),
      ...sarInstance.current.getImage(),
      ...activeConnectionInstance.current.getImage(),
    };
    const selectedDirectory = await dialog.open({
      directory: true,
      multiple: false,
      title: "选择下载目录",
    });
    downloadImage(result, selectedDirectory as string, case_name).then(() => {
      Message.success("文件下载成功。");
    });
  });

  return (
    <div className={styles.statics}>
      <Button onClick={doDownload} className={styles.downloadBtn}>
        下载图片
      </Button>
      <Qps ref={qpsInstance} rawEntity={rawEntity} />
      <Sar ref={sarInstance} rawEntity={rawEntity} />
      <ActiveConnection ref={activeConnectionInstance} rawEntity={rawEntity} />
    </div>
  );
};

export default Statics;
