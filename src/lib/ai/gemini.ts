import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateSummary(text: string) {
  const prompt = `Kamu adalah asisten belajar. Berdasarkan teks dokumen berikut, buat ringkasan poin-poin penting yang mudah dipelajari. Kelompokkan per bagian/bab jika dokumen panjang. Output HARUS JSON valid dengan format:
{
  "title": "Judul Materi",
  "sections": [{ "heading": "Nama Bab", "key_points": ["poin 1", "poin 2"] }],
  "overall_takeaways": ["kesimpulan 1", "kesimpulan 2"]
}

Teks Dokumen:
${text}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const text = response.text;
    return JSON.parse(text || '{}');
  } catch (error) {
    console.error("Error generating summary:", error);
    throw new Error("Gagal membuat ringkasan dengan Gemini.");
  }
}

export async function generateQuiz(text: string) {
  const prompt = `Berdasarkan teks dokumen berikut, buat 5-10 soal pilihan ganda untuk menguji pemahaman pengguna terhadap isi dokumen. Setiap soal punya 4 opsi jawaban, 1 jawaban benar, dan penjelasan singkat. Output HARUS JSON valid dengan format:
{
  "questions": [
    {
      "question": "pertanyaan",
      "options": ["opsi A", "opsi B", "opsi C", "opsi D"],
      "correct_answer_index": 0,
      "explanation": "penjelasan"
    }
  ]
}

Teks Dokumen:
${text}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const text = response.text;
    return JSON.parse(text || '{}');
  } catch (error) {
    console.error("Error generating quiz:", error);
    throw new Error("Gagal membuat quiz dengan Gemini.");
  }
}
