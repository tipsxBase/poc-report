import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";

import type { CodeProps } from ".";
import prisimThemeStyle from "../prisim-theme";

export function PrismSyntaxHighlighter(
  props: CodeProps & { language: string; codeWrap: boolean }
) {
  const { language, codeWrap } = props;

  return (
    <SyntaxHighlighter
      language={language}
      style={prisimThemeStyle}
      wrapLines={true}
      className="code"
      wrapLongLines={codeWrap}
      customStyle={{ backgroundColor: "inherit" }}
      // Notice: if the highlight line is specified, the line number must be displayed
      showLineNumbers={true}
      lineProps={() => {
        return {
          style: {
            display: "block",
            padding: "0 1.25rem",
          },
        };
      }}
    >
      {String(props.children).trim()}
    </SyntaxHighlighter>
  );
}
