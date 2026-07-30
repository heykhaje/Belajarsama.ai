'use client';

import { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar,
} from 'recharts';
import { getAnalyticsData } from '@/app/actions';

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload) return null;
  return (
    <div className="bg-[#171B22] border border-surface-border rounded-lg px-3 py-2 shadow-lg">
      <p className="font-mono text-[10px] text-ink-muted uppercase tracking-wider">{label}</p>
      <p className="font-mono text-xs text-ink-text mt-0.5">Skor: {payload[0]?.value}</p>
    </div>
  );
}

export default function Analytics() {
  const [data, setData] = useState<{
    lineData: any[];
    barData: any[];
    stats: { avgScore: number; totalQuiz: number; bestMaterial: string };
  } | null>(null);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await getAnalyticsData();
        setData(res);
      } catch (error) {
        console.error("Error fetching analytics", error);
      }
    }
    fetchAnalytics();
  }, []);

  if (!data) return <div className="p-8 text-ink-muted">Memuat data analytics...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="font-display text-lg font-semibold mb-6">Analytics</h1>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-[#171B22] border border-surface-border rounded-lg p-4">
          <p className="font-mono text-[10px] uppercase tracking-wider text-ink-muted mb-1.5">
            Rata-rata Skor
          </p>
          <div className="flex items-baseline gap-1">
            <span className="font-mono text-2xl font-semibold text-ink-text">{data.stats.avgScore}</span>
            <span className="font-mono text-[11px] text-ink-muted">/ 100</span>
          </div>
        </div>
        <div className="bg-[#171B22] border border-surface-border rounded-lg p-4">
          <p className="font-mono text-[10px] uppercase tracking-wider text-ink-muted mb-1.5">
            Total Quiz
          </p>
          <span className="font-mono text-2xl font-semibold text-ink-text">{data.stats.totalQuiz}</span>
        </div>
        <div className="bg-[#171B22] border border-surface-border rounded-lg p-4">
          <p className="font-mono text-[10px] uppercase tracking-wider text-ink-muted mb-1.5">
            Terkuasai
          </p>
          <span className="text-sm font-medium text-accent-highlighter">{data.stats.bestMaterial}</span>
        </div>
      </div>

      <div className="bg-[#171B22] border border-surface-border rounded-lg p-5 mb-4">
        <p className="font-mono text-[10px] uppercase tracking-wider text-ink-muted mb-5">
          Perkembangan Skor
        </p>
        <div className="h-72">
          {data.lineData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.lineData} margin={{ top: 10, right: 10, bottom: 10, left: -20 }}>
                <XAxis dataKey="date" stroke="#9BA3B4" fontSize={11} tickLine={false} axisLine={false} fontFamily="IBM Plex Mono" />
                <YAxis stroke="#9BA3B4" fontSize={11} tickLine={false} axisLine={false} domain={[0, 100]} tickCount={6} fontFamily="IBM Plex Mono" />
                <Tooltip content={<ChartTooltip />} cursor={{ stroke: '#262B35', strokeWidth: 1, strokeDasharray: '3 3' }} />
                <Line type="monotone" dataKey="score" stroke="#7C9CFF" strokeWidth={2} dot={{ fill: '#171B22', stroke: '#7C9CFF', strokeWidth: 2, r: 4 }} activeDot={{ fill: '#FFC93C', stroke: '#0E1116', strokeWidth: 3, r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-ink-muted text-sm">Belum ada riwayat kuis.</div>
          )}
        </div>
      </div>

      <div className="bg-[#171B22] border border-surface-border rounded-lg p-5">
        <p className="font-mono text-[10px] uppercase tracking-wider text-ink-muted mb-5">
          Per Materi
        </p>
        <div className="h-56">
          {data.barData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.barData} layout="vertical" margin={{ left: 0, right: 10, top: 0, bottom: 0 }}>
                <XAxis type="number" hide domain={[0, 100]} />
                <YAxis dataKey="name" type="category" stroke="#9BA3B4" fontSize={12} tickLine={false} axisLine={false} width={110} fontFamily="IBM Plex Sans" />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: '#262B35', opacity: 0.3 }} />
                <Bar dataKey="score" fill="#7C9CFF" radius={[0, 3, 3, 0]} barSize={18} label={{ position: 'right', fill: '#E7E9EE', fontSize: 11, fontFamily: 'IBM Plex Mono' }} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
             <div className="flex h-full items-center justify-center text-ink-muted text-sm">Belum ada riwayat kuis.</div>
          )}
        </div>
      </div>
    </div>
  );
}
