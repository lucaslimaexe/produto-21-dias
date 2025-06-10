
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { CheckCircle, RefreshCw, Sparkles } from 'lucide-react';

export const ResultsScreen: React.FC = () => {
  const router = useRouter();

  // Placeholder for actual AI-generated results
  const mockResults = {
    potentialScore: "85%",
    strengths: [
      "Forte capacidade de visualização.",
      "Mentalidade resiliente diante de desafios.",
      "Boa conexão intuitiva."
    ],
    areasForGrowth: [
      "Consistência na prática da gratidão.",
      "Fortalecer a confiança nas próprias manifestações."
    ],
    recommendations: [
      "Dedique 5 minutos diários para agradecer pelas pequenas coisas.",
      "Crie um 'Quadro de Visões' para materializar seus objetivos.",
      "Experimente meditações guiadas para aprofundar a intuição."
    ]
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative bg-gradient-to-br from-primary via-indigo-800 to-background overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-24 h-24 md:w-32 md:h-32 bg-primary/20 rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/3 w-16 h-16 md:w-24 md:h-24 bg-accent/20 rounded-full animate-pulse [animation-delay:1s]"></div>
      </div>

      <Card className="w-full max-w-3xl bg-background/80 backdrop-blur-md border-2 border-accent shadow-2xl">
        <CardHeader className="p-6 sm:p-8 text-center">
          <CheckCircle className="w-16 h-16 text-accent mx-auto mb-4" />
          <CardTitle className="font-headline text-3xl sm:text-4xl md:text-5xl font-bold text-transparent bg-clip-text goddess-gradient">
            Seu Diagnóstico de Manifestação
          </CardTitle>
          <CardDescription className="text-lg sm:text-xl text-foreground/80 pt-2">
            Parabéns por completar a jornada de autoconhecimento!
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 sm:p-8 space-y-6">
          <div className="p-4 bg-card/60 rounded-lg border border-border">
            <h3 className="font-headline text-2xl text-primary mb-2">Potencial de Manifestação: <span className="text-accent">{mockResults.potentialScore}</span></h3>
          </div>

          <div className="p-4 bg-card/60 rounded-lg border border-border">
            <h4 className="font-headline text-xl text-foreground mb-2 flex items-center"><Sparkles className="w-5 h-5 mr-2 text-green-400" />Pontos Fortes:</h4>
            <ul className="list-disc list-inside space-y-1 text-foreground/90">
              {mockResults.strengths.map((item, index) => <li key={index}>{item}</li>)}
            </ul>
          </div>

          <div className="p-4 bg-card/60 rounded-lg border border-border">
            <h4 className="font-headline text-xl text-foreground mb-2 flex items-center"><Sparkles className="w-5 h-5 mr-2 text-yellow-400" />Áreas para Desenvolvimento:</h4>
            <ul className="list-disc list-inside space-y-1 text-foreground/90">
              {mockResults.areasForGrowth.map((item, index) => <li key={index}>{item}</li>)}
            </ul>
          </div>
          
          <div className="p-4 bg-card/60 rounded-lg border border-border">
            <h4 className="font-headline text-xl text-foreground mb-2 flex items-center"><Sparkles className="w-5 h-5 mr-2 text-purple-400" />Recomendações Personalizadas:</h4>
            <ul className="list-disc list-inside space-y-1 text-foreground/90">
              {mockResults.recommendations.map((item, index) => <li key={index}>{item}</li>)}
            </ul>
          </div>

          <p className="text-sm text-center text-foreground/70 italic pt-4">
            Lembre-se: este é um guia. Seu potencial é ilimitado e sua jornada é única. Use estes insights para crescer e manifestar a vida que você deseja!
          </p>
        </CardContent>
        <CardFooter className="p-6 sm:p-8 flex justify-center">
          <Button
            onClick={() => router.push('/questionnaire')}
            variant="outline"
            className="font-headline text-md sm:text-lg px-6 sm:px-10 py-5 sm:py-6 border-accent text-accent hover:bg-accent/10 hover:text-accent rounded-xl shadow-md"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refazer Questionário
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
