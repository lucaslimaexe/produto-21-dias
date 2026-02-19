
"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AlertTriangle, Clock, Zap, ExternalLink, XCircle, Wand2, Lightbulb, BookOpen, Users, Map, GitCompareArrows, Heart, Bolt, Sun, Loader2, Sparkles as LucideSparkles, ThumbsDown, ThumbsUp, Lock, CircleDollarSign, ShoppingCart, Star, ChevronLeft, ChevronRight, Eye, Group, Key, Unlock, Brain, TrendingUp, Target, ShieldOff, ShieldCheck, MessageCircle, Rocket, Gift, Palette, Activity, CheckCircle2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import Image from 'next/image';
import { Progress } from "@/components/ui/progress";
import type { DreamOption } from './pre-questionnaire-form-screen';
import { cn } from '@/lib/utils';
import { playSound } from '@/lib/audioUtils';
import { useGamification } from '@/components/gamification';
import { AchievementBadge } from '@/components/gamification/AchievementBadge';
import { StickyCtaBar } from '@/components/results/StickyCtaBar';
import { ExitIntentModal, useExitIntent } from '@/components/results/ExitIntentModal';
import { SectionReveal } from '@/components/results/SectionReveal';
import { ReadMore } from '@/components/results/ReadMore';
import { ModuleCarousel } from '@/components/results/ModuleCarousel';
import { TestimonialVSLSlider } from '@/components/results/TestimonialVSLSlider';
import { BeforeAfterToggle } from '@/components/results/BeforeAfterToggle';

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
  { id: 'identity_unlock', name: "Desbloqueio da Identidade", promise: "ELIMINA de vez o padrão invisível que te mantinha presa.", value: 97, icon: Key, dataAiHint: "key lock" },
  { id: 'self_image_reprogram', name: "Reprogramação de Autoimagem", promise: "Troque o “eu não consigo” pelo “eu sou capaz” — diariamente.", value: 97, icon: Brain, dataAiHint: "brain mind" },
  { id: 'emotional_vibration_cleanse', name: "Limpeza de Vibração Emocional", promise: "Sai da escassez e ENTRA em estado de criação ativa.", value: 97, icon: LucideSparkles, dataAiHint: "sparkle clean" },
  { id: 'daily_ritual', name: "Ritual de Presença e Intenção", promise: "Reprograma sua mente em menos de 5 minutos por dia.", value: 47, icon: Eye, dataAiHint: "eye focus" },
  { id: 'letting_go_method', name: "O Método do Soltar", promise: "Para de sabotar seus desejos. Solta com confiança.", value: 67, icon: Unlock, dataAiHint: "unlock open" },
  { id: 'conscious_manifestation_phrases', name: "Manifestação com Frases de Poder", promise: "Frases que DESTRAVAM sua frequência vibracional.", value: 47, icon: MessageCircle, dataAiHint: "quote text" },
  { id: 'testimony_expansion_space', name: "Espaço de Testemunho e Expansão", promise: "Reconhece os sinais do universo e AVANÇA com clareza.", value: 97, icon: Group, dataAiHint: "group community" }
];
const totalRealValue = goddessCodeModules.reduce((sum, item) => sum + item.value, 0);
const offerPriceAnchor = 97;
const offerPriceFinal = 47;

const testimonialsData = [
  { id: 1, name: "Maria S.", age: 38, quote: "Estava quebrada. Em 15 dias, tripliquei minha renda. Eu não acreditava que fosse real.", stars: 5, image: "https://placehold.co/100x100.png", dataAiHint: "woman success" },
  { id: 2, name: "Ana L.", age: 45, quote: "Casamentos anteriores me destruíram. Em 1 semana com o Código, conheci quem eu merecia.", stars: 5, image: "https://placehold.co/100x100.png", dataAiHint: "woman happy love" },
  { id: 3, name: "Carla P.", age: 29, quote: "Minhas vendas explodiram em 21 dias. O bloqueio que eu não via sumiu.", stars: 5, image: "https://placehold.co/100x100.png", dataAiHint: "businesswoman achievement" },
  { id: 4, name: "Juliana M.", age: 33, quote: "Finalmente vi o padrão que me sabotava. Agora eu sei o que estava errado.", stars: 5, image: "https://placehold.co/100x100.png", dataAiHint: "woman thoughtful" },
];

const storyTestimonialsData = [
  { id: 1, name: "Ana V.", avatar: "https://placehold.co/80x80.png", dataAiHint: "woman profile", message: "“Elas me quebraram.\nEsse ritual me montou de novo, peça por peça.”" },
  { id: 2, name: "Julia R.", avatar: "https://placehold.co/80x80.png", dataAiHint: "woman smiling", message: "“Eu não renasci.\nEu me permiti nascer pela primeira vez.”" },
  { id: 3, name: "Sofia M.", avatar: "https://placehold.co/80x80.png", dataAiHint: "woman confident", message: "“Não sei o que você tá sentindo agora, mas eu sei o que vai sentir no dia 4…”" },
  { id: 4, name: "Laura B.", avatar: "https://placehold.co/80x80.png", dataAiHint: "woman happy", message: "“Eu nunca pensei que alguém pudesse me destravar assim…”" },
];

const dreamNotificationMap: Record<string, string> = {
  financial_freedom: "Seu sonho de Liberdade Financeira está mais perto. Mas só se você agir agora.",
  dream_house: "Seu sonho da Casa dos Sonhos está mais perto. Mas só se você agir agora.",
  travel_world: "Seu sonho de Viver Viajando está mais perto. Mas só se você agir agora.",
  new_car: "Seu sonho do Carro Novo está mais perto. Mas só se você agir agora.",
  soul_mate: "Seu sonho da Alma Gêmea está mais perto. Mas só se você agir agora.",
  successful_business: "Seu sonho do Negócio de Sucesso está mais perto. Mas só se você agir agora.",
  inner_peace: "Seu sonho de Paz Interior está mais perto. Mas só se você agir agora.",
  health_wellness: "Seu sonho de Saúde e Bem-Estar está mais perto. Mas só se você agir agora.",
  creative_expression: "Seu sonho de Expressão Criativa está mais perto. Mas só se você agir agora.",
  personal_growth: "Seu sonho de Crescimento Pessoal está mais perto. Mas só se você agir agora.",
};

const fakeUserNames = ["Ana", "Beatriz", "Camila", "Daniela", "Eduarda", "Fernanda", "Gabriela", "Helena", "Isabela", "Juliana", "Larissa", "Mariana", "Natália", "Olivia", "Patrícia", "Quintia", "Rafaela", "Sofia", "Tatiana", "Valentina", "Laura", "Alice", "Clara", "Elisa", "Yasmin"];
const fakeUserCities = ["São Paulo", "Rio de Janeiro", "Belo Horizonte", "Salvador", "Fortaleza", "Curitiba", "Manaus", "Recife", "Porto Alegre", "Goiânia", "Belém", "Brasília", "Florianópolis", "Vitória", "Natal", "João Pessoa", "Maceió", "Teresina", "Campo Grande", "Cuiabá"];


const analysisCardsData = (analysisResult?: BehavioralAnalysisData) => {
    if (!analysisResult) return [];
    const summarySentences = analysisResult.summary.split('. ').filter(s => s.length > 10);
    return [
        { id: 'insight1', icon: Lightbulb, title: "Principal Descoberta", text: summarySentences[0] || "Você possui um padrão comportamental que precisa de atenção." },
        { id: 'insight2', icon: BookOpen, title: "Entendendo a Raiz", text: summarySentences[1] || analysisResult.missingForIdeal.substring(0, 100) + "..." },
        { id: 'insight3', icon: TrendingUp, title: "Caminho para Mudança", text: analysisResult.missingForIdeal.substring(100) || "A transformação requer foco e as ferramentas certas." },
    ];
};

