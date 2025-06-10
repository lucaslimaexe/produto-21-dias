
"use client";

import React, { useState, useEffect } from 'react';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Sparkles, User, Loader2, CheckCircle2, CalendarDays, Gem, Castle, Plane, Car, Heart, Briefcase, Brain, Leaf, Palette, TrendingUpIcon, MountainSnow, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

// Opções de sonhos com URLs de placeholder e data-ai-hint
const dreamOptions = [
  { id: 'financial_freedom', label: 'Liberdade Financeira', imageUrl: 'https://www.infomoney.com.br/wp-content/uploads/2019/06/casal-de-sucesso.jpg?fit=900%2C647&quality=50&strip=all', imageAlt: "Casal celebrando sucesso financeiro", dataAiHint: "money success", icon: Gem, iconColorClass: "text-emerald-400" },
  { id: 'dream_house', label: 'Casa dos Sonhos', imageUrl: 'https://placehold.co/150x150.png', imageAlt: "Casa bonita com jardim", dataAiHint: "dream house", icon: Castle, iconColorClass: "text-blue-400" },
  { id: 'travel_world', label: 'Viver Viajando', imageUrl: 'https://placehold.co/150x150.png', imageAlt: "Mapa mundi com aviões e malas", dataAiHint: "travel world", icon: Plane, iconColorClass: "text-sky-400" },
  { id: 'new_car', label: 'Carro Novo', imageUrl: 'https://placehold.co/150x150.png', imageAlt: "Carro esportivo moderno", dataAiHint: "new car", icon: Car, iconColorClass: "text-red-400" },
  { id: 'soul_mate', label: 'Alma Gêmea', imageUrl: 'https://placehold.co/150x150.png', imageAlt: "Casal feliz de mãos dadas", dataAiHint: "happy couple", icon: Heart, iconColorClass: "text-pink-400" },
  { id: 'successful_business', label: 'Negócio de Sucesso', imageUrl: 'https://placehold.co/150x150.png', imageAlt: "Gráfico de crescimento e aperto de mãos", dataAiHint: "business achievement", icon: Briefcase, iconColorClass: "text-amber-500" },
  { id: 'inner_peace', label: 'Paz Interior', imageUrl: 'https://placehold.co/150x150.png', imageAlt: "Pessoa meditando em paisagem serena", dataAiHint: "serenity peace", icon: Brain, iconColorClass: "text-purple-400" },
  { id: 'health_wellness', label: 'Saúde e Bem-Estar', imageUrl: 'https://placehold.co/150x150.png', imageAlt: "Frutas frescas e pessoa se exercitando", dataAiHint: "health wellness", icon: Leaf, iconColorClass: "text-green-400" },
  { id: 'creative_expression', label: 'Expressão Criativa', imageUrl: 'https://placehold.co/150x150.png', imageAlt: 'Paleta de tintas e pincel', dataAiHint: "art creativity", icon: Palette, iconColorClass: "text-orange-400"},
  { id: 'personal_growth', label: 'Crescimento Pessoal', imageUrl: 'https://placehold.co/150x150.png', imageAlt: 'Pessoa subindo uma montanha metafórica', dataAiHint: "self improvement", icon: TrendingUpIcon, iconColorClass: "text-teal-400"},
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

const dateOptions = [
    { id: 'end_of_year', label: 'Final deste ano' },
    { id: 'next_year', label: 'Próximo ano' },
    { id: 'two_years', label: 'Em 2 anos' },
];

const formSchema = z.object({
  fullName: z.string().min(3, { message: "Precisamos do seu nome completo." }).max(100, { message: "O nome parece muito longo."}),
  selectedDreams: z.array(z.object({
    id: z.string(),
    label: z.string(),
    imageUrl: z.string().url({ message: "URL da imagem inválida."}),
    imageAlt: z.string(),
    dataAiHint: z.string(),
    icon: z.any(),
    iconColorClass: z.string(),
  })).length(3, {message: "Escolha exatamente 3 sonhos." }),
  dreamsAchievementDate: z.string().min(1, { message: "Quando você quer realizar estes sonhos?" }),
});

interface PreQuestionnaireFormScreenProps {
  onSubmitForm: (data: PreQuestionnaireFormData) => void;
}

export const PreQuestionnaireFormScreen: React.FC<PreQuestionnaireFormScreenProps> = ({ onSubmitForm }) => {
  const [selectedDreamsInternal, setSelectedDreamsInternal] = useState<DreamOption[]>([]);
  const { toast } = useToast();
  const [isProcessingSubmit, setIsProcessingSubmit] = useState(false);

  const { control, handleSubmit, setValue, watch, formState: { errors, isValid, touchedFields }, getValues, trigger } = useForm<PreQuestionnaireFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      selectedDreams: [],
      dreamsAchievementDate: '',
    },
    mode: 'onChange', 
  });

  const watchedSelectedDreams = watch('selectedDreams');

  useEffect(() => {
    if (watchedSelectedDreams.length === 3 && !isProcessingSubmit) {
      trigger().then(isFormValid => {
        const currentValues = getValues();
        if (!currentValues.fullName || errors.fullName) {
          toast({ title: "Nome Pendente", description: "Por favor, preencha seu nome completo para continuar.", variant: "destructive", duration: 3000 });
          return;
        }
        if (!currentValues.dreamsAchievementDate || errors.dreamsAchievementDate) {
          toast({ title: "Data Pendente", description: "Defina quando seus sonhos se realizarão para continuar.", variant: "destructive", duration: 3000 });
          return;
        }

        if (isFormValid) {
          setIsProcessingSubmit(true);
          toast({
            title: "Quase lá!",
            description: "Estamos preparando seu diagnóstico personalizado...",
            duration: 2000,
          });
          setTimeout(() => {
            onSubmitForm(currentValues);
          }, 1500);
        }
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedSelectedDreams, isProcessingSubmit, errors, onSubmitForm, getValues, toast, trigger]);


  const handleDreamSelection = (dream: DreamOption) => {
    if (isProcessingSubmit) return;

    const currentIndex = selectedDreamsInternal.findIndex(d => d.id === dream.id);
    let newSelectedDreams: DreamOption[];

    if (currentIndex === -1) { 
      if (selectedDreamsInternal.length < 3) {
        newSelectedDreams = [...selectedDreamsInternal, dream];
      } else {
        toast({
          title: "Limite de 3 Sonhos Atingido",
          description: "Desmarque um sonho para escolher outro.",
          variant: "default", 
          duration: 3000,
        });
        return; 
      }
    } else { 
      newSelectedDreams = selectedDreamsInternal.filter(d => d.id !== dream.id);
    }
    setSelectedDreamsInternal(newSelectedDreams);
    setValue('selectedDreams', newSelectedDreams, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
  };


  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-purple-900 via-indigo-950 to-rose-900 text-foreground font-body">
      <div className="w-full max-w-lg bg-slate-900/60 backdrop-blur-2xl border border-purple-700/50 shadow-2xl shadow-primary/30 rounded-3xl p-6 sm:p-10 space-y-8 animate-fade-in">

        <header className="text-center space-y-2">
          <Sparkles className="h-12 w-12 sm:h-14 sm:w-14 text-accent mx-auto animate-float [animation-duration:3s]" />
          <h1 className="font-headline text-3xl sm:text-4xl font-extrabold goddess-text-gradient">Sua Jornada Começa Agora</h1>
          <p className="text-muted-foreground text-md sm:text-lg">Conte-nos um pouco sobre você e seus sonhos.</p>
        </header>

        <form className="space-y-6">
          <div className="space-y-1">
            <Label htmlFor="fullName" className="text-sm font-semibold text-foreground/90 flex items-center">
              <User className="h-4 w-4 mr-2 text-primary/80" /> Seu Nome Completo
            </Label>
            <Controller
              name="fullName"
              control={control}
              render={({ field }) => (
                <Input
                  id="fullName"
                  placeholder="Como podemos te chamar?"
                  {...field}
                  className={cn(
                    "bg-slate-800/70 border-purple-600/70 focus:border-accent focus:shadow-md focus:shadow-accent/30 text-base font-medium",
                    errors.fullName ? 'border-destructive focus:border-destructive' : ''
                  )}
                  disabled={isProcessingSubmit}
                />
              )}
            />
            {errors.fullName && <p className="text-destructive text-xs pt-1">{errors.fullName.message}</p>}
          </div>
          
          <div className="space-y-2">
             <Label className="text-sm font-semibold text-foreground/90 flex items-center">
               <CalendarDays className="h-4 w-4 mr-2 text-primary/80" /> Quando seus sonhos se realizarão?
            </Label>
            <Controller
              name="dreamsAchievementDate"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  onValueChange={(value) => {
                    field.onChange(value);
                    setValue('dreamsAchievementDate', value, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
                  }}
                  defaultValue={field.value}
                  className="grid grid-cols-1 sm:grid-cols-3 gap-3"
                >
                  {dateOptions.map((option) => (
                    <Label
                      key={option.id}
                      htmlFor={option.id}
                      className={cn(
                        "flex items-center space-x-2 p-3 rounded-lg border-2 cursor-pointer transition-all",
                        field.value === option.id 
                          ? "border-accent bg-accent/20 text-primary-foreground shadow-lg" 
                          : "border-purple-600/70 bg-slate-800/70 hover:border-purple-500 text-foreground/80", 
                        isProcessingSubmit ? "opacity-50 cursor-not-allowed" : ""
                      )}
                    >
                      <RadioGroupItem 
                        value={option.id} 
                        id={option.id} 
                        className={cn(
                          field.value === option.id ? "border-accent text-accent" : "border-purple-500 text-purple-500"
                        )}
                        disabled={isProcessingSubmit} 
                      />
                      <span className="font-semibold text-sm">{option.label}</span>
                    </Label>
                  ))}
                </RadioGroup>
              )}
            />
            {errors.dreamsAchievementDate && <p className="text-destructive text-xs pt-1 text-center sm:text-left">{errors.dreamsAchievementDate.message}</p>}
          </div>


          <div className="space-y-3">
            <Label className="text-sm font-semibold text-foreground/90 block text-center">Selecione 3 sonhos que mais pulsam em seu coração:</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              {dreamOptions.map((dream) => {
                const isSelected = selectedDreamsInternal.some(d => d.id === dream.id);
                return (
                  <button
                    key={dream.id}
                    type="button"
                    onClick={() => handleDreamSelection(dream)}
                    disabled={isProcessingSubmit || (!isSelected && selectedDreamsInternal.length >= 3)}
                    className={cn(
                      "relative flex flex-col items-center justify-center p-1 rounded-xl border-2 transition-all duration-200 ease-in-out aspect-square focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-accent overflow-hidden group",
                      isSelected
                        ? 'border-accent bg-accent/20 shadow-xl shadow-accent/40 scale-105 animate-pulse-once hover:shadow-accent/50'
                        : 'border-purple-600/60 bg-slate-800/50 hover:border-accent/70 hover:bg-purple-700/20 hover:shadow-lg hover:shadow-accent/30',
                      !isSelected && selectedDreamsInternal.length >= 3 && 'opacity-40 cursor-not-allowed brightness-75'
                    )}
                    aria-pressed={isSelected}
                  >
                    <Image 
                        src={dream.imageUrl} 
                        alt={dream.imageAlt} 
                        width={150} 
                        height={150}
                        data-ai-hint={dream.dataAiHint} 
                        className={cn(
                            "object-cover rounded-md w-full h-full transition-transform duration-300 group-hover:scale-105",
                            isSelected ? "opacity-90" : "opacity-100"
                        )}
                    />
                    {isSelected && <CheckCircle2 className="absolute top-1.5 right-1.5 h-5 w-5 text-green-400 bg-slate-900/50 rounded-full animate-pop-in" />}
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-1.5 text-center">
                        <span className={cn("text-xs sm:text-sm font-semibold leading-tight", isSelected ? "text-accent" : "text-foreground/80")}>{dream.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>
            {errors.selectedDreams && <p className="text-destructive text-xs pt-2 text-center">{errors.selectedDreams.message}</p>}
            <p className="text-muted-foreground text-xs pt-1 text-center">
              Selecionados: {selectedDreamsInternal.length} de 3.
            </p>
          </div>

          {isProcessingSubmit && (
            <div className="flex flex-col items-center justify-center pt-4">
              <Loader2 className="h-10 w-10 text-primary animate-spin mb-3" />
              <p className="text-sm text-primary font-semibold">Conectando com o universo...</p>
              <p className="text-xs text-muted-foreground">Sua jornada de transformação está começando!</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

    