import { useOutlet } from "react-router";
import styles from "./index.module.less";
import { Layout } from "@arco-design/web-react";
import BaseMenu from "./BaseMenu";

const Header = Layout.Header;
const Content = Layout.Content;

export interface BaseLayoutProps {}

/**
 *
 */
const BaseLayout = () => {
  const outlet = useOutlet();

  return (
    <Layout className={styles.baseLayout} style={{ height: "100vh" }}>
      <Header>
        <BaseMenu />
      </Header>
      <Content>{outlet}</Content>
    </Layout>
  );
};

export default BaseLayout;
