export function FilePath({ path }: { path: string }) {
  const slash = path.lastIndexOf("/") + 1;
  return (
    <span className="ch-mono">
      <span className="text-ch-ink-subtle">{path.slice(0, slash)}</span>
      <span className="text-ch-ink">{path.slice(slash)}</span>
    </span>
  );
}
