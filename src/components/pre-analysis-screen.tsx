
"use client";

import React, { useState, useEffect, type ComponentType } from 'react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Brain, KeyRound, ScanLine, Sparkles, Zap, Loader2 } from 'lucide-react'; // Added Loader2

interface PreAnalysisScreenProps {
  onComplete: () => void;
}

interface IconStage {
  icon: ComponentType<{ className?: string }>;
  message: string;
  duration: number;
  status: string;
  progressTarget: number;
}

const ICON_STAGES: IconStage[] = [
  { icon: ScanLine, message: "Analisando suas frequências vibracionais...", duration: 3500, status: "Iniciando varredura quântica...", progressTarget: 25 },
  { icon: Brain, message: "Identificando crenças limitantes e potencialidades...", duration: 4000, status: "Detectando padrões mentais...", progressTarget: 50 },
  { icon: Zap, message: "Cruzando dados com as leis universais da atração...", duration: 3500, status: "Calculando seu potencial de manifestação...", progressTarget: 75 },
  { icon: KeyRound, message: "Seu caminho personalizado está sendo revelado...", duration: 3000, status: "Preparando seu portal de transformação...", progressTarget: 100 },
];

const TOTAL_DURATION = ICON_STAGES.reduce((sum, stage) => sum + stage.duration, 0);

export const PreAnalysisScreen: React.FC<PreAnalysisScreenProps> = ({ onComplete }) => {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [targetProgress, setTargetProgress] = useState(0);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    setShowContent(true); // Trigger initial fade-in for the whole screen content
    setTargetProgress(ICON_STAGES[0].progressTarget);

    const stageTimer = setTimeout(() => {
      if (currentStageIndex < ICON_STAGES.length - 1) {
        setCurrentStageIndex(prev => prev + 1);
      } else {
        // Delay completion slightly to allow final animation
        setTimeout(onComplete, 500);
      }
    }, ICON_STAGES[currentStageIndex].duration);

    return () => clearTimeout(stageTimer);
  }, [currentStageIndex, onComplete]);

  useEffect(() => {
    if (currentStageIndex < ICON_STAGES.length) {
      setTargetProgress(ICON_STAGES[currentStageIndex].progressTarget);
    }
  }, [currentStageIndex]);
  
  useEffect(() => {
    if (progress === targetProgress) return;
  
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev < targetProgress) {
          return Math.min(prev + 1, targetProgress);
        }
        // This case should ideally not be hit if progressTarget always increases
        if (prev > targetProgress) { 
          return Math.max(prev - 1, targetProgress);
        }
        return prev; // Should be targetProgress
      });
    }, 30); // Controls speed of progress bar filling
  
    // Clear interval if progress reaches target
    if (progress === targetProgress) {
      clearInterval(interval);
    }
  
    return () => clearInterval(interval);
  }, [progress, targetProgress]);


  const CurrentIcon = ICON_STAGES[currentStageIndex]?.icon || Loader2;
  const currentMessage = ICON_STAGES[currentStageIndex]?.message || "Aguarde um momento...";
  const currentStatus = ICON_STAGES[currentStageIndex]?.status || "Processando...";

  return (
    <div className={cn(
      "min-h-screen w-full flex flex-col items-center justify-center p-4 transition-opacity duration-1000 ease-in-out",
      "bg-gradient-to-br from-[hsl(var(--background))] via-[hsl(var(--primary)/15)] to-[hsl(var(--background))]",
      showContent ? "opacity-100" : "opacity-0"
    )}>
      <div className="w-full max-w-md md:max-w-lg text-center">
        <div 
          key={`stage-${currentStageIndex}`} 
          className="animate-fade-in mb-12"
          style={{animationDuration: '1s'}}
        >
          <CurrentIcon className="h-20 w-20 md:h-24 md:w-24 text-accent mx-auto mb-6 animate-float" />
          <h1 className="font-headline text-2xl md:text-3xl font-semibold text-primary mb-2">
            {currentStatus}
          </h1>
          <p className="font-body text-lg md:text-xl text-foreground/80">
            {currentMessage}
          </p>
        </div>

        <div className="w-full">
          <Progress value={progress} className="w-full h-5 md:h-6 bg-primary/20 border border-primary/50 animated-progress-bar shadow-inner" />
          <p className="text-center text-lg font-semibold text-accent mt-3">
            {progress}%
          </p>
        </div>
      </div>
    </div>
  );
};
