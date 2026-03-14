'use server';
/**
 * @fileOverview This file provides a Genkit flow for converting Malayalam speech to text.
 *
 * - malayalamSpeechToText - A function that handles the speech-to-text conversion for Malayalam audio.
 * - MalayalamSpeechToTextInput - The input type for the malayalamSpeechToText function.
 * - MalayalamSpeechToTextOutput - The return type for the malayalamSpeechToText function.
 */

import {ai} from '../genkit';
import {z} from 'genkit';

const MalayalamSpeechToTextInputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      "Audio input in Malayalam, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type MalayalamSpeechToTextInput = z.infer<typeof MalayalamSpeechToTextInputSchema>;

const MalayalamSpeechToTextOutputSchema = z.object({
  recognizedText: z.string().describe('The recognized text from the audio input.'),
});
export type MalayalamSpeechToTextOutput = z.infer<typeof MalayalamSpeechToTextOutputSchema>;

export async function malayalamSpeechToText(
  input: MalayalamSpeechToTextInput
): Promise<MalayalamSpeechToTextOutput> {
  return malayalamSpeechToTextFlow(input);
}

const malayalamSpeechToTextPrompt = ai.definePrompt({
  name: 'malayalamSpeechToTextPrompt',
  input: {schema: MalayalamSpeechToTextInputSchema},
  output: {schema: MalayalamSpeechToTextOutputSchema},
  prompt: `You are an expert at transcribing Malayalam audio. Listen to the provided audio and transcribe it exactly as spoken into Malayalam text. 
Ensure the output is ONLY the transcribed Malayalam text, without any additional commentary, formatting, or translation.
Language: Malayalam
{{media url=audioDataUri}}`,
});

const malayalamSpeechToTextFlow = ai.defineFlow(
  {
    name: 'malayalamSpeechToTextFlow',
    inputSchema: MalayalamSpeechToTextInputSchema,
    outputSchema: MalayalamSpeechToTextOutputSchema,
  },
  async input => {
    const {output} = await malayalamSpeechToTextPrompt(input);

    if (!output) {
      throw new Error('Failed to transcribe audio.');
    }
    return output;
  }
);
