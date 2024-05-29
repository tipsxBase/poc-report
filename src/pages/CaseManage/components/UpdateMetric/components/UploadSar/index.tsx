import { Message, Tooltip, Upload } from "@arco-design/web-react";
import styles from "./index.module.less";
import { useMemoizedFn } from "ahooks";
import { UploadItem } from "@arco-design/web-react/es/Upload";
import {
  IconCheck,
  IconFile,
  IconInfoCircleFill,
  IconLoading,
} from "@arco-design/web-react/icon";
import { useRef, useState } from "react";
import { CaseEntity, CaseStatic, StaticType } from "@/service/case";
import classNames from "classnames";
import useCaseStore from "@/stores/case";

export interface UploadSarProps {
  rawEntity: CaseEntity;
}

/**
 *
 */
const UploadSar = (props: UploadSarProps) => {
  const { rawEntity } = props;
  const { case_id } = rawEntity;
  const [fileList, setFileList] = useState<UploadItem[]>();
  const { insertStatics } = useCaseStore();
  const uploadingRef = useRef<boolean>(false);
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
      const result = JSON.parse(e.target.result as string);
      const { metricForActiveConnection, metricForSar } = result;
      const connectionsResult = metricForActiveConnection.map((v) => {
        const s: CaseStatic = {
          case_id,
          time: v.time,
          value: JSON.stringify(JSON.stringify(v.value)),
          static_type: StaticType.ACTIVE_CONNECTION,
        };
        return s;
      });

      const sarResult = metricForSar.map((v) => {
        const s: CaseStatic = {
          case_id,
          time: v.time,
          value: JSON.stringify(JSON.stringify(v.value)),
          static_type: StaticType.ECS_SAR,
        };
        return s;
      });
      insertStatics([...connectionsResult, ...sarResult])
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
    <div className={styles.uploadSar}>
      <Upload
        renderUploadItem={renderUploadItem}
        drag
        fileList={fileList}
        autoUpload={false}
        onChange={onUploadChange}
      />
    </div>
  );
};

export default UploadSar;
