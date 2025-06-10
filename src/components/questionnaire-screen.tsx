
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Sparkles, Send } from 'lucide-react';

const questionsData = [
  {
    id: 'q1',
    text: "Com que frequência você visualiza seus objetivos como se já fossem realidade?",
    options: ["Raramente ou nunca", "Às vezes, quando lembro", "Frequentemente, algumas vezes por semana", "Diariamente, é parte da minha rotina"],
  },
  {
    id: 'q2',
    text: "Ao enfrentar um obstáculo, qual sua reação mais comum?",
    options: ["Desanimo e penso em desistir", "Sinto-me frustrado(a), mas busco alternativas", "Vejo como um desafio e aprendizado", "Tenho fé que vou superar e sigo em frente"],
  },
  {
    id: 'q3',
    text: "Quão conectado(a) você se sente com sua intuição ou 'voz interior'?",
    options: ["Pouco conectado(a), raramente a percebo", "Às vezes a escuto, mas duvido", "Sinto uma conexão, mas nem sempre confio", "Estou muito conectado(a) e confio nela"],
  },
  {
    id: 'q4',
    text: "Você pratica a gratidão pelas coisas que já tem em sua vida?",
    options: ["Raramente penso nisso", "Às vezes, quando algo muito bom acontece", "Frequentemente, tento ser grato(a)", "Diariamente, a gratidão é um pilar para mim"],
  },
];

const formSchema = z.object(
  questionsData.reduce((acc, q) => {
    acc[q.id] = z.string().min(1, { message: "Por favor, selecione uma opção." });
    return acc;
  }, {} as Record<string, z.ZodString>)
);

type QuestionnaireFormValues = z.infer<typeof formSchema>;

export const QuestionnaireScreen: React.FC = () => {
  const router = useRouter();
  const form = useForm<QuestionnaireFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: questionsData.reduce((acc, q) => {
      acc[q.id] = "";
      return acc;
    }, {} as Record<string, string>),
  });

  const onSubmit = (data: QuestionnaireFormValues) => {
    // In a real app, you'd send this data to your Genkit flow
    console.log('Questionnaire Answers:', data);
    router.push('/analysis');
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative bg-gradient-to-br from-primary via-indigo-800 to-background overflow-hidden">
       <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-24 h-24 md:w-32 md:h-32 bg-primary/20 rounded-full animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-16 h-16 md:w-24 md:h-24 bg-accent/20 rounded-full animate-pulse [animation-delay:1s]"></div>
      </div>
      <Card className="w-full max-w-3xl bg-background/80 backdrop-blur-md border-2 border-primary shadow-2xl">
        <CardHeader className="p-6 sm:p-8 text-center">
          <Sparkles className="w-12 h-12 text-accent mx-auto mb-3" />
          <CardTitle className="font-headline text-2xl sm:text-3xl md:text-4xl font-bold text-transparent bg-clip-text goddess-gradient">
            Questionário de Autoconhecimento
          </CardTitle>
          <CardDescription className="text-md sm:text-lg text-foreground/80 pt-2">
            Responda com sinceridade para uma análise precisa do seu potencial.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 sm:p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {questionsData.map((question, index) => (
                <FormField
                  key={question.id}
                  control={form.control}
                  name={question.id as keyof QuestionnaireFormValues}
                  render={({ field }) => (
                    <FormItem className="space-y-3 p-4 bg-card/50 rounded-lg border border-border">
                      <FormLabel className="text-base sm:text-lg font-semibold text-foreground">
                        {index + 1}. {question.text}
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-2"
                        >
                          {question.options.map((option, optIndex) => (
                            <FormItem key={optIndex} className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value={option} id={`${question.id}-${optIndex}`} />
                              </FormControl>
                              <Label htmlFor={`${question.id}-${optIndex}`} className="font-normal text-foreground/90 text-sm sm:text-base">
                                {option}
                              </Label>
                            </FormItem>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
              <Button 
                type="submit" 
                className="w-full font-headline text-lg sm:text-xl px-8 sm:px-12 py-6 sm:py-7 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-200"
                size="lg"
                disabled={form.formState.isSubmitting}
              >
                <Send className="mr-2 h-5 w-5" />
                Analisar meu Potencial
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
