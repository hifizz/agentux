import type { ReactNode } from "react";
import ComposerPreview from "@/components/gallery/ComposerPreview";

export type ExampleProp = {
  name: string;
  type: string;
  description: string;
  required?: boolean;
};

export type ExamplePart = {
  name: string;
  file: string;
  description: string;
};

export type Example = {
  name: string;
  href: string;
  category: string;
  description: string;
  preview?: () => ReactNode;
  interaction?: string;
  parts?: ExamplePart[];
  props?: ExampleProp[];
  source?: string;
};

export const promptComposer = {
  name: "Prompt Composer",
  href: "/examples/prompt-composer/",
  category: "Composer · Chat",
  description: "One composer built from small parts: model, effort, permission, attachments, status strips and a workspace tray.",
  preview: ComposerPreview,
  interaction:
    "Type and press Enter to send, Shift + Enter for a new line. While the agent writes, a new message waits in the queue strip. Turn on Steer to send it into the current run. With an empty input the send button becomes Stop.",
  parts: [
    { name: "PromptComposer", file: "composer/prompt-composer.tsx", description: "Assembles the parts. Holds text, attachments, busy mode and errors, and builds one submission." },
    { name: "ComposerCard", file: "composer/parts/composer-card.tsx", description: "Card frame, auto-growing textarea and the Enter rule." },
    { name: "SendButton", file: "composer/parts/send-button.tsx", description: "Send, queue or steer. Turns into Stop when the run is busy and the input is empty." },
    { name: "AttachButton · AttachmentChips", file: "composer/parts/attach-button.tsx", description: "Picks files and lists them above the input." },
    { name: "PermissionPicker", file: "composer/parts/permission-picker.tsx", description: "Ask, Edit, Auto or Bypass for tool calls." },
    { name: "ModelPicker · ModelDetail", file: "composer/parts/model-picker.tsx", description: "Searchable model list with context, price bar and a detail footer." },
    { name: "EffortPicker", file: "composer/parts/effort-picker.tsx", description: "Effort levels the chosen model supports. Hidden when there is only one." },
    { name: "BusyToggle", file: "composer/parts/busy-toggle.tsx", description: "Switches a busy send between queue and steer." },
    { name: "StripHost", file: "composer/parts/strips/strip-host.tsx", description: "Shows the top strip by priority: queue, goal, changes, usage." },
    { name: "Tray", file: "composer/parts/tray.tsx", description: "Workspace and branch on the left, host and status on the right." },
    { name: "MenuPop", file: "composer/parts/menu-pop.tsx", description: "Shared shell for every menu that opens upward." },
  ],
  props: [
    { name: "placeholder", type: "string", description: "Hint shown in the empty input.", required: true },
    { name: "onSubmit", type: "(submission: Submission) => void | Promise<void>", description: "Called with text, attachments, model, permission and busy mode. A rejected promise keeps the input and shows the error.", required: true },
    { name: "value", type: "string", description: "Controlled text. Pair with onValueChange." },
    { name: "busy", type: "boolean", description: "The agent run is still going." },
    { name: "busyPolicy", type: '"block" | "queue" | "steerable"', description: "What Enter does while busy. Defaults to block." },
    { name: "onStop", type: "() => void", description: "Turns the send button into Stop when busy and empty." },
    { name: "model", type: "ModelControl", description: "Catalog, selection and change handler. Shows the model and effort pickers." },
    { name: "permission", type: "PermissionControl", description: "Current mode, change handler and allowed modes." },
    { name: "attach", type: "AttachControl", description: "Shows the attach button. Accepts an accept filter." },
    { name: "strips", type: "Strip[]", description: "Queue, goal, changes or usage strips above the card." },
    { name: "tray", type: "TrayControl", description: "Workspace and host chips below the card." },
    { name: "density", type: '"regular" | "compact"', description: "Compact fits side panels." },
  ],
  source: "Ported from the agent-builder prompt composer.",
} satisfies Example;

export const examples: Example[] = [promptComposer];
