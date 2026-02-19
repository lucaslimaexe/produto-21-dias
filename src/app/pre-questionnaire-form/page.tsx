
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
      <PreQuestionnaireFormContent/>
    </Suspense>
  );
}

    