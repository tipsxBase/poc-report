import { Select, SelectProps } from "@arco-design/web-react";
import styles from "./index.module.less";
import { useEffect, useState } from "react";
import useServerStore from "@/stores/server";

export interface CategorySelectProps extends Omit<SelectProps, "options"> {}

/**
 *
 */
const ServerSelect = (props: CategorySelectProps) => {
  const [options, setOptions] = useState<SelectProps["options"]>();
  const { fetchAllServerList } = useServerStore();

  useEffect(() => {
    fetchAllServerList().then((servers: any) => {
      const options = servers.map((server) => {
        return {
          label: server.server_name,
          value: server.server_id,
        };
      });
      setOptions(options);
    });
  }, [fetchAllServerList]);

  return (
    <div className={styles.categorySelect}>
      <Select
        {...props}
        placeholder="请选择关联服务"
        allowClear
        options={options}
      />
    </div>
  );
};

export default ServerSelect;
