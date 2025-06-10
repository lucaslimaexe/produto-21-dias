
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Clock, Zap, ExternalLink, XCircle, Wand2, BarChartBig, Brain, TrendingUp, Unlock, HeartHandshake, CheckCircle2, Palette, Quote, Target, Activity, ShieldOff, RouteOff, MessageCircle, ShieldCheck, Gift, Key, Rocket, Eye, Group, Sparkles as LucideSparkles, ThumbsDown, ThumbsUp, Lock, CircleDollarSign, ShoppingCart, Star, ChevronLeft, ChevronRight, Lightbulb, BookOpen, Users, TimerIcon as LucideTimerIcon } from 'lucide-react'; // Renomeado TimerIcon para LucideTimerIcon
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

const goddessCodeModules = [
  { id: 'identity_unlock', name: "Desbloqueio da Identidade", promise: "Descubra e desativa o padrão invisível que te mantém presa.", value: 97, icon: Key, dataAiHint: "key lock" },
  { id: 'self_image_reprogram', name: "Reprogramação de Autoimagem", promise: "Troque o “eu não consigo” pelo “eu sou capaz” — diariamente.", value: 97, icon: Brain, dataAiHint: "brain mind" },
  { id: 'emotional_vibration_cleanse', name: "Limpeza de Vibração Emocional", promise: "Saia da escassez e entre em estado de criação ativa.", value: 97, icon: LucideSparkles, dataAiHint: "sparkle clean" },
  { id: 'daily_ritual', name: "Ritual de Presença e Intenção", promise: "Reprograme sua mente todos os dias em menos de 5 minutos.", value: 47, icon: Eye, dataAiHint: "eye focus" },
  { id: 'letting_go_method', name: "O Método do Soltar", promise: "Solte com confiança e pare de sabotar seus desejos.", value: 67, icon: Unlock, dataAiHint: "unlock open" },
  { id: 'conscious_manifestation_phrases', name: "Manifestação com Frases de Poder", promise: "Frases que reprogramam sua frequência vibracional.", value: 47, icon: Quote, dataAiHint: "quote text" },
  { id: 'testimony_expansion_space', name: "Espaço de Testemunho e Expansão", promise: "Reconheça os sinais do universo e avance com clareza.", value: 97, icon: Group, dataAiHint: "group community" }
];
const totalRealValue = goddessCodeModules.reduce((sum, item) => sum + item.value, 0);
const offerPriceAnchor = 97;
const offerPriceFinal = 47;

const testimonialsData = [
  { id: 1, name: "Maria S.", age: 38, quote: "Em 15 dias, tripliquei minha renda! Inacreditável!", stars: 5, image: "https://placehold.co/100x100.png", dataAiHint: "woman success" },
  { id: 2, name: "Ana L.", age: 45, quote: "Em 1 semana, conheci o homem da minha vida!", stars: 5, image: "https://placehold.co/100x100.png", dataAiHint: "woman happy love" },
  { id: 3, name: "Carla P.", age: 29, quote: "Em 21 dias, minhas vendas explodiram! Poder puro!", stars: 5, image: "https://placehold.co/100x100.png", dataAiHint: "businesswoman achievement" },
  { id: 4, name: "Juliana M.", age: 33, quote: "Finalmente entendi meus bloqueios e como superá-los. Gratidão!", stars: 5, image: "https://placehold.co/100x100.png", dataAiHint: "woman thoughtful" },
];

const analysisCardsData = (analysisResult?: BehavioralAnalysisData) => {
    if (!analysisResult) return [];
    const summarySentences = analysisResult.summary.split('. ').filter(s => s.length > 10);
    return [
        { id: 'insight1', icon: Lightbulb, title: "Principal Descoberta", text: summarySentences[0] || "Você possui um padrão comportamental que precisa de atenção." },
        { id: 'insight2', icon: BookOpen, title: "Entendendo a Raiz", text: summarySentences[1] || analysisResult.missingForIdeal.substring(0, 100) + "..." },
        { id: 'insight3', icon: TrendingUp, title: "Caminho para Mudança", text: analysisResult.missingForIdeal.substring(100) || "A transformação requer foco e as ferramentas certas." },
    ];
};

const AnalysisInsightCard: React.FC<{ icon: React.ElementType, title: string, text: string, className?: string }> = ({ icon: Icon, title, text, className }) => (
    <Card className={cn("bg-purple-900/50 border-purple-700/70 p-4 w-full sm:w-[calc(50%-0.5rem)] md:w-[calc(33.33%-0.5rem)] shrink-0 scroll-snap-align-center", className)}>
        <CardHeader className="p-0 pb-2 flex flex-row items-center gap-2">
            <Icon className="h-6 w-6 text-accent shrink-0" />
            <CardTitle className="text-md text-pink-400">{title}</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
            <p className="text-xs text-purple-200/90 leading-relaxed">{text}</p>
        </CardContent>
    </Card>
);

