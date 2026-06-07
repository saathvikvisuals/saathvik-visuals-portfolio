"use client";

import Lenis from "lenis";
import { Howl } from "howler";
import { useEffect, useMemo, useRef } from "react";
import { modes } from "@/data/portfolio";
import { useExperienceStore } from "@/store/experience-store";

export function ExperienceProvider({ children }: { children: React.ReactNode }) {
  const mode = useExperienceStore((state) => state.mode);
  const language = useExperienceStore((state) => state.language);
  const audio = useExperienceStore((state) => state.audio);
  const shellRef = useRef<HTMLDivElement>(null);

  const clickSound = useMemo(
    () =>
      new Howl({
        src: [
          "data:audio/wav;base64,UklGRjQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YRAAAACAgICAgICAgJCQkJiYmKCgoA=="
        ],
        volume: 0.12
      }),
    []
  );

  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.88 });
    let rafId = 0;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const active = modes[mode];
    root.style.setProperty("--paper", active.paper);
    root.style.setProperty("--ink", active.ink);
    root.style.setProperty("--accent", active.accent);
    root.style.setProperty("--glow", active.glow);
    root.style.setProperty("--mode-font", active.font);
    ensureBrandFavicon();
    if (audio) clickSound.play();
  }, [audio, clickSound, mode]);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  }, [language]);

  useEffect(() => {
    function move(event: PointerEvent) {
      shellRef.current?.style.setProperty("--cursor-x", `${event.clientX}px`);
      shellRef.current?.style.setProperty("--cursor-y", `${event.clientY}px`);
    }
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, []);

  return (
    <div ref={shellRef} className="experience-shell grain" data-mode={mode} suppressHydrationWarning>
      {children}
    </div>
  );
}

function ensureBrandFavicon() {
  let link = document.querySelector<HTMLLinkElement>("link[rel='icon']");
  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    document.head.appendChild(link);
  }
  link.href = "/brand-favicon.png";
}
