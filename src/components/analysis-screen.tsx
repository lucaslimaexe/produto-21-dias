
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Zap, Eye } from 'lucide-react'; // Eye might not be used directly in JSX but keep if intended for future

const analysisSteps = [
  "🔍 Analisando suas respostas...",
  "⚡ Detectando seus padrões mentais...",
  "🧠 Identificando bloqueios invisíveis...",
  "💎 Calculando seu Potencial Real de Manifestação...",
  "🎯 DIAGNÓSTICO QUASE PRONTO!"
];

export const AnalysisScreen: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const stepTimer = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < analysisSteps.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 1000);

    const progressTimer = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 2;
        if (newProgress >= 100) {
          clearInterval(progressTimer);
          router.push('/results');
          return 100;
        }
        return newProgress;
      });
    }, 100);

    return () => {
      clearInterval(stepTimer);
      clearInterval(progressTimer);
    };
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative bg-gradient-to-br from-purple-900 via-indigo-900 to-black">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-500/30 rounded-full animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-accent/30 rounded-full animate-pulse [animation-delay:1s]"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-pink-500/20 rounded-full animate-pulse [animation-delay:2s]"></div>
        <div className="absolute top-1/3 right-1/3 w-16 h-16 bg-green-500/25 rounded-full animate-pulse [animation-delay:3s]"></div>
      </div>

      <div className="text-center max-w-3xl w-full relative z-10 bg-black/60 backdrop-blur-sm p-8 sm:p-12 rounded-3xl border-2 border-purple-500 shadow-2xl">
        <div className="flex justify-center space-x-8 mb-8">
          <div className="text-5xl animate-spin text-yellow-400" style={{animationDuration: '3s'}}>⚡</div>
          <div className="text-5xl animate-pulse text-purple-400">🔮</div>
          <div className="text-5xl animate-spin text-pink-400" style={{animationDuration: '4s', animationDirection: 'reverse'}}>✨</div>
        </div>

        <h1 className="font-headline text-2xl sm:text-3xl md:text-4xl font-bold mb-8 text-yellow-300 bg-black/50 p-4 sm:p-6 rounded-xl border border-yellow-500 animate-pulse [animation-duration:1.5s]">
          {analysisSteps[currentStep]}
        </h1>

        <div className="mb-6 md:mb-8">
          <div className="w-full bg-purple-500/30 rounded-full h-5 md:h-6 mb-3 md:mb-4 border-2 border-purple-500/70 overflow-hidden shadow-inner">
            <div
              className="bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 h-full rounded-full transition-all duration-300 ease-out shadow-md"
              style={{ width: `${progress.toFixed(0)}%` }}
            ></div>
          </div>
          <p className="text-xl sm:text-2xl font-semibold text-yellow-300 bg-black/50 px-4 py-1.5 sm:px-6 sm:py-2 rounded-lg inline-block border border-yellow-500/70 shadow-md">
            {progress.toFixed(0)}% COMPLETO
          </p>
        </div>
        
        <div className="flex justify-center space-x-3 mb-6 md:mb-8">
          <div className="w-3 h-3 md:w-4 md:h-4 bg-yellow-400 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 md:w-4 md:h-4 bg-purple-400 rounded-full animate-bounce [animation-delay:0.1s]"></div>
          <div className="w-3 h-3 md:w-4 md:h-4 bg-pink-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
        </div>
      </div>
    </div>
  );
};
