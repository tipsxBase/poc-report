import { useRef, type MutableRefObject } from "react";
import copy from "copy-to-clipboard";
import { MdContentCopy } from "react-icons/md";

function copyCode(codeBlockElement: HTMLDivElement) {
  let text = "";
  const walk = document.createTreeWalker(
    codeBlockElement,
    NodeFilter.SHOW_TEXT,
    null
  );
  let node = walk.nextNode();
  while (node) {
    if (!node.parentElement.classList.contains("linenumber")) {
      text += node.nodeValue;
    }
    node = walk.nextNode();
  }

  copy(text);
}

export function CopyCodeButton({
  codeBlockRef,
}: {
  codeBlockRef: MutableRefObject<HTMLDivElement>;
}) {
  const copyButtonRef = useRef<HTMLButtonElement>(null);

  return (
    <button
      className=""
      onClick={() => copyCode(codeBlockRef.current)}
      ref={copyButtonRef}
      title="Copy code"
    >
      <MdContentCopy />
    </button>
  );
}
