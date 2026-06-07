"use client";

import { create } from "zustand";
import type { LanguageKey, ModeKey } from "@/data/portfolio";
import type { DepthKey } from "@/lib/curation";

export type InterestKey = "founders" | "visual" | "commerce" | "culture" | "all";

type ExperienceStore = {
  mode: ModeKey;
  language: LanguageKey;
  interest: InterestKey;
  depth: DepthKey;
  curationSignature: string;
  curated: boolean;
  audio: boolean;
  setMode: (mode: ModeKey) => void;
  setLanguage: (language: LanguageKey) => void;
  setInterest: (interest: InterestKey) => void;
  setDepth: (depth: DepthKey) => void;
  setCurationSignature: (signature: string) => void;
  setCurated: (curated: boolean) => void;
  toggleAudio: () => void;
};

export const useExperienceStore = create<ExperienceStore>((set) => ({
  mode: "minimal",
  language: "en",
  interest: "all",
  depth: "quick",
  curationSignature: "open",
  curated: false,
  audio: false,
  setMode: (mode) => set({ mode }),
  setLanguage: (language) => set({ language }),
  setInterest: (interest) => set({ interest }),
  setDepth: (depth) => set({ depth }),
  setCurationSignature: (curationSignature) => set({ curationSignature }),
  setCurated: (curated) => set({ curated }),
  toggleAudio: () => set((state) => ({ audio: !state.audio }))
}));
