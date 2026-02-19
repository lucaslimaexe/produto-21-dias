"use client";

import React, { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const HOOK_TEXT =
  "Não é lei da atração! O sistema esconde isso de você. Qualquer desejo, qualquer objetivo passa a ser alcançável com essa simples mudança e ajuste.";

const famosos = [
  {
    id: "pabllo",
    nome: "Pabllo Vittar",
    foto: "https://placehold.co/400x600/1a1a2e/9b51e0?text=Pabllo+Vittar",
    frase: "Sempre busquei meus sonhos e briguei por eles. Eu sempre fui sonhador e determinado!",
  },
  {
    id: "ludmilla",
    nome: "Ludmilla",
    foto: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Brazilian_singer_Ludmilla.jpg",
    frase: "Depois que eu percebi a importância de ser empoderada, ninguém pode mais me parar.",
  },
  {
    id: "gloria",
    nome: "Gloria Groove",
    foto: "https://placehold.co/400x600/1a1a2e/d4af37?text=Gloria+Groove",
    frase: "Sinto-me a fazer o impossível e o improvável todos os dias.",
  },
  {
    id: "luciano",
    nome: "Luciano Huck",
    foto: "https://upload.wikimedia.org/wikipedia/commons/1/15/Luciano_Huck_in_April_2019.jpg",
    frase: "Para poder, basta querer. Não espere que alguém faça por você, arregace as mangas, pense positivo.",
  },
  {
    id: "preta",
    nome: "Preta Gil",
    foto: "https://placehold.co/400x600/1a1a2e/e91e63?text=Preta+Gil",
    frase: "Na minha vida, nada foi dado. O resto todo eu tive que correr atrás.",
  },
  {
    id: "whindersson",
    nome: "Whindersson Nunes",
    foto: "https://upload.wikimedia.org/wikipedia/commons/6/6c/Whindersson_Nunes_in_2017.jpg",
    frase: "Faça esse momento presente ser o melhor da sua vida.",
  },
  {
    id: "gil",
    nome: "Gil do Vigor",
    foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Gil_do_Vigor_-_Mesacast_BBB_2024.png/440px-Gil_do_Vigor_-_Mesacast_BBB_2024.png",
    frase: "Tudo que eu conquistei até hoje foi fruto da educação e de muito esforço. O conhecimento é a chave para tudo.",
  },
];

const slides = [
  { type: "hook" as const, content: HOOK_TEXT },
  ...famosos.map((f) => ({ type: "famoso" as const, content: f })),
];

interface RevelacaoCarouselScreenProps {
  onContinue: () => void;
}

export function RevelacaoCarouselScreen({ onContinue }: RevelacaoCarouselScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const goTo = useCallback((index: number) => {
    const next = Math.max(0, Math.min(index, slides.length - 1));
    setCurrentIndex(next);
    const width = scrollRef.current?.offsetWidth ?? (typeof window !== "undefined" ? window.innerWidth : 375);
    scrollRef.current?.scrollTo({ left: next * width, behavior: "smooth" });
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goTo(currentIndex + 1);
      else goTo(currentIndex - 1);
    } else {
      // Tap (sem arrastar) - avançar/voltar como no Instagram
      const x = touchEndX.current;
      const third = (typeof window !== "undefined" ? window.innerWidth : 375) / 3;
      if (x < third) goTo(currentIndex - 1);
      else if (x > 2 * third) goTo(currentIndex + 1);
    }
  };

  const handleTapToNavigate = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = scrollRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const third = rect.width / 3;
    if (x < third) goTo(currentIndex - 1);
    else if (x > 2 * third) goTo(currentIndex + 1);
  };

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const scrollLeft = scrollRef.current.scrollLeft;
    const width = scrollRef.current.offsetWidth;
    const index = Math.round(scrollLeft / width);
    setCurrentIndex(index);
  };

  return (
    <div className="min-h-screen flex flex-col bg-black">
      {/* Header - estilo Instagram */}
      <header className="sticky top-0 z-50 flex items-center justify-center h-14 border-b border-white/10 bg-black/95 backdrop-blur-md">
        <span className="font-headline font-semibold text-base text-white tracking-tight">
          diagnóstico.da.deusa
        </span>
      </header>

      {/* Carrossel Stories - toque na esquerda = voltar, direita = avançar (como Instagram) */}
      <div
        ref={scrollRef}
        className="flex-1 flex overflow-x-auto snap-x snap-mandatory overscroll-x-contain scrollbar-hide touch-pan-x cursor-default"
        style={{ WebkitOverflowScrolling: "touch" }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={handleTapToNavigate}
        onScroll={handleScroll}
      >
        {/* Slide 0 - Hook (estilo Story) */}
        <div className="flex-shrink-0 w-full min-h-[calc(100vh-14rem)] snap-center flex flex-col items-center justify-center px-6 bg-gradient-to-br from-purple-950 via-black to-rose-950">
          <div className="max-w-md text-center">
            <p className="text-white text-xl sm:text-2xl font-bold leading-relaxed">
              {HOOK_TEXT}
            </p>
            <p className="text-white/50 text-sm mt-6">
              toque na direita para avançar · na esquerda para voltar
            </p>
          </div>
        </div>

        {/* Slides - Famosos */}
        {famosos.map((pessoa) => (
          <div
            key={pessoa.id}
            className="flex-shrink-0 w-full min-h-[calc(100vh-14rem)] snap-center flex flex-col"
          >
            <div className="relative flex-1 aspect-[9/16] max-h-[70vh] mx-auto w-full max-w-[400px] rounded-2xl overflow-hidden">
              <Image
                src={pessoa.foto}
                alt={pessoa.nome}
                fill
                className="object-cover"
                sizes="(max-width: 400px) 100vw, 400px"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <p className="font-semibold text-lg mb-2">{pessoa.nome}</p>
                <p className="text-white/95 text-base leading-relaxed">
                  &ldquo;{pessoa.frase}&rdquo;
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dots + navegação */}
      <div className="flex items-center justify-center gap-2 py-4">
        <button
          type="button"
          onClick={() => goTo(currentIndex - 1)}
          disabled={currentIndex === 0}
          className="p-2 text-white/60 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Anterior"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="flex gap-1.5 mx-2">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              className={cn(
                "w-2 h-2 rounded-full transition-all",
                i === currentIndex ? "bg-white w-4" : "bg-white/40 hover:bg-white/60"
              )}
              aria-label={`Ir para slide ${i + 1}`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => goTo(currentIndex + 1)}
          disabled={currentIndex === slides.length - 1}
          className="p-2 text-white/60 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Próximo"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* CTA */}
      <div className="p-4 pb-8">
        <Button
          onClick={onContinue}
          className={cn(
            "w-full max-w-md mx-auto goddess-gradient text-white font-semibold rounded-xl h-12 flex items-center justify-center gap-2"
          )}
        >
          <Sparkles className="w-5 h-5" strokeWidth={2} />
          <span>Descobrir meu bloqueio</span>
        </Button>
      </div>
    </div>
  );
}
