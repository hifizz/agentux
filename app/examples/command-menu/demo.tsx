"use client";

import Stage from "@/components/examples/Stage";
import { CommandMenu } from "../_command-menu/command-menu";
import type { CommandGroup } from "../_command-menu/types";
import { useCommandMenuScript } from "../_command-menu/use-command-menu-script";
import { FigmaMark, GitHubMark, GoogleCalendarMark, LinearMark, NotionMark, SlackMark } from "../_shared/ui/icons";
import { BarsIcon, DocIcon, GearIcon, HelpIcon, HomeIcon, InboxIcon, InviteIcon, MoonIcon, SparkMark, UploadIcon } from "./marks";

const GROUPS: CommandGroup[] = [
  {
    id: "agent",
    label: "Agent",
    items: [
      { id: "ask-agent", name: "Ask the agent", hint: "Answers, drafts, summaries", keys: ["⌘", "1"], logo: <SparkMark />, keywords: ["assistant", "question", "ai"], done: "Asked the agent" },
      { id: "msg", name: "Draft a message", hint: "Slack", keys: ["⌘", "2"], logo: <SlackMark />, keywords: ["post", "chat"], done: "Opened the Slack draft" },
      { id: "issue", name: "File an issue", hint: "Linear", keys: ["⌘", "3"], logo: <LinearMark />, keywords: ["bug", "ticket"], done: "Drafted the Linear issue" },
      { id: "pr", name: "Review a pull request", hint: "GitHub", keys: ["⌘", "4"], logo: <GitHubMark />, keywords: ["merge", "code"], done: "Opened the pull request" },
      { id: "focus", name: "Book a focus block", hint: "Google Calendar", keys: ["⌘", "5"], logo: <GoogleCalendarMark />, keywords: ["meeting", "event"], done: "Booked the focus block" },
    ],
  },
  {
    id: "share",
    label: "Share",
    items: [
      { id: "notes", name: "Save to notes", hint: "Notion · Sprint notes", logo: <NotionMark />, keywords: ["wiki", "page"], done: "Saved to Sprint notes" },
      { id: "mock", name: "Attach a mockup", hint: "Figma", logo: <FigmaMark />, keywords: ["design", "file"], done: "Attached the mockup" },
    ],
  },
  {
    id: "workspace",
    label: "Workspace",
    items: [
      { id: "doc", name: "Start a document", keys: ["N"], icon: <DocIcon />, keywords: ["new", "file", "page"], done: "Started a document" },
      { id: "invite", name: "Invite a teammate", keys: ["I"], icon: <InviteIcon />, keywords: ["member", "share"], done: "Sent the invite" },
      { id: "upload", name: "Upload a file", keys: ["U"], icon: <UploadIcon />, keywords: ["attach", "import"], done: "Uploaded the file" },
      { id: "dark", name: "Toggle dark mode", keys: ["⇧", "D"], icon: <MoonIcon />, keywords: ["theme", "appearance", "night"], done: "Toggled dark mode" },
    ],
  },
  {
    id: "goto",
    label: "Go to",
    items: [
      { id: "home", name: "Home", keys: ["G", "H"], icon: <HomeIcon />, keywords: ["main", "start"], done: "Went Home" },
      { id: "inbox", name: "Inbox", keys: ["G", "I"], icon: <InboxIcon />, keywords: ["mail", "unread"], done: "Went to Inbox" },
      { id: "reports", name: "Reports", keys: ["G", "R"], icon: <BarsIcon />, keywords: ["charts", "stats"], done: "Went to Reports" },
      { id: "settings", name: "Settings", keys: ["G", "S"], icon: <GearIcon />, keywords: ["preferences", "options"], done: "Opened Settings" },
      { id: "help", name: "Help & feedback", keys: ["?"], icon: <HelpIcon />, keywords: ["support", "docs"], done: "Opened help" },
    ],
  },
];

export default function Demo() {
  const s = useCommandMenuScript(GROUPS, { askLogo: <SparkMark /> });
  return (
    <Stage status="Type to filter, arrows move, Tab jumps sections, Enter runs. The demo drives the menu on a loop." onReplay={s.replay}>
      <div className="mx-auto w-full max-w-[600px]">
        <CommandMenu
          groups={GROUPS}
          query={s.query}
          active={s.active}
          ran={s.ran}
          done={s.done}
          onQueryChange={s.setQuery}
          onActiveChange={s.select}
          onRun={(item) => s.activate(item.id)}
          askIcon={<SparkMark />}
        />
      </div>
    </Stage>
  );
}
