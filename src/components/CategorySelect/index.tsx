import { Select, SelectProps } from "@arco-design/web-react";
import styles from "./index.module.less";
import { useEffect, useState } from "react";
import { queryCategoryForOptions } from "@/service/category";

export interface CategorySelectProps extends Omit<SelectProps, "options"> {}

/**
 *
 */
const CategorySelect = (props: CategorySelectProps) => {
  const [options, setOptions] = useState<SelectProps["options"]>();

  useEffect(() => {
    queryCategoryForOptions().then((options) => {
      setOptions(options);
    });
  }, []);

  return (
    <div className={styles.categorySelect}>
      <Select
        {...props}
        placeholder="请选择项目"
        allowClear
        options={options}
      />
    </div>
  );
};

export default CategorySelect;
