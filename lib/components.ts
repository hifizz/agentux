import type { ReactNode } from "react";
import { ActivityPreview, ApprovalsPreview, AskPreview, MessagePreview, ReasoningPreview, SuggestionsPreview, ThinkingPreview, ToolStepsPreview } from "@/components/gallery/ChatPreviews";
import { ContextWindowPreview } from "@/components/gallery/ContextWindowPreview";
import ComposerPreview from "@/components/gallery/ComposerPreview";
import { ActionsPreview, AgentMessagePreview, MarkdownPreview, PlanPreview, SearchPreview, ShadowScrollPreview, ShimmerTextPreview, StreamingPreview, SwarmPreview, ThinkingBlockPreview, ToolOutputPreview, WorkLogPreview } from "@/components/gallery/MessagePreviews";
import { BottomTrayPreview, ContextPreview, DirectoryPreview, EffortPreview, ModelPreview, PermissionPreview, PromptInputPreview, QueueSteerPreview, RepoPreview, StatesPreview, TopTrayPreview } from "@/components/gallery/ComposerPartPreviews";

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
  description: "One composer built from small parts: input, model, effort, permission, context, top tray and bottom tray.",
  preview: ComposerPreview,
  interaction:
    "Type and press Enter to send, Shift + Enter for a new line. While the agent writes, a new message waits in the queue strip. Turn on Steer to send it into the current run. With an empty input the send button becomes Stop.",
  parts: [
    { name: "PromptComposer", file: "composer/prompt-composer.tsx", description: "Assembles the parts. Holds text, attachments, busy mode and errors, and builds one submission." },
    { name: "PromptInput", file: "composer/parts/prompt-input.tsx", description: "Card frame, auto-growing textarea, the Enter rule and header, start and end slots." },
    { name: "SendButton", file: "composer/parts/send-button.tsx", description: "Send, queue or steer. Turns into Stop when the run is busy and the input is empty." },
    { name: "AttachButton · AttachmentChips", file: "composer/parts/attach-button.tsx", description: "Picks files and lists them above the input." },
    { name: "PermissionPicker", file: "composer/parts/permission-picker.tsx", description: "Ask, Edit, Auto or Bypass for tool calls." },
    { name: "ModelPicker · ModelDetail", file: "composer/parts/model-picker.tsx", description: "Searchable model list with context, price bar and a detail footer." },
    { name: "EffortPicker", file: "composer/parts/effort-picker.tsx", description: "Effort levels the chosen model supports. Hidden when there is only one." },
    { name: "BusyToggle", file: "composer/parts/busy-toggle.tsx", description: "Switches a busy send between queue and steer." },
    { name: "ContextUsage", file: "composer/parts/context-usage.tsx", description: "Token ring that opens the context breakdown on hover." },
    { name: "TopTray", file: "composer/parts/strips/top-tray.tsx", description: "Shows the top strip by priority: queue, goal, changes, usage." },
    { name: "BottomTray", file: "composer/parts/bottom-tray.tsx", description: "Directory, repo and branch on the left, host and status on the right." },
    { name: "Base UI primitives", file: "components/ui/base/", description: "Popover, Menu, Combobox and Tooltip adapted from shadcn Base UI sources." },
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
    { name: "context", type: "ContextControl", description: "Window size and token segments. Shows the token ring and breakdown." },
    { name: "tray", type: "TrayControl", description: "Directory, repo, branch and host pickers below the card." },
    { name: "density", type: '"regular" | "compact"', description: "Compact fits side panels." },
  ],
  source: "Ported from the agent-builder prompt composer.",
} satisfies Example;

const COMPOSER = "Ported from the agent-builder prompt composer, popups rebuilt on Base UI.";
const PI = "Ported from the agent-builder Pi chat components.";
const CONVERSATION = "Ported from the agent-builder conversation module.";
const MESSAGE = "Generalized from the agent-builder message renderer. No Pi types, plain props in and out.";

export const chatMessage = {
  name: "Message",
  href: "/examples/chat-message/",
  category: "Chat · Message",
  description: "A user bubble and an assistant reply that renders reasoning, tool calls and Markdown in the order the model wrote them.",
  preview: MessagePreview,
  interaction:
    "Replay streams one turn. The answer fades in as Markdown with a copy button on code. When the turn ends a footer shows copy, feedback, model, tokens and time. Stop ends the turn early and shows a notice.",
  parts: [
    { name: "UserMessage", file: "_pi-ui/messages/user-message.tsx", description: "Right-aligned bubble for text and image attachments. Long text is clamped." },
    { name: "AssistantMessage", file: "_pi-ui/messages/assistant-message.tsx", description: "Walks the content blocks in order and groups neighbouring tool calls into one list." },
    { name: "TextBlock", file: "_pi-ui/blocks/text-block.tsx", description: "Streaming Markdown. Raw HTML and remote images are dropped." },
    { name: "ThinkingBlock", file: "_pi-ui/blocks/thinking-block.tsx", description: "The reasoning row, see the Reasoning example." },
    { name: "ToolStepList", file: "_pi-ui/blocks/tool-steps.tsx", description: "The tool rows, see the Tool Steps example." },
    { name: "MessageActions", file: "_pi-ui/messages/message-actions.tsx", description: "Copy, good response and bad response." },
    { name: "ai-message-bubble.css", file: "_pi-ui/ai-message-bubble.css", description: "Every color, size and gap of a reply as tokens on one class." },
  ],
  props: [
    { name: "message", type: "AssistantMessage", description: "Content blocks, stop reason, model, usage and duration.", required: true },
    { name: "index", type: "TranscriptIndex", description: "Tool results and live slots keyed by tool call id.", required: true },
    { name: "streaming", type: "boolean", description: "True for the partial message that is still being written.", required: true },
  ],
  source: PI,
} satisfies Example;

export const reasoning = {
  name: "Reasoning",
  href: "/examples/reasoning/",
  category: "Chat · Message",
  description: "A reasoning row that stays open while the model thinks, then reports the time and folds away.",
  preview: ReasoningPreview,
  interaction: "While streaming the row shimmers and the text is open. When it ends the row reads Thought for N seconds and closes after one second. Click the row to open or close it.",
  parts: [
    { name: "ThinkingBlock", file: "_pi-ui/blocks/thinking-block.tsx", description: "Row, timer, auto close and the redacted fallback." },
    { name: "BubbleCollapse", file: "_pi-ui/blocks/bubble-collapse.tsx", description: "Height animation shared with tool rows. Instant with reduced motion." },
    { name: "PiMarkdown", file: "_pi-ui/markdown.tsx", description: "Renders the reasoning text with the quieter thinking tokens." },
  ],
  props: [
    { name: "block", type: "ThinkingContent", description: "The thinking text. redacted shows a one-line notice instead.", required: true },
    { name: "streaming", type: "boolean", description: "True while this block is the one being written.", required: true },
  ],
  source: PI,
} satisfies Example;

