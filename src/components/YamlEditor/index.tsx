import { yaml } from "@codemirror/lang-yaml"; //
import CodeMirror from "@uiw/react-codemirror";
import { monokai } from "@uiw/codemirror-theme-monokai";
import styles from "./index.module.less";

export interface SqlEditorProps {
  value?: string;
  onChange?: (v: string) => void;
  readOnly?: boolean;
}

/**
 *
 */
const YamlEditor = (props: SqlEditorProps) => {
  const { value, onChange, readOnly } = props;

  return (
    <CodeMirror
      value={value}
      height="100%"
      readOnly={readOnly}
      className={styles.yamlEditor}
      extensions={[yaml()]}
      onChange={onChange}
      theme={monokai}
    />
  );
};

export default YamlEditor;
