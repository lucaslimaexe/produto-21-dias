
"use client";

import React, { useState } from 'react';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, DollarSign, HomeIcon, Plane, Car, Users, Briefcase, Brain, HeartHandshake, HelpCircle, Award, Sparkles, Target, User, Loader2, CheckCircle2, Palette, Building, MountainSnow, Gem, Castle, Lightbulb, Telescope } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const dreamOptions = [
  { id: 'financial_freedom', label: 'Liberdade Financeira', icon: Gem, iconColorClass: 'text-emerald-400' },
  { id: 'dream_house', label: 'Casa dos Sonhos', icon: Castle, iconColorClass: 'text-sky-400' },
  { id: 'travel_world', label: 'Viver Viajando', icon: Plane, iconColorClass: 'text-amber-400' },
  { id: 'new_car', label: 'Carro Novo', icon: Car, iconColorClass: 'text-red-400' },
  { id: 'soul_mate', label: 'Alma Gêmea', icon: HeartHandshake, iconColorClass: 'text-pink-400' },
  { id: 'successful_business', label: 'Negócio de Sucesso', icon: Briefcase, iconColorClass: 'text-indigo-400' },
  { id: 'inner_peace', label: 'Paz Interior', icon: MountainSnow, iconColorClass: 'text-cyan-400' },
  { id: 'health_wellness', label: 'Saúde e Bem-Estar', icon: Award, iconColorClass: 'text-lime-400' },
  { id: 'happy_family', label: 'Família Feliz', icon: Users, iconColorClass: 'text-orange-400' },
  { id: 'help_others', label: 'Ajudar o Próximo', icon: HelpCircle, iconColorClass: 'text-rose-400' },
  { id: 'creative_expression', label: 'Expressão Criativa', icon: Palette, iconColorClass: 'text-violet-400' },
  { id: 'personal_growth', label: 'Crescimento Pessoal', icon: Lightbulb, iconColorClass: 'text-yellow-400' }
];

export interface DreamOption {
  id: string;
  label: string;
  icon: React.ElementType;
  iconColorClass: string;
}

export interface PreQuestionnaireFormData {
  fullName: string;
  selectedDreams: DreamOption[];
  dreamsAchievementDate: Date;
}

const formSchema = z.object({
  fullName: z.string().min(3, { message: "Seu nome deve ter pelo menos 3 caracteres." }),
  selectedDreams: z.array(z.object({
    id: z.string(),
    label: z.string(),
    icon: z.any(),
    iconColorClass: z.string(),
  })).min(1, {message: "Escolha pelo menos 1 sonho."}).max(3, { message: "Escolha no máximo 3 sonhos." }),
  dreamsAchievementDate: z.date({ required_error: "Precisamos saber quando você quer realizar seus sonhos." }),
});

interface PreQuestionnaireFormScreenProps {
  onSubmitForm: (data: PreQuestionnaireFormData) => void;
}

