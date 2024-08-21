import { useOutlet } from "react-router";
import styles from "./index.module.less";
import {
  Button,
  Layout,
  Modal,
  Popover,
  Select,
  SelectProps,
  Space,
} from "@arco-design/web-react";
import BaseMenu from "./BaseMenu";
import { IconMenuFold, IconMenuUnfold } from "@arco-design/web-react/icon";
import { useEffect, useState } from "react";
import { useMemoizedFn } from "ahooks";
import icon from "@/assets/Icon.svg";
import logo from "@/assets/Bench.svg";

import IconWindowMaximize from "@/assets/mdi_window-maximize.svg?react";
import IconWindowMinimize from "@/assets/mdi_window-minimize.svg?react";
import IconWindowClose from "@/assets/mdi_close.svg?react";
import { appWindow } from "@tauri-apps/api/window";
import EnvManage from "@/assets/EnvManage.svg?react";
import useServerStore from "@/stores/server";
import EnvSettings from "@/pages/EnvSettings";
import classNames from "classnames";
import LuBanDrawer from "@/components/LuBanDrawer";
import { PiBookBookmark } from "react-icons/pi";
import ServerInitial from "@/assets/ServerInitial.svg?react";
import ServerUninitial from "@/assets/ServerUninitial.svg?react";
import { isMacOS } from "@/shared/platform";
import { IoMdClose } from "react-icons/io";
import MaximizeMac from "@/assets/Maximize-mac_24_24.svg?react";
import MinimizeMac from "@/assets/Minimize-mac_24_24.svg?react";
import { MdOutlineAddTask } from "react-icons/md";
import TaskManage from "@/pages/TaskManage";

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

  const fetchServer = useMemoizedFn(() => {
    fetchAllServerList().then((servers: any) => {
      const options = servers.map((server) => {
        if (server.is_default === 1) {
          setDefaultServerId(server.server_id);
        }
        return {
          label: (
            <span className={styles.serverOption}>
              {server.initial_state === 1 ? (
                <ServerInitial
                  className={classNames(styles.serverIcon, "arco-icon")}
                />
              ) : (
                <ServerUninitial
                  className={classNames(styles.serverIcon, "arco-icon")}
                />
              )}

              {server.server_name}
            </span>
          ),
          value: server.server_id,
        };
      });
      setOptions(options);
    });
  });

  useEffect(() => {
    fetchServer();
  }, [fetchServer]);

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
  const afterClose = useMemoizedFn(() => {
    fetchServer();
  });

  const isMac = isMacOS();

  return (
    <Layout className={styles.baseLayout} style={{ height: "100vh" }}>
      <Header
        data-tauri-drag-region
        className={classNames(
          styles.header,
          isMac ? styles.macHeader : styles.windowHeader
        )}
      >
        {isMac ? (
          <>
            <div className={styles.macBar}>
              <button onClick={windowClose} className={styles.barItem}>
                <IoMdClose className={styles.macIcon} />
              </button>
              <button onClick={windowMinimize} className={styles.barItem}>
                <MinimizeMac className={styles.macIcon} />
              </button>
              <button onClick={toggleMaximize} className={styles.barItem}>
                <MaximizeMac className={styles.macIcon} />
              </button>
            </div>
            <div className={styles.headerLogo}>
              <img className={styles.logo} src={icon} />
              <img className={styles.logo} src={logo} />
            </div>
          </>
        ) : (
          <>
            <div className={styles.headerLogo}>
              <img className={styles.logo} src={icon} />
              <img className={styles.logo} src={logo} />
            </div>
            <div className={styles.systemWrapper}>
              <PiBookBookmark className={styles.windowIcon} />
              {/* <IconSettings className={styles.windowIcon} /> */}
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
          </>
        )}
      </Header>
      <Layout className={classNames("poc_master_wrapper", styles.content)}>
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
            <div className={classNames(styles.envSettings, "flex gap-2")}>
              <Popover className={styles.taskPopover} content={<TaskManage />}>
                <Button
                  size="small"
                  className="flex items-center justify-center"
                  icon={<MdOutlineAddTask />}
                />
              </Popover>

              <Select
                value={defaultServerId}
                size="small"
                style={{ width: 200 }}
                placeholder="切换环境"
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
      <LuBanDrawer
        visible={envSetting}
        onCancel={closeEnvSettings}
        title="全局配置"
        width="100%"
        unmountOnExit
        footer={null}
        afterClose={afterClose}
      >
        <EnvSettings />
      </LuBanDrawer>
    </Layout>
  );
};

export default BaseLayout;
