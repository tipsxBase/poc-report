import { sql } from "@codemirror/lang-sql"; //
import CodeMirror from "@uiw/react-codemirror";
import { monokai } from "@uiw/codemirror-theme-monokai";
import styles from "./index.module.less";
import FormatSvg from "@/assets/format.svg?react";
import { Button } from "@arco-design/web-react";
import { useMemoizedFn } from "ahooks";
import { format } from "sql-formatter";
export interface SqlEditorProps {
  height?: string;
  value?: string;
  onChange?: (v: string) => void;
}

/**
 *
 */
const SqlEditor = (props: SqlEditorProps) => {
  const { value, onChange, height = "200px" } = props;

  const formatSql = useMemoizedFn(() => {
    const formattedSql = format(value, {
      language: "sql",
      paramTypes: {
        custom: [
          {
            regex: ":[a-zA-Z0-9_]+",
          },
          {
            regex: "%",
          },
        ],
      },
    });
    onChange && onChange(formattedSql);
  });

  return (
    <div className={styles.sqlEditor} style={{ height }}>
      <Button
        size="mini"
        onClick={formatSql}
        className={styles.format}
        icon={<FormatSvg />}
      />
      <CodeMirror
        value={value}
        height={height}
        className={styles.sqlEditorCode}
        extensions={[sql()]}
        onChange={onChange}
        theme={monokai}
      />
    </div>
  );
};

export default SqlEditor;
