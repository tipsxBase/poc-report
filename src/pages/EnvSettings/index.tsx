import { Empty, Menu } from "@arco-design/web-react";
import styles from "./index.module.less";
import { useState } from "react";
import { useMemoizedFn } from "ahooks";
import EnumManage from "./EnumManage";
import ServerManage from "./ServerManage";
import { FaServer } from "react-icons/fa";
import { VscSymbolEnum } from "react-icons/vsc";

export interface EnvSettingsProps {}

/**
 *
 */
const EnvSettings = () => {
  const [selectedKeys, setSelectKeys] = useState<string[]>();
  const [action, setAction] = useState<string>();

  const onSelectMenuItem = useMemoizedFn((menuKey: string) => {
    setSelectKeys([menuKey]);
    setAction(menuKey);
  });

  const renderContent = useMemoizedFn((action: string) => {
    switch (action) {
      case "enum":
        return <EnumManage />;
      case "server":
        return <ServerManage />;
      default: {
        return (
          <Empty className={styles.noSelect} description="请选择要配置的项" />
        );
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
          <Menu.Item key="enum">
            <VscSymbolEnum className="arco-icon" />
            枚举管理
          </Menu.Item>
          <Menu.Item key="server">
            <FaServer className="arco-icon" />
            服务管理
          </Menu.Item>
        </Menu>
      </div>
      <div className={styles.rightWrapper}>{renderContent(action)}</div>
    </div>
  );
};

export default EnvSettings;
