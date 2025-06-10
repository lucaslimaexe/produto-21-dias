
"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { QuestionnaireScreen, questions, type Question } from '@/components/questionnaire-screen';
import type { BehavioralAnalysisOutput } from '@/ai/flows/behavioral-analysis-flow';
import { Loader2 } from 'lucide-react';

interface Answer {
  questionId: number;
  questionText: string;
  answer: string;
}

// REGRAS DE ANÁLISE LOCAL (COM FOCO CRÍTICO)
const generateLocalAnalysis = (answers: Answer[]): BehavioralAnalysisOutput => {
  const findAnswerText = (id: number): string | undefined => {
    return answers.find(a => a.questionId === id)?.answer;
  };

  const answer1 = findAnswerText(1);
  const answer2 = findAnswerText(2);
  const answer3 = findAnswerText(3);
  const answer4 = findAnswerText(4);
  const answer5 = findAnswerText(5);

  // REGRA 1: Cansaço + Dúvida de Merecimento (MUITO CRÍTICO)
  if (answer1 === "Cansaço. Estou exausta de lutar e não ver resultados." &&
      answer4 === "Honestamente? Não. Uma parte de mim acha que não é pra mim.") {
    return {
      archetype: "Auto-Sabotadora Exausta",
      summary: "Sua exaustão e profunda dúvida de merecimento criam uma barreira quase intransponível para a manifestação. Você parece estar presa em um ciclo de derrota autoimposto, onde a falta de energia e a crença de não ser digna te impedem de qualquer avanço real. É uma situação crítica que exige uma mudança radical de perspectiva interna.",
      keywords: ["Exaustão Crônica", "Não Merecimento", "Autossabotagem Profunda", "Ciclo Destrutivo", "Baixa Autoestima"],
      idealPercentage: 15,
      missingForIdeal: "Falta urgentemente resgatar sua autoestima e senso de merecimento. A exaustão é um sintoma de uma luta interna prolongada contra suas próprias crenças limitantes. Você precisa de uma reestruturação completa da sua autoimagem e aprender a validar seu próprio valor antes de esperar que o universo o faça."
    };
  }

  // REGRA 2: Frustração + Inércia (CRÍTICO)
  if (answer1 === "Frustração, porque eu já tentei de tudo e nada parece funcionar de verdade." &&
      answer2 === "A vida continua exatamente a mesma, como se nada tivesse acontecido.") {
    return {
      archetype: "Buscadora Desiludida",
      summary: "Sua frustração acumulada por tentativas fracassadas gerou uma inércia paralisante. A sensação de que 'nada funciona' revela um desalinhamento grave com as verdadeiras leis da manifestação ou uma resistência interna em aplicar métodos eficazes de forma consistente. Você está estagnada e a desilusão impede novas tentativas sérias.",
      keywords: ["Frustração Crônica", "Inércia Paralisante", "Desalinhamento Energético", "Resistência à Mudança", "Descrença"],
      idealPercentage: 25,
      missingForIdeal: "Falta abandonar a mentalidade de vítima das circunstâncias e dos 'métodos que não funcionam'. É crucial identificar a raiz da sua resistência interna e se comprometer com uma única abordagem comprovada, superando a descrença alimentada por fracassos passados. A responsabilidade pela mudança é sua."
    };
  }

  // REGRA 3: Medo de Fracassar + Falta de Sorte Percebida (CRÍTICO MODERADO)
  if (answer5 === "Talvez... mas tenho medo de me frustrar mais uma vez." &&
      answer3 === "Não sei if é um bloqueio, mas sinto que não tenho a mesma 'sorte' que os outros.") {
    return {
      archetype: "Cética Medrosa",
      summary: "O medo paralisante de novas frustrações e a crença de que a 'sorte' é um fator externo te mantêm refém do ceticismo. Embora haja uma pequena chama de esperança, ela é constantemente apagada pela sua aversão ao risco e pela comparação com os outros. Seu progresso é mínimo devido a essa postura defensiva.",
      keywords: ["Medo de Fracassar", "Ceticismo Excessivo", "Comparação Destrutiva", "Falta de Iniciativa", "Mentalidade de Escassez"],
      idealPercentage: 35,
      missingForIdeal: "Falta desenvolver resiliência emocional para encarar possíveis contratempos como aprendizado, e não como confirmação de seus medos. É preciso parar de se comparar e entender que a 'sorte' é, em grande parte, criada por ação consistente e mentalidade positiva, ambas ausentes no seu caso."
    };
  }
  
  // REGRA 4: Inveja + Sentimento de Injustiça (MUITO CRÍTICO)
  if (answer1 === "Inveja (mesmo que eu não admita) de outras mulheres que parecem ter tudo." &&
      answer4 === "Sim, mas sinto que o mundo é injusto e não me dá o que eu mereço.") {
    return {
      archetype: "Reivindicadora Amargurada",
      summary: "A inveja e o forte sentimento de injustiça são venenos que corroem sua capacidade de manifestação. Essa mentalidade de escassez e ressentimento te coloca em uma vibração extremamente baixa, repelindo ativamente o que você deseja. Você está mais focada no que os outros têm do que em cultivar suas próprias conquistas.",
      keywords: ["Inveja Corrosiva", "Sentimento de Injustiça", "Ressentimento", "Mentalidade de Vítima", "Vibração Baixa"],
      idealPercentage: 10,
      missingForIdeal: "Falta uma transformação radical de foco: da escassez e da vida alheia para a abundância interna e gratidão pelo que você já tem. Curar a amargura e o ressentimento é o primeiro passo. Assumir 100% de responsabilidade por sua realidade, em vez de culpar o 'mundo injusto', é crucial."
    };
  }

  // REGRA 5: Coragem Total + Impaciência para Resultados (CRÍTICO MODERADO)
   if (answer5 === "CORAGEM EU TENHO, SÓ PRECISO SABER SE FUNCIONA MESMO!" && 
       (answer1 === "Uma pontada de esperança, mas logo em seguida a dúvida de que seja possível pra mim." || answer2 === "Eu me sinto bem por alguns minutos, mas depois a realidade bate e eu desanimo.")) {
     return {
       archetype: "Visionária Impaciente e Instável",
       summary: "Sua coragem é admirável, mas sua impaciência e instabilidade emocional minam seus esforços. Você oscila entre a esperança e o desânimo com muita facilidade, o que impede a construção de uma base sólida para a manifestação. Resultados rápidos são seu foco, mas a falta de consistência e fé no processo te sabota.",
       keywords: ["Coragem Explosiva", "Impaciência Crônica", "Instabilidade Emocional", "Falta de Consistência", "Dúvida Recorrente"],
       idealPercentage: 40,
       missingForIdeal: "Falta desenvolver disciplina emocional e paciência estratégica. A manifestação consistente requer mais do que explosões de coragem; exige fé sustentada, mesmo quando os resultados demoram. Aprender a gerenciar suas expectativas e a manter o foco a longo prazo é essencial para você."
     };
   }

  // ARQUÉTIPO PADRÃO (Fallback - também crítico)
  return {
    archetype: "Exploradora Desorientada",
    summary: "Você está buscando respostas, mas parece não ter um direcionamento claro, o que dificulta qualquer progresso significativo. Suas respostas indicam uma falta de autoconhecimento profundo sobre seus reais bloqueios e potenciais, tornando sua jornada de manifestação confusa e pouco eficaz.",
    keywords: ["Desorientação", "Falta de Foco", "Autoconhecimento Superficial", "Procura Ineficaz", "Potencial Desperdiçado"],
    idealPercentage: 20,
    missingForIdeal: "Falta um mergulho profundo em seu autoconhecimento para identificar com clareza seus verdadeiros desejos, medos e crenças limitantes. Sem essa base, qualquer tentativa de manifestação será como atirar no escuro. É preciso definir um caminho e segui-lo com disciplina."
  };
};

function QuestionnaireContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Answer[]>([]);
  const [isNavigating, setIsNavigating] = useState(false);
  const [preQuestionnaireData, setPreQuestionnaireData] = useState<any>(null);

  useEffect(() => {
    // Captura dados do formulário de pré-questionário, se existirem
    const name = searchParams.get('name');
    const dob = searchParams.get('dob');
    const dreamsString = searchParams.get('dreams');
    if (name && dob && dreamsString) {
      try {
        const dreams = JSON.parse(dreamsString);
        setPreQuestionnaireData({ name, dob, dreams });
        // Você pode usar esses dados como quiser, por exemplo, logá-los
        console.log("Dados do formulário pré-questionário:", { name, dob, dreams });
      } catch (e) {
        console.error("Erro ao parsear sonhos dos query params:", e);
      }
    }
  }, [searchParams]);


  const handleAnswer = (question: Question, answer: string) => {
    const newAnswer = { questionId: question.id, questionText: question.question, answer };
    setUserAnswers(prev => [...prev, newAnswer]);
  };
  
  const handleQuestionProceed = () => {
    if (isNavigating) return; 

    const isLast = currentQuestionIndex === questions.length - 1;
    if (isLast) {
      setIsNavigating(true);
      const localAnalysisResult = generateLocalAnalysis(userAnswers);
      const analysisJsonString = JSON.stringify(localAnalysisResult);
      const analysisQueryParam = encodeURIComponent(analysisJsonString);
      
      // Mantém os dados do formulário de pré-questionário nos query params, se existirem
      const existingParams = new URLSearchParams(searchParams.toString());
      existingParams.set('analysis', analysisQueryParam);
      
      const targetUrl = `/results?${existingParams.toString()}`;
      console.log('Navigating to results:', targetUrl); 
      router.push(targetUrl);
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
}

export default function QuestionnairePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-950 via-black to-red-950"><Loader2 className="h-16 w-16 text-yellow-400 animate-spin" /></div>}>
      <QuestionnaireContent />
    </Suspense>
  );
}
