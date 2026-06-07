"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, GitBranch } from "lucide-react";
import { useEffect } from "react";
import { type projects } from "@/data/portfolio";
import { ExperienceProvider } from "./experience-provider";
import { CinematicBackground } from "./cinematic-background";
import { ProcessArt } from "./visuals/process-art";
import { modes } from "@/data/portfolio";
import { useExperienceStore } from "@/store/experience-store";

type Project = (typeof projects)[number];

const stages = [
  { label: "01", title: "Problem", key: "problem" },
  { label: "02", title: "Research", key: "research" },
  { label: "03", title: "Structure", key: "structure" },
  { label: "04", title: "Interface", key: "interface" },
  { label: "05", title: "Prototype", key: "prototype" },
  { label: "06", title: "Outcome", key: "outcome" }
] as const;

export function ProjectCaseStudy({ project }: { project: Project }) {
  return (
    <ExperienceProvider>
      <CinematicBackground />
      <ProjectCaseStudyInner project={project} />
    </ExperienceProvider>
  );
}

function ProjectCaseStudyInner({ project }: { project: Project }) {
  const mode = useExperienceStore((state) => state.mode);
  const activeMode = modes[mode];
  const { scrollYProgress } = useScroll();
  const heroScale = useTransform(scrollYProgress, [0, 0.28], [1, 0.94]);
  const heroY = useTransform(scrollYProgress, [0, 0.28], [0, 80]);

  const copy = getProjectStageCopy(project);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [project.slug]);

  return (
    <main className="case-study relative z-10 min-h-screen">
        <nav className="fixed left-0 right-0 top-0 z-40 px-4 py-4 sm:px-6">
          <div className="mx-auto flex max-w-7xl items-center justify-between rounded-full border hairline bg-white/74 px-3 py-2 shadow-sm backdrop-blur-2xl">
            <Link className="inline-flex h-10 items-center gap-2 rounded-full px-3 text-sm font-black text-[var(--ink)] no-underline" href="/" scroll>
              <ArrowLeft size={17} /> <Image className="rounded-[0.75rem]" src="/brand-favicon.png" alt="Saathvik Visuals" width={34} height={34} />
            </Link>
            <div className="flex gap-2">
              <a className="inline-flex h-10 items-center gap-2 rounded-full bg-[var(--ink)] px-4 text-xs font-black text-white no-underline" href={project.url} target="_blank">
                Live <ArrowUpRight size={15} />
              </a>
              <a className="hidden h-10 items-center gap-2 rounded-full border hairline bg-white/70 px-4 text-xs font-black text-[var(--ink)] no-underline sm:inline-flex" href={project.github} target="_blank">
                Source <GitBranch size={15} />
              </a>
            </div>
          </div>
        </nav>

        <section className="relative mx-auto grid min-h-screen max-w-7xl content-center gap-10 px-5 pb-16 pt-28 sm:px-8 lg:grid-cols-[0.78fr_1.22fr]">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <p className="m-0 text-xs font-black uppercase tracking-[0.3em] text-[var(--accent)]">{project.type}</p>
            <h1 className="hero-title mode-font mt-4 text-6xl font-black leading-none sm:text-8xl">{project.name}</h1>
            <p className="mt-6 max-w-lg text-2xl font-black leading-9 text-slate-800">{project.tag}</p>
            <p className="signature-note mt-8 max-w-md text-4xl leading-none text-[var(--accent)]">Every detail should feel intentional before it feels beautiful.</p>
            <div className="mt-8 flex gap-2">
              {project.palette.map((color) => (
                <span key={color} className="h-10 w-10 rounded-full border border-black/10 shadow-sm" style={{ background: color }} />
              ))}
            </div>
          </motion.div>

          <motion.div className="relative min-h-[56vh] overflow-hidden rounded-[2.4rem] border hairline bg-slate-950 shadow-2xl" style={{ scale: heroScale, y: heroY }}>
            <Image src={project.image} alt={`${project.name} screenshot`} fill priority sizes="(min-width: 1024px) 62vw, 94vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/34 via-transparent to-white/10" />
          </motion.div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
          <div className="case-timeline grid gap-6">
            {stages.map((stage, index) => (
              <motion.article
                key={stage.key}
                className="case-step grid gap-5 rounded-[2rem] border hairline bg-white/66 p-4 shadow-[0_24px_90px_rgba(15,23,42,0.08)] backdrop-blur-2xl md:grid-cols-[180px_1fr_0.75fr] md:p-6"
                initial={{ opacity: 0, y: 34 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ delay: index * 0.04 }}
              >
                <div>
                  <span className="mode-font text-6xl font-black text-[var(--accent)]/25">{stage.label}</span>
                  <h2 className="mode-font m-0 mt-2 text-3xl font-black">{stage.title}</h2>
                </div>
                <div className="relative min-h-64 overflow-hidden rounded-[1.5rem] bg-slate-950">
                  <ProcessArt accent={activeMode.accent} variant={index} project={project.slug} palette={project.palette} />
                </div>
                <p className="m-0 self-center text-lg leading-8 text-slate-650">{copy[stage.key]}</p>
              </motion.article>
            ))}
          </div>
        </section>
    </main>
  );
}