export const toolSteps = {
  name: "Tool Steps",
  href: "/examples/tool-steps/",
  category: "Chat · Tools",
  description: "One row per tool call: category icon, verb, target and status, with details that open in place.",
  preview: ToolStepsPreview,
  interaction:
    "Rows appear as the agent calls tools. A running row shimmers and its verb changes tense when it ends. Click a row for arguments, output, diagnostics and the raw JSON. A row that needs you reads Waiting for you.",
  parts: [
    { name: "ToolStepList", file: "_pi-ui/blocks/tool-steps.tsx", description: "The list, the row shell, status rules and the generic detail view." },
    { name: "Tool renderers", file: "_pi-ui/tools/index.ts", description: "read, write, edit, bash, code mode, MCP, agent and ask. Each returns a category, verbs, a summary and a body." },
    { name: "CodeLines · FilePath", file: "_pi-ui/tools/code-lines.tsx", description: "Numbered code with light highlighting, and a path with the folder dimmed." },
    { name: "DiffView · DiffStat", file: "_shared/ui/diff-view.tsx", description: "Patch lines and the added and removed counts." },
    { name: "RawToggle", file: "_pi-ui/raw-inspector.tsx", description: "Shows and copies the untouched arguments, slot and result." },
    { name: "Contexts", file: "_pi-ui/renderers.ts", description: "Renderers, which rows are open, and which calls wait for the user." },
  ],
  props: [
    { name: "tools", type: "ToolView[]", description: "Call id, name, arguments, live slot and result of each call.", required: true },
    { name: "streaming", type: "boolean", description: "Fades new rows in while the message is being written.", required: true },
    { name: "RenderersContext", type: "{ tools?: ToolRenderer[] }", description: "First renderer that returns a presentation wins. Unknown tools use the generic row." },
    { name: "ToolOpenContext", type: "{ isOpen, toggle }", description: "Open state by call id, kept outside so it survives a remount." },
  ],
  source: PI,
} satisfies Example;

export const approvals = {
  name: "Approvals",
  href: "/examples/approvals/",
  category: "Chat · Human in the loop",
  description: "Cards above the composer for tool calls that need permission and for questions the model asks.",
  preview: ApprovalsPreview,
  interaction:
    "Allow, Deny or Always allow a tool. Each card previews what will run: the command, the new file or the diff. A question shows its options as buttons, or a text field when there are none. Buttons lock while the reply is sent.",
  parts: [
    { name: "InteractionStack", file: "_pi-ui/interactions.tsx", description: "Lists pending requests and tags the ones raised by a sub agent." },
    { name: "ApprovalCard", file: "_pi-ui/interactions.tsx", description: "Preview plus Allow, Deny and Always allow." },
    { name: "ApprovalPreview", file: "_pi-ui/interactions.tsx", description: "Command for bash, content for write, diff for edit, JSON for anything else." },
    { name: "QuestionCard", file: "_pi-ui/interactions.tsx", description: "Option buttons or a free text answer. Enter sends." },
  ],
  props: [
    { name: "interactions", type: "PiInteraction[]", description: "Pending approval and question requests.", required: true },
    { name: "respond", type: "(id: string, answer: PiAnswer) => Promise<void>", description: "Sends the reply. A rejected promise shows the error on the card.", required: true },
    { name: "whoOf", type: "(conversationId: number) => string | undefined", description: "Name of the sub agent that asked, if any.", required: true },
  ],
  source: PI,
} satisfies Example;

export const askQuestion = {
  name: "Ask Question",
  href: "/examples/ask-question/",
  category: "Chat · Human in the loop",
  description: "A card that asks several multiple-choice questions one at a time and folds into a summary.",
  preview: AskPreview,
  interaction:
    "Pick an option or type your own in the last row, then Continue. The arrows move between questions and the counter rolls. After the last answer the card becomes a short summary. Skip leaves every question unanswered.",
  parts: [
    { name: "AskBeat", file: "_conversation/beats/ask-beat.tsx", description: "Holds the current question and the choices, and swaps the card for the summary." },
    { name: "AskQuestion", file: "_conversation/beats/ask-question.tsx", description: "Option rows and the free text row for one question." },
    { name: "ChoiceBadge", file: "_conversation/beats/choice-badge.tsx", description: "The letter badge in front of each option." },
    { name: "AskAnswered", file: "_conversation/beats/ask-answered.tsx", description: "The folded summary of what was chosen." },
    { name: "Roll · AutoHeight", file: "_shared/ui/roll.tsx", description: "Rolling text for the question and counter, and a height that follows the content." },
  ],
  props: [
    { name: "questions", type: "Question[]", description: "Each has an id, the question and its options. other: false removes the free text row.", required: true },
    { name: "answer", type: "AskAnswer | undefined", description: "Undefined shows the card, a value shows the summary.", required: true },
    { name: "locked", type: "boolean", description: "Disables every control.", required: true },
    { name: "onAnswer", type: "(answer: AskAnswer) => void", description: "Called with the choices, or with skipped.", required: true },
  ],
  source: CONVERSATION,
} satisfies Example;

export const activityCards = {
  name: "Activity Cards",
  href: "/examples/activity-cards/",
  category: "Chat · Tools",
  description: "Cards for what a coding agent did: tools read, files edited, a command run and a pull request opened.",
  preview: ActivityPreview,
  interaction: "Steps tick off one by one. Click a file, the terminal card or the pull request to ask the host page to open the matching panel. This demo prints the target in the toolbar.",
  parts: [
    { name: "StepsBeat", file: "_conversation/beats/steps-beat.tsx", description: "Read tools group with a spinner that settles into a tick." },
    { name: "EditsBeat", file: "_conversation/beats/edits-beat.tsx", description: "Edited files with added and removed line counts." },
    { name: "RunBeat", file: "_conversation/beats/run-beat.tsx", description: "Command, running state, result tag and the last lines of output." },
    { name: "PrBeat", file: "_conversation/beats/pr-beat.tsx", description: "Title, number, branch direction and draft, open or merged." },
    { name: "BeatHost", file: "_conversation/engine/beat-host.tsx", description: "Context the cards use to ask the page to open a panel." },
    { name: "StepSpinner · Tag · DiffStat", file: "_shared/ui/step-spinner.tsx", description: "Shared primitives the cards are built from." },
  ],
  props: [
    { name: "StepsBeat", type: "{ steps: Step[]; doneSteps: number }", description: "Steps and how many of them have finished." },
    { name: "EditsBeat", type: "{ files: EditedFile[]; doneSteps: number }", description: "Path, added and removed lines per file." },
    { name: "RunBeat", type: "{ beat: RunBeat; done: boolean }", description: "Command, output lines, result label and ok." },
    { name: "PrBeat", type: "{ beat: PrBeat }", description: "Number, title, branch and state." },
    { name: "BeatHostProvider", type: "{ onShow, open }", description: "open receives the panel target when a card is clicked." },
  ],
  source: CONVERSATION,
} satisfies Example;

