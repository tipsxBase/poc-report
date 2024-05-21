import { useOutlet } from "react-router";
import styles from "./index.module.less";
import { Button, Layout } from "@arco-design/web-react";
import BaseMenu from "./BaseMenu";
import { IconMenuFold, IconMenuUnfold } from "@arco-design/web-react/icon";
import { useState } from "react";
import { useMemoizedFn } from "ahooks";
import logo from "@/assets/logo.svg";
const Sider = Layout.Sider;
const Content = Layout.Content;

export interface BaseLayoutProps {}

/**
 *
 */
const BaseLayout = () => {
  const outlet = useOutlet();
  const [collapse, setCollapse] = useState(true);

  const toggleCollapse = useMemoizedFn(() => {
    setCollapse((c) => !c);
  });

  return (
    <Layout className={styles.baseLayout} style={{ height: "100vh" }}>
      <Sider className={styles.sider} collapsed={collapse}>
        <img src={logo} />
        <BaseMenu collapse={collapse} />
        <Button
          className={styles.collapseBtn}
          onClick={toggleCollapse}
          icon={collapse ? <IconMenuUnfold /> : <IconMenuFold />}
        />
      </Sider>
      <Content>{outlet}</Content>
    </Layout>
  );
};

export default BaseLayout;
