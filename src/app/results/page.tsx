
"use client";

import { ResultsScreen, type BehavioralAnalysisData } from '@/components/results-screen';
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
      // The analysisParam from the URL is URL-encoded, so it needs to be decoded before parsing.
      analysisResult = JSON.parse(decodeURIComponent(analysisParam));
    } catch (e) {
      console.error("Error parsing analysis result from query param:", e);
      analysisError = "Não foi possível carregar sua análise personalizada.";
    }
  } else if (errorParam) {
     // For errorParam, if it was encoded, decode it. Otherwise, use as is.
     // Assuming simple error strings might not always be encoded.
     try {
        analysisError = decodeURIComponent(errorParam);
     } catch (e) {
        analysisError = errorParam; // Fallback if decoding fails (e.g., not actually encoded)
     }
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