export const thinkingIndicator = {
  name: "Thinking Indicator",
  href: "/examples/thinking-indicator/",
  category: "Chat · Status",
  description: "The line shown before the first token: animated dots, elapsed time and a rolling token count.",
  preview: ThinkingPreview,
  interaction: "Time updates every second and the token count rolls to its new value. The tally lives in a ref above the indicator, so it keeps counting when the indicator remounts. The step spinner settles into a tick when its step ends.",
  parts: [
    { name: "Thinking", file: "_conversation/thinking.tsx", description: "The status line. Announced politely to screen readers." },
    { name: "TallyProvider", file: "_conversation/engine/tally.tsx", description: "Shares elapsed seconds and tokens for one reply." },
    { name: "ThinkDots", file: "_shared/ui/think-dots.tsx", description: "The animated mark." },
    { name: "RollText", file: "_shared/ui/roll.tsx", description: "Rolls only the characters that changed." },
    { name: "StepSpinner", file: "_shared/ui/step-spinner.tsx", description: "Spinner that draws a tick when done." },
  ],
  props: [
    { name: "TallyProvider value", type: "RefObject<Tally>", description: "Seconds and tokens so far. Create it with useTallyRef.", required: true },
    { name: "StepSpinner done", type: "boolean", description: "Plays the tick once when it turns true.", required: true },
  ],
  source: CONVERSATION,
} satisfies Example;

export const suggestions = {
  name: "Suggestions",
  href: "/examples/suggestions/",
  category: "Chat · Empty state",
  description: "Opening prompts for an empty chat, with the tools each one will use shown inline.",
  preview: SuggestionsPreview,
  interaction: "Hover a tool mark to lift it and read its name. Click a row to send its full prompt as the first message.",
  parts: [
    { name: "SuggestionRow", file: "_conversation/suggestion.tsx", description: "Icon, text parts and tool marks in one button." },
    { name: "AppMark · AppMarkTip", file: "_shared/ui/app-mark.tsx", description: "Small tile for an integration logo, with a tooltip." },
    { name: "Tooltip", file: "_shared/ui/tooltip.tsx", description: "Portalled label that follows its anchor." },
  ],
  props: [
    { name: "suggestion", type: "Suggestion", description: "Icon, parts to show, the prompt to send and the scripted reply.", required: true },
    { name: "onPress", type: "() => void", description: "Called when the row is clicked.", required: true },
  ],
  source: CONVERSATION,
} satisfies Example;

export const promptInput = {
  name: "Prompt Input",
  href: "/examples/prompt-input/",
  category: "Composer · Input",
  description: "The composer card on its own: an auto-growing textarea with header, start and end slots.",
  preview: PromptInputPreview,
  interaction: "Type and press Enter to send, Shift + Enter for a new line. Use the toggles to see compact, invalid and disabled.",
  parts: [
    { name: "PromptInput", file: "composer/parts/prompt-input.tsx", description: "Frame, textarea, Enter rule and three slots." },
    { name: "AttachButton · AttachmentChips", file: "composer/parts/attach-button.tsx", description: "Fill the start and header slots." },
    { name: "SendButton", file: "composer/parts/send-button.tsx", description: "Fills the end slot." },
  ],
  props: [
    { name: "value", type: "string", description: "Current text.", required: true },
    { name: "onChange", type: "(value: string) => void", description: "Called on every keystroke.", required: true },
    { name: "placeholder", type: "string", description: "Hint in the empty input.", required: true },
    { name: "onEnter", type: "() => void", description: "Enter without Shift and outside IME composition." },
    { name: "header", type: "ReactNode", description: "Slot above the textarea." },
    { name: "start", type: "ReactNode", description: "Left side of the toolbar." },
    { name: "end", type: "ReactNode", description: "Right side of the toolbar." },
    { name: "invalid", type: "boolean", description: "Red border and aria-invalid." },
    { name: "disabled", type: "boolean", description: "Dims the card and blocks typing." },
    { name: "density", type: '"regular" | "compact"', description: "Compact fits side panels." },
  ],
  source: COMPOSER,
} satisfies Example;

export const permissionPicker = {
  name: "Permission Picker",
  href: "/examples/permission-picker/",
  category: "Composer · Settings",
  description: "How much the agent may do without asking, from Ask to Bypass.",
  preview: PermissionPreview,
  interaction: "Click the shield to open a Base UI menu. Arrow keys move, Enter picks. Bypass is shown in red.",
  parts: [
    { name: "PermissionPicker", file: "composer/parts/permission-picker.tsx", description: "Trigger chip and a radio menu." },
    { name: "Menu", file: "components/ui/base/menu.tsx", description: "Base UI Menu with radio items." },
  ],
  props: [
    { name: "value", type: "PermissionMode", description: "Current mode.", required: true },
    { name: "onChange", type: "(next: PermissionMode) => void", description: "Called when a mode is picked.", required: true },
    { name: "modes", type: "PermissionMode[]", description: "Modes to offer. Defaults to all four." },
    { name: "disabled", type: "boolean", description: "Blocks the trigger." },
  ],
  source: COMPOSER,
} satisfies Example;

export const modelPicker = {
  name: "Model Picker",
  href: "/examples/model-picker/",
  category: "Composer · Settings",
  description: "A searchable model list with price bars and a detail footer for the highlighted model.",
  preview: ModelPreview,
  interaction: "Click the model to open a Base UI combobox. Type to filter. Arrow keys move the highlight and the footer follows it. With one model it shows a static label.",
  parts: [
    { name: "ModelPicker", file: "composer/parts/model-picker.tsx", description: "Trigger, search, list and footer." },
    { name: "ModelDetail · CostBar", file: "composer/parts/model-detail.tsx", description: "Context, output and price of one model." },
    { name: "Combobox", file: "components/ui/base/combobox.tsx", description: "Base UI Combobox with the search inside the popup." },
  ],
  props: [
    { name: "catalog", type: "ModelCard[]", description: "Models to offer.", required: true },
    { name: "value", type: "ModelSelection", description: "Selected model key and effort.", required: true },
    { name: "onChange", type: "(next: ModelSelection) => void", description: "Keeps the effort when the new model supports it.", required: true },
    { name: "disabled", type: "boolean", description: "Blocks the trigger." },
  ],
  source: COMPOSER,
} satisfies Example;

export const effortPicker = {
  name: "Effort Picker",
  href: "/examples/effort-picker/",
  category: "Composer · Settings",
  description: "Reasoning effort for the selected model, drawn as a small meter.",
  preview: EffortPreview,
  interaction: "Click the meter to pick a level. Levels come from the model. A model with no levels hides the picker.",
  parts: [
    { name: "EffortPicker", file: "composer/parts/effort-picker.tsx", description: "Trigger and radio menu." },
    { name: "EffortMeter", file: "composer/parts/effort-picker.tsx", description: "Bars filled up to the level." },
  ],
  props: [
    { name: "model", type: "ModelCard", description: "Supplies the levels.", required: true },
    { name: "value", type: "EffortLevel", description: "Current level.", required: true },
    { name: "onChange", type: "(next: EffortLevel) => void", description: "Called when a level is picked.", required: true },
    { name: "disabled", type: "boolean", description: "Blocks the trigger." },
  ],
  source: COMPOSER,
} satisfies Example;

