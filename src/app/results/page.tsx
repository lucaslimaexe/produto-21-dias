
"use client";

import { ResultsScreen, BehavioralAnalysisData } from '@/components/results-screen';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

function ResultsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleRestartQuiz = () => {
    router.push('/'); 
  };

  let analysisResult: BehavioralAnalysisData | undefined = undefined;
  let analysisError: string | undefined = undefined;

  const analysisParam = searchParams.get('analysis');
  const errorParam = searchParams.get('error');

  if (analysisParam) {
    try {
      analysisResult = JSON.parse(decodeURIComponent(analysisParam));
    } catch (e) {
      console.error("Error parsing analysis result from query param:", e);
      analysisError = "Não foi possível carregar sua análise personalizada.";
    }
  } else if (errorParam) {
     analysisError = decodeURIComponent(errorParam);
  }


  return <ResultsScreen onRestart={handleRestartQuiz} analysisResult={analysisResult} analysisError={analysisError} />;
}

export default function ResultsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-950 via-black to-red-950"><Loader2 className="h-16 w-16 text-yellow-400 animate-spin" /></div>}>
      <ResultsContent />
    </Suspense>
  );
}
