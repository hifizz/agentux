"use client";

import { createContext, useContext } from "react";
import type { Beat, PanelTarget } from "../script/types";

export type BeatHost = { onShow: (beat: Beat) => void; open: (target: PanelTarget) => void };

export const NO_HOST: BeatHost = { onShow: () => {}, open: () => {} };
const BeatHostContext = createContext<BeatHost>(NO_HOST);

export const BeatHostProvider = BeatHostContext.Provider;
export const useBeatHost = () => useContext(BeatHostContext);