export const contextUsage = {
  name: "Context Usage",
  href: "/examples/context-usage/",
  category: "Composer · Context",
  description: "A token ring for the toolbar and the breakdown of what fills the context window.",
  preview: ContextPreview,
  interaction: "Hover or focus the ring to open the breakdown in a Base UI popover. Add turns or files to fill it. The ring turns amber at 80% and red at 95%.",
  parts: [
    { name: "TokenCount", file: "composer/parts/context-usage.tsx", description: "Ring and used / window label." },
    { name: "ContextBreakdown", file: "composer/parts/context-usage.tsx", description: "Stacked bar, one row per segment, reserved and free space." },
    { name: "ContextUsage", file: "composer/parts/context-usage.tsx", description: "The ring as a hover trigger for the breakdown." },
  ],
  props: [
    { name: "window", type: "number", description: "Context window in tokens.", required: true },
    { name: "segments", type: "ContextSegment[]", description: "Id, label and tokens for each part.", required: true },
    { name: "reserved", type: "number", description: "Tokens kept free for output." },
  ],
  source: COMPOSER,
} satisfies Example;

export const topTray = {
  name: "Top Tray",
  href: "/examples/top-tray/",
  category: "Composer · Tray",
  description: "Strips that sit above the input: usage, queued messages, the current goal and changed files.",
  preview: TopTrayPreview,
  interaction: "Pick a strip above. Only one shows at a time, by priority queue, goal, changes, usage. It slides in and out and respects reduced motion.",
  parts: [
    { name: "TopTray", file: "composer/parts/strips/top-tray.tsx", description: "Animated host for one strip." },
    { name: "QueueStrip · GoalStrip · ChangesStrip · UsageStrip", file: "composer/parts/strips/", description: "One view per strip kind." },
  ],
  props: [
    { name: "strip", type: "Strip", description: "Strip to show, or undefined to fold away." },
    { name: "collapsed", type: "boolean", description: "Fold to a thin peek.", required: true },
    { name: "onDismissUsage", type: "() => void", description: "Called when the usage strip is dismissed.", required: true },
  ],
  source: COMPOSER,
} satisfies Example;

export const bottomTray = {
  name: "Bottom Tray",
  href: "/examples/bottom-tray/",
  category: "Composer · Tray",
  description: "The tray under the input with directory, repo, branch and the host the agent runs on.",
  preview: BottomTrayPreview,
  interaction: "Each chip opens a Base UI popup. Change the host status above to see the dot. Turn on Mobile and the GitHub mark and host name drop out.",
  parts: [
    { name: "BottomTray", file: "composer/parts/bottom-tray.tsx", description: "Start and end slots under the card." },
    { name: "DirectoryPicker", file: "composer/parts/directory-picker.tsx", description: "Folder or Scratch." },
    { name: "RepoBranchPicker", file: "composer/parts/repo-picker.tsx", description: "Repository and branch." },
    { name: "HostPicker", file: "composer/parts/host-picker.tsx", description: "Host and status dot." },
  ],
  props: [
    { name: "start", type: "ReactNode", description: "Left slot." },
    { name: "end", type: "ReactNode", description: "Right slot." },
  ],
  source: COMPOSER,
} satisfies Example;

export const directoryPicker = {
  name: "Directory Picker",
  href: "/examples/directory-picker/",
  category: "Composer · Workspace",
  description: "Pick the folder the agent works in, or a Scratch sandbox.",
  preview: DirectoryPreview,
  interaction: "Click the chip and type to filter recent and known folders. Type a path that starts with / or ~ to open it.",
  parts: [
    { name: "DirectoryPicker", file: "composer/parts/directory-picker.tsx", description: "Grouped Base UI combobox with an Open row." },
  ],
  props: [
    { name: "value", type: "string | null", description: "Folder path, null for Scratch.", required: true },
    { name: "onChange", type: "(path: string | null) => void", description: "Called when a folder is picked.", required: true },
    { name: "directories", type: "string[]", description: "Known folders.", required: true },
    { name: "recent", type: "string[]", description: "Shown first." },
    { name: "allowScratch", type: "boolean", description: "Offer Scratch. Defaults to true." },
  ],
  source: COMPOSER,
} satisfies Example;

export const repoBranchPicker = {
  name: "Repo & Branch",
  href: "/examples/repo-branch-picker/",
  category: "Composer · Workspace",
  description: "A repository picker and a branch picker that can create a branch, used alone or as one pair.",
  preview: RepoPreview,
  interaction: "Pick a repo and the branch resets to its default. Type a branch name that does not exist to create it.",
  parts: [
    { name: "RepoBranchPicker", file: "composer/parts/repo-picker.tsx", description: "Repo and branch as one control." },
    { name: "RepoSelect", file: "composer/parts/repo-picker.tsx", description: "Searchable repo list with private marks." },
    { name: "BranchSelect", file: "composer/parts/repo-picker.tsx", description: "Searchable branches with a create row." },
  ],
  props: [
    { name: "repos", type: "GithubRepo[]", description: "Repositories to offer.", required: true },
    { name: "value", type: "RepoRef", description: "Repo and branch.", required: true },
    { name: "onChange", type: "(next: RepoRef) => void", description: "Called on any change.", required: true },
    { name: "branchesOf", type: "(repo: string) => string[]", description: "Branches of a repo.", required: true },
    { name: "onCreateBranch", type: "(repo: string, branch: string) => void", description: "Shows the create row." },
  ],
  source: COMPOSER,
} satisfies Example;

export const queueSteer = {
  name: "Queue & Steer",
  href: "/examples/queue-steer/",
  category: "Composer · States",
  description: "Follow-ups sent during a run: queued for later, edited in place, or steered into the current run.",
  preview: QueueSteerPreview,
  interaction: "Send while the run is going and the message is queued. Turn on Steer or press the arrow on a queued item to join after the current step. Press the pencil to edit, Enter saves and Escape cancels. Stop keeps the queue.",
  parts: [
    { name: "QueueStrip", file: "composer/parts/strips/queue-strip.tsx", description: "Queued items with edit, steer and remove." },
    { name: "BusyToggle", file: "composer/parts/busy-toggle.tsx", description: "Queue or steer for the next send." },
    { name: "PromptComposer", file: "composer/prompt-composer.tsx", description: "The assembled composer in its busy state." },
  ],
  props: [
    { name: "messages", type: "QueuedMessage[]", description: "Queued items with text and mode.", required: true },
    { name: "onEdit", type: "(id, text) => void", description: "Save an edited item. Hides the pencil when missing." },
    { name: "onSteer", type: "(id) => void", description: "Move a queued item into the current run." },
    { name: "onRemove", type: "(id) => void", description: "Drop an item from the queue.", required: true },
  ],
  source: COMPOSER,
} satisfies Example;

export const composerStates = {
  name: "Composer States",
  href: "/examples/composer-states/",
  category: "Composer · States",
  description: "The full composer in every state it can be in, next to the run status line.",
  preview: StatesPreview,
  interaction: "Every sample is live. Open the pickers, send in the error sample, or stop the busy one.",
  parts: [
    { name: "PromptComposer", file: "composer/prompt-composer.tsx", description: "The assembled composer." },
    { name: "AiStatus", file: "ai-status.tsx", description: "Run status for thinking, researching, analyzing, writing, done and error." },
  ],
  props: [
    { name: "busy", type: "boolean", description: "The agent run is still going." },
    { name: "busyPolicy", type: '"block" | "queue" | "steerable"', description: "What Enter does while busy." },
    { name: "disabled", type: "boolean", description: "Turns every control off." },
    { name: "density", type: '"regular" | "compact"', description: "Compact fits side panels." },
  ],
  source: COMPOSER,
} satisfies Example;

