"use client";

import { useState } from "react";
import Image from "next/image";
import { useReducedMotion } from "framer-motion";

type ProjectMediaProps = {
  slug: string;
  image: string;
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
  loading?: "eager" | "lazy";
};

/**
 * Renders the project's recorded live-product walkthrough video when one exists
 * at /project-videos/<slug>.webm, falling back to the static screenshot otherwise
 * (also falls back on video load error, e.g. for projects not yet recorded).
 */
export function ProjectMedia({ slug, image, alt, sizes, className, priority, loading }: ProjectMediaProps) {
  const [videoFailed, setVideoFailed] = useState(false);
  const reduceMotion = useReducedMotion();

  if (!videoFailed && !reduceMotion) {
    return (
      <video
        className={`absolute inset-0 h-full w-full object-cover ${className ?? ""}`}
        src={`/project-videos/${slug}.webm`}
        poster={image}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        onError={() => setVideoFailed(true)}
        aria-label={alt}
      />
    );
  }

  return (
    <Image
      src={image}
      alt={alt}
      fill
      sizes={sizes}
      className={`object-cover ${className ?? ""}`}
      priority={priority}
      loading={priority ? undefined : loading}
    />
  );
}
