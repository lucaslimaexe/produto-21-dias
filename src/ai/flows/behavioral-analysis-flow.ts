
'use server';
/**
 * @fileOverview A behavioral analysis AI agent based on questionnaire answers.
 *
 * - runBehavioralAnalysis - A function that processes questionnaire answers to provide a behavioral analysis.
 * - BehavioralAnalysisInput - The input type for the runBehavioralAnalysis function.
 * - BehavioralAnalysisOutput - The return type for the runBehavioralAnalysis function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const AnswerSchema = z.object({
  questionId: z.number(),
  questionText: z.string(),
  answer: z.string(),
});

const BehavioralAnalysisInputSchema = z.object({
  answers: z.array(AnswerSchema).describe("An array of questions and the user's answers to them."),
});
export type BehavioralAnalysisInput = z.infer<typeof BehavioralAnalysisInputSchema>;

const BehavioralAnalysisOutputSchema = z.object({
  archetype: z
    .string()
    .describe(
      "A concise behavioral archetype for the user based on their answers (e.g., 'Sonhadora Cautelosa', 'Buscadora Frustrada', 'Realista Determinada', 'Visionária Impaciente'). Limit to 2-3 words."
    ),
  summary: z
    .string()
    .describe(
      "A brief 2-3 sentence behavioral summary explaining the archetype, key insights, potential blockages, and core motivations related to manifestation. Address the user directly in the second person ('você')."
    ),
  keywords: z.array(z.string()).describe("List 3-5 keywords that best describe the user's primary manifestation challenges or strengths (e.g., 'Dúvida', 'Procrastinação', 'Autoconfiança', 'Medo de Falhar', 'Clareza de Propósito').")
});
export type BehavioralAnalysisOutput = z.infer<typeof BehavioralAnalysisOutputSchema>;

export async function runBehavioralAnalysis(
  input: BehavioralAnalysisInput
): Promise<BehavioralAnalysisOutput> {
  console.log('Running behavioral analysis with input:', JSON.stringify(input, null, 2));
  try {
    const result = await behavioralAnalysisFlow(input);
    console.log('Behavioral analysis successful with output:', JSON.stringify(result, null, 2));
    return result;
  } catch (error: any) {
    console.error('Error in runBehavioralAnalysis during external call to behavioralAnalysisFlow:', error);
    // Log additional details if available from the error object
    if (error.details) {
      console.error('Error details:', error.details);
    }
    if (error.stack) {
      console.error('Error stack:', error.stack);
    }
    throw new Error(`Behavioral analysis flow failed: ${error.message || 'Unknown error'}`);
  }
}

const behavioralAnalysisPrompt = ai.definePrompt({
  name: 'behavioralAnalysisPrompt',
  input: { schema: BehavioralAnalysisInputSchema },
  output: { schema: BehavioralAnalysisOutputSchema },
  prompt: `
    Você é uma especialista em análise comportamental com foco em PNL, coaching de manifestação e psicologia feminina.
    Sua tarefa é analisar as respostas do questionário fornecidas para identificar o perfil de manifestação da usuária.
    Com base nas respostas, determine um "arquétipo de manifestação" conciso para ela (ex: Sonhadora Cautelosa, Buscadora Frustrada, Cética Otimista).
    Em seguida, escreva um resumo de 2-3 frases que explique esse arquétipo, destacando seus principais padrões de pensamento, possíveis bloqueios energéticos ou mentais, e suas motivações centrais em relação aos seus desejos e manifestações. Use uma linguagem empática, direta e encorajadora, dirigindo-se à usuária como "você".
    Finalmente, liste de 3 a 5 palavras-chave que resumam os desafios ou forças primárias da usuária em relação à manifestação.

    Respostas do Questionário:
    {{#each answers}}
    Pergunta {{questionId}}: {{questionText}}
    Resposta: {{answer}}
    ---
    {{/each}}

    Analise cuidadosamente como as respostas se interconectam. Por exemplo, uma resposta sobre cansaço (Pergunta 1) combinada com a sensação de que a vida continua a mesma apesar dos esforços (Pergunta 2) pode indicar frustração e um possível ciclo de autossabotagem ou falta de alinhamento. Uma crença de não merecimento (Pergunta 4) é um bloqueio fundamental. A resposta à Pergunta 5 sobre coragem pode indicar o nível de prontidão para a mudança.

    Seja perspicaz e forneça uma análise que pareça genuinamente personalizada e reveladora para a usuária.
    O objetivo é que ela se sinta compreendida e curiosa sobre a solução que será apresentada (o "Código da Deusa").
  `,
  config: { // Adicionando configurações de segurança
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
    ],
  },
});

const behavioralAnalysisFlow = ai.defineFlow(
  {
    name: 'behavioralAnalysisFlow',
    inputSchema: BehavioralAnalysisInputSchema,
    outputSchema: BehavioralAnalysisOutputSchema,
  },
  async (input: BehavioralAnalysisInput) => {
    console.log('Entering behavioralAnalysisFlow with input:', JSON.stringify(input, null, 2));
    const response = await behavioralAnalysisPrompt(input);
    const output = response.output;

    if (!output) {
      console.error('Behavioral analysis: No parsed output from prompt.');
      console.error('Raw response text (if available):', response.text);
      if (response.candidates && response.candidates.length > 0) {
        response.candidates.forEach((candidate, index) => {
          console.error(`Candidate ${index} content:`, JSON.stringify(candidate.message.content, null, 2));
          console.error(`Candidate ${index} finish reason: ${candidate.finishReason}, message: ${candidate.finishMessage}`);
          if (candidate.safetyRatings) {
            console.error(`Candidate ${index} safety ratings:`, JSON.stringify(candidate.safetyRatings, null, 2));
          }
        });
      } else {
        console.error('No candidates found in the response. Full response object:', JSON.stringify(response, null, 2));
      }
      throw new Error('Behavioral analysis failed to produce a parsed output. Check server logs.');
    }
    console.log('Behavioral analysis flow successful, returning output:', JSON.stringify(output, null, 2));
    return output;
  }
);

