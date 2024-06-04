import { useEffect, useState } from "react";
import { useSize } from "ahooks";

interface ReturnValue {
  isWrapped: boolean;
  height?: number;
}

/**
 *
 * @param elementRef 容器实例的Ref
 * @param heightDiff 高度差
 * @param className 子元素的className
 * @returns 容器的高度和是否换行标识
 */
function useElementWrap(
  elementRef: React.RefObject<HTMLElement | null | undefined>,
  heightDiff?: number
  // className?: string
): ReturnValue {
  // 高度差
  heightDiff = heightDiff || 20;
  // 是否换行
  const [isLineWrapped, setIsLineWrapped] = useState(false);
  // 元素高度
  const { height } = useSize(elementRef) || {};
  useEffect(() => {
    // 所有的子元素
    const childNodes: Array<Element> = elementRef.current?.children
      ? // eslint-disable-next-line no-unsafe-optional-chaining
        [...elementRef.current?.children]
      : [];
    let isWrap: boolean = false;
    // 计算相邻子元素的高度差是否大于设置的高度差
    for (let i = 1; i < childNodes.length; i++) {
      const prevDOMRect = childNodes[i - 1].getBoundingClientRect();
      const currentDOMRect = childNodes[i].getBoundingClientRect();
      isWrap = Math.abs(prevDOMRect.y - currentDOMRect.y) > heightDiff;
      if (isWrap) {
        break;
      }
    }
    setIsLineWrapped(isWrap);
  }, [height, elementRef, heightDiff]);

  return { isWrapped: isLineWrapped, height };
}

export default useElementWrap;
