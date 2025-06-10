
"use client";

import { useRouter } from "next/navigation";
import { PreQuestionnaireFormScreen, type PreQuestionnaireFormData } from "@/components/pre-questionnaire-form-screen";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

function PreQuestionnaireFormContent() {
  const router = useRouter();

  const handleFormComplete = (data: PreQuestionnaireFormData) => {
    const queryParams = new URLSearchParams({
      name: data.fullName,
      dreams: JSON.stringify(data.selectedDreams.map(d => d.id)),
      dreamsDate: data.dreamsAchievementDate.toISOString().split('T')[0],
    }).toString();
    router.push(`/questionnaire?${queryParams}`);
  };

  return <PreQuestionnaireFormScreen onSubmitForm={handleFormComplete} />;
}


export default function PreQuestionnaireFormPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-950 via-black to-red-950"><Loader2 className="h-16 w-16 text-yellow-400 animate-spin" /></div>}>
      <PreQuestionnaireFormContent/>
    </Suspense>
  );
}

    
