'use client';

import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid,
} from 'recharts';

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload) return null;
  return (
    <div className="bg-surface-raised border border-surface-border rounded-lg px-3 py-2 shadow-lg">
      <p className="font-mono text-[10px] text-ink-muted uppercase tracking-wider">{label}</p>
      <p className="font-mono text-xs text-ink-text mt-0.5">Skor: {payload[0]?.value}</p>
    </div>
  );
}

export function AnalyticsLineChart({ data }: { data: any[] }) {
  if (!data || data.length === 0) {
    return <div className="flex h-full items-center justify-center text-ink-muted text-sm">Belum ada riwayat kuis.</div>;
  }
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 10, right: 10, bottom: 10, left: -20 }}>
        <CartesianGrid stroke="#E4E4E7" strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="date" stroke="#A1A1AA" fontSize={11} tickLine={false} axisLine={false} fontFamily="IBM Plex Mono" />
        <YAxis stroke="#A1A1AA" fontSize={11} tickLine={false} axisLine={false} domain={[0, 100]} tickCount={6} fontFamily="IBM Plex Mono" />
        <Tooltip content={<ChartTooltip />} cursor={{ stroke: '#E4E4E7', strokeWidth: 1, strokeDasharray: '3 3' }} />
        <Line type="monotone" dataKey="score" stroke="#0284C7" strokeWidth={2} dot={{ fill: '#FFFFFF', stroke: '#0284C7', strokeWidth: 2, r: 4 }} activeDot={{ fill: '#0284C7', stroke: '#FFFFFF', strokeWidth: 3, r: 6 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function AnalyticsBarChart({ data }: { data: any[] }) {
  if (!data || data.length === 0) {
    return <div className="flex h-full items-center justify-center text-ink-muted text-sm">Belum ada riwayat kuis.</div>;
  }
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical" margin={{ left: 0, right: 10, top: 0, bottom: 0 }}>
        <CartesianGrid stroke="#E4E4E7" strokeDasharray="3 3" />
        <XAxis type="number" hide domain={[0, 100]} />
        <YAxis dataKey="name" type="category" stroke="#A1A1AA" fontSize={12} tickLine={false} axisLine={false} width={110} fontFamily="Source Sans 3" />
        <Tooltip content={<ChartTooltip />} cursor={{ fill: '#F1F5F9', opacity: 0.5 }} />
        <Bar dataKey="score" fill="#0284C7" radius={[0, 3, 3, 0]} barSize={18} label={{ position: 'right', fill: '#18181B', fontSize: 11, fontFamily: 'IBM Plex Mono' }} />
      </BarChart>
    </ResponsiveContainer>
  );
}
