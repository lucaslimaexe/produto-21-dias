"use client";

import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGamification } from "@/components/gamification";

interface WelcomeScreenProps {
  onStart: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [energyProgress, setEnergyProgress] = useState(0);
  const g = useGamification();
  const fullText =
    "por que virginia, luiza sonza, anitta, iza... parecem ter um ímã para dinheiro?";

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index < fullText.length) {
        setDisplayedText(fullText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 45);
    return () => clearInterval(timer);
  }, [fullText]);

  useEffect(() => {
    if (energyProgress >= 100) return;
    const step = 100 / 30;
    const id = setInterval(() => {
      setEnergyProgress((p) => Math.min(100, p + step));
    }, 100);
    return () => clearInterval(id);
  }, [energyProgress]);

  const handleStartClick = () => {
    g?.completeWelcomeEnergy();
    onStart();
  };

  const isEnergyReady = energyProgress >= 100;

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a]">
      {/* Top bar - estilo Instagram */}
      <header className="sticky top-0 z-50 flex items-center justify-center h-14 px-4 border-b border-white/10 bg-[#0a0a0a]/95 backdrop-blur-md">
        <h1 className="font-headline font-semibold text-base text-white tracking-tight">
          diagnóstico.da.deusa
        </h1>
      </header>

      {/* Conteúdo - coluna central como IG */}
      <main className="flex-1 flex flex-col max-w-[470px] mx-auto w-full px-4 pt-8 pb-28">
        {/* Barra de progresso tipo Story (no topo do conteúdo) */}
        <div className="flex gap-1 mb-8">
          <div className="flex-1 h-0.5 rounded-full bg-white/20 overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-300 ease-out"
              style={{ width: `${energyProgress}%` }}
            />
          </div>
          <div className="flex-1 h-0.5 rounded-full bg-white/20" />
          <div className="flex-1 h-0.5 rounded-full bg-white/20" />
        </div>

        {/* Copy principal - estilo caption */}
        <div className="flex-1 flex flex-col justify-center">
          <p
            className={cn(
              "text-xl sm:text-2xl md:text-3xl leading-relaxed mb-6",
              "text-white font-medium"
            )}
          >
            você já se perguntou
          </p>
          <h1
            className={cn(
              "font-headline font-bold text-2xl sm:text-3xl md:text-4xl leading-[1.25] mb-8",
              "text-white"
            )}
          >
            <span className="text-white">{displayedText}</span>
            <span className="animate-pulse">|</span>
          </h1>
          <p
            className="text-gray-400 text-base sm:text-lg leading-relaxed mb-2 animate-fade-in"
            style={{ animationDelay: "2s", animationFillMode: "forwards", opacity: 0 }}
          >
            enquanto você luta, elas atraem.
          </p>
          <p
            className="text-gray-400 text-base sm:text-lg leading-relaxed mb-8 animate-fade-in"
            style={{ animationDelay: "2.2s", animationFillMode: "forwards", opacity: 0 }}
          >
            amor, dinheiro, oportunidades.
          </p>
          <p
            className="text-gray-500 text-sm animate-fade-in"
            style={{ animationDelay: "2.4s", animationFillMode: "forwards", opacity: 0 }}
          >
            {isEnergyReady
              ? "pronta para descobrir?"
              : "calibrando seu campo..."}
          </p>
        </div>
      </main>

      {/* CTA fixo - sempre visível (safe-area para iPhone) */}
      <div className="fixed bottom-0 left-0 right-0 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-8 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/98 to-transparent z-40">
        <div className="max-w-[470px] mx-auto">
          <Button
            onClick={handleStartClick}
            disabled={!isEnergyReady}
            aria-label={
              isEnergyReady
                ? "Revelar meus bloqueios ocultos"
                : "Aguarde o campo energético calibrar"
            }
            className={cn(
              "w-full goddess-gradient text-white font-semibold rounded-xl",
              "h-12 text-base",
              "flex items-center justify-center gap-2 transition-opacity",
              !isEnergyReady && "opacity-60 cursor-not-allowed"
            )}
          >
            <Sparkles className="w-5 h-5" strokeWidth={2} />
            <span>revelar meus bloqueios ocultos</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