export const agentMessage = {
  name: "Agent Message",
  href: "/examples/agent-message/",
  category: "Message · Rendering",
  description: "An assistant shares its plan, uses tools and streams a Markdown answer with sources and actions.",
  preview: AgentMessagePreview,
  interaction: "The turn plays on its own inside a following scroll area. Turn on Fail to see the error with Retry. Hover the footer to copy, rate or regenerate.",
  parts: [
    { name: "Message", file: "_message/message.tsx", description: "Shell for user, assistant and system rows, with avatar, name, time, attachments and footer slots." },
    { name: "MessageAttachments", file: "_message/message.tsx", description: "File chips above a user message." },
    { name: "MessageError", file: "_message/message.tsx", description: "Inline failure with an optional Retry." },
    { name: "TypingDots", file: "_message/message.tsx", description: "Status before the first token." },
    { name: "Plan", file: "_message/plan.tsx", description: "Shows the current step and completed count as the turn progresses." },
    { name: "DisclosureRow", file: "_message/disclosure-row.tsx", description: "The shared row behind thinking, tools, search and swarm." },
  ],
  props: [
    { name: "role", type: '"user" | "assistant" | "system"', description: "Layout of the row.", required: true },
    { name: "name / avatar / time", type: "string / ReactNode / string", description: "Optional header of an assistant message." },
    { name: "attachments", type: "ReactNode", description: "Rendered above a user bubble." },
    { name: "footer", type: "ReactNode", description: "Usually MessageActions, sources or both." },
  ],
  source: MESSAGE,
} satisfies Example;

export const markdownRenderer = {
  name: "Markdown",
  href: "/examples/markdown/",
  category: "Message · Rendering",
  description: "Model output as Markdown: headings, emphasis, lists, task lists, tables, quotes, code with copy, footnotes and CJK text.",
  preview: MarkdownPreview,
  interaction: "Static shows every format at once. Streaming replays the same text and closes unfinished syntax while it grows.",
  parts: [
    { name: "Markdown", file: "_message/markdown.tsx", description: "Wraps @pierre/words with highlighting, safe links and blocked images." },
    { name: "message.css", file: "_message/message.css", description: "Neutral overrides for task lists, strikethrough, mark and kbd." },
  ],
  props: [
    { name: "children", type: "string", description: "Markdown source.", required: true },
    { name: "streaming", type: "boolean", description: "Repairs open syntax and fades in new text. Defaults to false." },
    { name: "images", type: "boolean", description: "Allow remote images. Off by default so output cannot leak data through image URLs." },
    { name: "size", type: '"body" | "small"', description: "Small is used inside thinking and tool details." },
  ],
  source: MESSAGE,
} satisfies Example;

export const smoothStreaming = {
  name: "Smooth Streaming",
  href: "/examples/smooth-streaming/",
  category: "Message · Rendering",
  description: "A hook that turns bursty token chunks into a steady reveal, side by side with the raw stream.",
  preview: StreamingPreview,
  interaction: "Both columns read the same bursty stream. The right one drains a buffer on every frame and speeds up when a burst lands. Replay to run it again.",
  parts: [{ name: "useSmoothStream", file: "_message/use-smooth-stream.ts", description: "Returns the visible slice and whether it has caught up." }],
  props: [
    { name: "target", type: "string", description: "Everything received so far.", required: true },
    { name: "minRate", type: "number", description: "Floor speed in characters per second. Defaults to 60." },
    { name: "lag", type: "number", description: "Seconds a burst takes to drain. Defaults to 0.6." },
  ],
  source: MESSAGE,
} satisfies Example;

export const shimmerText = {
  name: "Shimmer Text",
  href: "/examples/shimmer-text/",
  category: "Message · Rendering",
  description: "A neutral highlight sweeps across a working status label.",
  preview: ShimmerTextPreview,
  interaction: "Switch between Working and Complete to see the label settle when the review ends. With reduced motion, both states use solid text.",
  parts: [{ name: "ShimmerText", file: "_shared/ui/shimmer-text.tsx", description: "An inline span styled with the shared ink colors." }],
  props: [
    { name: "children", type: "ReactNode", description: "The status text.", required: true },
    { name: "active", type: "boolean", description: "Runs the sweep while true. Defaults to true." },
    { name: "className", type: "string", description: "Additional classes for the span." },
  ],
} satisfies Example;

export const shadowScroll = {
  name: "Shadow Scroll",
  href: "/examples/shadow-scroll/",
  category: "Message · Layout",
  description: "A scroll area that fades its edges only where content hides, and can follow new content to the bottom.",
  preview: ShadowScrollPreview,
  interaction: "The left list grows every second and stays pinned. Scroll up to stop following, then press Jump to latest. The right list only fades.",
  parts: [{ name: "ShadowScroll", file: "_message/shadow-scroll.tsx", description: "Mask fades, pin to bottom and the jump button." }],
  props: [
    { name: "follow", type: "boolean", description: "Pin to the bottom while content grows." },
    { name: "fade", type: "number", description: "Fade size in pixels. Defaults to 32." },
    { name: "jumpLabel", type: "string", description: "Label of the jump button." },
    { name: "contentClassName", type: "string", description: "Class of the inner content box." },
  ],
  source: MESSAGE,
} satisfies Example;

export const messageActions = {
  name: "Message Actions",
  href: "/examples/message-actions/",
  category: "Message · Footer",
  description: "A footer toolbar for any message: copy, feedback, regenerate, a more menu and model or token meta.",
  preview: ActionsPreview,
  interaction: "Click copy, the thumbs or regenerate. Open the more menu for branch, read aloud, share and delete. The second and third rows only show on hover or focus.",
  parts: [
    { name: "MessageActions", file: "_message/message-actions.tsx", description: "Toolbar with tooltips, a Base UI menu and a meta slot." },
    { name: "useCopyAction / feedbackActions / retryAction", file: "_message/message-actions.tsx", description: "Ready made actions." },
  ],
  props: [
    { name: "actions", type: "MessageAction[]", description: "Id, label, icon, pressed and onSelect.", required: true },
    { name: "menu", type: "MessageMenuItem[]", description: "Items in the more menu. Use danger and separated for delete." },
    { name: "meta", type: "ReactNode", description: "Trailing text such as model, tokens and time." },
    { name: "reveal", type: '"always" | "hover"', description: "Hover hides it until the message is hovered or focused." },
  ],
  source: MESSAGE,
} satisfies Example;

export const thinkingBlock = {
  name: "Thinking",
  href: "/examples/thinking/",
  category: "Message · Blocks",
  description: "A thinking row that shimmers while it streams, reports the time and folds away.",
  preview: ThinkingBlockPreview,
  interaction: "The live row opens while streaming and closes one second after it ends. Click any row to open or close it.",
  parts: [{ name: "Thinking", file: "_message/thinking.tsx", description: "Timer, auto close and the Markdown body." }],
  props: [
    { name: "children", type: "string", description: "Thinking text as Markdown." },
    { name: "streaming", type: "boolean", description: "Whether text is still arriving.", required: true },
    { name: "seconds", type: "number", description: "Known duration for history items." },
    { name: "autoClose / defaultOpen", type: "boolean", description: "Folding behavior." },
    { name: "labels / icon", type: "object / ReactNode", description: "Rename the row for planning or other steps." },
    { name: "redacted", type: "boolean", description: "Shows a hidden notice instead of text." },
  ],
  source: MESSAGE,
} satisfies Example;

