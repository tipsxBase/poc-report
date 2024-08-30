import { isNullOrUndefined } from "@/shared/is";
import { Button, Input } from "@arco-design/web-react";
import { IconDelete } from "@arco-design/web-react/icon";
import { useMemoizedFn } from "ahooks";
import { useMemo } from "react";

export interface ServiceUrlProps {
  value?: string;
  onChange?: (v: string) => void;
}

/**
 *
 */
const ServiceUrl = (props: ServiceUrlProps) => {
  const { value, onChange } = props;

  const urls = useMemo(() => {
    if (isNullOrUndefined(value)) {
      return [];
    }
    return value.split(",");
  }, [value]);

  const doUpdateValue = (v: string, index) => {
    const nextUrls = [...urls];
    nextUrls[index] = v;
    onChange && onChange(nextUrls.join(","));
  };

  const onAdd = useMemoizedFn(() => {
    const nextUrls = [...urls];
    nextUrls.push("");
    onChange && onChange(nextUrls.join(","));
  });

  const doDelete = useMemoizedFn((index) => {
    const nextUrls = [...urls];
    nextUrls.splice(index, 1);
    onChange && onChange(nextUrls.join(","));
  });

  return (
    <div className="flex flex-col gap-5">
      {urls && urls.length > 0 && (
        <div className="flex flex-col gap-5">
          {urls.map((url, index) => (
            <div className="flex gap-2">
              <Input
                onChange={(v) => doUpdateValue(v, index)}
                value={url}
                placeholder="192.168.200.165:26700"
              />
              <div className="flex gap-2">
                <Button onClick={() => doDelete(index)} icon={<IconDelete />} />
              </div>
            </div>
          ))}
        </div>
      )}
      <Button size="small" type="primary" onClick={onAdd}>
        添加 CN 地址
      </Button>
    </div>
  );
};

export default ServiceUrl;
