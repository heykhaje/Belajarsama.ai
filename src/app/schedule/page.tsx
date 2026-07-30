'use client';

import { useState, useEffect } from 'react';
import { createSchedule, getSchedulesByMonth } from '@/app/actions';

export default function Schedule() {
  const [currentDate, setCurrentDate] = useState<Date | null>(null);
  
  // States for the calendar view
  const [viewYear, setViewYear] = useState(new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState(new Date().getMonth());
  
  const [schedules, setSchedules] = useState<any[]>([]);
  const [isLoadingSchedules, setIsLoadingSchedules] = useState(true);

  // States for Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const daysStr = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']; // Based on JS getDay() where 0 is Sunday
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
      const [hours, minutes] = time.split(':');
      // Set to today's date + input time (as requested in MVP)
      const scheduleDate = new Date();
      scheduleDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
      
      await createSchedule({
        title,
        scheduled_at: scheduleDate.toISOString(),
      });
      setIsModalOpen(false);
      setTitle('');
      setTime('');
      alert("Jadwal berhasil dibuat!");
      
      // Refresh schedules
      const data = await getSchedulesByMonth(viewMonth, viewYear);
      setSchedules(data || []);
    } catch (error: any) {
      alert("Gagal membuat jadwal: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calendar logic
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay(); // 0 (Sun) to 6 (Sat)
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  
  const blanks = Array.from({ length: firstDayOfMonth }).map((_, i) => i);
  const monthDates = Array.from({ length: daysInMonth }).map((_, i) => i + 1);

  // Future events (today or later)
  const upcomingSchedules = schedules.filter(s => new Date(s.scheduled_at).getTime() >= currentDate.setHours(0,0,0,0));

  return (
    <div className="max-w-4xl mx-auto relative">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-xl font-semibold">Jadwal Belajar</h1>
          <div className="flex items-center gap-4 mt-2">
            <button onClick={handlePrevMonth} className="text-ink-muted hover:text-ink-text">&lt;</button>
            <p className="font-mono text-sm uppercase tracking-[0.12em] text-ink-text w-32 text-center">
              {monthNames[viewMonth]} {viewYear}
            </p>
            <button onClick={handleNextMonth} className="text-ink-muted hover:text-ink-text">&gt;</button>
          </div>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-accent-ink-blue text-surface-base px-4 py-2 rounded-lg text-sm font-medium hover:opacity-85 transition-all duration-150 active:scale-[0.97] whitespace-nowrap"
        >
          + Buat Jadwal
        </button>
      </div>

      <div className="bg-surface-raised border border-surface-border rounded-xl p-5 mb-10">
        <div className="grid grid-cols-7 gap-2 mb-2">
          {daysStr.map((day) => (
            <div key={day} className="text-center font-mono text-[10px] uppercase tracking-wider text-ink-muted">
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
                    isToday ? 'border-accent-highlighter/30 bg-accent-highlighter/10' : 'border-surface-border hover:bg-surface-border/30'
                  }`}
                >
                  <span className={`font-mono text-xs ${isToday ? 'text-accent-highlighter font-medium' : 'text-ink-muted'}`}>
                    {dateNum}
                  </span>
                  {/* Indicators for schedules */}
                  <div className="flex gap-1 mt-1 flex-wrap justify-center w-full px-1">
                    {daySchedules.map(s => (
                      <span key={s.id} title={s.title} className="w-1.5 h-1.5 rounded-full bg-accent-ink-blue"></span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 mb-5">
        <span className="w-1.5 h-1.5 rounded-full bg-accent-ink-blue" />
        <h2 className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-muted">
          Jadwal Terdekat
        </h2>
      </div>

      <div className="flex flex-col gap-2">
        {upcomingSchedules.length > 0 ? (
          upcomingSchedules.map(s => {
            const sDate = new Date(s.scheduled_at);
            return (
              <div key={s.id} className="flex items-center justify-between p-4 bg-surface-raised border border-surface-border rounded-xl hover:border-accent-highlighter/30 transition-all duration-150">
                <div className="flex items-center gap-5">
                  <div className="flex flex-col items-center min-w-[4rem]">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">{daysStr[sDate.getDay()]}</span>
                    <span className="font-mono text-lg font-medium text-ink-text">{sDate.getDate()}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-ink-text">{s.title}</span>
                    <span className="font-mono text-[11px] text-ink-muted mt-0.5">{sDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-accent-ink-blue bg-accent-ink-blue/10 px-3 py-1 rounded-full">
                  {s.status === 'done' ? 'Selesai' : 'Akan Datang'}
                </span>
              </div>
            )
          })
        ) : (
          <p className="text-ink-muted text-sm px-4">Tidak ada jadwal terdekat.</p>
        )}
      </div>

      {/* Modal Buat Jadwal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0E1116]/80 backdrop-blur-sm p-4">
          <div className="bg-surface-raised border border-surface-border rounded-xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="font-display text-xl font-semibold mb-6">Buat Jadwal Baru</h2>
            <form onSubmit={handleCreateSchedule} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm text-ink-muted mb-2">Judul Materi</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#0E1116] border border-surface-border rounded-lg px-4 py-2 text-ink-text focus:outline-none focus:border-accent-ink-blue focus:ring-1 focus:ring-accent-ink-blue"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-ink-muted mb-2">Jam (Hari Ini)</label>
                <input 
                  type="time" 
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full bg-[#0E1116] border border-surface-border rounded-lg px-4 py-2 text-ink-text focus:outline-none focus:border-accent-ink-blue focus:ring-1 focus:ring-accent-ink-blue"
                  required
                />
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-sm font-medium border border-surface-border hover:bg-surface-border/30 transition"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-accent-ink-blue text-surface-base px-4 py-2 rounded-lg text-sm font-medium hover:opacity-85 transition disabled:opacity-50"
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
