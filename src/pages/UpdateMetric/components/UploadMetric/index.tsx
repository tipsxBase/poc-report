import { Upload } from "@arco-design/web-react";
import styles from "./index.module.less";
import { useMemoizedFn } from "ahooks";
import { UploadItem } from "@arco-design/web-react/es/Upload";
import SQLite from "@/shared/Sqlite";
import { IconDelete, IconFile, IconLoading } from "@arco-design/web-react/icon";
import { useState } from "react";

export interface UploadMetricProps {}

/**
 *
 */
const UploadMetric = () => {
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
      const metric = JSON.parse(e.target.result as string);
      const db = await SQLite.open();
      await db.execute(`CREATE TABLE IF NOT EXISTS poc_metric(
				jobId  TEXT,
				totalStatement  INTEGER,
				avgStatementCastMills  NUMERIC,
				avgSqlCastMills  NUMERIC,
				statementQps  NUMERIC,
				sqlQps  NUMERIC,
				writeMibPreSecond  NUMERIC,
				startMills  INTEGER,
				endMills  INTEGER,
				executeTime  TEXT,
				p80  INTEGER,
				p95  INTEGER,
				avgRowWidth  NUMERIC
			)`);
      await db.execute("DELETE FROM poc_metric");
      await db.execute(
        `INSERT
					INTO
					poc_metric(
						jobId,
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
						avgRowWidth
					)
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
    <div className={styles.uploadMetric}>
      <Upload
        accept=".json"
        drag
        renderUploadItem={renderUploadItem}
        autoUpload={false}
        fileList={fileList}
        onChange={onUploadChange}
      />
    </div>
  );
};

export default UploadMetric;
