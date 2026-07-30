import Link from 'next/link';
import { getTodaySchedules, getWeeklyProgress } from '@/app/actions';

export default async function Dashboard() {
  const todaySchedules = await getTodaySchedules();
  const weeklyProgress = await getWeeklyProgress();
  
  const today = new Date();
  const dateStr = today.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  return (
    <div className="max-w-4xl">
      <div className="mb-10">
        <p className="font-mono text-[11px] uppercase tracking-wider text-ink-muted mb-3">
          {dateStr}
        </p>
        <h1 className="font-display text-[2.2rem] lg:text-[2.6rem] font-semibold tracking-tight leading-[1.15] max-w-xl">
          Mau belajar apa{' '}
          <span className="highlight-mark">hari ini</span>?
        </h1>
        <p className="text-ink-muted text-sm mt-3 max-w-md">
          Upload PDF, dapatkan ringkasan, dan uji pemahamanmu dengan quiz.
        </p>
      </div>

      <div className="flex gap-3 mb-12">
        <Link
          href="/my-learning"
          className="bg-accent-ink-blue text-surface-base px-5 py-2.5 rounded-md text-sm font-medium hover:bg-[#6B8BFF] transition-all duration-150"
        >
          Mulai dari Awal
        </Link>
        <Link
          href="/my-learning"
          className="border border-surface-border text-ink-text px-5 py-2.5 rounded-md text-sm font-medium hover:border-ink-muted transition-all duration-150"
        >
          Lanjutkan Pelajaran
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#171B22] border border-surface-border rounded-lg p-5">
          <p className="font-mono text-[11px] uppercase tracking-wider text-ink-muted mb-1">
            Jadwal Hari Ini
          </p>
          {todaySchedules && todaySchedules.length > 0 ? (
            <div className="mt-3 flex flex-col gap-2">
              {todaySchedules.map((schedule: any) => (
                <div key={schedule.id} className="flex justify-between items-center text-sm">
                  <span className="text-ink-text">{schedule.title}</span>
                  <span className="text-ink-muted font-mono text-[11px]">{new Date(schedule.scheduled_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-ink-muted/60 text-sm mt-3">Belum ada jadwal.</p>
          )}
        </div>

        <div className="bg-[#171B22] border border-surface-border rounded-lg p-5">
          <p className="font-mono text-[11px] uppercase tracking-wider text-ink-muted mb-1">
            Progres Minggu Ini
          </p>
          <div className="flex flex-col gap-1 mt-3">
            <span className="text-ink-text text-sm">{weeklyProgress.quizCount} kuis diselesaikan</span>
            <span className="text-ink-text text-sm">Rata-rata skor: {weeklyProgress.avgScore}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
