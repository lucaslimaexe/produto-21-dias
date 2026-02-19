"use client";

import React from "react";
import { cn } from "@/lib/utils";

const JOURNEY_PARTS = [
  { label: "Seu bloqueio", short: "1" },
  { label: "A solução", short: "2" },
  { label: "O método", short: "3" },
  { label: "Prova & garantia", short: "4" },
  { label: "Decisão", short: "5" },
] as const;

const SECTION_TO_PART: Record<string, number> = {
  "diagnostics-section": 0,
  "offer-start-section": 0,
  "testimonials-section": 0,
  "price-anchor-section": 1,
  "map-section": 1,
  "before-after-section": 1,
  "modules-section": 2,
  "who-its-for-section": 2,
  "vision-section": 3,
  "shield-section": 3,
  "moving-testimonials-section": 3,
  "final-touch-section": 4,
  "faq-section": 4,
  "decision-section": 4,
  "final-purchase-cta-section": 4,
};

interface JourneyProgressBarProps {
  currentSectionId: string | null;
  className?: string;
}

export function JourneyProgressBar({ currentSectionId, className }: JourneyProgressBarProps) {
  const partIndex = currentSectionId ? (SECTION_TO_PART[currentSectionId] ?? 0) : 0;
  const current = JOURNEY_PARTS[partIndex];

  return (
    <div
      className={cn(
        "flex items-center justify-center gap-2 sm:gap-4 py-1.5 px-2 text-xs sm:text-sm",
        className
      )}
      role="status"
      aria-label={`Parte ${partIndex + 1} de 5: ${current?.label}`}
    >
      <span className="text-muted-foreground/90 hidden sm:inline">Sua jornada:</span>
      <div className="flex items-center gap-1.5">
        {JOURNEY_PARTS.map((part, i) => (
          <span
            key={i}
            className={cn(
              "font-medium transition-colors",
              i === partIndex
                ? "text-accent"
                : i < partIndex
                  ? "text-green-400/80"
                  : "text-muted-foreground/60"
            )}
          >
            {part.short}
          </span>
        ))}
      </div>
      <span className="text-yellow-300/95 font-semibold max-w-[140px] sm:max-w-none truncate">
        Parte {partIndex + 1}: {current?.label}
      </span>
    </div>
  );
}
