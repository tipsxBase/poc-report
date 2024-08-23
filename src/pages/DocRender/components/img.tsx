import classNames from "classnames";
import type { ComponentProps } from "react";

export const Img = (props: ComponentProps<"img">) => {
  const { className, ...restProps } = props;
  return (
    <img
      {...restProps}
      className={classNames(className, "max-w-[50%] mx-auto")}
      src={props.src || ""}
    />
  );
};
