
"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { QuestionnaireScreen, questions, type Question, type QuestionOption as ImportedQuestionOption } from '@/components/questionnaire-screen';
import type { BehavioralAnalysisOutput } from '@/ai/flows/behavioral-analysis-flow';
import { Loader2 } from 'lucide-react';
import type { DreamOption } from '@/components/pre-questionnaire-form-screen'; 

interface Answer {
  questionId: number;
  questionText: string;
  answer: string; // O texto da resposta selecionada
}

interface PreQuestionnaireState {
  name: string;
  selectedDreams: DreamOption[]; 
  dreamsDate: string; 
  dreamsDateLabel: string; 
}

const generateLocalAnalysis = (answers: Answer[]): BehavioralAnalysisOutput => {
  let totalScore = 0;

  for (const userAnswer of answers) {
    const questionData = questions.find(q => q.id === userAnswer.questionId);
    if (questionData) {
      const selectedOptionData = questionData.options.find(opt => opt.text === userAnswer.answer);
      if (selectedOptionData) {
        totalScore += selectedOptionData.score;
      }
    }
  }

  // Definir arquétipos e dados associados com base nos ranges de pontuação
  // Ranges: 10-12, 13-16, 17-20, 21-24
  if (totalScore <= 12) { // Range 1: 10-12 pontos (Menos Crítico)
    return {
      archetype: "Deusa em Alinhamento Crescente",
      summary: "Você demonstra um bom nível de autoconsciência e está no caminho certo para a manifestação. Existem alguns pontos de ajuste fino, mas sua base é sólida. Continue cultivando sua confiança e clareza.",
      keywords: ["Autoconsciência", "Potencial Elevado", "Clareza Crescente", "Confiança em Desenvolvimento", "Pequenos Ajustes"],
      idealPercentage: 75,
      missingForIdeal: "Falta consolidar a confiança inabalável em seu poder de manifestação e refinar a clareza de seus desejos mais profundos. A disciplina na aplicação de técnicas e a celebração de pequenas vitórias impulsionarão você ao seu máximo."
    };
  } else if (totalScore <= 16) { // Range 2: 13-16 pontos (Moderado)
    return {
      archetype: "Buscadora Consciente com Desafios",
      summary: "Você está ciente de que existem desafios, mas também possui uma vontade de superá-los. Dúvidas e frustrações ocasionais podem surgir, mas sua busca por crescimento é evidente. O foco agora é transformar essa consciência em ação consistente.",
      keywords: ["Consciência de Bloqueios", "Vontade de Mudar", "Dúvidas Ocasionais", "Busca por Consistência", "Necessidade de Ferramentas"],
      idealPercentage: 55,
      missingForIdeal: "Falta transformar a consciência dos seus bloqueios em estratégias de superação eficazes e consistentes. Desenvolver resiliência emocional para lidar com frustrações e fortalecer a crença em sua capacidade de aplicar métodos com sucesso são seus próximos passos."
    };
  } else if (totalScore <= 20) { // Range 3: 17-20 pontos (Crítico)
    return {
      archetype: "Realista Sob Pressão",
      summary: "Você enfrenta bloqueios significativos que geram frustração e impactam sua energia. Crenças limitantes sobre merecimento ou capacidade podem estar profundamente enraizadas. É crucial um trabalho interno mais intenso para desconstruir esses padrões.",
      keywords: ["Frustração Recorrente", "Crenças Limitantes Fortes", "Baixa Energia para Manifestar", "Dificuldade de Merecimento", "Padrões Arraigados"],
      idealPercentage: 35,
      missingForIdeal: "Falta um mergulho profundo para identificar e ressignificar crenças limitantes centrais, especialmente sobre merecimento e capacidade. É preciso desenvolver ferramentas para elevar sua vibração consistentemente e romper com o ciclo de frustração que drena sua energia."
    };
  } else { // Range 4: 21-24 pontos (Mais Crítico)
    return {
      archetype: "Guerreira Ferida em Recuperação",
      summary: "Sua jornada tem sido marcada por desafios intensos, resultando em exaustão e, possivelmente, uma visão pessimista. Bloqueios como falta de merecimento, medo e descrença são muito presentes. A recuperação do seu poder exigirá dedicação e as ferramentas certas para curar feridas emocionais profundas.",
      keywords: ["Exaustão Emocional", "Descrença Profunda", "Medo Paralisante", "Não Merecimento Crítico", "Necessidade Urgente de Cura"],
      idealPercentage: 15,
      missingForIdeal: "Falta urgentemente um processo de cura emocional para resgatar sua autoestima, senso de merecimento e esperança. É vital desconstruir a narrativa de fracasso e desesperança, substituindo-a por uma visão de si mesma como capaz e digna de realizar seus sonhos. A reconstrução da sua força interior é o primeiro passo."
    };
  }
};


function QuestionnaireContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Answer[]>([]);
  const [isNavigating, setIsNavigating] = useState(false);
  const [preQuestionnaireData, setPreQuestionnaireData] = useState<PreQuestionnaireState | null>(null);

  useEffect(() => {
    const name = searchParams.get('name');
    const selectedDreamsDataString = searchParams.get('selectedDreamsData'); 
    const dreamsDate = searchParams.get('dreamsDate'); 
    const dreamsDateLabel = searchParams.get('dreamsDateLabel'); 
    
    if (name && selectedDreamsDataString && dreamsDate && dreamsDateLabel) {
      try {
        const selectedDreams: DreamOption[] = JSON.parse(selectedDreamsDataString); 
        const newPreQuestionnaireData: PreQuestionnaireState = { name, selectedDreams, dreamsDate, dreamsDateLabel };
        setPreQuestionnaireData(newPreQuestionnaireData);
      } catch (e) {
        console.error("Erro ao parsear dados dos query params (questionnaire):", e);
      }
    } else {
        console.warn("Dados do formulário pré-questionário não encontrados ou incompletos nos query params.");
    }
  }, [searchParams]);


  const handleAnswer = (question: Question, answerText: string) => {
    const newAnswer = { questionId: question.id, questionText: question.question, answer: answerText };
    setUserAnswers(prev => {
      const filteredAnswers = prev.filter(a => a.questionId !== question.id);
      return [...filteredAnswers, newAnswer];
    });
  };
  
  const handleQuestionProceed = () => {
    if (isNavigating) return; 

    const isLast = currentQuestionIndex === questions.length - 1;
    if (isLast) {
      setIsNavigating(true);
      const localAnalysisResult = generateLocalAnalysis(userAnswers);
      const analysisJsonString = JSON.stringify(localAnalysisResult);
      
      const queryParams = new URLSearchParams();
      if (preQuestionnaireData) {
        queryParams.set('name', preQuestionnaireData.name);
        queryParams.set('selectedDreamsData', JSON.stringify(preQuestionnaireData.selectedDreams));
        queryParams.set('dreamsDate', preQuestionnaireData.dreamsDate); 
        queryParams.set('dreamsDateLabel', preQuestionnaireData.dreamsDateLabel); 
      }
      queryParams.set('analysis', analysisJsonString); 
      
      const targetUrl = `/results?${queryParams.toString()}`;
      router.push(targetUrl);
    } else {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    }
  };

  const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;
  const currentQuestionData = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const currentAnswerText = userAnswers.find(ans => ans.questionId === currentQuestionData.id)?.answer;


  return (
    <QuestionnaireScreen
      question={currentQuestionData}
      onAnswer={(answerText) => handleAnswer(currentQuestionData, answerText)}
      progress={progressPercentage}
      isLastQuestion={isLastQuestion}
      onComplete={handleQuestionProceed}
      currentAnswer={currentAnswerText}
      userName={preQuestionnaireData?.name}
    />
  );
}

export default function QuestionnairePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-indigo-950 to-rose-900"><Loader2 className="h-16 w-16 text-accent animate-spin" /></div>}>
      <QuestionnaireContent />
    </Suspense>
  );
}
    
