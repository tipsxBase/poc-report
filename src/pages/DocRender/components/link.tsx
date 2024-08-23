import type { ComponentProps } from "react";
import styles from "./index.module.less";
import { Link } from "@arco-design/web-react";

export const A = (props: ComponentProps<"a">) => {
  const { href = "", className = "" } = props;
  const hasHeaderAnchor = className.includes("header-anchor");

  if (hasHeaderAnchor || href.startsWith("#")) {
    return <a {...props} className={`${styles.link} ${className}`} />;
  }

  return (
    <Link
      {...props}
      className={`${className} ${styles.link} ${styles["inline-link"]}`}
      href={href}
    />
  );
};
