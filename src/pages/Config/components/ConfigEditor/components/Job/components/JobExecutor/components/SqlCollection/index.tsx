import { Button } from "@arco-design/web-react";
import styles from "./index.module.less";
import { IconDelete, IconPlus } from "@arco-design/web-react/icon";
import SqlEditor from "@/components/SqlEditor";
import { useMemoizedFn } from "ahooks";
export interface SqlCollectionProps {
  value?: string[];
  onChange?: (value: string[]) => void;
}

/**
 *
 */
const SqlCollection = (props: SqlCollectionProps) => {
  const { value: sqlCollection, onChange } = props;

  const onAdd = useMemoizedFn(() => {
    if (!sqlCollection) {
      onChange && onChange([""]);
    } else {
      const nextValue = sqlCollection.concat("");
      onChange && onChange(nextValue);
    }
  });

  const onRemove = useMemoizedFn((index: number) => {
    const nextValue = [...sqlCollection];
    nextValue.splice(index, 1);
    onChange && onChange(nextValue);
  });

  const onSqlChange = useMemoizedFn((sql: string, index: number) => {
    const nextValue = [...sqlCollection];
    nextValue[index] = sql;
    onChange && onChange(nextValue);
  });

  return (
    <div className={styles.sqlCollection}>
      <div className={styles.operation}>
        <Button onClick={onAdd} icon={<IconPlus />} type="outline">
          添加SQL
        </Button>
      </div>
      <div className={styles.sqlGroup}>
        {sqlCollection &&
          sqlCollection.map((sql, index) => (
            <div key={index} className={styles.sqlWrapper}>
              <div className={styles.sqlEditor}>
                <SqlEditor
                  onChange={(v: string) => {
                    onSqlChange(v, index);
                  }}
                  value={sql}
                />
              </div>
              <div className={styles.sqlOperation}>
                <Button onClick={() => onRemove(index)} icon={<IconDelete />} />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default SqlCollection;
