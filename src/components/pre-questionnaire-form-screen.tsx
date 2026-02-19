
"use client";

import React, { useState, useEffect } from 'react';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Sparkles, User, Loader2, CheckCircle2, CalendarDays, Gem, Castle, Plane, Car, Heart, Briefcase, Brain, Leaf, Palette, TrendingUpIcon, MountainSnow, Lightbulb, Target, Wand2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { playSound } from '@/lib/audioUtils';
import { useGamification } from '@/components/gamification';
import { PointsDisplay } from '@/components/gamification/PointsDisplay';

export const dreamOptions = [
  { id: 'financial_freedom', label: 'Liberdade Financeira', imageUrl: 'https://www.infomoney.com.br/wp-content/uploads/2019/06/casal-de-sucesso.jpg?fit=900%2C647&quality=50&strip=all', imageAlt: "Casal celebrando sucesso financeiro", dataAiHint: "money success", icon: Gem, iconColorClass: "text-emerald-400" },
  { id: 'dream_house', label: 'Casa dos Sonhos', imageUrl: 'https://construcaoereforma.com.br/uploads/casa-dos-sonhos.jpg', imageAlt: "Casa bonita com jardim", dataAiHint: "dream house", icon: Castle, iconColorClass: "text-blue-400" },
  { id: 'travel_world', label: 'Viver Viajando', imageUrl: 'https://socialturismo.com.br/wp-content/uploads/elementor/thumbs/paris-1-qqtnmehczrnxv1kkqcmpm0w1075c3i0g2pufjojbfk.png', imageAlt: "Mapa mundi com aviões e malas", dataAiHint: "travel world", icon: Plane, iconColorClass: "text-sky-400" },
  { id: 'new_car', label: 'Carro Novo', imageUrl: 'https://img.freepik.com/fotos-gratis/mulher-segurando-as-chaves-de-seu-carro-novo_1303-28783.jpg?semt=ais_items_boosted&w=740', imageAlt: "Mulher segurando chaves de carro novo", dataAiHint: "new car keys", icon: Car, iconColorClass: "text-red-400" },
  { id: 'soul_mate', label: 'Alma Gêmea', imageUrl: 'https://pixelnerd.com.br/wp-content/uploads/2023/04/cinquenta-tons-de-cinza-anastasia-christian-1-1.jpg', imageAlt: "Casal feliz de mãos dadas", dataAiHint: "happy couple", icon: Heart, iconColorClass: "text-pink-400" },
  { id: 'successful_business', label: 'Negócio de Sucesso', imageUrl: 'https://s2-oglobo.glbimg.com/37aAHq6iJ3gXS-aMmoKHJj9IeSk=/0x0:1500x1502/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_da025474c0c44edd99332dddb09cabe8/internal_photos/bs/2024/9/4/VgmzajTjAVltegWsJkPQ/whatsapp-image-2024-07-16-at-16.43.15.jpg', imageAlt: "Gráfico de crescimento e aperto de mãos", dataAiHint: "business achievement", icon: Briefcase, iconColorClass: "text-amber-500" },
  { id: 'inner_peace', label: 'Paz Interior', imageUrl: 'https://p2.trrsf.com/image/fget/cf/774/0/images.terra.com/2020/12/26/salmos-para-paz-interior.jpg', imageAlt: "Pessoa meditando em paisagem serena", dataAiHint: "serenity peace", icon: Brain, iconColorClass: "text-purple-400" },
  { id: 'health_wellness', label: 'Saúde e Bem-Estar', imageUrl: 'https://s2.glbimg.com/N2xt8vv37XTHNex50Ua-jGPmllA=/top/smart/e.glbimg.com/og/ed/f/original/2022/02/12/virginia-insta.jpg', imageAlt: "Frutas frescas e pessoa se exercitando", dataAiHint: "health wellness", icon: Leaf, iconColorClass: "text-green-400" },
  { id: 'creative_expression', label: 'Expressão Criativa', imageUrl: 'https://blog.delrio.com.br/wp-content/uploads/2025/03/hobbie_feminino_fotografia.png', imageAlt: 'Paleta de tintas e pincel', dataAiHint: "art creativity", icon: Palette, iconColorClass: "text-orange-400"},
  { id: 'personal_growth', label: 'Crescimento Pessoal', imageUrl: 'https://inspiracaomulher.com.br/wp-content/uploads/2024/04/IMAGEM-PADRAO-POSTS-DO-BLOG-1200-x-800-px-38.png', imageAlt: 'Pessoa subindo uma montanha metafórica', dataAiHint: "self improvement", icon: TrendingUpIcon, iconColorClass: "text-teal-400"},
];

