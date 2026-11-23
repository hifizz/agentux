import type { Example } from "./components";

export const manifestPath = (item: Example) => `/r/${item.href.split("/").filter(Boolean).pop()}.json`;
