import {
  readFileSync,
  readdirSync,
  mkdirSync,
  statSync,
  writeFileSync,
} from "node:fs";
import path from "node:path/posix";
import ts from "typescript";

const pkg = JSON.parse(readFileSync("package.json", "utf8"));
const lock = JSON.parse(readFileSync("package-lock.json", "utf8"));
const examples = "app/examples";
const tokens = `${examples}/_shared/tokens.css`;
const out = "public/r";
mkdirSync(out, { recursive: true });

function collect(slug) {
  const files = new Map();
  const dependencies = new Set();
  const devDependencies = new Set();
  function visit(file) {
    if (files.has(file)) return;
    if (!/^(app\/examples|components|lib)\//.test(file))
      throw new Error(`Unexpected source: ${file}`);
    let content = readFileSync(file, "utf8");
    const entry = {
      type: "registry:file",
      path: file,
      target: `@components/turnframe/${file}`,
      content,
    };
    files.set(file, entry);
    if (file.endsWith(".css")) return;
    for (const { fileName: spec, pos, end } of ts
      .preProcessFile(content, true, true)
      .importedFiles.reverse()) {
      const dir = path.dirname(file);
      if (spec.startsWith(".") || spec.startsWith("@/")) {
        const base = spec.startsWith("@/")
          ? spec.slice(2)
          : path.join(dir, spec);
        const match = ["", ".tsx", ".ts", "/index.tsx", "/index.ts"]
          .map((ext) => base + ext)
          .find((f) => statSync(f, { throwIfNoEntry: false })?.isFile());
        if (!match) throw new Error(`Missing ${spec} in ${file}`);
        visit(match);
        if (spec.startsWith("@/")) {
          const relative = path.relative(dir, base);
          content =
            content.slice(0, pos + 1) +
            (relative.startsWith(".") ? relative : `./${relative}`) +
            content.slice(end + 1);
        }
      } else {
        const name = spec
          .split("/")
          .slice(0, spec.startsWith("@") ? 2 : 1)
          .join("/");
        if (["next", "react", "react-dom"].includes(name)) continue;
        const version = lock.packages[`node_modules/${name}`]?.version;
        if (!version) throw new Error(`Unknown dependency ${name}`);
        (name in pkg.devDependencies ? devDependencies : dependencies).add(
          `${name}@${version}`,
        );
      }
    }
    entry.content = content;
  }
  visit(`${examples}/${slug}/demo.tsx`);
  visit(tokens);
  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: slug,
    type: "registry:block",
    dependencies: [...dependencies].sort(),
    devDependencies: [...devDependencies].sort(),
    files: [...files.values()],
    docs: `Import turnframe/${tokens} from your global Tailwind v4 stylesheet, then render the default export of turnframe/${examples}/${slug}/demo.tsx inside a container with a height. Both paths are under your configured components directory.`,
  };
}

for (const entry of readdirSync(examples, { withFileTypes: true })) {
  if (!entry.isDirectory() || entry.name.startsWith("_")) continue;
  const manifest = collect(entry.name);
  writeFileSync(`${out}/${entry.name}.json`, JSON.stringify(manifest));
}
