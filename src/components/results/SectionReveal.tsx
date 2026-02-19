"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface SectionRevealProps {
  children: React.ReactNode;
  className?: string;
  /** Delay in ms before revealing (stagger effect) */
  delay?: number;
  /** 'fade' | 'slide-up' | 'slide-in' */
  mode?: "fade" | "slide-up" | "slide-in";
}

export function SectionReveal({
  children,
  className,
  delay = 0,
  mode = "slide-up",
}: SectionRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [delayed, setDelayed] = useState(delay === 0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setVisible(true);
        });
      },
      { rootMargin: "0px 0px -80px 0px", threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || delay === 0) {
      if (visible) setDelayed(true);
      return;
    }
    const t = setTimeout(() => setDelayed(true), delay);
    return () => clearTimeout(t);
  }, [visible, delay]);

  const show = visible && delayed;

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-700 ease-out",
        !show && "opacity-0 translate-y-6",
        show && mode === "fade" && "opacity-100",
        show && mode === "slide-up" && "opacity-100 translate-y-0",
        show && mode === "slide-in" && "opacity-100 translate-x-0",
        !show && mode === "slide-in" && "translate-x-8",
        className
      )}
    >
      {children}
    </div>
  );
}
