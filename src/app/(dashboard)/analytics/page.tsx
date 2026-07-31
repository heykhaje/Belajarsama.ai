import { getAnalyticsData } from '@/app/actions';
import dynamic from 'next/dynamic';

const AnalyticsLineChart = dynamic(() => import('./Charts').then(mod => mod.AnalyticsLineChart), {
  loading: () => <div className="flex h-full items-center justify-center text-ink-muted text-sm animate-pulse">Memuat grafik...</div>
});

const AnalyticsBarChart = dynamic(() => import('./Charts').then(mod => mod.AnalyticsBarChart), {
  loading: () => <div className="flex h-full items-center justify-center text-ink-muted text-sm animate-pulse">Memuat grafik...</div>
});

export default async function Analytics() {
  const data = await getAnalyticsData();

  if (!data) return <div className="p-8 text-ink-muted">Belum ada data analytics...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-2 mb-1">
        <span className="w-1.5 h-1.5 rounded-full bg-accent-sky" />
        <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-muted">Laporan Akademik</span>
      </div>
      <h1 className="font-display text-xl font-semibold mb-8 text-ink-text">Analytics</h1>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="card-academic p-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-ink-muted mb-2">
            Rata-rata Skor
          </p>
          <div className="flex items-baseline gap-1">
            <span className="font-display text-2xl font-semibold text-ink-text">{data.stats.avgScore}</span>
            <span className="font-mono text-[11px] text-ink-muted">/ 100</span>
          </div>
        </div>
        <div className="card-academic p-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-ink-muted mb-2">
            Total Quiz
          </p>
          <span className="font-display text-2xl font-semibold text-ink-text">{data.stats.totalQuiz}</span>
        </div>
        <div className="card-academic p-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-ink-muted mb-2">
            Terkuasai
          </p>
          <span className="font-display text-base font-semibold text-accent-sky">{data.stats.bestMaterial}</span>
        </div>
      </div>

      <div className="card-academic p-5 mb-4">
        <div className="flex items-center gap-2 mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-sky" />
          <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-ink-muted">
            Perkembangan Skor
          </p>
        </div>
        <div className="h-72">
          <AnalyticsLineChart data={data.lineData} />
        </div>
      </div>

      <div className="card-academic p-5">
        <div className="flex items-center gap-2 mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-sky" />
          <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-ink-muted">
            Per Materi
          </p>
        </div>
        <div className="h-56">
          <AnalyticsBarChart data={data.barData} />
        </div>
      </div>
    </div>
  );
}
