import { supabase } from '@/lib/supabase/client';
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  try {
    const { materialId } = await req.json();
    if (!materialId) return new Response('Missing materialId', { status: 400 });

    const { data: material } = await supabase
      .from('materials')
      .select('*')
      .eq('id', materialId)
      .single();

    if (!material) return new Response('Material not found', { status: 404 });

    const prompt = `Kamu adalah seorang asisten akademik yang sedang menjelaskan materi kepada seorang pelajar. Tugasmu adalah membuat penjelasan naratif yang rapi, mengalir seperti cerita, padat, dan mudah dipahami secara mendalam layaknya penjelasan manusia.

ATURAN KETAT:
- JANGAN gunakan format list, daftar berpoin (bullet points/bullet/simbol "-"), angka berderet, atau sejenisnya. SELURUH PENJELASAN HARUS dalam bentuk paragraf yang mengalir (naratif).
- JANGAN gunakan emoji, ikon, atau simbol dekoratif apapun.
- JANGAN menambahkan basa-basi, saran, atau pesan pribadi di awal/akhir teks.
- Gunakan format Markdown HANYA untuk **teks tebal** (pada istilah penting) dan heading (## atau ###) untuk memisahkan topik besar jika materinya panjang.
- Susun penjelasan secara berurutan sesuai alur dokumen asli.
- Akhiri dengan bagian "## Kesimpulan" yang berisi satu atau dua paragraf ringkasan dari seluruh materi.

Dokumen yang harus dirangkum:
${material.extracted_text}`;

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: 'Kamu adalah asisten akademik. Kamu hanya menjawab dengan rangkuman materi tanpa basa-basi, tanpa emoji, dan tanpa komentar tambahan.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.15,
      stream: true,
    });

    const stream = new ReadableStream({
      async start(controller) {
        let fullText = '';
        try {
          for await (const chunk of completion) {
            const content = chunk.choices[0]?.delta?.content || '';
            fullText += content;
            controller.enqueue(new TextEncoder().encode(content));
          }
        } catch (err) {
          console.error("Stream parsing error:", err);
        }

        // Save summary to database when finished
        // Strip any residual <think> tags before saving
        try {
          const cleanText = fullText
            .replace(/<think>[\s\S]*?<\/think>/g, '')
            .replace(/<think>[\s\S]*$/, '')
            .trim();

          await supabase
            .from('material_summaries')
            .insert({
              material_id: materialId,
              summary_json: { text: cleanText || fullText },
            });
          
          await supabase
            .from('materials')
            .update({ status: 'summarized' })
            .eq('id', materialId);
        } catch (dbErr) {
          console.error("Failed to save summary:", dbErr);
        }

        controller.close();
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error: any) {
    console.error("Streaming error:", error);
    return new Response(error.message, { status: 500 });
  }
}
