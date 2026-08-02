import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateQuiz(text: string) {
  const prompt = `Kamu adalah seorang dosen yang ahli membuat soal ujian berkualitas. Berdasarkan HANYA isi teks dokumen di bawah ini, buat 20 soal pilihan ganda.

ATURAN KETAT:
- Semua soal HARUS berdasarkan isi dokumen yang diberikan. JANGAN membuat soal tentang topik lain.
- Setiap soal punya tepat 4 opsi jawaban, dengan 1 jawaban yang benar.
- Buat penjelasan singkat dan logis untuk setiap jawaban benar.
- Gunakan bahasa yang sama dengan bahasa dokumen.
- Soal harus menguji pemahaman konsep, tidak ambigu, dan tidak membingungkan.

Output HARUS murni JSON object (tanpa blok markdown atau tag) dengan skema:
{
  "questions": [
    {
      "question": "pertanyaan berdasarkan isi dokumen",
      "options": ["opsi A", "opsi B", "opsi C", "opsi D"],
      "correctAnswer": 0,
      "explanation": "penjelasan mengapa jawaban ini benar berdasarkan dokumen"
    }
  ]
}

Teks Dokumen:
${text}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.2, // Rendahkan temperature agar tidak berhalusinasi
      }
    });

    const outputText = response.text || '{"questions": []}';
    const parsed = JSON.parse(outputText);
    return parsed.questions || parsed; // Handle array vs object fallback
  } catch (error: any) {
    console.error("Error generating quiz with Gemini:", error);
    throw new Error("Gagal membuat kuis dengan Gemini AI: " + error.message);
  }
}
