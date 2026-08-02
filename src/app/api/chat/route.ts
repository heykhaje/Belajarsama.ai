import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    if (!messages) return new Response('Missing parameters', { status: 400 });

    const systemInstruction = `Kamu adalah Asisten AI "Belajarsama.ai". Tugasmu adalah membantu pengguna yang sedang menggunakan website Belajarsama.ai. Kamu dapat menjelaskan fitur-fitur website, memandu pengguna, atau berdiskusi dan mengajarkan materi pelajaran apa saja yang ditanyakan oleh pengguna secara ringkas, ramah, dan solutif.
Jawablah menggunakan bahasa yang mudah dipahami.
Gunakan format Markdown tebal (**) untuk menekankan kata kunci penting.`;

    let prompt = `${systemInstruction}\n\n`;
    for (const msg of messages) {
      const roleName = msg.role === 'user' ? 'User' : 'AI';
      prompt += `${roleName}: ${msg.content}\n\n`;
    }
    prompt += `AI: `; 

    const responseStream = await ai.models.generateContentStream({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        temperature: 0.3
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
          console.error("Chat stream error:", err);
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
    console.error('Chat error:', error);
    return new Response(error.message || 'Chat failed', { status: 500 });
  }
}