const ModuleCard: React.FC<{ icon: React.ElementType, name: string, promise: string, value: number, dataAiHint: string, className?: string }> = ({ icon: Icon, name, promise, value, dataAiHint, className }) => (
    <Card className={cn("bg-slate-800/70 border-purple-600/80 hover:border-accent hover:shadow-accent/30 transition-all duration-300 transform hover:scale-105", className)}>
        <CardHeader className="flex flex-row items-center gap-3 p-4">
            <Icon data-ai-hint={dataAiHint} className="h-10 w-10 text-accent shrink-0" />
            <div>
                <CardTitle className="text-lg text-pink-300 mb-1">{name}</CardTitle>
                <p className="text-xs text-yellow-400/90 font-medium">Valor real: <span className="line-through text-base sm:text-md">R${value.toFixed(2).replace('.', ',')}</span></p>
            </div>
        </CardHeader>
        <CardContent className="p-4 pt-0">
            <p className="text-sm text-purple-200/90 leading-relaxed">{promise}</p>
        </CardContent>
    </Card>
);

const TestimonialCard: React.FC<{ name: string, age: number, quote: string, stars: number, image: string, dataAiHint: string, className?: string }> = ({ name, age, quote, stars, image, dataAiHint, className }) => (
    <Card className={cn("bg-black/70 border-purple-700/80 text-purple-200/90 shadow-xl w-[280px] sm:w-[320px] shrink-0 scroll-snap-align-center p-5 flex flex-col items-center text-center", className)}>
        <Image data-ai-hint={dataAiHint} src={image} alt={name} width={80} height={80} className="rounded-full border-4 border-yellow-400 mb-3" />
        <CardTitle className="text-lg text-yellow-300">{name}, {age} anos</CardTitle>
        <div className="flex my-2">
            {Array(stars).fill(0).map((_, i) => <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />)}
        </div>
        <CardContent className="p-0 mt-1">
            <p className="italic text-sm leading-relaxed">"{quote}"</p>
        </CardContent>
    </Card>
);

const TimerIconComponent: React.FC<React.SVGProps<SVGSVGElement>> = (props) => ( // Renomeado TimerIcon para TimerIconComponent
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <line x1="10" y1="2" x2="14" y2="2" />
    <line x1="12" y1="18" x2="12" y2="22" />
    <path d="M5 10.5a7 7 0 0 1 7-7 7 7 0 0 1 7 7c0 1.92-.782 3.667-2.05 4.95A1 1 0 0 0 16.12 17H7.88a1 1 0 0 0-.83.45A7.003 7.003 0 0 1 5 10.5Z" />
    <path d="M12 18V7.5" />
    <path d="m9 11 3-3 3 3" />
  </svg>
);


