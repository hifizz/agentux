import type { Draft, EventBody, Message, SessionState } from "./types";

export type SessionAction = EventBody | { type: "reset"; state: SessionState };

export function reduceSession(state: SessionState, action: SessionAction): SessionState {
  switch (action.type) {
    case "reset":
      return action.state;
    case "add":
      return { ...state, items: [...state.items, action.item] };
    case "say":
      return {
        ...state,
        items: state.items.map((item) => (item.kind === "message" && item.id === action.id ? { ...item, ...action.patch, status: "done" } : item)),
      };
    case "reveal":
      return state.visible.includes(action.agent) ? state : { ...state, visible: [...state.visible, action.agent] };
    case "step":
      return {
        ...state,
        steps: state.steps.map((step) => (step.id === action.id ? { ...step, status: action.status, seconds: action.seconds ?? step.seconds } : step)),
      };
    case "tokens":
      return {
        ...state,
        context: {
          ...state.context,
          segments: state.context.segments.map((segment) => ({ ...segment, tokens: action.values[segment.id] ?? segment.tokens })),
        },
      };
  }
}

export const clockLabel = (date = new Date()) => `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;

export function userMessage(id: string, draft: Draft): Message {
  return { kind: "message", id, from: "you", to: draft.to, quote: draft.quote, text: draft.text, time: clockLabel(), status: "done" };
}
