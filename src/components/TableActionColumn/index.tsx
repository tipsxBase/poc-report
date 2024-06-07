import { Divider, Link, Menu, Space, Trigger } from "@arco-design/web-react";
import { IconMore } from "@arco-design/web-react/icon";
import { Children, Fragment, ReactNode, useMemo } from "react";
import styles from "./index.module.less";

export interface TableActionColumnProps {
  maxDisplayAction?: number;
  children: ReactNode | ReactNode[];
  triggerClassName?: string;
}

const verticalDividerStyle = {
  margin: "0 6px",
};

const horizontalDividerStyle = {
  margin: "4px 0",
};

const TableActionColumn = (props: TableActionColumnProps) => {
  const { maxDisplayAction = 3, children, triggerClassName } = props;
  const renderChildren = Children.toArray(children);
  const actionCount = Children.count(renderChildren);

  const hiddenChildren = renderChildren.splice(
    maxDisplayAction,
    actionCount - maxDisplayAction
  );

  const dropList = useMemo(() => {
    return (
      <Menu selectable={false} className={styles.dropMenu}>
        {Children.map(hiddenChildren, (child, index) => {
          if (index === 0) {
            return <Menu.Item key={`${index}`}>{child}</Menu.Item>;
          }
          return (
            <Fragment key={index}>
              <Divider type="horizontal" style={horizontalDividerStyle} />
              <Menu.Item key={`${index}`}>{child}</Menu.Item>
            </Fragment>
          );
        })}
      </Menu>
    );
  }, [hiddenChildren]);

  if (actionCount <= maxDisplayAction) {
    return (
      <Space
        className={styles.tableActionColumn}
        split={<Divider type="vertical" style={verticalDividerStyle} />}
      >
        {renderChildren}
      </Space>
    );
  }

  return (
    <Space
      className={styles.tableActionColumn}
      split={<Divider type="vertical" style={verticalDividerStyle} />}
    >
      {renderChildren}
      <Trigger
        trigger="click"
        showArrow
        updateOnScroll
        position="br"
        popupAlign={{
          bottom: 5,
        }}
        className={triggerClassName}
        childrenPrefix={styles.dropdownWrapper}
        arrowProps={{
          style: {
            borderLeft: `1px solid var(--color-neutral-3)`,
            borderTop: `1px solid var(--color-neutral-3)`,
          },
        }}
        popup={() => dropList}
      >
        <Link>
          <IconMore />
        </Link>
      </Trigger>
    </Space>
  );
};

export default TableActionColumn;
