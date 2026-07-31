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
      temperature: 0.2, // Low temperature for more deterministic output
    });

    const outputText = chatCompletion.choices[0]?.message?.content || '{}';
    return JSON.parse(outputText);
  } catch (error: any) {
    console.error("Error generating summary with Groq:", error);
    throw new Error("Gagal membuat ringkasan dengan Groq: " + error.message);
  }
}
