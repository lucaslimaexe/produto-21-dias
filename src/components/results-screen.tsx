
"use client";

import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { AlertTriangle, Clock, Zap, Eye, ExternalLink, XCircle } from 'lucide-react'; // Added icons

interface ResultsScreenProps {
  onRestart: () => void;
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({ onRestart }) => {
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes in seconds
  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) return; // Stop timer if it reaches zero

    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    // Blinking effect for urgency
    const blinkTimer = setInterval(() => {
      setIsBlinking(prev => !prev);
    }, 700); // Faster blink

    return () => {
      clearInterval(timer);
      clearInterval(blinkTimer);
    };
  }, [timeLeft]); // Re-run effect if timeLeft changes (e.g. reset)

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center px-4 py-8 relative bg-gradient-to-br from-red-950 via-purple-950 to-black overflow-y-auto">
      <div className="w-full max-w-3xl">
        <div className={`flex items-center justify-center space-x-3 bg-red-700/80 border-2 border-yellow-400 rounded-full px-6 py-3 sm:px-8 sm:py-4 mb-6 sm:mb-8 shadow-xl ${isBlinking ? 'animate-pulse ring-4 ring-yellow-500/70' : ''}`}>
          <AlertTriangle className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-300 animate-bounce" />
          <span className="text-yellow-100 font-bold text-md sm:text-lg tracking-wider">🚨 RESULTADO URGENTE 🚨</span>
          <Eye className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-300 animate-pulse" />
        </div>

        <div className="bg-gradient-to-br from-black/70 via-red-900/60 to-purple-900/70 rounded-2xl p-6 sm:p-8 mb-6 sm:mb-8 border-2 border-red-600/70 shadow-2xl">
          <h1 className="font-headline text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-center text-red-400">
            SEU DIAGNÓSTICO:
          </h1>
          
          <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6 text-center">
            <div className="text-lg sm:text-xl md:text-2xl">
              <span className="text-purple-300/80">NÍVEL DE PODER ATUAL: </span>
              <span className="text-red-400 font-bold text-2xl sm:text-3xl md:text-4xl glow">17% </span>
              <span className="text-red-500 ml-1 sm:ml-2">(CRÍTICO)</span>
            </div>
            
            <div className="text-md sm:text-lg md:text-xl">
              <span className="text-purple-300/80">DIAGNÓSTICO: </span>
              <span className="text-yellow-400 font-bold">
                BLOQUEIO DE MANIFESTAÇÃO NÍVEL 7
              </span>
            </div>
            
            <div className="text-red-400 font-semibold text-sm sm:text-lg">
              (SABOTAGEM SUBCONSCIENTE ATIVA)
            </div>
          </div>
        </div>

        <div className="text-left space-y-4 sm:space-y-6 mb-6 sm:mb-8 p-4 sm:p-6 bg-black/50 rounded-xl border border-purple-700/50">
          <p className="text-md sm:text-lg leading-relaxed text-purple-200/90">
            "Querida, a verdade é dura, mas precisa ser dita: <span className="text-red-400 font-semibold">você está sendo sabotada</span>. 
            Suas respostas mostram claramente que seu sistema está infectado pelo{' '}
            <span className="text-yellow-400 font-semibold">'Vírus da Dúvida'</span> e pelo{' '}
            <span className="text-yellow-400 font-semibold">'Malware da Procrastinação'</span>, 
            plantados pelos métodos incompletos que você já tentou."
          </p>
          
          <p className="text-md sm:text-lg leading-relaxed text-purple-200/90">
            "Eles te ensinaram a sonhar, mas não te deram o{' '}
            <span className="text-green-400 font-semibold">ANTÍDOTO</span> para os bloqueios que eles mesmos criaram. 
            Você está com o motor de uma Ferrari, mas tentando andar com o freio de mão puxado. 
            É por isso que nada funciona."
          </p>
          
          <div className="text-center py-4 sm:py-6">
            <p className="font-headline text-xl sm:text-2xl md:text-3xl font-bold goddess-text-gradient mb-2">
              MAS EXISTE UMA SOLUÇÃO. E ELA É RÁPIDA.
            </p>
          </div>
          
          <p className="text-md sm:text-lg leading-relaxed text-purple-200/90">
            "Existe um <span className="text-pink-400 font-semibold">CÓDIGO DE ATIVAÇÃO</span>, 
            um programa de 21 dias que funciona como um antivírus para a sua mente, 
            limpando toda a programação negativa e desbloqueando seu verdadeiro poder de manifestação. 
            É o <span className="goddess-text-gradient font-bold text-lg sm:text-xl">CÓDIGO DA DEUSA</span>."
          </p>
        </div>

        <div className="bg-gradient-to-r from-yellow-800/70 via-red-700/80 to-yellow-800/70 rounded-2xl p-6 sm:p-8 mb-6 sm:mb-8 border-2 border-yellow-500 shadow-2xl text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-yellow-100 mb-3 sm:mb-4 animate-pulse [animation-duration:1.5s]">
            O ANTÍDOTO ESTÁ DISPONÍVEL POR TEMPO LIMITADO!
          </h2>
          
          <div className="mb-4 sm:mb-6">
            <div className={`flex items-center justify-center space-x-2 mb-2 sm:mb-4 ${timeLeft < 60 ? 'text-red-400 animate-ping' : 'text-yellow-200'}`}>
              <Clock className="h-6 w-6 sm:h-8 sm:w-8" />
              <span className={`text-3xl sm:text-4xl md:text-6xl font-bold font-mono ${timeLeft === 0 ? 'text-red-600' : ''}`}>
                {formatTime(timeLeft)}
              </span>
              <Zap className={`h-6 w-6 sm:h-8 sm:w-8 ${timeLeft < 300 ? 'animate-spin' : ''}`} />
            </div>
            <div className="w-full bg-black/50 rounded-full h-3 sm:h-4 border border-yellow-600 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-red-500 via-yellow-400 to-orange-500 h-full rounded-full transition-all duration-1000 ease-linear"
                style={{ width: `${(timeLeft / (15 * 60)) * 100}%` }}
              ></div>
            </div>
             {timeLeft === 0 && <p className="text-red-400 font-bold mt-2 text-sm sm:text-md">TEMPO ESGOTADO!</p>}
          </div>

          <Button
            asChild
            size="lg"
            className={`w-full sm:w-auto font-headline text-lg sm:text-xl px-8 sm:px-12 py-6 sm:py-7 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-200 pulse-goddess
            ${timeLeft === 0 ? 'bg-gray-600 hover:bg-gray-700 cursor-not-allowed opacity-70' : 'bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 hover:from-green-600 hover:via-emerald-600 hover:to-green-700 text-white'}`}
            disabled={timeLeft === 0}
          >
            <a href="https://pay.kiwify.com.br/xxxxxxxx" target="_blank" rel="noopener noreferrer"> {/* Replace xxxxxxxx with actual link */}
              <Sparkles className="mr-2 h-5 w-5" />
              {timeLeft > 0 ? "QUERO O CÓDIGO DA DEUSA AGORA!" : "OFERTA EXPIRADA"}
              <ExternalLink className="ml-2 h-5 w-5" />
            </a>
          </Button>
           <p className="text-xs text-yellow-200/70 mt-3">Vagas limitadas. Oferta válida enquanto o cronômetro estiver ativo.</p>
        </div>
        
        <div className="text-center">
          <Button
            onClick={onRestart}
            variant="ghost"
            className="font-headline text-sm sm:text-md text-purple-300/70 hover:text-purple-200 hover:bg-purple-800/30 rounded-lg px-4 py-2"
          >
            <XCircle className="mr-2 h-4 w-4" />
            Não, obrigado, prefiro continuar sofrendo.
          </Button>
        </div>
      </div>
    </div>
  );
};
