import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function generateQuiz(text: string) {
  const prompt = `Kamu adalah seorang dosen yang membuat soal ujian. Berdasarkan HANYA isi teks dokumen di bawah ini, buat 20 soal pilihan ganda.
Soal harus menguji pemahaman konsep, bukan sekadar hafalan. 
Output HARUS murni JSON object valid (tanpa markdown) dengan format berikut:
{
  "questions": [
    {
      "question": "Pertanyaan...",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": 0,
      "explanation": "Penjelasan mengapa jawaban tersebut benar"
    }
  ]
}

Teks Dokumen:
${text}`;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      response_format: { type: 'json_object' },
      temperature: 0.2, // Low temperature for more deterministic output
    });

    const outputText = chatCompletion.choices[0]?.message?.content || '{"questions": []}';
    const parsed = JSON.parse(outputText);
    return parsed.questions || parsed; // fallback to parsed if somehow it still returns an array
  } catch (error: any) {
    console.error("Error generating quiz with Groq:", error);
    throw new Error("Gagal membuat kuis dengan Groq: " + error.message);
  }
}
