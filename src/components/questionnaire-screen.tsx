"use client";

import React, { useState, useEffect, useRef } from "react";
import { MessageCircle, Heart, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface QuestionOption {
  text: string;
  score: number;
}

export interface Question {
  id: number;
  question: string;
  options: QuestionOption[];
  feedback: string;
}

interface QuestionnaireScreenProps {
  question: Question;
  onAnswer: (answerText: string) => void;
  progress: number;
  isLastQuestion: boolean;
  onComplete: (elapsedSeconds?: number) => void;
  currentAnswer?: string;
  userName?: string;
}

export const questions: Question[] = [
  {
    id: 1,
    question: "{userName}, olha pra sua vida agora. O que você sente de VERDADE?",
    options: [
      { text: "Esperança que morre em 5 minutos e vira dúvida.", score: 3 },
      { text: "Raiva. Já tentei de TUDO e nada funciona.", score: 4 },
      { text: "Inveja. Vejo outras mulheres tendo o que eu mereço.", score: 5 },
      { text: "Exaustão. Cansei de lutar pra nada.", score: 5 },
    ],
    feedback: "SUA DOR É REAL. E ELA TEM UMA CAUSA EXATA.",
  },
  {
    id: 2,
    question: "{userName}, você faz afirmação, visualiza, medita... e o resultado?",
    options: [
      { text: "Nada muda. Zero. Como se eu nem existisse pro universo.", score: 4 },
      { text: "Funciona 10 minutos. Depois a realidade me esmaga.", score: 3 },
      { text: "Piora. Parece que quanto mais eu tento, mais afundo.", score: 5 },
      { text: "Nem consigo manter a rotina. A vida me engole.", score: 2 },
    ],
    feedback: "EXATAMENTE. O PROBLEMA NÃO É VOCÊ. É O MÉTODO.",
  },
  {
    id: 3,
    question: "{userName}, você sente que algo INVISÍVEL te bloqueia?",
    options: [
      { text: "Sim. Uma parede que eu não consigo quebrar.", score: 5 },
      { text: "Quando estou quase lá, algo me PUXA DE VOLTA.", score: 4 },
      { text: "Não sei. Só sei que não tenho a mesma sorte.", score: 3 },
      { text: "Sim. E desconfio que ninguém ensina o método REAL.", score: 2 },
    ],
    feedback: "ACHEI. O BLOQUEIO ESTÁ NA SUA IDENTIDADE. NÃO NOS SEUS HÁBITOS.",
  },
  {
    id: 4,
    question: "Responde sem pensar, {userName}: você se acha MERECEDORA?",
    options: [
      { text: "Não. Uma parte de mim sabe que não vai acontecer.", score: 5 },
      { text: "Tento acreditar. Mas a dúvida SEMPRE vence.", score: 4 },
      { text: "Mereço sim. Mas não sou capaz.", score: 3 },
      { text: "Mereço. O mundo que é injusto.", score: 2 },
    ],
    feedback: "AÍ ESTÁ. ESSA RESPOSTA É O CÓDIGO DO SEU BLOQUEIO.",
  },
  {
    id: 5,
    question: "{userName}, se existir um método de 21 dias que DETONA esse bloqueio... você usa?",
    options: [
      { text: "SIM. Estou desesperada por algo REAL.", score: 1 },
      { text: "Tenho medo de me frustrar de novo...", score: 3 },
      { text: "Já gastei tanto dinheiro com mentira...", score: 4 },
      { text: "CORAGEM EU TENHO. ME MOSTRA QUE FUNCIONA.", score: 2 },
    ],
    feedback: "SUA RESPOSTA ACABOU DE REVELAR TUDO. PREPARE-SE.",
  },
];

type TransitionState = "entering" | "idle" | "feedback" | "exiting";

export const QuestionnaireScreen: React.FC<QuestionnaireScreenProps> = ({
  question,
  onAnswer,
  progress,
  isLastQuestion,
  onComplete,
  currentAnswer,
  userName,
}) => {
  const [selectedOptionText, setSelectedOptionText] = useState<string | null>(null);
  const [transitionState, setTransitionState] = useState<TransitionState>("entering");
  const [elapsedTime, setElapsedTime] = useState(0);

  const enterTimeoutIdRef = useRef<NodeJS.Timeout | null>(null);
  const feedbackTimeoutIdRef = useRef<NodeJS.Timeout | null>(null);
  const exitTimeoutIdRef = useRef<NodeJS.Timeout | null>(null);
  const elapsedTimeRef = useRef(0);
  elapsedTimeRef.current = elapsedTime;

  useEffect(() => {
    const intervalId = setInterval(() => setElapsedTime((t) => t + 1), 1000);
    return () => {
      clearInterval(intervalId);
      if (enterTimeoutIdRef.current) clearTimeout(enterTimeoutIdRef.current);
      if (feedbackTimeoutIdRef.current) clearTimeout(feedbackTimeoutIdRef.current);
      if (exitTimeoutIdRef.current) clearTimeout(exitTimeoutIdRef.current);
    };
  }, []);

  useEffect(() => {
    if (enterTimeoutIdRef.current) clearTimeout(enterTimeoutIdRef.current);
    if (feedbackTimeoutIdRef.current) clearTimeout(feedbackTimeoutIdRef.current);
    if (exitTimeoutIdRef.current) clearTimeout(exitTimeoutIdRef.current);

    setSelectedOptionText(currentAnswer ?? null);
    setTransitionState("entering");

    enterTimeoutIdRef.current = setTimeout(() => setTransitionState("idle"), 400);
    // Só reseta ao mudar de pergunta. currentAnswer propositalmente fora: incluir quebraria
    // a transição (o pai atualiza currentAnswer ao clicar, e o effect resetaria para "entering").
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question.id]);

  const handleSelectOption = (option: QuestionOption) => {
    if (transitionState !== "idle") return;

    setSelectedOptionText(option.text);
    onAnswer(option.text);
    setTransitionState("feedback");

    if (feedbackTimeoutIdRef.current) clearTimeout(feedbackTimeoutIdRef.current);
    // 1) feedback: outras somem, selecionada fica destacada
    feedbackTimeoutIdRef.current = setTimeout(() => {
      setTransitionState("exiting");
      if (exitTimeoutIdRef.current) clearTimeout(exitTimeoutIdRef.current);
      // 2) exiting: selecionada também some, depois avança
      exitTimeoutIdRef.current = setTimeout(() => {
        setSelectedOptionText(null);
        onComplete(elapsedTimeRef.current);
      }, 350);
    }, 500);
  };

  const isShowingOptions = transitionState !== "exiting" || selectedOptionText;
  const showSelectedOnly = transitionState === "feedback" || transitionState === "exiting";
  const hideSelected = transitionState === "exiting";

  let animationClass = "";
  if (transitionState === "entering") animationClass = "animate-question-enter";
  else if (transitionState === "exiting" && !selectedOptionText) animationClass = "animate-question-exit";

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)
      .toString()
      .padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  const displayName = userName || "Deusa";
  const currentQuestionText = question.question.replace(/{userName}/g, displayName);

  return (
    <div className="min-h-screen w-full flex flex-col bg-black overflow-hidden">
      {/* Top - progress dots estilo TikTok */}
      <div className="flex gap-1 px-4 pt-4 pb-2">
        {questions.map((_, i) => (
          <div
            key={i}
            className={cn(
              "flex-1 h-0.5 rounded-full transition-all duration-300",
              i < question.id ? "bg-white" : "bg-white/20"
            )}
          />
        ))}
      </div>

      {/* Main content - full bleed como vídeo TikTok */}
      <div className="flex-1 flex min-h-0 relative">
        {/* Centro - pergunta e opções */}
        <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 pb-24 overflow-y-auto">
          <div className={cn("max-w-xl mx-auto w-full", animationClass)}>
            <p className="text-white/50 text-sm mb-2">
              pergunta {question.id} de {questions.length}
            </p>
            <h2 className="text-white text-xl sm:text-2xl md:text-3xl font-bold leading-tight mb-6">
              {currentQuestionText}
            </h2>

            <div className="space-y-3">
              {question.options.map((opt, i) => {
                const isSelected = selectedOptionText === opt.text;
                const disabled =
                  (transitionState !== "idle" && !isSelected) ||
                  transitionState === "exiting";

                const shouldFadeOutOthers = showSelectedOnly && !isSelected;
                const shouldFadeOutSelected = hideSelected && isSelected;

                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSelectOption(opt)}
                    disabled={disabled}
                    className={cn(
                      "w-full text-left px-5 py-4 rounded-2xl text-base sm:text-lg font-medium transition-all duration-300 ease-out",
                      "border-2",
                      isSelected
                        ? "bg-white text-black border-white shadow-lg shadow-white/20 ring-2 ring-white/50 scale-[1.02]"
                        : "bg-white/5 text-white border-white/20 hover:bg-white/10 hover:border-white/40",
                      shouldFadeOutOthers && "opacity-0 scale-95 pointer-events-none -translate-y-2",
                      shouldFadeOutSelected && "opacity-0 scale-95 pointer-events-none",
                      disabled && !isSelected && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    {opt.text}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Coluna direita - ícones TikTok (heart, comment, share) */}
        <div className="hidden sm:flex flex-col items-center justify-end gap-6 pb-32 pr-3">
          <button
            type="button"
            className="flex flex-col items-center gap-1 text-white/80 hover:text-white transition-colors"
            aria-label="Curtir"
          >
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
              <Heart className="w-6 h-6" strokeWidth={1.5} />
            </div>
            <span className="text-xs">0</span>
          </button>
          <button
            type="button"
            className="flex flex-col items-center gap-1 text-white/80 hover:text-white transition-colors"
            aria-label="Comentar"
          >
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
              <MessageCircle className="w-6 h-6" strokeWidth={1.5} />
            </div>
            <span className="text-xs">0</span>
          </button>
          <button
            type="button"
            className="flex flex-col items-center gap-1 text-white/80 hover:text-white transition-colors"
            aria-label="Compartilhar"
          >
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
              <Share2 className="w-5 h-5" strokeWidth={1.5} />
            </div>
          </button>
        </div>
      </div>

      {/* Bottom bar - timer + conta */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-4 py-4 bg-gradient-to-t from-black via-black/80 to-transparent">
        <span className="text-white/60 text-sm tabular-nums">{formatTime(elapsedTime)}</span>
        <span className="text-white/40 text-sm">@diagnóstico.da.deusa</span>
      </div>
    </div>
  );
};
