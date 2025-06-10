
"use client";

import React, { useState } from 'react';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, DollarSign, Home, Plane, Car, Users, Briefcase, Brain, HeartHandshake, HelpCircle, Award, Sparkles, Target, User, Loader2, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const dreamOptions = [
  { id: 'financial_freedom', label: 'Liberdade Financeira', icon: DollarSign },
  { id: 'dream_house', label: 'Casa dos Sonhos', icon: Home },
  { id: 'travel_world', label: 'Viver Viajando', icon: Plane },
  { id: 'new_car', label: 'Carro Novo', icon: Car },
  { id: 'soul_mate', label: 'Alma Gêmea', icon: HeartHandshake },
  { id: 'successful_business', label: 'Negócio de Sucesso', icon: Briefcase },
  { id: 'inner_peace', label: 'Paz Interior', icon: Brain },
  { id: 'health_wellness', label: 'Saúde e Bem-Estar', icon: Award },
  { id: 'happy_family', label: 'Família Feliz', icon: Users },
  { id: 'help_others', label: 'Ajudar o Próximo', icon: HelpCircle },
];

export interface DreamOption {
  id: string;
  label: string;
  icon: React.ElementType;
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
  })).length(3, { message: "Escolha exatamente 3 sonhos." }),
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
    mode: 'onChange', // Validate on change for better UX
  });

  const watchedDreams = watch('selectedDreams'); // For potential reactive UI updates if needed

  const handleDreamSelection = (dream: DreamOption) => {
    const currentIndex = selectedDreamsInternal.findIndex(d => d.id === dream.id);
    let newSelectedDreams: DreamOption[];

    if (currentIndex === -1) { // Dream not selected, try to add
      if (selectedDreamsInternal.length < 3) {
        newSelectedDreams = [...selectedDreamsInternal, dream];
      } else {
        toast({
          title: "Limite Atingido",
          description: "Você já selecionou seus 3 maiores sonhos.",
          variant: "destructive",
          duration: 3000,
        });
        return; // Don't add more than 3
      }
    } else { // Dream already selected, remove it
      newSelectedDreams = selectedDreamsInternal.filter(d => d.id !== dream.id);
    }
    setSelectedDreamsInternal(newSelectedDreams);
    setValue('selectedDreams', newSelectedDreams, { shouldValidate: true });
  };

  const onSubmit: SubmitHandler<PreQuestionnaireFormData> = (data) => {
    if (isSubmitting) return;
    console.log("Form data submitted:", data);
    onSubmitForm(data);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-background via-primary/5 to-background text-foreground font-body">
      <div className="w-full max-w-md bg-card/90 backdrop-blur-lg border border-border/50 shadow-2xl rounded-2xl p-6 sm:p-8 space-y-6 animate-fade-in">
        
        <header className="text-center">
          <Sparkles className="h-10 w-10 sm:h-12 sm:w-12 text-accent mx-auto mb-2 animate-float" />
          <h1 className="font-headline text-2xl sm:text-3xl font-bold goddess-text-gradient">Conte-nos Seus Sonhos</h1>
          <p className="text-muted-foreground text-sm sm:text-base">Para onde seu coração te guia?</p>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Full Name Input */}
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
                  className={cn("bg-background/70 border-border focus:border-primary", errors.fullName ? 'border-destructive focus:border-destructive' : '')} 
                />
              )}
            />
            {errors.fullName && <p className="text-destructive text-xs pt-1">{errors.fullName.message}</p>}
          </div>
          
          {/* Dreams Achievement Date Input */}
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
                        "w-full justify-start text-left font-normal bg-background/70 border-border hover:bg-muted/50",
                        !field.value && "text-muted-foreground",
                        errors.dreamsAchievementDate ? 'border-destructive focus:border-destructive' : 'focus:border-primary'
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

          {/* Dream Selection Grid */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground/90 block text-center">Selecione seus 3 maiores sonhos:</label>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {dreamOptions.map((dream) => {
                const isSelected = selectedDreamsInternal.some(d => d.id === dream.id);
                const canSelectMore = selectedDreamsInternal.length < 3;
                return (
                  <button
                    key={dream.id}
                    type="button"
                    onClick={() => handleDreamSelection(dream)}
                    className={cn(
                      "relative flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl border-2 transition-all duration-200 ease-in-out aspect-square focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-card focus:ring-accent",
                      isSelected 
                        ? 'border-accent bg-accent/20 shadow-lg scale-105 animate-pulse-once' 
                        : 'border-border bg-background/50 hover:border-primary/70 hover:bg-primary/10',
                      !isSelected && !canSelectMore && 'opacity-50 cursor-not-allowed'
                    )}
                    disabled={!isSelected && !canSelectMore && selectedDreamsInternal.length >=3}
                    aria-pressed={isSelected}
                  >
                    {isSelected && <CheckCircle2 className="absolute top-1.5 right-1.5 h-5 w-5 text-accent animate-pop-in" />}
                    <dream.icon className={cn("h-7 w-7 sm:h-8 sm:w-8 mb-1.5", isSelected ? "text-accent" : "text-primary/70")} />
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

          {/* Submit Button */}
          <Button 
            type="submit" 
            disabled={!isValid || isSubmitting || selectedDreamsInternal.length !== 3}
            className="w-full goddess-gradient text-primary-foreground text-base sm:text-lg font-semibold py-3 rounded-lg shadow-xl hover:shadow-accent/40 transition-all duration-300 transform hover:scale-102 focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
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
      {/* Subtle background elements for app feel */}
      <div className="absolute top-10 left-5 w-16 h-16 bg-primary/5 rounded-full -z-10 animate-float opacity-50 [animation-duration:8s]"></div>
      <div className="absolute bottom-10 right-5 w-24 h-24 bg-accent/5 rounded-full -z-10 animate-float opacity-50 [animation-duration:10s] [animation-delay:2s]"></div>
    </div>
  );
};

