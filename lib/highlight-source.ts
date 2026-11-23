import { codeToHtml, isSupportedLanguage } from "@pierre/highlights";
import dark from "@pierre/highlights/themes/pierre-dark";
import light from "@pierre/highlights/themes/pierre-light";

const decoder = new TextDecoder();

export function highlightSource(path: string, content: string) {
  const extension = path.match(/\.([^./]+)$/)?.[1];
  if (!extension || !isSupportedLanguage(extension)) return null;

  return decoder.decode(
    codeToHtml(content, {
      lang: extension,
      themes: { light, dark },
      defaultColor: "light-dark()",
    }),
  );
}
