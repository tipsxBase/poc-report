import React, { useCallback, useRef, useState } from "react";
import { Grid, ColProps, Tooltip } from "@arco-design/web-react";
import { GridProps, ResponsiveValue } from "@arco-design/web-react/es/Grid";
import useElementWrap from "@/hooks/useElementWrap";
import classnames from "classnames";
import s from "./index.module.less";
import shrinkIcon from "@/assets/images/shrinkTree-icon.png";
import { useMemoizedFn, useSize } from "ahooks";

interface ListSearchLayoutProps {
  /**
   * 提交、重置按钮，由于是使用flex布局来改变的，所以需要传入两个子元素，或者两个子元素用Fragment标签包裹传入
   */
  submitButton: JSX.Element;
  /**
   * 子元素，一般为FormItem的合集
   */
  children: React.ReactNode;
  /**
   * 同Grid组件的cols
   */
  cols?: GridProps["cols"];
  /**
   * 同Grid组件的colGap
   */
  colGap?: GridProps["colGap"];
}

const { GridItem } = Grid;

export type FormItemType = {
  label: string;
  field: string | undefined;
  // formItemLayout
  labelCol?: ColProps;
  wrapperCol?: ColProps;
  Component: JSX.Element;
  [key: string]: any;
};

function ListSearchLayout(props: ListSearchLayoutProps): JSX.Element {
  const {
    submitButton,
    children,
    cols = { xs: 1, sm: 1, md: 2, lg: 2, xl: 3, xxl: 4 },
    colGap = 12,
  } = props;
  const gridRef = useRef<HTMLDivElement>(null);
  const { isWrapped: flag } = useElementWrap(gridRef);

  const [more, setMore] = useState(false);
  const { width } = useSize(() => document.getElementsByTagName("body")[0]);

  const getRowColsNum = useCallback(() => {
    const propCols = cols as ResponsiveValue;
    const { xxxl, xxl, xl, lg, md, sm, xs } = propCols;
    let num = 0;
    if (width >= 2000) {
      num = xxxl || xxl || xl || lg || md || sm || xs;
    } else if (width >= 1600) {
      num = xxl || xl || lg || md || sm || xs;
    } else if (width >= 1200) {
      num = xl || lg || md || sm || xs;
    } else if (width > 992) {
      num = lg || md || sm || xs;
    } else if (width > 768) {
      num = md || sm || xs;
    } else if (width > 576) {
      num = sm || xs;
    } else {
      num = xs || 1;
    }
    return num;
  }, [cols, width]);

  const getShowMore = useMemoizedFn(() => {
    return Math.ceil((children as any).length / getRowColsNum()) > 2;
  });

  return (
    <div
      className={classnames(s.formWrap, {
        [s.multiLineFormWrap]: flag,
      })}
    >
      <div className={s.gridWrap}>
        <Grid ref={gridRef} colGap={colGap} cols={cols}>
          {React.Children.map(children, (child, index) => (
            <GridItem key={index}>{child}</GridItem>
          ))}
        </Grid>
        {getShowMore() && (
          <Tooltip content={!more ? "展开" : "收起"}>
            <img
              className={more ? s.openIcon : s.closeIcon}
              src={shrinkIcon}
              alt="收起"
              onClick={() => setMore(!more)}
            />
          </Tooltip>
        )}
      </div>

      {flag && <div className={s.divider}></div>}
      <div className={s.btnWrap}>{submitButton}</div>
    </div>
  );
}

export default ListSearchLayout;