function getProjectStageCopy(project: Project) {
  const custom: Record<string, Partial<Record<(typeof stages)[number]["key"], string>>> = {
    "linkedin-creator": {
      research: "Studied creator profiles, credibility signals, audience growth, and how opportunities should appear before a professional commits attention.",
      structure: "Built the story around reputation first, then creator proof, network strength, analytics, and opportunity discovery.",
      prototype: "The motion system behaves like a career dashboard: score changes, network paths, and content signals respond as one living interface."
    },
    "airbnb-nomad": {
      research: "Mapped remote-work fears: Wi-Fi reliability, neighborhood rhythm, stay length, local comfort, and the feeling of belonging before booking.",
      structure: "Turned booking into a journey from city mood to work confidence, home detail, lifestyle proof, and long-stay decision.",
      prototype: "Scroll movement follows a travel board: maps, cards, and stay details drift like a planning wall instead of a static listing."
    },
    "netflix-altitude": {
      research: "Explored how travel changes entertainment intent: route, language, flight mood, destination, and time remaining shape discovery.",
      structure: "Designed the experience like a boarding sequence: destination context, mood selection, route-aware titles, and watch continuity.",
      prototype: "Transitions borrow from title sequences and flight UI, making every content choice feel attached to the journey."
    },
    "spotify-drive": {
      research: "Mapped driving contexts: pace, weather, route length, stops, focus, and the emotional shift between city roads and open highways.",
      structure: "The flow starts with route mood, then generates soundtrack layers, weather-aware playlists, and safe glanceable controls.",
      prototype: "Interactions are built for motion: large controls, route pulses, playlist transitions, and low-distraction changes."
    },
    aryav: {
      research: "Studied luxury real-estate decision cues: material quality, privacy, scale, neighborhood confidence, and architectural storytelling.",
      structure: "The page unfolds like a property film: arrival, atmosphere, spaces, proof, enquiry, and a quiet close.",
      prototype: "Scroll pacing is cinematic, with restrained reveals that let the property feel expensive without overwhelming the buyer."
    },
    "aarna-salon": {
      research: "Mapped salon trust signals: artist confidence, bridal detail, hygiene, service packages, transformations, and booking comfort.",
      structure: "The experience moves from ritual mood to services, artists, gallery proof, packages, and booking intent.",
      prototype: "Motion stays soft and editorial: image reveals, service cards, and booking steps feel polished rather than loud."
    },
    jaabili: {
      research: "Explored destination planning as emotion first: landscape, culture, routes, travel effort, stay rhythm, and confidence to go.",
      structure: "The travel story moves through place, discovery, curated routes, gallery depth, planning, and journal-style memory.",
      prototype: "The interface behaves like a moving travel scrapbook with destination cards, route trails, and soft cinematic reveals."
    },
    naad: {
      research: "Balanced classical depth with beginner clarity: instruments, ragas, learning paths, heritage, purchase intent, and multilingual comfort.",
      structure: "The system begins with sound identity, then instrument discovery, raga education, cultural proof, and commerce.",
      prototype: "Visual rhythm follows music: waveforms, taal-like repetition, warm transitions, and focused product moments."
    },
    pawly: {
      research: "Mapped pet-care trust: product safety, nutrition guidance, quick shopping, care education, community warmth, and responsive purchase flow.",
      structure: "The journey blends shop, care guide, category confidence, community proof, cart flow, and repeat purchase logic.",
      prototype: "Interactions stay warm and useful: category taps, product guidance, cart motion, and mobile-first shopping behavior."
    }
  };

  return {
    problem: project.problem,
    research: custom[project.slug]?.research ?? "Mapped audience needs, decision moments, brand cues, and the points where trust is either built or lost.",
    structure: custom[project.slug]?.structure ?? "Reduced the idea into a clear journey: first impression, orientation, exploration, proof, and action.",
    interface: project.solution,
    prototype: custom[project.slug]?.prototype ?? "Motion, hover states, responsive behavior, and scroll rhythm were treated as part of the product language.",
    outcome: project.outcome
  };
}
