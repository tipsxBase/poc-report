import { Empty, Menu } from "@arco-design/web-react";
import styles from "./index.module.less";
import useServerStore from "@/stores/server";
import { useEffect, useState } from "react";
import { ServerEntity } from "@/service/server";
import { useMemoizedFn } from "ahooks";
import EnumManage from "./EnumManage";
import ServerManage from "../ServerManage";

export interface EnvSettingsProps {}

/**
 *
 */
const EnvSettings = () => {
  const { fetchAllServerList } = useServerStore();
  const [selectedKeys, setSelectKeys] = useState<string[]>();
  const [serverList, setServerList] = useState<ServerEntity[]>();
  const [action, setAction] = useState<string>();
  useEffect(() => {
    fetchAllServerList().then((list) => setServerList(list));
  }, [fetchAllServerList]);

  const onSelectMenuItem = useMemoizedFn((menuKey: string) => {
    const [action] = menuKey.split("_");
    setSelectKeys([menuKey]);
    setAction(action);
  });

  const renderContent = useMemoizedFn((action: string) => {
    switch (action) {
      case "enum":
        return <EnumManage />;
      case "server":
        return <ServerManage />;
      default: {
        return <Empty />;
      }
    }
  });

  return (
    <div className={styles.envSettings}>
      <div className={styles.leftWrapper}>
        <Menu
          selectedKeys={selectedKeys}
          onClickMenuItem={onSelectMenuItem}
          className={styles.menu}
        >
          <div className={styles.globalTitle}>全局</div>
          <Menu.Item key="enum">枚举</Menu.Item>
          <div className={styles.globalTitle}>环境</div>

          {serverList && serverList.length > 0 ? (
            serverList.map((server) => (
              <Menu.Item key={`server_${server.server_id}`}>
                {server.username}
              </Menu.Item>
            ))
          ) : (
            <Empty description="请配置环境" />
          )}
        </Menu>
      </div>
      <div className={styles.rightWrapper}>{renderContent(action)}</div>
    </div>
  );
};

export default EnvSettings;
