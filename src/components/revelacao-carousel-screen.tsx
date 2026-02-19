"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { FIREBASE_STORAGE_VIDEOS } from "@/config/firebase-storage-videos";

const HOOK_TEXT =
  "Não é lei da atração! O sistema esconde isso de você. Qualquer desejo, qualquer objetivo passa a ser alcançável com essa simples mudança e ajuste.";

const famosos = [
  {
    id: "pabllo",
    nome: "Pabllo Vittar",
    foto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=600&fit=crop&q=80",
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
    foto: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=600&fit=crop&q=80",
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
    foto: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=600&fit=crop&q=80",
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

const videoSlides = FIREBASE_STORAGE_VIDEOS.map((v) => ({
  type: "video" as const,
  content: v,
}));

const slides = [
  ...videoSlides,
  { type: "hook" as const, content: HOOK_TEXT },
  ...famosos.map((f) => ({ type: "famoso" as const, content: f })),
];

/** Slide de vídeo: reproduz quando é o slide ativo, pausa ao sair */
function VideoSlide({
  url,
  title,
  isActive,
}: {
  url: string;
  title?: string;
  isActive: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isActive) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [isActive]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-black rounded-2xl overflow-hidden">
      <video
        ref={videoRef}
        src={url}
        className="w-full h-full max-h-[70vh] object-contain"
        playsInline
        muted={false}
        loop
        controls
      />
      {title && (
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
          <p className="text-white text-sm font-medium">{title}</p>
        </div>
      )}
    </div>
  );
}

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
        className="flex-1 flex overflow-x-auto snap-x snap-mandatory overscroll-x-contain scrollbar-hide touch-pan-x cursor-default min-h-0"
        style={{ WebkitOverflowScrolling: "touch" }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={handleTapToNavigate}
        onScroll={handleScroll}
      >
        {slides.map((slide, i) => (
          <div
            key={i}
            className="flex-shrink-0 w-full min-h-[calc(100vh-12rem)] sm:min-h-[calc(100vh-14rem)] snap-center flex flex-col items-center justify-center px-4"
          >
            {slide.type === "video" && (
              <div className="w-full max-w-[400px] mx-auto min-h-[50vh] flex flex-col justify-center">
                <VideoSlide
                  url={slide.content.url}
                  title={slide.content.title}
                  isActive={currentIndex === i}
                />
              </div>
            )}
            {slide.type === "hook" && (
              <div className="max-w-md text-center px-6 bg-gradient-to-br from-purple-950 via-black to-rose-950 rounded-2xl py-8">
                <p className="text-white text-xl sm:text-2xl font-bold leading-relaxed">
                  {slide.content}
                </p>
                <p className="text-white/50 text-sm mt-6">
                  toque na direita para avançar · na esquerda para voltar
                </p>
              </div>
            )}
            {slide.type === "famoso" && (
              <div className="relative flex-1 aspect-[9/16] max-h-[70vh] mx-auto w-full max-w-[400px] rounded-2xl overflow-hidden">
                <Image
                  src={slide.content.foto}
                  alt={slide.content.nome}
                  fill
                  className="object-cover"
                  sizes="(max-width: 400px) 100vw, 400px"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <p className="font-semibold text-lg mb-2">{slide.content.nome}</p>
                  <p className="text-white/95 text-base leading-relaxed">
                    &ldquo;{slide.content.frase}&rdquo;
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Dots + navegação - compacto no mobile */}
      <div className="flex items-center justify-center gap-2 py-2 shrink-0">
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

      {/* CTA fixo - sempre visível sem rolagem (safe-area para iPhone) */}
      <div className="sticky bottom-0 left-0 right-0 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-2 bg-gradient-to-t from-black via-black/98 to-transparent shrink-0">
        <div className="max-w-[470px] mx-auto">
          <Button
            onClick={onContinue}
            className={cn(
              "w-full goddess-gradient text-white font-semibold rounded-xl h-12 flex items-center justify-center gap-2"
            )}
          >
            <Sparkles className="w-5 h-5" strokeWidth={2} />
            <span>Descobrir meu bloqueio</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