export const toolOutput = {
  name: "Tool Output",
  href: "/examples/tool-output/",
  category: "Message · Blocks",
  description: "A generic tool call row with waiting, running, done and failed states, and details for input, output and terminal runs.",
  preview: ToolOutputPreview,
  interaction: "Three tools run in order inside a group. Click a row to see its input and output, or copy them. The failed and waiting rows show the other states.",
  parts: [
    { name: "ToolCall", file: "_message/tool-call.tsx", description: "Row with verb, summary, duration and status." },
    { name: "ToolGroup", file: "_message/tool-call.tsx", description: "Folds several calls under one line." },
    { name: "ToolInput / ToolOutput / ToolTerminal", file: "_message/tool-call.tsx", description: "Detail sections with copy." },
  ],
  props: [
    { name: "name", type: "string", description: "Tool name, used when no verb is given.", required: true },
    { name: "status", type: '"pending" | "running" | "done" | "error"', description: "Current state.", required: true },
    { name: "verb", type: "{ active, done }", description: "Reading and Read, Running and Ran." },
    { name: "summary / icon / duration", type: "ReactNode / ReactNode / number", description: "Row content." },
    { name: "children", type: "ReactNode", description: "Details shown when the row opens." },
  ],
  source: MESSAGE,
} satisfies Example;

export const plan = {
  name: "Plan",
  href: "/examples/plan/",
  category: "Message · Tools",
  description: "The model’s ordered plan with a status for each step and a running completion count.",
  preview: PlanPreview,
  interaction: "Watch each step start and finish, or select a state to pause there. Replay starts the sequence again. Collapse the list to follow the completion count in the header.",
  parts: [
    { name: "Plan", file: "_message/plan.tsx", description: "Collapsible message card with a completed step count." },
    { name: "PlanList", file: "_message/plan.tsx", description: "Ordered steps for embedding in a tool result." },
  ],
  props: [
    { name: "plan", type: "readonly PlanStep[]", description: "Each step has a step string and a status of pending, in_progress or completed.", required: true },
    { name: "defaultOpen", type: "boolean", description: "Starts expanded by default." },
  ],
} satisfies Example;

export const webSearch = {
  name: "Web Search",
  href: "/examples/web-search/",
  category: "Message · Blocks",
  description: "Search progress, results, inline citations with previews and a numbered source list.",
  preview: SearchPreview,
  interaction: "Sites appear as they are read. Open the row for queries and results. Hover a number in the answer to preview its source.",
  parts: [
    { name: "WebSearch", file: "_message/web-search.tsx", description: "Searching and searched states with a site stack." },
    { name: "Citation", file: "_message/web-search.tsx", description: "Inline number with a Base UI hover popover." },
    { name: "SourceList", file: "_message/web-search.tsx", description: "Numbered chips for the footer." },
  ],
  props: [
    { name: "queries", type: "string[]", description: "Queries sent so far.", required: true },
    { name: "sources", type: "SearchSource[]", description: "Title, url, snippet and date.", required: true },
    { name: "status", type: '"searching" | "done"', description: "Current state.", required: true },
  ],
  source: MESSAGE,
} satisfies Example;

export const subagentSwarm = {
  name: "Subagent Swarm",
  href: "/examples/subagent-swarm/",
  category: "Message · Blocks",
  description: "Several subagents working in parallel, each with a live step, progress and result.",
  preview: SwarmPreview,
  interaction: "Three slots run at once and the reviewer waits until the others finish. One agent fails on purpose. Replay to start again.",
  parts: [
    { name: "Swarm", file: "_message/swarm.tsx", description: "Header with counts and a grid of agent tiles." },
    { name: "AgentOrb", file: "_message/swarm.tsx", description: "Status mark with a spinning ring while working." },
    { name: "SwarmSummary", file: "_message/swarm.tsx", description: "Working, done and failed counts." },
  ],
  props: [
    { name: "title", type: "string", description: "Header text.", required: true },
    { name: "agents", type: "SwarmAgent[]", description: "Name, role, task, status, step and progress.", required: true },
    { name: "lead", type: "ReactNode", description: "Optional content between header and grid." },
    { name: "columns", type: "1 | 2 | 3", description: "Grid columns at wide sizes. Defaults to 2." },
  ],
  source: MESSAGE,
} satisfies Example;

export const workLog = {
  name: "Work Log",
  href: "/examples/work-log/",
  category: "Message · Blocks",
  description: "A folding log of what the agent did while it worked: reads, searches, commands, edits and thinking, with time and lines changed.",
  preview: WorkLogPreview,
  interaction:
    "Steps stream in and the newest one shimmers. Pick Rail, Timeline or Ticker on top, and Group to merge runs of reads or searches. Click the header to fold the log. Thinking, commands with output and notes open on click.",
  parts: [
    { name: "WorkLog", file: "_message/work-log.tsx", description: "Header with timer and diff stat, and the scrolling step list." },
    { name: "Ticker", file: "_message/work-log.tsx", description: "One line that rolls to the newest step while folded." },
    { name: "DiffStat", file: "_message/work-log.tsx", description: "Added and removed line counts." },
    { name: "ShadowScroll", file: "_message/shadow-scroll.tsx", description: "Caps the height, fades the edges and follows new steps." },
  ],
  props: [
    { name: "steps", type: "WorkStep[]", description: "read, search, list, run, edit, think, web or note.", required: true },
    { name: "status", type: '"working" | "done" | "stopped" | "failed"', description: "Sets the header text. Working counts time by itself.", required: true },
    { name: "seconds", type: "number", description: "Known duration for history items." },
    { name: "added / removed", type: "number", description: "Lines changed, shown next to the time." },
    { name: "variant", type: '"rail" | "timeline" | "ticker"', description: "Visual style. Defaults to rail." },
    { name: "group", type: "boolean", description: "Merges runs of the same read, search or list step." },
    { name: "defaultOpen / maxHeight", type: "boolean / number", description: "Starting fold and the list height cap." },
  ],
  source: MESSAGE,
} satisfies Example;

