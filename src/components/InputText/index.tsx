import styles from "./index.module.less";

export interface InputTextProps {
  value?: string;
}

/**
 * 输入框展示组件
 */
const InputText = (props: InputTextProps) => {
  return <div className={styles.inputText}>{props.value}</div>;
};

export default InputText;
