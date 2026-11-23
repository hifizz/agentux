const HUES = ["#3b82f6", "#13b3a0", "#f28a2e", "#e8478b", "#84a617", "#6366f1"];

const hash = (text: string) => {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 16777619);
  return h >>> 0;
};

export function avatarOf(name: string): { pattern: string; hue: string } {
  const h = hash(name.trim().toLowerCase());
  const side = Array.from({ length: 6 }, (_, i) => (h >> i) & 1);
  if (side.reduce<number>((n, bit) => n + bit, 0) < 3) side[1] = side[3] = side[5] = 1;
  const [a, b, c, d, e, f] = side;
  const pattern = [a, b, a, c, d, c, e, f, e].join("");
  return { pattern, hue: HUES[(h >>> 8) % HUES.length] };
}
