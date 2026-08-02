const { YoutubeTranscript } = require('youtube-transcript');

async function test() {
  try {
    const url = 'https://youtu.be/EhOONXEZRTA?si=PhLoPHa5DIrBlGFd';
    const transcript = await YoutubeTranscript.fetchTranscript(url);
    console.log("Success:", transcript.length, "lines");
  } catch (e: any) {
    console.error("Error:", e.message);
  }
}

test();
