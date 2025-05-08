'use server';

/**
 * @fileOverview Dynamically adjusts math problem difficulty based on student performance.
 *
 * - adjustDifficulty - A function that adjusts the difficulty of math problems.
 * - AdjustDifficultyInput - The input type for the adjustDifficulty function.
 * - AdjustDifficultyOutput - The return type for the adjustDifficulty function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AdjustDifficultyInputSchema = z.object({
  studentPerformance: z
    .number()
    .describe(
      'Student performance represented as a percentage (e.g., 0.85 for 85%).'
    ),
  currentDifficulty: z
    .enum(['beginner', 'intermediate', 'advanced'])
    .describe('The current difficulty level of the math problems.'),
});
export type AdjustDifficultyInput = z.infer<typeof AdjustDifficultyInputSchema>;

const AdjustDifficultyOutputSchema = z.object({
  newDifficulty: z
    .enum(['beginner', 'intermediate', 'advanced'])
    .describe('The recommended new difficulty level.'),
  reason: z
    .string()
    .describe('Explanation of why the difficulty level was adjusted.'),
});
export type AdjustDifficultyOutput = z.infer<typeof AdjustDifficultyOutputSchema>;

export async function adjustDifficulty(input: AdjustDifficultyInput): Promise<AdjustDifficultyOutput> {
  return adjustDifficultyFlow(input);
}

const adjustDifficultyPrompt = ai.definePrompt({
  name: 'adjustDifficultyPrompt',
  input: {schema: AdjustDifficultyInputSchema},
  output: {schema: AdjustDifficultyOutputSchema},
  prompt: `You are an AI math tutor who adjusts the difficulty of math problems
based on a student's performance.  The student's performance is represented
as a percentage.  The current difficulty level is one of "beginner",
"intermediate", or "advanced".  Recommend a new difficulty level and
explain your reasoning.

Student Performance: {{{studentPerformance}}}
Current Difficulty: {{{currentDifficulty}}}
`,
});

const adjustDifficultyFlow = ai.defineFlow(
  {
    name: 'adjustDifficultyFlow',
    inputSchema: AdjustDifficultyInputSchema,
    outputSchema: AdjustDifficultyOutputSchema,
  },
  async input => {
    const {output} = await adjustDifficultyPrompt(input);
    return output!;
  }
);
