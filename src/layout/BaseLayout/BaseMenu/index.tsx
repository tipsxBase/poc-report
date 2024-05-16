import styles from "./index.module.less";
import { Menu } from "@arco-design/web-react";
import { IconHome, IconCalendar } from "@arco-design/web-react/icon";
import { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";

const MenuItem = Menu.Item;

export interface BaseMenuProps {}

const routeMapping = {
  "/": "metric",
  "/config": "config",
  "/update": "update",
};

/**
 *
 */
const BaseMenu = () => {
  const location = useLocation();

  const pathname = location.pathname;
  const selectedKeys = useMemo(() => {
    return [routeMapping[pathname]];
  }, [pathname]);

  return (
    <Menu
      selectedKeys={selectedKeys}
      className={styles.baseMenu}
      mode="horizontal"
    >
      <MenuItem key="metric">
        <Link to="/">
          <IconHome />
          指标统计
        </Link>
      </MenuItem>
      <MenuItem key="config">
        <Link to="/config">
          <IconCalendar />
          配置生成
        </Link>
      </MenuItem>
      <MenuItem key="update">
        <Link to="/update">
          <IconCalendar />
          更新指标
        </Link>
      </MenuItem>
    </Menu>
  );
};

export default BaseMenu;
