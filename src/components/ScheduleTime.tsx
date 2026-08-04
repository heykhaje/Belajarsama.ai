'use client';
import { useState, useEffect } from 'react';

export default function ScheduleTime({ dateString }: { dateString: string }) {
  const [formatted, setFormatted] = useState('');

  useEffect(() => {
    const d = new Date(dateString);
    setFormatted(`${d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} • ${d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`);
  }, [dateString]);

  if (!formatted) {
    return <span className="opacity-0">-- --- • --:--</span>;
  }
  
  return <>{formatted}</>;
}
