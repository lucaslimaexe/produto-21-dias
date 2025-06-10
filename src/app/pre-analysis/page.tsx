
"use client";

// Este arquivo de rota (/pre-analysis) não é mais usado para o formulário de pré-questionário.
// A lógica do formulário foi movida para /pre-questionnaire-form/page.tsx.
// O conteúdo original (tela de animação) pode ser restaurado aqui se necessário,
// ou este arquivo pode ser removido se a rota /pre-analysis não for mais desejada.

import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function PreAnalysisFallbackPage() {
  return (
    <div className={cn(
      "min-h-screen w-full flex flex-col items-center justify-center p-4",
      "bg-gradient-to-br from-[hsl(var(--background))] via-[hsl(var(--primary)/15)] to-[hsl(var(--background))]"
    )}>
      <div className="w-full max-w-md md:max-w-lg text-center">
        <Loader2 className="h-20 w-20 md:h-24 md:w-24 text-accent mx-auto mb-6 animate-spin" />
        <h1 className="font-headline text-2xl md:text-3xl font-semibold text-primary mb-2">
          Página em Transição
        </h1>
        <p className="font-body text-lg md:text-xl text-foreground/80">
          O conteúdo desta rota foi movido.
        </p>
      </div>
    </div>
  );
}
