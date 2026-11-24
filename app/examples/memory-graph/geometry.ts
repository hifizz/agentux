type Point = [number, number];
export type Rect = { left: number; top: number; width: number; height: number };
export type Seat = { box: Rect; wire: string; inbound: string; length: number; port: Point; edge: "left" | "right" | "top" | "bottom" };
export type Side = "memory" | "tool";
const round = Math.round;

function rounded(points: Point[], radius = 8) {
  let path = `M${points[0].join(" ")}`;
  let length = points.slice(1).reduce((sum,[x,y],i) => sum + Math.hypot(x-points[i][0],y-points[i][1]),0);
  for (let i = 1; i < points.length - 1; i++) {
    const [x, y] = points[i], [px, py] = points[i - 1], [nx, ny] = points[i + 1];
    const r = Math.min(radius, Math.hypot(x - px, y - py) / (i === 1 ? 1 : 2), Math.hypot(x - nx, y - ny) / (i === points.length - 2 ? 1 : 2));
    length -= (2 - (1 + Math.asinh(1) / Math.SQRT2)) * r;
    path += `L${x + Math.sign(px - x) * r} ${y + Math.sign(py - y) * r}Q${x} ${y} ${x + Math.sign(nx - x) * r} ${y + Math.sign(ny - y) * r}`;
  }
  return { wire: `${path}L${points.at(-1)!.join(" ")}`, length };
}

function connection(points: Point[], radius = 8) {
  return { ...rounded(points,radius), inbound: rounded([...points].reverse(),radius).wire };
}

export function flightPath(to: Seat, from?: Seat) {
  const length = to.length + (from ? from.length + Math.hypot(from.port[0]-to.port[0], from.port[1]-to.port[1]) : 0);
  return { wire: from ? from.inbound + "L" + to.wire.slice(1) : to.wire, length, duration: Math.min(2000,380 + 1.6*length) };
}

export function relationWire(a: Rect, b: Rect, lane = 0) {
  const y1 = a.top + a.height / 2, y2 = b.top + b.height / 2, x = Math.min(a.left, b.left) - 14 - lane * 5;
  return rounded([[a.left, y1], [x, y1], [x, y2], [b.left, y2]]).wire;
}

export function graphLayout(width: number, memoryCount: number, toolCount: number) {
  const narrow = width < 640;
  const agent: Rect = { left: narrow ? 0 : round((width - 224) / 2), top: narrow ? 0 : 246, width: narrow ? Math.min(width, 264) : 224, height: 100 };
  const toolStart = 168 + memoryCount * 82;
  function seat(side: Side, i: number, count: number): Seat {
    if (narrow) {
      const box = { left: 28, top: (side === "memory" ? 136 : toolStart) + i * 82, width: width - 28, height: 74 };
      const port: Point = [18, 100], y = box.top + 37;
      return { box, port, ...connection([port, [18, y], [28, y]], 5), edge: "left" };
    }
    const left = side === "memory", cardWidth = round(width * .3 - 20);
    const inset = i < 2 ? 6 : i < 4 ? width * .05 + 1 : width * .17 + 10;
    const box = { left: round(left ? inset : width - inset - cardWidth), top: [208, 310, 112, 406, 4, 514][i], width: cardWidth, height: 74 };
    const sideGap = agent.left - round(width * .05 + 1) - cardWidth;
    const sideSlots = Math.min(count, sideGap >= 18 ? 4 : 2);
    if (i < sideSlots) {
      const order = [2, 0, 1, 3].filter(n => n < sideSlots).indexOf(i);
      const port: Point = [agent.left + (left ? 0 : agent.width), sideSlots === 1 ? 296 : 264 + round(order * 64 / (sideSlots - 1))];
      const end: Point = [box.left + (left ? cardWidth : 0), box.top + 37], mid = round((end[0] + port[0]) / 2);
      return { box, port, ...connection([port, [mid, port[1]], [mid, end[1]], end]), edge: left ? "right" : "left" };
    }
    const above = box.top < agent.top, port: Point = [agent.left + (left ? 20 : agent.width - 20), above ? 246 : 346];
    const end: Point = [round(box.left + cardWidth / 2), box.top + (above ? 74 : 0)], turn = end[1] + (above ? 14 : -14);
    return { box, port, ...connection([port, [port[0], turn], [end[0], turn], end]), edge: above ? "bottom" : "top" };
  }
  const side = (name: Side, count: number) => Array.from({ length: count }, (_, i) => seat(name, i, count));
  return { agent, narrow, height: narrow ? toolStart + toolCount * 82 : 592, toolStart, memory: side("memory", memoryCount), tool: side("tool", toolCount) };
}
