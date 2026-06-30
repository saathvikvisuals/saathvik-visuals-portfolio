import type { ComponentType } from "react";
import type { StoryLayout } from "@/data/portfolio";
import { CinematicStage } from "./cinematic-stage";
import { DashboardStage } from "./dashboard-stage";
import { EditorialStage } from "./editorial-stage";
import { JourneyStage } from "./journey-stage";
import type { StageProps } from "./types";

const layoutComponents: Record<StoryLayout, ComponentType<StageProps>> = {
  cinematic: CinematicStage,
  dashboard: DashboardStage,
  editorial: EditorialStage,
  journey: JourneyStage,
};

export function getStageLayout(layout: StoryLayout | undefined) {
  return layoutComponents[layout ?? "dashboard"];
}

export type { StageProps } from "./types";
