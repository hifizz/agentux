"use client";

import { useMemo, useState } from "react";
import { PanelHostContext, RenderersContext, ToolOpenContext } from "../_pi-ui/renderers";
import { CODING_RENDERERS } from "../_pi-ui/tools";

const RENDERERS = { tools: CODING_RENDERERS };
const NOBODY: ReadonlySet<string> = new Set();

export function ToolHost({ waiting = NOBODY, children }: { waiting?: ReadonlySet<string>; children: React.ReactNode }) {
  const [open, setOpen] = useState<ReadonlySet<string>>(new Set());
  const state = useMemo(
    () => ({
      isOpen: (id: string) => open.has(id),
      toggle: (id: string) =>
        setOpen((prev) => {
          const next = new Set(prev);
          if (!next.delete(id)) next.add(id);
          return next;
        }),
    }),
    [open],
  );
  const host = useMemo(() => ({ agents: new Map(), openAgent: undefined, waiting }), [waiting]);
  return (
    <RenderersContext.Provider value={RENDERERS}>
      <ToolOpenContext.Provider value={state}>
        <PanelHostContext.Provider value={host}>{children}</PanelHostContext.Provider>
      </ToolOpenContext.Provider>
    </RenderersContext.Provider>
  );
}
