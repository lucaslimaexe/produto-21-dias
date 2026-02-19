"use client";

import React, { useState, useEffect } from "react";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  User,
  Loader2,
  CalendarDays,
  Gem,
  Castle,
  Plane,
  Car,
  Heart,
  Briefcase,
  Brain,
  Leaf,
  GraduationCap,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { useGamification } from "@/components/gamification";

// Baseado em pesquisas FGV, Instituto Locomotiva, Vox Populi (2024-2025):
// Top desejos: liberdade financeira (90%), casa própria, carro, saúde (90%),
// amor (24%), educação (52%), negócio (33%), emprego (38%), viagem, paz interior,
// qualidade de vida, tempo com família (79-85%)
export const dreamOptions = [
  {
    id: "financial_freedom",
    label: "Liberdade Financeira",
    imageUrl:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&q=80",
    imageAlt: "Abundância financeira e liberdade",
    dataAiHint: "money success",
    icon: Gem,
    iconColorClass: "text-emerald-400",
  },
  {
    id: "dream_house",
    label: "Casa Própria",
    imageUrl:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80",
    imageAlt: "Casa dos sonhos",
    dataAiHint: "dream house",
    icon: Castle,
    iconColorClass: "text-blue-400",
  },
  {
    id: "travel_world",
    label: "Viajar o Mundo",
    imageUrl:
      "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&q=80",
    imageAlt: "Viagem e aventura pelo mundo",
    dataAiHint: "travel world",
    icon: Plane,
    iconColorClass: "text-sky-400",
  },
  {
    id: "new_car",
    label: "Carro dos Sonhos",
    imageUrl:
      "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&q=80",
    imageAlt: "Carro novo dos sonhos",
    dataAiHint: "dream car",
    icon: Car,
    iconColorClass: "text-red-400",
  },
  {
    id: "soul_mate",
    label: "Alma Gêmea",
    imageUrl:
      "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600&q=80",
    imageAlt: "Amor verdadeiro e relacionamento",
    dataAiHint: "soul mate love",
    icon: Heart,
    iconColorClass: "text-pink-400",
  },
  {
    id: "successful_business",
    label: "Negócio Próprio",
    imageUrl:
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=600&q=80",
    imageAlt: "Empreender e ter negócio de sucesso",
    dataAiHint: "business success",
    icon: Briefcase,
    iconColorClass: "text-amber-500",
  },
  {
    id: "inner_peace",
    label: "Paz Interior",
    imageUrl:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&q=80",
    imageAlt: "Meditação e equilíbrio interior",
    dataAiHint: "inner peace",
    icon: Brain,
    iconColorClass: "text-purple-400",
  },
  {
    id: "health_wellness",
    label: "Saúde e Bem-Estar",
    imageUrl:
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80",
    imageAlt: "Vida saudável e disposição",
    dataAiHint: "health wellness",
    icon: Leaf,
    iconColorClass: "text-green-400",
  },
  {
    id: "family_time",
    label: "Tempo com Quem Ama",
    imageUrl:
      "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=600&q=80",
    imageAlt: "Família e momentos especiais",
    dataAiHint: "family time",
    icon: Users,
    iconColorClass: "text-orange-400",
  },
  {
    id: "dream_career",
    label: "Carreira dos Sonhos",
    imageUrl:
      "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=600&q=80",
    imageAlt: "Trabalho dos sonhos e realização profissional",
    dataAiHint: "dream career",
    icon: GraduationCap,
    iconColorClass: "text-teal-400",
  },
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
  { id: "end_of_year", label: "Final deste ano" },
  { id: "next_year", label: "Próximo ano" },
  { id: "two_years", label: "Em 2 anos" },
];

const formSchema = z.object({
  fullName: z
    .string()
    .min(3, { message: "Precisamos de um nome com pelo menos 3 letras." })
    .max(100, { message: "O nome parece muito longo." }),
  selectedDreams: z
    .array(z.custom<DreamOption>())
    .length(3, { message: "Escolha exatamente 3 sonhos." }),
  dreamsAchievementDate: z.string().min(1, {
    message: "Quando você quer realizar estes sonhos?",
  }),
});

interface PreQuestionnaireFormScreenProps {
  onSubmitForm: (data: PreQuestionnaireFormData) => void;
}

export const PreQuestionnaireFormScreen: React.FC<
  PreQuestionnaireFormScreenProps
