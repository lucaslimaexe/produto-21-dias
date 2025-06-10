
"use client";

import { useRouter } from "next/navigation";
import { PreQuestionnaireFormScreen, type PreQuestionnaireFormData, type DreamOption, dateOptions } from "@/components/pre-questionnaire-form-screen";
import { Suspense, useCallback } from "react"; // Importar useCallback
import { Loader2 } from "lucide-react";

function PreQuestionnaireFormContent() {
  const router = useRouter();

  // Envolver handleFormComplete com useCallback
  const handleFormComplete = useCallback((data: PreQuestionnaireFormData) => {
    // data.selectedDreams já é um array de objetos DreamOption
    // data.dreamsAchievementDate é o ID da opção de data (string)
    
    // Para a página de resultados, queremos o label da data, não o ID
    const selectedDateObject = dateOptions.find(option => option.id === data.dreamsAchievementDate);
    const dreamsDateLabel = selectedDateObject ? selectedDateObject.label : data.dreamsAchievementDate;

    const queryParams = new URLSearchParams({
      name: data.fullName,
      // Passa os objetos de sonho completos como string JSON
      selectedDreamsData: JSON.stringify(data.selectedDreams), 
      dreamsDate: data.dreamsAchievementDate, // Passa o ID da opção de data selecionada
      dreamsDateLabel: dreamsDateLabel, // Passa o label da opção de data
    }).toString();
    router.push(`/questionnaire?${queryParams}`);
  }, [router]); // Adicionar router como dependência do useCallback

  return <PreQuestionnaireFormScreen onSubmitForm={handleFormComplete} />;
}


export default function PreQuestionnaireFormPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-indigo-950 to-rose-900"><Loader2 className="h-16 w-16 text-accent animate-spin" /></div>}>
      <PreQuestionnaireFormContent/>
    </Suspense>
  );
}

    