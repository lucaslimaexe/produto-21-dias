"use client";

import React from "react";
import Image from "next/image";
import { Button } from "./ui/button";
import { Heart, MessageCircle, Send, MoreHorizontal, Sparkles, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const artistas = [
  {
    nome: "anitta",
    foto: "https://upload.wikimedia.org/wikipedia/commons/d/d6/Anitta_september_2023.jpg",
    frases: [
      "Entrei numa frequência tão legal que atraí uma pessoa que me apoia.",
      "Totalmente de formiguinha. Trabalhamos anos e anos para que aos poucos as coisas fossem acontecendo.",
    ],
  },
  {
    nome: "virginia",
    foto: "https://upload.wikimedia.org/wikipedia/commons/8/85/Virginia_Fonseca_2020.png",
    frases: [
      "O sucesso vem para quem faz o que precisa ser feito.",
      "Criei conteúdos autênticos, me expus de forma transparente e sempre fui eu mesma. Acredito que esse foi o segredo para as pessoas se conectarem comigo.",
    ],
  },
  {
    nome: "luizasonza",
    foto: "https://upload.wikimedia.org/wikipedia/commons/f/fc/Lu%C3%ADsa_Sonza_in_September_2022_%284%29.png",
    frases: [
      "É uma meta e venho buscando isso.",
      "O desafio é não desistir, porque há muita coisa no caminho.",
    ],
  },
  {
    nome: "iza",
    foto: "https://upload.wikimedia.org/wikipedia/commons/6/61/IZA_em_2019.jpg",
    frases: [
      "A música foi o meu talismã. Consegui realizar vários sonhos.",
      "Eu realizo sonhos que eu nem tinha coragem de sonhar.",
    ],
  },
] as const;

const nomesExibicao: Record<string, string> = {
  anitta: "Anitta",
  virginia: "Virginia Fonseca",
  luizasonza: "Luiza Sonza",
  iza: "IZA",
};

interface InspiracaoScreenProps {
  onContinue: () => void;
}

export function InspiracaoScreen({ onContinue }: InspiracaoScreenProps) {
  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a]">
      {/* Top bar - estilo Instagram */}
      <header className="sticky top-0 z-50 flex items-center justify-center h-14 px-4 border-b border-white/10 bg-[#0a0a0a]/95 backdrop-blur-md">
        <h1 className="font-headline font-semibold text-base text-white tracking-tight">
          diagnóstico.da.deusa
        </h1>
      </header>

      <main className="flex-1 pb-8">
        {/* Feed - coluna central como Instagram */}
        <section className="max-w-[470px] mx-auto">
          {/* Stories strip simulado - preview das artistas */}
          <div className="flex gap-4 px-4 py-4 overflow-x-auto scrollbar-hide border-b border-white/5">
            {artistas.map((artista, idx) => (
              <div
                key={artista.nome}
                className="flex-shrink-0 flex flex-col items-center gap-2 animate-fade-in"
                style={{ animationDelay: `${idx * 0.05}s`, animationFillMode: "forwards", opacity: 0 }}
              >
                <div className="relative w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-purple-500 via-pink-500 to-amber-500">
                  <div className="w-full h-full rounded-full overflow-hidden bg-[#0a0a0a]">
                    <Image
                      src={artista.foto}
                      alt={nomesExibicao[artista.nome]}
                      width={60}
                      height={60}
                      className="w-full h-full rounded-full object-cover"
                      unoptimized
                    />
                  </div>
                </div>
                <span className="text-[11px] text-gray-400 max-w-[72px] truncate">
                  {nomesExibicao[artista.nome].toLowerCase()}
                </span>
              </div>
            ))}
          </div>

          {/* Posts do feed */}
          <div className="divide-y divide-white/5">
            {artistas.map((artista, idx) => (
              <article
                key={artista.nome}
                className="animate-fade-in"
                style={{ animationDelay: `${idx * 0.08}s`, animationFillMode: "forwards", opacity: 0 }}
              >
                {/* Post header - avatar + nome + menu */}
                <div className="flex items-center gap-3 px-4 py-3">
                  <div className="relative w-8 h-8 rounded-full overflow-hidden ring-1 ring-white/10 flex-shrink-0">
                    <Image
                      src={artista.foto}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="32px"
                      unoptimized
                    />
                  </div>
                  <span className="flex-1 font-semibold text-sm text-white">
                    {nomesExibicao[artista.nome].toLowerCase()}
                  </span>
                  <button
                    type="button"
                    className="p-1 text-white/80 hover:text-white transition-colors"
                    aria-label="Mais opções"
                  >
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>

                {/* Imagem do post - proporção 1:1 como IG */}
                <div className="relative aspect-square w-full bg-black">
                  <Image
                    src={artista.foto}
                    alt={nomesExibicao[artista.nome]}
                    fill
                    className="object-cover"
                    sizes="(max-width: 470px) 100vw, 470px"
                    unoptimized
                    priority={idx === 0}
                  />
                </div>

                {/* Ações - coração, comentário, enviar */}
                <div className="flex items-center gap-4 px-4 py-2">
                  <button type="button" className="p-1.5 text-white hover:opacity-80 transition-opacity" aria-label="Curtir">
                    <Heart className="w-6 h-6" strokeWidth={1.5} />
                  </button>
                  <button type="button" className="p-1.5 text-white hover:opacity-80 transition-opacity" aria-label="Comentar">
                    <MessageCircle className="w-6 h-6" strokeWidth={1.5} />
                  </button>
                  <button type="button" className="p-1.5 text-white hover:opacity-80 transition-opacity" aria-label="Enviar">
                    <Send className="w-5 h-5" strokeWidth={1.5} />
                  </button>
                </div>

                {/* Caption - como no Instagram */}
                <div className="px-4 pb-4">
                  <p className="text-sm text-white leading-relaxed">
                    <span className="font-semibold mr-1">{nomesExibicao[artista.nome].toLowerCase()}</span>
                    {artista.frases.map((f, i) => (
                      <span key={i}>
                        {f}
                        {i < artista.frases.length - 1 ? " " : ""}
                      </span>
                    ))}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* CTA fixo no rodapé - sempre visível (safe-area para iPhone) */}
        <div className="fixed bottom-0 left-0 right-0 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-8 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/98 to-transparent z-40">
          <div className="max-w-[470px] mx-auto">
            <Button
              onClick={onContinue}
              aria-label="Descobrir meu bloqueio"
              className={cn(
                "w-full goddess-gradient text-white font-semibold rounded-xl",
                "h-12 text-base",
                "flex items-center justify-center gap-2"
              )}
            >
              <Sparkles className="w-5 h-5" strokeWidth={2} />
              <span>Descobrir meu bloqueio</span>
              <ArrowRight className="w-5 h-5" strokeWidth={2} />
            </Button>
          </div>
        </div>

        {/* Espaço para o CTA fixo (safe-area no iPhone) */}
        <div className="h-24 min-h-[calc(env(safe-area-inset-bottom)+4rem)]" aria-hidden />
      </main>
    </div>
  );
}
