
"use client";

// Este arquivo não é mais usado para o formulário de pré-questionário.
// O conteúdo foi movido e adaptado para src/components/pre-questionnaire-form-screen.tsx
// Mantendo o arquivo para evitar erros de "not found" se alguma referência antiga existir,
// mas ele não deve ser funcional para o novo fluxo.

import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export const PreAnalysisScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  React.useEffect(() => {
    // Simula um carregamento e chama onComplete. Não deve ser usado no novo fluxo.
    const timer = setTimeout(() => {
      onComplete();
    }, 100);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className={cn(
      "min-h-screen w-full flex flex-col items-center justify-center p-4",
      "bg-gradient-to-br from-[hsl(var(--background))] via-[hsl(var(--primary)/15)] to-[hsl(var(--background))]"
    )}>
      <div className="w-full max-w-md md:max-w-lg text-center">
        <Loader2 className="h-20 w-20 md:h-24 md:w-24 text-accent mx-auto mb-6 animate-spin" />
        <h1 className="font-headline text-2xl md:text-3xl font-semibold text-primary mb-2">
          Redirecionando...
        </h1>
        <p className="font-body text-lg md:text-xl text-foreground/80">
          Este componente foi substituído.
        </p>
      </div>
    </div>
  );
};
