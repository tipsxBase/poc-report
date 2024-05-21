import { Popconfirm, Upload } from "@arco-design/web-react";
import styles from "./index.module.less";
import { forwardRef, useImperativeHandle, useState } from "react";
import { useMemoizedFn } from "ahooks";
import { UploadItem } from "@arco-design/web-react/es/Upload";
import { parseYmlToJson } from "@/shared/yaml";
import { SharedInstance } from "../CaseEditor/ConfigEditor/sharedType";
import { IconDelete } from "@arco-design/web-react/icon";
export interface ImportConfigProps {}

export interface ImportConfigInstance extends SharedInstance<any> {}

/**
 *
 */
const ImportConfig = forwardRef<ImportConfigInstance, ImportConfigProps>(
  (_props, ref) => {
    const [config, setConfig] = useState({});
    const [file, setFile] = useState<UploadItem>();

    useImperativeHandle(
      ref,
      () => {
        return {
          getValues() {
            return Promise.resolve(config);
          },
          getRawValues() {
            return config;
          },
        };
      },
      [config]
    );

    const onUploadChange = useMemoizedFn((files: UploadItem[]) => {
      const [file] = files;
      const reader = new FileReader();
      setFile(file);
      reader.onload = function (e) {
        // 当文件读取完成时，更新图片的 src 属性
        const yamlDoc = e.target.result;
        const config = parseYmlToJson(yamlDoc as string);
        setConfig(config);
      };

      reader.readAsText(file.originFile);
    });

    const doDeleteFile = useMemoizedFn(() => {
      setFile(null);
    });

    return (
      <div className={styles.importConfig}>
        {!file ? (
          <Upload
            drag
            accept=".yml,.yaml"
            autoUpload={false}
            onChange={onUploadChange}
          />
        ) : (
          <div className={styles.uploadItem}>
            <span className={styles.fileName}>{file.name}</span>
            <Popconfirm onOk={doDeleteFile} title="确认删除？">
              <IconDelete />
            </Popconfirm>
          </div>
        )}
      </div>
    );
  }
);

export default ImportConfig;
