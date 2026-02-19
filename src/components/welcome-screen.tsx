"use client";

import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useGamification } from '@/components/gamification';
import { PointsDisplay } from '@/components/gamification/PointsDisplay';

interface WelcomeScreenProps {
  onStart: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [energyProgress, setEnergyProgress] = useState(0);
  const g = useGamification();
  const fullText = 'O DIAGNÓSTICO DA DEUSA: Você está no Comando ou sendo Controlada?';

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index < fullText.length) {
        setDisplayedText(fullText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 50);
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
    <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 relative overflow-hidden">
      {g && (
        <div className="absolute top-4 right-4 z-20">
          <PointsDisplay />
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-purple-700/10 to-pink-500/20 animate-pulse" aria-hidden />
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-accent/60 rounded-full float opacity-60" style={{ animationDelay: '1s' }} aria-hidden />
      <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-primary/80 rounded-full float opacity-80" style={{ animationDelay: '1s' }} aria-hidden />
      <div className="absolute bottom-1/3 left-1/3 w-3 h-3 bg-pink-400/40 rounded-full float opacity-40" style={{ animationDelay: '2s' }} aria-hidden />

      <div className={cn('w-full text-center max-w-4xl relative z-10', 'lg:px-0 md:px-8 sm:px-6 px-4')}>
        <h1
          className={cn(
            'font-headline font-bold mb-6 sm:mb-8 goddess-text-gradient leading-[1.15] sm:leading-tight break-words',
            'text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl',
            'tracking-tight'
          )}
        >
          <span className="typing-effect">{displayedText}</span>
        </h1>

        <div className="space-y-5 mb-8 sm:mb-10 animate-fade-in" style={{ animationDelay: '3s', animationFillMode: 'forwards', opacity: 0 }}>
          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed sm:leading-loose break-words">
            Responda 5 perguntas e descubra em 60 segundos qual é o seu{' '}
            <span className="text-accent font-semibold">Nível de Poder de Manifestação</span> (e o que está te sabotando).
          </p>
          <p className="text-base sm:text-lg md:text-xl text-destructive font-semibold leading-relaxed">
            Você tem coragem de encarar a verdade?
          </p>
        </div>

        <div
          className="mb-8 max-w-md mx-auto animate-fade-in"
          style={{ animationDelay: '3.2s', animationFillMode: 'forwards', opacity: 0 }}
        >
          <p className="text-sm text-muted-foreground mb-2">
            {isEnergyReady ? 'Energia pronta!' : 'Preparando sua energia...'}
          </p>
          <Progress
            value={energyProgress}
            className="h-2 bg-primary/20 [&>div]:bg-gradient-to-r [&>div]:from-primary [&>div]:to-accent [&>div]:transition-all [&>div]:duration-300"
            aria-valuenow={energyProgress}
            aria-valuemin={0}
            aria-valuemax={100}
            role="progressbar"
            aria-label="Preparação de energia"
          />
        </div>

        <div className="animate-fade-in text-center" style={{ animationDelay: '4s', animationFillMode: 'forwards', opacity: 0 }}>
          <Button
            onClick={handleStartClick}
            disabled={!isEnergyReady}
            aria-label={isEnergyReady ? 'Começar o diagnóstico' : 'Aguarde a energia carregar'}
            className={cn(
              'goddess-gradient text-primary-foreground font-bold rounded-full pulse-goddess hover:scale-105 transition-all duration-300 shadow-2xl',
              'h-auto min-h-[52px] sm:min-h-[60px] md:min-h-[68px] min-h-touch',
              'text-base sm:text-lg md:text-xl leading-snug',
              'py-4 sm:py-5 md:py-6',
              'px-6 sm:px-8 md:px-12',
              'gap-3 sm:gap-4',
              'flex items-center justify-center mx-auto whitespace-normal text-center',
              !isEnergyReady && 'opacity-70 cursor-not-allowed'
            )}
          >
            <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 shrink-0" aria-hidden />
            <div className="flex flex-col items-center gap-0.5">
              <span>COMEÇAR O DIAGNÓSTICO</span>
              <span className="font-extrabold tracking-wide">AGORA!</span>
            </div>
            <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 shrink-0" aria-hidden />
          </Button>
        </div>

        <div className="absolute -top-10 -left-10 text-6xl opacity-20 glow" aria-hidden>✨</div>
        <div className="absolute -top-5 -right-10 text-4xl opacity-30 glow" style={{ animationDelay: '1s' }} aria-hidden>🌟</div>
        <div className="absolute -bottom-10 left-5 text-5xl opacity-25 glow" style={{ animationDelay: '2s' }} aria-hidden>💫</div>
      </div>
    </div>
  );
};
