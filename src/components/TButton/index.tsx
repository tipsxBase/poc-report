import {
  Button,
  ButtonProps,
  Tooltip,
  TooltipProps,
} from "@arco-design/web-react";

export interface TButtonProps extends ButtonProps {
  tooltip?: false | string | TooltipProps;
}

const buttonHoc = (BaseComponent: React.FC) => {
  return (props: TButtonProps) => {
    const { tooltip = false, ...buttonProps } = props;

    if (typeof tooltip === "boolean") {
      return <BaseComponent {...buttonProps} />;
    }

    if (typeof tooltip === "string") {
      return (
        <Tooltip content={tooltip}>
          <BaseComponent {...buttonProps} />
        </Tooltip>
      );
    }

    return (
      <Tooltip {...tooltip}>
        <BaseComponent {...buttonProps} />
      </Tooltip>
    );
  };
};

const TButton = buttonHoc(Button);
export default TButton;
