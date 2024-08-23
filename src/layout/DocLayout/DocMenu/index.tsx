import styles from "./index.module.less";
import { Menu } from "@arco-design/web-react";
import { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { menus } from "mpa-routes";

const MenuItem = Menu.Item;

export interface DocMenuProps {}

/**
 *
 */
const DocMenu = () => {
  const location = useLocation();

  const pathname = location.pathname;
  const selectedKeys = useMemo(() => {
    return [pathname.replace("/render/", "")];
  }, [pathname]);

  return (
    <div className={styles.baseMenu}>
      <Menu selectedKeys={selectedKeys}>
        {menus.map((menu) => {
          const pathKey = menu.key;
          return (
            <Link key={pathKey} to={`/render/${pathKey}`}>
              <MenuItem key={pathKey}>{menu.title}</MenuItem>
            </Link>
          );
        })}
      </Menu>
    </div>
  );
};

export default DocMenu;
