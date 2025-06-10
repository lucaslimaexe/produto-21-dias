"use client";

import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { AlertTriangle, Clock, Zap, ExternalLink, XCircle, Wand2, BarChartBig, Brain, TrendingUp, Unlock, HeartHandshake, CheckCircle2, Palette, Quote, Target, Activity, ShieldOff, RouteOff, MessageCircle, ShieldCheck, Gift, Key, Rocket, Eye, Group, Sparkles as LucideSparkles } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import Image from 'next/image';
import { Progress } from "@/components/ui/progress";
import type { DreamOption } from './pre-questionnaire-form-screen';
import { cn } from '@/lib/utils';
import { playSound } from '@/lib/audioUtils';

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
  userName?: string;
  userDreams?: DreamOption[];
  dreamsAchievementDateLabel?: string;
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

const goddessCodeModules = [
  { name: "Desbloqueio da Identidade", promise: "Descubra e desativa o padrão invisível que te mantém presa em ciclos repetitivos.", value: 97, icon: Key },
  { name: "Reprogramação de Autoimagem", promise: "Você vai trocar o “eu não consigo” pelo “eu sou capaz” — de forma guiada e diária.", value: 97, icon: Brain },
  { name: "Limpeza de Vibração Emocional", promise: "Aprenda a sair da energia da escassez e entrar em estado de criação ativa.", value: 97, icon: LucideSparkles },
  { name: "Ritual de Presença e Intenção Diária", promise: "Uma prática simples que reprograma sua mente todos os dias em menos de 5 minutos.", value: 47, icon: Eye },
  { name: "O Método do Soltar", promise: "Você vai aprender a soltar com confiança e parar de sabotar seus desejos com ansiedade.", value: 67, icon: Unlock },
  { name: "Manifestação Consciente com Frases de Poder", promise: "Frases estrategicamente criadas para reprogramar sua frequência vibracional.", value: 47, icon: Quote },
  { name: "Espaço de Testemunho e Expansão", promise: "Um lugar interno onde você aprende a reconhecer os sinais do universo e avançar.", value: 97, icon: Group }
];

const totalRealValue = goddessCodeModules.reduce((sum, item) => sum + item.value, 0);
const offerPriceAnchor = 97;
const offerPriceFinal = 47;


const formatUserDreams = (dreams?: DreamOption[]): string => {
  if (!dreams || dreams.length === 0) return "seus maiores sonhos";
  if (dreams.length === 1) return dreams[0].label.toLowerCase();
  if (dreams.length === 2) return `${dreams[0].label.toLowerCase()} e ${dreams[1].label.toLowerCase()}`;
  const lastDream = dreams[dreams.length - 1].label.toLowerCase();
  const initialDreams = dreams.slice(0, -1).map(d => d.label.toLowerCase()).join(', ');
  return `${initialDreams} e ${lastDream}`;
};


