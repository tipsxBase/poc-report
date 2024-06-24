import { InputNumber, Switch } from "@arco-design/web-react";
import styles from "./index.module.less";
import { useMemoizedFn } from "ahooks";
import { isNullOrUndefined } from "@/shared/is";

export interface SwitchNumberProps {
  value?: number;
  onChange?: (v: number) => void;
}

/**
 *
 */
const SwitchNumber = (props: SwitchNumberProps) => {
  const { value, onChange } = props;

  const switchChecked = useMemoizedFn((checked) => {
    if (checked) {
      onChange && onChange(1);
    } else {
      onChange && onChange(0);
    }
  });

  const onValueChange = useMemoizedFn((v) => {
    onChange && onChange(v);
  });

  return (
    <div className={styles.switchNumber}>
      {isNullOrUndefined(value) || Number(value) === 0 ? (
        <Switch checked={false} onChange={switchChecked} />
      ) : (
        <InputNumber
          min={0}
          placeholder="请输入"
          value={value}
          onChange={onValueChange}
        />
      )}
    </div>
  );
};

export default SwitchNumber;
