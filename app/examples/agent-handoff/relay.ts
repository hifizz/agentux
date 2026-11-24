import { agents, history, queue, type Task } from "./tasks";

export type Lane = 0 | 1;
export type Run = { task: Task; start: number; first: number; stop?: number };
export type Packet = { key: string; task: Task; lane: Lane; pulse: number };
export const period = 62000;
export const schedule = (): Run[] => queue.map((task, index) => ({ task, start: 1400 + index * 13900, first: 0 }));
const work = 3050, travel = 1750, step = work + travel;

export function assign(runs: Run[], task: Task, first: number, now: number): Run[] {
  return [...runs.filter(run => run.task !== task || run.start <= now).map(run => run.task === task && run.stop === undefined ? { ...run, stop: now } : run), { task, first, start: now }];
}

export function snapshot(now: number, runs: Run[]) {
  const packets: [Packet[], Packet[]] = [[], []];
  const active: (Task | undefined)[] = [];
  const states = new Map<Task, string>();
  const costs = agents.map(agent => agent.base);
  for (const lane of [0, 1] as const) {
    history.forEach(task => packets[lane].push({ task, lane, key: `${lane}:${task.title}`, pulse: -Infinity }));
  }
  for (const run of runs.filter(run => run.start <= now).sort((a, b) => a.start - b.start)) {
    const elapsed = Math.min(now, run.stop ?? Infinity) - run.start;
    let label = "Handing on";
    for (let agent = run.first; agent < agents.length; agent++) {
      const age = elapsed - (agent - run.first) * step;
      if (age < 0) break;
      costs[agent] += Math.min(age / work, 1) * agents[agent].rate;
      if (age < work && run.stop === undefined) { active[agent] = run.task; label = `With ${agents[agent].name}`; }
      else if (agent === 2) label = queue.includes(run.task) ? "2 sources to check" : "Looks good";
      if ((agent === 0 || agent === 1) && age >= work) {
        const pulse = run.start + (agent - run.first) * step + work;
        if (age >= work + 850) packets[agent].push({ key: `${pulse}:${agent}:${run.task.title}`, task: run.task, lane: agent, pulse });
      }
    }
    states.set(run.task, label);
  }
  const waiting = queue.filter(task => !states.has(task)).toReversed();
  for (const lane of packets) lane.sort((a, b) => b.pulse - a.pulse);
  const lights = ([0, 1] as const).map(lane => Math.max(0, ...runs.filter(run => run.first <= lane).map(run => ({ start: run.start + (lane - run.first) * step + work, stop: run.stop ?? Infinity })).filter(pulse => pulse.start <= now && pulse.start < pulse.stop).map(pulse => pulse.start)));
  return { packets, active, costs, states, waiting, lights };
}
