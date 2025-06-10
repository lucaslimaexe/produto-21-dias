
"use client";

import { ResultsScreen, type BehavioralAnalysisData } from '@/components/results-screen';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import type { DreamOption } from '@/components/pre-questionnaire-form-screen'; // Import DreamOption

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
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-950 via-black to-red-950"><Loader2 className="h-16 w-16 text-yellow-400 animate-spin" /></div>}>
      <ResultsContent />
    </Suspense>
  );
}

    