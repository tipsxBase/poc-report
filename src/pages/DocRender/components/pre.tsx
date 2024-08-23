import type { CodeProps } from "./code";

const DEFAULT_LANGUAGE_CLASS = "language-bash";

export function Pre({ children }: any) {
  const renderChildren = (children: React.ReactElement) => {
    const { className } = children.props as CodeProps;
    return (
      <div className={className || DEFAULT_LANGUAGE_CLASS}>
        <div className="relative doc-code-content">{children}</div>
      </div>
    );
  };

  if (Array.isArray(children)) {
    return <div>{children.map((child) => renderChildren(child))}</div>;
  }
  return renderChildren(children);
}