export const PreQuestionnaireFormScreen: React.FC<PreQuestionnaireFormScreenProps> = ({ onSubmitForm }) => {
  const [selectedDreamsInternal, setSelectedDreamsInternal] = useState<DreamOption[]>([]);
  const { toast } = useToast();

  const { control, handleSubmit, setValue, watch, formState: { errors, isValid, isSubmitting } } = useForm<PreQuestionnaireFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      selectedDreams: [],
    },
    mode: 'onChange',
  });

  const watchedDreams = watch('selectedDreams');

  const handleDreamSelection = (dream: DreamOption) => {
    const currentIndex = selectedDreamsInternal.findIndex(d => d.id === dream.id);
    let newSelectedDreams: DreamOption[];

    if (currentIndex === -1) {
      if (selectedDreamsInternal.length < 3) {
        newSelectedDreams = [...selectedDreamsInternal, dream];
      } else {
        toast({
          title: "Limite Atingido",
          description: "Você já selecionou seus 3 maiores sonhos.",
          variant: "destructive",
          duration: 3000,
        });
        return;
      }
    } else {
      newSelectedDreams = selectedDreamsInternal.filter(d => d.id !== dream.id);
    }
    setSelectedDreamsInternal(newSelectedDreams);
    setValue('selectedDreams', newSelectedDreams, { shouldValidate: true });
  };

  const onSubmit: SubmitHandler<PreQuestionnaireFormData> = (data) => {
    if (isSubmitting) return;
    if (data.selectedDreams.length === 0) {
       toast({
          title: "Seleção Necessária",
          description: "Por favor, escolha pelo menos 1 sonho.",
          variant: "destructive",
          duration: 3000,
        });
      return;
    }
    onSubmitForm(data);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-background via-primary/20 to-background text-foreground font-body">
      <div className="w-full max-w-md bg-card/90 backdrop-blur-xl border border-border/60 shadow-2xl shadow-primary/25 rounded-2xl p-6 sm:p-8 space-y-6 animate-fade-in">

        <header className="text-center">
          <Sparkles className="h-10 w-10 sm:h-12 sm:w-12 text-accent mx-auto mb-2 animate-float [animation-duration:3s]" />
          <h1 className="font-headline text-2xl sm:text-3xl font-bold goddess-text-gradient">Conte-nos Seus Sonhos</h1>
          <p className="text-muted-foreground text-sm sm:text-base">Para onde seu coração te guia?</p>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

          <div className="space-y-1">
            <label htmlFor="fullName" className="text-sm font-medium text-foreground/90 flex items-center">
              <User className="h-4 w-4 mr-2 text-primary/80" /> Nome Completo
            </label>
            <Controller
              name="fullName"
              control={control}
              render={({ field }) => (
                <Input
                  id="fullName"
                  placeholder="Seu nome como na identidade"
                  {...field}
                  className={cn("bg-input/70 border-border focus:border-primary focus:shadow-md focus:shadow-primary/30", errors.fullName ? 'border-destructive focus:border-destructive' : '')}
                />
              )}
            />
            {errors.fullName && <p className="text-destructive text-xs pt-1">{errors.fullName.message}</p>}
          </div>


          <div className="space-y-1">
            <label htmlFor="dreamsAchievementDate" className="text-sm font-medium text-foreground/90 flex items-center">
               <Target className="h-4 w-4 mr-2 text-primary/80" /> Data da Manifestação
            </label>
            <Controller
              name="dreamsAchievementDate"
              control={control}
              render={({ field }) => (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal bg-input/70 border-border hover:bg-muted/50 focus:border-primary focus:shadow-md focus:shadow-primary/30",
                        !field.value && "text-muted-foreground",
                        errors.dreamsAchievementDate ? 'border-destructive focus:border-destructive' : ''
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-accent" />
                      {field.value ? format(field.value, "PPP", { locale: ptBR }) : <span>Quando seus sonhos se realizarão?</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 border-border bg-popover shadow-xl" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => field.onChange(date)}
                      initialFocus
                      locale={ptBR}
                      captionLayout="dropdown-buttons"
                      fromDate={new Date()}
                      fromYear={new Date().getFullYear()}
                      toYear={new Date().getFullYear() + 20}
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
            {errors.dreamsAchievementDate && <p className="text-destructive text-xs pt-1">{errors.dreamsAchievementDate.message}</p>}
          </div>


          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground/90 block text-center">Selecione de 1 a 3 sonhos:</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              {dreamOptions.map((dream) => {
                const isSelected = selectedDreamsInternal.some(d => d.id === dream.id);
                const canSelectMore = selectedDreamsInternal.length < 3;
                return (
                  <button
                    key={dream.id}
                    type="button"
                    onClick={() => handleDreamSelection(dream)}
                    className={cn(
                      "relative flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl border-2 transition-all duration-200 ease-in-out aspect-square focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-card focus:ring-accent hover:shadow-lg",
                      isSelected
                        ? 'border-accent bg-accent/20 shadow-xl shadow-accent/40 scale-105 animate-pulse-once hover:shadow-accent/50'
                        : 'border-border bg-background/50 hover:border-primary/70 hover:bg-primary/10 hover:shadow-primary/30',
                      !isSelected && !canSelectMore && 'opacity-50 cursor-not-allowed brightness-75'
                    )}
                    disabled={!isSelected && !canSelectMore && selectedDreamsInternal.length >=3}
                    aria-pressed={isSelected}
                  >
                    {isSelected && <CheckCircle2 className="absolute top-1.5 right-1.5 h-5 w-5 text-accent animate-pop-in" />}
                    <dream.icon className={cn("h-7 w-7 sm:h-8 sm:w-8 mb-1.5 animate-icon-subtle-float", dream.iconColorClass, isSelected ? "opacity-90" : "opacity-100")} />
                    <span className={cn("text-xs sm:text-sm text-center leading-tight font-medium", isSelected ? "text-accent-foreground" : "text-foreground/80")}>{dream.label}</span>
                  </button>
                );
              })}
            </div>
            {errors.selectedDreams && <p className="text-destructive text-xs pt-2 text-center">{errors.selectedDreams.message}</p>}
            <p className="text-muted-foreground text-xs pt-1 text-center">
              Selecionados: {selectedDreamsInternal.length} de 3.
            </p>
          </div>


          <Button
            type="submit"
            disabled={isSubmitting || selectedDreamsInternal.length === 0 || selectedDreamsInternal.length > 3 || !isValid }
            className="w-full goddess-gradient text-primary-foreground text-base sm:text-lg font-semibold py-3 rounded-lg shadow-xl hover:shadow-accent/50 transition-all duration-300 transform hover:scale-105 focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 pulse-goddess"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Aguarde...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-5 w-5" />
                Ir para o Diagnóstico
              </>
            )}
          </Button>
        </form>
      </div>

      <div className="absolute top-5 left-5 w-24 h-24 bg-primary/15 rounded-full -z-10 animate-float opacity-80 [animation-duration:10s] [animation-delay:-2s]"></div>
      <div className="absolute bottom-5 right-5 w-32 h-32 bg-accent/15 rounded-full -z-10 animate-float opacity-80 [animation-duration:12s] [animation-delay:-5s]"></div>
      <div className="absolute top-1/3 right-10 w-16 h-16 bg-primary/10 rounded-full -z-10 animate-float opacity-60 [animation-duration:8s] [animation-delay:-1s]"></div>
      <div className="absolute bottom-1/4 left-10 w-20 h-20 bg-accent/10 rounded-full -z-10 animate-float opacity-60 [animation-duration:9s] [animation-delay:0s]"></div>
    </div>
  );
};
