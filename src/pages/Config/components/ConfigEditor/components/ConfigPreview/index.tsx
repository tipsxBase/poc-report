import { parseJsonToYml } from "@/shared/yaml";
import styles from "./index.module.less";
import YamlEditor from "@/components/YamlEditor";
import { Button, Message } from "@arco-design/web-react";
import { useMemoizedFn } from "ahooks";
import { useMemo } from "react";
import { dialog } from "@tauri-apps/api";
import { invoke } from "@tauri-apps/api/tauri";
export interface ConfigPreviewProps {
  initialValues: object;
}

/**
 *
 */
const ConfigPreview = (props: ConfigPreviewProps) => {
  const { initialValues } = props;

  const yaml = useMemo(() => {
    return parseJsonToYml(initialValues);
  }, [initialValues]);
  const downloadYaml = useMemoizedFn(async () => {
    // 选择下载目录
    const selectedDirectory = await dialog.open({
      directory: true,
      multiple: false,
      title: "Select Download Directory",
    });
    const fileName = `${selectedDirectory}/case.yml`;
    await invoke("download_file", {
      fileName,
      content: yaml,
    });
    Message.success(`文件下载成功->${fileName}`);
  });

  return (
    <div className={styles.configPreview}>
      <Button onClick={downloadYaml}>下载Yaml</Button>
      <YamlEditor readOnly value={yaml} />
    </div>
  );
};

export default ConfigPreview;
