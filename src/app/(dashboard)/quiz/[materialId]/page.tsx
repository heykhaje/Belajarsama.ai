import QuizSession from '@/components/QuizSession';
import { generateQuiz } from '@/app/actions';
import { supabase } from '@/lib/supabase/client';
import Link from 'next/link';

export default async function QuizPage({ params }: { params: Promise<{ materialId: string }> }) {
  const { materialId } = await params;

  const { data: material } = await supabase
    .from('materials')
    .select('title')
    .eq('id', materialId)
    .single();

  let { data: existingQuiz } = await supabase
    .from('quizzes')
    .select('*')
    .eq('material_id', materialId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (!existingQuiz) {
    try {
      existingQuiz = await generateQuiz(materialId);
    } catch (error: any) {
      return (
        <div className="min-h-[80vh]">
          <div className="max-w-3xl mx-auto pt-6">
            <div className="card-academic p-8 text-center">
              <p className="text-red-500 mb-4">Gagal membuat quiz: {error.message}</p>
              <Link href="/my-learning" className="btn-academic">Kembali ke My Learning</Link>
            </div>
          </div>
        </div>
      );
    }
  }

  const questions = existingQuiz?.questions_json?.questions || [];

  if (questions.length === 0) {
    return (
      <div className="min-h-[80vh]">
        <div className="max-w-3xl mx-auto pt-6">
          <div className="card-academic p-8 text-center">
            <p className="text-ink-muted mb-4">Tidak ada soal yang berhasil dibuat untuk materi ini.</p>
            <Link href="/my-learning" className="btn-academic">Kembali ke My Learning</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh]">
      <div className="max-w-3xl mx-auto pt-6 mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-sky" />
          <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-muted">Quiz</p>
        </div>
        <h1 className="font-display text-xl font-semibold text-ink-text">Uji Pemahaman</h1>
        <p className="text-ink-muted text-sm mt-2 leading-relaxed">
          {material?.title ? `Quiz berdasarkan materi: ${material.title}` : 'Menguji pemahaman dari materi yang kamu pelajari.'}
        </p>
      </div>
      <QuizSession materialId={materialId} questions={questions} />
    </div>
  );
}
