import classNames from "classnames";
import styles from "./index.module.less";
import { PropsWithChildren, ReactNode, useMemo, useState } from "react";
import { useMemoizedFn } from "ahooks";
import { IconCaretDown, IconCaretUp } from "@arco-design/web-react/icon";

export interface CollapseWrapperProps extends PropsWithChildren {
  className?: string;
  leftWrapperClassName?: string;
  collapseHeight?: number;
  enableCollapse?: boolean;
  actionRender?: () => ReactNode;
}

/**
 *
 */
const CollapseWrapper = (props: CollapseWrapperProps) => {
  const {
    className,
    leftWrapperClassName,
    collapseHeight = 100,
    enableCollapse = true,
    children,
    actionRender,
  } = props;

  const [collapse, setCollapse] = useState(false);

  const actionNode = useMemo(() => {
    if (actionRender) {
      return actionRender();
    }
  }, [actionRender]);

  const toggleCollapse = useMemoizedFn(() => {
    if (!enableCollapse) {
      return;
    }
    setCollapse(!collapse);
  });

  const wrapperStyle = useMemo(() => {
    if (collapse && enableCollapse) {
      return {
        height: collapseHeight,
        overflow: "hidden",
      };
    }
    return {
      height: "auto",
    };
  }, [collapse, collapseHeight, enableCollapse]);

  return (
    <div
      style={wrapperStyle}
      className={classNames(styles.collapseWrapper, className)}
    >
      <div onClick={toggleCollapse} className={styles.collapseActionWrapper}>
        {collapse ? <IconCaretDown /> : <IconCaretUp />}
      </div>
      <div className={classNames(styles.leftWrapper, leftWrapperClassName)}>
        {children}
      </div>
      {actionNode ? (
        <div className={styles.actionWrapper}>{actionNode}</div>
      ) : null}
    </div>
  );
};

export default CollapseWrapper;
