'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

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

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
    }
  };

  const handleFinish = () => {
    router.push('/my-learning');
  };

  if (isFinished) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="flex items-center justify-center py-20">
        <div className="bg-[#171B22] border border-surface-border rounded-lg p-8 w-full max-w-sm text-center">
          <p className="font-mono text-[10px] uppercase tracking-wider text-ink-muted mb-4">Selesai</p>
          <p className="font-mono text-4xl font-semibold text-accent-ink-text mb-2">{pct}</p>
          <p className="text-ink-muted text-xs mb-6">{score} dari {questions.length} benar</p>
          <button
            onClick={handleFinish}
            className="bg-accent-ink-blue text-surface-base px-5 py-2 rounded-md text-xs font-medium hover:bg-[#6B8BFF] transition-all duration-150"
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
        <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">
          Soal {currentIndex + 1} / {questions.length}
        </span>
        <span className="font-mono text-[10px] text-ink-muted">
          Skor: <span className="text-accent-ink-blue">{score}</span>
        </span>
      </div>

      <div className="bg-[#171B22] border border-surface-border rounded-lg p-6 mb-5">
        <p className="text-sm font-medium leading-relaxed mb-6">{currentQuestion.question}</p>

        <div className="flex flex-col gap-2">
          {currentQuestion.options.map((opt, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrect = idx === currentQuestion.correct_answer_index;

            let borderClass = 'border-surface-border hover:border-ink-muted/40';
            let bgClass = 'bg-transparent';
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
                bgClass = 'bg-transparent';
                labelClass = 'text-ink-muted/50';
              }
            } else if (isSelected) {
              borderClass = 'border-accent-ink-blue';
              bgClass = 'bg-accent-ink-blue/10';
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                className={`text-left px-4 py-3 rounded-md border transition-all duration-150 ${borderClass} ${bgClass}`}
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
          <p className={`font-mono text-[10px] uppercase tracking-wider mb-1 ${
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
            className="bg-accent-ink-blue text-surface-base px-6 py-2 rounded-md text-xs font-medium hover:bg-[#6B8BFF] transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Jawab
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="bg-accent-ink-blue text-surface-base px-6 py-2 rounded-md text-xs font-medium hover:bg-[#6B8BFF] transition-all duration-150"
          >
            {currentIndex < questions.length - 1 ? 'Selanjutnya' : 'Lihat Hasil'}
          </button>
        )}
      </div>
    </div>
  );
}
