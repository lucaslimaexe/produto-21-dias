
"use client";

import React, { useState } from 'react';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, DollarSign, Home, Plane, Car, Users, Briefcase, Brain, HeartHandshake, HelpCircle, Award, Sparkles, Target, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const dreamOptions = [
  { id: 'financial_freedom', label: 'Liberdade Financeira', icon: DollarSign },
  { id: 'dream_house', label: 'Mansão dos Sonhos', icon: Home },
  { id: 'travel_world', label: 'Viver Viajando', icon: Plane },
  { id: 'new_car', label: 'Carro Novo', icon: Car },
  { id: 'soul_mate', label: 'Encontrar Alma Gêmea', icon: HeartHandshake },
  { id: 'successful_business', label: 'Negócio de Sucesso', icon: Briefcase },
  { id: 'inner_peace', label: 'Paz Interior', icon: Brain }, 
  { id: 'health_wellness', label: 'Saúde e Bem-estar', icon: Award }, 
  { id: 'happy_family', label: 'Família Feliz', icon: Users },
  { id: 'help_others', label: 'Ajudar o Mundo', icon: HelpCircle }, 
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
  fullName: z.string().min(3, { message: "Nome completo deve ter pelo menos 3 caracteres." }),
  selectedDreams: z.array(z.object({
    id: z.string(),
    label: z.string(),
    icon: z.any(),
  })).length(3, { message: "Você deve selecionar exatamente 3 sonhos." }),
  dreamsAchievementDate: z.date({ required_error: "Data para realizar os sonhos é obrigatória." }),
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
          title: "Limite de Sonhos Atingido",
          description: "Você já selecionou 3 sonhos.",
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
    console.log("Form data submitted:", data);
    onSubmitForm(data);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-background via-primary/10 to-background text-foreground">
      <div className="w-full max-w-2xl bg-card/80 backdrop-blur-md border border-border shadow-2xl rounded-3xl p-6 sm:p-8 md:p-10">
        <div className="text-center mb-8">
          <Sparkles className="h-12 w-12 text-accent mx-auto mb-3" />
          <h1 className="font-headline text-3xl md:text-4xl font-bold goddess-text-gradient mb-2">Prepare Seu Caminho</h1>
          <p className="text-muted-foreground text-lg">Para entendermos seus bloqueios, precisamos conhecer você, seus maiores desejos e quando você quer realizá-los.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-foreground mb-1">Nome Completo</label>
            <Controller
              name="fullName"
              control={control}
              render={({ field }) => <Input id="fullName" placeholder="Seu nome completo" {...field} className={cn(errors.fullName ? 'border-destructive' : '')} />}
            />
            {errors.fullName && <p className="text-destructive text-xs mt-1">{errors.fullName.message}</p>}
          </div>
          
          <div>
            <label htmlFor="dreamsAchievementDate" className="block text-sm font-medium text-foreground mb-1">Quando você gostaria de manifestar estes sonhos?</label>
            <Controller
              name="dreamsAchievementDate"
              control={control}
              render={({ field }) => (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !field.value && "text-muted-foreground",
                        errors.dreamsAchievementDate ? 'border-destructive' : ''
                      )}
                    >
                      <Target className="mr-2 h-4 w-4 text-accent" />
                      {field.value ? format(field.value, "PPP", { locale: ptBR }) : <span>Escolha a data alvo</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
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
            {errors.dreamsAchievementDate && <p className="text-destructive text-xs mt-1">{errors.dreamsAchievementDate.message}</p>}
          </div>


          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Selecione seus 3 Maiores Sonhos Atuais</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {dreamOptions.map((dream) => {
                const isSelected = selectedDreamsInternal.some(d => d.id === dream.id);
                return (
                  <Button
                    key={dream.id}
                    type="button"
                    variant={isSelected ? "default" : "outline"}
                    onClick={() => handleDreamSelection(dream)}
                    className={cn(
                      "flex flex-col items-center justify-center h-24 sm:h-28 p-2 text-center transition-all duration-200",
                      isSelected ? 'bg-gradient-to-r from-accent to-yellow-600 text-accent-foreground border-transparent ring-2 ring-yellow-300 shadow-lg scale-105' : 'bg-primary/10 border-primary/30 hover:bg-primary/20 hover:border-primary/50',
                      selectedDreamsInternal.length >= 3 && !isSelected ? 'opacity-60 cursor-not-allowed' : ''
                    )}
                    disabled={selectedDreamsInternal.length >= 3 && !isSelected}
                  >
                    <dream.icon className={cn("h-7 w-7 sm:h-8 sm:w-8 mb-1.5", isSelected ? "text-white" : "text-primary/80")} />
                    <span className="text-xs sm:text-sm leading-tight">{dream.label}</span>
                  </Button>
                );
              })}
            </div>
            {errors.selectedDreams && <p className="text-destructive text-xs mt-2">{errors.selectedDreams.message}</p>}
             <p className="text-muted-foreground text-xs mt-2 text-center">
              Selecionados: {selectedDreamsInternal.length} de 3.
            </p>
          </div>

          <Button 
            type="submit" 
            disabled={!isValid || isSubmitting || selectedDreamsInternal.length !== 3}
            className="w-full goddess-gradient text-primary-foreground text-lg font-semibold py-3 rounded-lg pulse-goddess hover:scale-102 transition-all duration-300 shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-5 w-5" />
                Continuar para o Diagnóstico
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};
    
