"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ModuleItem {
  id: string;
  name: string;
  promise: string;
  value: number;
  icon: React.ComponentType<{ className?: string; "data-ai-hint"?: string }>;
  dataAiHint: string;
}

interface ModuleCarouselProps {
  modules: ModuleItem[];
  className?: string;
}

export function ModuleCarousel({ modules, className }: ModuleCarouselProps) {
  const [index, setIndex] = useState(0);
  const current = modules[index];
  const Icon = current?.icon;

  if (!current || !Icon) return null;

  const go = (delta: number) => {
    setIndex((i) => {
      const next = i + delta;
      if (next < 0) return modules.length - 1;
      if (next >= modules.length) return 0;
      return next;
    });
  };

  return (
    <div className={cn("space-y-6", className)}>
      <div className="relative max-w-lg mx-auto">
        <Card className="bg-white/5 border-white/10 p-6 rounded-2xl">
          <CardHeader className="flex flex-row items-center gap-3 p-0 pb-4">
            <Icon data-ai-hint={current.dataAiHint} className="h-10 w-10 text-green-400 shrink-0" />
            <div>
              <CardTitle className="text-base text-white font-medium mb-0.5">{current.name}</CardTitle>
              <p className="text-xs text-white/50">
                Valor real: <span className="line-through">R${current.value.toFixed(2).replace(".", ",")}</span>
              </p>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <p className="text-sm text-white/70 leading-relaxed">{current.promise}</p>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between mt-4 px-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => go(-1)}
            className="text-green-400 hover:bg-white/10 rounded-full h-10 w-10"
            aria-label="Módulo anterior"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <span className="text-sm text-white/50">
            {index + 1} / {modules.length}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => go(1)}
            className="text-green-400 hover:bg-white/10 rounded-full h-10 w-10"
            aria-label="Próximo módulo"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
      </div>

      <div className="flex justify-center gap-1.5">
        {modules.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setIndex(i)}
            className={cn(
              "h-2 rounded-full transition-all w-2 sm:w-3",
              i === index ? "bg-accent w-4 sm:w-6" : "bg-purple-600/50 hover:bg-purple-500/70"
            )}
            aria-label={`Ir para módulo ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
