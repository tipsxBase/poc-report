import { useRef, useState } from "react";

import { PrismSyntaxHighlighter } from "./PrismSytaxHighlighter";
import { CopyCodeButton } from "./CopyCodeButton";
import { MdWrapText } from "react-icons/md";

export interface CodeProps {
  children: string;
  className?: string;
}

export function Code(props: any) {
  const [codeWrap, setCodeWrap] = useState(false);
  const codeBlockRef = useRef<HTMLDivElement>();

  const { className } = props;
  const language = className?.replace(/language-/, "");

  if (!language) {
    return <code {...props}></code>;
  }

  const toggleCodeWrap = () => {
    setCodeWrap(!codeWrap);
  };

  return (
    <>
      {/* Use prism.js to highlight code by default */}
      <div className="xx" ref={codeBlockRef}>
        <PrismSyntaxHighlighter
          {...props}
          language={language}
          codeWrap={codeWrap}
        />
      </div>
      <div className="flex gap-2 absolute top-4 right-4 z-10">
        <button onClick={() => toggleCodeWrap()}>
          <MdWrapText />
        </button>
        <CopyCodeButton codeBlockRef={codeBlockRef} />
      </div>
    </>
  );
}
