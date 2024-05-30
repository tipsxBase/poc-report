import styles from "./index.module.less";
import { Menu } from "@arco-design/web-react";
import { IconHome, IconCalendar } from "@arco-design/web-react/icon";
import { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";

const MenuItem = Menu.Item;

export interface BaseMenuProps {
  collapse: boolean;
}

const routeMapping = {
  "/": "cases",
  "/business": "business",
  "/server": "server",
};

/**
 *
 */
const BaseMenu = (props: BaseMenuProps) => {
  const location = useLocation();
  const { collapse } = props;

  const pathname = location.pathname;
  const selectedKeys = useMemo(() => {
    return [routeMapping[pathname]];
  }, [pathname]);

  return (
    <div className={styles.baseMenu}>
      <Menu collapse={collapse} selectedKeys={selectedKeys}>
        <Link to="/">
          <MenuItem key="cases">
            <IconHome />
            用例管理
          </MenuItem>
        </Link>
        <Link to="/business">
          <MenuItem key="business">
            <IconCalendar />
            项目管理
          </MenuItem>
        </Link>
        <Link to="/server">
          <MenuItem key="server">
            <IconCalendar />
            服务管理
          </MenuItem>
        </Link>
      </Menu>
    </div>
  );
};

export default BaseMenu;
