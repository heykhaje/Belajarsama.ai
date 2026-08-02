import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function test() {
  const models = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-2.0-flash-exp', 'gemini-1.5-flash-8b', 'gemini-1.0-pro'];
  for (const model of models) {
    try {
      console.log(`Testing ${model}...`);
      const response = await ai.models.generateContent({
        model: model,
        contents: 'test',
      });
      console.log(`SUCCESS: ${model}`);
    } catch (e: any) {
      console.error(`FAILED: ${model} - ${e.message}`);
    }
  }
}

test();
