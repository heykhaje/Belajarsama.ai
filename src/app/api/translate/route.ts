import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  try {
    const { text, targetLang } = await req.json();
    if (!text) return new Response('Missing text', { status: 400 });

    const langInstruction = targetLang === 'en' 
      ? 'Translate the entire text below into English. Every single sentence must be in English. Do not leave any word in its original language.'
      : 'Terjemahkan seluruh teks di bawah ini ke dalam Bahasa Indonesia. Setiap kalimat harus dalam Bahasa Indonesia. Jangan sisakan kata apapun dalam bahasa aslinya.';

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { 
          role: 'system', 
          content: targetLang === 'en' 
            ? 'You are a professional translator. You translate text completely into English. You never mix languages. You preserve Markdown formatting. You do not add any commentary or notes.'
            : 'Kamu adalah penerjemah profesional. Kamu menerjemahkan teks sepenuhnya ke Bahasa Indonesia. Kamu tidak pernah mencampur bahasa. Kamu mempertahankan format Markdown. Kamu tidak menambahkan komentar atau catatan apapun.'
        },
        { 
          role: 'user', 
          content: `${langInstruction}

Preserve all Markdown formatting exactly (##, ###, -, **bold**). Only output the translated text, nothing else.

Text:
${text}` 
        }
      ],
      temperature: 0.1,
      stream: true,
    });

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of completion) {
            const content = chunk.choices[0]?.delta?.content || '';
            controller.enqueue(new TextEncoder().encode(content));
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
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error: any) {
    console.error("Translation error:", error);
    return new Response(error.message, { status: 500 });
  }
}