const archetypeProfileMap: Record<string, {
    image: string;
    archetypeSymbol: string; // animal, mito ou deus — o que a foto representa
    falhasAutoImagem: string;
    alinhado: string[];
    desalinhado: string[];
}> = {
    "Deusa em Alinhamento Crescente": {
        image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&q=80",
        archetypeSymbol: "Deusa Afrodite",
        falhasAutoImagem: "Você consome conteúdo, assiste, tenta… e nada muda. Pequenos ajustes na confiança que impedem a manifestação.",
        alinhado: ["Autoconsciência", "Potencial elevado", "Base sólida"],
        desalinhado: ["Confiança a consolidar", "Clareza dos desejos"],
    },
    "Buscadora Consciente com Desafios": {
        image: "https://images.unsplash.com/photo-1543549790-8b5f4a027156?w=400&q=80",
        archetypeSymbol: "Coruja de Atena",
        falhasAutoImagem: "Você assiste, aplica o que vê, mas o resultado não vem. Dúvidas e frustrações travam sua ação consistente.",
        alinhado: ["Consciência dos bloqueios", "Vontade de mudar", "Busca por crescimento"],
        desalinhado: ["Dúvidas ocasionais", "Consumir sem transformar", "Ferramentas que não funcionam"],
    },
    "Realista Sob Pressão": {
        image: "https://images.unsplash.com/photo-1474511320723-9a568d726b45?w=400&q=80",
        archetypeSymbol: "Lobo Alfa",
        falhasAutoImagem: "Você já consumiu de tudo. Nada funcionou. Crenças limitantes sobre merecimento e capacidade te travam.",
        alinhado: ["Reconhecimento da situação", "Disposição para mudar"],
        desalinhado: ["Frustração recorrente", "Conteúdo que não entrega", "Crenças limitantes", "Padrões arraigados"],
    },
    "Guerreira Ferida em Recuperação": {
        image: "https://images.unsplash.com/photo-1534188753412-3e9336736d46?w=400&q=80",
        archetypeSymbol: "Leoa Renascida",
        falhasAutoImagem: "Você assistiu, tentou, investiu. Zero resultado. Falta de merecimento, medo e descrença tomaram conta.",
        alinhado: ["Força interior latente", "Coragem de buscar ajuda"],
        desalinhado: ["Exaustão de tentar", "Descrença", "Medo paralisante", "Não merecimento"],
    },
    "Deusa em Descoberta": {
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
        archetypeSymbol: "Deusa em Emergência",
        falhasAutoImagem: "Você consome, mas ainda não encontrou o que realmente funciona. Padrões a serem revelados.",
        alinhado: ["Abertura para descobrir", "Potencial oculto"],
        desalinhado: ["Falta de clareza", "Bloqueios a identificar"],
    },
};

const getArchetypeProfile = (archetype: string) =>
    archetypeProfileMap[archetype] ?? archetypeProfileMap["Deusa em Descoberta"];

const faqItems = [
    {
        id: "faq-guarantee",
        question: "É seguro? Tem garantia?",
        answer: "Garantia incondicional de 7 dias. Risco zero. O arrependimento de não tentar é eterno."
    },
    {
        id: "faq1",
        question: "O Código da Deusa™ é mais um curso online?",
        answer: "Não. É um RITUAL de 21 dias que IMPLANTA um novo eu. Não informa — transforma na raiz."
    },
    {
        id: "faq2",
        question: "Preciso de muito tempo por dia?",
        answer: "Menos de 5 minutos. O poder está na frequência, não no tempo. Micro-ajustes. Impacto massivo."
    },
    {
        id: "faq3",
        question: "E se eu já tentei de tudo e nada funcionou?",
        answer: "Então você está pronta. O Código vai onde os outros não ousam: na sua IDENTIDADE."
    },
    {
        id: "faq5",
        question: "Como recebo o acesso?",
        answer: "Imediatamente após a confirmação. Email com instruções. O universo não espera."
    }
];

const majorSectionIds = [
  'diagnostics-section',
  'offer-start-section',
  'testimonials-section',
  'price-anchor-section',
  'map-section',
  'before-after-section',
  'modules-section',
  'who-its-for-section',
  'vision-section',
  'shield-section',
  'moving-testimonials-section',
  'final-touch-section',
  'faq-section',
  'decision-section',
  'final-purchase-cta-section',
];


const AnalysisInsightCard: React.FC<{ icon: React.ElementType, title: string, text: string, className?: string }> = ({ icon: Icon, title, text, className }) => (
    <Card className={cn("bg-white/5 border-white/10 p-4 w-full min-w-[260px] sm:min-w-[280px] md:min-w-0 md:w-auto md:max-w-xs shrink-0 scroll-snap-align-center rounded-2xl", className)}>
        <CardHeader className="p-0 pb-2 flex flex-row items-center gap-2">
            <Icon className="h-6 w-6 text-green-400 shrink-0" />
            <CardTitle className="text-md text-white/90">{title}</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
            <p className="text-xs text-white/70 leading-relaxed">{text}</p>
        </CardContent>
    </Card>
);

const ModuleCard: React.FC<{ icon: React.ElementType, name: string, promise: string, value: number, dataAiHint: string, className?: string }> = ({ icon: Icon, name, promise, value, dataAiHint, className }) => (
    <Card className={cn("bg-white/5 border-white/10 hover:border-white/30 transition-all duration-300 rounded-2xl", className)}>
        <CardHeader className="flex flex-row items-center gap-3 p-4">
            <Icon data-ai-hint={dataAiHint} className="h-10 w-10 text-green-400 shrink-0" />
            <div>
                <CardTitle className="text-base text-white font-medium mb-0.5">{name}</CardTitle>
                <p className="text-xs text-white/50">Valor real: <span className="line-through">R${value.toFixed(2).replace('.', ',')}</span></p>
            </div>
        </CardHeader>
        <CardContent className="p-4 pt-0">
            <p className="text-sm text-white/70 leading-relaxed">{promise}</p>
        </CardContent>
    </Card>
);

const TestimonialCard: React.FC<{ name: string, age: number, quote: string, stars: number, image: string, dataAiHint: string, className?: string }> = ({ name, age, quote, stars, image, dataAiHint, className }) => (
    <Card className={cn("bg-white/5 border-white/10 w-[260px] sm:w-[300px] shrink-0 scroll-snap-align-center p-5 flex flex-col items-center text-center rounded-2xl", className)}>
        <Image data-ai-hint={dataAiHint} src={image} alt={name} width={64} height={64} className="rounded-full border-2 border-white/20 mb-3 object-cover" />
        <CardTitle className="text-base text-white font-medium">{name}, {age} anos</CardTitle>
        <div className="flex my-2 gap-0.5">
            {Array(stars).fill(0).map((_, i) => <Star key={i} className="h-4 w-4 text-green-400 fill-green-400" />)}
        </div>
        <CardContent className="p-0 mt-1">
            <p className="text-sm text-white/80 leading-relaxed">"{quote}"</p>
        </CardContent>
    </Card>
);

const TestimonialStoryCard: React.FC<{ name: string, avatar: string, dataAiHint: string, message: string, className?: string, style?: React.CSSProperties }> = ({ name, avatar, dataAiHint, message, className, style }) => (
  <Card className={cn("bg-white/5 border-white/10 w-[260px] sm:w-[300px] shrink-0 scroll-snap-align-center p-5 flex flex-col items-start text-left rounded-2xl", className)} style={style}>
    <div className="flex items-center mb-3">
      <Image data-ai-hint={dataAiHint} src={avatar} alt={name} width={40} height={40} className="rounded-full border-2 border-green-400/50 mr-3 object-cover" />
      <CardTitle className="text-sm text-white font-medium">{name}</CardTitle>
    </div>
    <CardContent className="p-0">
      <p className="text-sm text-white/80 leading-relaxed whitespace-pre-line">{message}</p>
    </CardContent>
     <div className="mt-2 flex items-center">
          <div className="h-2 w-2 bg-green-400 rounded-full mr-1 animate-pulse"></div>
          <span className="text-xs text-white/50">online</span>
      </div>
  </Card>
);

