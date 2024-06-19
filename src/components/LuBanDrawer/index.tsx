import {
  Button,
  ButtonProps,
  Drawer,
  DrawerProps,
} from "@arco-design/web-react";
import { FC, useMemo } from "react";
import styles from "./index.module.less";

export interface LuBanDrawerProps extends DrawerProps {}

const LuBanDrawer: FC<LuBanDrawerProps> = (props) => {
  const {
    footer,
    onOk,
    onCancel,
    okButtonProps,
    cancelButtonProps,
    ...restProps
  } = props;

  const lubanDrawerFooter = useMemo(() => {
    if (footer) return footer;

    if (footer === null) {
      return null;
    }

    const innerCancelButtonProps: ButtonProps = {
      onClick: onCancel,
      children: "取消",
      ...cancelButtonProps,
    };

    const innerOkButtonProps: ButtonProps = {
      onClick: onOk,
      type: "outline",
      children: "保存",
      ...okButtonProps,
    };

    return [
      <Button key="cancel" {...innerCancelButtonProps} />,
      <Button key="confirm" {...innerOkButtonProps} />,
    ];
  }, [footer, okButtonProps, cancelButtonProps, onOk, onCancel]);

  return (
    <Drawer
      footer={lubanDrawerFooter}
      onOk={onOk}
      onCancel={onCancel}
      unmountOnExit
      maskClosable={false}
      escToExit={false}
      wrapClassName={styles.luBanDrawer}
      getPopupContainer={() => document.querySelector(".poc_master_wrapper")}
      {...restProps}
    />
  );
};

export default LuBanDrawer;
