import { Message, Tooltip, Upload } from "@arco-design/web-react";
import styles from "./index.module.less";
import { useMemoizedFn } from "ahooks";
import { UploadItem } from "@arco-design/web-react/es/Upload";
import { useRef, useState } from "react";
import {
  IconCheck,
  IconFile,
  IconInfoCircleFill,
  IconLoading,
} from "@arco-design/web-react/icon";
import { CaseEntity, CaseMetric } from "@/service/case";
import useCaseStore from "@/stores/case";
import classNames from "classnames";

export interface UploadSnapshotProps {
  rawEntity: CaseEntity;
}

/**
 *
 */
const UploadSnapshot = (props: UploadSnapshotProps) => {
  const { rawEntity } = props;
  const { case_id } = rawEntity;
  const [fileList, setFileList] = useState<UploadItem[]>();
  const uploadingRef = useRef<boolean>(false);
  const { insertMetric } = useCaseStore();

  const onUploadChange = useMemoizedFn((files: UploadItem[]) => {
    if (uploadingRef.current) {
      Message.warning("正在上传请稍候在试。");
      return;
    }
    files = files.filter((file) => file.status === "init");
    if (files.length === 0) {
      setFileList([]);
      return;
    }

    setFileList(
      files.map((file) => {
        file.status = "uploading";
        return file;
      })
    );
    uploadingRef.current = true;
    const reader = new FileReader();
    reader.onload = async function (e) {
      // 当文件读取完成时，更新图片的 src 属性
      const snapshot = JSON.parse(e.target.result as string);
      const metrics = snapshot.map((item) => {
        const metric: CaseMetric = {
          case_id: case_id,
          total_statement: item.totalStatement,
          avg_statement_cast_mills: item.avgStatementCastMills,
          avg_sql_cast_mills: item.avgSqlCastMills,
          statement_qps: Math.round(item.statementQps),
          sql_qps: Math.round(item.sqlQps),
          write_mib_pre_second: item.writeMibPreSecond,
          p80: item.p80,
          p95: item.p95,
          avg_row_width: item.avgRowWidth,
        };
        return metric;
      });

      insertMetric(metrics)
        .then(() => {
          setFileList(
            files.map((file) => {
              file.status = "done";
              return file;
            })
          );
          uploadingRef.current = false;
        })
        .catch((err) => {
          setFileList(
            files.map((file) => {
              file.status = "error";
              file.response = err;
              return file;
            })
          );
          uploadingRef.current = false;
        });
    };

    reader.onerror = function (err) {
      setFileList(
        files.map((file) => {
          file.status = "done";
          file.response = err;
          return file;
        })
      );
      uploadingRef.current = false;
    };

    reader.readAsText(files[0].originFile);
  });

  const renderUploadItem = useMemoizedFn(
    (_: React.ReactNode, file: UploadItem) => {
      let statusNode = null;

      if (file.status === "uploading") {
        statusNode = (
          <span className={styles.icon}>
            <IconLoading />
          </span>
        );
      } else if (file.status === "done") {
        statusNode = (
          <span className={classNames(styles.icon, styles.success)}>
            <IconCheck />
          </span>
        );
      } else if (file.status === "error") {
        statusNode = (
          <span className={classNames(styles.icon, styles.error)}>
            <Tooltip content={JSON.stringify(file.response)}>
              <IconInfoCircleFill />
            </Tooltip>
          </span>
        );
      } else {
        statusNode = (
          <span className={styles.icon}>
            <IconLoading />
          </span>
        );
      }

      return (
        <div className={styles.uploadItem}>
          <span className={styles.fileName}>
            <IconFile />
            {file.name}
          </span>
          {statusNode}
        </div>
      );
    }
  );

  return (
    <div className={styles.uploadSnapshot}>
      <Upload
        renderUploadItem={renderUploadItem}
        fileList={fileList}
        drag
        autoUpload={false}
        onChange={onUploadChange}
      />
    </div>
  );
};

export default UploadSnapshot;
