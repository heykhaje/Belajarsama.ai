import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function generateSummary(text: string) {
  const prompt = `Kamu adalah asisten belajar. Berdasarkan teks dokumen berikut, buat ringkasan poin-poin penting yang mudah dipelajari. Kelompokkan per bagian/bab jika dokumen panjang. Output HARUS murni JSON valid (tanpa markdown backticks) dengan format:
{
  "title": "Judul Materi",
  "sections": [{ "heading": "Nama Bab", "key_points": ["poin 1", "poin 2"] }],
  "overall_takeaways": ["kesimpulan 1", "kesimpulan 2"]
}

Teks Dokumen:
${text}`;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      response_format: { type: 'json_object' },
      temperature: 0.2,
    });

    const outputText = chatCompletion.choices[0]?.message?.content || '{}';
    return JSON.parse(outputText);
  } catch (error: any) {
    console.error("Error generating summary:", error);
    throw new Error("Gagal membuat ringkasan: " + error.message);
  }
}

export async function generateQuiz(text: string) {
  const prompt = `Kamu adalah seorang dosen yang membuat soal ujian. Berdasarkan HANYA isi teks dokumen di bawah ini, buat 5-10 soal pilihan ganda.

ATURAN KETAT:
- Semua soal HARUS berdasarkan isi dokumen yang diberikan. JANGAN membuat soal tentang topik lain.
- Setiap soal punya tepat 4 opsi jawaban, dengan 1 jawaban yang benar.
- Buat penjelasan singkat untuk setiap jawaban benar.
- Gunakan bahasa yang sama dengan bahasa dokumen.
- JANGAN membuat soal tentang Next.js, Supabase, atau teknologi apapun kecuali itu memang isi dokumennya.

Output HARUS murni JSON valid (tanpa markdown backticks) dengan format:
{
  "questions": [
    {
      "question": "pertanyaan berdasarkan isi dokumen",
      "options": ["opsi A", "opsi B", "opsi C", "opsi D"],
      "correct_answer_index": 0,
      "explanation": "penjelasan mengapa jawaban ini benar berdasarkan dokumen"
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
      temperature: 0.3,
    });

    const outputText = chatCompletion.choices[0]?.message?.content || '{}';
    return JSON.parse(outputText);
  } catch (error: any) {
    console.error("Error generating quiz:", error);
    throw new Error("Gagal membuat quiz dengan AI.");
  }
}