export const ResultsScreen: React.FC<ResultsScreenProps> = ({
  onRestart,
  analysisResult,
  analysisError,
  userName,
  userDreams,
  dreamsAchievementDateLabel
}) => {
  const [priceCardTimeLeft, setPriceCardTimeLeft] = useState(7 * 60);
  const [priceCardVacancies, setPriceCardVacancies] = useState(3);
  const [stickyMessageIndex, setStickyMessageIndex] = useState(0);
  const [showRecusePopup, setShowRecusePopup] = useState(false);
  const [isScrollLocked, setIsScrollLocked] = useState(false);

  const { toast } = useToast(); // useToast ainda pode ser útil para outros popups no futuro
  const displayName = userName || "Querida Deusa";
  const dreamsText = userDreams && userDreams.length > 0 ? formatUserDreams(userDreams) : "seus maiores sonhos";
  const achievementDateText = dreamsAchievementDateLabel ? `já no ${dreamsAchievementDateLabel.toLowerCase()}` : "em breve";
  
  const finalOfferTimerInitial = 2 * 60;
  const [finalOfferTimeLeft, setFinalOfferTimeLeft] = useState(finalOfferTimerInitial);
  const [isPriceRevealed, setIsPriceRevealed] = useState(false);
  const [isFinalOfferTimerBlinking, setIsFinalOfferTimerBlinking] = useState(false);

  const analysisCards = analysisCardsData(analysisResult);

  useEffect(() => {
     if (analysisError && !analysisResult) { // Mostra erro apenas se houver erro E não houver resultado
       toast({ title: "⚠️ Erro na Análise", description: analysisError, variant: "destructive", duration: 7000 });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [analysisError, analysisResult]);


  useEffect(() => {
    if (priceCardTimeLeft <= 0) return;
    const timerId = setInterval(() => {
      setPriceCardTimeLeft(prevTime => prevTime - 1);
    }, 1000);
    return () => clearInterval(timerId);
  }, [priceCardTimeLeft]);

  useEffect(() => {
    if (priceCardTimeLeft === (2*60)) { 
        setPriceCardVacancies(1);
        playSound('limit_reached.mp3');
    }
  }, [priceCardTimeLeft]);

  useEffect(() => {
    if (!isPriceRevealed || finalOfferTimeLeft <= 0) {
       setIsFinalOfferTimerBlinking(false);
       return;
    }
    const timerId = setInterval(() => {
      setFinalOfferTimeLeft(prevTime => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    if (finalOfferTimeLeft > 0 && finalOfferTimeLeft <= 60) {
        const blinkTimerId = setInterval(() => setIsFinalOfferTimerBlinking(prev => !prev), 500);
        return () => { clearInterval(timerId); clearInterval(blinkTimerId); };
    }
    return () => clearInterval(timerId);
  }, [finalOfferTimeLeft, isPriceRevealed]);

  const stickyMessages = ["Garanta seu código ✨", `+${17 + Math.floor(Math.random()*10)} acessos HOJE! 🔥`, "Ainda dá tempo...⏳"];
  useEffect(() => {
    const intervalId = setInterval(() => {
      setStickyMessageIndex(prevIndex => (prevIndex + 1) % stickyMessages.length);
    }, 20000);
    return () => clearInterval(intervalId);
  }, [stickyMessages.length]);

  const handleRevealPrice = () => {
    setIsPriceRevealed(true);
    playSound('dream_select.mp3');
    setFinalOfferTimeLeft(finalOfferTimerInitial);
  };
  
  const handleScrollLock = () => {
    setIsScrollLocked(true);
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
      setIsScrollLocked(false);
      document.body.style.overflow = 'auto';
    }, 2000);
  };
  
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getPercentageColor = (percentage: number) => {
    if (percentage <= 25) return "bg-red-600";
    if (percentage <= 50) return "bg-orange-500";
    if (percentage <= 75) return "bg-yellow-400";
    return "bg-green-500";
  };

  if (analysisError && !analysisResult) { // Condição para mostrar tela de erro
      return (
          <div className="min-h-screen w-full flex flex-col items-center justify-center px-4 py-12 bg-gradient-to-br from-red-950 via-black to-purple-950 text-foreground">
              <AlertTriangle className="h-20 w-20 text-yellow-400 mb-6" />
              <h1 className="font-headline text-3xl text-red-400 mb-4">Erro na Análise</h1>
              <p className="text-lg text-muted-foreground mb-8 text-center max-w-md">{analysisError}</p>
              <Button onClick={onRestart} className="goddess-gradient text-primary-foreground font-bold py-3 px-8 rounded-lg">
                  Tentar Novamente
              </Button>
          </div>
      );
  }

  const currentAnalysisResult = analysisResult || {
      archetype: "Deusa em Descoberta",
      summary: "Sua jornada de autoconhecimento está apenas começando. Existem padrões a serem explorados e potenciais a serem desbloqueados. Continue com coragem e abertura para revelar seu verdadeiro poder.",
      keywords: ["Autoconhecimento", "Potencial Oculto", "Descoberta"],
      idealPercentage: 50,
      missingForIdeal: " Clareza sobre seus bloqueios mais profundos e ferramentas eficazes para transmutá-los em poder de manifestação."
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center pt-16 sm:pt-20 pb-28 bg-gradient-to-br from-purple-950 via-black to-red-950 text-foreground overflow-x-hidden">
        <header className="fixed top-0 left-0 right-0 z-50 bg-destructive/90 backdrop-blur-sm text-destructive-foreground p-2 sm:p-3 text-center shadow-lg animate-flash-red">
            <div className="container mx-auto flex items-center justify-center gap-2">
                <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 shrink-0" />
                <h1 className="text-sm sm:text-base md:text-lg font-bold uppercase tracking-wider">ALERTA MÁXIMO: SEU DIAGNÓSTICO CRÍTICO!</h1>
            </div>
        </header>

        <main className="w-full max-w-5xl space-y-12 md:space-y-16 px-4">
            <section className="animate-fade-in text-center" style={{animationDuration: '0.7s'}}>
                <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-center mb-8">
                    <Card className="bg-black/50 border-2 border-pink-500/70 p-6 rounded-2xl shadow-xl">
                        <CardTitle className="text-lg sm:text-xl text-muted-foreground mb-1">Seu Arquétipo Dominante (Problemático):</CardTitle>
                        <p className="text-xl sm:text-2xl md:text-3xl font-bold text-pink-400 mb-0">{currentAnalysisResult.archetype}</p>
                    </Card>
                    <Card className="bg-black/50 border-2 border-yellow-500/70 p-6 rounded-2xl shadow-xl">
                        <CardTitle className="text-lg sm:text-xl text-muted-foreground mb-2">Nível de Alinhamento com Seu Potencial Máximo:</CardTitle>
                        <div className="flex items-center justify-center gap-3 mb-2">
                            <p className={cn("text-2xl sm:text-3xl font-bold", getPercentageColor(currentAnalysisResult.idealPercentage).replace('bg-','text-'))}>{currentAnalysisResult.idealPercentage}%</p>
                            {currentAnalysisResult.idealPercentage <= 50 && <Badge variant="destructive" className="text-xs sm:text-sm animate-subtle-pulse">Estado Crítico</Badge>}
                        </div>
                        <Progress value={currentAnalysisResult.idealPercentage} className={cn("w-full h-3 sm:h-4 border border-yellow-600/50 animated-progress-bar", `[&>div]:${getPercentageColor(currentAnalysisResult.idealPercentage)}`)} />
                    </Card>
                </div>

                <div className="mb-8">
                    <h3 className="font-headline text-xl sm:text-2xl text-red-300 mb-4">Suas Principais Travas Comportamentais:</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 justify-center">
                        {currentAnalysisResult.keywords.map((keyword, index) => (
                            <TooltipProvider key={index}>
                                <Tooltip delayDuration={100}>
                                    <TooltipTrigger asChild>
                                        <Badge variant="outline" className="text-sm bg-red-700/60 text-yellow-200 border-red-500/80 px-3 py-1.5 cursor-default animate-subtle-pulse" style={{animationDelay: `${index * 0.1}s`}}>
                                            <Lock className="h-3 w-3 mr-1.5 shrink-0" /> {keyword}
                                        </Badge>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-slate-800 text-white border-purple-500">
                                        <p>Bloqueio: {keyword}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        ))}
                    </div>
                </div>

                <div className="mb-8">
                     <h3 className="font-headline text-xl sm:text-2xl text-purple-300 mb-4">Desvendando Sua Realidade Interna:</h3>
                    <div className="flex overflow-x-auto snap-x snap-mandatory py-4 space-x-4 scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-purple-900/50">
                        {analysisCards.map(card => <AnalysisInsightCard key={card.id} icon={card.icon} title={card.title} text={card.text} className="min-w-[280px] sm:min-w-[320px] md:min-w-[300px]"/>)}
                    </div>
                </div>
                
                <Button onClick={() => document.getElementById('price-card-section')?.scrollIntoView({ behavior: 'smooth' })} className="goddess-gradient text-primary-foreground font-bold text-lg sm:text-xl py-3 sm:py-4 px-8 sm:px-10 rounded-xl shadow-xl hover:scale-105 transition-transform duration-300 animate-pulse-goddess">
                    <Unlock className="mr-2 h-5 w-5 shrink-0" /> DESBLOQUEAR MEU CÓDIGO
                </Button>
            </section>

            <hr className="border-purple-700/30 my-10 md:my-14" />

            <section className="animate-fade-in space-y-6 text-center" style={{animationDelay: '0.5s'}}>
                 <h2 className="font-headline text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold goddess-text-gradient leading-tight animate-fade-in" style={{animationDelay: '0.6s'}}>
                    {displayName}, Você Sente Que Algo Te Impede de Realizar {dreamsText}?
                </h2>
                <p className="text-md sm:text-lg text-purple-200/90 max-w-2xl mx-auto leading-relaxed animate-fade-in" style={{animationDelay: '0.8s'}}>
                    A verdade é que existe um <span className="text-red-400 font-semibold text-lg sm:text-xl">BLOQUEIO INVISÍVEL</span>.
                </p>
                 <p className="text-md sm:text-lg text-purple-200/90 max-w-2xl mx-auto leading-relaxed animate-fade-in" style={{animationDelay: '1s'}}>
                    Mas eu decidi reunir tudo em um método completo, prático, validado por centenas de mulheres — por apenas <span className="font-bold text-yellow-300">R$ {offerPriceAnchor.toFixed(2).replace('.',',')}</span>.
                 </p>
                <Button onClick={() => document.getElementById('modules-section')?.scrollIntoView({ behavior: 'smooth' })} variant="outline" className="border-accent text-accent hover:bg-accent/20 hover:text-yellow-300 font-semibold text-md sm:text-lg py-2.5 px-6 rounded-lg animate-fade-in animate-icon-subtle-float" style={{animationDelay: '1.2s'}}>
                    <Eye className="mr-2 h-5 w-5 shrink-0" /> Veja o que está incluído
                </Button>
            </section>

            <hr className="border-purple-700/30 my-10 md:my-14" />
            
            <section id="price-card-section" className="animate-fade-in text-center" style={{animationDelay: '1.2s'}}>
                 <h2 className="font-headline text-2xl sm:text-3xl md:text-4xl text-center mb-6 sm:mb-8 goddess-text-gradient">
                    Sua Transformação Está a Um Passo...
                </h2>
                <Card className="max-w-md mx-auto bg-gradient-to-br from-primary/20 via-black to-accent/20 border-2 border-accent/70 p-6 sm:p-8 rounded-3xl shadow-2xl shadow-accent/30">
                    <CardHeader className="p-0 mb-4">
                        <CardTitle className="text-2xl sm:text-3xl font-bold text-yellow-300">Oferta Exclusiva Código da Deusa™</CardTitle>
                        <CardDescription className="text-purple-300/80 text-sm">Por ter chegado até aqui, {displayName}!</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0 space-y-4">
                        <p className="text-xl sm:text-2xl text-purple-200/90">
                            Valor Total dos Módulos: <span className="line-through text-red-400/80 text-xl sm:text-2xl md:text-3xl font-semibold">R$ {totalRealValue.toFixed(2).replace('.',',')}</span>
                        </p>
                        <p className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-green-400 my-2 glow">
                            HOJE POR APENAS: R$ {offerPriceAnchor.toFixed(2).replace('.',',')}
                        </p>
                        <div className="text-sm text-yellow-400/90 space-y-1">
                            <p className="animate-subtle-pulse"><TimerIconComponent className="inline h-4 w-4 mr-1 shrink-0" /> Promoção válida por: <span className="font-bold">{formatTime(priceCardTimeLeft)}</span></p>
                            <p className={priceCardVacancies === 1 ? 'text-red-400 font-bold animate-intense-pulse' : ''}><Users className="inline h-4 w-4 mr-1 shrink-0" /> Restam apenas: <span className="font-bold">{priceCardVacancies}</span> {priceCardVacancies === 1 ? 'acesso com este valor!' : 'acessos com este valor!'}</p>
                        </div>
                        <Button onClick={handleRevealPrice} disabled={isPriceRevealed} className={cn("w-full goddess-gradient text-primary-foreground font-bold text-lg sm:text-xl py-3 sm:py-4 rounded-xl shadow-xl hover:scale-105 transition-transform duration-300 mt-4", isPriceRevealed && "opacity-50 cursor-not-allowed")}>
                            <ShoppingCart className="mr-2 h-5 w-5 shrink-0" /> QUERO GARANTIR AGORA POR R${offerPriceAnchor}
                        </Button>
                    </CardContent>
                </Card>
            </section>
            
            {isPriceRevealed && (
                <section id="final-offer-section" className="animate-pop-in bg-black/50 border-2 border-yellow-500 p-6 sm:p-10 rounded-3xl shadow-2xl shadow-yellow-500/50 text-center mt-10">
                    <Wand2 className="h-16 w-16 text-accent mx-auto mb-4 animate-float" />
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-yellow-300 mb-3">Sua Co-Criação Mágica Revelada!</h2>
                    <p className="text-purple-200/90 text-sm sm:text-base md:text-lg mb-3 sm:mb-5 break-words max-w-xl mx-auto">
                        Mas, {displayName}, por um tempo <span className="text-yellow-300 font-bold">LIMITADÍSSIMO</span>, e como uma oportunidade única por ter chegado até aqui, seu acesso a todo o CÓDIGO DA DEUSA™ não será R$ {totalRealValue.toFixed(2).replace('.',',')}, nem mesmo R$ {offerPriceAnchor.toFixed(2).replace('.',',')}. Será por um valor simbólico de apenas:
                    </p>
                    <p className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold text-green-400 my-4 md:my-6 glow">
                        R$ {offerPriceFinal.toFixed(2).replace('.',',')}
                    </p>
                    <p className="text-yellow-300 font-bold text-lg sm:text-xl md:text-2xl mb-4 sm:mb-6 break-words">
                        SIM, {displayName}! APENAS R$ {offerPriceFinal.toFixed(2).replace('.',',')} HOJE! <br className="sm:hidden"/> Um desconto inacreditável sobre o valor já especial de R$ {offerPriceAnchor.toFixed(2).replace('.',',')}!
                    </p>

                    <div className="mb-6 md:mb-8 max-w-sm mx-auto">
                        <div className={cn("flex items-center justify-center space-x-1 sm:space-x-2 mb-2", finalOfferTimeLeft < 60 && finalOfferTimeLeft > 0 ? 'text-red-400' : 'text-yellow-200')}>
                            <Clock className="h-5 w-5 sm:h-6 shrink-0" />
                            <span className={cn("text-2xl sm:text-3xl font-bold font-mono", finalOfferTimeLeft === 0 ? 'text-red-600' : '', isFinalOfferTimerBlinking && finalOfferTimeLeft > 0 ? 'animate-ping opacity-75':'opacity-100')}>
                                {formatTime(finalOfferTimeLeft)}
                            </span>
                        </div>
                        <Progress value={(finalOfferTimeLeft / finalOfferTimerInitial) * 100} className="w-full h-2.5 sm:h-3 bg-yellow-600/30 border border-yellow-600/50 [&>div]:bg-gradient-to-r [&>div]:from-red-500 [&>div]:via-yellow-400 [&>div]:to-orange-500" />
                        {finalOfferTimeLeft === 0 && <p className="text-red-500 font-bold mt-2 text-sm sm:text-base">TEMPO ESGOTADO! OFERTA ENCERRADA.</p>}
                    </div>
                    
                    <p className="text-center text-sm text-yellow-200/90 mb-2 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                      Essa oportunidade é sua, {displayName}!
                    </p>

                    <Button
                        asChild
                        size="lg"
                        className={cn(`w-full max-w-md mx-auto font-headline text-base sm:text-lg md:text-xl px-6 py-7 rounded-xl shadow-2xl transform hover:scale-105 transition-transform duration-200 pulse-goddess whitespace-normal text-center h-auto`,
                        finalOfferTimeLeft === 0 ? 'bg-gray-700 hover:bg-gray-800 cursor-not-allowed opacity-60' : 'bg-gradient-to-r from-green-500 via-emerald-600 to-green-700 hover:from-green-600 hover:via-emerald-700 hover:to-green-800 text-white')}
                        disabled={finalOfferTimeLeft === 0}
                    >
                        <a href="https://pay.kiwify.com.br/xxxxxxxx" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                            <CheckCircle2 className="h-6 w-6 shrink-0" />
                            <span className="leading-tight break-words">{finalOfferTimeLeft > 0 ? `EU QUERO O CÓDIGO POR R$${offerPriceFinal} AGORA!` : "OFERTA EXPIRADA"}</span>
                            <ExternalLink className="h-5 w-5 shrink-0" />
                        </a>
                    </Button>
                    <p className="text-xs text-yellow-200/80 mt-3">Acesso imediato. Garantia Incondicional de 7 Dias.</p>
                </section>
            )}

            <hr className="border-purple-700/30 my-10 md:my-14" />

            <section id="modules-section" className="animate-fade-in" style={{animationDelay: '1.5s'}}>
                <h2 className="font-headline text-2xl sm:text-3xl md:text-4xl text-center mb-8 sm:mb-12 goddess-text-gradient">
                    💎 {displayName}, o <span className="text-yellow-300">MAPA DETALHADO</span> para Você <span className="text-pink-400">DESBLOQUEAR</span>:
                </h2>
                 <p className="text-center text-lg sm:text-xl text-purple-100/90 -mt-6 mb-8 max-w-2xl mx-auto">
                    O Código da Deusa é um sistema COMPLETO com <span className="font-bold text-pink-300">7 módulos + bônus</span> que valem <span className="line-through text-xl sm:text-2xl font-bold text-red-400/90">R$ {totalRealValue.toFixed(2).replace('.',',')}</span>.
                </p>
                <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                    {goddessCodeModules.map((item) => (
                        <ModuleCard key={item.id} icon={item.icon} name={item.name} promise={item.promise} value={item.value} dataAiHint={item.dataAiHint}/>
                    ))}
                </div>
                 <p className="text-center text-purple-100/90 mt-8 text-lg sm:text-xl md:text-2xl font-semibold break-words">
                    {displayName}, você poderia esperar pagar <span className="text-yellow-300 font-bold">R$ {offerPriceAnchor.toFixed(2).replace('.',',')}</span> por este sistema completo de transformação...
                </p>
                <div className="text-center mt-10">
                    <Button onClick={() => document.getElementById(isPriceRevealed ? 'final-offer-section' : 'price-card-section')?.scrollIntoView({ behavior: 'smooth' })} className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg sm:text-xl py-3 sm:py-4 px-8 sm:px-10 rounded-xl shadow-xl hover:scale-105 transition-transform duration-300 animate-icon-subtle-float">
                        <Gift className="mr-2 h-5 w-5 shrink-0" /> QUERO ACESSAR TUDO ISSO
                    </Button>
                </div>
            </section>

            <hr className="border-purple-700/30 my-10 md:my-14" />

            <section className="animate-fade-in" style={{animationDelay: '1.8s'}}>
                <h2 className="font-headline text-2xl sm:text-3xl md:text-4xl text-center mb-4 goddess-text-gradient">
                    +7.400 Mulheres Já Desbloquearam Seus Códigos!
                </h2>
                <p className="text-center text-muted-foreground mb-8 text-md">Veja o que elas estão dizendo:</p>
                <div className="relative">
                    <div className="flex overflow-x-auto snap-x snap-mandatory py-4 space-x-6 scrollbar-thin scrollbar-thumb-accent scrollbar-track-purple-900/50 px-4">
                        {testimonialsData.map((testimonial) => (
                            <TestimonialCard key={testimonial.id} {...testimonial} />
                        ))}
                    </div>
                </div>
                 <div className="text-center mt-8">
                     <Image data-ai-hint="women success celebration" src="https://placehold.co/700x200.png" alt="Mulheres Felizes e Realizadas" width={600} height={171} className="rounded-lg shadow-xl border-2 border-accent/50 w-full max-w-md sm:max-w-lg md:max-w-xl mx-auto"/>
                </div>
            </section>

            <hr className="border-purple-700/30 my-10 md:my-14" />

            <section className="animate-fade-in" style={{animationDelay: '2.1s'}} onMouseEnter={handleScrollLock}>
                 <h2 className="font-headline text-2xl sm:text-3xl md:text-4xl text-center mb-8 goddess-text-gradient">Sua Encruzilhada, {displayName}:</h2>
                <div className={cn("grid md:grid-cols-2 gap-6 md:gap-8 transition-opacity duration-500", isScrollLocked && "opacity-50 blur-sm scroll-lock-pulse")}>
                    <Card className="bg-red-900/70 border-2 border-red-600 p-6 rounded-2xl">
                        <CardHeader className="p-0 mb-3 text-center">
                            <ThumbsDown className="h-10 w-10 text-red-300 mx-auto mb-2 shrink-0" />
                            <CardTitle className="text-xl sm:text-2xl text-red-200">CONTINUAR COMO ESTÁ</CardTitle>
                        </CardHeader>
                        <ul className="space-y-2 text-red-200/90 text-sm sm:text-base">
                            <li className="flex items-start"><XCircle className="h-5 w-5 text-red-400 mr-2 shrink-0 mt-0.5" /> Frustração constante com a falta de resultados.</li>
                            <li className="flex items-start"><XCircle className="h-5 w-5 text-red-400 mr-2 shrink-0 mt-0.5" /> Sonhos como {dreamsText} parecendo impossíveis.</li>
                            <li className="flex items-start"><XCircle className="h-5 w-5 text-red-400 mr-2 shrink-0 mt-0.5" /> Ciclos de autossabotagem e procrastinação.</li>
                            <li className="flex items-start"><XCircle className="h-5 w-5 text-red-400 mr-2 shrink-0 mt-0.5" /> Ver outras pessoas conquistando e você não.</li>
                            <li className="flex items-start"><XCircle className="h-5 w-5 text-red-400 mr-2 shrink-0 mt-0.5" /> Desperdício de energia e potencial.</li>
                        </ul>
                    </Card>
                    <Card className="bg-green-900/70 border-2 border-green-600 p-6 rounded-2xl">
                        <CardHeader className="p-0 mb-3 text-center">
                            <ThumbsUp className="h-10 w-10 text-green-300 mx-auto mb-2 shrink-0" />
                            <CardTitle className="text-xl sm:text-2xl text-green-200">VIRAR O JOGO AGORA</CardTitle>
                        </CardHeader>
                         <ul className="space-y-2 text-green-200/90 text-sm sm:text-base">
                            <li className="flex items-start"><CheckCircle2 className="h-5 w-5 text-green-400 mr-2 shrink-0 mt-0.5" /> Desbloquear seu poder de manifestação real.</li>
                            <li className="flex items-start"><CheckCircle2 className="h-5 w-5 text-green-400 mr-2 shrink-0 mt-0.5" /> Manifestar {dreamsText} {achievementDateText}.</li>
                            <li className="flex items-start"><CheckCircle2 className="h-5 w-5 text-green-400 mr-2 shrink-0 mt-0.5" /> Reprogramar sua mente para o sucesso.</li>
                            <li className="flex items-start"><CheckCircle2 className="h-5 w-5 text-green-400 mr-2 shrink-0 mt-0.5" /> Sentir-se confiante, capaz e merecedora.</li>
                            <li className="flex items-start"><CheckCircle2 className="h-5 w-5 text-green-400 mr-2 shrink-0 mt-0.5" /> Viver a vida dos seus sonhos.</li>
                        </ul>
                    </Card>
                </div>
                <div className={cn("text-center mt-10 transition-opacity duration-1000", isScrollLocked ? "opacity-0" : "opacity-100 animate-fade-in")} style={{animationDelay: isScrollLocked ? '0s' : '2s'}}>
                    <Button onClick={() => document.getElementById(isPriceRevealed ? 'final-offer-section' : 'price-card-section')?.scrollIntoView({ behavior: 'smooth' })} size="lg" className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 hover:from-purple-700 hover:via-pink-700 hover:to-red-700 text-white font-bold text-lg sm:text-xl py-4 px-10 rounded-xl shadow-2xl animate-intense-pulse">
                        <Rocket className="mr-2 h-6 w-6 shrink-0" /> EU DECIDO VIRAR O JOGO!
                    </Button>
                </div>
            </section>

            <hr className="border-purple-700/30 my-10 md:my-14" />

            <section className="animate-fade-in bg-black/80 rounded-3xl p-8 sm:p-12 text-center border-t-4 border-accent" style={{animationDelay: '2.4s'}}>
                <h2 className="font-headline text-2xl sm:text-3xl md:text-4xl text-yellow-300 mb-6">É agora ou você vai continuar patinando, {displayName}?</h2>
                <p className="text-lg sm:text-xl text-purple-200/90 mb-8 max-w-xl mx-auto">A cada segundo de hesitação, você adia a vida extraordinária que MERECE. Outras mulheres estão desbloqueando seus códigos AGORA.</p>
                <Button onClick={() => document.getElementById(isPriceRevealed ? 'final-offer-section' : 'price-card-section')?.scrollIntoView({ behavior: 'smooth' })} size="lg" className="goddess-gradient text-primary-foreground font-extrabold text-xl sm:text-2xl py-4 sm:py-5 px-10 sm:px-12 rounded-xl shadow-2xl animate-subtle-vibration hover:shadow-accent/50 transform hover:scale-105 transition-all">
                     CLIQUE AQUI E TRANSFORME SUA VIDA!
                </Button>
                <p className="text-sm text-muted-foreground mt-4 animate-subtle-pulse" style={{animationDelay: '1s'}}>+9 mulheres desbloqueando seus códigos neste exato momento...</p>
            </section>

            <section className="text-center py-8" style={{animationDelay: '2.7s'}}>
                <AlertDialog open={showRecusePopup} onOpenChange={setShowRecusePopup}>
                    <AlertDialogTrigger asChild>
                        <Button variant="ghost" className="text-purple-400/70 hover:text-red-400 hover:bg-red-900/30 text-sm">
                            <XCircle className="mr-2 h-4 w-4 shrink-0" /> Prefiro continuar como estou e perder essa chance.
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-slate-900 border-red-500 text-white">
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-red-400 text-2xl">Tem certeza, {displayName}?</AlertDialogTitle>
                            <AlertDialogDescription className="text-purple-300/80">
                                Esta oferta é única e pode não aparecer novamente. Ao fechar, você reconhece que está escolhendo conscientemente não transformar sua capacidade de manifestar {dreamsText}. O arrependimento pode ser mais caro.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel className="text-gray-300 hover:bg-gray-700 border-gray-600">Quero pensar melhor</AlertDialogCancel>
                            <AlertDialogAction onClick={() => { setShowRecusePopup(false); playSound('form_error.mp3'); }} className="bg-red-600 hover:bg-red-700 text-white">Sim, tenho certeza (e aceito as consequências)</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </section>
        </main>

        <div className="fixed bottom-0 left-0 right-0 md:hidden bg-black/80 backdrop-blur-sm p-3 border-t border-purple-700/50 z-50 shadow-2xl animate-fade-in" style={{animationDelay: '3s'}}>
            <Button onClick={() => document.getElementById(isPriceRevealed ? 'final-offer-section' : 'price-card-section')?.scrollIntoView({ behavior: 'smooth' })} className="w-full goddess-gradient text-primary-foreground font-bold text-md py-3 rounded-lg animate-subtle-glow">
                <LucideSparkles className="mr-2 h-5 w-5 animate-ping absolute left-4 opacity-50 shrink-0" style={{animationDuration:'3s'}} />
                {stickyMessages[stickyMessageIndex]}
                <LucideSparkles className="ml-2 h-5 w-5 animate-ping absolute right-4 opacity-50 shrink-0" style={{animationDuration:'3s', animationDelay:'0.5s'}}/>
            </Button>
        </div>
    </div>
  );
};

const formatUserDreams = (dreams?: DreamOption[]): string => {
  if (!dreams || dreams.length === 0) return "seus maiores sonhos";
  if (dreams.length === 1) return dreams[0].label.toLowerCase();
  if (dreams.length === 2) return `${dreams[0].label.toLowerCase()} e ${dreams[1].label.toLowerCase()}`;
  const lastDream = dreams[dreams.length - 1].label.toLowerCase();
  const initialDreams = dreams.slice(0, -1).map(d => d.label.toLowerCase()).join(', ');
  return `${initialDreams} e ${lastDream}`;
};

    