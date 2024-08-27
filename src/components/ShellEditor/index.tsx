import CodeMirror from "@uiw/react-codemirror";
import { monokai } from "@uiw/codemirror-theme-monokai";
import styles from "./index.module.less";
import { StreamLanguage } from "@codemirror/language";
import { shell } from "@codemirror/legacy-modes/mode/shell";

export interface SqlEditorProps {
  value?: string;
  onChange?: (v: string) => void;
  readOnly?: boolean;
}

/**
 *
 */
const ShellEditor = (props: SqlEditorProps) => {
  const { value, onChange, readOnly } = props;

  return (
    <CodeMirror
      value={value}
      height="100%"
      readOnly={readOnly}
      className={styles.yamlEditor}
      extensions={[StreamLanguage.define(shell)]}
      onChange={onChange}
      theme={monokai}
    />
  );
};

export default ShellEditor;
