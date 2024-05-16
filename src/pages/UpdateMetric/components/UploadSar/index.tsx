import { Upload } from "@arco-design/web-react";
import styles from "./index.module.less";
import { useMemoizedFn } from "ahooks";
import { UploadItem } from "@arco-design/web-react/es/Upload";
import SQLite from "@/shared/Sqlite";
import { IconDelete, IconFile, IconLoading } from "@arco-design/web-react/icon";
import { useState } from "react";

export interface UploadSarProps {}

/**
 *
 */
const UploadSar = () => {
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState<UploadItem[]>();
  const onUploadChange = useMemoizedFn((files: UploadItem[]) => {
    if (files.length === 0) {
      setFileList([]);
      return;
    }
    setLoading(true);
    const [file] = files;
    setFileList([file]);
    const reader = new FileReader();
    reader.onload = async function (e) {
      // 当文件读取完成时，更新图片的 src 属性
      const sarMetric = JSON.parse(e.target.result as string);

      const db = await SQLite.open();
      await db.execute(`CREATE TABLE IF NOT EXISTS poc_active_connections(
				time  INTEGER,
				value  TEXT
			)`);
      await db.execute(`CREATE TABLE IF NOT EXISTS poc_sar(
				time  INTEGER,
				value  TEXT
			)`);
      await db.execute("DELETE FROM poc_active_connections");
      await db.execute("DELETE FROM poc_sar");
      const { metricForActiveConnection = [], metricForSar = [] } = sarMetric;
      for (let i = 0; i < metricForActiveConnection.length; i++) {
        const metric = metricForActiveConnection[i];
        await db.execute(
          `INSERT
					INTO
					poc_active_connections(
						time,
						value
					)
					VALUES(
						'${metric.time}',
						'${JSON.stringify(metric.value)}'
					)`
        );
      }

      for (let i = 0; i < metricForSar.length; i++) {
        const metric = metricForSar[i];
        await db.execute(
          `INSERT
					INTO
					poc_sar(
						time,
						value
					)
					VALUES(
						'${metric.time}',
						'${JSON.stringify(metric.value)}'
					)`
        );
      }
      setLoading(false);
    };
    reader.readAsText(file.originFile);
  });

  const renderUploadItem = useMemoizedFn(
    (_: React.ReactNode, file: UploadItem) => {
      return (
        <div className={styles.uploadItem}>
          <span className={styles.fileName}>
            <IconFile />
            {file.name}
          </span>

          {loading ? (
            <span className={styles.icon}>
              <IconLoading />
            </span>
          ) : (
            <span className={styles.icon}>
              <IconDelete />
            </span>
          )}
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
