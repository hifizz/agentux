import { createContext, useContext } from "react";
import type { Focus } from "./types";

export const FocusContext = createContext<{ focus: Focus; setFocus: (focus: Focus) => void }>({ focus: null, setFocus: () => {} });

export const useFocus = () => useContext(FocusContext);
