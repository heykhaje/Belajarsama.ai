'use client';

import { useState } from 'react';
import { uploadTextMaterial } from '@/app/actions';

export default function AddTextButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !text.trim()) {
      alert('Judul dan Teks tidak boleh kosong.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await uploadTextMaterial({ title, text });
      if (response.error) {
        alert(`Gagal menyimpan: ${response.error}`);
      } else if (response.material) {
        setIsModalOpen(false);
        setTitle('');
        setText('');
        window.location.href = `/my-learning?id=${response.material.id}`;
      }
    } catch (error: any) {
      alert(`Terjadi kesalahan tidak terduga: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsModalOpen(true)}
        className="px-3.5 py-1.5 text-xs font-medium rounded-lg border border-surface-border bg-surface-raised hover:bg-surface-base text-ink-text transition-colors shadow-sm"
      >
        + Teks
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4">
          <div className="bg-surface-raised border border-surface-border rounded-xl p-6 w-full max-w-2xl shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-sky" />
                <h2 className="font-display text-xl font-semibold text-ink-text">Tambah Teks Manual</h2>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-ink-muted hover:text-ink-text">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs text-ink-muted mb-2 font-medium">Judul Materi</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Masukkan judul materi"
                  className="w-full bg-surface-base border border-surface-border rounded-lg px-4 py-2.5 text-ink-text text-sm focus:outline-none focus:border-accent-sky focus:ring-1 focus:ring-accent-sky/20 transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-ink-muted mb-2 font-medium">Teks Materi</label>
                <textarea 
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Tempel atau ketik teks materi di sini..."
                  rows={10}
                  className="w-full bg-surface-base border border-surface-border rounded-lg px-4 py-2.5 text-ink-text text-sm focus:outline-none focus:border-accent-sky focus:ring-1 focus:ring-accent-sky/20 transition-all resize-y min-h-[150px]"
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
                  {isSubmitting ? 'Menyimpan...' : 'Simpan Materi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
