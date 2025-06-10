
/**
 * @fileOverview Defines types for behavioral analysis input and output based on questionnaire answers.
 * These types are used for local rule-based analysis.
 *
 * - BehavioralAnalysisInput - The input type for behavioral analysis (user's answers).
 * - BehavioralAnalysisOutput - The return type for behavioral analysis (archetype, summary, keywords, idealPercentage, missingForIdeal).
 */

import { z } from 'zod';

const AnswerSchema = z.object({
  questionId: z.number(),
  questionText: z.string(),
  answer: z.string(),
});

// Schema for the input (answers from the questionnaire)
const BehavioralAnalysisInputSchema = z.object({
  answers: z.array(AnswerSchema).describe("An array of questions and the user's answers to them."),
});
export type BehavioralAnalysisInput = z.infer<typeof BehavioralAnalysisInputSchema>;

// Schema for the output (archetype, summary, keywords, etc.)
const BehavioralAnalysisOutputSchema = z.object({
  archetype: z
    .string()
    .describe(
      "A concise behavioral archetype for the user based on their answers (e.g., 'Sonhadora Cautelosa', 'Buscadora Frustrada', 'Realista Determinada', 'Visionária Impaciente'). Limit to 2-3 words."
    ),
  summary: z
    .string()
    .describe(
      "A brief 2-3 sentence behavioral summary explaining the archetype, key insights, potential blockages, and core motivations related to manifestation. Address the user directly in the second person ('você'). This summary should be critical and focus on negative points."
    ),
  keywords: z.array(z.string()).describe("List 3-5 keywords that best describe the user's primary manifestation challenges or weaknesses (e.g., 'Dúvida', 'Procrastinação', 'Autoconfiança Baixa', 'Medo de Falhar', 'Falta de Clareza')."),
  idealPercentage: z.number().min(0).max(100).describe("Uma porcentagem (0-100) indicando quão perto a usuária está do seu 'ponto ideal' de manifestação. Valores mais baixos indicam maior distância."),
  missingForIdeal: z.string().describe("Uma breve descrição crítica do que falta para a usuária atingir seu ponto ideal, focando nos aspectos a serem trabalhados e nas deficiências atuais.")
});
export type BehavioralAnalysisOutput = z.infer<typeof BehavioralAnalysisOutputSchema>;