export const ResultsScreen: React.FC<ResultsScreenProps> = ({
  onRestart,
  analysisResult,
  analysisError,
  userName,
  userDreams,
  dreamsAchievementDateLabel
}) => {
  const initialTime = 2 * 60; // 2 minutos
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isBlinking, setIsBlinking] = useState(false);
  const [isPriceRevealed, setIsPriceRevealed] = useState(false);
  const { toast } = useToast();

  const displayName = userName || "Querida Deusa";
  const dreamsText = formatUserDreams(userDreams);
  const achievementDateText = dreamsAchievementDateLabel ? `já no ${dreamsAchievementDateLabel.toLowerCase()}` : "em breve";

  useEffect(() => {
    if (analysisResult && !analysisError) {
      toast({
        title: `🔥 ${displayName}, Seu Diagnóstico Comportamental Crítico Chegou!`,
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
  }, [analysisResult, analysisError, displayName]);


  useEffect(() => {
    if (!isPriceRevealed || timeLeft <= 0) {
       setIsBlinking(false);
       return;
    }
    const timerId = setInterval(() => {
      setTimeLeft(prevTime => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    if (timeLeft > 0 && timeLeft <= 60) {
        const blinkTimerId = setInterval(() => setIsBlinking(prev => !prev), 500);
        return () => {
            clearInterval(timerId);
            clearInterval(blinkTimerId);
        };
    }

    return () => {
      clearInterval(timerId);
    };
  }, [timeLeft, isPriceRevealed]);


  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getPercentageColor = (percentage: number) => {
    if (percentage <= 25) return "bg-red-600";
    if (percentage <= 50) return "bg-orange-500"; // Alterado de yellow para orange
    if (percentage <= 75) return "bg-yellow-400";
    return "bg-green-500";
  };

  const handleRevealPrice = () => {
    setIsPriceRevealed(true);
    playSound('dream_select.mp3'); // Usando som existente, idealmente 'magic_reveal.mp3'
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center px-4 py-12 relative bg-gradient-to-br from-purple-950 via-black to-red-950 overflow-y-auto text-foreground">
      <div className="w-full max-w-5xl space-y-10 md:space-y-16">

        {analysisResult && (
          <section className="animate-fade-in bg-gradient-to-br from-red-900/80 via-black to-purple-900/80 rounded-3xl p-4 sm:p-6 md:p-8 lg:p-10 border-2 border-red-500/70 shadow-2xl text-center" style={{animationDuration: '0.7s', animationDelay: '0s'}}>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <AlertTriangle className="h-10 w-10 sm:h-12 sm:w-12 text-red-400" />
              <h2 className="font-headline text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-red-300 leading-tight break-words">
                {displayName}, Seu Diagnóstico Comportamental CRÍTICO
              </h2>
              <AlertTriangle className="h-10 w-10 sm:h-12 sm:w-12 text-red-400 hidden sm:block" />
            </div>

            <p className="text-lg sm:text-xl md:text-2xl text-yellow-300 font-semibold mb-2 break-words">
              Seu Arquétipo Dominante (Problemático): <span className="text-pink-400 font-bold text-xl sm:text-2xl md:text-3xl">{analysisResult.archetype}</span>
            </p>
            <p className="text-sm sm:text-base md:text-lg text-red-200/90 leading-relaxed mb-4 sm:mb-6 max-w-3xl mx-auto break-words">
              {analysisResult.summary.replace(/Você/g, displayName).replace(/você/g, displayName.toLowerCase())}
            </p>

            <div className="mb-4 sm:mb-6">
              <p className="text-red-300/80 text-xs sm:text-sm font-medium mb-2 break-words">Principais Fraquezas e Bloqueios Identificados para você, {displayName}:</p>
              <div className="flex flex-wrap justify-center gap-1 sm:gap-2">
                {analysisResult.keywords.map((keyword, index) => (
                  <span key={index} className="bg-red-700/60 text-yellow-200 text-xs font-semibold px-2 py-1 sm:px-3 rounded-full border border-red-500/80">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-black/50 p-3 sm:p-4 rounded-lg border border-yellow-500/50 mb-4 sm:mb-6">
                <p className="text-base sm:text-lg md:text-xl text-yellow-300 font-semibold mb-2 break-words">
                    {displayName}, seu Nível de Alinhamento Atual com Seu Potencial Máximo é:
                    <span className={cn(
                        "ml-1 sm:ml-2 text-2xl sm:text-3xl font-bold",
                        analysisResult.idealPercentage <= 25 ? 'text-red-500' :
                        analysisResult.idealPercentage <= 50 ? 'text-orange-400' :
                        analysisResult.idealPercentage <= 75 ? 'text-yellow-400' : 'text-green-400'
                    )}>
                        {analysisResult.idealPercentage}%
                    </span>
                    {analysisResult.idealPercentage <= 50 && <span className="text-red-400 font-bold ml-2">(Estado Crítico)</span>}
                </p>
                <Progress value={analysisResult.idealPercentage} className={cn("w-full h-3 sm:h-4 border border-yellow-600/50", `[&>div]:${getPercentageColor(analysisResult.idealPercentage)}`)} />
                {analysisResult.idealPercentage <= 30 && <p className="text-red-400 text-xs sm:text-sm mt-1 break-words">Este nível é alarmantemente baixo e requer sua atenção imediata, {displayName}.</p>}
            </div>

            <div className="bg-purple-900/30 p-4 sm:p-6 rounded-xl border border-purple-600">
                <h3 className="text-lg sm:text-xl md:text-2xl text-pink-400 font-semibold mb-2 sm:mb-3 flex items-center justify-center break-words">
                    <RouteOff className="h-6 w-6 sm:h-7 sm:w-7 mr-2 text-pink-500"/> {displayName}, o que te IMPEDE de Alcançar Seu Poder Total:
                </h3>
                <p className="text-sm sm:text-base md:text-lg text-purple-200/90 leading-relaxed max-w-3xl mx-auto break-words">
                    {analysisResult.missingForIdeal.replace(/a usuária/g, `você, ${displayName.toLowerCase()}`).replace(/sua/g, "sua")}
                </p>
            </div>
          </section>
        )}
        {analysisError && !analysisResult && (
           <section className="animate-fade-in bg-red-900/70 rounded-3xl p-6 sm:p-8 lg:p-10 border-2 border-red-500/60 shadow-2xl text-center" style={{animationDuration: '0.7s', animationDelay: '0s'}}>
            <div className="flex justify-center items-center gap-3 mb-4">
              <AlertTriangle className="h-10 w-10 text-yellow-300" />
              <h2 className="font-headline text-2xl sm:text-3xl md:text-4xl font-bold text-yellow-300 leading-tight break-words">
                Aviso sobre a Análise
              </h2>
            </div>
            <p className="text-md sm:text-lg text-red-200/90 leading-relaxed mb-4 max-w-3xl mx-auto break-words">
              {analysisError} Mostraremos a página de resultados padrão.
            </p>
          </section>
        )}

        <hr className="border-purple-700/50 my-8 md:my-12" />

        <section className="animate-fade-in text-center md:text-left" style={{animationDuration: '0.7s', animationDelay: '0.4s'}}>
          <div className="md:flex md:items-center md:gap-6 lg:gap-8">
            <div className="mb-6 md:mb-0 md:w-1/3 flex justify-center">
              <Image
                data-ai-hint="woman frustrated"
                src="https://placehold.co/400x400.png"
                alt="Mulher Frustrada"
                width={300}
                height={300}
                className="rounded-lg shadow-2xl border-2 border-purple-700/50 w-[200px] h-[200px] sm:w-[250px] sm:h-[250px] md:w-[300px] md:h-[300px]"
              />
            </div>
            <div className="md:w-2/3">
              <h2 className="font-headline text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 goddess-text-gradient leading-tight break-words">
                {displayName}, Você Sente Que Algo Te Impede de Avançar e Realizar {dreamsText}?
              </h2>
              <p className="text-sm sm:text-base md:text-lg leading-relaxed text-purple-200/90 mb-3 sm:mb-4 break-words">
                Sinta por um momento... essa sensação de que algo te impede de avançar. Você já tentou de tudo para manifestar {dreamsText} {achievementDateText}, não é? Leu os livros, seguiu os gurus, fez todas as visualizações... mas a vida que você tanto sonha parece sempre fora de alcance. Parece que você está presa num ciclo, repetindo os mesmos erros, enquanto outras mulheres conquistam tudo. Você se sente frustrada, exausta, talvez até um pouco enganada.
              </p>
              <p className="text-sm sm:text-base md:text-lg leading-relaxed text-purple-200/90 mb-3 sm:mb-4 break-words">
                A verdade, {displayName}, é que existe um <span className="text-red-400 font-semibold text-md sm:text-lg md:text-xl">BLOQUEIO</span> no sistema. Um código oculto que foi deliberadamente programado para te manter na estagnação. Eles não querem que você descubra seu verdadeiro poder. A chave para sua abundância e felicidade está adormecida dentro de você.
              </p>
              <p className="text-yellow-400 font-semibold text-base sm:text-lg md:text-xl break-words">
                Mas o tempo para quebrar esse BLOQUEIO e finalmente alcançar {dreamsText} está acabando. A janela para essa REVELAÇÃO está se fechando. E rápido.
              </p>
            </div>
          </div>
        </section>

        <hr className="border-purple-700/50 my-8 md:my-12" />

        <section className="animate-fade-in text-center" style={{animationDuration: '0.7s', animationDelay: '1.0s'}}>
          <div className="mb-6 sm:mb-8 flex justify-center">
             <Image
                data-ai-hint="binary code transformation"
                src="https://placehold.co/600x300.png"
                alt="Código Binário se Transformando"
                width={500}
                height={250}
                className="rounded-lg shadow-2xl border-2 border-accent/70 w-full max-w-sm sm:max-w-md md:max-w-lg"
              />
          </div>
          <h1 className="font-headline text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-3 sm:mb-4 goddess-text-gradient leading-tight break-words">
            {displayName}, prepare-se para a sua MAIOR DESCOBERTA:
          </h1>
          <h2 className="font-headline text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 text-yellow-300 bg-black/50 p-3 sm:p-4 rounded-xl border border-yellow-500/70 inline-block break-words">
            O CÓDIGO DA DEUSA™: 21 DIAS PARA REESCREVER SEU DESTINO E MANIFESTAR {dreamsText.toUpperCase()}.
          </h2>
          <p className="text-sm sm:text-base md:text-lg leading-relaxed text-purple-200/90 max-w-3xl mx-auto mb-3 sm:mb-4 break-words">
            Este não é mais um 'guia' genérico. É a <span className="text-pink-400 font-semibold">REVELAÇÃO</span>. É o mapa completo que desmascara o BLOQUEIO e te dá o CÓDIGO que faltava pra você <span className="text-green-400 font-bold">COMANDAR</span> sua vida. Em apenas 21 dias, você vai reprogramar sua mente, sua energia e suas ações para manifestar {dreamsText} {achievementDateText}, de forma <span className="text-yellow-400 font-semibold">INEVITÁVEL</span>.
          </p>
        </section>

        <hr className="border-purple-700/50 my-8 md:my-12" />

        <section className="animate-fade-in" style={{animationDuration: '0.7s', animationDelay: '1.3s'}}>
           <h3 className="font-headline text-2xl sm:text-3xl md:text-4xl text-center mb-8 sm:mb-12 goddess-text-gradient break-words">
            💎 {displayName}, aqui está o <span className="text-yellow-300">MAPA DETALHADO</span> do que você vai <span className="text-pink-400">DESBLOQUEAR</span> em apenas 21 dias com o Código da Deusa™:
            </h3>
            <div className="grid md:grid-cols-2 gap-x-4 sm:gap-x-6 lg:gap-x-8 gap-y-5 sm:gap-y-7 max-w-4xl mx-auto text-left">
                {goddessCodeModules.map((item, index) => (
                <div key={index} className="flex items-start p-3 sm:p-4 bg-purple-900/50 rounded-xl border-2 border-purple-700/70 hover:shadow-purple-500/40 shadow-lg transition-shadow duration-300 hover:border-purple-500">
                    <item.icon className="h-7 w-7 sm:h-8 sm:w-8 mr-3 sm:mr-4 text-yellow-400 shrink-0 mt-1" />
                    <div className="flex-1">
                    <h4 className="text-md sm:text-lg font-semibold text-pink-300 mb-1 sm:mb-1.5 break-words">{item.name}</h4>
                    <p className="text-xs sm:text-sm text-purple-200/90 mb-1.5 leading-relaxed break-words">{item.promise}</p>
                    <p className="text-xs text-yellow-400/90 font-medium">Valor real: <span className="line-through text-base sm:text-md">R${item.value.toFixed(2).replace('.',',')}</span></p>
                    </div>
                </div>
                ))}
            </div>
            <p className="text-center text-purple-200/90 mt-8 sm:mt-10 text-base sm:text-lg break-words">
                {displayName}, se cada parte desse desafio fosse vendida separadamente, o valor total ultrapassaria <strong className="font-bold text-yellow-300 text-xl sm:text-2xl md:text-3xl line-through">R$ {totalRealValue.toFixed(2).replace('.',',')}</strong>.
            </p>
            <p className="text-center text-white font-semibold mt-2 text-lg sm:text-xl md:text-2xl break-words">
                Mas eu decidi reunir tudo em um método completo, prático, validado por centenas de mulheres — por apenas <span className="text-green-400 text-2xl sm:text-3xl md:text-4xl font-bold">R$ {offerPriceAnchor.toFixed(2).replace('.',',')}</span>.
            </p>
            <p className="text-center text-yellow-400 font-medium mt-1 text-sm sm:text-base break-words">
                Porque transformação não precisa ser cara. Ela só precisa ser real.
            </p>
        </section>


        <hr className="border-purple-700/50 my-8 md:my-12" />

        <section className="animate-fade-in" style={{animationDuration: '0.7s', animationDelay: '1.6s'}}>
          <h2 className="font-headline text-2xl sm:text-3xl md:text-4xl text-center mb-8 sm:mb-12 goddess-text-gradient break-words">Veja o que mulheres como você, {displayName}, estão CONQUISTANDO com o CÓDIGO DA DEUSA™:</h2>
          <div className="grid md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-black/60 border-purple-700/80 text-purple-200/90 shadow-xl hover:shadow-purple-600/40 transition-shadow duration-300 flex flex-col">
                <CardHeader className="pb-3 sm:pb-4 items-center text-center">
                  <Image data-ai-hint={testimonial.aiHint} src={testimonial.image} alt={testimonial.name} width={80} height={80} className="rounded-full border-4 border-yellow-400 mb-2 sm:mb-3 w-20 h-20 sm:w-24 sm:h-24 md:w-[100px] md:h-[100px]" />
                  <CardTitle className="text-lg sm:text-xl text-yellow-300 break-words">{testimonial.name}</CardTitle>
                  <p className="text-xs text-purple-400 break-words">{testimonial.location}</p>
                  <p className="text-sm font-semibold text-pink-400 mt-1 break-words">{testimonial.transformation}</p>
                </CardHeader>
                <CardContent className="flex-grow p-3 sm:p-4">
                  <Quote className="h-5 w-5 sm:h-6 sm:w-6 text-purple-500 mb-1 sm:mb-2 transform scale-x-[-1]" />
                  <p className="italic text-xs sm:text-sm md:text-base leading-relaxed break-words">"{testimonial.quote}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
           <div className="flex justify-center mt-8 sm:mt-10">
             <Image
                data-ai-hint="women success celebration"
                src="https://placehold.co/700x200.png"
                alt="Mulheres Felizes e Realizadas"
                width={600}
                height={171}
                className="rounded-lg shadow-xl border-2 border-accent/50 w-full max-w-md sm:max-w-lg md:max-w-xl"
              />
          </div>
        </section>

        <hr className="border-purple-700/50 my-8 md:my-12" />

        <section className="animate-fade-in bg-gradient-to-br from-red-800/80 via-black to-purple-900/80 rounded-3xl p-4 sm:p-6 lg:p-10 mb-6 sm:mb-8 border-4 border-yellow-500 shadow-2xl text-center" style={{animationDuration: '0.7s', animationDelay: '2.2s'}}>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-yellow-200 mb-3 sm:mb-4 animate-pulse [animation-duration:1.2s] break-words">
            {displayName}, chega de ser feita de otária. Chega de ver seus sonhos como {dreamsText} no ralo!
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-red-300 mb-5 sm:mb-7 break-words">Esta é a sua <span className="font-bold underline">ÚLTIMA CHANCE</span> de pegar o atalho ético para a vida que você deseja. O CÓDIGO DA DEUSA™ é para mulheres como você, {displayName}, que estão cansadas de serem enganadas e prontas para <span className="font-bold text-lg sm:text-xl md:text-2xl">COMANDAR</span>.</p>

          <div className="bg-black/70 border-2 border-red-500 rounded-xl p-3 sm:p-4 mb-5 sm:mb-7">
            <h3 className="text-red-400 font-bold text-lg sm:text-xl md:text-2xl mb-1.5 sm:mb-2 break-words">🚨 ALERTA FINAL, {displayName.toUpperCase()}: Restam APENAS 3 VAGAS! 🚨</h3>
            <p className="text-yellow-300 text-xs sm:text-sm md:text-base break-words">E quando elas acabarem, o preço vai subir. Não sabemos quando teremos outra oportunidade como essa para você realizar {dreamsText} {achievementDateText}.</p>
          </div>

          <p className="text-purple-200/90 text-base sm:text-lg md:text-xl mb-1 sm:mb-2 break-words">
            O valor real deste conhecimento, que vai mudar sua vida para sempre, é de <span className="line-through text-red-500/80 text-lg sm:text-xl md:text-2xl font-semibold">R$ {totalRealValue.toFixed(2).replace('.',',')}</span>.
            Nem mesmo os <span className="line-through text-red-500/80 text-lg sm:text-xl md:text-2xl font-semibold">R$ {offerPriceAnchor.toFixed(2).replace('.',',')}</span> que seria o preço justo.
          </p>
          <p className="text-purple-200/90 text-sm sm:text-base md:text-lg mb-3 sm:mb-5 break-words">
            Mas, {displayName}, como uma oportunidade <span className="text-yellow-300 font-bold">ÚNICA E MÁGICA</span> por ter chegado até aqui, seu acesso a todo o CÓDIGO DA DEUSA™ será revelado agora:
          </p>

          {!isPriceRevealed ? (
            <button
              onClick={handleRevealPrice}
              className="my-3 sm:my-4 md:my-6 p-4 sm:p-6 bg-purple-800/60 border-2 border-accent hover:border-yellow-300 rounded-2xl hover:bg-purple-700/70 transition-all duration-300 ease-in-out cursor-pointer group animate-pulse-goddess shadow-xl hover:shadow-accent/50 w-full max-w-md mx-auto"
              aria-label="Toque para revelar sua oferta mágica"
            >
              <div className="flex flex-col items-center text-center">
                <Wand2 className="h-10 w-10 sm:h-12 sm:w-12 text-yellow-300 mb-2 sm:mb-3 group-hover:animate-icon-subtle-float" />
                <span className="text-xl sm:text-2xl md:text-3xl font-bold text-yellow-300 group-hover:text-yellow-200 leading-tight">
                  Toque para Revelar Sua Oferta Mágica!
                </span>
                <span className="text-sm text-purple-200/80 mt-1.5 sm:mt-2">Sua co-criação especial espera por você...</span>
              </div>
            </button>
          ) : (
            <div className="animate-pop-in">
              <p className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold text-green-400 my-3 sm:my-4 md:my-6 glow">
                R$ {offerPriceFinal.toFixed(2).replace('.',',')}
              </p>
              <p className="text-yellow-300 font-bold text-lg sm:text-xl md:text-2xl mb-4 sm:mb-6 break-words">
                SIM, {displayName}! APENAS R$ {offerPriceFinal.toFixed(2).replace('.',',')} HOJE! <br className="sm:hidden"/> Um presente especial para sua transformação!
              </p>

              <div className="mb-4 sm:mb-6 md:mb-8">
                <div className={cn("flex items-center justify-center space-x-1 sm:space-x-2 mb-1 sm:mb-2 md:mb-3", timeLeft < 60 && timeLeft > 0 ? 'text-red-400' : 'text-yellow-200')}>
                  <Clock className="h-6 w-6 sm:h-7 md:h-10 shrink-0" />
                  <span className={cn("text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold font-mono", timeLeft === 0 ? 'text-red-600' : '', isBlinking && timeLeft > 0 ? 'animate-ping opacity-75':'opacity-100')}>
                    {formatTime(timeLeft)}
                  </span>
                  <Zap className={cn("h-6 w-6 sm:h-7 md:h-10 shrink-0", timeLeft < 300 && timeLeft > 0 && timeLeft % 2 === 0 ? 'animate-spin [animation-duration:0.5s]' : '')} />
                </div>
                <div className="w-full bg-black/60 rounded-full h-3 sm:h-4 md:h-5 border-2 border-yellow-600/70 overflow-hidden shadow-inner">
                  <div
                    className="bg-gradient-to-r from-red-500 via-yellow-400 to-orange-500 h-full rounded-full transition-all duration-1000 ease-linear shadow-md"
                    style={{ width: `${(timeLeft / initialTime) * 100}%` }}
                  ></div>
                </div>
                {timeLeft === 0 && <p className="text-red-500 font-bold mt-1 sm:mt-2 text-sm sm:text-base md:text-lg break-words">TEMPO ESGOTADO, {displayName}! OFERTA ENCERRADA.</p>}
              </div>

              <Button
                asChild
                size="lg"
                className={cn(`w-full max-w-md mx-auto font-headline text-base sm:text-lg md:text-xl px-4 sm:px-6 md:px-10 py-4 sm:py-5 md:py-7 rounded-xl shadow-2xl transform hover:scale-105 transition-transform duration-200 pulse-goddess whitespace-normal text-center h-auto`,
                timeLeft === 0 ? 'bg-gray-700 hover:bg-gray-800 cursor-not-allowed opacity-60' : 'bg-gradient-to-r from-green-500 via-emerald-600 to-green-700 hover:from-green-600 hover:via-emerald-700 hover:to-green-800 text-white')}
                disabled={timeLeft === 0}
              >
                <a href="https://pay.kiwify.com.br/xxxxxxxx" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1 sm:gap-2">
                  <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 shrink-0" />
                  <span className="leading-tight break-words">{timeLeft > 0 ? `SIM, ${displayName.toUpperCase()}! QUERO O CÓDIGO AGORA!` : "OFERTA EXPIRADA"}</span>
                  <ExternalLink className="h-5 w-5 sm:h-6 sm:w-6 shrink-0" />
                </a>
              </Button>
              <p className="text-xs sm:text-sm text-yellow-200/80 mt-3 sm:mt-4 break-words">Acesso imediato após confirmação. Garantia Incondicional de 7 Dias.</p>
              <p className="text-sm sm:text-base md:text-lg text-purple-200/90 mt-5 sm:mt-7 break-words">
                {displayName}, não perca mais um segundo. A cada segundo que você hesita, você está escolhendo continuar na mesma estagnação. Você está escolhendo a mediocridade. <span className="font-bold text-yellow-300">Aja agora.</span> Ou continue sonhando pequeno enquanto outras mulheres estão usando este código para manifestar {dreamsText} {achievementDateText}.
              </p>
            </div>
          )}
        </section>

        <section className="animate-fade-in text-center py-6 sm:py-8 bg-black/80 rounded-xl border-2 border-purple-800/60" style={{animationDuration: '0.7s', animationDelay: '2.8s'}}>
          <h2 className="font-headline text-xl sm:text-2xl md:text-3xl text-purple-300 mb-4 sm:mb-6 break-words">A escolha é sua, {displayName}.</h2>
          <p className="text-base sm:text-lg md:text-xl text-yellow-200 mb-6 sm:mb-8 break-words">
            Prove para si mesma que você não é mais uma vítima. <br/>Prove que você é uma Deusa. <br/>Sua hora de virar o jogo é <span className="text-green-400 font-extrabold text-lg sm:text-xl md:text-2xl underline">AGORA</span>.
          </p>
          <Button
            onClick={onRestart}
            variant="ghost"
            className="font-headline text-xs sm:text-sm md:text-base text-purple-400/70 hover:text-purple-300 hover:bg-purple-900/40 rounded-lg px-3 py-1.5 sm:px-4 sm:py-2 transition-colors whitespace-normal text-center h-auto max-w-xs mx-auto"
          >
            <XCircle className="mr-1 sm:mr-2 h-4 w-4 shrink-0" />
            <span className="break-words">Não, obrigado. Entendo as consequências da minha inação.</span>
          </Button>
        </section>
      </div>
    </div>
  );
};

    