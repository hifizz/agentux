export const PERMISSION_MODE_IDS = ["ask", "edit", "auto", "bypass"] as const;
export type PermissionMode = (typeof PERMISSION_MODE_IDS)[number];

export const isPermissionMode = (value: unknown): value is PermissionMode => PERMISSION_MODE_IDS.some((m) => m === value);
