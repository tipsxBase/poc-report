import {
  CSSProperties,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import styles from "./cell.module.less";
import { Tooltip, TooltipProps } from "@arco-design/web-react";
import classNames from "classnames";
import ResizeObserver from "rc-resize-observer";
import { useMemoizedFn } from "ahooks";
import calcSize from "@/shared/calcSize";

export interface TextRenderProps<T = any> {
  /**
   *
   */
  className?: string;
  // text: string | number;
  text?: ReactNode;
  // fontSize?: number;
  style?: React.CSSProperties;
  /**
   * 单元格的key
   */
  rowKey?: string;
  record?: T;
  index?: number;

  /**
   * 自定义取值逻辑
   * @param item
   * @returns
   */
  render?: (text: ReactNode, item: T, index: number) => string;

  getPopupContainer?: (node: HTMLElement) => Element;

  /**
   * 不使用message提示
   */
  doNotNotification?: boolean;

  tooltipDisabled?: boolean;

  displayRow?: number;

  tooltipProps?: TooltipProps;
}

/**
 * 计算文本长度
 * @param text
 * @returns
 */

/**
 * Table 单元格渲染
 * @param props
 * @returns
 */
const TextRender = <T = any,>(props: TextRenderProps<T>) => {
  const outerContainerRef = useRef<HTMLDivElement>();
  const {
    text,
    rowKey,
    render,
    record,
    index,
    getPopupContainer,
    style,
    className,
    tooltipDisabled,
    displayRow,
    tooltipProps,
  } = props;
  const styleRef = useRef(style);
  styleRef.current = style;
  const displayText = useMemo(() => {
    if (render) {
      return render(text, record, index);
    }
    // 为 0 时也要显示
    if (text !== null && text !== undefined && text !== "") {
      return text;
    }
    return "-";
  }, [index, record, render, text]);

  const textWidth = useMemo(() => {
    const { width } = calcSize(displayText, styleRef.current, className);
    if (displayRow && displayRow > 1) {
      return Math.ceil(width / displayRow);
    }
    return width;
  }, [displayText, displayRow, className]);

  const [ellipsis, setIsEllipse] = useState(true);

  const onResize = useMemoizedFn(({ offsetWidth }) => {
    // const width = Math.ceil(offsetWidth);
    const width = offsetWidth;
    if (width === 0) return;
    setIsEllipse(textWidth > width);
  });

  const labelStyle = useMemo<CSSProperties>(() => {
    if (!displayRow || displayRow === 1) {
      return null;
    }
    return {
      display: "-webkit-box",
      WebkitLineClamp: displayRow,
      WebkitBoxOrient: "vertical",
      whiteSpace: "unset",
      wordBreak: "break-all",
    };
  }, [displayRow]);

  const textRender = useMemo(
    () => (
      <div
        style={labelStyle}
        className={classNames(styles.textWrapper, className)}
      >
        {displayText}
      </div>
    ),
    [labelStyle, className, displayText]
  );

  useEffect(() => {
    const { width } = outerContainerRef.current.getBoundingClientRect();
    // 16px 是复制的图标的宽度，6px 是字体图标跟右侧文字的宽度，12px 是 ... 的宽度
    setIsEllipse(textWidth > width);
  }, [textWidth]);

  return (
    <ResizeObserver onResize={onResize}>
      <div key={rowKey} ref={outerContainerRef} className={styles.cellRender}>
        {ellipsis ? (
          <Tooltip
            {...tooltipProps}
            disabled={tooltipDisabled}
            getPopupContainer={getPopupContainer}
            content={text}
          >
            {textRender}
          </Tooltip>
        ) : (
          textRender
        )}
      </div>
    </ResizeObserver>
  );
};

export default TextRender;
