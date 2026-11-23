import { readObservations } from "../observation";
import raw from "./agent-session.json";

export const AGENT_SESSION = readObservations(raw).rows;
