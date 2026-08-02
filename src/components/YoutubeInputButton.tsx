'use client';

import { useState } from 'react';
import { processYoutubeUrl } from '@/app/actions';
import { PlaySquare, X } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';

export default function YoutubeInputButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setIsLoading(true);
    try {
      const response = await processYoutubeUrl(url);
      if (response.error) {
        alert(`Gagal: ${response.error}`);
      } else if (response.material) {
        setIsOpen(false);
        setUrl('');
        window.location.href = `/my-learning?id=${response.material.id}`;
      }
    } catch (error: any) {
      alert(`Terjadi kesalahan: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <button className="btn-academic px-3.5 py-1.5 text-xs bg-red-600/10 text-red-600 hover:bg-red-600/20 border border-red-600/20 flex items-center gap-1 transition-colors">
          <PlaySquare size={14} />
          <span className="hidden sm:inline">+ YouTube</span>
        </button>
      </Dialog.Trigger>
      
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-surface-raised border border-surface-border p-6 rounded-xl shadow-xl z-50">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-lg font-display font-semibold text-ink-text">
              Belajar dari YouTube
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="text-ink-muted hover:text-ink-text transition-colors">
                <X size={20} />
              </button>
            </Dialog.Close>
          </div>
          
          <p className="text-sm text-ink-muted mb-4">
            Masukkan link video YouTube. Sistem akan menarik subtitle video (pastikan video memiliki teks/subtitle) untuk dirangkum.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input 
              type="url" 
              placeholder="https://www.youtube.com/watch?v=..." 
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full bg-surface-base border border-surface-border rounded-lg px-4 py-2 text-ink-text text-sm focus:outline-none focus:border-accent-sky"
            />
            <button 
              type="submit" 
              disabled={isLoading || !url}
              className="btn-academic w-full justify-center disabled:opacity-50"
            >
              {isLoading ? 'Memproses Video...' : 'Proses Video'}
            </button>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
