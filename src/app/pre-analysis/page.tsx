
"use client";

import { useRouter } from "next/navigation";
import { PreAnalysisScreen } from "@/components/pre-analysis-screen";
import { useEffect } from "react";

export default function PreAnalysisPage() {
  const router = useRouter();

  const handleAnalysisComplete = () => {
    router.push("/questionnaire");
  };

  return <PreAnalysisScreen onComplete={handleAnalysisComplete} />;
}
