import Link from 'next/link';
import Image from 'next/image';
import { getUpcomingSchedules, getWeeklyProgress } from '@/app/actions';

export default async function Dashboard() {
  let upcomingSchedules: any[] = [];
  let weeklyProgress = { quizCount: 0, avgScore: 0 };
  
  try {
    upcomingSchedules = await getUpcomingSchedules() || [];
  } catch (e) {
    console.error('[Dashboard] Failed to fetch schedules:', e);
  }
  
  try {
    weeklyProgress = await getWeeklyProgress();
  } catch (e) {
    console.error('[Dashboard] Failed to fetch progress:', e);
  }
  
  const today = new Date();
  const dateStr = today.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  return (
    <div className="relative w-full min-h-[calc(100vh-8rem)]">
      {/* Right Side - 3D Illustration (Fixed Background) */}
      <div className="hidden lg:block fixed right-0 top-0 bottom-0 w-[45%] pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-bl from-accent-sky/5 to-transparent z-10 opacity-60"></div>
        <div 
          className="absolute inset-0 z-0"
          style={{ 
            WebkitMaskImage: 'linear-gradient(to left, black 50%, transparent 100%)',
            maskImage: 'linear-gradient(to left, black 50%, transparent 100%)'
          }}
        >
          <Image 
            src="/images/dashboard_illustration.png" 
            alt="3D Dashboard Illustration" 
            fill
            className="object-cover object-right opacity-90"
            priority
          />
        </div>
      </div>

      {/* Left Side - Main Content */}
      <div className="relative z-10 max-w-3xl pt-2 pb-12">
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <span className="section-number text-accent-sky">Pertemuan</span>
            <span className="academic-divider flex-1 max-w-[200px]" />
          </div>
          <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-ink-muted mb-3">
            {dateStr}
          </p>
          <h1 className="font-display text-[2.4rem] lg:text-[3rem] font-semibold leading-[1.1] max-w-xl text-ink-text drop-shadow-md">
            Mau belajar apa{' '}
            <span className="highlight-mark">hari ini</span>?
          </h1>
          <p className="text-ink-muted text-sm mt-4 max-w-md leading-relaxed">
            Upload PDF, dapatkan ringkasan, dan uji pemahamanmu dengan quiz.
          </p>
        </div>

        <div className="flex gap-3 mb-14">
          <Link
            href="/my-learning"
            className="btn-academic shadow-lg"
          >
            Mulai dari Awal
          </Link>
          <Link
            href="/my-learning"
            className="btn-academic-outline bg-surface-base/50 backdrop-blur-sm"
          >
            Lanjutkan Pelajaran
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-2xl">
          <div className="card-academic p-5 bg-surface-raised/80 backdrop-blur-md shadow-xl border-surface-border/50">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-sky" />
              <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-ink-muted">
                Jadwal Tersimpan
              </p>
            </div>
            {upcomingSchedules && upcomingSchedules.length > 0 ? (
              <div className="flex flex-col gap-2 max-h-[250px] overflow-y-auto pr-2">
                {upcomingSchedules.map((schedule: any) => (
                  <div key={schedule.id} className="flex justify-between items-center py-2 border-b border-surface-border/60 last:border-0">
                    <span className="text-sm text-ink-text line-clamp-1 mr-2">{schedule.title}</span>
                    <span className="text-ink-muted font-mono text-[11px] bg-surface-base px-2 py-1 rounded-md whitespace-nowrap">
                      {new Date(schedule.scheduled_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} • {new Date(schedule.scheduled_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-4 text-center border border-dashed border-surface-border/50 rounded-lg">
                <p className="text-ink-muted/60 text-sm">Belum ada jadwal.</p>
              </div>
            )}
          </div>

          <div className="card-academic p-5 bg-surface-raised/80 backdrop-blur-md shadow-xl border-surface-border/50">
            <div className="flex items-center gap-2 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-sky" />
              <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-ink-muted">
                Progres Minggu Ini
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex items-baseline justify-between border-b border-surface-border/40 pb-2">
                <span className="text-ink-muted text-sm">Kuis diselesaikan</span>
                <span className="font-display text-2xl font-semibold text-ink-text">{weeklyProgress.quizCount}</span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-ink-muted text-sm">Rata-rata skor</span>
                <div className="flex items-center gap-2">
                  <span className="font-display text-2xl font-semibold text-ink-text">{weeklyProgress.avgScore}</span>
                  <span className="text-[10px] text-accent-sky font-mono uppercase tracking-wider">/ 100</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
