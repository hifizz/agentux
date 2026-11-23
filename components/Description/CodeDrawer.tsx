"use client";

import { useEffect, useState } from "react";
import { motion, useDragControls } from "motion/react";
import type { Example } from "@/lib/components";
import { manifestPath } from "@/lib/example-source";
import CopyButton from "../CopyButton";

export function SourceFiles({ item }: { item: Example }) {
  const [files, setFiles] = useState<{ path: string; content: string }[]>([]);
  const [selected, setSelected] = useState(0);
  const [error, setError] = useState(false);
  const url = manifestPath(item);
  useEffect(() => {
    const controller = new AbortController();
    fetch(url, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("Source unavailable");
        const data = await response.json();
        if (!controller.signal.aborted) setFiles(data.files);
      })
      .catch(() => {
        if (!controller.signal.aborted) setError(true);
      });
    return () => controller.abort();
  }, [url]);
  const file = files[selected];
  if (!file)
    return (
      <p role="status" className="text-sm text-muted-foreground">
        {error ? "Source could not be loaded." : "Loading source…"}
      </p>
    );
  return (
    <>
      <div className="mb-2 flex items-center gap-2">
        <select
          aria-label="Source file"
          className="min-w-0 flex-1 rounded-lg bg-popover p-2 font-mono text-xs"
          value={selected}
          onChange={(e) => setSelected(Number(e.target.value))}
        >
          {files.map((f, i) => (
            <option key={f.path} value={i}>
              {f.path}
            </option>
          ))}
        </select>
        <CopyButton value={file.content} label="Copy source" />
      </div>
      <pre
        tabIndex={0}
        className="min-h-0 flex-1 overflow-auto rounded-xl bg-muted p-4 text-xs leading-6"
      >
        <code>{file.content}</code>
      </pre>
    </>
  );
}

type CodeDrawerProps = {
  open: boolean;
  onClose: () => void;
  item: Example;
};

export default function CodeDrawer({ open, onClose, item }: CodeDrawerProps) {
  const dragControls = useDragControls();
  return (
    <motion.div
      inert={!open}
      drag="y"
      dragListener={false}
      dragControls={dragControls}
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={{ top: 0, bottom: 0.4 }}
      onDragEnd={(_, info) => {
        if (info.offset.y > 120) onClose();
      }}
      initial={false}
      animate={{ y: open ? "0%" : "110%" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="absolute inset-x-0 bottom-0 z-10 flex h-full flex-col rounded-2xl  bg-card shadow-2xl shadow-black/30"
    >
      <div
        onPointerDown={(event) => dragControls.start(event)}
        className="shrink-0 cursor-grab touch-none px-4 pb-2 pt-16 active:cursor-grabbing"
      >
        <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-foreground/25" />
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{item.name}</span>
        </div>
      </div>

      <div className="mx-4 mb-4 flex min-h-0 flex-1 flex-col">
        {open && <SourceFiles item={item} />}
      </div>
    </motion.div>
  );
}
