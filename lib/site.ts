export const publicPath = (path: string) => `${process.env.NEXT_PUBLIC_BASE_PATH || ""}${path}`;

export const site = {
  name: "reni",
  title: "reni · UI for AI agents",
  description: "Explore the interactions behind an agent interface, from the first prompt to the next turn.",
  repository: "https://github.com/hifizz/agentux",
  logo: publicPath("/reni.svg"),
};
