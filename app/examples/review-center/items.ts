import { modelMarks, toolMarks } from "../agent-tree/marks";

export type Brand = keyof typeof toolMarks;
export type Credit = readonly [string, Brand?];
type Flag = { text: string; note: string; source: string };
export type FileChange = {
  path: string;
  plus: number;
  minus: number;
  lines?: readonly (readonly [string, number | null, string])[];
};
export type Proposal =
  | { kind: "diff"; files: FileChange[] }
  | { kind: "plan"; steps: { title: string; tool: Credit }[] }
  | { kind: "text"; fields?: Record<string, string>; body?: string };
export type Item = {
  id: string;
  title: string;
  agent: string;
  model: keyof typeof modelMarks | "Haiku 5" | "Gemini 3.8 Pro";
  type: string;
  risk: "high" | "medium" | "low";
  confidence: number;
  minutes: number;
  why?: string;
  flags: Flag[];
  proposal: Proposal;
  sources: Credit[];
};

export const contract =
  "Each party's liability is limited to the fees paid in the 12 months before the claim. The cap does not apply to fraud, intentional misconduct or a breach of confidentiality.";
export const items: Item[] = [
  {
    id: "patch",
    title: "Merge #286: retry delayed deliveries",
    agent: "Coder",
    model: "GPT-6 Sol",
    type: "Code change",
    risk: "high",
    confidence: 41,
    minutes: 28,
    why: "The delivery queue backs up during imports. This change retries requests with a longer delay. Tests pass.",
    proposal: {
      kind: "diff",
      files: [
        {
          path: "src/delivery/dispatch.ts",
          plus: 3,
          minus: 2,
          lines: [
            ["", 38, "  const target = await findDeliveryTarget(job.accountId);"],
            ["−", 39, "  if (!target) return;"],
            ["+", 39, "  // active teams have a delivery target"],
            ["", 40, "  const data = JSON.stringify(job.message);"],
            ["−", 41, "  for (let n = 0; n < 3; n++) {"],
            ["+", 41, "  for (let n = 0; n < 9; n++) {"],
            ["", 42, "    const result = await send(target.url, data);"],
            ["+", 43, "    await delay(300 * 2 ** n);"],
          ],
        },
        { path: "src/delivery/dispatch.test.ts", plus: 12, minus: 0 },
        { path: "src/jobs/settings.ts", plus: 1, minus: 1 },
      ],
    },
    flags: [
      {
        text: "if (!target) return;",
        note: "Paused teams can still have pending deliveries. Without this guard, a job with no target would fail.",
        source: "Team audit · 186 paused",
      },
      {
        text: "n < 9;",
        note: "The last delay exceeds the worker's one-minute deadline. Check the maximum retry count.",
        source: "workers/settings.ts",
      },
    ],
    sources: [
      ["PR #286", "github"],
      ["CI run 871", "github"],
    ],
  },
  {
    id: "clause",
    title: "Redline §8.1 on liability limits",
    agent: "Legal agent",
    model: "Opus 5.5",
    type: "Contract clause",
    risk: "high",
    confidence: 58,
    minutes: 18,
    why: "Riverside asked to remove the cap. Our handbook limits liability to a year of fees, so I kept that limit and added the exceptions in their standard terms.",
    proposal: { kind: "text", body: contract },
    flags: [
      {
        text: "12 months",
        note: "Riverside's previous agreement uses two years of fees. Confirm the term before signing.",
        source: "Prior agreement · §8",
      },
      {
        text: "intentional misconduct",
        note: "This exception needs a second review under the latest policy.",
        source: "Legal handbook",
      },
    ],
    sources: [
      ["Riverside MSA v2", "notion"],
      ["Legal handbook", "notion"],
      ["Deal · $210k", "hubspot"],
    ],
  },
  {
    id: "invoice",
    title: "Pay INV-3106 for Harbor Freight",
    agent: "Finance agent",
    model: "Gemini 3.8 Pro",
    type: "Invoice",
    risk: "high",
    confidence: 55,
    minutes: 0,
    why: "The total matches the purchase order, but the bank account differs from the one used last month.",
    proposal: {
      kind: "text",
      fields: { Amount: "$10,650.00", Due: "Nov 18", IBAN: "DE71 •••• 5520" },
    },
    flags: [
      {
        text: "DE71 •••• 5520",
        note: "The account changed this week. Call the vendor to confirm the new details.",
        source: "Vendor billing update",
      },
    ],
    sources: [["INV-3106.pdf"], ["PO-204"], ["Vendor email"]],
  },
  {
    id: "migration",
    title: "Split members.name into two fields",
    agent: "Data agent",
    model: "Opus 5.5",
    type: "Migration",
    risk: "medium",
    confidence: 64,
    minutes: 14,
    why: "Receipts need a given name. The backfill covers 36,700 member records in one batch.",
    proposal: {
      kind: "diff",
      files: [
        {
          path: "migrations/0037_member_names.sql",
          plus: 5,
          minus: 0,
          lines: [
            ["", null, "@@ -0,0 +1,5 @@"],
            ["+", 1, "ALTER TABLE members ADD COLUMN given_name text;"],
            ["+", 2, "ALTER TABLE members ADD COLUMN family_name text;"],
            ["+", 3, "UPDATE members SET given_name = split_part(name, ' ', 1),"],
            ["+", 4, "  family_name = split_part(name, ' ', 2);"],
            ["+", 5, "ALTER TABLE members DROP COLUMN name;"],
          ],
        },
      ],
    },
    flags: [
      {
        text: "DROP COLUMN name",
        note: "Some names have more than two parts. Keep the original column until the backfill is checked.",
        source: "Migration audit · 243 rows",
      },
    ],
    sources: [["Ticket DB-73", "notion"]],
  },
  {
    id: "plan",
    title: "Rotate the Stripe service key",
    agent: "Ops agent",
    model: "Sonnet 5.5",
    type: "Plan",
    risk: "medium",
    confidence: 72,
    minutes: 11,
    why: "The billing key is over a year old. The security checklist calls for an annual rotation.",
    proposal: {
      kind: "plan",
      steps: [
        { title: "Generate a restricted key", tool: ["Stripe", "stripe"] },
        { title: "Save the key as BILLING_KEY_NEXT", tool: ["Vault"] },
        { title: "Roll out the key to billing workers", tool: ["GitHub Actions", "github"] },
        { title: "Disable the old key now", tool: ["Stripe", "stripe"] },
        { title: "Send an update to #ops", tool: ["Slack", "slack"] },
      ],
    },
    flags: [
      {
        text: "Disable the old key now",
        note: "Workers on the previous release still need this key until their jobs finish.",
        source: "Last deployment · 12 min",
      },
    ],
    sources: [["Security checklist", "notion"]],
  },
  {
    id: "refund",
    title: "Refund order #6194 for Alex Park",
    agent: "Support agent",
    model: "Sonnet 5.5",
    type: "Refund",
    risk: "medium",
    confidence: 62,
    minutes: 9,
    why: "The lamp was damaged in transit. The customer attached photos and is within the return period.",
    proposal: {
      kind: "text",
      fields: { Amount: "$128.00", Order: "#6194", Card: "Visa •••• 5532" },
      body: "Hi Alex, I'm sorry the lamp arrived damaged. I've refunded the full amount to your Visa. You don't need to return it.\nSam, Support",
    },
    flags: [
      {
        text: "$128.00",
        note: "The order includes shipping. Confirm whether to include it in the refund.",
        source: "Returns policy",
      },
    ],
    sources: [["Charge ch_8Fx…", "stripe"], ["Ticket #5802"]],
  },
  {
    id: "tickets",
    title: "Label 12 tickets as Billing",
    agent: "Ops agent",
    model: "Haiku 5",
    type: "Triage",
    risk: "low",
    confidence: 97,
    minutes: 6,
    why: "Each ticket asks about a payment, invoice or refund.",
    proposal: { kind: "text", fields: { Tickets: "12", Tag: "Billing" } },
    flags: [],
    sources: [],
  },
  {
    id: "deps",
    title: "Bump @stripe/stripe-js to 4.3.2",
    agent: "Coder",
    model: "GPT-6 Mini",
    type: "Code change",
    risk: "low",
    confidence: 95,
    minutes: 4,
    proposal: {
      kind: "diff",
      files: [
        {
          path: "package.json",
          plus: 1,
          minus: 1,
          lines: [
            ["", null, "@@ -21,4 +21,4 @@"],
            ["", 21, '  "dependencies": {'],
            ["−", 22, '    "@stripe/stripe-js": "4.3.1",'],
            ["+", 22, '    "@stripe/stripe-js": "4.3.2",'],
            ["", 23, '    "react": "19.2.0",'],
          ],
        },
      ],
    },
    flags: [],
    sources: [["PR #279", "github"]],
  },
  {
    id: "release",
    title: "Post release notes to #updates",
    agent: "Marketing agent",
    model: "GPT-6 Mini",
    type: "Slack message",
    risk: "low",
    confidence: 91,
    minutes: 2,
    proposal: {
      kind: "text",
      body: "Version 3.8 is out with custom receipts, batch exports and six fixes. Read the full list in the changelog.",
    },
    flags: [],
    sources: [["#updates", "slack"]],
  },
];

export const avatars = {
  ...modelMarks,
  "Haiku 5": modelMarks["Sonnet 5.5"],
  "Gemini 3.8 Pro": modelMarks["Gemini 3.8 Flash"],
};
