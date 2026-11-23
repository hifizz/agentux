export type DiffLine = { kind: "ctx" | "add" | "del" | "hunk"; text: string; oldNo?: number; newNo?: number };
export type Patch = { lines: DiffLine[]; add: number; del: number };

export function parsePatch(patch: string): Patch {
  const lines: DiffLine[] = [];
  let oldNo = 1;
  let newNo = 1;
  let add = 0;
  let del = 0;
  for (const raw of patch.split("\n")) {
    const hunk = /^@@ -(\d+)(?:,\d+)? \+(\d+)(?:,\d+)? @@/.exec(raw);
    if (hunk) {
      oldNo = Number(hunk[1]);
      newNo = Number(hunk[2]);
      lines.push({ kind: "hunk", text: raw });
      continue;
    }
    const text = raw.slice(1);
    if (raw[0] === "+") {
      lines.push({ kind: "add", text, newNo: newNo++ });
      add += 1;
    } else if (raw[0] === "-") {
      lines.push({ kind: "del", text, oldNo: oldNo++ });
      del += 1;
    } else {
      lines.push({ kind: "ctx", text, oldNo: oldNo++, newNo: newNo++ });
    }
  }
  return { lines, add, del };
}
