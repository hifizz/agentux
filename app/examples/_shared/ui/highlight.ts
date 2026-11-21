export type TokenKind = "comment" | "keyword" | "type" | "fn" | "string" | "literal" | "text";
export type Token = { kind: TokenKind; text: string };

const TOKEN = /\/\/.*|#.*|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|[A-Za-z_]\w*|./g;
const KEYWORDS = new Set(["import", "from", "const", "let", "new", "await", "async", "def", "return", "export", "as", "function", "if", "else", "type", "typeof", "default", "void", "try", "catch", "throw"]);
const LITERALS = new Set(["true", "false", "null", "undefined", "True", "False", "None"]);

function classify(text: string, next: string | undefined): TokenKind {
  if (text.startsWith("//") || text.startsWith("#")) return "comment";
  if (text.startsWith('"') || text.startsWith("'")) return "string";
  if (KEYWORDS.has(text)) return "keyword";
  if (LITERALS.has(text)) return "literal";
  if (/^[A-Z][a-z]/.test(text)) return "type";
  if (next === "(" && /^[A-Za-z_]/.test(text)) return "fn";
  return "text";
}

export function highlightLine(line: string): Token[] {
  const tokens: Token[] = [];
  for (const m of line.matchAll(TOKEN)) {
    const kind = classify(m[0], line[m.index + m[0].length]);
    const last = tokens.at(-1);
    if (last && last.kind === "text" && kind === "text") last.text += m[0];
    else tokens.push({ kind, text: m[0] });
  }
  return tokens;
}
