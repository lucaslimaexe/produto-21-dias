"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TestimonialItem {
  id: number;
  name: string;
  age: number;
  quote: string;
  stars: number;
  image: string;
  dataAiHint: string;
}

interface TestimonialVSLSliderProps {
  testimonials: TestimonialItem[];
  className?: string;
}

export function TestimonialVSLSlider({ testimonials, className }: TestimonialVSLSliderProps) {
  const [index, setIndex] = useState(0);
  const t = testimonials[index];

  if (!t) return null;

  const go = (delta: number) => {
    setIndex((i) => {
      const next = i + delta;
      if (next < 0) return testimonials.length - 1;
      if (next >= testimonials.length) return 0;
      return next;
    });
  };

  return (
    <div className={cn("space-y-6", className)}>
      <Card className="bg-white/5 border-white/10 max-w-md mx-auto p-6 text-center rounded-2xl">
        <Image
          data-ai-hint={t.dataAiHint}
          src={t.image}
          alt={t.name}
          width={64}
          height={64}
          className="rounded-full border-2 border-white/20 mx-auto mb-3 object-cover"
        />
        <CardTitle className="text-base text-white font-medium">
          {t.name}, {t.age} anos
        </CardTitle>
        <div className="flex justify-center my-2">
          {Array(t.stars)
            .fill(0)
            .map((_, i) => (
              <Star key={i} className="h-4 w-4 text-green-400 fill-green-400" />
            ))}
        </div>
        <CardContent className="p-0 mt-2">
          <p className="text-white/80 text-sm leading-relaxed">"{t.quote}"</p>
        </CardContent>
      </Card>

      <div className="flex items-center justify-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => go(-1)}
          className="text-green-400 hover:bg-white/10 rounded-full h-10 w-10"
          aria-label="Depoimento anterior"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <span className="text-sm text-white/50 tabular-nums">
          {index + 1} / {testimonials.length}
        </span>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => go(1)}
          className="text-green-400 hover:bg-white/10 rounded-full h-10 w-10"
          aria-label="Próximo depoimento"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      <div className="flex justify-center gap-1.5">
        {testimonials.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setIndex(i)}
            className={cn(
              "h-2 rounded-full transition-all w-2 sm:w-3",
              i === index ? "bg-green-400 w-4 sm:w-6" : "bg-white/30 hover:bg-white/50"
            )}
            aria-label={`Depoimento ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
