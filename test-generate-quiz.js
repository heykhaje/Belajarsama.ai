const dotenv = require('dotenv');
dotenv.config({path: '.env.local'});

const { generateQuiz } = require('./src/lib/ai/groq.ts');

async function test() {
  try {
    console.log("Generating quiz...");
    const result = await generateQuiz("Pancasila adalah dasar negara Indonesia. Terdapat lima sila dalam Pancasila.");
    console.log("Result type:", typeof result);
    console.log("Is array?", Array.isArray(result));
    console.log(JSON.stringify(result, null, 2));
  } catch (e) {
    console.error("Failed:", e);
  }
}

test();
