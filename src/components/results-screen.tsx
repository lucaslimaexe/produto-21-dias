
"use client";

import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { AlertTriangle, Clock, Zap, ExternalLink, XCircle, Wand2, BarChartBig, Brain, TrendingUp, Unlock, HeartHandshake, CheckCircle2, Palette, Quote, Target, Activity, ShieldOff, RouteOff } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import Image from 'next/image';
import { Progress } from "@/components/ui/progress";


export interface BehavioralAnalysisData {
  archetype: string;
  summary: string;
  keywords: string[];
  idealPercentage: number;
  missingForIdeal: string;
}

interface ResultsScreenProps {
  onRestart: () => void;
  analysisResult?: BehavioralAnalysisData;
  analysisError?: string;
}

const testimonials = [
  {
    name: "Maria S., 38 anos",
    location: "São Paulo",
    transformation: "TRANSFORMAÇÃO FINANCEIRA",
    quote: "Eu estava endividada, sem esperança. Em 15 dias com o Código da Deusa, recebi uma proposta de emprego que triplicou minha renda! É inacreditável! Minha vida financeira explodiu!",
    image: "https://placehold.co/120x120.png",
    aiHint: "woman success"
  },
  {
    name: "Ana L., 45 anos",
    location: "Rio de Janeiro",
    transformation: "TRANSFORMAÇÃO AMOROSA",
    quote: "Depois de anos sozinha, sem fé no amor, apliquei o método. Em menos de uma semana, conheci o homem da minha vida. É como se o universo tivesse me entregado ele de bandeja! Adeus solidão!",
    image: "https://placehold.co/120x120.png",
    aiHint: "woman happy love"
  },
  {
    name: "Carla P., 29 anos",
    location: "Belo Horizonte",
    transformation: "TRANSFORMAÇÃO PROFISSIONAL",
    quote: "Meu negócio estava estagnado. Com as práticas do ebook, em 21 dias, minhas vendas explodiram! Eu não acreditaria se não tivesse vivido. É poder puro! Meu negócio decolou!",
    image: "https://placehold.co/120x120.png",
    aiHint: "businesswoman achievement"
  }
];

const codeBenefits = [
  { text: "O Reset Mental: Por que focar só em pensamento positivo é inútil se você não limpar seu espaço interno e praticar a aceitação do que é agora. (Dia 3 e 4)", icon: Brain },
  { text: "O Upgrade da Autoresponsabilidade: Como a autoresponsabilidade te tira do papel de vítima e te dá o controle total sobre sua experiência interna. (Dia 9)", icon: ShieldCheck },
  { text: "A Ação Alinhada (O Caminho Sem Esforço): A diferença brutal entre ação desesperada e ação alinhada, e como a segunda faz o universo conspirar a seu favor. (Dia 11)", icon: TrendingUp },
  { text: "O GPS da Clareza: Como a clareza sobre o que você realmente quer (e por que quer) é o GPS que guia a manifestação. (Dia 12)", icon: Palette },
  { text: "O Escudo da Confiança: Por que a confiança e o soltar o controle são mais importantes que a força bruta para permitir que o universo entregue. (Dia 13 e 15)", icon: Unlock },
  { text: "O Multiplicador de Milagres: Como a gratidão e o amor-próprio elevam sua vibração a um nível que atrai milagres. (Dia 16 e 17)", icon: HeartHandshake },
  { text: "O Poder da Repetição: O segredo simples para consolidar novos hábitos e reprogramar sua realidade. (Dia 8)", icon: BarChartBig }
];


