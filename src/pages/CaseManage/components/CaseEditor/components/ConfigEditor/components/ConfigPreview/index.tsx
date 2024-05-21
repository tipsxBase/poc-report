import { parseJsonToYml } from "@/shared/yaml";
import styles from "./index.module.less";
import YamlEditor from "@/components/YamlEditor";

import { useMemo } from "react";

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

  return (
    <div className={styles.configPreview}>
      <YamlEditor readOnly value={yaml} />
    </div>
  );
};

export default ConfigPreview;
