import { supabase } from '@/lib/supabase/client';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    const { messages, materialId } = await req.json();
    if (!messages || !materialId) return new Response('Missing parameters', { status: 400 });

    const { data: material } = await supabase
      .from('materials')
      .select('title, extracted_text')
      .eq('id', materialId)
      .single();

    if (!material) return new Response('Material not found', { status: 404 });

    const systemInstruction = `Kamu adalah Asisten AI "Belajarsama.ai". Tugasmu adalah menjawab pertanyaan pengguna secara ringkas, ramah, dan solutif, berdasarkan HANYA pada konteks materi berikut ini.
Jika pengguna bertanya tentang hal di luar materi ini, arahkan mereka kembali ke konteks materi dengan sopan. Jawablah menggunakan bahasa yang mudah dipahami.
Gunakan format Markdown tebal (**) untuk menekankan kata kunci penting. JANGAN PERNAH menyarankan untuk membaca dokumen lain.

Konteks Materi (${material.title}):
${material.extracted_text}`;

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
