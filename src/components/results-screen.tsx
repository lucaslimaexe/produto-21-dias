
"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AlertTriangle, Clock, Zap, ExternalLink, XCircle, Wand2, Lightbulb, BookOpen, Users, Map, GitCompareArrows, Heart, Bolt, Sun, Loader2, Sparkles as LucideSparkles, ThumbsDown, ThumbsUp, Lock, CircleDollarSign, ShoppingCart, Star, ChevronLeft, ChevronRight, Eye, Group, Key, Unlock, Brain, TrendingUp, Target, ShieldOff, ShieldCheck, MessageCircle, Rocket, Gift, Palette, Activity, CheckCircle2 } from 'lucide-react';
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
  { id: 'conscious_manifestation_phrases', name: "Manifestação com Frases de Poder", promise: "Frases que reprogramam sua frequência vibracional.", value: 47, icon: MessageCircle, dataAiHint: "quote text" },
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

const storyTestimonialsData = [
  { id: 1, name: "Ana V.", avatar: "https://placehold.co/80x80.png", dataAiHint: "woman profile", message: "“Elas me quebraram.\nEsse ritual me montou de novo, peça por peça.”" },
  { id: 2, name: "Julia R.", avatar: "https://placehold.co/80x80.png", dataAiHint: "woman smiling", message: "“Eu não renasci.\nEu me permiti nascer pela primeira vez.”" },
  { id: 3, name: "Sofia M.", avatar: "https://placehold.co/80x80.png", dataAiHint: "woman confident", message: "“Não sei o que você tá sentindo agora, mas eu sei o que vai sentir no dia 4…”" },
  { id: 4, name: "Laura B.", avatar: "https://placehold.co/80x80.png", dataAiHint: "woman happy", message: "“Eu nunca pensei que alguém pudesse me destravar assim…”" },
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

const faqItems = [
    {
        id: "faq1",
        question: "O Código da Deusa™ é mais um curso online?",
        answer: "Não. É um RITUAL DE TRANSFORMAÇÃO PROFUNDA de 21 dias, desenhado para reprogramar sua identidade e desbloquear seu poder de manifestação na raiz. Não é sobre informação, é sobre IMPLANTAÇÃO de um novo eu."
    },
    {
        id: "faq2",
        question: "Preciso de muito tempo por dia?",
        answer: "O ritual diário leva menos de 5 MINUTOS. O poder não está no tempo, mas na FREQUÊNCIA e na INTENÇÃO que você coloca. É sobre micro-ajustes diários que geram um impacto massivo."
    },
    {
        id: "faq3",
        question: "E se eu já tentei de tudo e nada funcionou?",
        answer: "Ótimo. Isso significa que você está pronta para algo que REALMENTE funciona. O Código da Deusa™ não é mais do mesmo. Ele vai onde os outros métodos não ousam ir: na sua IDENTIDADE CENTRAL."
    },
    {
        id: "faq4",
        question: "É seguro? Tem garantia?",
        answer: "Sua transformação é o nosso único foco. Você tem uma GARANTIA INCONDICIONAL de 7 dias. Se, por qualquer motivo, você sentir que este não é o seu momento de despertar, seu investimento simbólico é 100% devolvido. O risco é zero. O arrependimento de não tentar é eterno."
    },
    {
        id: "faq5",
        question: "Como recebo o acesso?",
        answer: "IMEDIATAMENTE após a confirmação do seu desbloqueio. Você receberá um email com todas as instruções para acessar o portal secreto e iniciar sua jornada de 21 dias. O universo não espera. Sua transformação também não."
    }
];

const majorSectionIds = [
  'diagnostics-section',
  'offer-start-section',
  'modules-section',
  'who-its-for-section',
  'testimonials-section',
  'price-anchor-section',
  'map-section',
  'before-after-section',
  'vision-section',
  'shield-section',
  'moving-testimonials-section',
  'final-touch-section',
  'faq-section',
  'decision-section',
  'final-cta-section',
];


const AnalysisInsightCard: React.FC<{ icon: React.ElementType, title: string, text: string, className?: string }> = ({ icon: Icon, title, text, className }) => (
    <Card className={cn("bg-purple-900/50 border-purple-700/70 p-4 w-full min-w-[280px] sm:min-w-[300px] md:min-w-0 md:w-auto md:max-w-xs shrink-0 scroll-snap-align-center", className)}>
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

const TestimonialStoryCard: React.FC<{ name: string, avatar: string, dataAiHint: string, message: string, className?: string }> = ({ name, avatar, dataAiHint, message, className }) => (
  <Card className={cn("bg-slate-800/60 border-purple-600/70 text-foreground w-[280px] sm:w-[320px] shrink-0 scroll-snap-align-center p-5 flex flex-col items-start text-left shadow-lg", className)}>
    <div className="flex items-center mb-3">
      <Image data-ai-hint={dataAiHint} src={avatar} alt={name} width={40} height={40} className="rounded-full border-2 border-accent mr-3" />
      <CardTitle className="text-md text-accent">{name}</CardTitle>
    </div>
    <CardContent className="p-0">
      <p className="text-sm text-purple-200/90 leading-relaxed whitespace-pre-line">{message}</p>
    </CardContent>
     <div className="mt-2 flex items-center">
          <div className="h-2 w-2 bg-green-400 rounded-full mr-1 animate-pulse"></div>
          <span className="text-xs text-green-300/70">online</span>
      </div>
  </Card>
);

const PhaseCard: React.FC<{ phase: string, title: string, description: string | React.ReactNode, icon: React.ElementType, delay: string, lockedIcon?: React.ElementType }> = ({ phase, title, description, icon: Icon, delay, lockedIcon: LockedIcon = Lock }) => (
    <Card className="bg-slate-800/70 border-purple-600/80 p-5 text-center animate-fade-in transform hover:scale-105 transition-transform duration-300 h-full flex flex-col" style={{ animationDelay: delay }}>
        <div className="flex flex-col items-center flex-grow">
            <div className="relative mb-3">
                <Icon className="h-12 w-12 text-accent" />
                <LockedIcon className="absolute -top-1 -right-1 h-5 w-5 text-yellow-400 bg-slate-900 p-0.5 rounded-full" />
            </div>
            <p className="text-xs text-yellow-300 font-semibold mb-1">{phase}</p>
            <h4 className="text-lg font-semibold text-pink-400 mb-2">{title}</h4>
            {typeof description === 'string' ? <p className="text-sm text-purple-200/90 leading-relaxed whitespace-pre-line flex-grow">{description}</p> : <div className="flex-grow">{description}</div>}
        </div>
    </Card>
);

const BeforeAfterCard: React.FC<{ title: string, items: string[], bgColor: string, borderColor: string, textColor: string, icon: React.ElementType, className?: string }> = ({ title, items, bgColor, borderColor, textColor, icon: Icon, className }) => (
    <Card className={cn("p-6 rounded-xl shadow-xl w-full h-full flex flex-col", bgColor, borderColor, className)}>
        <CardHeader className="p-0 mb-4 text-center">
            <Icon className={cn("h-10 w-10 mx-auto mb-2", textColor === "text-red-300" ? "text-red-400" : "text-green-400")} />
            <CardTitle className={cn("text-xl sm:text-2xl", textColor)}>{title}</CardTitle>
        </CardHeader>
        <CardContent className="p-0 flex-grow">
            <ul className={cn("space-y-2 text-sm sm:text-base whitespace-pre-line", textColor === "text-red-300" ? "text-red-200/90" : "text-green-200/90")}>
                {items.map((item, index) => (
                    <li key={index} className="flex items-start">
                        {textColor === "text-red-300" ? <XCircle className="h-5 w-5 text-red-400 mr-2 shrink-0 mt-0.5" /> : <CheckCircle2 className="h-5 w-5 text-green-400 mr-2 shrink-0 mt-0.5" />}
                        {item}
                    </li>
                ))}
            </ul>
        </CardContent>
    </Card>
);

const VisionCard: React.FC<{ title: string, icon: React.ElementType, dataAiHint: string, onClick: () => void, isSelected: boolean, className?: string }> = ({ title, icon: Icon, dataAiHint, onClick, isSelected, className }) => (
    <button
        onClick={onClick}
        className={cn(
            "bg-slate-800/60 border-2 border-purple-600/70 p-4 rounded-xl text-center w-full aspect-[3/2] sm:aspect-auto flex flex-col items-center justify-center transform transition-all duration-300 hover:scale-105 hover:border-accent h-auto",
            isSelected ? "border-accent shadow-2xl shadow-accent/40 scale-105" : "",
            className
        )}
        aria-pressed={isSelected}
    >
        <Icon data-ai-hint={dataAiHint} className={cn("h-10 w-10 sm:h-12 sm:w-12 mb-2", isSelected ? "text-accent" : "text-purple-400")} />
        <p className={cn("text-sm sm:text-md font-semibold leading-tight", isSelected ? "text-accent" : "text-purple-200/90")}>{title}</p>
        {isSelected && <p className="text-xs text-yellow-300 mt-1 animate-pop-in">🔓 Pronto para desbloquear esse aspecto?</p>}
    </button>
);

const GuaranteePillarCard: React.FC<{ icon: React.ElementType; title: string; description: string; delay: string; }> = ({ icon: Icon, title, description, delay }) => (
    <Card className="bg-slate-800/70 border-purple-600/80 p-5 text-center animate-fade-in transform hover:scale-105 transition-transform duration-300 h-full flex flex-col" style={{ animationDelay: delay }}>
        <div className="flex flex-col items-center flex-grow">
            <Icon className="h-10 w-10 text-accent mb-3" />
            <h4 className="text-lg font-semibold text-pink-400 mb-2">{title}</h4>
            <p className="text-sm text-purple-200/90 leading-relaxed flex-grow">{description}</p>
        </div>
    </Card>
);


export const ResultsScreen: React.FC<ResultsScreenProps> = ({
  onRestart,
  analysisResult,
  analysisError,
  userName,
  userDreams,
  dreamsAchievementDateLabel
}) => {
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [pageScrollProgress, setPageScrollProgress] = useState(0);

  const [priceCardTimeLeft, setPriceCardTimeLeft] = useState(7 * 60); 
  const [priceCardVacancies, setPriceCardVacancies] = useState(3);
  
  const [showRecusePopup, setShowRecusePopup] = useState(false);
  const [isScrollLocked, setIsScrollLocked] = useState(false);
  
  const finalOfferTimerInitial = 2 * 60; 
  const [finalOfferTimeLeft, setFinalOfferTimeLeft] = useState(finalOfferTimerInitial);
  const [isPriceRevealed, setIsPriceRevealed] = useState(false);
  const [isFinalOfferTimerBlinking, setIsFinalOfferTimerBlinking] = useState(false);

  const [isUnlockingCode, setIsUnlockingCode] = useState(false);
  const [isCodeUnlocked, setIsCodeUnlocked] = useState(false);
  const unlockingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [selectedVisionCard, setSelectedVisionCard] = useState<string | null>(null);
  
  const displayName = userName || "Querida Deusa";
  const dreamsText = userDreams && userDreams.length > 0 ? formatUserDreams(userDreams) : "seus maiores sonhos";
  const achievementDateText = dreamsAchievementDateLabel ? `já no ${dreamsAchievementDateLabel.toLowerCase()}` : "em breve";

  const currentAnalysisResult = analysisResult || {
      archetype: "Deusa em Descoberta",
      summary: "Sua jornada de autoconhecimento está apenas começando. Existem padrões a serem explorados e potenciais a serem desbloqueados. Continue com coragem e abertura para revelar seu verdadeiro poder.",
      keywords: ["Autoconhecimento", "Potencial Oculto", "Descoberta"],
      idealPercentage: 50,
      missingForIdeal: " Clareza sobre seus bloqueios mais profundos e ferramentas eficazes para transmutá-los em poder de manifestação."
  };

  const [gamifiedPercentage, setGamifiedPercentage] = useState(currentAnalysisResult.idealPercentage);

  useEffect(() => {
    setGamifiedPercentage(currentAnalysisResult.idealPercentage);
  }, [currentAnalysisResult.idealPercentage]);

  const conditionallyIncrementPercentage = (increment: number, capBeforeIncrement?: number) => {
    setGamifiedPercentage(prev => {
      if (capBeforeIncrement !== undefined && prev >= capBeforeIncrement) {
        return Math.min(100, prev); 
      }
      const newValue = prev + increment;
      return Math.min(100, newValue);
    });
  };

  const analysisCards = analysisCardsData(currentAnalysisResult);

  const registerSectionRef = useCallback((id: string) => (el: HTMLElement | null) => {
    sectionRefs.current[id] = el;
  }, []);

  useEffect(() => {
    const handleScroll = () => {
        if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
        scrollTimeoutRef.current = setTimeout(() => {
            let activeSectionId: string | null = null;
            let minDistanceToViewportTop = Infinity;
            let highestVisibleSectionId: string | null = null;
            let highestSectionTop = Infinity;

            Object.entries(sectionRefs.current).forEach(([id, element]) => {
                if (element) {
                    const rect = element.getBoundingClientRect();
                    const distanceToTop = Math.abs(rect.top);
                    const visibleHeight = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);

                    if (rect.top <= 100 && rect.bottom >= 100 && visibleHeight > 0) { 
                        if (distanceToTop < minDistanceToViewportTop) {
                            minDistanceToViewportTop = distanceToTop;
                            activeSectionId = id;
                        }
                    }
                    if (rect.top < window.innerHeight && rect.bottom > 0 && rect.top < highestSectionTop) {
                       highestSectionTop = rect.top;
                       highestVisibleSectionId = id;
                    }
                }
            });
            
            const determinedSectionId = activeSectionId || highestVisibleSectionId;
            
            if (determinedSectionId) {
                const currentIndex = majorSectionIds.indexOf(determinedSectionId);
                const progress = currentIndex >= 0 ? ((currentIndex + 1) / majorSectionIds.length) * 100 : (pageScrollProgress || 0);
                setPageScrollProgress(progress);
            } else {
                 const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                 const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                 if (scrollHeight > 0) {
                     const generalProgress = (scrollTop / scrollHeight) * 100;
                     setPageScrollProgress(generalProgress);
                 } else {
                     setPageScrollProgress(0); 
                 }
            }
        }, 100); 
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); 

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      if (unlockingTimeoutRef.current) clearTimeout(unlockingTimeoutRef.current);
    };
  }, [pageScrollProgress]); 
  
  useEffect(() => {
    if (priceCardTimeLeft <= 0) return;
    const timerId = setInterval(() => {
      setPriceCardTimeLeft(prevTime => Math.max(0, prevTime - 1));
    }, 1000);
    return () => clearInterval(timerId);
  }, [priceCardTimeLeft]);

  useEffect(() => {
    if (priceCardTimeLeft <= (5 * 60) && priceCardTimeLeft > 0 && priceCardVacancies > 1) { 
        setPriceCardVacancies(1);
        playSound('limit_reached.mp3');
    }
  }, [priceCardTimeLeft, priceCardVacancies]);

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


  const handleRevealPrice = () => {
    setIsPriceRevealed(true);
    playSound('dream_select.mp3');
    setFinalOfferTimeLeft(finalOfferTimerInitial);
    conditionallyIncrementPercentage(10, 75); 
    setTimeout(() => { 
        document.getElementById('map-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };
  
  const handleUnlockCode = () => {
    setIsUnlockingCode(true);
    playSound('feedback_show.mp3'); 
    if (unlockingTimeoutRef.current) clearTimeout(unlockingTimeoutRef.current);
    unlockingTimeoutRef.current = setTimeout(() => {
      setIsUnlockingCode(false);
      setIsCodeUnlocked(true);
      playSound('form_complete.mp3');
      setGamifiedPercentage(95); 
      
      requestAnimationFrame(() => {
        setTimeout(() => {
            const ctaSection = document.getElementById('final-purchase-cta-section');
            if (ctaSection) {
                 ctaSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 50); 
      });
    }, 3000);
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

  if (analysisError && !analysisResult) { 
      return (
          <div className="min-h-screen w-full flex flex-col items-center justify-center px-4 py-12 bg-gradient-to-br from-red-950 via-black to-purple-950 text-foreground">
              <AlertTriangle className="h-20 w-20 text-yellow-400 mb-6" />
              <h1 className="font-headline text-3xl text-red-400 mb-4">Erro na Análise</h1>
              <p className="text-lg text-muted-foreground mb-8 text-center max-w-md">{analysisError}</p>
              <Button onClick={onRestart} className="goddess-gradient text-primary-foreground font-bold py-3 px-8 rounded-lg h-auto whitespace-normal text-center leading-normal">
                  Tentar Novamente
              </Button>
          </div>
      );
  }
  
  const visionCardsItems = [
      { id: 'love', title: "Relacionamento Saudável", icon: Heart, dataAiHint: "couple love" },
      { id: 'energy', title: "Corpo com Energia", icon: Bolt, dataAiHint: "woman energy" },
      { id: 'purpose', title: "Propósito Ativo", icon: Target, dataAiHint: "target purpose" },
      { id: 'finance', title: "Finanças em Fluxo", icon: CircleDollarSign, dataAiHint: "money flow" },
  ];

  return (
    <div className="min-h-screen w-full flex flex-col items-center pt-16 sm:pt-20 pb-28 bg-gradient-to-br from-purple-950 via-black to-red-950 text-foreground overflow-x-hidden">
        <header className="fixed top-0 left-0 right-0 z-50 h-2 sm:h-3 bg-slate-800/60 backdrop-blur-sm shadow-lg border-b border-purple-700/30">
            <div
                className="h-full bg-gradient-to-r from-accent via-pink-500 to-primary transition-all duration-150 ease-linear"
                style={{ width: `${pageScrollProgress}%` }}
            />
        </header>

        <main className="w-full max-w-5xl space-y-12 md:space-y-16 px-4">
            <section id="diagnostics-section" ref={registerSectionRef('diagnostics-section')} className="animate-fade-in text-center pt-4" style={{animationDuration: '0.7s'}}>
                <h2 className="font-headline text-2xl sm:text-3xl md:text-4xl text-white font-bold mb-8 leading-tight">
                    DESCUBRA ABAIXO, {displayName}, O PORQUÊ VOCÊ NÃO REALIZA SEUS SONHOS
                </h2>
                <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-center mb-8">
                    <Card className="bg-black/50 border-2 border-pink-500/70 p-6 rounded-2xl shadow-xl">
                        <CardTitle className="text-lg sm:text-xl text-muted-foreground mb-1">Seu Arquétipo Dominante (Problemático):</CardTitle>
                        <p className="text-xl sm:text-2xl md:text-3xl font-bold text-pink-400 mb-0">{currentAnalysisResult.archetype}</p>
                    </Card>
                    <Card className="bg-black/50 border-2 border-yellow-500/70 p-6 rounded-2xl shadow-xl">
                        <CardTitle className="text-lg sm:text-xl text-muted-foreground mb-2">Nível de Alinhamento com Seu Potencial Máximo:</CardTitle>
                        <div className="flex items-center justify-center gap-3 mb-2">
                            <p className={cn("text-2xl sm:text-3xl font-bold", getPercentageColor(gamifiedPercentage).replace('bg-','text-'))}>{gamifiedPercentage}%</p>
                            {gamifiedPercentage <= 50 && <Badge variant="destructive" className="text-xs sm:text-sm animate-subtle-pulse">Estado Crítico</Badge>}
                        </div>
                        <Progress value={gamifiedPercentage} className={cn("w-full h-3 sm:h-4 border border-yellow-600/50 animated-progress-bar", `[&>div]:${getPercentageColor(gamifiedPercentage)}`)} />
                         {gamifiedPercentage === 100 && (
                            <p className="text-center text-lg text-green-400 font-bold animate-pulse-goddess mt-3">
                                ✨ PARABÉNS, {displayName}! SEU POTENCIAL MÁXIMO ESTÁ 100% DESBLOQUEADO! ✨
                            </p>
                        )}
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
                                            <Lock className="mr-1.5 h-3 w-3 shrink-0" /> {keyword}
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
                    <div className="flex overflow-x-auto snap-x snap-mandatory py-4 space-x-4 scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-purple-900/50 -mx-4 px-4">
                        {analysisCards.map(card => <AnalysisInsightCard key={card.id} icon={card.icon} title={card.title} text={card.text}/>)}
                    </div>
                </div>
                
                <Button 
                    onClick={() => {
                        document.getElementById('offer-start-section')?.scrollIntoView({ behavior: 'smooth' });
                        conditionallyIncrementPercentage(10, 40);
                    }} 
                    className="goddess-gradient text-primary-foreground font-bold text-lg sm:text-xl py-3 sm:py-4 px-8 sm:px-10 rounded-xl shadow-xl hover:scale-105 transition-transform duration-300 animate-pulse-goddess h-auto whitespace-normal text-center leading-normal"
                >
                    <Unlock className="mr-2 h-5 w-5 shrink-0" /> ENTENDI MEUS BLOQUEIOS, QUERO A SOLUÇÃO!
                </Button>
            </section>

            <hr className="border-purple-700/30 my-10 md:my-14" />

            <section id="offer-start-section" ref={registerSectionRef('offer-start-section')} className="animate-fade-in space-y-6 text-center" style={{animationDelay: '0.5s'}}>
                 <h2 className="font-headline text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold goddess-text-gradient leading-tight animate-fade-in" style={{animationDelay: '0.6s'}}>
                    {displayName}, Você Sente Que Algo Te Impede de Realizar {dreamsText}?
                </h2>
                <p className="text-md sm:text-lg text-purple-200/90 max-w-2xl mx-auto leading-relaxed animate-fade-in" style={{animationDelay: '0.8s'}}>
                    A verdade é que existe um <span className="text-red-400 font-semibold text-lg sm:text-xl">BLOQUEIO INVISÍVEL</span> que drena sua energia e te mantém presa em ciclos de frustração.
                </p>
                 <p className="text-md sm:text-lg text-purple-200/90 max-w-2xl mx-auto leading-relaxed animate-fade-in" style={{animationDelay: '1s'}}>
                    E se eu te dissesse que existe um <span className="font-bold text-yellow-300">MÉTODO COMPLETO</span>, prático e validado por centenas de mulheres para pulverizar esse bloqueio?
                 </p>
                <Button 
                    onClick={() => {
                        document.getElementById('modules-section')?.scrollIntoView({ behavior: 'smooth' });
                    }} 
                    variant="outline" 
                    className="border-accent text-accent hover:bg-accent/20 hover:text-yellow-300 font-semibold text-md sm:text-lg py-2.5 px-6 rounded-lg animate-fade-in animate-icon-subtle-float h-auto whitespace-normal text-center leading-normal" style={{animationDelay: '1.2s'}}
                >
                    <Eye className="mr-2 h-5 w-5 shrink-0" /> Veja o Método Completo
                </Button>
            </section>

            <hr className="border-purple-700/30 my-10 md:my-14" />
            
            <section id="modules-section" ref={registerSectionRef('modules-section')} className="animate-fade-in" style={{animationDelay: '1.5s'}}>
                <h2 className="font-headline text-2xl sm:text-3xl md:text-4xl text-center mb-8 sm:mb-12 goddess-text-gradient">
                    💎 {displayName}, o <span className="text-yellow-300">MAPA DETALHADO</span> para Você <span className="text-pink-400">DESBLOQUEAR</span> Sua Vida:
                </h2>
                 <p className="text-center text-lg sm:text-xl text-purple-100/90 -mt-6 mb-8 max-w-2xl mx-auto">
                    O Código da Deusa é um sistema COMPLETO com <span className="font-bold text-pink-300">7 módulos + bônus</span> que valem <span className="line-through text-xl sm:text-2xl font-bold text-red-400/90">R$ {totalRealValue.toFixed(2).replace('.',',')}</span>.
                </p>
                <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                    {goddessCodeModules.map((item) => (
                        <ModuleCard key={item.id} icon={item.icon} name={item.name} promise={item.promise} value={item.value} dataAiHint={item.dataAiHint}/>
                    ))}
                </div>
                <div className="text-center mt-10">
                     <Button 
                        onClick={() => {
                            document.getElementById('who-its-for-section')?.scrollIntoView({ behavior: 'smooth' });
                            conditionallyIncrementPercentage(10, 55);
                        }} 
                        className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg sm:text-xl py-3 sm:py-4 px-8 sm:px-10 rounded-xl shadow-xl hover:scale-105 transition-transform duration-300 animate-icon-subtle-float h-auto whitespace-normal text-center leading-normal"
                    >
                        <Group className="mr-2 h-5 w-5 shrink-0" /> ISSO É PARA MIM?
                    </Button>
                </div>
            </section>

            <hr className="border-purple-700/30 my-10 md:my-14" />

            <section id="who-its-for-section" ref={registerSectionRef('who-its-for-section')} className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <h2 className="font-headline text-2xl sm:text-3xl md:text-4xl text-center mb-10 goddess-text-gradient">Este Código É Para Você?</h2>
                <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                    <Card className="bg-green-900/20 border-green-500/50 p-6 rounded-xl shadow-lg">
                        <CardHeader className="p-0 mb-4">
                            <CardTitle className="text-xl sm:text-2xl text-green-300 text-center">O CÓDIGO DA DEUSA™ É PERFEITO PARA VOCÊ SE...</CardTitle>
                        </CardHeader>
                        <ul className="space-y-3 text-green-200/90">
                            <li className="flex items-start"><CheckCircle2 className="h-6 w-6 text-green-400 mr-3 shrink-0 mt-0.5" /> Você sente um chamado profundo para mais, mas uma força invisível te prende.</li>
                            <li className="flex items-start"><CheckCircle2 className="h-6 w-6 text-green-400 mr-3 shrink-0 mt-0.5" /> Você está cansada de métodos superficiais e busca uma transformação real e duradoura.</li>
                            <li className="flex items-start"><CheckCircle2 className="h-6 w-6 text-green-400 mr-3 shrink-0 mt-0.5" /> Você tem coragem de olhar para as suas sombras e ressignificar sua história.</li>
                            <li className="flex items-start"><CheckCircle2 className="h-6 w-6 text-green-400 mr-3 shrink-0 mt-0.5" /> Você está decidida a quebrar ciclos de autossabotagem e manifestar a vida que merece.</li>
                            <li className="flex items-start"><CheckCircle2 className="h-6 w-6 text-green-400 mr-3 shrink-0 mt-0.5" /> Você anseia por clareza, poder pessoal e uma conexão autêntica com sua intuição.</li>
                        </ul>
                    </Card>
                    <Card className="bg-red-900/20 border-red-500/50 p-6 rounded-xl shadow-lg">
                        <CardHeader className="p-0 mb-4">
                            <CardTitle className="text-xl sm:text-2xl text-red-300 text-center">FUJA DESTE CÓDIGO SE...</CardTitle>
                        </CardHeader>
                        <ul className="space-y-3 text-red-200/90">
                            <li className="flex items-start"><XCircle className="h-6 w-6 text-red-400 mr-3 shrink-0 mt-0.5" /> Você busca uma pílula mágica que não exija sua entrega e comprometimento.</li>
                            <li className="flex items-start"><XCircle className="h-6 w-6 text-red-400 mr-3 shrink-0 mt-0.5" /> Você prefere continuar na zona de conforto, mesmo que ela te aprisione.</li>
                            <li className="flex items-start"><XCircle className="h-6 w-6 text-red-400 mr-3 shrink-0 mt-0.5" /> Você não está disposta a investir tempo e energia na sua própria evolução.</li>
                            <li className="flex items-start"><XCircle className="h-6 w-6 text-red-400 mr-3 shrink-0 mt-0.5" /> Você acredita que a mudança vem de fora, e não de uma reprogramação interna.</li>
                            <li className="flex items-start"><XCircle className="h-6 w-6 text-red-400 mr-3 shrink-0 mt-0.5" /> Você tem medo de descobrir seu verdadeiro potencial e o poder que ele carrega.</li>
                        </ul>
                    </Card>
                </div>
                 <div className="text-center mt-10">
                    <Button 
                        onClick={() => {
                            document.getElementById('testimonials-section')?.scrollIntoView({ behavior: 'smooth' });
                        }} 
                        className="goddess-gradient text-primary-foreground font-bold text-lg sm:text-xl py-3 sm:py-4 px-8 sm:px-10 rounded-xl shadow-xl hover:scale-105 transition-transform duration-300 animate-icon-subtle-float h-auto whitespace-normal text-center leading-normal"
                    >
                        <Heart className="mr-2 h-5 w-5 shrink-0" /> SIM, SOU EU! QUERO VER PROVAS REAIS!
                    </Button>
                </div>
            </section>
            
            <hr className="border-purple-700/30 my-10 md:my-14" />

            <section id="testimonials-section" ref={registerSectionRef('testimonials-section')} className="animate-fade-in" style={{animationDelay: '1.8s'}}>
                <h2 className="font-headline text-2xl sm:text-3xl md:text-4xl text-center mb-4 goddess-text-gradient">
                    +7.400 Mulheres Já Desbloquearam Seus Códigos!
                </h2>
                <p className="text-center text-muted-foreground mb-8 text-md">Veja o que elas estão dizendo:</p>
                <div className="relative">
                    <div className="flex overflow-x-auto snap-x snap-mandatory py-4 space-x-6 scrollbar-thin scrollbar-thumb-accent scrollbar-track-purple-900/50 px-4 -mx-4">
                        {testimonialsData.map((testimonial) => (
                            <TestimonialCard key={testimonial.id} {...testimonial} />
                        ))}
                    </div>
                </div>
                 <div className="text-center mt-8">
                     <Image data-ai-hint="women success celebration" src="https://placehold.co/700x200.png" alt="Mulheres Felizes e Realizadas" width={600} height={171} className="rounded-lg shadow-xl border-2 border-accent/50 w-full max-w-md sm:max-w-lg md:max-w-xl mx-auto"/>
                </div>
                 <div className="text-center mt-10">
                    <Button 
                        onClick={() => {
                            document.getElementById('price-anchor-section')?.scrollIntoView({ behavior: 'smooth' });
                            conditionallyIncrementPercentage(10, 65);
                        }} 
                        className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg sm:text-xl py-3 sm:py-4 px-8 sm:px-10 rounded-xl shadow-xl hover:scale-105 transition-transform duration-300 animate-icon-subtle-float h-auto whitespace-normal text-center leading-normal"
                    >
                        <Gift className="mr-2 h-5 w-5 shrink-0" /> QUERO MINHA TRANSFORMAÇÃO AGORA!
                    </Button>
                </div>
            </section>
            
            <hr className="border-purple-700/30 my-10 md:my-14" />

            <section id="price-anchor-section" ref={registerSectionRef('price-anchor-section')} className="animate-fade-in text-center" style={{animationDelay: '1.2s'}}>
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
                            <p className="animate-subtle-pulse"><Clock className="inline h-4 w-4 mr-1 shrink-0" /> Promoção válida por: <span className="font-bold">{formatTime(priceCardTimeLeft)}</span></p>
                            <p className={cn("animate-subtle-pulse",priceCardVacancies === 1 ? 'text-red-400 font-bold animate-intense-pulse' : '')}><Users className="inline h-4 w-4 mr-1 shrink-0" /> Restam apenas: <span className="font-bold">{priceCardVacancies}</span> {priceCardVacancies === 1 ? 'acesso com este valor!' : 'acessos com este valor!'}</p>
                        </div>
                        
                        <Button onClick={handleRevealPrice} className="w-full goddess-gradient text-primary-foreground font-bold text-lg sm:text-xl py-3 sm:py-4 rounded-xl shadow-xl hover:scale-105 transition-transform duration-300 mt-4 h-auto whitespace-normal text-center leading-normal">
                            <Wand2 className="mr-2 h-5 w-5 shrink-0 animate-float" /> QUERO GARANTIR AGORA POR R${offerPriceAnchor} E REVELAR MINHA OFERTA MÁGICA!
                        </Button>
                        
                    </CardContent>
                </Card>
            </section>

            {isPriceRevealed && (
                <>
                    <hr className="border-purple-700/30 my-10 md:my-14" />
                    <section id="map-section" ref={registerSectionRef('map-section')} className="animate-fade-in py-10 md:py-12 text-center" style={{animationDelay: '0.2s'}}>
                        <h2 className="font-headline text-3xl sm:text-4xl text-yellow-300 mb-3 whitespace-pre-line">⚡ Sua Jornada de 21 Dias</h2>
                        <p className="text-purple-200/90 text-lg sm:text-xl mb-2 max-w-2xl mx-auto whitespace-pre-line">
                            Você está prestes a atravessar o portal mais importante da sua vida.
                        </p>
                        <p className="text-purple-300/80 text-md sm:text-lg mb-8 max-w-xl mx-auto whitespace-pre-line">
                            21 dias.{"\n"}
                            Cada dia uma ruptura.{"\n"}
                            Cada etapa, um fio solto que você vai costurar de volta em você mesma.
                        </p>
                        <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
                            <PhaseCard phase="DIAS 1-7" title="Quebrar o ciclo da dor." description="🔓 Desative padrões sabotadores." icon={Zap} delay="0.3s" />
                            <PhaseCard phase="DIAS 8-14" title="Recriar a sua identidade." description="🧠 Reprograme sua autoimagem." icon={Brain} delay="0.5s" />
                            <PhaseCard phase="DIAS 15-21" title="Cocriar a sua nova realidade." description="🔥 Manifeste a vida que merece." icon={LucideSparkles} delay="0.7s" />
                        </div>
                        <p className="text-purple-200/90 text-lg sm:text-xl mt-8 max-w-2xl mx-auto whitespace-pre-line">
                            Isso não é só um plano.{"\n"}
                            É um processo irreversível de reconstrução interna.
                        </p>
                        <p className="text-yellow-300 text-lg sm:text-xl mt-4 max-w-xl mx-auto whitespace-pre-line">
                            Você pode continuar adiando…{"\n"}
                            Ou se dar a chance de descobrir quem você teria sido se ninguém tivesse te quebrado.
                        </p>
                        <div className="text-center mt-10">
                            <Button onClick={() => document.getElementById('before-after-section')?.scrollIntoView({ behavior: 'smooth' })} className="goddess-gradient text-primary-foreground font-bold text-md sm:text-lg py-3 px-6 rounded-lg shadow-xl hover:scale-105 transition-transform duration-300 animate-icon-subtle-float h-auto whitespace-normal text-center leading-normal">
                                <Eye className="mr-2 h-5 w-5" /> VER O ANTES E DEPOIS
                            </Button>
                        </div>
                    </section>

                    <hr className="border-purple-700/30 my-10 md:my-14" />

                    <section id="before-after-section" ref={registerSectionRef('before-after-section')} className="animate-fade-in py-10 md:py-12 text-center" style={{animationDelay: '0.4s'}}>
                        <h2 className="font-headline text-3xl sm:text-4xl goddess-text-gradient mb-8">Sua Vida: Antes e Depois do Código</h2>
                         <p className="text-purple-300/80 text-md sm:text-lg mb-10 max-w-xl mx-auto whitespace-pre-line">
                            Essa escolha tá na sua mão agora.{"\n"}
                            E o tempo tá olhando.
                        </p>
                        <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-stretch">
                            <BeforeAfterCard 
                                title="ANTES" 
                                items={[
                                    "Você acorda com peso. Se sabota sem perceber.",
                                    "Vive como figurante da própria história.",
                                    "Sabe que nasceu pra mais… mas não lembra mais como era ser você."
                                ]}
                                bgColor="bg-slate-800/50"
                                borderColor="border-dashed border-red-700/50"
                                textColor="text-red-300"
                                icon={ShieldOff}
                                className="opacity-75 hover:opacity-100 animate-fade-in"
                                style={{animationDelay: '0.2s'}}
                            />
                            <BeforeAfterCard 
                                title="DEPOIS" 
                                items={[
                                    "Você vai acordar com clareza.",
                                    "Vai saber o que quer, como quer, e quem não entra mais na sua energia.",
                                    "Não vai mais pedir permissão.",
                                    "Vai criar, manifestar e expandir."
                                ]}
                                bgColor="bg-green-900/30"
                                borderColor="border-green-500/50"
                                textColor="text-green-300"
                                icon={ShieldCheck}
                                className="shadow-2xl shadow-green-500/30 animate-fade-in"
                                style={{animationDelay: '0.5s'}}
                            />
                        </div>
                       
                        <div className="text-center mt-10">
                            <Button onClick={() => document.getElementById('vision-section')?.scrollIntoView({ behavior: 'smooth' })} className="goddess-gradient text-primary-foreground font-bold text-md sm:text-lg py-3 px-6 rounded-lg shadow-xl hover:scale-105 transition-transform duration-300 animate-icon-subtle-float h-auto whitespace-normal text-center leading-normal">
                            <LucideSparkles className="mr-2 h-5 w-5" /> ATIVAR MINHA VISÃO DE VIDA
                            </Button>
                        </div>
                    </section>

                    <hr className="border-purple-700/30 my-10 md:my-14" />

                    <section id="vision-section" ref={registerSectionRef('vision-section')} className="animate-fade-in py-10 md:py-12 text-center" style={{animationDelay: '0.6s'}}>
                        <h2 className="font-headline text-3xl sm:text-4xl text-pink-400 mb-3 whitespace-pre-line">Essa é a vida que JÁ É SUA.</h2>
                        <p className="text-purple-200/90 text-lg sm:text-xl mb-2 max-w-2xl mx-auto whitespace-pre-line">
                            Você está a um <span className="font-bold text-yellow-300">sim</span> da realidade que já é sua.
                        </p>
                         <p className="text-purple-300/80 text-md sm:text-lg mb-10 max-w-2xl mx-auto whitespace-pre-line">
                            Imagina abrir os olhos e saber que está exatamente onde deveria estar.{"\n"}
                            Não por sorte. Não por acaso.{"\n"}
                            Mas porque você <span className="font-bold text-accent">decidiu</span>.
                        </p>
                        <p className="text-purple-200/90 text-lg sm:text-xl mb-10 max-w-2xl mx-auto whitespace-pre-line">
                            Essa vida com paz, energia, amor e propósito não é utopia.{"\n"}
                            Ela já foi desenhada. Ela já tá vibrando dentro de você.
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-10">
                            {visionCardsItems.map((card, index) => (
                                <VisionCard 
                                    key={card.id} 
                                    title={card.title} 
                                    icon={card.icon} 
                                    dataAiHint={card.dataAiHint}
                                    onClick={() => setSelectedVisionCard(card.id === selectedVisionCard ? null : card.id)}
                                    isSelected={selectedVisionCard === card.id}
                                    className="animate-fade-in"
                                    style={{animationDelay: `${0.1 * index}s`}}
                                />
                            ))}
                        </div>
                        <p className="text-yellow-300 text-lg sm:text-xl max-w-xl mx-auto whitespace-pre-line">
                            Você só precisa <span className="font-semibold text-pink-400">ativar o código.</span>{"\n"}
                            E aceitar o convite.
                        </p>
                        <div className="text-center mt-10">
                            <Button onClick={() => document.getElementById('shield-section')?.scrollIntoView({ behavior: 'smooth' })} className="goddess-gradient text-primary-foreground font-bold text-md sm:text-lg py-3 px-6 rounded-lg shadow-xl hover:scale-105 transition-transform duration-300 animate-icon-subtle-float h-auto whitespace-normal text-center leading-normal">
                            <ShieldCheck className="mr-2 h-5 w-5" /> VER MINHA GARANTIA TOTAL
                            </Button>
                        </div>
                    </section>

                    <hr className="border-purple-700/30 my-10 md:my-14" />
                    
                     <section id="shield-section" ref={registerSectionRef('shield-section')} className="animate-fade-in py-10 md:py-12 text-center" style={{ animationDelay: '0.8s' }}>
                        <h2 className="font-headline text-3xl sm:text-4xl goddess-text-gradient mb-3 whitespace-pre-line">Sem Risco. Sem Volta.</h2>
                        <p className="text-purple-200/90 text-lg sm:text-xl mb-6 max-w-2xl mx-auto whitespace-pre-line">
                            Você já duvidou de tudo.{"\n"}
                            Do mundo. Das pessoas. De si mesma.
                        </p>
                        <p className="text-purple-300/80 text-md sm:text-lg mb-10 max-w-xl mx-auto whitespace-pre-line">
                            Agora, pela primeira vez, você vai entrar num caminho <span className="font-bold text-yellow-300">sem risco</span>.
                        </p>
                        
                        <div className="flex flex-col items-center mb-10">
                            <div className="relative mb-8 p-6">
                                <ShieldCheck className="h-24 w-24 sm:h-32 sm:w-32 text-accent animate-subtle-glow" />
                                <Badge className="absolute top-0 left-0 transform -translate-x-1/4 -translate-y-1/2 bg-pink-500 text-white animate-pop-in" style={{animationDelay:'0.2s'}}>+7.000 desbloqueios</Badge>
                                <Badge className="absolute bottom-0 right-0 transform translate-x-1/4 translate-y-1/2 bg-green-500 text-white animate-pop-in" style={{animationDelay:'0.4s'}}>100% Risco Zero</Badge>
                                <Badge className="absolute top-1/2 -translate-y-1/2 -right-5 sm:-right-10 transform translate-x-1/4 bg-purple-500 text-white animate-pop-in text-xs sm:text-sm" style={{animationDelay:'0.6s'}}>Testado. Validado.</Badge>
                                <Badge className="absolute top-1/2 -translate-y-1/2 -left-5 sm:-left-10 transform -translate-x-1/4 bg-yellow-500 text-black animate-pop-in text-xs sm:text-sm" style={{animationDelay:'0.8s'}}>Infalível.</Badge>
                            </div>
                        </div>

                         <div className="mb-10 space-y-6">
                            <h3 className="font-headline text-xl sm:text-2xl text-yellow-300 mb-4">Sua Garantia Absoluta:</h3>
                             <div className="grid md:grid-cols-3 gap-4 sm:gap-6">
                                <Card className="bg-slate-800/60 border-purple-700/70 p-4 animate-fade-in transform hover:scale-105 transition-transform duration-300" style={{ animationDelay: "0.2s" }}>
                                    <CardContent className="flex items-center gap-3 p-0">
                                        <CheckCircle2 className="h-7 w-7 text-green-400 shrink-0" />
                                        <p className="text-md text-purple-200/95 text-left">Sem chance de dar errado.</p>
                                    </CardContent>
                                </Card>
                                <Card className="bg-slate-800/60 border-purple-700/70 p-4 animate-fade-in transform hover:scale-105 transition-transform duration-300" style={{ animationDelay: "0.35s" }}>
                                    <CardContent className="flex items-center gap-3 p-0">
                                        <CheckCircle2 className="h-7 w-7 text-green-400 shrink-0" />
                                        <p className="text-md text-purple-200/95 text-left">Sem volta pra dor.</p>
                                    </CardContent>
                                </Card>
                                <Card className="bg-slate-800/60 border-purple-700/70 p-4 animate-fade-in transform hover:scale-105 transition-transform duration-300" style={{ animationDelay: "0.5s" }}>
                                    <CardContent className="flex items-center gap-3 p-0">
                                        <CheckCircle2 className="h-7 w-7 text-green-400 shrink-0" />
                                        <p className="text-md text-purple-200/95 text-left">Sem mais desculpas.</p>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                        
                        <div className="mb-10 space-y-6">
                            <h3 className="font-headline text-xl sm:text-2xl text-pink-400 mb-4">Três Pilares da Sua Transformação Irreversível:</h3>
                            <div className="grid md:grid-cols-3 gap-4 sm:gap-6">
                                <GuaranteePillarCard icon={Target} title="À Prova de Falhas" description="Um processo desenhado para o seu sucesso." delay="0.5s" />
                                <GuaranteePillarCard icon={Key} title="Código Pessoal" description="Um sistema que já reside em você, esperando para ser ativado." delay="0.65s" />
                                <GuaranteePillarCard icon={Gift} title="Investimento Mínimo" description="Por menos do que você gasta em distrações que não te levam a lugar nenhum." delay="0.8s" />
                            </div>
                        </div>
                        
                        <Card className="bg-destructive/20 border-2 border-destructive/50 p-6 rounded-2xl max-w-2xl mx-auto shadow-xl shadow-destructive/30 animate-fade-in" style={{animationDelay: '1s'}}>
                            <CardContent className="p-0 text-center space-y-3">
                                <AlertTriangle className="h-10 w-10 text-red-400 mx-auto" />
                                <p className="text-red-300 font-semibold text-lg sm:text-xl md:text-2xl leading-tight whitespace-pre-line">
                                    E sim…{"\n\n"}
                                    Se você ignorar isso agora,{"\n"}
                                    você vai se lembrar disso depois.
                                </p>
                            </CardContent>
                        </Card>

                        <div className="text-center mt-10">
                            <Button onClick={() => document.getElementById('moving-testimonials-section')?.scrollIntoView({ behavior: 'smooth' })} className="goddess-gradient text-primary-foreground font-bold text-md sm:text-lg py-3 px-6 rounded-lg shadow-xl hover:scale-105 transition-transform duration-300 animate-icon-subtle-float h-auto whitespace-normal text-center leading-normal">
                            <MessageCircle className="mr-2 h-5 w-5" /> OUVIR QUEM JÁ VIVEU ISSO
                            </Button>
                        </div>
                    </section>
                    
                    <hr className="border-purple-700/30 my-10 md:my-14" />

                    <section id="moving-testimonials-section" ref={registerSectionRef('moving-testimonials-section')} className="animate-fade-in py-10 md:py-12" style={{animationDelay: '1.0s'}}>
                    <h2 className="font-headline text-2xl sm:text-3xl md:text-4xl text-center mb-4 goddess-text-gradient whitespace-pre-line">
                        “Eu nunca pensei que alguém pudesse me destravar assim…”
                    </h2>
                    <p className="text-center text-purple-200/90 mb-8 sm:mb-12 text-md sm:text-lg max-w-xl mx-auto whitespace-pre-line">
                        Essas vozes não são frases prontas.{"\n"}
                        São ecos de mulheres que passaram exatamente pelo que você está passando agora.
                    </p>
                    <div className="relative">
                        <div className="flex overflow-x-auto snap-x snap-mandatory py-4 space-x-4 sm:space-x-6 scrollbar-thin scrollbar-thumb-accent scrollbar-track-purple-900/50 px-4 -mx-4">
                        {storyTestimonialsData.map((testimonial, index) => (
                            <TestimonialStoryCard 
                                key={testimonial.id} 
                                {...testimonial} 
                                className="animate-fade-in" 
                                style={{animationDelay: `${0.2 * index}s`}}
                            />
                        ))}
                        </div>
                    </div>
                    <div className="text-center mt-10">
                        <Button 
                        onClick={() => document.getElementById('final-touch-section')?.scrollIntoView({ behavior: 'smooth' })} 
                        className="goddess-gradient text-primary-foreground font-bold text-lg sm:text-xl py-3 sm:py-4 px-8 sm:px-10 rounded-xl shadow-xl hover:scale-105 transition-transform duration-300 animate-icon-subtle-float h-auto whitespace-normal text-center leading-normal"
                        >
                        <LucideSparkles className="mr-2 h-5 w-5 shrink-0" /> ESTOU PRONTA PARA O TOQUE FINAL!
                        </Button>
                    </div>
                    </section>

                    <hr className="border-purple-700/30 my-10 md:my-14" />
                   
                    <section id="final-touch-section" ref={registerSectionRef('final-touch-section')} className="animate-fade-in py-10 md:py-16 text-center" style={{animationDelay: '1.2s'}}>
                        {!isCodeUnlocked && !isUnlockingCode && (
                            <>
                                <h2 className="font-headline text-2xl sm:text-3xl md:text-4xl text-yellow-300 mb-6 whitespace-pre-line">
                                    Você pode voltar pra sua vida.{"\n"}
                                    Ou tocar nesse botão e começar a viver a sua.
                                </h2>
                                <p className="text-purple-200/90 text-lg sm:text-xl mb-6 max-w-xl mx-auto whitespace-pre-line">
                                    A diferença entre sua realidade atual e a vida que te espera{"\n"}
                                    é um clique.
                                </p>
                                <p className="text-pink-400 font-semibold text-lg sm:text-xl mb-10 max-w-xl mx-auto whitespace-pre-line">
                                    Mas esse clique não é só um botão.{"\n"}
                                    É a primeira decisão <span className="font-bold">real</span> que você toma por <span className="font-bold">você</span> em anos.
                                </p>
                                
                                <Button 
                                    onClick={handleUnlockCode} 
                                    className="bg-gradient-to-br from-pink-500 via-purple-600 to-accent hover:from-pink-600 hover:via-purple-700 hover:to-yellow-500 text-white font-extrabold text-xl sm:text-2xl md:text-3xl py-6 sm:py-8 px-10 sm:px-12 rounded-full shadow-2xl shadow-primary/50 animate-pulse-goddess transform hover:scale-110 transition-all duration-300 h-auto whitespace-normal text-center leading-normal"
                                >
                                    <Wand2 className="mr-3 h-8 w-8 shrink-0" />
                                    DESBLOQUEAR MEU CÓDIGO PESSOAL
                                </Button>
                            </>
                        )}

                        {isUnlockingCode && (
                            <div className="flex flex-col items-center justify-center h-24 py-6">
                                <Loader2 className="h-12 w-12 text-primary animate-spin mb-3" />
                                <p className="text-lg text-purple-300 font-semibold">Desbloqueando seu código pessoal...</p>
                            </div>
                        )}
                        
                        <div id="final-purchase-cta-section">
                            {isCodeUnlocked && (
                                <div className="animate-pop-in space-y-6 mt-8">
                                    <p className="text-purple-200/90 text-lg sm:text-xl whitespace-pre-line">
                                        Sim ou não.{"\n"}
                                        Agora ou nunca.{"\n"}
                                        Acordar ou continuar dormindo.
                                    </p>
                                    <p className="text-yellow-300 font-bold text-xl sm:text-2xl mt-2 mb-6 whitespace-pre-line">
                                        CÓDIGO DESBLOQUEADO!{"\n"}
                                        🔓 Você sabe o que precisa fazer.
                                    </p>
                                    
                                    <div id="final-offer-content-expanded" className="mt-10 bg-black/50 border-2 border-yellow-500 p-6 sm:p-10 rounded-3xl shadow-2xl shadow-yellow-500/50 text-center">
                                        <Wand2 className="h-16 w-16 text-accent mx-auto mb-4 animate-float" />
                                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-yellow-300 mb-3">Sua Co-Criação Mágica Revelada!</h2>
                                        <p className="text-purple-200/90 text-sm sm:text-base md:text-lg mb-3 sm:mb-5 break-words max-w-xl mx-auto">
                                            Mas, {displayName}, por um tempo <span className="text-yellow-300 font-bold">LIMITADÍSSIMO</span>, e como uma oportunidade única por ter chegado até aqui, seu acesso a todo o CÓDIGO DA DEUSA™ não será R$ {totalRealValue.toFixed(2).replace('.',',')}, nem mesmo R$ {offerPriceAnchor.toFixed(2).replace('.',',')}. Será por um valor simbólico de apenas:
                                        </p>
                                        <p className="text-[2.75rem] leading-tight sm:text-6xl md:text-7xl lg:text-8xl font-extrabold text-green-400 my-4 md:my-6 glow">
                                            R$ {offerPriceFinal.toFixed(2).replace('.',',')}
                                        </p>
                                        <p className="text-lg sm:text-xl md:text-2xl font-bold text-yellow-300 mb-4 sm:mb-6 break-words">
                                            SIM, {displayName}! APENAS R$ {offerPriceFinal.toFixed(2).replace('.',',')} HOJE! <br className="sm:hidden"/> Um desconto inacreditável sobre o valor já especial de R$ {offerPriceAnchor.toFixed(2).replace('.',',')}!
                                        </p>

                                        <div className="mb-6 md:mb-8 max-w-sm mx-auto">
                                            <div className={cn("flex items-center justify-center space-x-1 sm:space-x-2 mb-2", finalOfferTimeLeft < 60 && finalOfferTimeLeft > 0 && finalOfferTimeLeft % 2 !== 0 ? 'text-red-400' : 'text-yellow-200', finalOfferTimeLeft === 0 && 'text-red-600')}>
                                                <Clock className="h-5 w-5 sm:h-6 shrink-0" />
                                                <span className={cn("text-2xl sm:text-3xl font-bold font-mono", isFinalOfferTimerBlinking && finalOfferTimeLeft > 0 ? 'animate-ping opacity-75':'opacity-100')}>
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
                                            onClick={() => {
                                                setGamifiedPercentage(100);
                                                playSound('form_complete.mp3');
                                            }}
                                            className={cn(`w-full max-w-md mx-auto font-headline text-base sm:text-lg md:text-xl px-6 py-7 rounded-xl shadow-2xl transform hover:scale-105 transition-transform duration-200 pulse-goddess whitespace-normal text-center h-auto leading-normal`,
                                            finalOfferTimeLeft === 0 ? 'bg-gray-700 hover:bg-gray-800 cursor-not-allowed opacity-60' : 'bg-gradient-to-r from-green-500 via-emerald-600 to-green-700 hover:from-green-600 hover:via-emerald-700 hover:to-green-800 text-white')}
                                            disabled={finalOfferTimeLeft === 0}
                                        >
                                            <a href="https://pay.kiwify.com.br/xxxxxxxx" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                                                <ShoppingCart className="h-6 w-6 shrink-0" />
                                                <span className="leading-tight break-words">{finalOfferTimeLeft > 0 ? `Desbloquear agora – por R$${offerPriceFinal.toFixed(2).replace('.',',')}` : "OFERTA EXPIRADA"}</span>
                                                <ExternalLink className="h-5 w-5 shrink-0" />
                                            </a>
                                        </Button>
                                        <p className="text-xs text-yellow-200/80 mt-3">Acesso imediato. Garantia Incondicional de 7 Dias.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>
                  </>
                )}
            
            <hr className="border-purple-700/30 my-10 md:my-14" />
            
            <section id="faq-section" ref={registerSectionRef('faq-section')} className="animate-fade-in py-10 md:py-12" style={{ animationDelay: '0.2s' }}>
                <h2 className="font-headline text-2xl sm:text-3xl md:text-4xl text-center mb-10 goddess-text-gradient">Ainda Tem Dúvidas? Nós Respondemos!</h2>
                <Accordion type="single" collapsible className="w-full max-w-2xl mx-auto space-y-3">
                    {faqItems.map((item, index) => (
                        <AccordionItem key={item.id} value={item.id} className="bg-slate-800/60 border border-purple-600/70 rounded-lg px-4 animate-fade-in" style={{animationDelay: `${0.1 * index}s`}}>
                            <AccordionTrigger className="text-left text-md sm:text-lg text-pink-300 hover:text-accent font-semibold hover:no-underline py-4">
                                {item.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-purple-200/90 text-sm sm:text-base leading-relaxed pb-4">
                                {item.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
                    <div className="text-center mt-12">
                    <Button 
                        onClick={() => {
                            let targetId = 'final-touch-section';
                             if (isCodeUnlocked) {
                                targetId = 'final-purchase-cta-section';
                            }
                            document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                             if (targetId === 'final-touch-section' && !isCodeUnlocked && !isUnlockingCode) {
                                handleUnlockCode();
                            }
                        }}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg sm:text-xl py-3 sm:py-4 px-8 sm:px-10 rounded-xl shadow-xl hover:scale-105 transition-transform duration-300 animate-icon-subtle-float h-auto whitespace-normal text-center leading-normal"
                    >
                        <Key className="mr-2 h-5 w-5 shrink-0" /> ESTOU PRONTA PARA DESBLOQUEAR!
                    </Button>
                </div>
            </section>

            <hr className="border-purple-700/30 my-10 md:my-14" />

            <section id="decision-section" ref={registerSectionRef('decision-section')} className="animate-fade-in" style={{animationDelay: '0.2s'}}>
                <h2 className="font-headline text-2xl sm:text-3xl md:text-4xl text-center mb-8 goddess-text-gradient">Sua Encruzilhada, {displayName}:</h2>
                <div className={cn("grid md:grid-cols-2 gap-6 md:gap-8 transition-opacity duration-500", isScrollLocked && "opacity-50 blur-sm scroll-lock-pulse")}>
                    <Card className="bg-red-900/70 border-2 border-red-600 p-6 rounded-2xl h-full">
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
                    <Card className="bg-green-900/70 border-2 border-green-600 p-6 rounded-2xl h-full">
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
                    <Button onClick={() => {
                        const ctaSection = document.getElementById('final-purchase-cta-section');
                        if (ctaSection) {
                            ctaSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        } else {
                             document.getElementById('final-touch-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }
                    }} size="lg" className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 hover:from-purple-700 hover:via-pink-700 hover:to-red-700 text-white font-bold text-lg sm:text-xl py-4 px-10 rounded-xl shadow-2xl animate-intense-pulse h-auto whitespace-normal text-center leading-normal">
                        <Rocket className="mr-2 h-6 w-6 shrink-0" /> EU DECIDO VIRAR O JOGO!
                    </Button>
                </div>
            </section>

            <hr className="border-purple-700/30 my-10 md:my-14" />
            
            <section id="final-cta-section" ref={registerSectionRef('final-cta-section')} className="animate-fade-in bg-black/80 rounded-3xl p-8 sm:p-12 text-center border-t-4 border-accent" style={{animationDelay: '0.4s'}}>
                <h2 className="font-headline text-2xl sm:text-3xl md:text-4xl text-yellow-300 mb-6">É agora ou você vai continuar patinando, {displayName}?</h2>
                <p className="text-lg sm:text-xl text-purple-200/90 mb-8 max-w-xl mx-auto">A cada segundo de hesitação, você adia a vida extraordinária que MERECE. Outras mulheres estão desbloqueando seus códigos AGORA.</p>
                <Button onClick={() => {
                    const finalPurchaseSection = document.getElementById('final-purchase-cta-section'); 
                    if (finalPurchaseSection) {
                        finalPurchaseSection.scrollIntoView({behavior: 'smooth', block: 'center'});
                        if (!isCodeUnlocked) {
                            handleUnlockCode(); 
                        } else {
                             const purchaseButtonLink = finalPurchaseSection.querySelector('a');
                             if(purchaseButtonLink) purchaseButtonLink.click();
                        }
                    } else {
                        document.getElementById('final-touch-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        if(!isCodeUnlocked) handleUnlockCode();
                    }
                }} 
                size="lg" className="goddess-gradient text-primary-foreground font-extrabold text-xl sm:text-2xl py-4 sm:py-5 px-10 sm:px-12 rounded-xl shadow-2xl animate-subtle-vibration hover:shadow-accent/50 transform hover:scale-105 transition-all h-auto whitespace-normal text-center leading-normal">
                    CLIQUE AQUI E TRANSFORME SUA VIDA!
                </Button>
                <p className="text-sm text-muted-foreground mt-4 animate-subtle-pulse" style={{animationDelay: '1s'}}>+9 mulheres desbloqueando seus códigos neste exato momento...</p>
            </section>


            <section className="text-center py-8" style={{animationDelay: '0.7s'}}>
                <AlertDialog open={showRecusePopup} onOpenChange={setShowRecusePopup}>
                    <AlertDialogTrigger asChild>
                        <Button variant="ghost" className="text-purple-400/70 hover:text-red-400 hover:bg-red-900/30 text-sm h-auto whitespace-normal text-center leading-normal">
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

    
    
