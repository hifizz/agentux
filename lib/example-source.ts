import type { Example } from "./components";
import { publicPath } from "./site";

export const manifestPath = (item: Example) => publicPath(`/r/${item.href.split("/").filter(Boolean).pop()}.json`);

export type SourceFile = { path: string; content: string };

export function displaySources({ files, meta }: { files: SourceFile[]; meta?: { displayFiles: string[] } }) {
  if (!meta?.displayFiles?.length) return files.slice(0, 1);
  return meta.displayFiles.map((path) => {
    const file = files.find((entry) => entry.path === path);
    if (!file) throw new Error(`Missing display source: ${path}`);
    return file;
  });
}
