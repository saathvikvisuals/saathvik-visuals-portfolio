import type { ModeKey } from "@/data/portfolio";
import type { InterestKey } from "@/store/experience-store";

export type DepthKey = "quick" | "case" | "gallery" | "hire";
export type AnswerKey = "visitor" | "goal" | "mood" | "depth";

export type CurationChoice = {
  id: string;
  label: string;
  line: string;
  mode?: ModeKey;
  interest?: InterestKey;
  depth?: DepthKey;
};

export type CurationResult = {
  mode: ModeKey;
  interest: InterestKey;
  depth: DepthKey;
  room: string;
  signature: string;
};

export const curationQuestions: { key: AnswerKey; eyebrow: string; title: string; choices: CurationChoice[] }[] = [
  {
    key: "visitor",
    eyebrow: "01 / Start with",
    title: "What would you like to explore first?",
    choices: [
      { id: "founder", label: "Business clarity", line: "Show proof, decisions, and value first.", mode: "founder", interest: "founders" },
      { id: "designer", label: "Visual craft", line: "Show systems, motion, and interface taste.", mode: "creative", interest: "visual" },
      { id: "commerce", label: "Service flow", line: "Show booking, selling, and trust-building UX.", mode: "minimal", interest: "commerce" },
      { id: "culture", label: "Story worlds", line: "Show emotion, identity, travel, and sound.", mode: "future", interest: "culture" }
    ]
  },
  {
    key: "goal",
    eyebrow: "02 / Priority",
    title: "What should the experience prioritize?",
    choices: [
      { id: "proof", label: "Confidence", line: "Problem, thinking, outcome, and decision value.", mode: "founder", interest: "founders" },
      { id: "motion", label: "Atmosphere", line: "Cinematic screens, visual rhythm, and motion.", mode: "creative", interest: "visual" },
      { id: "flow", label: "Action", line: "Commerce, services, booking, and mobile UX.", mode: "minimal", interest: "commerce" },
      { id: "story", label: "Memory", line: "Culture, editorial rhythm, and memorable journeys.", mode: "future", interest: "culture" }
    ]
  },
  {
    key: "mood",
    eyebrow: "03 / Mood",
    title: "Which viewing style feels right today?",
    choices: [
      { id: "focused", label: "Focused", line: "Quiet, sharp, business-readable.", mode: "founder" },
      { id: "cinematic", label: "Cinematic", line: "Premium motion and visual atmosphere.", mode: "creative" },
      { id: "minimal", label: "Minimal", line: "Editorial, light, spacious, direct.", mode: "minimal" },
      { id: "future", label: "Future", line: "Product launch energy and depth.", mode: "future" }
    ]
  },
  {
    key: "depth",
    eyebrow: "04 / Detail",
    title: "How much depth should I open with?",
    choices: [
      { id: "short", label: "Quick scan", line: "Keep it light and lead with the strongest work.", depth: "quick" },
      { id: "case", label: "Case-study path", line: "Guide me toward process and project stories.", depth: "case" },
      { id: "visual", label: "Visual gallery", line: "Prioritize screenshots, motion, and atmosphere.", interest: "visual", depth: "gallery" },
      { id: "contact", label: "Hire-ready", line: "Keep trust signals and contact easy to reach.", interest: "founders", depth: "hire" }
    ]
  }
];

export function deriveCurationResult(answers: Partial<Record<AnswerKey, CurationChoice>>): CurationResult {
  const choices = Object.values(answers);
  const interests: InterestKey[] = ["founders", "visual", "commerce", "culture"];
  const modes: ModeKey[] = ["founder", "creative", "minimal", "future"];
  const depths: DepthKey[] = ["quick", "case", "gallery", "hire"];
  const interest = highestScore(interests, choices.map((choice) => choice?.interest).filter(Boolean) as InterestKey[]) ?? "visual";
  const mode = highestScore(modes, choices.map((choice) => choice?.mode).filter(Boolean) as ModeKey[]) ?? modeForInterest(interest);
  const depth = highestScore(depths, choices.map((choice) => choice?.depth).filter(Boolean) as DepthKey[]) ?? "quick";
  const signature = curationQuestions.map((question) => answers[question.key]?.id ?? "open").join(":");
  return { interest, mode, depth, room: roomForInterest(interest, depth), signature };
}

export function roomForInterest(interest: InterestKey, depth: DepthKey = "quick") {
  const suffix = depth === "case" ? " Casebook" : depth === "gallery" ? " Gallery" : depth === "hire" ? " Studio" : " Room";
  if (interest === "founders") return `Proof${suffix}`;
  if (interest === "commerce") return `Flow${suffix}`;
  if (interest === "culture") return `Story${suffix}`;
  return `Motion${suffix}`;
}

function highestScore<T extends string>(items: T[], selected: T[]) {
  return items
    .map((item, index) => ({ item, index, score: selected.filter((value) => value === item).length }))
    .sort((a, b) => b.score - a.score || a.index - b.index)[0]?.item;
}

function modeForInterest(interest: InterestKey): ModeKey {
  if (interest === "founders") return "founder";
  if (interest === "commerce") return "minimal";
  if (interest === "culture") return "future";
  return "creative";
}
