
"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { QuestionnaireScreen, questions, type Question } from '@/components/questionnaire-screen';
import type { BehavioralAnalysisOutput } from '@/ai/flows/behavioral-analysis-flow';
import { Loader2 } from 'lucide-react';
import type { DreamOption } from '@/components/pre-questionnaire-form-screen'; // Import DreamOption

interface Answer {
  questionId: number;
  questionText: string;
  answer: string;
}

interface PreQuestionnaireState {
  name: string;
  selectedDreams: DreamOption[]; // Array de objetos de sonho
  dreamsDate: string; // ID da opção de data
  dreamsDateLabel: string; // Label da opção de data
}

// REGRAS DE ANÁLISE COMPORTAMENTAL LOCAL (FOCO CRÍTICO)
const generateLocalAnalysis = (answers: Answer[]): BehavioralAnalysisOutput => {
  console.log("Respostas recebidas para análise:", JSON.stringify(answers, null, 2));

  const findAnswerText = (id: number): string | undefined => {
    return answers.find(a => a.questionId === id)?.answer;
  };

  const answer1 = findAnswerText(1);
  const answer2 = findAnswerText(2);
  const answer3 = findAnswerText(3);
  const answer4 = findAnswerText(4);
  const answer5 = findAnswerText(5);

  console.log("Valores das respostas extraídas:");
  console.log("Answer 1:", answer1);
  console.log("Answer 2:", answer2);
  console.log("Answer 3:", answer3);
  console.log("Answer 4:", answer4);
  console.log("Answer 5:", answer5);

  // Regra 1: Exaustão (MODIFICADA PARA TESTE - depende apenas da resposta 1)
  console.log("Testando Regra 1 (Modificada):");
  console.log(`Condição: answer1 === "Cansaço. Estou exausta de lutar e não ver resultados."`);
  console.log(`Resultado: ${answer1 === "Cansaço. Estou exausta de lutar e não ver resultados."}`);
  if (answer1 === "Cansaço. Estou exausta de lutar e não ver resultados.") {
    console.log("REGRA 1 (MODIFICADA) ATIVADA");
    return {
      archetype: "Auto-Sabotadora Exausta (TESTE)",
      summary: "TESTE: Sua exaustão é o ponto central aqui. A falta de energia e a crença de não ser digna te impedem de qualquer avanço real. É uma situação crítica que exige uma mudança radical de perspectiva interna.",
      keywords: ["Exaustão Crônica TESTE", "Não Merecimento", "Autossabotagem Profunda", "Ciclo Destrutivo", "Baixa Autoestima"],
      idealPercentage: 15,
      missingForIdeal: "TESTE: Falta urgentemente resgatar sua autoestima e senso de merecimento. A exaustão é um sintoma de uma luta interna prolongada contra suas próprias crenças limitantes. Você precisa de uma reestruturação completa da sua autoimagem."
    };
  }

  // Regra 2: Frustração e Inércia
  console.log("Testando Regra 2:");
  console.log(`Condição 1: answer1 === "Frustração, porque eu já tentei de tudo e nada parece funcionar de verdade." (Valor: ${answer1 === "Frustração, porque eu já tentei de tudo e nada parece funcionar de verdade."})`);
  console.log(`Condição 2: answer2 === "A vida continua exatamente a mesma, como se nada tivesse acontecido." (Valor: ${answer2 === "A vida continua exatamente a mesma, como se nada tivesse acontecido."})`);
  if (answer1 === "Frustração, porque eu já tentei de tudo e nada parece funcionar de verdade." &&
      answer2 === "A vida continua exatamente a mesma, como se nada tivesse acontecido.") {
    console.log("REGRA 2 ATIVADA");
    return {
      archetype: "Buscadora Desiludida",
      summary: "Sua frustração acumulada por tentativas fracassadas gerou uma inércia paralisante. A sensação de que 'nada funciona' revela um desalinhamento grave com as verdadeiras leis da manifestação ou uma resistência interna em aplicar métodos eficazes de forma consistente. Você está estagnada e a desilusão impede novas tentativas sérias.",
      keywords: ["Frustração Crônica", "Inércia Paralisante", "Desalinhamento Energético", "Resistência à Mudança", "Descrença"],
      idealPercentage: 25,
      missingForIdeal: "Falta abandonar a mentalidade de vítima das circunstâncias e dos 'métodos que não funcionam'. É crucial identificar a raiz da sua resistência interna e se comprometer com uma única abordagem comprovada, superando a descrença alimentada por fracassos passados. A responsabilidade pela mudança é sua."
    };
  }
  
  // Regra 3: Medo e Comparação
  console.log("Testando Regra 3:");
  console.log(`Condição 1: answer5 === "Talvez... mas tenho medo de me frustrar mais uma vez." (Valor: ${answer5 === "Talvez... mas tenho medo de me frustrar mais uma vez."})`);
  console.log(`Condição 2: answer3 === "Não sei if é um bloqueio, mas sinto que não tenho a mesma 'sorte' que os outros." (Valor: ${answer3 === "Não sei if é um bloqueio, mas sinto que não tenho a mesma 'sorte' que os outros."})`);
  if (answer5 === "Talvez... mas tenho medo de me frustrar mais uma vez." &&
      answer3 === "Não sei if é um bloqueio, mas sinto que não tenho a mesma 'sorte' que os outros.") {
    console.log("REGRA 3 ATIVADA");
    return {
      archetype: "Cética Medrosa",
      summary: "O medo paralisante de novas frustrações e a crença de que a 'sorte' é um fator externo te mantêm refém do ceticismo. Embora haja uma pequena chama de esperança, ela é constantemente apagada pela sua aversão ao risco e pela comparação com os outros. Seu progresso é mínimo devido a essa postura defensiva.",
      keywords: ["Medo de Fracassar", "Ceticismo Excessivo", "Comparação Destrutiva", "Falta de Iniciativa", "Mentalidade de Escassez"],
      idealPercentage: 35,
      missingForIdeal: "Falta desenvolver resiliência emocional para encarar possíveis contratempos como aprendizado, e não como confirmação de seus medos. É preciso parar de se comparar e entender que a 'sorte' é, em grande parte, criada por ação consistente e mentalidade positiva, ambas ausentes no seu caso."
    };
  }
  
  // Regra 4: Inveja e Injustiça
  console.log("Testando Regra 4:");
  console.log(`Condição 1: answer1 === "Inveja (mesmo que eu não admita) de outras mulheres que parecem ter tudo." (Valor: ${answer1 === "Inveja (mesmo que eu não admita) de outras mulheres que parecem ter tudo."})`);
  console.log(`Condição 2: answer4 === "Sim, mas sinto que o mundo é injusto e não me dá o que eu mereço." (Valor: ${answer4 === "Sim, mas sinto que o mundo é injusto e não me dá o que eu mereço."})`);
  if (answer1 === "Inveja (mesmo que eu não admita) de outras mulheres que parecem ter tudo." &&
      answer4 === "Sim, mas sinto que o mundo é injusto e não me dá o que eu mereço.") {
    console.log("REGRA 4 ATIVADA");
    return {
      archetype: "Reivindicadora Amargurada",
      summary: "A inveja e o forte sentimento de injustiça são venenos que corroem sua capacidade de manifestação. Essa mentalidade de escassez e ressentimento te coloca em uma vibração extremamente baixa, repelindo ativamente o que você deseja. Você está mais focada no que os outros têm do que em cultivar suas próprias conquistas.",
      keywords: ["Inveja Corrosiva", "Sentimento de Injustiça", "Ressentimento", "Mentalidade de Vítima", "Vibração Baixa"],
      idealPercentage: 10,
      missingForIdeal: "Falta uma transformação radical de foco: da escassez e da vida alheia para a abundância interna e gratidão pelo que você já tem. Curar a amargura e o ressentimento é o primeiro passo. Assumir 100% de responsabilidade por sua realidade, em vez de culpar o 'mundo injusto', é crucial."
    };
  }

  // Regra 5: Coragem com Impaciência e Instabilidade
  console.log("Testando Regra 5:");
  console.log(`Condição 1: answer5 === "CORAGEM EU TENHO, SÓ PRECISO SABER SE FUNCIONA MESMO!" (Valor: ${answer5 === "CORAGEM EU TENHO, SÓ PRECISO SABER SE FUNCIONA MESMO!"})`);
  console.log(`Condição 2a: answer1 === "Uma pontada de esperança, mas logo em seguida a dúvida de que seja possível pra mim." (Valor: ${answer1 === "Uma pontada de esperança, mas logo em seguida a dúvida de que seja possível pra mim."})`);
  console.log(`Condição 2b: answer2 === "Eu me sinto bem por alguns minutos, mas depois a realidade bate e eu desanimo." (Valor: ${answer2 === "Eu me sinto bem por alguns minutos, mas depois a realidade bate e eu desanimo."})`);
   if (answer5 === "CORAGEM EU TENHO, SÓ PRECISO SABER SE FUNCIONA MESMO!" && 
       (answer1 === "Uma pontada de esperança, mas logo em seguida a dúvida de que seja possível pra mim." || answer2 === "Eu me sinto bem por alguns minutos, mas depois a realidade bate e eu desanimo.")) {
    console.log("REGRA 5 ATIVADA");
     return {
       archetype: "Visionária Impaciente e Instável",
       summary: "Sua coragem é admirável, mas sua impaciência e instabilidade emocional minam seus esforços. Você oscila entre a esperança e o desânimo com muita facilidade, o que impede a construção de uma base sólida para a manifestação. Resultados rápidos são seu foco, mas a falta de consistência e fé no processo te sabota.",
       keywords: ["Coragem Explosiva", "Impaciência Crônica", "Instabilidade Emocional", "Falta de Consistência", "Dúvida Recorrente"],
       idealPercentage: 40,
       missingForIdeal: "Falta desenvolver disciplina emocional e paciência estratégica. A manifestação consistente requer mais do que explosões de coragem; exige fé sustentada, mesmo quando os resultados demoram. Aprender a gerenciar suas expectativas e a manter o foco a longo prazo é essencial para você."
     };
   }

  // ARQUÉTIPO PADRÃO (Fallback - também crítico)
  console.log("Nenhuma regra específica foi ativada. Usando arquétipo de fallback.");
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
  const [preQuestionnaireData, setPreQuestionnaireData] = useState<PreQuestionnaireState | null>(null);

  useEffect(() => {
    const name = searchParams.get('name');
    const selectedDreamsDataString = searchParams.get('selectedDreamsData'); // Objetos DreamOption como string JSON
    const dreamsDate = searchParams.get('dreamsDate'); // ID da opção de data
    const dreamsDateLabel = searchParams.get('dreamsDateLabel'); // Label da opção de data
    
    if (name && selectedDreamsDataString && dreamsDate && dreamsDateLabel) {
      try {
        const selectedDreams: DreamOption[] = JSON.parse(selectedDreamsDataString); 
        const newPreQuestionnaireData: PreQuestionnaireState = { name, selectedDreams, dreamsDate, dreamsDateLabel };
        setPreQuestionnaireData(newPreQuestionnaireData);
        console.log("Dados do formulário pré-questionário recebidos (questionnaire page):", newPreQuestionnaireData);
      } catch (e) {
        console.error("Erro ao parsear dados dos query params (questionnaire):", e);
      }
    } else {
        console.warn("Dados do formulário pré-questionário não encontrados ou incompletos nos query params.");
    }
  }, [searchParams]);


  const handleAnswer = (question: Question, answer: string) => {
    const newAnswer = { questionId: question.id, questionText: question.question, answer };
    setUserAnswers(prev => {
      // Remove a resposta anterior para esta pergunta, se houver
      const filteredAnswers = prev.filter(a => a.questionId !== question.id);
      return [...filteredAnswers, newAnswer];
    });
  };
  
  const handleQuestionProceed = () => {
    if (isNavigating) return; 

    const isLast = currentQuestionIndex === questions.length - 1;
    if (isLast) {
      setIsNavigating(true);
      console.log("Finalizando questionário. Respostas do usuário:", JSON.stringify(userAnswers, null, 2));
      const localAnalysisResult = generateLocalAnalysis(userAnswers);
      console.log("Resultado da análise local:", JSON.stringify(localAnalysisResult, null, 2));
      const analysisJsonString = JSON.stringify(localAnalysisResult);
      
      const queryParams = new URLSearchParams();
      if (preQuestionnaireData) {
        queryParams.set('name', preQuestionnaireData.name);
        queryParams.set('selectedDreamsData', JSON.stringify(preQuestionnaireData.selectedDreams));
        queryParams.set('dreamsDate', preQuestionnaireData.dreamsDate); // ID da data
        queryParams.set('dreamsDateLabel', preQuestionnaireData.dreamsDateLabel); // Label da data
      }
      queryParams.set('analysis', analysisJsonString); 
      
      const targetUrl = `/results?${queryParams.toString()}`;
      console.log('Navegando para a página de resultados com todos os dados:', targetUrl); 
      router.push(targetUrl);
    } else {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    }
  };

  const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;
  const currentQuestionData = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  // Encontrar a resposta já selecionada para a pergunta atual, se houver
  const currentAnswer = userAnswers.find(ans => ans.questionId === currentQuestionData.id)?.answer;


  return (
    <QuestionnaireScreen
      question={currentQuestionData}
      onAnswer={(answer) => handleAnswer(currentQuestionData, answer)}
      progress={progressPercentage}
      isLastQuestion={isLastQuestion}
      onComplete={handleQuestionProceed}
      currentAnswer={currentAnswer} // Passar a resposta atual para o componente QuestionnaireScreen
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
    

    