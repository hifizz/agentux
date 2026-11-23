"use client";

import { useEffect, useState } from "react";

export function useClosable(onClose: () => void, delay = 160) {
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setClosing(true);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!closing) return;
    const id = window.setTimeout(onClose, delay);
    return () => window.clearTimeout(id);
  }, [closing, onClose, delay]);

  return { closing, close: () => setClosing(true) };
}
