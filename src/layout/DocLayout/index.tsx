import { Navigate, useLocation, useOutlet } from "react-router";
import styles from "./index.module.less";
import { Layout } from "@arco-design/web-react";

import classNames from "classnames";
import { menus } from "mpa-routes";
import DocMenu from "./DocMenu";

const Sider = Layout.Sider;
const Content = Layout.Content;

/**
 *
 */
const DocLayout = () => {
  const outlet = useOutlet();
  const location = useLocation();

  const defaultMenu = menus[0];
  if (location.pathname === "/") {
    return <Navigate to={`/render/${defaultMenu["key"]}`} />;
  }

  return (
    <Layout className={styles.baseLayout} style={{ height: "100vh" }}>
      <Layout className={classNames("poc_master_wrapper", styles.content)}>
        <Sider className={styles.sider}>
          <DocMenu />
        </Sider>
        <Content className={styles.wrapper}>
          <div className={styles.contentWrapper}>{outlet}</div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default DocLayout;