export interface DreamOption {
  id: string;
  label: string;
  imageUrl: string;
  imageAlt: string;
  dataAiHint: string;
  icon: React.ElementType;
  iconColorClass: string;
}

export interface PreQuestionnaireFormData {
  fullName: string;
  selectedDreams: DreamOption[];
  dreamsAchievementDate: string;
}

export const dateOptions = [
    { id: 'end_of_year', label: 'Final deste ano' },
    { id: 'next_year', label: 'Próximo ano' },
    { id: 'two_years', label: 'Em 2 anos' },
];

const formSchema = z.object({
  fullName: z.string().min(3, { message: "Precisamos de um nome com pelo menos 3 letras." }).max(100, { message: "O nome parece muito longo."}),
  selectedDreams: z.array(z.custom<DreamOption>()).length(3, {message: "Escolha exatamente 3 sonhos." }),
  dreamsAchievementDate: z.string().min(1, { message: "Quando você quer realizar estes sonhos?" }),
});

interface PreQuestionnaireFormScreenProps {
  onSubmitForm: (data: PreQuestionnaireFormData) => void;
}

export const PreQuestionnaireFormScreen: React.FC<PreQuestionnaireFormScreenProps> = ({ onSubmitForm }) => {
  const { toast } = useToast();
  const g = useGamification();
  const [isProcessingSubmit, setIsProcessingSubmit] = useState(false);

  const { control, handleSubmit, setValue, watch, formState: { errors }, getValues, trigger } = useForm<PreQuestionnaireFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      selectedDreams: [],
      dreamsAchievementDate: '',
    },
    mode: 'onChange',
  });

  const watchedSelectedDreams = watch('selectedDreams');
  const watchedFullName = watch('fullName');
  const watchedDreamsAchievementDate = watch('dreamsAchievementDate');

  const isNameComplete = watchedFullName.trim().length >= (formSchema.shape.fullName._def.checks.find(c => c.kind === 'min') as any)?.value;
  const isDateSelected = !!watchedDreamsAchievementDate;

  useEffect(() => {
    if (watchedSelectedDreams.length === 3 && !isProcessingSubmit) {
      const currentValues = getValues();

      if (!isNameComplete || errors.fullName) {
          toast({ title: "Ops, falta seu nome!", description: "Por favor, preencha seu nome completo para continuarmos.", variant: "destructive", duration: 3500 });
          // playSound('form_error.mp3');
          return;
      }
      if (!isDateSelected || errors.dreamsAchievementDate) {
          toast({ title: "E a data dos sonhos?", description: "Defina quando seus sonhos se realizarão para seguirmos em frente.", variant: "destructive", duration: 3500 });
          // playSound('form_error.mp3');
          return;
      }

      trigger().then(isFormValid => {
        if (isFormValid) {
          setIsProcessingSubmit(true);
          // playSound('form_complete.mp3');
          toast({
            title: "Quase lá!",
            description: "Estamos preparando seu diagnóstico personalizado...",
            duration: 2000,
          });
          g?.completePreForm();
          setTimeout(() => {
            onSubmitForm(currentValues);
          }, 1500);
        } else {
           // Se o trigger() falhar, o Zod já deve ter mostrado os erros nos campos.
           // Poderia adicionar um toast genérico aqui se quisesse.
           // playSound('form_error.mp3');
        }
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedSelectedDreams, isProcessingSubmit, errors, onSubmitForm, getValues, toast, trigger, isNameComplete, isDateSelected]);


  const handleDreamSelection = (dream: DreamOption) => {
    if (isProcessingSubmit) return;

    const currentSelected = getValues('selectedDreams');
    const currentIndex = currentSelected.findIndex(d => d.id === dream.id);
    let newSelectedDreams: DreamOption[];

    if (currentIndex === -1) {
      if (currentSelected.length < 3) {
        newSelectedDreams = [...currentSelected, dream];
        // playSound('dream_select.mp3');
      } else {
        toast({
          title: "Limite de 3 Sonhos Atingido",
          description: "Desmarque um sonho para escolher outro.",
          variant: "default",
          duration: 3000,
        });
        // playSound('limit_reached.mp3');
        return;
      }
    } else {
      newSelectedDreams = currentSelected.filter(d => d.id !== dream.id);
      // playSound('dream_deselect.mp3');
    }
    setValue('selectedDreams', newSelectedDreams, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
  };

  const handleDateSelection = (value: string) => {
    setValue('dreamsAchievementDate', value, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
    // playSound('date_select.mp3');
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 bg-gradient-to-br from-purple-900 via-indigo-950 to-rose-900 text-foreground font-body relative">
      {g && (
        <div className="absolute top-4 right-4 z-20">
          <PointsDisplay />
        </div>
      )}
      <div className="w-full max-w-xl bg-slate-900/70 backdrop-blur-2xl border border-purple-700/50 shadow-2xl shadow-primary/40 rounded-3xl p-6 sm:p-8 md:p-10 space-y-8 sm:space-y-10">

        <header className="text-center space-y-4 animate-fade-in">
          <Wand2 className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 text-accent mx-auto animate-float [animation-duration:3s]" aria-hidden />
          <h1 className="font-headline text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold goddess-text-gradient leading-tight">Sua Jornada Começa Agora</h1>
          <p className="text-muted-foreground text-base sm:text-lg md:text-xl leading-relaxed">Conte-nos um pouco sobre você e seus sonhos.</p>
        </header>

        <form className="space-y-6 sm:space-y-8">
          <div className="space-y-2.5 animate-fade-in">
            <Label htmlFor="fullName" className="text-base sm:text-lg font-semibold text-foreground flex items-center gap-2">
              <User className="h-5 w-5 text-primary/80 shrink-0" aria-hidden /> Seu Nome Completo
            </Label>
            <Controller
              name="fullName"
              control={control}
              render={({ field }) => (
                <Input
                  id="fullName"
                  placeholder="Como podemos te chamar, Deusa?"
                  {...field}
                  className={cn(
                    "bg-slate-800/70 border-purple-600/70 focus:border-accent focus:shadow-md focus:shadow-accent/30 text-base font-medium py-3",
                    errors.fullName ? 'border-destructive focus:border-destructive' : ''
                  )}
                  disabled={isProcessingSubmit}
                  onBlur={() => trigger("fullName")}
                />
              )}
            />
            {errors.fullName && <p className="text-destructive text-sm pt-1">{errors.fullName.message}</p>}
          </div>

          {isNameComplete && (
            <div className="space-y-3 animate-fade-in" style={{ animationDelay: '0.2s' }}>
               <Label className="text-base sm:text-lg font-semibold text-foreground flex items-center gap-2">
                 <CalendarDays className="h-5 w-5 text-primary/80 shrink-0" aria-hidden /> Quando seus sonhos se realizarão?
              </Label>
              <Controller
                name="dreamsAchievementDate"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    onValueChange={(value) => {
                      field.onChange(value);
                      handleDateSelection(value);
                      trigger("dreamsAchievementDate");
                    }}
                    defaultValue={field.value}
                    className="flex flex-col gap-3"
                  >
                    {dateOptions.map((option) => (
                      <label
                        key={option.id}
                        htmlFor={option.id}
                        className={cn(
                          "flex items-center gap-4 min-h-[52px] w-full px-5 py-4 rounded-xl border-2 cursor-pointer transition-colors",
                          field.value === option.id
                            ? "border-accent shadow-lg"
                            : "border-purple-600/70 bg-slate-800/70 hover:border-purple-500 text-foreground/90",
                          field.value === option.id && "bg-[#fcd34d]",
                          isProcessingSubmit ? "opacity-60 cursor-not-allowed" : ""
                        )}
                      >
                        <RadioGroupItem
                          value={option.id}
                          id={option.id}
                          className={cn(
                            "h-5 w-5 shrink-0",
                            field.value === option.id ? "border-amber-800 text-amber-800" : "border-purple-500 text-purple-500"
                          )}
                          disabled={isProcessingSubmit}
                        />
                        <span 
                          className={cn(
                            "font-semibold text-base sm:text-lg flex-1",
                            field.value === option.id ? "text-[#1a1a1a]" : ""
                          )}
                          style={{ textAlign: 'left', lineHeight: 1.6 }}
                        >
                          {option.label}
                        </span>
                      </label>
                    ))}
                  </RadioGroup>
                )}
              />
              {errors.dreamsAchievementDate && <p className="text-destructive text-sm pt-1 text-center sm:text-left">{errors.dreamsAchievementDate.message}</p>}
            </div>
          )}


          {isNameComplete && isDateSelected && (
            <div className="space-y-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <Label className="text-base sm:text-lg font-semibold text-foreground block text-center leading-relaxed">Selecione 3 sonhos que mais pulsam em seu coração:</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                {dreamOptions.map((dream) => {
                  const isSelected = watchedSelectedDreams.some(d => d.id === dream.id);
                  return (
                    <button
                      key={dream.id}
                      type="button"
                      onClick={() => handleDreamSelection(dream)}
                      disabled={isProcessingSubmit || (!isSelected && watchedSelectedDreams.length >= 3)}
                  className={cn(
                    "relative flex flex-col items-center justify-center p-2 sm:p-1 rounded-xl border-2 transition-all duration-200 ease-in-out aspect-square focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-accent overflow-hidden group",
                        isSelected
                          ? 'border-accent bg-accent/20 shadow-xl shadow-accent/40 scale-105 animate-pulse-once hover:shadow-accent/50'
                          : 'border-purple-600/60 bg-slate-800/50 hover:border-accent hover:bg-purple-700/30 hover:shadow-xl hover:shadow-accent/50',
                        !isSelected && watchedSelectedDreams.length >= 3 && 'opacity-40 cursor-not-allowed brightness-75'
                      )}
                      aria-pressed={isSelected}
                    >
                      <dream.icon className={cn("absolute h-1/2 w-1/2 z-0 opacity-10 group-hover:opacity-20 transition-opacity", dream.iconColorClass, isSelected ? 'opacity-5' : '')} />
                      <Image
                          src={dream.imageUrl}
                          alt={dream.imageAlt}
                          width={150}
                          height={150}
                          data-ai-hint={dream.dataAiHint}
                          className={cn(
                              "object-cover rounded-md w-full h-full transition-transform duration-300 group-hover:scale-105 z-10", 
                              isSelected ? "opacity-90" : "opacity-100"
                          )}
                      />
                      {isSelected && <CheckCircle2 className="absolute top-1.5 right-1.5 h-5 w-5 text-green-400 bg-slate-900/50 rounded-full animate-pop-in z-20" />}
                      <div className="absolute bottom-0 left-0 right-0 bg-black/70 px-2 py-2 text-center z-20">
                          <span className={cn("text-xs sm:text-sm font-semibold leading-tight", isSelected ? "text-accent" : "text-foreground/90")}>{dream.label}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
              {errors.selectedDreams && <p className="text-destructive text-sm pt-2 text-center">{errors.selectedDreams.message}</p>}
              <p className="text-muted-foreground text-sm pt-1 text-center">
                Selecionados: {watchedSelectedDreams.length} de 3.
              </p>
            </div>
          )}

          {isProcessingSubmit && (
            <div className="flex flex-col items-center justify-center pt-6 animate-fade-in">
              <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
              <p className="text-base text-primary font-semibold">Conectando com o universo...</p>
              <p className="text-sm text-muted-foreground">Sua jornada de transformação está começando!</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
