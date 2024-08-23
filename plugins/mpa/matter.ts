import { matter } from "vfile-matter";
import { VFile } from "vfile";

export function getMatterFromMDX(source: string) {
  const sourceAsVirtualFile = new VFile(source);
  matter(sourceAsVirtualFile, { strip: true });
  return sourceAsVirtualFile.data.matter;
}
