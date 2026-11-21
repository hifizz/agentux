import type { ReactNode } from "react";
import { ActivityPreview, ApprovalsPreview, AskPreview, MessagePreview, ReasoningPreview, SuggestionsPreview, ThinkingPreview, ToolStepsPreview } from "@/components/gallery/ChatPreviews";
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

const PI = "Ported from the agent-builder Pi chat components.";
const CONVERSATION = "Ported from the agent-builder conversation module.";

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

export const examples: Example[] = [promptComposer, chatMessage, reasoning, toolSteps, approvals, askQuestion, activityCards, thinkingIndicator, suggestions];
