
"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AnalysisScreen } from '@/components/analysis-screen';
import { runBehavioralAnalysis, type BehavioralAnalysisInput, type BehavioralAnalysisOutput } from '@/ai/flows/behavioral-analysis-flow';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Define Answer interface locally if not imported from questionnaire page or flow
interface Answer {
  questionId: number;
  questionText: string;
  answer: string;
}

function AnalysisContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  // const [analysisResult, setAnalysisResult] = useState<BehavioralAnalysisOutput | null>(null); // Not needed here, just pass through
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const answersString = searchParams.get('answers');
    if (answersString) {
      try {
        // searchParams.get() already decodes the string
        const answers: Answer[] = JSON.parse(answersString);
        
        if (answers && answers.length > 0) {
          const analysisInput: BehavioralAnalysisInput = { answers };
          setIsLoading(true); // Explicitly set loading before async call
          runBehavioralAnalysis(analysisInput)
            .then(result => {
              // setAnalysisResult(result); // Not strictly needed if navigating immediately
              const resultQueryParam = encodeURIComponent(JSON.stringify(result));
              router.replace(`/results?analysis=${resultQueryParam}`);
            })
            .catch(err => {
              console.error("Error running behavioral analysis:", err);
              setError("Desculpe, não foi possível concluir sua análise comportamental no momento. Por favor, tente novamente mais tarde.");
              setIsLoading(false);
              router.replace(`/results?error=${encodeURIComponent("Falha na análise comportamental.")}`);
            });
        } else {
          setError("Nenhuma resposta encontrada para análise.");
          setIsLoading(false);
          router.replace(`/results?error=${encodeURIComponent("Nenhuma resposta para análise.")}`);
        }
      } catch (e) {
        console.error("Error parsing answers or during analysis:", e);
        setError("Erro ao processar suas respostas ou durante a análise.");
        setIsLoading(false);
        router.replace(`/results?error=${encodeURIComponent("Erro ao processar respostas.")}`);
      }
    } else {
      setError("Dados de respostas ausentes para análise.");
      setIsLoading(false);
      router.replace(`/results?error=${encodeURIComponent("Dados de respostas ausentes.")}`);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]); // Removed router from deps as it's stable, only searchParams should trigger

  if (error && !isLoading) { // Only show error if not actively loading analysis
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-4 bg-gradient-to-br from-purple-900 via-indigo-900 to-black">
        <h1 className="text-2xl font-bold text-red-400 mb-4">Erro na Análise</h1>
        <p className="text-purple-300">{error}</p>
        <Button onClick={() => router.push('/')} className="mt-6">Voltar ao Início</Button>
      </div>
    );
  }

  // The AnalysisScreen component itself is the loading UI.
  // We only navigate away once analysisResult is set (or an error occurs).
  // If there's an error state set but isLoading is still true (e.g. analysis failed but we haven't rendered error yet),
  // this will still show AnalysisScreen until isLoading becomes false.
  return <AnalysisScreen />;
}


export default function AnalysisPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-indigo-900 to-black"><Loader2 className="h-16 w-16 text-yellow-400 animate-spin" /></div>}>
      <AnalysisContent />
    </Suspense>
  );
}
