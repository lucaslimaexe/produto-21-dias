
"use client";

import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { AlertTriangle, Clock, Zap, Eye, ExternalLink, XCircle, Sparkles, CheckCircle2, Unlock, Brain, HeartHandshake, TrendingUp, Quote, UserCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import Image from 'next/image';

interface ResultsScreenProps {
  onRestart: () => void;
}

const testimonials = [
  {
    name: "Maria S.",
    quote: "Eu estava perdida, tentando de tudo sem resultado. O Código da Deusa foi um divisor de águas. Em 21 dias, minha energia mudou, atraí um novo emprego e me sinto poderosa!",
    image: "https://placehold.co/80x80.png",
    aiHint: "woman smiling"
  },
  {
    name: "Juliana P.",
    quote: "Achava que manifestação era bobagem até encontrar esse método. Os bloqueios que eu nem sabia que tinha sumiram! Minha autoestima está nas alturas e meus relacionamentos melhoraram 100%.",
    image: "https://placehold.co/80x80.png",
    aiHint: "person portrait"
  },
  {
    name: "Fernanda L.",
    quote: "Depois de anos de frustração, finalmente entendi o que me impedia de prosperar. O Código da Deusa é direto ao ponto e REALMENTE funciona. Recomendo de olhos fechados!",
    image: "https://placehold.co/80x80.png",
    aiHint: "woman happy"
  }
];

const offerBenefits = [
  { text: "Desbloquear sua capacidade inata de manifestar desejos.", icon: Unlock },
  { text: "Reprogramar sua mente para o sucesso e a abundância.", icon: Brain },
  { text: "Elevar sua vibração energética e atrair o que você merece.", icon: TrendingUp },
  { text: "Curar crenças limitantes sobre dinheiro, amor e merecimento.", icon: HeartHandshake },
  { text: "Ativar seu poder pessoal e se tornar a Deusa da sua própria realidade.", icon: CheckCircle2 }
];

export const ResultsScreen: React.FC<ResultsScreenProps> = ({ onRestart }) => {
  const initialTime = 15 * 60; 
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isBlinking, setIsBlinking] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    toast({
      title: "🔥 Seu Diagnóstico Exclusivo Está Pronto!",
      description: "Veja como o Código da Deusa pode transformar sua realidade em 21 dias.",
      variant: "default",
      duration: 7000,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  useEffect(() => {
    if (timeLeft <= 0) return;
    const timerId = setInterval(() => {
      setTimeLeft(prevTime => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);
    return () => clearInterval(timerId);
  }, [timeLeft]);

  useEffect(() => {
    let blinkTimerId: NodeJS.Timeout | undefined;
    if (timeLeft > 0) {
      blinkTimerId = setInterval(() => setIsBlinking(prev => !prev), 700);
    } else {
      setIsBlinking(false);
    }
    return () => {
      if (blinkTimerId) clearInterval(blinkTimerId);
      setIsBlinking(false);
    };
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center px-4 py-8 relative bg-gradient-to-br from-red-950 via-purple-950 to-black overflow-y-auto">
      <div className="w-full max-w-4xl">
        
        <section className="animate-fade-in mb-8 sm:mb-12" style={{animationDuration: '0.5s'}}>
          <div className={`flex items-center justify-center space-x-3 bg-red-700/80 border-2 border-yellow-400 rounded-full px-6 py-3 sm:px-8 sm:py-4 shadow-xl ${isBlinking && timeLeft > 0 ? 'animate-pulse ring-4 ring-yellow-500/70' : ''}`}>
            <AlertTriangle className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-300 animate-bounce" />
            <span className="text-yellow-100 font-bold text-md sm:text-lg tracking-wider">🚨 SEU DIAGNÓSTICO FINAL CHEGOU 🚨</span>
            <Eye className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-300 animate-pulse" />
          </div>
        </section>

        <section className="animate-fade-in mb-8 sm:mb-12 bg-gradient-to-br from-black/70 via-red-900/60 to-purple-900/70 rounded-2xl p-6 sm:p-8 border-2 border-red-600/70 shadow-2xl" style={{animationDuration: '0.5s', animationDelay: '0.2s'}}>
          <h1 className="font-headline text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-center text-red-400">
            ALERTA MÁXIMO DE BLOQUEIO!
          </h1>
          <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6 text-center">
            <div className="text-lg sm:text-xl md:text-2xl">
              <span className="text-purple-300/80">NÍVEL DE PODER DE MANIFESTAÇÃO: </span>
              <span className="text-red-400 font-bold text-3xl sm:text-4xl md:text-5xl glow">17% </span>
              <span className="text-red-500 ml-1 sm:ml-2">(ZONA DE PERIGO)</span>
            </div>
            <div className="text-md sm:text-lg md:text-xl">
              <span className="text-purple-300/80">DIAGNÓSTICO PRECISO: </span>
              <span className="text-yellow-400 font-bold">
                SÍNDROME DA AUTOSSABOTAGEM CRÔNICA (NÍVEL AVANÇADO)
              </span>
            </div>
            <div className="text-red-400 font-semibold text-sm sm:text-lg">
              (PADRÕES NEGATIVOS PROFUNDAMENTE ARRAIGADOS)
            </div>
          </div>
        </section>

        <section className="animate-fade-in mb-8 sm:mb-12 text-left space-y-4 sm:space-y-6 p-4 sm:p-6 bg-black/60 rounded-xl border border-purple-700/50" style={{animationDuration: '0.5s', animationDelay: '0.4s'}}>
          <p className="text-md sm:text-lg leading-relaxed text-purple-200/90">
            "Alma poderosa, a verdade nua e crua é esta: <span className="text-red-400 font-semibold">você está presa em um ciclo vicioso de autossabotagem</span>. 
            Suas respostas revelam uma infecção profunda pelo <span className="text-yellow-400 font-semibold">'Vírus da Dúvida Paralisante'</span> e pelo <span className="text-yellow-400 font-semibold">'Malware da Procrastinação Destrutiva'</span>. 
            Esses 'programas' foram instalados por anos de condicionamento e métodos incompletos que só te frustraram."
          </p>
          <p className="text-md sm:text-lg leading-relaxed text-purple-200/90">
            "Eles te venderam sonhos, mas te esconderam o <span className="text-green-400 font-semibold">MAPA DA MINA</span>, as chaves reais para destravar os portais da abundância. 
            Você possui um potencial divino ilimitado, mas está tentando dirigir uma nave espacial com o manual de um patinete. É por isso que a vida parece uma luta constante e os resultados não vêm."
          </p>
          <div className="text-center py-4 sm:py-6">
            <p className="font-headline text-xl sm:text-2xl md:text-3xl font-bold goddess-text-gradient mb-2">
              CHEGA DE SOFRER! A CURA DEFINITIVA EXISTE. E É MAIS RÁPIDA DO QUE VOCÊ IMAGINA.
            </p>
          </div>
          <p className="text-md sm:text-lg leading-relaxed text-purple-200/90">
            "Existe um <span className="text-pink-400 font-semibold">PROTOCOLO DE ATIVAÇÃO QUÂNTICA</span>, 
            um programa intensivo de 21 dias que age como um 'reset' completo para sua mente e energia, 
            eliminando toda programação negativa e ativando seu verdadeiro DNA de Deusa Manifestadora. 
            Este é o <span className="goddess-text-gradient font-bold text-lg sm:text-xl">CÓDIGO DA DEUSA™</span>."
          </p>
        </section>

        <section className="animate-fade-in mb-8 sm:mb-12 p-6 sm:p-8 bg-purple-900/30 rounded-2xl border-2 border-purple-600" style={{animationDuration: '0.5s', animationDelay: '0.6s'}}>
          <h2 className="font-headline text-2xl sm:text-3xl text-center mb-6 goddess-text-gradient">Com o CÓDIGO DA DEUSA™ você vai...</h2>
          <ul className="space-y-4">
            {offerBenefits.map((item, index) => (
              <li key={index} className="flex items-start text-purple-200/90 text-md sm:text-lg">
                <item.icon className="h-6 w-6 mr-3 text-yellow-400 shrink-0 mt-1" />
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
        </section>
        
        <section className="animate-fade-in mb-8 sm:mb-12" style={{animationDuration: '0.5s', animationDelay: '0.8s'}}>
          <h2 className="font-headline text-2xl sm:text-3xl text-center mb-8 text-yellow-300">O Que Outras Deusas Despertas Estão Dizendo:</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-black/50 border-purple-700/70 text-purple-200/90 animate-fade-in" style={{animationDuration: '0.5s', animationDelay: `${1 + index * 0.2}s`}}>
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-3">
                    <Image data-ai-hint={testimonial.aiHint} src={testimonial.image} alt={testimonial.name} width={60} height={60} className="rounded-full border-2 border-yellow-400" />
                    <div>
                      <CardTitle className="text-lg text-yellow-300">{testimonial.name}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Quote className="h-5 w-5 text-purple-400 mb-2" />
                  <p className="italic text-sm sm:text-md leading-relaxed">"{testimonial.quote}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="animate-fade-in bg-gradient-to-r from-yellow-800/70 via-red-700/80 to-yellow-800/70 rounded-2xl p-6 sm:p-8 mb-6 sm:mb-8 border-2 border-yellow-500 shadow-2xl text-center sticky bottom-4 z-20 md:static" style={{animationDuration: '0.5s', animationDelay: '1.2s'}}>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-yellow-100 mb-3 sm:mb-4 animate-pulse [animation-duration:1.5s]">
            O PORTAL PARA SUA TRANSFORMAÇÃO FECHA EM BREVE!
          </h2>
          <div className="mb-4 sm:mb-6">
            <div className={`flex items-center justify-center space-x-2 mb-2 sm:mb-4 ${timeLeft < 60 && timeLeft > 0 ? 'text-red-400 animate-ping' : 'text-yellow-200'}`}>
              <Clock className="h-6 w-6 sm:h-8 sm:w-8" />
              <span className={`text-3xl sm:text-4xl md:text-6xl font-bold font-mono ${timeLeft === 0 ? 'text-red-600' : ''}`}>
                {formatTime(timeLeft)}
              </span>
              <Zap className={`h-6 w-6 sm:h-8 sm:w-8 ${timeLeft < 300 && timeLeft > 0 ? 'animate-spin' : ''}`} />
            </div>
            <div className="w-full bg-black/50 rounded-full h-3 sm:h-4 border border-yellow-600 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-red-500 via-yellow-400 to-orange-500 h-full rounded-full transition-all duration-1000 ease-linear"
                style={{ width: `${(timeLeft / initialTime) * 100}%` }}
              ></div>
            </div>
             {timeLeft === 0 && <p className="text-red-400 font-bold mt-2 text-sm sm:text-md">TEMPO ESGOTADO!</p>}
          </div>
          <Button
            asChild
            size="lg"
            className={`w-full sm:max-w-md mx-auto font-headline text-lg sm:text-xl px-8 sm:px-12 py-6 sm:py-7 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-200 pulse-goddess
            ${timeLeft === 0 ? 'bg-gray-600 hover:bg-gray-700 cursor-not-allowed opacity-70' : 'bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 hover:from-green-600 hover:via-emerald-600 hover:to-green-700 text-white'}`}
            disabled={timeLeft === 0}
          >
            <a href="https://pay.kiwify.com.br/xxxxxxxx" target="_blank" rel="noopener noreferrer">
              <Sparkles className="mr-2 h-5 w-5" />
              {timeLeft > 0 ? "SIM! QUERO ATIVAR O CÓDIGO DA DEUSA AGORA!" : "OFERTA EXPIRADA"}
              <ExternalLink className="ml-2 h-5 w-5" />
            </a>
          </Button>
           <p className="text-xs text-yellow-200/70 mt-3">Vagas ultra limitadas. Acesso imediato após confirmação.</p>
        </section>
        
        <section className="animate-fade-in text-center" style={{animationDuration: '0.5s', animationDelay: '1.4s'}}>
          <Button
            onClick={onRestart}
            variant="ghost"
            className="font-headline text-sm sm:text-md text-purple-300/70 hover:text-purple-200 hover:bg-purple-800/30 rounded-lg px-4 py-2"
          >
            <XCircle className="mr-2 h-4 w-4" />
            Não, obrigado. Prefiro continuar no ciclo de frustração.
          </Button>
        </section>
      </div>
    </div>
  );
};

    