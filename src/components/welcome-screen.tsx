
"use client";

import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WelcomeScreenProps {
  onStart: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  const [displayedText, setDisplayedText] = useState('');
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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-purple-700/10 to-pink-500/20 animate-pulse"></div>
      
      {/* Floating mystical elements */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-accent/60 rounded-full float opacity-60"></div>
      <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-primary/80 rounded-full float opacity-80" style={{animationDelay: '1s'}}></div>
      <div className="absolute bottom-1/3 left-1/3 w-3 h-3 bg-pink-400/40 rounded-full float opacity-40" style={{animationDelay: '2s'}}></div>
      
      <div className="w-full text-center max-w-4xl relative z-10">
        {/* Main headline with typing effect */}
        <h1 className={cn(
          "font-headline font-bold mb-8 goddess-text-gradient leading-tight break-words",
          "text-3xl sm:text-4xl md:text-6xl lg:text-7xl" // Tamanhos de fonte responsivos
        )}>
          <span className="typing-effect">{displayedText}</span>
        </h1>
        
        {/* Subtitle */}
        <div className="space-y-4 mb-12 animate-fade-in" style={{animationDelay: '3s', animationFillMode: 'forwards', opacity: 0}}>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed break-words">
            Responda 5 perguntas e descubra em 60 segundos qual é o seu{' '}
            <span className="text-accent font-semibold">Nível de Poder de Manifestação</span>{' '}
            (e o que está te sabotando).
          </p>
          <p className="text-lg md:text-xl text-destructive font-medium">
            Você tem coragem de encarar a verdade?
          </p>
        </div>
        
        {/* CTA Button */}
        <div className="animate-fade-in" style={{animationDelay: '4s', animationFillMode: 'forwards', opacity: 0}}>
          <Button 
            onClick={onStart}
            className={cn(
              "goddess-gradient text-primary-foreground font-bold rounded-full pulse-goddess hover:scale-105 transition-all duration-300 shadow-2xl",
              "text-base sm:text-lg md:text-xl", // Tamanho de fonte responsivo
              "py-3 sm:py-4 md:py-5", // Padding vertical responsivo
              "px-4 sm:px-6 md:px-10", // Padding horizontal responsivo
              "flex items-center justify-center" // Para alinhar ícones e texto
            )}
            // Adicionado whitespace-normal para permitir quebra e text-center para alinhar
            style={{ whiteSpace: 'normal', textAlign: 'center' }}
          >
            <Sparkles className="mr-1 h-4 w-4 sm:mr-2 sm:h-5 sm:w-5 md:h-6 md:w-6" />
            <div className="flex flex-col items-center leading-tight">
              <span>COMEÇAR O DIAGNÓSTICO</span>
              <span className="font-bold">AGORA!</span>
            </div>
            <Sparkles className="ml-1 h-4 w-4 sm:ml-2 sm:h-5 sm:w-5 md:h-6 md:w-6" />
          </Button>
        </div>
        
        {/* Mystical decorations */}
        <div className="absolute -top-10 -left-10 text-6xl opacity-20 glow">✨</div>
        <div className="absolute -top-5 -right-10 text-4xl opacity-30 glow" style={{animationDelay: '1s'}}>🌟</div>
        <div className="absolute -bottom-10 left-5 text-5xl opacity-25 glow" style={{animationDelay: '2s'}}>💫</div>
      </div>
    </div>
  );
};
