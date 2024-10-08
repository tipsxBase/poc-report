import styles from "./index.module.less";
import { Menu } from "@arco-design/web-react";
import { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { GrProjects, GrResources } from "react-icons/gr";
import { GrTest } from "react-icons/gr";
import { TbFileTypeSql } from "react-icons/tb";
import { SiOpenapiinitiative } from "react-icons/si";

const MenuItem = Menu.Item;

export interface BaseMenuProps {
  collapse: boolean;
}

const routeMapping = {
  "/": "cases",
  "/business": "business",
  "/ddl": "ddl",
  "/resource": "resource",
  "/initial": "initial",
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
            <GrTest className="arco-icon" />
            用例管理
          </MenuItem>
        </Link>
        <Link to="/business">
          <MenuItem key="business">
            <GrProjects className="arco-icon" />
            项目管理
          </MenuItem>
        </Link>
        <Link to="/ddl">
          <MenuItem key="ddl">
            <TbFileTypeSql className="arco-icon" />
            脚本管理
          </MenuItem>
        </Link>
        <Link to="/resource">
          <MenuItem key="resource">
            <GrResources className="arco-icon" />
            资源管理
          </MenuItem>
        </Link>
        <Link to="/initial">
          <MenuItem key="initial">
            <SiOpenapiinitiative className="arco-icon" />
            数据初始化
          </MenuItem>
        </Link>
      </Menu>
    </div>
  );
};

export default BaseMenu;
