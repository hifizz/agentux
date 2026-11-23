const DELAYS = [0, 0.55, 0.2, 0.85, 0.35, 1, 0.1, 0.7, 0.45];

export function ThinkDots({ className }: { className?: string }) {
  return (
    <span aria-hidden className={className}>
      <span className="grid size-4 grid-cols-3 place-items-center p-0.5">
        {DELAYS.map((d, i) => (
          <span key={i} className="ch-anim-think-dot block size-0.5 rounded-full bg-ch-ink" style={{ animationDelay: `-${d * 1.2}s` }} />
        ))}
      </span>
    </span>
  );
}
