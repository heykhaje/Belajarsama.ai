import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    const { text, targetLang } = await req.json();
    if (!text) return new Response('Missing text', { status: 400 });

    const langInstruction = targetLang === 'en' 
      ? 'Translate the entire text below into English. Every single sentence must be in English. Do not leave any word in its original language.'
      : 'Terjemahkan seluruh teks di bawah ini ke dalam Bahasa Indonesia. Setiap kalimat harus dalam Bahasa Indonesia. Jangan sisakan kata apapun dalam bahasa aslinya.';

    const systemPrompt = targetLang === 'en' 
      ? 'You are a professional translator. You translate text completely into English. You never mix languages. You preserve Markdown formatting. You do not add any commentary or notes.'
      : 'Kamu adalah penerjemah profesional. Kamu menerjemahkan teks sepenuhnya ke Bahasa Indonesia. Kamu tidak pernah mencampur bahasa. Kamu mempertahankan format Markdown. Kamu tidak menambahkan komentar atau catatan apapun.';

    const prompt = `${systemPrompt}\n\n${langInstruction}\n\nPreserve all Markdown formatting exactly (##, ###, -, **bold**). Only output the translated text, nothing else.\n\nText:\n${text}`;

    const responseStream = await ai.models.generateContentStream({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        temperature: 0.1
      }
    });

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of responseStream) {
            if (chunk.text) {
              controller.enqueue(new TextEncoder().encode(chunk.text));
            }
          }
        } catch (err) {
          console.error("Translation stream error:", err);
        }
        controller.close();
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
      },
    });
  } catch (error: any) {
    console.error('Translation error:', error);
    return new Response(error.message || 'Translation failed', { status: 500 });
  }
}