export const ResultsScreen: React.FC<ResultsScreenProps> = ({ onRestart, analysisResult, analysisError }) => {
  const initialTime = 15 * 60; 
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isBlinking, setIsBlinking] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (analysisResult && !analysisError) {
      toast({
        title: "🔥 Seu Diagnóstico Comportamental Crítico Chegou!",
        description: "Descubra os bloqueios brutais que te impedem e como o Código da Deusa pode ser sua única saída.",
        variant: "destructive", 
        duration: 8000,
      });
    } else if (analysisError) {
       toast({
        title: "⚠️ Erro na Análise",
        description: analysisError || "Não foi possível carregar sua análise. A página de resultados padrão será exibida.",
        variant: "destructive",
        duration: 8000,
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [analysisResult, analysisError]);


  useEffect(() => {
    if (timeLeft <= 0) {
       setIsBlinking(false);
       return;
    }
    const timerId = setInterval(() => {
      setTimeLeft(prevTime => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);
    
    if (timeLeft > 0 && timeLeft <= 60) { // Start blinking only in the last minute
        const blinkTimerId = setInterval(() => setIsBlinking(prev => !prev), 500);
        return () => {
            clearInterval(timerId);
            clearInterval(blinkTimerId);
        };
    }


    return () => {
      clearInterval(timerId);
    };
  }, [timeLeft]);


  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  const getPercentageColor = (percentage: number) => {
    if (percentage <= 25) return "bg-red-600";
    if (percentage <= 50) return "bg-yellow-500";
    if (percentage <= 75) return "bg-yellow-400";
    return "bg-green-500"; // Should not happen with critical feedback
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center px-4 py-12 relative bg-gradient-to-br from-purple-950 via-black to-red-950 overflow-y-auto text-foreground">
      <div className="w-full max-w-5xl space-y-12 md:space-y-16">
        
        {analysisResult && (
          <section className="animate-fade-in bg-gradient-to-br from-red-900/80 via-black to-purple-900/80 rounded-3xl p-6 sm:p-8 lg:p-10 border-2 border-red-500/70 shadow-2xl text-center" style={{animationDuration: '0.7s', animationDelay: '0s'}}>
            <div className="flex justify-center items-center gap-3 mb-6">
              <AlertTriangle className="h-12 w-12 text-red-400" />
              <h2 className="font-headline text-2xl sm:text-3xl md:text-4xl font-bold text-red-300 leading-tight">
                Seu Diagnóstico Comportamental CRÍTICO
              </h2>
              <AlertTriangle className="h-12 w-12 text-red-400" />
            </div>

            <p className="text-xl sm:text-2xl text-yellow-300 font-semibold mb-2">
              Seu Arquétipo Dominante (Problemático): <span className="text-pink-400">{analysisResult.archetype}</span>
            </p>
            <p className="text-md sm:text-lg text-red-200/90 leading-relaxed mb-6 max-w-3xl mx-auto">
              {analysisResult.summary}
            </p>

            <div className="mb-6">
              <p className="text-red-300/80 text-sm font-medium mb-2">Principais Fraquezas e Bloqueios Identificados:</p>
              <div className="flex flex-wrap justify-center gap-2">
                {analysisResult.keywords.map((keyword, index) => (
                  <span key={index} className="bg-red-700/60 text-yellow-200 text-xs font-semibold px-3 py-1 rounded-full border border-red-500/80">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="bg-black/50 p-4 rounded-lg border border-yellow-500/50 mb-6">
                <p className="text-lg sm:text-xl text-yellow-300 font-semibold mb-2">
                    Nível de Alinhamento Atual com Seu Potencial Máximo: 
                    <span className={`ml-2 text-2xl font-bold ${analysisResult.idealPercentage <= 30 ? 'text-red-400' : 'text-yellow-400'}`}>
                        {analysisResult.idealPercentage}% (Estado Crítico)
                    </span>
                </p>
                <Progress value={analysisResult.idealPercentage} className={`w-full h-4 border border-yellow-600/50 [&>div]:${getPercentageColor(analysisResult.idealPercentage)}`} />
                {analysisResult.idealPercentage <= 30 && <p className="text-red-400 text-sm mt-1">Este nível é alarmantemente baixo e requer atenção imediata.</p>}
            </div>

            <div className="bg-purple-900/30 p-6 rounded-xl border border-purple-600">
                <h3 className="text-xl sm:text-2xl text-pink-400 font-semibold mb-3 flex items-center justify-center">
                    <RouteOff className="h-7 w-7 mr-2 text-pink-500"/> O Que te IMPEDE de Alcançar Seu Poder Total:
                </h3>
                <p className="text-md sm:text-lg text-purple-200/90 leading-relaxed max-w-3xl mx-auto">
                    {analysisResult.missingForIdeal}
                </p>
            </div>
          </section>
        )}
        {analysisError && !analysisResult && (
           <section className="animate-fade-in bg-red-900/70 rounded-3xl p-6 sm:p-8 lg:p-10 border-2 border-red-500/60 shadow-2xl text-center" style={{animationDuration: '0.7s', animationDelay: '0s'}}>
            <div className="flex justify-center items-center gap-3 mb-4">
              <AlertTriangle className="h-10 w-10 text-yellow-300" />
              <h2 className="font-headline text-2xl sm:text-3xl md:text-4xl font-bold text-yellow-300 leading-tight">
                Aviso sobre a Análise
              </h2>
            </div>
            <p className="text-md sm:text-lg text-red-200/90 leading-relaxed mb-4 max-w-3xl mx-auto">
              {analysisError} Mostraremos a página de resultados padrão.
            </p>
          </section>
        )}

        <hr className="border-purple-700/50 my-8 md:my-12" />

        {/* SEÇÃO 1: A DOR E A CONSPIRAÇÃO */}
        <section className="animate-fade-in text-center md:text-left" style={{animationDuration: '0.7s', animationDelay: '0.4s'}}>
          <div className="md:flex md:items-center md:gap-8">
            <div className="mb-6 md:mb-0 md:w-1/3 flex justify-center">
              <Image 
                data-ai-hint="woman frustrated"
                src="https://placehold.co/400x400.png" 
                alt="Mulher Frustrada" 
                width={300} 
                height={300} 
                className="rounded-lg shadow-2xl border-2 border-purple-700/50"
              />
            </div>
            <div className="md:w-2/3">
              <h2 className="font-headline text-2xl sm:text-3xl md:text-4xl font-bold mb-6 goddess-text-gradient leading-tight">
                Você Sente Que Algo Te Impede de Avançar?
              </h2>
              <p className="text-md sm:text-lg leading-relaxed text-purple-200/90 mb-4">
                Querida mulher, sinta por um momento... essa sensação de que algo te impede de avançar. Você já tentou de tudo, não é? Leu os livros, seguiu os gurus, fez todas as visualizações... mas a vida que você tanto sonha, a realização plena, parece sempre fora de alcance. Parece que você está presa num ciclo, repetindo os mesmos erros, enquanto outras mulheres conquistam tudo. Você se sente frustrada, exausta, talvez até um pouco enganada pelos métodos que prometem o mapa do tesouro, mas te deixam perdida.
              </p>
              <p className="text-md sm:text-lg leading-relaxed text-purple-200/90 mb-4">
                A verdade é que existe um <span className="text-red-400 font-semibold text-xl">BLOQUEIO</span> no sistema. Um código oculto que foi deliberadamente programado para te manter na estagnação. Eles não querem que você descubra seu verdadeiro poder. Eles querem que você continue comprando os 'cursos' e 'treinamentos' que não funcionam, enquanto a chave para sua abundância e felicidade está adormecida dentro de você. Os 'métodos' que você conhece são apenas a ponta do iceberg, projetados para te manter na busca eterna, sem nunca alcançar a plenitude.
              </p>
              <p className="text-yellow-400 font-semibold text-lg sm:text-xl">
                Mas o tempo para quebrar esse BLOQUEIO está acabando. A janela para essa REVELAÇÃO está se fechando. E rápido.
              </p>
            </div>
          </div>
        </section>

        <hr className="border-purple-700/50 my-8 md:my-12" />

        {/* SEÇÃO 2: A REVELAÇÃO: O CÓDIGO DA DEUSA */}
        <section className="animate-fade-in text-center" style={{animationDuration: '0.7s', animationDelay: '1.0s'}}>
          <div className="mb-8 flex justify-center">
             <Image 
                data-ai-hint="binary code transformation"
                src="https://placehold.co/600x300.png" 
                alt="Código Binário se Transformando" 
                width={500} 
                height={250} 
                className="rounded-lg shadow-2xl border-2 border-accent/70"
              />
          </div>
          <h1 className="font-headline text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 goddess-text-gradient leading-tight">
            Prepare-se para a sua MAIOR DESCOBERTA:
          </h1>
          <h2 className="font-headline text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-yellow-300 bg-black/50 p-4 rounded-xl border border-yellow-500/70 inline-block">
            O CÓDIGO DA DEUSA™: 21 DIAS PARA REESCREVER SEU DESTINO.
          </h2>
          <p className="text-md sm:text-lg leading-relaxed text-purple-200/90 max-w-3xl mx-auto mb-4">
            Este não é mais um 'guia' genérico. Não é mais uma 'fórmula' que não resolve nada. É a <span className="text-pink-400 font-semibold">REVELAÇÃO</span>. É o mapa completo que desmascara o BLOQUEIO e te dá o CÓDIGO que faltava pra você <span className="text-green-400 font-bold">COMANDAR</span> a porra da sua vida. Em apenas 21 dias, você vai passar por uma iniciação intensiva que vai reprogramar sua mente, sua energia e suas ações. Você vai aprender, dia após dia, a ativar as leis internas que realmente fazem a manifestação acontecer, de forma <span className="text-yellow-400 font-semibold">INEVITÁVEL</span>.
          </p>
          <p className="font-headline text-xl sm:text-2xl text-center my-8 text-purple-300">Você vai DESBLOQUEAR o que eles não querem que você saiba:</p>
          <div className="grid md:grid-cols-2 gap-x-8 gap-y-6 max-w-4xl mx-auto text-left">
            {codeBenefits.map((item, index) => (
              <div key={index} className="flex items-start p-4 bg-purple-900/40 rounded-lg border border-purple-700/60 hover:shadow-purple-500/30 shadow-lg transition-shadow">
                <item.icon className="h-8 w-8 mr-4 text-yellow-400 shrink-0 mt-1" />
                <p className="text-purple-200/95 text-sm sm:text-md leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
          <p className="text-md sm:text-lg leading-relaxed text-purple-200/90 max-w-3xl mx-auto mt-8 mb-4">
            Este ebook te dá a anatomia completa da manifestação, dia após dia, por 21 dias. É prático, é direto, é baseado na porra da experiência real (como a Amanda conta na Introdução) e no que realmente funciona. Não é teoria. É <span className="text-accent font-bold text-xl">TREINAMENTO DE ELITE</span>.
          </p>
        </section>

        <hr className="border-purple-700/50 my-8 md:my-12" />

        {/* SEÇÃO 3: AS PROVAS IRREFUTÁVEIS */}
        <section className="animate-fade-in" style={{animationDuration: '0.7s', animationDelay: '1.6s'}}>
          <h2 className="font-headline text-3xl sm:text-4xl text-center mb-10 goddess-text-gradient">Veja o que mulheres como você estão CONQUISTANDO com o CÓDIGO DA DEUSA™:</h2>
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-black/60 border-purple-700/80 text-purple-200/90 shadow-xl hover:shadow-purple-600/40 transition-shadow duration-300 flex flex-col">
                <CardHeader className="pb-4 items-center text-center">
                  <Image data-ai-hint={testimonial.aiHint} src={testimonial.image} alt={testimonial.name} width={100} height={100} className="rounded-full border-4 border-yellow-400 mb-3" />
                  <CardTitle className="text-xl text-yellow-300">{testimonial.name}</CardTitle>
                  <p className="text-xs text-purple-400">{testimonial.location}</p>
                  <p className="text-sm font-semibold text-pink-400 mt-1">{testimonial.transformation}</p>
                </CardHeader>
                <CardContent className="flex-grow">
                  <Quote className="h-6 w-6 text-purple-500 mb-2 transform scale-x-[-1]" />
                  <p className="italic text-sm sm:text-md leading-relaxed">"{testimonial.quote}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
           <div className="flex justify-center mt-8">
             <Image 
                data-ai-hint="women success celebration"
                src="https://placehold.co/700x200.png" 
                alt="Mulheres Felizes e Realizadas" 
                width={600} 
                height={171} 
                className="rounded-lg shadow-xl border-2 border-accent/50"
              />
          </div>
        </section>

        <hr className="border-purple-700/50 my-8 md:my-12" />

        {/* SEÇÃO 4: A OFERTA IRRECUSÁVEL */}
        <section className="animate-fade-in bg-gradient-to-br from-red-800/80 via-black to-purple-900/80 rounded-3xl p-6 sm:p-8 lg:p-12 mb-6 sm:mb-8 border-4 border-yellow-500 shadow-2xl text-center" style={{animationDuration: '0.7s', animationDelay: '2.2s'}}>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-yellow-200 mb-3 sm:mb-4 animate-pulse [animation-duration:1.2s]">
            Chega de ser feita de otária. Chega de ver seus sonhos no ralo enquanto outros vendem ilusão.
          </h2>
          <p className="text-lg sm:text-xl text-red-300 mb-6">Esta é a sua <span className="font-bold underline">ÚLTIMA CHANCE</span> de pegar o atalho ético para a vida que você deseja. O CÓDIGO DA DEUSA™ não é para todas. É para as mulheres que estão cansadas de serem enganadas, que têm coragem de encarar a verdade e que estão prontas para <span className="font-bold text-2xl">COMANDAR</span>.</p>
          
          <div className="bg-black/70 border-2 border-red-500 rounded-xl p-4 sm:p-6 mb-6">
            <h3 className="text-red-400 font-bold text-xl sm:text-2xl mb-2">🚨 ALERTA FINAL: Restam APENAS 3 VAGAS! 🚨</h3>
            <p className="text-yellow-300 text-sm sm:text-md">E quando elas acabarem, o preço vai subir. Não sabemos quando teremos outra oportunidade como essa.</p>
          </div>

          <p className="text-purple-200/90 text-lg sm:text-xl mb-2">O valor real deste conhecimento, que vai mudar sua vida para sempre, é de <span className="line-through text-red-500/80">R$ 1.997,00</span>.</p>
          <p className="text-purple-200/90 text-md sm:text-lg mb-4">Mas, por um tempo <span className="text-yellow-300 font-bold">LIMITADÍSSIMO</span> e para provar que você merece essa transformação, você pode ter acesso a todo o CÓDIGO DA DEUSA™ por um valor simbólico de apenas:</p>
          
          <p className="text-6xl sm:text-7xl md:text-8xl font-extrabold text-green-400 my-4 sm:my-6 glow">
            R$ 47,00
          </p>
          <p className="text-yellow-300 font-semibold text-lg sm:text-xl mb-6">SIM! APENAS R$ 47,00! É menos que um lanche na rua para você ter o poder de reescrever seu destino. É uma piada de tão barato, mas é a nossa forma de garantir que você não tenha desculpa para não agir.</p>


          <div className="mb-6 sm:mb-8">
            <div className={`flex items-center justify-center space-x-2 mb-2 sm:mb-3 ${timeLeft < 60 && timeLeft > 0 ? 'text-red-400' : 'text-yellow-200'}`}>
              <Clock className="h-7 w-7 sm:h-10 sm:w-10" />
              <span className={`text-4xl sm:text-5xl md:text-7xl font-bold font-mono ${timeLeft === 0 ? 'text-red-600' : ''} ${isBlinking && timeLeft > 0 ? 'animate-ping opacity-75':'opacity-100'}`}>
                {formatTime(timeLeft)}
              </span>
              <Zap className={`h-7 w-7 sm:h-10 sm:w-10 ${timeLeft < 300 && timeLeft > 0 && timeLeft % 2 === 0 ? 'animate-spin [animation-duration:0.5s]' : ''}`} />
            </div>
            <div className="w-full bg-black/60 rounded-full h-4 sm:h-5 border-2 border-yellow-600/70 overflow-hidden shadow-inner">
              <div 
                className="bg-gradient-to-r from-red-500 via-yellow-400 to-orange-500 h-full rounded-full transition-all duration-1000 ease-linear shadow-md"
                style={{ width: `${(timeLeft / initialTime) * 100}%` }}
              ></div>
            </div>
             {timeLeft === 0 && <p className="text-red-500 font-bold mt-2 text-md sm:text-lg">TEMPO ESGOTADO! OFERTA ENCERRADA.</p>}
          </div>

          <Button
            asChild
            size="lg"
            className={`w-full sm:w-auto font-headline text-xl sm:text-2xl px-10 sm:px-16 py-7 sm:py-8 rounded-xl shadow-2xl transform hover:scale-105 transition-transform duration-200 pulse-goddess
            ${timeLeft === 0 ? 'bg-gray-700 hover:bg-gray-800 cursor-not-allowed opacity-60' : 'bg-gradient-to-r from-green-500 via-emerald-600 to-green-700 hover:from-green-600 hover:via-emerald-700 hover:to-green-800 text-white'}`}
            disabled={timeLeft === 0}
          >
            <a href="https://pay.kiwify.com.br/xxxxxxxx" target="_blank" rel="noopener noreferrer">
              <CheckCircle2 className="mr-2 h-6 w-6" />
              {timeLeft > 0 ? "QUERO COMANDAR MEU DESTINO AGORA!" : "OFERTA EXPIRADA"}
              <ExternalLink className="ml-2 h-6 w-6" />
            </a>
          </Button>
           <p className="text-xs sm:text-sm text-yellow-200/80 mt-4">Acesso imediato após confirmação. Garantia Incondicional de 7 Dias.</p>
           <p className="text-md sm:text-lg text-purple-200/90 mt-6">
            Não perca mais um segundo. A cada segundo que você hesita, você está escolhendo continuar na mesma estagnação, no mesmo ciclo de frustração. Você está escolhendo ver outras mulheres conquistando o que você poderia ter. Você está escolhendo a mediocridade. <span className="font-bold text-yellow-300">Aja agora.</span> Ou continue sonhando pequeno enquanto outras mulheres estão usando este código para manifestar a porra toda.
           </p>
        </section>
        
        {/* SEÇÃO FINAL: A ESCOLHA É SUA */}
        <section className="animate-fade-in text-center py-8 bg-black/80 rounded-xl border-2 border-purple-800/60" style={{animationDuration: '0.7s', animationDelay: '2.8s'}}>
          <h2 className="font-headline text-2xl sm:text-3xl text-purple-300 mb-6">A escolha é sua.</h2>
          <p className="text-lg sm:text-xl text-yellow-200 mb-8">
            Prove para si mesma que você não é mais uma vítima. <br/>Prove que você é uma Deusa. <br/>Sua hora de virar o jogo é <span className="text-green-400 font-extrabold text-2xl underline">AGORA</span>.
          </p>
          <Button
            onClick={onRestart}
            variant="ghost"
            className="font-headline text-sm sm:text-md text-purple-400/70 hover:text-purple-300 hover:bg-purple-900/40 rounded-lg px-4 py-2 transition-colors"
          >
            <XCircle className="mr-2 h-4 w-4" />
            Não, obrigado. Entendo as consequências da minha inação.
          </Button>
        </section>
      </div>
    </div>
  );
};
