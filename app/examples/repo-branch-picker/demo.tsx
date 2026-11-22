"use client";

import Stage from "@/components/examples/Stage";
import { BranchSelect, RepoBranchPicker, RepoSelect } from "../prompt-composer/composer";
import { useRepo } from "../prompt-composer/fixtures";

const ROW = "@container flex items-center justify-between gap-3 rounded-ch-card border border-ch-line bg-ch-surface px-3 py-2.5 shadow-ch-bar";
const LABEL = "text-ch-caption text-ch-ink-subtle";

export default function Demo() {
  const repo = useRepo();
  const current = repo.repos.find((r) => r.fullName === repo.value.repo);
  return (
    <Stage align="center" status={`${repo.value.repo}@${repo.value.branch}${repo.created.length ? ` · created ${repo.created.join(", ")}` : ""}`}>
      <div className={ROW}>
        <span className={LABEL}>Repo and branch</span>
        <RepoBranchPicker {...repo} />
      </div>
      <div className={ROW}>
        <span className={LABEL}>Repository</span>
        <RepoSelect repos={repo.repos} value={repo.value.repo} onChange={(r) => repo.onChange({ repo: r.fullName, branch: r.defaultBranch })} />
      </div>
      <div className={ROW}>
        <span className={LABEL}>Branch</span>
        <BranchSelect
          branches={repo.branchesOf(repo.value.repo)}
          defaultBranch={current?.defaultBranch}
          value={repo.value.branch}
          onChange={(branch) => repo.onChange({ ...repo.value, branch })}
          onCreate={(branch) => repo.onCreateBranch?.(repo.value.repo, branch)}
        />
      </div>
    </Stage>
  );
}
