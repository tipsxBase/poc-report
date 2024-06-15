import { Button, Table } from "@arco-design/web-react";
import styles from "./index.module.less";
import { IconPlus } from "@arco-design/web-react/icon";

export interface EnumManageProps {}

/**
 *
 */
const EnumManage = () => {
  return (
    <div className={styles.enumManage}>
      <Button type="outline" icon={<IconPlus />}>
        添加枚举
      </Button>
      <Table />
    </div>
  );
};

export default EnumManage;
