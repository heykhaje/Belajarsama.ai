const dotenv = require('dotenv');
dotenv.config({path: '.env.local'});
const Groq = require('groq-sdk');
const groq = new Groq({apiKey: process.env.GROQ_API_KEY});

const prompt = `Kamu adalah dosen. Buat 1 soal dari teks ini. Output HARUS murni JSON array:
[
  { "question": "Q?", "options": ["A","B","C","D"], "correctAnswer": 0, "explanation": "E" }
]
Teks: Halo dunia.`;

groq.chat.completions.create({
  messages: [{role: 'user', content: prompt}],
  model: 'llama-3.3-70b-versatile',
  response_format: {type: 'json_object'}
}).then(r => console.log(r.choices[0].message.content)).catch(e => console.error(e.message));
