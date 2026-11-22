export type GithubRepo = { fullName: string; description: string; private: boolean; defaultBranch: string };

export const GITHUB_REPOS: readonly GithubRepo[] = [
  { fullName: "acme/web", description: "The customer web app", private: true, defaultBranch: "main" },
  { fullName: "acme/billing-service", description: "Webhooks, invoices and usage metering", private: true, defaultBranch: "main" },
  { fullName: "acme/shared-types", description: "Types shared by every service", private: true, defaultBranch: "main" },
  { fullName: "acme/design-system", description: "Tokens and React components", private: true, defaultBranch: "main" },
  { fullName: "acme/infra", description: "Terraform and deploy scripts", private: true, defaultBranch: "main" },
  { fullName: "acme/docs", description: "Public documentation site", private: false, defaultBranch: "main" },
  { fullName: "acme/crawler", description: "Docs crawler prototype", private: false, defaultBranch: "master" },
];

const BRANCHES: Record<string, readonly string[]> = {
  "acme/web": ["main", "develop", "feat/onboarding-v2", "feat/prompt-composer", "fix/login-redirect", "release/2026-11"],
  "acme/billing-service": ["main", "feat/usage-alerts", "fix/proration"],
  "acme/design-system": ["main", "feat/neutral-tokens", "chore/storybook-9"],
  "acme/crawler": ["master", "feat/sitemaps"],
};

export function branchesOf(repo: string): readonly string[] {
  const hit = GITHUB_REPOS.find((r) => r.fullName === repo);
  return BRANCHES[repo] ?? (hit ? [hit.defaultBranch] : []);
}

export function repoOf(fullName: string): GithubRepo | undefined {
  return GITHUB_REPOS.find((r) => r.fullName === fullName);
}

export const shortName = (fullName: string) => fullName.split("/").pop() ?? fullName;
