"use client";

import React, { useState, useEffect } from 'react';
import { Sparkles, Zap, Eye } from 'lucide-react';

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

  useEffect(() => {
    const stepInterval = 2500; // Time per step
    const progressTick = 50; // How often progress updates
    const totalDuration = analysisSteps.length * stepInterval;
    
    const stepTimer = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < analysisSteps.length - 1) {
          return prev + 1;
        }
        clearInterval(stepTimer);
        return prev;
      });
    }, stepInterval);

    const progressIncrement = 100 / (totalDuration / progressTick);
    const progressTimer = setInterval(() => {
      setProgress(prev => {
        if (prev < 100) {
          const newProgress = prev + progressIncrement;
          return Math.min(newProgress, 100);
        }
        clearInterval(progressTimer);
        return 100;
      });
    }, progressTick);

    return () => {
      clearInterval(stepTimer);
      clearInterval(progressTimer);
    };
  }, []);

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative bg-gradient-to-br from-primary via-indigo-800 to-background overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-24 h-24 md:w-32 md:h-32 bg-primary/20 rounded-full animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-16 h-16 md:w-24 md:h-24 bg-accent/20 rounded-full animate-pulse [animation-delay:1s]"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 md:w-40 md:h-40 bg-pink-500/10 rounded-full animate-pulse [animation-delay:2s]"></div>
        <div className="absolute top-1/3 right-1/3 w-12 h-12 md:w-16 md:h-16 bg-green-500/15 rounded-full animate-pulse [animation-delay:3s]"></div>
      </div>

      <div className="text-center max-w-3xl w-full relative z-10 bg-background/70 backdrop-blur-sm p-6 sm:p-8 md:p-12 rounded-3xl border-2 border-primary shadow-2xl">
        <div className="flex justify-center space-x-6 md:space-x-8 mb-6 md:mb-8">
          <div className="text-4xl md:text-5xl text-yellow-400 animate-spin [animation-duration:3s]">⚡</div>
          <div className="text-4xl md:text-5xl text-purple-400 animate-pulse [animation-duration:1.5s]">🔮</div>
          <div className="text-4xl md:text-5xl text-pink-400 animate-spin [animation-duration:4s] [animation-direction:reverse]">✨</div>
        </div>

        <h1 className="font-headline text-2xl sm:text-3xl md:text-4xl font-bold mb-6 md:mb-8 text-yellow-300 bg-black/50 p-3 sm:p-4 md:p-6 rounded-xl border border-yellow-500 shadow-lg animate-pulse [animation-duration:2s]">
          {analysisSteps[currentStep]}
        </h1>

        <div className="mb-6 md:mb-8">
          <div className="w-full bg-purple-900/50 rounded-full h-5 md:h-6 mb-3 md:mb-4 border-2 border-purple-400 overflow-hidden shadow-inner">
            <div 
              className="goddess-gradient h-full rounded-full transition-all duration-300 ease-out shadow-md"
              style={{ width: `${progress.toFixed(0)}%` }}
            ></div>
          </div>
          <p className="text-xl sm:text-2xl font-semibold text-yellow-300 bg-black/50 px-4 py-1.5 sm:px-6 sm:py-2 rounded-lg inline-block border border-yellow-400 shadow-md">
            {progress.toFixed(0)}% COMPLETO
          </p>
        </div>

        <div className="flex justify-center space-x-3 mb-6 md:mb-8">
          <div className="w-3 h-3 md:w-4 md:h-4 bg-purple-400 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 md:w-4 md:h-4 bg-yellow-400 rounded-full animate-bounce [animation-delay:0.1s]"></div>
          <div className="w-3 h-3 md:w-4 md:h-4 bg-pink-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
        </div>

        <div className="space-y-3 md:space-y-4">
          <div className="flex items-center justify-center space-x-3 text-purple-200 bg-purple-900/50 p-3 sm:p-4 rounded-lg border border-purple-400 shadow">
            <Eye className="h-5 w-5 sm:h-6 sm:w-6 animate-pulse text-purple-300" />
            <span className="text-sm sm:text-lg">Seus padrões estão sendo revelados...</span>
          </div>
          
          <div className="flex items-center justify-center space-x-3 text-yellow-200 bg-yellow-900/40 p-3 sm:p-4 rounded-lg border border-yellow-500 shadow">
            <Zap className="h-5 w-5 sm:h-6 sm:w-6 animate-bounce text-yellow-300 [animation-duration:1.5s]" />
            <span className="text-sm sm:text-lg">Calculando seu potencial oculto...</span>
          </div>
          
          <div className="flex items-center justify-center space-x-3 text-green-200 bg-green-900/40 p-3 sm:p-4 rounded-lg border border-green-500 shadow">
            <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 animate-spin text-green-300 [animation-duration:2.5s]" />
            <span className="text-sm sm:text-lg">Preparando sua transformação...</span>
          </div>
        </div>

        <div className="absolute inset-0 pointer-events-none opacity-10 mix-blend-overlay">
          <div className="text-xs font-mono text-green-400/50 animate-pulse overflow-hidden h-full flex flex-wrap content-start">
            {Array(50).fill(null).map((_, i) => (
                <span key={i} className="p-1">
                    {'✨🌟💫⭐🔮⚡💎🌙'.split('')[Math.floor(Math.random() * '✨🌟💫⭐🔮⚡💎🌙'.length)]}
                </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
