
"use client";

import React, { useState, useEffect } from 'react';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Gem, Castle, Plane, Car, Users, Briefcase, MountainSnow, Award, Sparkles, Target, User, Loader2, CheckCircle2, Palette, Lightbulb, HeartHandshake, HelpCircle } from 'lucide-react';
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
  fullName: z.string().min(3, { message: "Seu nome completo, por favor." }),
  selectedDreams: z.array(z.object({
    id: z.string(),
    label: z.string(),
    icon: z.any(),
    iconColorClass: z.string(),
  })).length(3, {message: "Selecione exatamente 3 sonhos." }),
  dreamsAchievementDate: z.date({ required_error: "Quando você quer realizar seus sonhos?" }),
});

interface PreQuestionnaireFormScreenProps {
  onSubmitForm: (data: PreQuestionnaireFormData) => void;
}

export const PreQuestionnaireFormScreen: React.FC<PreQuestionnaireFormScreenProps> = ({ onSubmitForm }) => {
  const [selectedDreamsInternal, setSelectedDreamsInternal] = useState<DreamOption[]>([]);
  const { toast } = useToast();
  const [isProcessingSubmit, setIsProcessingSubmit] = useState(false);

  const { control, handleSubmit, setValue, watch, formState: { errors, isValid, touchedFields }, getValues } = useForm<PreQuestionnaireFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      selectedDreams: [],
    },
    mode: 'onChange', // Valida em cada mudança para `isValid` ser atualizado
  });

  const watchedFullName = watch('fullName');
  const watchedDreamsAchievementDate = watch('dreamsAchievementDate');
  const watchedSelectedDreams = watch('selectedDreams');

  useEffect(() => {
    const requiredFieldsTouched = touchedFields.fullName && touchedFields.dreamsAchievementDate;
    if (watchedSelectedDreams.length === 3 && isValid && requiredFieldsTouched && !isProcessingSubmit) {
      setIsProcessingSubmit(true);
      toast({
        title: "Preparando seu diagnóstico...",
        description: "Você será redirecionada em instantes.",
        duration: 2000,
      });
      setTimeout(() => {
        onSubmitForm(getValues());
      }, 1500); // Delay para o usuário ver a mensagem e a seleção final
    }
  }, [watchedSelectedDreams, isValid, touchedFields, onSubmitForm, getValues, toast, isProcessingSubmit, watchedFullName, watchedDreamsAchievementDate]);


  const handleDreamSelection = (dream: DreamOption) => {
    if (isProcessingSubmit) return;

    const currentIndex = selectedDreamsInternal.findIndex(d => d.id === dream.id);
    let newSelectedDreams: DreamOption[];

    if (currentIndex === -1) { // Se não está selecionado, tenta adicionar
      if (selectedDreamsInternal.length < 3) {
        newSelectedDreams = [...selectedDreamsInternal, dream];
      } else {
        // Se já tem 3, não faz nada ou substitui o mais antigo (aqui não faz nada)
        toast({
          title: "Limite Atingido",
          description: "Você já selecionou 3 sonhos. Desmarque um para escolher outro.",
          variant: "default",
          duration: 3000,
        });
        return;
      }
    } else { // Se está selecionado, remove
      newSelectedDreams = selectedDreamsInternal.filter(d => d.id !== dream.id);
    }
    setSelectedDreamsInternal(newSelectedDreams);
    setValue('selectedDreams', newSelectedDreams, { shouldValidate: true });
  };


  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-background via-primary/20 to-background text-foreground font-body">
      <div className="w-full max-w-md bg-card/90 backdrop-blur-xl border border-border/60 shadow-2xl shadow-primary/25 rounded-2xl p-6 sm:p-8 space-y-6 animate-fade-in">

        <header className="text-center">
          <Sparkles className="h-10 w-10 sm:h-12 sm:w-12 text-accent mx-auto mb-2 animate-float [animation-duration:3s]" />
          <h1 className="font-headline text-2xl sm:text-3xl font-bold goddess-text-gradient">Comece Sua Jornada</h1>
          <p className="text-muted-foreground text-sm sm:text-base">Conte-nos um pouco sobre você e seus sonhos.</p>
        </header>

        <form className="space-y-6">
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
                  disabled={isProcessingSubmit}
                />
              )}
            />
            {errors.fullName && <p className="text-destructive text-xs pt-1">{errors.fullName.message}</p>}
          </div>

          <div className="space-y-1">
            <label htmlFor="dreamsAchievementDate" className="text-sm font-medium text-foreground/90 flex items-center">
               <Target className="h-4 w-4 mr-2 text-primary/80" /> Quando seus sonhos se realizarão?
            </label>
            <Controller
              name="dreamsAchievementDate"
              control={control}
              render={({ field }) => (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      disabled={isProcessingSubmit}
                      className={cn(
                        "w-full justify-start text-left font-normal bg-input/70 border-border hover:bg-muted/50 focus:border-primary focus:shadow-md focus:shadow-primary/30",
                        !field.value && "text-muted-foreground",
                        errors.dreamsAchievementDate ? 'border-destructive focus:border-destructive' : ''
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-accent" />
                      {field.value ? format(field.value, "PPP", { locale: ptBR }) : <span>Escolha uma data</span>}
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
                      fromDate={new Date()} // Só permite datas futuras
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
            <label className="text-sm font-medium text-foreground/90 block text-center">Selecione 3 sonhos que mais pulsam em seu coração:</label>
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
                      "relative flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl border-2 transition-all duration-200 ease-in-out aspect-square focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-card focus:ring-accent hover:shadow-lg",
                      isSelected
                        ? 'border-accent bg-accent/20 shadow-xl shadow-accent/40 scale-105 animate-pulse-once hover:shadow-accent/50'
                        : 'border-border bg-background/50 hover:border-primary/70 hover:bg-primary/10 hover:shadow-primary/30',
                      !isSelected && selectedDreamsInternal.length >= 3 && 'opacity-50 cursor-not-allowed brightness-75'
                    )}
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

          {isProcessingSubmit && (
            <div className="flex flex-col items-center justify-center pt-4">
              <Loader2 className="h-8 w-8 text-primary animate-spin mb-2" />
              <p className="text-sm text-primary">Aguarde, estamos preparando tudo...</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

    