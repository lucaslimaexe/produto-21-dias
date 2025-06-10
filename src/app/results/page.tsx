
"use client";

import { ResultsScreen } from '@/components/results-screen';
import { useRouter } from 'next/navigation';

export default function ResultsPage() {
  const router = useRouter();

  const handleRestartQuiz = () => {
    router.push('/'); // Navigate to the welcome screen or questionnaire start
  };

  return <ResultsScreen onRestart={handleRestartQuiz} />;
}
