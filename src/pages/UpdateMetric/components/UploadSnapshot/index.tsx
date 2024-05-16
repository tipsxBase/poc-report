import { Upload } from "@arco-design/web-react";
import styles from "./index.module.less";
import { useMemoizedFn } from "ahooks";
import SQLite from "@/shared/Sqlite";
import { UploadItem } from "@arco-design/web-react/es/Upload";
import { useState } from "react";
import { IconDelete, IconFile, IconLoading } from "@arco-design/web-react/icon";

export interface UploadSnapshotProps {}

/**
 *
 */
const UploadSnapshot = () => {
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
      const snapshot = JSON.parse(e.target.result as string);

      const db = await SQLite.open();
      await db.execute(`CREATE TABLE IF NOT EXISTS poc_metric_snapshot(
				jobId  TEXT,
				totalStatement  INTEGER,
				avgStatementCastMills  REAL,
				avgSqlCastMills  REAL,
				statementQps  REAL,
				sqlQps  REAL,
				writeMibPreSecond  REAL,
				startMills  INTEGER,
				endMills  INTEGER,
				executeTime  TEXT,
				p80  INTEGER,
				p95  INTEGER,
				avgRowWidth  REAL
			)`);
      await db.execute("DELETE FROM poc_metric_snapshot");
      for (let i = 0; i < snapshot.length; i++) {
        const metric = snapshot[i];
        await db.execute(
          `INSERT
					INTO
					poc_metric_snapshot(jobId,
					totalStatement,
					avgStatementCastMills,
					avgSqlCastMills,
					statementQps,
					sqlQps,
					writeMibPreSecond,
					startMills,
					endMills,
					executeTime,
					p80,
					p95,
					avgRowWidth)
				VALUES(
					'${metric.jobId}',
					'${metric.totalStatement}',
					'${metric.avgStatementCastMills}',
					'${metric.avgSqlCastMills}',
					'${metric.statementQps}',
					'${metric.sqlQps}',
					'${metric.writeMibPreSecond}',
					'${metric.startMills}',
					'${metric.endMills}',
					'${metric.executeTime}',
					'${metric.p80}',
					'${metric.p95}',
					'${metric.avgRowWidth}'
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
