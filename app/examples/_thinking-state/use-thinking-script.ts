"use client";

import { useCallback, useState } from "react";

export function useThinkingScript() {
  const [run, setRun] = useState(0);
  const replay = useCallback(() => setRun((value) => value + 1), []);
  return { run, replay };
}