export const liveSession = {
  name: "Live Session",
  href: "/examples/live-session/",
  category: "Message · Blocks",
  description: "A team of agents chatting while they work, with the team plan and the shared context beside the conversation.",
  interaction:
    "The scene replays on its own. Click an agent tab to dim the rest and fade the plan steps it does not own. Type @ to name an agent, press Enter to send. Click a message to open its details, a file chip to preview it, or Reply on a question that needs you.",
  parts: [
    { name: "LiveSession", file: "_live-session/live-session.tsx", description: "Lays out chat, plan and context, and holds the picked agent." },
    { name: "AgentChat", file: "_live-session/agent-chat.tsx", description: "Tabs, message stream, composer and file preview." },
    { name: "MessageStream · ChatMessage", file: "_live-session/message-stream.tsx", description: "Scrolling stream that keeps to the bottom and shows a new count when scrolled up." },
    { name: "Composer", file: "_live-session/composer.tsx", description: "Input with @ mention menu, recipient and reply draft." },
    { name: "TeamPlan", file: "_live-session/team-plan.tsx", description: "Plan header, run timer and step list with status icons." },
    { name: "ContextWindow", file: "_live-session/context-window.tsx", description: "Token count, pixel grid and one row per segment." },
    { name: "useLiveSession", file: "_live-session/use-live-session.ts", description: "Plays a timed script into session state and loops it." },
  ],
  props: [
    { name: "agents", type: "Agent[]", description: "Name, model, mark pattern and color of each participant.", required: true },
    { name: "session", type: "SessionState", description: "Visible agents, stream items, plan steps and context segments.", required: true },
    { name: "agentCount", type: "number", description: "Agents shown in the plan header.", required: true },
    { name: "elapsed", type: "number", description: "Run time in seconds.", required: true },
    { name: "onSend", type: "(draft: Draft) => void", description: "Called with recipient, text and the quoted message.", required: true },
  ],
  source: "Recreated from the behavior of a reference Live Session block. Colors and spacing are the reference values for now.",
} satisfies Example;

export const traceWaterfall = {
  name: "Trace Waterfall",
  href: "/examples/trace-waterfall/",
  category: "Message · Blocks",
  description: "Every model call, tool call and sub-agent of a run as a bar on a live timeline, with cost and tokens per step.",
  interaction:
    "The run plays at six times speed and loops. The time axis widens as the run grows. Click a row for its details, the chevron or Left and Right arrows to fold a branch, Up and Down to move. A folded branch keeps its calls as small marks on its bar. The slowest finished call is tagged.",
  parts: [
    { name: "TraceWaterfall", file: "_trace-waterfall/trace-waterfall.tsx", description: "Holds folds and the selected row, handles keys and places the details card." },
    { name: "TraceHeader", file: "_trace-waterfall/trace-header.tsx", description: "Title, task, live state and six totals." },
    { name: "TraceRow", file: "_trace-waterfall/trace-row.tsx", description: "One span: name column, bar, marks and the duration tag." },
    { name: "SpanPopover", file: "_trace-waterfall/span-popover.tsx", description: "Details for one span: status, duration, cost, tokens, error and input." },
    { name: "TraceLayer", file: "_trace-waterfall/trace-axis.tsx", description: "Axis ticks and the now line." },
    { name: "viewAt", file: "_trace-waterfall/trace-model.ts", description: "Turns spans and a clock value into rows, totals and the axis range." },
    { name: "useTraceClock", file: "_trace-waterfall/use-trace-clock.ts", description: "Plays a run at a chosen speed, holds the end and loops." },
  ],
  props: [
    { name: "spans", type: "Span[]", description: "Id, parent, kind, title, start, duration, cost, tokens and an optional failure.", required: true },
    { name: "now", type: "number", description: "Clock value in milliseconds. Spans that have not started stay hidden.", required: true },
    { name: "task", type: "string", description: "Text next to the title.", required: true },
    { name: "title", type: "string", description: "Header title. Defaults to Trace." },
    { name: "defaultFolded", type: "ReadonlySet<string>", description: "Span ids that start folded." },
  ],
  source: "Recreated from the behavior of a reference trace view. Colors and spacing are the reference values for now.",
} satisfies Example;

export const runTimeline = {
  name: "Run Timeline",
  href: "/examples/run-timeline/",
  category: "Message · Blocks",
  description: "The steps of an agent run as bars on a fixed time axis, added one by one as the run goes.",
  interaction:
    "The run plays in real time and loops. A new step slides in when it starts, its bar grows and its time counts up, and a line marks now. Sub-agent steps nest under their parent. A failed step turns red. Click a step to select it.",
  parts: [
    { name: "RunTimeline", file: "_run-timeline/run-timeline.tsx", description: "Legend, axis and the step rows. Selection can be controlled or local." },
    { name: "TimelineRow", file: "_run-timeline/timeline-row.tsx", description: "One step: tile, name, bar and time tag." },
    { name: "StepTile", file: "_run-timeline/step-tile.tsx", description: "Icon for thinking and tool steps, a pixel mark for sub-agents." },
    { name: "TimelineAxis · TimelineLines", file: "_run-timeline/timeline-axis.tsx", description: "Time labels, dashed guides and the now line." },
    { name: "viewAt", file: "_run-timeline/timeline-model.ts", description: "Turns steps and a clock value into the rows to show, with status and elapsed time." },
    { name: "useRunClock", file: "_run-timeline/use-run-clock.ts", description: "Real-time clock that holds at the end and loops." },
  ],
  props: [
    { name: "steps", type: "Step[]", description: "Id, label, kind, start, duration, parent, tool and an optional failure.", required: true },
    { name: "now", type: "number", description: "Clock value in seconds. Steps that have not started stay hidden.", required: true },
    { name: "range", type: "number", description: "Seconds covered by the axis.", required: true },
    { name: "selectedId / onSelect", type: "string | null / (id) => void", description: "Controlled selection. Omit to let the timeline keep it." },
    { name: "label", type: "string", description: "Accessible name of the section." },
  ],
  source: "Recreated from the behavior of a reference run detail screen. Colors and spacing are the reference values for now.",
} satisfies Example;

export const contextWindow = {
  name: "Context Window",
  href: "/examples/context-window/",
  category: "Message · Blocks",
  description: "How full a model's context window is, by part, as a map or a block grid, in an open card, a folded row or a compact card.",
  preview: ContextWindowPreview,
  interaction:
    "Each request is estimated while it is live, then counted. Hover a legend chip, a row, a tile or a cell to light what it stands for. Switch between the map and the grid, pick a part in the contents tabs, and fold the card to one line. Replay restarts the requests.",
  parts: [
    { name: "ContextWindow", file: "_context-window/context-window.tsx", description: "Head, layout switch and the shared focus. Fold, look and tab can be controlled or local." },
    { name: "ContextStats", file: "_context-window/context-stats.tsx", description: "Tokens used, health, headroom and the prompt cache. The compact layout uses a figure row." },
    { name: "ContextViz", file: "_context-window/context-viz.tsx", description: "The tile map, the block grid and their tip." },
    { name: "ContextLegend · ContextPartRows", file: "_context-window/context-legend.tsx", description: "Part chips with the look switch, or one row per part in the compact card." },
    { name: "ContextContents", file: "_context-window/context-contents.tsx", description: "Tabs and the largest items first, with Show all." },
    { name: "ContextFoot · ContextSpark", file: "_context-window/context-session.tsx", description: "Crumbs, turn notes and the session line against the window." },
    { name: "tilesOf · cellsOf", file: "_context-window/context-model.ts", description: "Pure layout of the tiles and the 400 cells, plus health, headroom and number formats." },
    { name: "useContextScript", file: "_context-window/use-context-script.ts", description: "Plays the demo requests, each live and then counted, and holds on the last." },
  ],
  props: [
    { name: "prompt", type: "Prompt", description: "Window, tokens, parts with items, and whether the count is the vendor's.", required: true },
    { name: "live", type: "boolean", description: "The request is under way. Defaults to false." },
    { name: "layout", type: "\"full\" | \"compact\"", description: "Defaults to full." },
    { name: "title", type: "string", description: "Card title. Defaults to Context window." },
    { name: "agent / model", type: "{ name, icon } / { id, icon }", description: "Route shown in the head." },
    { name: "cache / liveCache", type: "PromptCache | null", description: "This request's cache, and the last answered one shown dimmed while live." },
    { name: "session", type: "{ points, at, crumbs, onPoint }", description: "Session line, headroom and footer path." },
    { name: "foldable · collapsed / onCollapsedChange", type: "boolean · boolean / (collapsed) => void", description: "Folds the full card to one line. Omit collapsed to let the card keep it." },
    { name: "look / onLookChange", type: "\"map\" | \"grid\"", description: "Controlled or local, like tab." },
    { name: "tab / onTabChange", type: "\"all\" | PartKind", description: "Contents tab." },
    { name: "onSelectItem", type: "(part, item?) => void", description: "Makes tiles, cells, chips and rows clickable. Omit it and nothing is." },
  ],
  source: "Recreated from the behavior of a reference routing page. Colors and spacing are the reference values.",
} satisfies Example;

