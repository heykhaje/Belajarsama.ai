'use client';

import { useState, useEffect } from 'react';
import { createSchedule, getSchedulesByMonth, completeAndDeleteSchedule } from '@/app/actions';

export default function Schedule() {
  const [currentDate, setCurrentDate] = useState<Date | null>(null);
  const [viewYear, setViewYear] = useState(new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState(new Date().getMonth());
  const [schedules, setSchedules] = useState<any[]>([]);
  const [isLoadingSchedules, setIsLoadingSchedules] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [scheduleDateTime, setScheduleDateTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    setCurrentDate(new Date());
  }, []);

  useEffect(() => {
    async function fetchSchedules() {
      setIsLoadingSchedules(true);
      try {
        const data = await getSchedulesByMonth(viewMonth, viewYear);
        setSchedules(data || []);
      } catch (err) {
        console.error("Error fetching schedules:", err);
      } finally {
        setIsLoadingSchedules(false);
      }
    }
    fetchSchedules();
  }, [viewMonth, viewYear]);

  if (!currentDate) return null;

  const daysStr = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
  const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const handleCreateSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createSchedule({
        title,
        scheduled_at: new Date(scheduleDateTime).toISOString(),
      });
      setIsModalOpen(false);
      setTitle('');
      setScheduleDateTime('');
      alert("Jadwal berhasil dibuat!");
      const data = await getSchedulesByMonth(viewMonth, viewYear);
      setSchedules(data || []);
    } catch (error: any) {
      alert("Gagal membuat jadwal: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const blanks = Array.from({ length: firstDayOfMonth }).map((_, i) => i);
  const monthDates = Array.from({ length: daysInMonth }).map((_, i) => i + 1);
  const todayStart = new Date(currentDate);
  todayStart.setHours(0, 0, 0, 0);
  const upcomingSchedules = schedules.filter(s => new Date(s.scheduled_at).getTime() >= todayStart.getTime());

  return (
    <div className="max-w-4xl mx-auto relative">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-sky" />
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-muted">Kalender Akademik</span>
          </div>
          <h1 className="font-display text-xl font-semibold text-ink-text">Jadwal Belajar</h1>
          <div className="flex items-center gap-4 mt-3">
            <button onClick={handlePrevMonth} className="text-ink-muted hover:text-accent-sky transition-colors">&lt;</button>
            <p className="font-mono text-sm uppercase tracking-[0.12em] text-ink-text w-32 text-center">
              {monthNames[viewMonth]} {viewYear}
            </p>
            <button onClick={handleNextMonth} className="text-ink-muted hover:text-accent-sky transition-colors">&gt;</button>
          </div>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn-academic"
        >
          + Buat Jadwal
        </button>
      </div>

      <div className="card-academic p-5 mb-10">
        <div className="grid grid-cols-7 gap-2 mb-2">
          {daysStr.map((day) => (
            <div key={day} className="text-center font-mono text-[10px] uppercase tracking-[0.15em] text-ink-muted">
              {day}
            </div>
          ))}
        </div>
        
        {isLoadingSchedules ? (
          <div className="text-center text-ink-muted py-8">Memuat jadwal...</div>
        ) : (
          <div className="grid grid-cols-7 gap-2">
            {blanks.map(b => (
              <div key={`blank-${b}`} className="h-16 border border-transparent"></div>
            ))}
            {monthDates.map(dateNum => {
              const dateObj = new Date(viewYear, viewMonth, dateNum);
              const isToday = dateObj.toDateString() === currentDate.toDateString();
              const daySchedules = schedules.filter(s => new Date(s.scheduled_at).toDateString() === dateObj.toDateString());
              
              return (
                <div 
                  key={dateNum} 
                  className={`relative flex flex-col items-center justify-start rounded-lg border h-16 pt-1 transition-all ${
                    isToday ? 'border-accent-sky/30 bg-gradient-to-br from-sky-50 via-blue-50 to-sky-100/60 shadow-sm' : 'border-zinc-200 hover:border-zinc-300'
                  }`}
                >
                  <span className={`font-mono text-xs ${isToday ? 'text-accent-sky font-semibold' : 'text-ink-muted'}`}>
                    {dateNum}
                  </span>
                  <div className="flex gap-1 mt-1 flex-wrap justify-center w-full px-1">
                    {daySchedules.map(s => (
                      <span key={s.id} title={s.title} className="w-1.5 h-1.5 rounded-full bg-accent-sky/70"></span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 mb-5">
        <span className="w-1.5 h-1.5 rounded-full bg-accent-sky" />
        <span className="academic-divider flex-1" />
      </div>

      <div className="flex flex-col gap-2">
        {upcomingSchedules.length > 0 ? (
          upcomingSchedules.map(s => {
            const sDate = new Date(s.scheduled_at);
            return (
              <div key={s.id} className="card-academic flex items-center justify-between p-4">
                <div className="flex items-center gap-5">
                  <div className="flex flex-col items-center min-w-[4rem]">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">{daysStr[sDate.getDay()]}</span>
                    <span className="font-display text-lg font-semibold text-ink-text">{sDate.getDate()}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-ink-text">{s.title}</span>
                    <span className="font-mono text-[11px] text-ink-muted mt-0.5">{sDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
                <button
                  onClick={async () => {
                    setDeletingId(s.id);
                    try {
                      await completeAndDeleteSchedule(s.id);
                      setSchedules(prev => prev.filter(sch => sch.id !== s.id));
                    } catch (err: any) {
                      alert('Gagal menyelesaikan jadwal: ' + err.message);
                    } finally {
                      setDeletingId(null);
                    }
                  }}
                  disabled={deletingId === s.id}
                  className={`flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider px-4 py-2 rounded-full transition-all ${
                    deletingId === s.id
                      ? 'bg-green-100 text-green-600 opacity-50 cursor-wait'
                      : 'bg-green-50 text-green-600 border border-green-200 hover:bg-green-100 hover:border-green-300 cursor-pointer'
                  }`}
                >
                  {deletingId === s.id ? 'Menghapus...' : '✓ Sudah Selesai'}
                </button>
              </div>
            )
          })
        ) : (
          <p className="text-ink-muted text-sm px-4">Tidak ada jadwal terdekat.</p>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4">
          <div className="bg-surface-raised border border-surface-border rounded-xl p-6 w-full max-w-md shadow-xl">
            <div className="flex items-center gap-2 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-sky" />
              <h2 className="font-display text-xl font-semibold text-ink-text">Buat Jadwal Baru</h2>
            </div>
            <form onSubmit={handleCreateSchedule} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs text-ink-muted mb-2 font-medium">Judul Materi</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-surface-base border border-surface-border rounded-lg px-4 py-2.5 text-ink-text text-sm focus:outline-none focus:border-accent-sky focus:ring-1 focus:ring-accent-sky/20 transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-ink-muted mb-2 font-medium">Tanggal & Jam</label>
                <input 
                  type="datetime-local" 
                  value={scheduleDateTime}
                  onChange={(e) => setScheduleDateTime(e.target.value)}
                  className="w-full bg-surface-base border border-surface-border rounded-lg px-4 py-2.5 text-ink-text text-sm focus:outline-none focus:border-accent-sky focus:ring-1 focus:ring-accent-sky/20 transition-all [color-scheme:dark]"
                  required
                />
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-sm font-medium border border-surface-border hover:bg-white/5 transition text-ink-text"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="btn-academic disabled:opacity-50"
                >
                  {isSubmitting ? 'Menyimpan...' : 'Simpan Jadwal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