const PhaseCard: React.FC<{ phase: string, title: string, description: string | React.ReactNode, icon: React.ElementType, delay: string, lockedIcon?: React.ElementType }> = ({ phase, title, description, icon: Icon, delay, lockedIcon: LockedIcon = Lock }) => (
    <Card className="bg-white/5 border-white/10 p-5 text-center animate-fade-in h-full flex flex-col rounded-2xl" style={{ animationDelay: delay }}>
        <div className="flex flex-col items-center flex-grow">
            <div className="relative mb-3">
                <Icon className="h-10 w-10 text-green-400" />
                <LockedIcon className="absolute -top-1 -right-1 h-4 w-4 text-green-400/80 bg-[#0a0a0a] p-0.5 rounded-full" />
            </div>
            <p className="text-sm text-white/50 font-medium mb-1">{phase}</p>
            <h4 className="text-base font-semibold text-white mb-2">{title}</h4>
            {typeof description === 'string' ? <p className="text-sm text-white/70 leading-relaxed whitespace-pre-line flex-grow">{description}</p> : <div className="flex-grow">{description}</div>}
        </div>
    </Card>
);

const BeforeAfterCard: React.FC<{ title: string, items: string[], bgColor: string, borderColor: string, textColor: string, icon: React.ElementType, className?: string, style?: React.CSSProperties }> = ({ title, items, bgColor, borderColor, textColor, icon: Icon, className, style }) => (
    <Card className={cn("p-6 rounded-xl shadow-xl w-full h-full flex flex-col", bgColor, borderColor, className)} style={style}>
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

const VisionCard: React.FC<{ title: string, icon: React.ElementType, dataAiHint: string, onClick: () => void, isSelected: boolean, className?: string, style?: React.CSSProperties }> = ({ title, icon: Icon, dataAiHint, onClick, isSelected, className, style }) => (
    <button
        onClick={onClick}
        className={cn(
            "bg-white/5 border-2 p-4 rounded-2xl text-center w-full aspect-[3/2] sm:aspect-auto flex flex-col items-center justify-center transition-all duration-300 h-auto",
            isSelected ? "border-green-400 bg-white/10" : "border-white/10 hover:border-white/30",
            className
        )}
        style={style}
        aria-pressed={isSelected}
    >
        <Icon data-ai-hint={dataAiHint} className={cn("h-9 w-9 sm:h-10 sm:w-10 mb-2", isSelected ? "text-green-400" : "text-white/60")} />
        <p className={cn("text-sm font-medium leading-tight", isSelected ? "text-white" : "text-white/80")}>{title}</p>
        {isSelected && <p className="text-xs text-green-400 mt-1 animate-pop-in">🔓 Pronto para desbloquear?</p>}
    </button>
);

const GuaranteePillarCard: React.FC<{ icon: React.ElementType; title: string; description: string; delay: string; }> = ({ icon: Icon, title, description, delay }) => (
    <Card className="bg-white/5 border-white/10 p-5 text-center animate-fade-in h-full flex flex-col rounded-2xl" style={{ animationDelay: delay }}>
        <div className="flex flex-col items-center flex-grow">
            <Icon className="h-9 w-9 text-green-400 mb-3" />
            <h4 className="text-base font-semibold text-white mb-2">{title}</h4>
            <p className="text-sm text-white/70 leading-relaxed flex-grow">{description}</p>
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
  const g = useGamification();
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [pageScrollProgress, setPageScrollProgress] = useState(0);

  const [priceCardTimeLeft, setPriceCardTimeLeft] = useState(7 * 60); 
  const [priceCardVacancies, setPriceCardVacancies] = useState(3);
  
  const [showRecusePopup, setShowRecusePopup] = useState(false);
  
  const finalOfferTimerInitial = 2 * 60; 
  const [finalOfferTimeLeft, setFinalOfferTimeLeft] = useState(finalOfferTimerInitial);
  const [isPriceRevealed, setIsPriceRevealed] = useState(false);
  const [isFinalOfferTimerBlinking, setIsFinalOfferTimerBlinking] = useState(false);

  const [isCodeUnlocked, setIsCodeUnlocked] = useState(false);
  const isCodeUnlockedRef = useRef(isCodeUnlocked);
  isCodeUnlockedRef.current = isCodeUnlocked;
  const [isFinalPurchaseInView, setIsFinalPurchaseInView] = useState(false);
  const [exitIntentOpen, setExitIntentOpen] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  
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
  const { toast } = useToast();
  const [gamifiedPercentage, setGamifiedPercentage] = useState(currentAnalysisResult.idealPercentage);
  const [currentDreamNotificationIndex, setCurrentDreamNotificationIndex] = useState(0);
  
  useEffect(() => {
    setGamifiedPercentage(currentAnalysisResult.idealPercentage);
  }, [currentAnalysisResult.idealPercentage]);

  useEffect(() => {
    if (gamifiedPercentage >= 100) g?.unlockAchievement('100_alinhada');
  }, [gamifiedPercentage, g]);

  const showProgressNotification = useCallback((newPercentage: number) => {
    toast({
      title: "Seu nível subiu!",
      description: `Alinhamento em ${newPercentage}%. Cada passo te aproxima dos seus sonhos.`,
      duration: 3500,
    });
    // playSound('progress_increase.mp3');
  }, [toast]);

  const showDreamNotification = useCallback(() => {
    if (userDreams && userDreams.length > 0) {
      const currentDream = userDreams[currentDreamNotificationIndex];
      const message = dreamNotificationMap[currentDream.id] || `Seu sonho de ${currentDream.label} está mais perto. Mas só se você agir agora.`;
      
      toast({
        title: "Seu sonho te espera",
        description: message,
        duration: 4500, 
      });
      // playSound('notification_light.mp3'); 

      setCurrentDreamNotificationIndex((prevIndex) => (prevIndex + 1) % userDreams.length);
    }
  }, [userDreams, currentDreamNotificationIndex, toast]);

  const showSocialProofNotification = useCallback(() => {
    const randomName = fakeUserNames[Math.floor(Math.random() * fakeUserNames.length)];
    const randomCity = fakeUserCities[Math.floor(Math.random() * fakeUserCities.length)];

    toast({
      title: `${randomName} de ${randomCity} acabou de entrar.`,
      description: "E você?",
      duration: 5000,
    });
    // playSound('new_purchase_subtle.mp3');
  }, [toast]);

  const socialProofIntervalRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    const randomDelay = Math.random() * (45000 - 15000) + 15000; 
    socialProofIntervalRef.current = setInterval(() => {
      showSocialProofNotification();
    }, randomDelay);
  
    return () => {
      if (socialProofIntervalRef.current) {
        clearInterval(socialProofIntervalRef.current);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const conditionallyIncrementPercentage = useCallback((increment: number, capBeforeIncrement?: number) => {
    setGamifiedPercentage(prev => {
      if (capBeforeIncrement !== undefined && prev >= capBeforeIncrement) {
        return Math.min(100, prev); 
      }
      const newValue = Math.min(100, prev + increment);
      if (newValue > prev) {
        setTimeout(() => showProgressNotification(newValue), 0);
      }
      return newValue;
    });
  }, [showProgressNotification]);

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
            setActiveSectionId(determinedSectionId);
            
            const finalPurchaseEl = document.getElementById('final-purchase-cta-section');
            if (finalPurchaseEl && isCodeUnlockedRef.current) {
                const fr = finalPurchaseEl.getBoundingClientRect();
                setIsFinalPurchaseInView(fr.top < window.innerHeight * 0.7 && fr.bottom > 0);
            } else {
                setIsFinalPurchaseInView(false);
            }

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
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 
  
  useEffect(() => {
    const timerId = setInterval(() => {
      setPriceCardTimeLeft(prevTime => {
        if (prevTime <= 0) return 0;
        const newTime = prevTime - 1;
        // Reduzir vagas quando chega em 5 minutos
        if (newTime <= (5 * 60) && newTime > 0) {
          setPriceCardVacancies(1);
        }
        return newTime;
      });
    }, 1000);
    return () => clearInterval(timerId);
  }, []);

  useEffect(() => {
    if (!isPriceRevealed) return;
    
    const timerId = setInterval(() => {
      setFinalOfferTimeLeft(prevTime => {
        if (prevTime <= 0) return 0;
        const newTime = prevTime - 1;
        // Ativar blinking quando falta 1 minuto
        if (newTime > 0 && newTime <= 60) {
          setIsFinalOfferTimerBlinking(true);
        }
        if (newTime <= 0) {
          setIsFinalOfferTimerBlinking(false);
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [isPriceRevealed]);


  const handleRevealPrice = useCallback(() => {
    setIsPriceRevealed(true);
    // playSound('dream_select.mp3');
    setFinalOfferTimeLeft(finalOfferTimerInitial);
    conditionallyIncrementPercentage(10, 75); 
    showDreamNotification();
    requestAnimationFrame(() => {
        setTimeout(() => { 
            document.getElementById('map-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 50);
    });
  }, [conditionallyIncrementPercentage, showDreamNotification]);
  
  const handleUnlockCode = useCallback(() => {
    g?.unlockAchievement('codigo_desbloqueado');
    setIsCodeUnlocked(true);
    // playSound('form_complete.mp3');
    showProgressNotification(95);
    setGamifiedPercentage(95);
    showDreamNotification();
    
    requestAnimationFrame(() => {
      const ctaSection = document.getElementById('final-purchase-cta-section');
      if (ctaSection) {
           ctaSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }, [g, showDreamNotification, showProgressNotification]);
  
  const handleStickyCtaClick = useCallback(() => {
    if (!isPriceRevealed) {
      const el = document.getElementById('price-anchor-section');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      conditionallyIncrementPercentage(10, 65);
      showDreamNotification();
      return;
    }
    if (!isCodeUnlocked) {
      handleUnlockCode();
      return;
    }
    const el = document.getElementById('final-purchase-cta-section');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [isPriceRevealed, isCodeUnlocked, handleUnlockCode, conditionallyIncrementPercentage, showDreamNotification]);
  
  const stickyVisible = (pageScrollProgress ?? 0) >= 30 && !isFinalPurchaseInView;

  useExitIntent(() => setExitIntentOpen(true), { enabled: !isCodeUnlocked });
  
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

  const handlePrimaryCTAClick = useCallback((targetSectionId: string, percentageIncrement: number, cap?: number) => {
    requestAnimationFrame(() => {
      const element = document.getElementById(targetSectionId);
      if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
    conditionallyIncrementPercentage(percentageIncrement, cap);
    showDreamNotification();
  }, [conditionallyIncrementPercentage, showDreamNotification]);


  if (analysisError && !analysisResult) { 
      return (
          <div className="min-h-screen w-full flex flex-col items-center justify-center px-4 py-12 bg-[#0a0a0a] text-white">
              <AlertTriangle className="h-16 w-16 text-red-400 mb-6" />
              <h1 className="font-headline text-xl text-white mb-4">Erro na Análise</h1>
              <p className="text-base text-white/70 mb-8 text-center max-w-md">{analysisError}</p>
              <Button onClick={onRestart} className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-2xl">
                  Tentar novamente
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
    <div className={cn("min-h-screen w-full flex flex-col bg-[#0a0a0a] text-white overflow-x-hidden", stickyVisible ? "pb-28" : "pb-16")}>
        <header className="sticky top-0 z-50 flex flex-col bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/10" role="banner">
            <div className="flex items-center justify-center h-14 px-4">
              <h1 className="font-headline font-semibold text-base text-white tracking-tight">
                diagnóstico.da.deusa
              </h1>
            </div>
            <div className="h-0.5 flex gap-0.5 px-2 pb-2">
              {[0,1,2,3,4].map((i) => (
                <div
                  key={i}
                  className={cn("flex-1 h-full rounded-full transition-all duration-300", (pageScrollProgress / 100) >= (i + 1) / 5 ? "bg-white" : "bg-white/20")}
                />
              ))}
            </div>
        </header>

        <main className="w-full max-w-[470px] mx-auto space-y-8 px-4 pt-6 pb-8">
            <section id="diagnostics-section" ref={registerSectionRef('diagnostics-section')} className="animate-fade-in pt-2" style={{animationDuration: '0.7s'}}>
                {/* Perfil estilo rede social — arquétipo = foto (animal, mito, deus) */}
                <div className="flex flex-col items-center px-2 mb-6">
                    <div className="relative mb-2">
                        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-amber-500/40 ring-2 ring-amber-500/20">
                            <Image
                                src={getArchetypeProfile(currentAnalysisResult.archetype).image}
                                alt={getArchetypeProfile(currentAnalysisResult.archetype).archetypeSymbol}
                                width={112}
                                height={112}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="absolute -bottom-1 -right-1 bg-[#0a0a0a] rounded-full px-1.5 py-0.5 border border-white/20">
                            <span className={cn("text-xs font-bold", getPercentageColor(gamifiedPercentage).replace('bg-','text-'))}>{gamifiedPercentage}%</span>
                        </div>
                    </div>
                    <p className="text-amber-400/90 text-xs uppercase tracking-wider mb-1">Seu arquétipo</p>
                    <p className="text-white font-semibold text-sm mb-0.5">{getArchetypeProfile(currentAnalysisResult.archetype).archetypeSymbol}</p>
                    <h2 className="font-headline text-lg font-bold text-white mt-2">{displayName}</h2>
                    <p className="text-white/60 text-sm mb-1">@{displayName.toLowerCase().replace(/\s/g, '')}.deusa</p>
                    <p className="text-white/70 text-xs text-center max-w-[260px] mb-3">{currentAnalysisResult.archetype}</p>
                    <div className="flex items-center gap-4 text-sm">
                        <span className="text-white/50"><span className="font-semibold text-white">{gamifiedPercentage}%</span> poder ativo</span>
                        {g && g.achievements.length > 0 && (
                            <span className="text-white/50"><span className="font-semibold text-white">{g.achievements.length}</span> conquistas</span>
                        )}
                    </div>
                    {g && g.achievements.length > 0 && (
                        <div className="flex flex-wrap justify-center gap-1.5 mt-3 max-w-[320px]">
                            {g.achievements.map((id) => (
                                <AchievementBadge key={id} id={id} size="sm" />
                            ))}
                        </div>
                    )}
                </div>

                {/* Falhas na auto-imagem */}
                <div className="mb-4">
                    <h3 className="text-xs text-white/50 uppercase tracking-wider mb-2 px-1">falhas na auto-imagem</h3>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                        <p className="text-sm text-white/90 leading-relaxed">{getArchetypeProfile(currentAnalysisResult.archetype).falhasAutoImagem}</p>
                    </div>
                </div>

                {/* Alinhado e Desalinhado - lado a lado */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                    <div>
                        <h3 className="text-xs text-green-400/90 uppercase tracking-wider mb-2 px-1 flex items-center gap-1">
                            <CheckCircle2 className="h-3.5 w-3.5" /> alinhado
                        </h3>
                        <div className="bg-white/5 border border-green-500/20 rounded-2xl p-3 space-y-1.5">
                            {getArchetypeProfile(currentAnalysisResult.archetype).alinhado.map((item, i) => (
                                <p key={i} className="text-xs text-white/80 flex items-center gap-1.5">
                                    <span className="h-1.5 w-1.5 rounded-full bg-green-400 shrink-0" />
                                    {item}
                                </p>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h3 className="text-xs text-red-400/90 uppercase tracking-wider mb-2 px-1 flex items-center gap-1">
                            <XCircle className="h-3.5 w-3.5" /> desalinhado
                        </h3>
                        <div className="bg-white/5 border border-red-500/20 rounded-2xl p-3 space-y-1.5">
                            {getArchetypeProfile(currentAnalysisResult.archetype).desalinhado.map((item, i) => (
                                <p key={i} className="text-xs text-white/80 flex items-center gap-1.5">
                                    <span className="h-1.5 w-1.5 rounded-full bg-red-400 shrink-0" />
                                    {item}
                                </p>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bloqueios */}
                <div className="mb-6">
                    <h3 className="text-xs text-white/50 uppercase tracking-wider mb-2 px-1 flex items-center gap-1">
                        <Lock className="h-3.5 w-3.5" /> bloqueios
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {currentAnalysisResult.keywords.map((keyword, index) => (
                            <Badge key={index} className="text-xs bg-white/5 text-white/90 border border-white/20 px-2.5 py-1">
                                <Lock className="mr-1 h-3 w-3 shrink-0 opacity-70" /> {keyword}
                            </Badge>
                        ))}
                    </div>
                </div>
                
                <Button 
                    onClick={() => handlePrimaryCTAClick('offer-start-section', 10, 40)}
                    className="bg-green-500 hover:bg-green-600 text-white font-semibold text-base py-3 px-6 rounded-2xl min-h-[48px] w-full"
                >
                    <Unlock className="mr-2 h-5 w-5 shrink-0" /> Chega. Me mostra a solução.
                </Button>
            </section>

            <hr className="border-white/10 my-8" />

            <section id="offer-start-section" ref={registerSectionRef('offer-start-section')} className="space-y-4 text-center">
                <SectionReveal delay={0}>
                 <h2 className="font-headline text-xl sm:text-2xl font-bold text-white leading-tight">
                    {displayName}, para de fingir que está tudo bem.
                </h2>
                </SectionReveal>
                <SectionReveal delay={100}>
                <p className="text-base text-white/90 font-medium leading-relaxed">
                    O que te impede de ter {dreamsText}?
                </p>
                </SectionReveal>
                <SectionReveal delay={200}>
                <p className="text-sm text-white/70 leading-relaxed">
                    Existe um <span className="text-red-400 font-semibold">vírus</span> na sua identidade que <span className="text-red-400 font-semibold">devora</span> cada tentativa sua.
                </p>
                </SectionReveal>
                <SectionReveal delay={300}>
                 <p className="text-sm text-white/70 leading-relaxed">
                    Eu não vou te prometer milagre. Vou te dar a <span className="font-bold text-green-400">ferramenta</span> que 7.400 mulheres já usaram pra <span className="font-bold text-green-400">destruir</span> esse padrão.
                 </p>
                </SectionReveal>
                <SectionReveal delay={400}>
                <Button 
                    onClick={() => handlePrimaryCTAClick('testimonials-section', 10, 45)}
                    variant="outline" 
                    className="border-white/30 text-white hover:bg-white/10 font-medium text-sm py-2.5 px-5 rounded-2xl h-auto"
                >
                    <Eye className="mr-2 h-4 w-4 shrink-0" /> Ver provas reais
                </Button>
                </SectionReveal>
            </section>

            <hr className="border-white/10 my-8" />

            <section id="testimonials-section" ref={registerSectionRef('testimonials-section')} className="animate-fade-in" style={{animationDelay: '0.8s'}}>
                <h2 className="font-headline text-xl sm:text-2xl text-center mb-3 text-white font-bold">
                    +7.400 mulheres destruíram seus bloqueios. Você vai ser a próxima?
                </h2>
                <p className="text-center text-white/50 mb-5 text-sm">O que elas dizem depois de destravar:</p>
                <TestimonialVSLSlider testimonials={testimonialsData} />
                 <div className="text-center mt-6">
                     <Image data-ai-hint="women success celebration" src="https://placehold.co/700x200.png" alt="Mulheres Felizes e Realizadas" width={600} height={171} className="rounded-2xl border border-white/10 w-full mx-auto"/>
                </div>
                 <div className="text-center mt-6">
                    <Button 
                        onClick={() => handlePrimaryCTAClick('price-anchor-section', 10, 65)}
                        className="bg-green-500 hover:bg-green-600 text-white font-semibold text-base py-3 px-6 rounded-2xl w-full max-w-sm mx-auto"
                    >
                        <Gift className="mr-2 h-5 w-5 shrink-0" /> Quero ver o investimento
                    </Button>
                </div>
            </section>
            
            <hr className="border-white/10 my-8" />

            <section id="price-anchor-section" ref={registerSectionRef('price-anchor-section')} className="animate-fade-in text-center" style={{animationDelay: '1.2s'}}>
                 <h2 className="font-headline text-xl sm:text-2xl text-center mb-5 text-white font-bold">
                    {displayName}, esse é o menor investimento que você vai fazer na sua vida.
                </h2>
                <Card className="max-w-sm mx-auto bg-white/5 border border-white/10 p-6 rounded-2xl">
                    <CardHeader className="p-0 mb-4">
                        <CardTitle className="text-xl font-bold text-white">Oferta Exclusiva Código da Deusa™</CardTitle>
                        <CardDescription className="text-white/60 text-sm">Por ter chegado até aqui. Seus sonhos{dreamsAchievementDateLabel ? ` em ${dreamsAchievementDateLabel}` : ''} dependem disso.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0 space-y-4">
                        <p className="text-base text-white/70">
                            Valor total: <span className="line-through text-red-400/80 font-medium">R$ {totalRealValue.toFixed(2).replace('.',',')}</span>
                        </p>
                        <p className="text-2xl sm:text-3xl font-extrabold text-green-400">
                            Hoje por apenas: R$ {offerPriceAnchor.toFixed(2).replace('.',',')}
                        </p>
                        <div className="text-sm text-white/60 space-y-1">
                            <p><Clock className="inline h-4 w-4 mr-1 shrink-0" /> Promoção válida por: <span className="font-semibold text-white/80">{formatTime(priceCardTimeLeft)}</span></p>
                            <p className="text-xs">Restam <span className="font-semibold">{priceCardVacancies}</span> {priceCardVacancies === 1 ? 'acesso' : 'acessos'} com este valor.</p>
                        </div>
                        
                        <Button onClick={handleRevealPrice} className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold text-base py-3 rounded-2xl mt-4">
                            <Wand2 className="mr-2 h-5 w-5 shrink-0" /> Quero garantir por R${offerPriceAnchor} e revelar a oferta!
                        </Button>
                        
                    </CardContent>
                </Card>
            </section>

            {isPriceRevealed && (
                <>
                    <hr className="border-white/10 my-10 md:my-14" />
                    <section id="map-section" ref={registerSectionRef('map-section')} className="animate-fade-in py-10 md:py-12 text-center" style={{animationDelay: '0.2s'}}>
                        <h2 className="font-headline text-3xl sm:text-4xl text-yellow-300 mb-3 whitespace-pre-line">⚡ Sua Jornada de 21 Dias</h2>
                        <p className="text-white/80 text-lg sm:text-xl mb-2 max-w-2xl mx-auto whitespace-pre-line">
                            Você está prestes a atravessar o portal mais importante da sua vida.
                        </p>
                        <p className="text-white/60 text-md sm:text-lg mb-8 max-w-xl mx-auto whitespace-pre-line">
                            21 dias.{"\n"}
                            Cada dia é uma facada cirúrgica no padrão que te aprisiona.
                        </p>
                        <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
                            <PhaseCard phase="DIAS 1-7" title="QUEBRAR o ciclo da dor." description="🔓 Destrua padrões sabotadores." icon={Zap} delay="0.3s" />
                            <PhaseCard phase="DIAS 8-14" title="RECONSTRUIR a sua identidade." description="🧠 Reprograme sua autoimagem." icon={Brain} delay="0.5s" />
                            <PhaseCard phase="DIAS 15-21" title="DOMINAR a sua nova realidade." description="🔥 Manifeste a vida que merece." icon={LucideSparkles} delay="0.7s" />
                        </div>
                        <p className="text-white/80 text-lg sm:text-xl mt-8 max-w-2xl mx-auto whitespace-pre-line">
                            Isso não é só um plano.{"\n"}
                            É um processo irreversível de reconstrução interna.
                        </p>
                        <p className="text-yellow-300 text-lg sm:text-xl mt-4 max-w-xl mx-auto whitespace-pre-line">
                            Você pode continuar adiando…{"\n"}
                            Ou se dar a chance de descobrir quem você teria sido se ninguém tivesse te quebrado.
                        </p>
                        <div className="text-center mt-10">
                            <Button onClick={() => {
                                requestAnimationFrame(() => {
                                   const element = document.getElementById('before-after-section');
                                   if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                });
                                }} className="bg-green-500 hover:bg-green-600 text-white font-bold text-md sm:text-lg py-3 px-6 rounded-lg shadow-xl hover:scale-105 transition-transform duration-300 animate-icon-subtle-float h-auto whitespace-normal text-center leading-normal">
                                <Eye className="mr-2 h-5 w-5" /> VER O ANTES E DEPOIS
                            </Button>
                        </div>
                    </section>

                    <hr className="border-white/10 my-10 md:my-14" />

                    <section id="before-after-section" ref={registerSectionRef('before-after-section')} className="animate-fade-in py-10 md:py-12 text-center" style={{animationDelay: '0.4s'}}>
                        <h2 className="font-headline text-3xl sm:text-4xl text-white font-bold mb-4">Sua Vida: Antes e Depois do Código</h2>
                         <p className="text-white/60 text-md sm:text-lg mb-8 max-w-xl mx-auto whitespace-pre-line">
                            Essa escolha tá na sua mão agora. E o tempo tá olhando.
                        </p>
                        <BeforeAfterToggle />
                       
                        <div className="text-center mt-10">
                            <Button onClick={() => {
                                requestAnimationFrame(() => {
                                   const element = document.getElementById('modules-section');
                                   if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                });
                                }} className="bg-green-500 hover:bg-green-600 text-white font-bold text-md sm:text-lg py-3 px-6 rounded-lg shadow-xl hover:scale-105 transition-transform duration-300 animate-icon-subtle-float h-auto whitespace-normal text-center leading-normal">
                            VER O ARSENAL COMPLETO
                            </Button>
                        </div>
                    </section>

                    <hr className="border-white/10 my-10 md:my-14" />

                    <section id="modules-section" ref={registerSectionRef('modules-section')} className="animate-fade-in" style={{animationDelay: '0.5s'}}>
                        <h2 className="font-headline text-2xl sm:text-3xl md:text-4xl text-center mb-8 sm:mb-12 text-white font-bold">
                            AQUI ESTÁ O <span className="text-yellow-300">ARSENAL COMPLETO</span> QUE VAI <span className="text-pink-400">DESTRUIR</span> SEUS BLOQUEIOS:
                        </h2>
                        <p className="text-center text-lg sm:text-xl text-purple-100/90 -mt-6 mb-8 max-w-2xl mx-auto">
                            O Código da Deusa é um sistema COMPLETO com <span className="font-bold text-pink-300">7 módulos + bônus</span> que valem <span className="line-through text-xl sm:text-2xl font-bold text-red-400/90">R$ {totalRealValue.toFixed(2).replace('.',',')}</span>.
                        </p>
                        <ModuleCarousel
                            modules={goddessCodeModules.map((item) => ({
                                id: item.id,
                                name: item.name,
                                promise: item.promise,
                                value: item.value,
                                icon: item.icon,
                                dataAiHint: item.dataAiHint,
                            }))}
                        />
                        <div className="text-center mt-10">
                            <Button 
                                onClick={() => {
                                    requestAnimationFrame(() => {
                                        const element = document.getElementById('who-its-for-section');
                                        if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                    });
                                }} 
                                className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg sm:text-xl py-3 sm:py-4 px-8 sm:px-10 rounded-xl shadow-xl hover:scale-105 transition-transform duration-300 animate-icon-subtle-float h-auto whitespace-normal text-center leading-normal"
                            >
                                <Group className="mr-2 h-5 w-5 shrink-0" /> ISSO É PARA MIM?
                            </Button>
                        </div>
                    </section>

                    <hr className="border-white/10 my-10 md:my-14" />

                    <section id="who-its-for-section" ref={registerSectionRef('who-its-for-section')} className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                        <h2 className="font-headline text-2xl sm:text-3xl md:text-4xl text-center mb-10 text-white font-bold">Este Código É Para Você?</h2>
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
                                    requestAnimationFrame(() => {
                                        const element = document.getElementById('vision-section');
                                        if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                    });
                                }} 
                                className="bg-green-500 hover:bg-green-600 text-white font-bold text-lg sm:text-xl py-3 sm:py-4 px-8 sm:px-10 rounded-xl shadow-xl hover:scale-105 transition-transform duration-300 animate-icon-subtle-float h-auto whitespace-normal text-center leading-normal"
                            >
                                <Heart className="mr-2 h-5 w-5 shrink-0" /> ATIVAR MINHA VISÃO DE VIDA
                            </Button>
                        </div>
                    </section>

                    <hr className="border-white/10 my-10 md:my-14" />

                    <section id="vision-section" ref={registerSectionRef('vision-section')} className="animate-fade-in py-10 md:py-12 text-center" style={{animationDelay: '0.6s'}}>
                        <h2 className="font-headline text-3xl sm:text-4xl text-pink-400 mb-3 whitespace-pre-line">Essa é a vida que JÁ É SUA.</h2>
                        <p className="text-white/80 text-lg sm:text-xl mb-2 max-w-2xl mx-auto whitespace-pre-line">
                            Você está a um <span className="font-bold text-yellow-300">sim</span> da realidade que já é sua.
                        </p>
                         <p className="text-white/60 text-md sm:text-lg mb-10 max-w-2xl mx-auto whitespace-pre-line">
                            Imagina abrir os olhos e saber que está exatamente onde deveria estar.{"\n"}
                            Não por sorte. Não por acaso.{"\n"}
                            Mas porque você <span className="font-bold text-accent">decidiu</span>.
                        </p>
                        <p className="text-white/80 text-lg sm:text-xl mb-10 max-w-2xl mx-auto whitespace-pre-line">
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
                            <Button onClick={() => {
                                requestAnimationFrame(() => {
                                   const element = document.getElementById('shield-section');
                                   if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                });
                                }} className="bg-green-500 hover:bg-green-600 text-white font-bold text-md sm:text-lg py-3 px-6 rounded-lg shadow-xl hover:scale-105 transition-transform duration-300 animate-icon-subtle-float h-auto whitespace-normal text-center leading-normal">
                            <ShieldCheck className="mr-2 h-5 w-5" /> VER MINHA GARANTIA TOTAL
                            </Button>
                        </div>
                    </section>

                    <hr className="border-white/10 my-10 md:my-14" />
                    
                     <section id="shield-section" ref={registerSectionRef('shield-section')} className="animate-fade-in py-10 md:py-12 text-center" style={{ animationDelay: '0.8s' }}>
                        <h2 className="font-headline text-3xl sm:text-4xl text-white font-bold mb-3 whitespace-pre-line">Sem Risco. Sem Volta.</h2>
                        <p className="text-white/80 text-lg sm:text-xl mb-6 max-w-2xl mx-auto whitespace-pre-line">
                            Você já duvidou de tudo.{"\n"}
                            Do mundo. Das pessoas. De si mesma.
                        </p>
                        <p className="text-white/60 text-md sm:text-lg mb-10 max-w-xl mx-auto whitespace-pre-line">
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
                                <Card className="bg-white/5 border-purple-700/70 p-4 animate-fade-in transform hover:scale-105 transition-transform duration-300" style={{ animationDelay: "0.2s" }}>
                                    <CardContent className="flex items-center gap-3 p-0">
                                        <CheckCircle2 className="h-7 w-7 text-green-400 shrink-0" />
                                        <p className="text-md text-white/80 text-left">Sem chance de dar errado.</p>
                                    </CardContent>
                                </Card>
                                <Card className="bg-white/5 border-purple-700/70 p-4 animate-fade-in transform hover:scale-105 transition-transform duration-300" style={{ animationDelay: "0.35s" }}>
                                    <CardContent className="flex items-center gap-3 p-0">
                                        <CheckCircle2 className="h-7 w-7 text-green-400 shrink-0" />
                                        <p className="text-md text-white/80 text-left">Sem volta pra dor.</p>
                                    </CardContent>
                                </Card>
                                <Card className="bg-white/5 border-purple-700/70 p-4 animate-fade-in transform hover:scale-105 transition-transform duration-300" style={{ animationDelay: "0.5s" }}>
                                    <CardContent className="flex items-center gap-3 p-0">
                                        <CheckCircle2 className="h-7 w-7 text-green-400 shrink-0" />
                                        <p className="text-md text-white/80 text-left">Sem mais desculpas.</p>
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
                            <Button onClick={() => {
                                requestAnimationFrame(() => {
                                   const element = document.getElementById('moving-testimonials-section');
                                   if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                });
                                }} className="bg-green-500 hover:bg-green-600 text-white font-bold text-md sm:text-lg py-3 px-6 rounded-lg shadow-xl hover:scale-105 transition-transform duration-300 animate-icon-subtle-float h-auto whitespace-normal text-center leading-normal">
                            <MessageCircle className="mr-2 h-5 w-5" /> OUVIR QUEM JÁ VIVEU ISSO
                            </Button>
                        </div>
                    </section>
                    
                    <hr className="border-white/10 my-10 md:my-14" />

                    <section id="moving-testimonials-section" ref={registerSectionRef('moving-testimonials-section')} className="animate-fade-in py-10 md:py-12" style={{animationDelay: '1.0s'}}>
                    <h2 className="font-headline text-2xl sm:text-3xl md:text-4xl text-center mb-4 text-white font-bold whitespace-pre-line">
                        “Eu nunca pensei que alguém pudesse me destravar assim…”
                    </h2>
                    <p className="text-center text-white/80 mb-8 sm:mb-12 text-md sm:text-lg max-w-xl mx-auto whitespace-pre-line">
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
                        onClick={() => {
                            requestAnimationFrame(() => {
                               const element = document.getElementById('final-touch-section');
                               if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            });
                            }} 
                        className="bg-green-500 hover:bg-green-600 text-white font-bold text-lg sm:text-xl py-3 sm:py-4 px-8 sm:px-10 rounded-xl shadow-xl hover:scale-105 transition-transform duration-300 animate-icon-subtle-float h-auto whitespace-normal text-center leading-normal"
                        >
                        <LucideSparkles className="mr-2 h-5 w-5 shrink-0" /> ESTOU PRONTA PARA O TOQUE FINAL!
                        </Button>
                    </div>
                    </section>

                    <hr className="border-white/10 my-10 md:my-14" />
                   
                    <section id="final-touch-section" ref={registerSectionRef('final-touch-section')} className="animate-fade-in py-10 md:py-16 text-center" style={{animationDelay: '1.2s'}}>
                        {!isCodeUnlocked && (
                            <>
                                <h2 className="font-headline text-2xl sm:text-3xl md:text-4xl text-yellow-300 mb-6 whitespace-pre-line">
                                    Você pode voltar pra sua vida.{"\n"}
                                    Ou tocar nesse botão e começar a viver a sua.
                                </h2>
                                <p className="text-white/80 text-lg sm:text-xl mb-6 max-w-xl mx-auto whitespace-pre-line">
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
                        
                        <div id="final-purchase-cta-section" className={cn(isCodeUnlocked ? "animate-pop-in" : "hidden")}>
                            {isCodeUnlocked && (
                                <div className="space-y-6 mt-8">
                                    <p className="text-white/80 text-lg sm:text-xl whitespace-pre-line">
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
                                        <p className="text-white/80 text-sm sm:text-base md:text-lg mb-3 sm:mb-5 break-words max-w-xl mx-auto">
                                            Mas, {displayName}, por um tempo <span className="text-yellow-300 font-bold">LIMITADÍSSIMO</span>, e como uma oportunidade única por ter chegado até aqui, seu acesso a todo o CÓDIGO DA DEUSA™ não será R$ {totalRealValue.toFixed(2).replace('.',',')}, nem mesmo R$ {offerPriceAnchor.toFixed(2).replace('.',',')}. Será por um valor simbólico de apenas:
                                        </p>
                                        <p className="text-[2.75rem] leading-tight sm:text-6xl md:text-7xl lg:text-8xl font-extrabold text-green-400 my-4 md:my-6 glow">
                                            R$ {offerPriceFinal.toFixed(2).replace('.',',')}
                                        </p>
                                        <p className="text-lg sm:text-xl md:text-2xl font-bold text-yellow-300 mb-4 sm:mb-6 break-words">
                                            SIM, {displayName}! APENAS R$ {offerPriceFinal.toFixed(2).replace('.',',')} HOJE! <br className="sm:hidden"/> Um desconto inacreditável sobre o valor já especial de R$ {offerPriceAnchor.toFixed(2).replace('.',',')}!
                                        </p>

                                        <div className="mb-6 md:mb-8 max-w-sm mx-auto">
                                            <div className={cn("flex flex-col items-center", finalOfferTimeLeft < 60 && finalOfferTimeLeft > 0 && 'animate-pulse')}>
                                                {finalOfferTimeLeft < 60 && finalOfferTimeLeft > 0 && <p className="text-red-400 font-bold text-sm sm:text-base mb-1">ÚLTIMOS SEGUNDOS</p>}
                                                <div className={cn("flex items-center justify-center space-x-1 sm:space-x-2 mb-2", finalOfferTimeLeft < 60 && finalOfferTimeLeft > 0 ? 'text-red-400' : 'text-yellow-200', finalOfferTimeLeft === 0 && 'text-red-600')}>
                                                    <Clock className="h-5 w-5 sm:h-6 shrink-0" />
                                                    <span className={cn("text-2xl sm:text-3xl font-bold font-mono", finalOfferTimeLeft < 60 && finalOfferTimeLeft > 0 ? 'animate-pulse' : '', isFinalOfferTimerBlinking && finalOfferTimeLeft > 0 && finalOfferTimeLeft >= 60 ? 'animate-ping opacity-75':'opacity-100')}>
                                                        {formatTime(finalOfferTimeLeft)}
                                                    </span>
                                                </div>
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
                                                showProgressNotification(100);
                                                setGamifiedPercentage(100);
                                                // playSound('form_complete.mp3');
                                            }}
                                            className={cn(`w-full max-w-md mx-auto font-headline text-base sm:text-lg md:text-xl px-6 py-7 rounded-xl shadow-2xl transform hover:scale-105 transition-transform duration-200 pulse-goddess whitespace-normal text-center h-auto leading-normal`,
                                            finalOfferTimeLeft === 0 ? 'bg-gray-700 hover:bg-gray-800 cursor-not-allowed opacity-60' : 'bg-gradient-to-r from-green-500 via-emerald-600 to-green-700 hover:from-green-600 hover:via-emerald-700 hover:to-green-800 text-white')}
                                            disabled={finalOfferTimeLeft === 0}
                                        >
                                            <a href="https://pay.kiwify.com.br/xxxxxxxx" target="_blank" rel="noopener noreferrer" className="flex flex-col sm:flex-row items-center justify-center gap-2 min-h-[48px] py-3">
                                                <span className="flex items-center justify-center gap-2 leading-tight break-words">
                                                    <ShoppingCart className="h-6 w-6 shrink-0" />
                                                    {finalOfferTimeLeft > 0 ? `Desbloquear agora – por R$${offerPriceFinal.toFixed(2).replace('.',',')}` : "OFERTA EXPIRADA"}
                                                    <ExternalLink className="h-5 w-5 shrink-0" />
                                                </span>
                                                <span className="text-xs font-semibold text-green-200/90 bg-green-900/40 px-2 py-0.5 rounded-full">Acesso imediato</span>
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
            
            <hr className="border-white/10 my-10 md:my-14" />
            
            <section id="faq-section" ref={registerSectionRef('faq-section')} className="animate-fade-in py-10 md:py-12" style={{ animationDelay: '0.2s' }}>
                <h2 className="font-headline text-2xl sm:text-3xl md:text-4xl text-center mb-10 text-white font-bold">Dúvidas? Respostas diretas.</h2>
                <Accordion type="single" collapsible defaultValue="faq-guarantee" className="w-full max-w-2xl mx-auto space-y-3">
                    {faqItems.map((item, index) => (
                        <AccordionItem key={item.id} value={item.id} className="bg-white/5 border border-white/10 rounded-lg px-4 animate-fade-in" style={{animationDelay: `${0.1 * index}s`}}>
                            <AccordionTrigger className="text-left text-md sm:text-lg text-pink-300 hover:text-accent font-semibold hover:no-underline py-4">
                                {item.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-white/80 text-sm sm:text-base leading-relaxed pb-4">
                                {item.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
                    <div className="text-center mt-12">
                    <Button 
                        onClick={() => {
                             if (isCodeUnlocked) {
                                requestAnimationFrame(() => {
                                   const element = document.getElementById('final-purchase-cta-section');
                                   if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                });
                             } else {
                                handleUnlockCode(); 
                             }
                        }}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg sm:text-xl py-3 sm:py-4 px-8 sm:px-10 rounded-xl shadow-xl hover:scale-105 transition-transform duration-300 animate-icon-subtle-float h-auto whitespace-normal text-center leading-normal"
                    >
                        <Key className="mr-2 h-5 w-5 shrink-0" /> ESTOU PRONTA PARA DESBLOQUEAR!
                    </Button>
                </div>
            </section>

            <hr className="border-white/10 my-10 md:my-14" />

            <section id="decision-section" ref={registerSectionRef('decision-section')} className="animate-fade-in" style={{animationDelay: '0.2s'}}>
                <h2 className="font-headline text-2xl sm:text-3xl md:text-4xl text-center mb-8 text-white font-bold">Sua Encruzilhada, {displayName}:</h2>
                <div className={cn("grid md:grid-cols-2 gap-6 md:gap-8 transition-opacity duration-500")}>
                    <Card className="bg-red-900/70 border-2 border-red-600 p-6 rounded-2xl h-full">
                        <CardHeader className="p-0 mb-3 text-center">
                            <ThumbsDown className="h-10 w-10 text-red-300 mx-auto mb-2 shrink-0" />
                            <CardTitle className="text-xl sm:text-2xl text-red-200">CONTINUAR COMO ESTÁ</CardTitle>
                        </CardHeader>
                        <ul className="space-y-2 text-red-200/90 text-sm sm:text-base">
                            <li className="flex items-start"><XCircle className="h-5 w-5 text-red-400 mr-2 shrink-0 mt-0.5" /> Continuar reclamando no espelho toda manhã.</li>
                            <li className="flex items-start"><XCircle className="h-5 w-5 text-red-400 mr-2 shrink-0 mt-0.5" /> Sonhos como {dreamsText} parecendo impossíveis.</li>
                            <li className="flex items-start"><XCircle className="h-5 w-5 text-red-400 mr-2 shrink-0 mt-0.5" /> Autossabotagem e procrastinação até o fim.</li>
                            <li className="flex items-start"><XCircle className="h-5 w-5 text-red-400 mr-2 shrink-0 mt-0.5" /> Ver outras conquistando e você parada.</li>
                            <li className="flex items-start"><XCircle className="h-5 w-5 text-red-400 mr-2 shrink-0 mt-0.5" /> Energia e potencial no ralo.</li>
                        </ul>
                    </Card>
                    <Card className="bg-green-900/70 border-2 border-green-600 p-6 rounded-2xl h-full">
                        <CardHeader className="p-0 mb-3 text-center">
                            <ThumbsUp className="h-10 w-10 text-green-300 mx-auto mb-2 shrink-0" />
                            <CardTitle className="text-xl sm:text-2xl text-green-200">VIRAR O JOGO AGORA</CardTitle>
                        </CardHeader>
                        <ul className="space-y-2 text-green-200/90 text-sm sm:text-base">
                            <li className="flex items-start"><CheckCircle2 className="h-5 w-5 text-green-400 mr-2 shrink-0 mt-0.5" /> Manifestar {dreamsText}{dreamsAchievementDateLabel ? ` em ${dreamsAchievementDateLabel}` : ` ${achievementDateText}`}.</li>
                            <li className="flex items-start"><CheckCircle2 className="h-5 w-5 text-green-400 mr-2 shrink-0 mt-0.5" /> Acordar e saber que TUDO mudou.</li>
                            <li className="flex items-start"><CheckCircle2 className="h-5 w-5 text-green-400 mr-2 shrink-0 mt-0.5" /> Cabeça reprogramada. Padrão destruído.</li>
                            <li className="flex items-start"><CheckCircle2 className="h-5 w-5 text-green-400 mr-2 shrink-0 mt-0.5" /> Confiante. Capaz. Merecedora.</li>
                            <li className="flex items-start"><CheckCircle2 className="h-5 w-5 text-green-400 mr-2 shrink-0 mt-0.5" /> A vida que você sempre soube que merecia.</li>
                        </ul>
                    </Card>
                </div>
                <div className={cn("text-center mt-10 transition-opacity duration-1000 opacity-100 animate-fade-in")} style={{animationDelay: '2s'}}>
                    <Button onClick={() => {
                        if (isCodeUnlocked) {
                            requestAnimationFrame(() => {
                               const ctaSection = document.getElementById('final-purchase-cta-section');
                               if (ctaSection) ctaSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            });
                        } else {
                            handleUnlockCode();
                        }
                    }} size="lg" className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 hover:from-purple-700 hover:via-pink-700 hover:to-red-700 text-white font-bold text-lg sm:text-xl py-4 px-10 rounded-xl shadow-2xl animate-intense-pulse h-auto whitespace-normal text-center leading-normal">
                        <Rocket className="mr-2 h-6 w-6 shrink-0" /> EU DECIDO VIRAR O JOGO!
                    </Button>
                </div>
            </section>

            <hr className="border-white/10 my-10 md:my-14" />
            
            <section id="final-cta-section" ref={registerSectionRef('final-cta-section')} className="animate-fade-in bg-black/80 rounded-3xl p-8 sm:p-12 text-center border-t-4 border-accent" style={{animationDelay: '0.4s'}}>
                <h2 className="font-headline text-2xl sm:text-3xl md:text-4xl text-yellow-300 mb-6">É agora ou você vai continuar patinando, {displayName}?</h2>
                <p className="text-lg sm:text-xl text-white/80 mb-8 max-w-xl mx-auto">A cada segundo de hesitação, você adia a vida extraordinária que MERECE. Outras mulheres estão desbloqueando seus códigos AGORA.</p>
                <Button onClick={() => {
                    if (isCodeUnlocked) {
                        requestAnimationFrame(() => {
                            const finalPurchaseSection = document.getElementById('final-purchase-cta-section'); 
                            if(finalPurchaseSection) {
                                finalPurchaseSection.scrollIntoView({behavior: 'smooth', block: 'center'});
                                const purchaseButtonLink = finalPurchaseSection.querySelector('a');
                                if(purchaseButtonLink && finalOfferTimeLeft > 0) purchaseButtonLink.click();
                            }
                        });
                    } else {
                        handleUnlockCode(); 
                    }
                }} 
                size="lg" className="bg-green-500 hover:bg-green-600 text-white font-extrabold text-xl sm:text-2xl py-4 sm:py-5 px-10 sm:px-12 rounded-xl shadow-2xl animate-subtle-vibration hover:shadow-accent/50 transform hover:scale-105 transition-all h-auto whitespace-normal text-center leading-normal">
                    EU DECIDO. {formatUserDreamsForCta(userDreams)} NÃO PODE ESPERAR.
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
                            <AlertDialogTitle className="text-red-400 text-2xl">Sério, {displayName}?</AlertDialogTitle>
                            <AlertDialogDescription className="text-white/60">
                                Você vai olhar pra trás daqui 6 meses e lembrar DESSE momento. A pergunta é: com alívio ou com arrependimento?
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel className="text-gray-300 hover:bg-gray-700 border-gray-600">Quero pensar melhor</AlertDialogCancel>
                            <AlertDialogAction onClick={() => { setShowRecusePopup(false); /* playSound('form_error.mp3'); */ }} className="bg-red-600 hover:bg-red-700 text-white">Sim, tenho certeza (e aceito as consequências)</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </section>
        </main>
        <StickyCtaBar
          visible={stickyVisible}
          price={offerPriceFinal}
          onCtaClick={handleStickyCtaClick}
          ctaText={!isPriceRevealed ? "VER O INVESTIMENTO" : !isCodeUnlocked ? "GARANTIR MEU ACESSO AGORA" : "GARANTIR AGORA"}
        />
        <ExitIntentModal
          open={exitIntentOpen}
          onOpenChange={setExitIntentOpen}
          displayName={displayName}
          dreamsText={dreamsText}
          dreamsAchievementDateLabel={dreamsAchievementDateLabel}
          price={offerPriceFinal}
          onCtaClick={handleStickyCtaClick}
        />

        {!stickyVisible && (
          <div className="fixed bottom-0 left-0 right-0 py-3 px-4 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/95 to-transparent pointer-events-none z-30">
            <div className="flex items-center justify-between max-w-[470px] mx-auto">
              <span className="text-white/40 text-xs">@diagnóstico.da.deusa</span>
            </div>
          </div>
        )}
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

const formatUserDreamsForCta = (dreams?: DreamOption[]): string => {
  if (!dreams || dreams.length === 0) return "MEUS SONHOS";
  return dreams[0].label.toUpperCase();
};
