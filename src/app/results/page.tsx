"use client";

import dynamic from 'next/dynamic';
import type { BehavioralAnalysisData } from '@/components/results-screen';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import type { DreamOption } from '@/components/pre-questionnaire-form-screen';

const ResultsScreen = dynamic(
  () => import('@/components/results-screen').then((m) => ({ default: m.ResultsScreen })),
  {
    loading: () => (
      <div className="min-h-screen flex flex-col bg-[#0a0a0a]">
        <header className="flex items-center justify-center h-14 border-b border-white/10">
          <span className="font-headline font-semibold text-base text-white tracking-tight">diagnóstico.da.deusa</span>
        </header>
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <Loader2 className="h-10 w-10 text-white/70 animate-spin mb-4" aria-hidden />
          <p className="text-sm text-gray-400">carregando...</p>
        </div>
      </div>
    ),
    ssr: false,
  }
);

interface ResultsPageData extends BehavioralAnalysisData {
  userName?: string;
  userDreams?: DreamOption[];
  dreamsAchievementDateLabel?: string; // Label da data, ex: "Final deste ano"
}

function ResultsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleRestartQuiz = () => {
    router.push('/'); 
  };

  let analysisResult: ResultsPageData | undefined = undefined;
  let analysisError: string | undefined = undefined;

  const analysisParam = searchParams.get('analysis');
  const errorParam = searchParams.get('error');
  
  const userName = searchParams.get('name');
  const selectedDreamsDataString = searchParams.get('selectedDreamsData');
  const dreamsAchievementDateLabel = searchParams.get('dreamsDateLabel');

  if (analysisParam) {
    try {
      const parsedAnalysis: BehavioralAnalysisData = JSON.parse(decodeURIComponent(analysisParam));
      analysisResult = { ...parsedAnalysis };

      if (userName) {
        analysisResult.userName = decodeURIComponent(userName);
      }
      if (selectedDreamsDataString) {
        analysisResult.userDreams = JSON.parse(decodeURIComponent(selectedDreamsDataString));
      }
      if (dreamsAchievementDateLabel) {
        analysisResult.dreamsAchievementDateLabel = decodeURIComponent(dreamsAchievementDateLabel);
      }

    } catch (e) {
      console.error("Error parsing analysis result or user data from query param:", e);
      analysisError = "Não foi possível carregar sua análise personalizada e dados.";
    }
  } else if (errorParam) {
     try {
        analysisError = decodeURIComponent(errorParam);
     } catch (e) {
        analysisError = errorParam; 
     }
  }


  return <ResultsScreen 
            onRestart={handleRestartQuiz} 
            analysisResult={analysisResult} 
            analysisError={analysisError} 
            userName={analysisResult?.userName}
            userDreams={analysisResult?.userDreams}
            dreamsAchievementDateLabel={analysisResult?.dreamsAchievementDateLabel}
          />;
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col bg-[#0a0a0a]">
        <header className="flex items-center justify-center h-14 border-b border-white/10">
          <span className="font-headline font-semibold text-base text-white tracking-tight">diagnóstico.da.deusa</span>
        </header>
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <Loader2 className="h-10 w-10 text-white/70 animate-spin mb-4" />
          <p className="text-sm text-gray-400">carregando...</p>
        </div>
      </div>
    }>
      <ResultsContent />
    </Suspense>
  );
}

    