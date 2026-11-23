"use client";

import { useEffect, useState } from "react";
import { motion, useDragControls } from "motion/react";
import { Files } from "lucide-react";
import type { Example } from "@/lib/components";
import { displaySources, manifestPath, type SourceFile } from "@/lib/example-source";
import CopyButton from "../CopyButton";

const codeAction = "size-7 rounded-md border border-foreground/10 bg-muted text-foreground/55 hover:bg-popover hover:text-foreground";

export function SourceFiles({ item }: { item: Example }) {
  const [files, setFiles] = useState<SourceFile[]>([]);
  const [selected, setSelected] = useState(0);
  const [error, setError] = useState(false);
  const [highlighted, setHighlighted] = useState<{
    file: SourceFile;
    html: string;
  }>();
  const url = manifestPath(item);
  useEffect(() => {
    const controller = new AbortController();
    fetch(url, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("Source unavailable");
        const data = await response.json();
        if (!controller.signal.aborted) setFiles(displaySources(data));
      })
      .catch(() => {
        if (!controller.signal.aborted) setError(true);
      });
    return () => controller.abort();
  }, [url]);
  const file = files[selected];
  useEffect(() => {
    if (!file) return;
    let active = true;
    import("@/lib/highlight-source")
      .then(({ highlightSource }) => {
        if (!active) return;
        const html = highlightSource(file.path, file.content);
        if (html) setHighlighted({ file, html });
      })
      .catch(() => {
        // the source stays readable if the wasm module cannot load or run
      });
    return () => {
      active = false;
    };
  }, [file]);

  if (!file)
    return (
      <p role="status" className="text-sm text-muted-foreground">
        {error ? "Source could not be loaded." : "Loading source…"}
      </p>
    );
  return (
    <div className="relative flex min-h-0 min-w-0 flex-1 rounded-xl bg-muted p-3">
      <div
        key={file.path}
        role="region"
        aria-label={`Source: ${file.path.split("/").pop()}`}
        tabIndex={0}
        className="min-w-0 flex-1 overflow-auto rounded-md font-mono text-[13px] leading-[23px] [scrollbar-width:thin] [&_pre]:bg-transparent!"
      >
        <div className="flex w-max min-w-full gap-4 px-2 py-0.5">
          <span aria-hidden="true" className="min-w-[2ch] shrink-0 select-none whitespace-pre text-right text-foreground/35">
            {Array.from({ length: file.content.replace(/\n$/, "").split("\n").length }, (_, i) => i + 1).join("\n")}
          </span>
          {highlighted?.file === file ? (
            <div dangerouslySetInnerHTML={{ __html: highlighted.html }} />
          ) : (
            <pre><code>{file.content}</code></pre>
          )}
        </div>
      </div>
      <div className="absolute right-5 top-5 flex gap-1">
        {files.length > 1 && (
          <label className={`${codeAction} relative grid place-items-center focus-within:outline-2`}>
            <Files aria-hidden="true" className="size-3.5" />
            <select
              aria-label="Source file"
              title={`Switch source file: ${file.path.split("/").pop()}`}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              value={selected}
              onChange={(event) => setSelected(Number(event.target.value))}
            >
              {files.map((f, i) => <option key={f.path} value={i}>{f.path.split("/").pop()}</option>)}
            </select>
          </label>
        )}
        <CopyButton key={file.path} value={file.content} label="Copy source" className={codeAction} />
      </div>
    </div>
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
      className="@container absolute inset-x-0 bottom-0 z-10 flex h-full flex-col rounded-2xl bg-card shadow-2xl shadow-black/30"
    >
      <div
        onPointerDown={(event) => dragControls.start(event)}
        className="shrink-0 cursor-grab touch-none px-4 pb-2 pt-3 active:cursor-grabbing"
      >
        <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-foreground/25" />
        <h2 className="pt-8 text-sm font-medium @min-[400px]:pt-0">{item.name}</h2>
      </div>

      <div className="mx-4 mb-4 flex min-h-0 flex-1 flex-col">
        {open && <SourceFiles item={item} />}
      </div>
    </motion.div>
  );
}