> = ({ onSubmitForm }) => {
  const { toast } = useToast();
  const g = useGamification();
  const [isProcessingSubmit, setIsProcessingSubmit] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    getValues,
    trigger,
  } = useForm<PreQuestionnaireFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      selectedDreams: [],
      dreamsAchievementDate: "",
    },
    mode: "onChange",
  });

  const watchedSelectedDreams = watch("selectedDreams");
  const watchedFullName = watch("fullName");
  const watchedDreamsAchievementDate = watch("dreamsAchievementDate");

  const isNameComplete =
    watchedFullName.trim().length >= 3;
  const isDateSelected = !!watchedDreamsAchievementDate;

  useEffect(() => {
    if (watchedSelectedDreams.length !== 3 || isProcessingSubmit) return;

    const currentValues = getValues();

    if (!isNameComplete || errors.fullName) {
      toast({
        title: "Ops, falta seu nome!",
        description: "Preencha seu nome para continuar.",
        variant: "destructive",
        duration: 3500,
      });
      return;
    }
    if (!isDateSelected || errors.dreamsAchievementDate) {
      toast({
        title: "E a data dos sonhos?",
        description: "Defina quando seus sonhos se realizarão.",
        variant: "destructive",
        duration: 3500,
      });
      return;
    }

    trigger().then((isFormValid) => {
      if (isFormValid) {
        setIsProcessingSubmit(true);
        toast({
          title: "Analisando seus padrões...",
          description: "Calculando seu diagnóstico.",
          duration: 2000,
        });
        g?.completePreForm();
        setTimeout(() => onSubmitForm(currentValues), 1500);
      }
    });
  }, [
    watchedSelectedDreams,
    isProcessingSubmit,
    errors,
    onSubmitForm,
    getValues,
    toast,
    trigger,
    isNameComplete,
    isDateSelected,
  ]);

  // 3 rodadas: a cada rodada mostramos 3 opções, usuário escolhe 1
  const dreamGroups: DreamOption[][] = [
    dreamOptions.slice(0, 3),   // rodada 1
    dreamOptions.slice(3, 6),   // rodada 2
    dreamOptions.slice(6, 9),   // rodada 3
  ];
  const currentDreamOptions = dreamGroups[watchedSelectedDreams.length] ?? [];

  const handleDreamSelection = (dream: DreamOption) => {
    if (isProcessingSubmit) return;
    const currentSelected = getValues("selectedDreams");
    if (currentSelected.length >= 3) return;
    const newSelected = [...currentSelected, dream];
    setValue("selectedDreams", newSelected, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const handleDateSelection = (value: string) => {
    setValue("dreamsAchievementDate", value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const progressStep = isNameComplete ? (isDateSelected ? 3 : 2) : 1;

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      {/* Top bar - estilo TikTok */}
      <header className="sticky top-0 z-50 flex items-center justify-center h-14 border-b border-white/10 bg-black/95 backdrop-blur-md">
        <span className="font-headline font-semibold text-base tracking-tight">
          diagnóstico.da.deusa
        </span>
      </header>

      <main className="flex-1 overflow-y-auto pb-16">
        <div className="max-w-lg mx-auto px-4 py-6 sm:py-8 space-y-6 sm:space-y-8">
          {/* Progresso - reduz percepção de esforço */}
          <div className="flex gap-1.5">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={cn(
                  "flex-1 h-1 rounded-full transition-all duration-500",
                  step <= progressStep ? "bg-white" : "bg-white/20"
                )}
              />
            ))}
          </div>

          {/* Título - foco no benefício e urgência */}
          <div className="text-center space-y-2">
            <p className="text-accent/90 text-sm font-medium">
              {progressStep < 3 ? "passo " + progressStep + " de 3" : "último toque!"}
            </p>
            <h1 className="text-xl sm:text-2xl font-bold leading-tight">
              {progressStep === 1
                ? "a vida dos sonhos que você merece — o que está travando?"
                : progressStep === 2
                  ? "quando você EXIGE que isso aconteça?"
                  : "escolha 3. os que mais doem adiar."}
            </h1>
            <p className="text-white/50 text-sm">
              {progressStep === 1
                ? "vida de artista, abundância, liberdade. 3 toques e você descobre o que trava."
                : progressStep === 2
                  ? "seu cérebro precisa de data. defina o prazo."
                  : "arraste. toque nos 3 que você está CANSADA de adiar."}
            </p>
          </div>

          <form className="space-y-6">
            {/* Nome */}
            <div className={cn(!isNameComplete && "animate-fade-in")}>
              <Label className="text-white/90 text-sm font-medium mb-2 block">
                qual seu nome? (o universo precisa saber)
              </Label>
              <Controller
                name="fullName"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="só o primeiro nome"
                    disabled={isProcessingSubmit}
                    onBlur={() => trigger("fullName")}
                    className={cn(
                      "bg-white/5 border-white/20 text-white placeholder:text-white/40 rounded-2xl h-12 px-4",
                      "focus:border-white/50 focus:ring-white/20",
                      errors.fullName && "border-red-500/50"
                    )}
                  />
                )}
              />
              {errors.fullName && (
                <p className="text-red-400 text-xs mt-1">{errors.fullName.message}</p>
              )}
            </div>

            {/* Data */}
            {isNameComplete && (
              <div className="animate-fade-in">
                <Label className="text-white/90 text-sm font-medium mb-3 block">
                  quando você EXIGE que seus sonhos aconteçam?
                </Label>
                <Controller
                  name="dreamsAchievementDate"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup
                      onValueChange={(v) => {
                        field.onChange(v);
                        handleDateSelection(v);
                        trigger("dreamsAchievementDate");
                      }}
                      value={field.value}
                      className="flex flex-col gap-2"
                    >
                      {dateOptions.map((opt) => (
                        <label
                          key={opt.id}
                          htmlFor={opt.id}
                          className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-2xl border-2 cursor-pointer transition-all",
                            field.value === opt.id
                              ? "bg-white text-black border-white"
                              : "bg-white/5 border-white/20 hover:bg-white/10",
                            isProcessingSubmit && "opacity-60 cursor-not-allowed"
                          )}
                        >
                          <RadioGroupItem
                            value={opt.id}
                            id={opt.id}
                            className={field.value === opt.id ? "border-black" : ""}
                            disabled={isProcessingSubmit}
                          />
                          <span
                            className={cn(
                              "font-medium text-sm",
                              field.value === opt.id && "text-black"
                            )}
                          >
                            {opt.label}
                          </span>
                        </label>
                      ))}
                    </RadioGroup>
                  )}
                />
                {errors.dreamsAchievementDate && (
                  <p className="text-red-400 text-xs mt-1">
                    {errors.dreamsAchievementDate.message}
                  </p>
                )}
              </div>
            )}

            {/* Sonhos - 3 em 3, escolhe 1 por rodada, 3 rodadas = 3 selecionados */}
            {isNameComplete && isDateSelected && watchedSelectedDreams.length < 3 && (
              <div className="animate-fade-in">
                <Label className="text-white/90 text-sm font-medium mb-3 block text-center">
                  sonho {watchedSelectedDreams.length + 1} de 3 — qual desses 3 você está mais CANSADA de adiar?
                </Label>
                <p className="text-center text-white/40 text-xs mb-4">
                  escolha 1 dos 3
                </p>
                <div className="grid grid-cols-3 gap-3 sm:gap-4">
                  {currentDreamOptions.map((dream) => (
                    <button
                      key={dream.id}
                      type="button"
                      onClick={() => handleDreamSelection(dream)}
                      disabled={isProcessingSubmit}
                      className={cn(
                        "relative aspect-[3/4] rounded-2xl overflow-hidden border-2 transition-all",
                        "border-white/20 hover:border-white/50 active:scale-95",
                        isProcessingSubmit && "opacity-60"
                      )}
                    >
                      <Image
                        src={dream.imageUrl}
                        alt={dream.imageAlt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 33vw, 160px"
                      />
                      <div className="absolute inset-0 bg-black/50" />
                      <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3 bg-black/70">
                        <span className="text-xs sm:text-sm font-medium text-white line-clamp-2">
                          {dream.label}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
                <p className="text-center text-white/50 text-xs mt-3">
                  {watchedSelectedDreams.length} de 3 selecionados
                </p>
              </div>
            )}

            {/* Resumo dos 3 escolhidos - antes do submit */}
            {isNameComplete && isDateSelected && watchedSelectedDreams.length === 3 && !isProcessingSubmit && (
              <div className="animate-fade-in flex flex-wrap gap-2 justify-center">
                {watchedSelectedDreams.map((d) => (
                  <span
                    key={d.id}
                    className="px-3 py-1.5 rounded-full bg-white/10 text-white text-sm"
                  >
                    {d.label}
                  </span>
                ))}
              </div>
            )}

            {isProcessingSubmit && (
              <div className="flex flex-col items-center justify-center py-8 animate-fade-in">
                <Loader2 className="h-10 w-10 text-white animate-spin mb-3" />
                <p className="text-sm text-white/80">escaneando seus bloqueios...</p>
              </div>
            )}
          </form>
        </div>
      </main>

      {/* Bottom bar - handle + micro-cta quando incompleto */}
      <div className="fixed bottom-0 left-0 right-0 py-3 px-4 bg-gradient-to-t from-black via-black/95 to-transparent pointer-events-none">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <span className="text-white/40 text-xs">@diagnóstico.da.deusa</span>
          {!isProcessingSubmit && progressStep < 3 && (
            <span className="text-white/40 text-xs font-medium">
              você está a {4 - progressStep} toque{4 - progressStep > 1 ? "s" : ""} de descobrir
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
