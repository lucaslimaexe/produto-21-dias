
"use client";

import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Sparkles, MessageCircle, Loader2 } from 'lucide-react';

export interface Question {
  id: number;
  question: string;
  options: string[];
  feedback: string;
}

interface QuestionnaireScreenProps {
  question: Question;
  onAnswer: (answer: string) => void; 
  progress: number;
  isLastQuestion: boolean;
  onComplete: () => void; 
}

export const questions: Question[] = [
  {
    id: 1,
    question: "Quando você pensa na vida que deseja, o que você sente com mais força?",
    options: [
      "Uma pontada de esperança, mas logo em seguida a dúvida de que seja possível pra mim.",
      "Frustração, porque eu já tentei de tudo e nada parece funcionar de verdade.",
      "Inveja (mesmo que eu não admita) de outras mulheres que parecem ter tudo.",
      "Cansaço. Estou exausta de lutar e não ver resultados."
    ],
    feedback: "✨ INTERESSANTE... SUA HONESTIDADE É O PRIMEIRO PASSO. ✨"
  },
  {
    id: 2,
    question: "Você se esforça, faz afirmação, visualiza... e no fim do dia, o que acontece?",
    options: [
      "A vida continua exatamente a mesma, como se nada tivesse acontecido.",
      "Eu me sinto bem por alguns minutos, mas depois a realidade bate e eu desanimo.",
      "Às vezes até piora, como se o universo estivesse rindo da minha cara.",
      "Eu esqueço de fazer a maior parte do tempo, a rotina me engole."
    ],
    feedback: "🎯 OK, ESTOU COMEÇANDO A VER UM PADRÃO AQUI. 🎯"
  },
  {
    id: 3,
    question: "Você já sentiu que existe algo 'bloqueando' seu sucesso, algo que você não consegue ver?",
    options: [
      "Sim, o tempo todo. Parece uma parede invisível que me impede de avançar.",
      "Às vezes. Sinto que quando estou quase lá, algo me puxa pra trás.",
      "Não sei se é um bloqueio, mas sinto que não tenho a mesma 'sorte' que os outros.",
      "Sim, e desconfio que os métodos que ensinam por aí são incompletos de propósito."
    ],
    feedback: "🔥 BINGO! AGORA ESTAMOS CHEGANDO NA RAIZ DO PROBLEMA. 🔥"
  },
  {
    id: 4,
    question: "Seja honesta: No fundo, você se sente 100% merecedora de tudo que sonha?",
    options: [
      "Honestamente? Não. Uma parte de mim acha que não é pra mim.",
      "Eu tento acreditar que sim, mas a dúvida sempre aparece.",
      "Eu me sinto merecedora, mas acho que não sou capaz de conseguir.",
      "Sim, mas sinto que o mundo é injusto e não me dá o que eu mereço."
    ],
    feedback: "💎 A VERDADE DÓI, MAS LIBERTA. ESTA É A CHAVE. 💎"
  },
  {
    id: 5,
    question: "Se existisse um MÉTODO REAL para destravar tudo isso em 21 dias, você teria a CORAGEM de usar?",
    options: [
      "Sim, estou desesperada por uma solução que funcione de verdade.",
      "Talvez... mas tenho medo de me frustrar mais uma vez.",
      "Não sei, já gastei tanto dinheiro com promessas vazias...",
      "CORAGEM EU TENHO, SÓ PRECISO SABER SE FUNCIONA MESMO!"
    ],
    feedback: "🔑 SUA DECISÃO FINAL REVELARÁ MUITO... PREPARE-SE! 🔑"
  }
];


export const QuestionnaireScreen: React.FC<QuestionnaireScreenProps> = ({ question, onAnswer, progress, isLastQuestion, onComplete }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false); // Used to show loader and disable options

  useEffect(() => {
    setSelectedOption(null);
    setShowFeedback(false);
    setIsProcessing(false);
  }, [question.id]);

  const handleSelectOption = (option: string) => {
    if (isProcessing || showFeedback) return;

    setSelectedOption(option);
    onAnswer(option); 
    setShowFeedback(true);
    setIsProcessing(true); // Start "processing"

    setTimeout(() => {
      // setShowFeedback(false); // Feedback will be hidden by question change
      // setIsProcessing(false); // Processing also ends with question change
      onComplete(); 
    }, 2000); 
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative bg-gradient-to-br from-purple-900 via-indigo-900 to-black overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-24 h-24 md:w-32 md:h-32 bg-purple-500/20 rounded-full animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-16 h-16 md:w-24 md:h-24 bg-yellow-400/20 rounded-full animate-pulse [animation-delay:1s]"></div>
      </div>
      
      <div className="w-full max-w-2xl bg-black/70 backdrop-blur-md border-2 border-purple-500 shadow-2xl rounded-3xl p-6 sm:p-8 md:p-10">
        <div className="mb-6">
          <Progress value={progress} className="w-full h-3 bg-purple-700/50 border border-purple-500 [&>div]:bg-gradient-to-r [&>div]:from-yellow-400 [&>div]:to-pink-500" />
          <p className="text-center text-sm text-yellow-300 mt-2">PERGUNTA {question.id} DE {questions.length}</p>
        </div>

        <div className="bg-purple-900/30 p-6 rounded-xl border border-purple-700 mb-6 min-h-[300px] flex flex-col justify-center">
          {!showFeedback && !isProcessing && (
            <>
              <h2 className="font-headline text-xl sm:text-2xl md:text-3xl font-semibold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-300 leading-tight">
                {question.question}
              </h2>
              <div className="space-y-3 sm:space-y-4">
                {question.options.map((option, index) => (
                  <Button
                    key={index}
                    variant={selectedOption === option ? "default" : "outline"}
                    onClick={() => handleSelectOption(option)}
                    disabled={isProcessing || showFeedback}
                    className={`w-full text-left justify-start p-4 h-auto text-sm sm:text-base leading-normal whitespace-normal transition-all duration-300 ease-in-out
                      ${selectedOption === option 
                        ? 'bg-gradient-to-r from-yellow-500 to-pink-600 text-white border-transparent ring-2 ring-yellow-300 shadow-lg scale-105' 
                        : 'bg-purple-800/50 border-purple-600 hover:bg-purple-700/70 hover:border-purple-400 text-purple-200 hover:text-white hover:scale-102'
                      }
                      ${(isProcessing || showFeedback) && selectedOption !== option ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                  >
                    <Sparkles className={`mr-2 h-4 w-4 sm:h-5 sm:w-5 ${selectedOption === option ? 'text-yellow-300' : 'text-purple-400'}`} />
                    {option}
                  </Button>
                ))}
              </div>
            </>
          )}

          {(showFeedback || isProcessing) && (
            <div className="text-center animate-fade-in flex flex-col items-center justify-center">
              <MessageCircle className="h-10 w-10 text-yellow-400 mx-auto mb-4 animate-pulse" />
              <p className="text-yellow-300 font-semibold text-lg sm:text-xl mb-4">{question.feedback}</p>
              {isProcessing && <Loader2 className="h-8 w-8 text-yellow-400 animate-spin mt-4" />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
