import { useOutlet } from "react-router";
import styles from "./index.module.less";
import {
  Button,
  Divider,
  Drawer,
  Layout,
  Modal,
  Select,
  SelectProps,
  Space,
} from "@arco-design/web-react";
import BaseMenu from "./BaseMenu";
import {
  IconMenuFold,
  IconMenuUnfold,
  IconSettings,
} from "@arco-design/web-react/icon";
import { useEffect, useState } from "react";
import { useMemoizedFn } from "ahooks";
import logo from "@/assets/logo.svg";
import IconWindowMaximize from "@/assets/mdi_window-maximize.svg?react";
import IconWindowMinimize from "@/assets/mdi_window-minimize.svg?react";
import IconWindowClose from "@/assets/mdi_close.svg?react";
import { appWindow } from "@tauri-apps/api/window";
import EnvManage from "@/assets/EnvManage.svg?react";
import useServerStore from "@/stores/server";
import EnvSettings from "@/pages/EnvSettings";

const Sider = Layout.Sider;
const Header = Layout.Header;
const Content = Layout.Content;
export interface BaseLayoutProps {}

/**
 *
 */
const BaseLayout = () => {
  const outlet = useOutlet();
  const [collapse, setCollapse] = useState(true);
  const { fetchAllServerList, updateCheckDefaultServer } = useServerStore();
  const [options, setOptions] = useState<SelectProps["options"]>();
  const [defaultServerId, setDefaultServerId] = useState();
  const [envSetting, setEnvSetting] = useState(false);
  const toggleCollapse = useMemoizedFn(() => {
    setCollapse((c) => !c);
  });

  const dropdownRender = useMemoizedFn((menu: React.ReactNode) => {
    return (
      <div className={styles.selectDropdown}>
        {menu}
        <Divider className={styles.divider} />
        <a onClick={openEnvSettings} className={styles.manageBtn}>
          <IconSettings />
          <span>管理环境</span>
        </a>
      </div>
    );
  });

  useEffect(() => {
    fetchAllServerList().then((servers: any) => {
      const options = servers.map((server) => {
        if (server.is_default === 1) {
          setDefaultServerId(server.server_id);
        }
        return {
          label: server.server_name,
          value: server.server_id,
        };
      });
      setOptions(options);
    });
  }, [fetchAllServerList]);

  const windowMinimize = useMemoizedFn(() => {
    appWindow.minimize();
  });

  const toggleMaximize = useMemoizedFn(() => {
    appWindow.toggleMaximize();
  });

  const windowClose = useMemoizedFn(() => {
    Modal.confirm({
      title: "确认关闭？",
      onConfirm: () => {
        appWindow.close();
      },
      okButtonProps: {
        type: "outline",
        autoFocus: false,
      },
      cancelButtonProps: {
        autoFocus: false,
      },
    });
  });

  const switchServer = useMemoizedFn((server_id) => {
    updateCheckDefaultServer(server_id).then(() => {
      setDefaultServerId(server_id);
    });
  });

  const openEnvSettings = useMemoizedFn(() => {
    setEnvSetting(true);
  });

  const closeEnvSettings = useMemoizedFn(() => {
    setEnvSetting(false);
  });

  return (
    <Layout className={styles.baseLayout} style={{ height: "100vh" }}>
      <Header data-tauri-drag-region className={styles.header}>
        <img className={styles.logo} src={logo} />
        <div className={styles.systemWrapper}>
          <IconSettings className={styles.windowIcon} />
          <Space>
            <IconWindowMinimize
              className={styles.windowIcon}
              onClick={windowMinimize}
            />
            <IconWindowMaximize
              className={styles.windowIcon}
              onClick={toggleMaximize}
            />
            <IconWindowClose
              className={styles.windowIcon}
              onClick={windowClose}
            />
          </Space>
        </div>
      </Header>
      <Layout className={styles.content}>
        <Sider className={styles.sider} collapsed={collapse}>
          <BaseMenu collapse={collapse} />
        </Sider>
        <Content className={styles.wrapper}>
          <div className={styles.actionWrapper}>
            <Button
              size="small"
              className={styles.collapseBtn}
              onClick={toggleCollapse}
              icon={collapse ? <IconMenuUnfold /> : <IconMenuFold />}
            />
            <div className={styles.envSettings}>
              <Select
                value={defaultServerId}
                size="small"
                style={{ width: 200 }}
                placeholder="切换环境"
                dropdownRender={dropdownRender}
                options={options}
                onChange={switchServer}
              />
              <Button
                className={styles.envBtn}
                size="small"
                icon={<EnvManage />}
                onClick={openEnvSettings}
              />
            </div>
          </div>
          <div className={styles.contentWrapper}>{outlet}</div>
        </Content>
      </Layout>
      <Drawer
        visible={envSetting}
        onCancel={closeEnvSettings}
        title="全局配置"
        width="100%"
        unmountOnExit
        footer={null}
      >
        <EnvSettings />
      </Drawer>
    </Layout>
  );
};

export default BaseLayout;
