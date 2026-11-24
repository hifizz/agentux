export type ToolId = "mail" | "calendar" | "drive";
export type FileKind = "sheet" | "doc" | "pdf";
export type Facts = readonly (readonly [string, string])[];
export type Step = { target: "request" | "files" | ToolId; text: string; result: string };

export const request = {
  name: "Sam Reed",
  message: "Find half an hour with Alex next week and share the launch budget before our review.",
};
export const assistant = { name: "Assistant", subtitle: "Connected to your Google account" };

export const files: { kind: FileKind; name: string; meta: string; facts: Facts }[] = [
  { kind: "sheet", name: "launch-budget.xlsx", meta: "46 KB", facts: [["Type", "Excel spreadsheet"], ["Sheets", "4"], ["Added by", request.name], ["Added", "Today, 9:10"]] },
  { kind: "doc", name: "review-notes.docx", meta: "5 pages", facts: [["Type", "Word document"], ["Size", "208 KB"], ["Added by", request.name], ["Added", "Yesterday"]] },
  { kind: "pdf", name: "partner-terms.pdf", meta: "14 pages", facts: [["Type", "PDF document"], ["Size", "1.4 MB"], ["Added by", request.name], ["Added", "Monday"]] },
];

export const tools: { id: ToolId; name: string; scope: string; last: string; when: string; facts: Facts }[] = [
  { id: "mail", name: "Gmail", scope: "Read & send · sam@example.com", last: "Sent the team update", when: "2h ago", facts: [["May", "Read, draft, send"], ["Account", "sam@example.com"], ["Connected", "Apr 8"]] },
  { id: "calendar", name: "Google Calendar", scope: "Read & book · Team", last: "Moved the launch review", when: "Yesterday", facts: [["May", "Read, book, move"], ["Calendar", "Team"], ["Connected", "Mar 16"]] },
  { id: "drive", name: "Google Drive", scope: "Read & share · Planning", last: "Found the project brief", when: "Mon", facts: [["May", "Read, share"], ["Folder", "Planning"], ["Connected", "Feb 21"]] },
];

export const steps: Step[] = [
  { target: "request", text: "Reading Sam’s request", result: "Read the request" },
  { target: "files", text: "Reading launch-budget.xlsx", result: "Read the launch budget" },
  { target: "calendar", text: "Checking Alex’s free time next week", result: "Found an opening on Wednesday" },
  { target: "calendar", text: "Reserving Wed 10:00 – 10:30", result: "Booked Wed 10:00 – 10:30" },
  { target: "drive", text: "Sharing the budget with Alex", result: "Shared launch-budget.xlsx" },
  { target: "mail", text: "Sending Alex the meeting invite", result: "Sent Alex the meeting invite" },
];

export const holds = [600, 1600, 2000, 2200, 1600, 1800, 2000, 3600, 400];
