import { sql } from "@codemirror/lang-sql"; //
import CodeMirror from "@uiw/react-codemirror";
import { monokai } from "@uiw/codemirror-theme-monokai";
import styles from "./index.module.less";

export interface SqlEditorProps {
  value?: string;
  onChange?: (v: string) => void;
}

/**
 *
 */
const SqlEditor = (props: SqlEditorProps) => {
  const { value, onChange } = props;

  return (
    <CodeMirror
      value={value}
      height="200px"
      className={styles.sqlEditor}
      extensions={[sql()]}
      onChange={onChange}
      theme={monokai}
    />
  );
};

export default SqlEditor;
