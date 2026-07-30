import QuizSession from '@/components/QuizSession';

const DUMMY_QUESTIONS = [
  {
    question: 'Fungsi utama dari Next.js App Router adalah?',
    options: [
      'Menyediakan routing berbasis direktori server-centric',
      'Menggantikan Tailwind CSS',
      'Membuat animasi transisi',
      'Menghubungkan ke database secara otomatis'
    ],
    correct_answer_index: 0,
    explanation: 'App Router adalah paradigma routing baru dari Next.js yang menggunakan React Server Components.'
  },
  {
    question: 'Apa peran Supabase dalam aplikasi ini?',
    options: [
      'Menyediakan layanan AI text generation',
      'Sebagai framework frontend',
      'Sebagai layanan backend untuk Database, Auth, dan Storage',
      'Sebagai penyedia domain web'
    ],
    correct_answer_index: 2,
    explanation: 'Supabase bertindak sebagai Backend-as-a-Service yang menyediakan Postgres database, penyimpanan file, dan autentikasi.'
  }
];

export default function QuizPage({ params }: { params: { materialId: string } }) {
  return (
    <div className="min-h-[80vh]">
      <div className="max-w-3xl mx-auto pt-6 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-highlighter" />
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-muted">Quiz</p>
        </div>
        <h1 className="font-display text-xl font-semibold">Uji Pemahaman</h1>
        <p className="text-ink-muted text-sm mt-1">Menguji pemahaman dari materi yang kamu pelajari.</p>
      </div>
      <QuizSession materialId={params.materialId} questions={DUMMY_QUESTIONS} />
    </div>
  );
}
