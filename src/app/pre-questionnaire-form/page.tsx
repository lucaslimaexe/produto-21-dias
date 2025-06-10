
"use client";

import { useRouter } from "next/navigation";
import { PreQuestionnaireFormScreen, type PreQuestionnaireFormData } from "@/components/pre-questionnaire-form-screen";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

function PreQuestionnaireFormContent() {
  const router = useRouter();

  const handleFormComplete = (data: PreQuestionnaireFormData) => {
    // Os sonhos já são um array de objetos, então podemos passar o array de IDs diretamente
    const dreamIds = data.selectedDreams.map(d => d.id);
    
    const queryParams = new URLSearchParams({
      name: data.fullName,
      dreams: JSON.stringify(dreamIds), // Passa o array de IDs como string JSON
      dreamsDate: data.dreamsAchievementDate, // Passa a string da opção de data selecionada
    }).toString();
    router.push(`/questionnaire?${queryParams}`);
  };

  return <PreQuestionnaireFormScreen onSubmitForm={handleFormComplete} />;
}


export default function PreQuestionnaireFormPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-indigo-950 to-rose-900"><Loader2 className="h-16 w-16 text-accent animate-spin" /></div>}>
      <PreQuestionnaireFormContent/>
    </Suspense>
  );
}

    