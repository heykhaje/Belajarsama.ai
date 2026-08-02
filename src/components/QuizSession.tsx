'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { submitQuizAttempt } from '@/app/actions';

type Question = {
  question: string;
  options: string[];
  correct_answer_index: number;
  explanation: string;
};

export default function QuizSession({
  materialId,
  questions
}: {
  materialId: string;
  questions: Question[];
}) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const currentQuestion = questions[currentIndex];

  const handleSelect = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null) return;
    setIsAnswered(true);
    if (selectedOption === currentQuestion.correct_answer_index) setScore(score + 1);
  };

  const handleNext = async () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      // Quiz selesai — submit skor ke database
      const isActuallyCorrect = selectedOption === (currentQuestion.correctAnswer ?? currentQuestion.correct_answer_index);
      const finalScore = isActuallyCorrect 
        ? Math.round(((score + 1) / questions.length) * 100)
        : Math.round((score / questions.length) * 100);
      
      setIsSubmitting(true);
      try {
        await submitQuizAttempt(materialId, finalScore, {
          totalQuestions: questions.length,
          correctAnswers: isActuallyCorrect ? score + 1 : score,
        });
      } catch (err: any) {
        console.error('Failed to submit quiz:', err);
        setSubmitError(err.message);
      } finally {
        setIsSubmitting(false);
        setIsFinished(true);
      }
    }
  };

  const handleFinish = () => {
    router.push('/my-learning');
  };

  if (isFinished) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="flex items-center justify-center py-20">
        <div className="card-academic p-8 w-full max-w-sm text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-sky" />
            <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-ink-muted">Selesai</span>
          </div>
          <p className="font-display text-4xl font-semibold text-ink-text mb-2">{pct}</p>
          <p className="text-ink-muted text-xs mb-2">{score} dari {questions.length} benar</p>
          {submitError && (
            <p className="text-red-500 text-xs mb-4">Gagal menyimpan skor: {submitError}</p>
          )}
          {!submitError && (
            <p className="text-positive text-xs mb-4">Skor berhasil disimpan ✓</p>
          )}
          <button
            onClick={handleFinish}
            className="btn-academic"
          >
            Kembali ke My Learning
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-5">
        <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-ink-muted">
          Soal {currentIndex + 1} / {questions.length}
        </span>
        <span className="font-mono text-[10px] text-ink-muted">
          Skor: <span className="text-accent-sky font-semibold">{score}</span>
        </span>
      </div>

      <div className="card-academic p-6 mb-5">
        <p className="text-sm font-display font-semibold leading-relaxed mb-6 text-ink-text">{currentQuestion.question}</p>

        <div className="flex flex-col gap-2">
          {currentQuestion.options.map((opt, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrect = idx === (currentQuestion.correctAnswer ?? currentQuestion.correct_answer_index);

            let borderClass = 'border-surface-border hover:border-zinc-500';
            let bgClass = 'bg-surface-raised';
            let labelClass = 'text-ink-text';

            if (isAnswered) {
              if (isCorrect) {
                borderClass = 'border-positive';
                bgClass = 'bg-positive/10';
              } else if (isSelected) {
                borderClass = 'border-danger';
                bgClass = 'bg-danger/10';
              } else {
                borderClass = 'border-surface-border';
                bgClass = 'bg-surface-raised';
                labelClass = 'text-ink-muted/50';
              }
            } else if (isSelected) {
              borderClass = 'border-accent-sky';
              bgClass = 'bg-accent-soft';
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                className={`text-left px-4 py-3 rounded-md border transition-all duration-150 ${borderClass} ${bgClass} shadow-sm`}
                disabled={isAnswered}
              >
                <div className="flex items-start gap-3">
                  <span className={`font-mono text-[10px] mt-0.5 w-4 flex-shrink-0 ${isAnswered && isSelected && !isCorrect ? 'text-danger' : isAnswered && isCorrect ? 'text-positive' : 'text-ink-muted'}`}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className={`text-xs leading-relaxed ${labelClass}`}>{opt}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {isAnswered && (
        <div className={`rounded-lg border p-4 mb-5 ${
          selectedOption === currentQuestion.correct_answer_index
            ? 'bg-positive/10 border-positive'
            : 'bg-danger/10 border-danger'
        }`}>
          <p className={`font-mono text-[10px] uppercase tracking-[0.15em] mb-1 ${
            selectedOption === currentQuestion.correct_answer_index ? 'text-positive' : 'text-danger'
          }`}>
            {selectedOption === currentQuestion.correct_answer_index ? 'Benar' : 'Belum Tepat'}
          </p>
          <p className="text-xs text-ink-text leading-relaxed">{currentQuestion.explanation}</p>
        </div>
      )}

      <div className="flex justify-end">
        {!isAnswered ? (
          <button
            onClick={handleSubmitAnswer}
            disabled={selectedOption === null}
            className="btn-academic disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Jawab
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="btn-academic"
          >
            {currentIndex < questions.length - 1 ? 'Selanjutnya' : 'Lihat Hasil'}
          </button>
        )}
      </div>
    </div>
  );
}
