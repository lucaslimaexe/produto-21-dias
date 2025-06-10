"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { QuestionnaireScreen, questions, type Question } from '@/components/questionnaire-screen';
import type { BehavioralAnalysisOutput } from '@/ai/flows/behavioral-analysis-flow'; // Importando o tipo

interface Answer {
  questionId: number;
  questionText: string;
  answer: string;
}

const generateLocalAnalysis = (answers: Answer[]): BehavioralAnalysisOutput => {
  const findAnswerText = (id: number): string | undefined => {
    return answers.find(a => a.questionId === id)?.answer;
  };

  const answer1 = findAnswerText(1);
  const answer2 = findAnswerText(2);
  const answer3 = findAnswerText(3);
  const answer4 = findAnswerText(4);
  const answer5 = findAnswerText(5);

  // REGRA 1: Cansaço + Dúvida de Merecimento
  if (answer1 === "Cansaço. Estou exausta de lutar e não ver resultados." &&
      answer4 === "Honestamente? Não. Uma parte de mim acha que não é pra mim.") {
    return {
      archetype: "Realista Exausta",
      summary: "Você se sente profundamente cansada pela jornada e, em seu íntimo, uma voz questiona seu merecimento. Essa combinação pode gerar um ciclo de autosabotagem, onde a exaustão impede a ação e a dúvida impede a permissão. Reconhecer essa dinâmica é o primeiro passo crucial para a transformação.",
      keywords: ["Exaustão", "Dúvida de Merecimento", "Autossabotagem", "Ciclo Vicioso", "Fadiga Emocional"]
    };
  }

  // REGRA 2: Frustração + Inércia
  if (answer1 === "Frustração, porque eu já tentei de tudo e nada parece funcionar de verdade." &&
      answer2 === "A vida continua exatamente a mesma, como se nada tivesse acontecido.") {
    return {
      archetype: "Buscadora Frustrada",
      summary: "A sensação de que seus esforços são em vão, combinada com a frustração de tentativas anteriores, indica um desalinhamento energético ou a aplicação de métodos que não ressoam com sua essência. É preciso uma nova abordagem para romper essa inércia e reacender sua fé na manifestação.",
      keywords: ["Frustração Crônica", "Inércia", "Desalinhamento", "Esforço Ineficaz", "Falta de Resultados"]
    };
  }

  // REGRA 3: Medo de Fracassar + Falta de Sorte Percebida
  if (answer5 === "Talvez... mas tenho medo de me frustrar mais uma vez." &&
      answer3 === "Não sei if é um bloqueio, mas sinto que não tenho a mesma 'sorte' que os outros.") {
    return {
      archetype: "Cética Esperançosa",
      summary: "Você carrega a cicatriz de frustrações passadas e uma sensação de que a 'sorte' não está ao seu lado, mas ainda há uma chama de esperança. O medo de nova decepção é seu maior obstáculo. Você precisa de provas e um caminho seguro.",
      keywords: ["Medo de Fracassar", "Ceticismo", "Frustração Anterior", "Busca por Segurança", "Esperança Velada"]
    };
  }
  
  // REGRA 4: Inveja + Sentimento de Injustiça
  if (answer1 === "Inveja (mesmo que eu não admita) de outras mulheres que parecem ter tudo." &&
      answer4 === "Sim, mas sinto que o mundo é injusto e não me dá o que eu mereço.") {
    return {
      archetype: "Reivindicadora Ferida",
      summary: "A inveja, mesmo não admitida, e o sentimento de injustiça revelam uma dor profunda e a crença de que algo externo te impede de receber o que é seu por direito. É crucial curar essa ferida e redirecionar sua energia para o empoderamento pessoal.",
      keywords: ["Inveja", "Sentimento de Injustiça", "Comparação", "Dor Emocional", "Merecimento Bloqueado"]
    };
  }

  // REGRA 5: Coragem Total + Impaciência para Resultados
   if (answer5 === "CORAGEM EU TENHO, SÓ PRECISO SABER SE FUNCIONA MESMO!" && 
       (answer1 === "Uma pontada de esperança, mas logo em seguida a dúvida de que seja possível pra mim." || answer2 === "Eu me sinto bem por alguns minutos, mas depois a realidade bate e eu desanimo.")) {
     return {
       archetype: "Visionária Impaciente",
       summary: "Você possui a visão e a coragem ardente para a mudança, mas a dúvida momentânea ou o desânimo rápido podem minar seu progresso. Sua impaciência por resultados é compreensível. Você precisa de um método que entregue resultados tangíveis para manter sua chama acesa.",
       keywords: ["Coragem", "Impaciência", "Visão Clara", "Busca por Resultados Rápidos", "Motivação Intensa"]
     };
   }

  // ARQUÉTIPO PADRÃO (Fallback)
  return {
    archetype: "Exploradora da Consciência",
    summary: "Você está em uma jornada valiosa de autodescoberta, analisando suas respostas para entender melhor seus padrões internos. Cada insight te aproxima da clareza e do poder de manifestar a vida que deseja.",
    keywords: ["Autoconhecimento", "Exploração", "Potencial", "Descoberta Interior", "Jornada Pessoal"]
  };
};


export default function QuestionnairePage() {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Answer[]>([]);

  const handleAnswer = (question: Question, answer: string) => {
    const newAnswer = { questionId: question.id, questionText: question.question, answer };
    setUserAnswers(prev => [...prev, newAnswer]);
  };
  
  const handleQuestionProceed = () => {
    const isLast = currentQuestionIndex === questions.length - 1;
    if (isLast) {
      // Todas as perguntas respondidas, gerar análise local e passar para a página de resultados
      const localAnalysisResult = generateLocalAnalysis(userAnswers);
      const analysisQueryParam = encodeURIComponent(JSON.stringify(localAnalysisResult));
      router.push(`/results?analysis=${analysisQueryParam}`);
    } else {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    }
  };

  const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;
  const currentQuestionData = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  return (
    <QuestionnaireScreen
      question={currentQuestionData}
      onAnswer={(answer) => handleAnswer(currentQuestionData, answer)}
      progress={progressPercentage}
      isLastQuestion={isLastQuestion}
      onComplete={handleQuestionProceed} 
    />
  );
