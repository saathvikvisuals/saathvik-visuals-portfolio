import type { Project, StoryStage } from "@/data/portfolio";

export type StageProps = {
  stage: StoryStage;
  index: number;
  project: Project;
  accent: string;
  /** 0 for the first video-marked stage in a project, 0.5 for the second, etc. — keeps repeat video stages from showing an identical opening frame. */
  seekRatio: number;
};