export const langfuseTrace = {
  name: "Langfuse Trace",
  href: "/examples/langfuse-trace/",
  category: "Message · Blocks",
  description: "One Langfuse trace as a waterfall of steps, with totals, filters, failure tracking and a details panel.",
  interaction:
    "Click a step to open its details on the right: timing, first token and speed, the token split between new, cached and output, the failure path and its input and output, which load on demand. With nothing selected the panel summarizes the trace. Filter by generations, tools or errors, hide instant steps, fold branches with the chevrons or the arrow keys, and jump to the failing step. Traces above 60 steps start folded below the second level.",
  parts: [
    { name: "TraceView", file: "_langfuse/trace-view.tsx", description: "Holds the filter, folds and selection, and lays out the head, toolbar, waterfall and panel." },
    { name: "TraceHead", file: "_langfuse/trace-head.tsx", description: "Title, status, jump to failure and the six totals. Tokens show the cached share and a split bar." },
    { name: "NodeRow", file: "_langfuse/node-row.tsx", description: "One step: a bar for work, a bracket for wrapper spans, a diamond for instant steps, and a hatched wait before the first token." },
    { name: "NodePanel · TraceSummary", file: "_langfuse/node-panel.tsx", description: "Details of the selected step, or a summary of the trace when none is selected." },
    { name: "toSession · toTraces", file: "_langfuse/to-trace.ts", description: "Turns Langfuse observation rows into traces with a tree, totals and failure origins." },
    { name: "readObservations", file: "_langfuse/observation.ts", description: "Validates a Langfuse v2 observations response at the boundary." },
    { name: "View model", file: "_langfuse/view-model.ts", description: "Filters, default folds, the axis, slowest steps, failure path and output speed." },
  ],
  props: [
    { name: "trace", type: "Trace", description: "A trace from toTraces or toSession.", required: true },
    { name: "loadIo", type: "(node: TraceNode) => Promise<{ input?: string; output?: string }>", description: "Loads input and output when a step opens. Keep the function stable." },
    { name: "detail", type: '"dock" | "none"', description: "Dock shows details under the timeline. None leaves them to the host, for example a pane next to a whole session. Defaults to dock." },
    { name: "selectedId / onSelect", type: "string | null / (id) => void", description: "Controlled selection. Omit to let the view keep it." },
  ],
  source: "Built on the Langfuse v2 observations data model. The sample session is redacted.",
} satisfies Example;



export const langfuseSession = {
  name: "Langfuse Session",
  href: "/examples/langfuse-session/",
  category: "Message · Blocks",
  description: "A Langfuse session as a strip of turns and a list that opens each turn into its trace.",
  interaction:
    "The strip shows every turn in time order. Each block is as wide as the square root of its duration, red when the turn failed and amber when only some steps did, and long idle gaps collapse into a marker with the time between turns. Click a block or a row to open its trace in place. The first failing turn starts open. Click any step of any open turn and its details show in a pane on the right of the whole session, which stays in view while the turns scroll. With nothing selected the pane summarizes the session, and a failure listed there opens its turn and selects the step. Jump to failure selects the failing step, and With errors keeps only the turns with errors. Below 980px the pane goes away and each trace docks its details at the bottom.",
  parts: [
    { name: "SessionView", file: "_langfuse/session-view.tsx", description: "Holds which turns are open, the filter and the jump, and lays out the head, strip and turn list." },
    { name: "SessionHead", file: "_langfuse/session-head.tsx", description: "Session id, status and six totals. Duration also shows the idle time between turns." },
    { name: "SessionStrip", file: "_langfuse/session-strip.tsx", description: "One block per turn with idle gaps compressed." },
    { name: "SessionSummary", file: "_langfuse/session-summary.tsx", description: "What the right pane shows with no step selected: tokens, models, failures and the slowest steps of the whole session." },
    { name: "TurnRow", file: "_langfuse/turn-row.tsx", description: "A collapsible turn: number, name, offset, summary, tokens with cached share, duration and state." },
    { name: "Session model", file: "_langfuse/session-model.ts", description: "Turn states, the strip layout, the turn to open first and the one line summary." },
    { name: "TraceView", file: "_langfuse/trace-view.tsx", description: "The full trace of an open turn." },
  ],
  props: [
    { name: "session", type: "Session", description: "A session from toSession.", required: true },
    { name: "loadIo", type: "(node: TraceNode) => Promise<{ input?: string; output?: string }>", description: "Used for the step shown in the pane or the dock. Keep the function stable." },
    { name: "defaultOpenId", type: "string | null", description: "Trace id to open first. Defaults to the first failing turn, then the longest. Null opens none." },
    { name: "detail", type: '"side" | "dock"', description: "Where step details go. Side puts one pane on the right of the session. Dock keeps them under each trace. Side falls back to dock below 980px. Defaults to side." },
  ],
  source: "Built on the Langfuse v2 observations data model. The sample session is redacted.",
} satisfies Example;

export const examples: Example[] = [promptComposer, promptInput, permissionPicker, modelPicker, effortPicker, contextUsage, topTray, bottomTray, directoryPicker, repoBranchPicker, queueSteer, composerStates, chatMessage, reasoning, toolSteps, approvals, askQuestion, activityCards, thinkingIndicator, suggestions, agentMessage, markdownRenderer, smoothStreaming, shimmerText, shadowScroll, messageActions, thinkingBlock, toolOutput, plan, webSearch, subagentSwarm, workLog, liveSession, traceWaterfall, runTimeline, contextWindow, langfuseTrace, langfuseSession];

export const exampleFamily = (item: Example) => item.category.split(" · ")[0];

export const exampleGroups = Array.from(new Set(examples.map(exampleFamily)), (label) => ({
  label,
  items: examples.filter((item) => exampleFamily(item) === label),
}));

export const activeExample = (path: string) => examples.find((item) => item.href === `${path.replace(/\/$/, "")}/`);
