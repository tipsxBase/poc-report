import { useParams } from "react-router";
import Markdown from "react-markdown";
import { resolveResource } from "@tauri-apps/api/path";
import { useEffect, useState } from "react";
import { readTextFile } from "@tauri-apps/api/fs";
import Scrollbars from "react-custom-scrollbars-2";
import { getCustomMDXComponent } from "./components";
import { useMemoizedFn } from "ahooks";
import "viewerjs/dist/viewer.css";
import Viewer from "viewerjs";
import "./index.less";
import { getMeta } from "mpa-routes";
import { H1 } from "./components/title";

const regex = /^---(?:\r?\n|\r)(?:([\s\S]*?)(?:\r?\n|\r))?---(?:\r?\n|\r|$)/;

const DocRender = () => {
  const params = useParams();
  const [md, setMd] = useState<string>("");
  const { pathKey } = params;
  const meta = getMeta(pathKey);
  useEffect(() => {
    resolveResource(pathKey.split("___").join("/")).then((res) => {
      readTextFile(res).then((md) => {
        setMd(md.replace(regex, ""));
      });
    });
  }, [pathKey]);

  const onClickBody = useMemoizedFn((e) => {
    if (document.documentElement.clientWidth <= 768) {
      return;
    }

    if (e.target && (e.target as any).tagName.toUpperCase() === "IMG") {
      const src = (e.target as any).src;
      const image = new window.Image();
      image.src = src;
      const viewer = new Viewer(image, {
        toolbar: {
          zoomIn: 4,
          zoomOut: 4,
          oneToOne: 4,
          reset: 4,
          prev: 0,
          play: 0,
          next: 0,
          rotateLeft: 4,
          rotateRight: 4,
          flipHorizontal: 4,
          flipVertical: 4,
        },
        navbar: false,
        title: false,
        fullscreen: false,
        hidden: function () {
          viewer.destroy();
        },
      });
      viewer.show();
    }
  });

  return (
    <Scrollbars>
      <div onClick={onClickBody} className="px-4 py-4 markdown-body">
        <H1>{meta.title}</H1>
        <Markdown
          // remarkPlugins={[remarkGfm]}
          components={getCustomMDXComponent()}
        >
          {md}
        </Markdown>
      </div>
    </Scrollbars>
  );
};

export default DocRender;
