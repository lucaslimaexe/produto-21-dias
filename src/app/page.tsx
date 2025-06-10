
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Zap, Sparkles, Brain } from 'lucide-react';

export default function WelcomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative bg-gradient-to-br from-primary via-indigo-800 to-background overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-24 h-24 md:w-32 md:h-32 bg-primary/20 rounded-full animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-16 h-16 md:w-24 md:h-24 bg-accent/20 rounded-full animate-pulse [animation-delay:1s]"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 md:w-40 md:h-40 bg-pink-500/10 rounded-full animate-pulse [animation-delay:2s]"></div>
      </div>

      <Card className="w-full max-w-2xl bg-background/80 backdrop-blur-md border-2 border-primary shadow-2xl text-center">
        <CardHeader className="p-6 sm:p-8">
          <div className="flex justify-center items-center space-x-3 mb-4">
            <Sparkles className="w-10 h-10 text-accent" />
            <Zap className="w-12 h-12 text-primary" />
            <Brain className="w-10 h-10 text-accent" />
          </div>
          <CardTitle className="font-headline text-3xl sm:text-4xl md:text-5xl font-bold text-transparent bg-clip-text goddess-gradient">
            Analisador de Potencial de Manifestação
          </CardTitle>
          <CardDescription className="text-lg sm:text-xl text-foreground/80 pt-2">
            Descubra os segredos da sua mente e desbloqueie seu verdadeiro poder de manifestar seus sonhos.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 sm:p-8">
          <p className="mb-8 text-base sm:text-lg text-foreground/70">
            Este questionário rápido irá mergulhar nas suas energias e padrões de pensamento para revelar seu potencial de manifestação. Prepare-se para uma jornada de autoconhecimento!
          </p>
          <Button
            onClick={() => router.push("/questionnaire")}
            className="w-full sm:w-auto font-headline text-lg sm:text-xl px-8 sm:px-12 py-6 sm:py-7 bg-accent hover:bg-accent/90 text-accent-foreground rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-200"
            size="lg"
          >
            <Sparkles className="mr-2 h-5 w-5" />
            Iniciar Questionário
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
