import { Tooltip, TooltipProps } from "@arco-design/web-react";

export interface TooltipHocProps {
  tooltip?: false | string | TooltipProps;
}

function tooltipHoc<T>(BaseComponent: React.FC<T>) {
  return (props: T & TooltipHocProps) => {
    const { tooltip = false, ...componentProps } = props;

    if (typeof tooltip === "boolean") {
      return <BaseComponent {...(componentProps as T)} />;
    }

    if (typeof tooltip === "string") {
      return (
        <Tooltip content={tooltip}>
          <BaseComponent {...(componentProps as T)} />
        </Tooltip>
      );
    }

    return (
      <Tooltip {...tooltip}>
        <BaseComponent {...(componentProps as T)} />
      </Tooltip>
    );
  };
}

export default tooltipHoc;
