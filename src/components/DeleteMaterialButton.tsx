'use client';

import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { deleteMaterial } from '@/app/actions';
import { useRouter } from 'next/navigation';

export default function DeleteMaterialButton({ materialId, title }: { materialId: string, title: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (confirm(`Apakah Anda yakin ingin menghapus "${title}" secara permanen? File PDF dan ringkasan akan ikut terhapus.`)) {
      try {
        setIsDeleting(true);
        await deleteMaterial(materialId);
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('id') === materialId) {
          router.push('/my-learning');
        }
      } catch (error: any) {
        alert("Gagal menghapus materi: " + error.message);
        setIsDeleting(false);
      }
    }
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={isDeleting}
      className="p-2 text-ink-muted hover:text-red-500 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
      title="Hapus materi"
    >
      <Trash2 size={16} className={isDeleting ? 'animate-pulse' : ''} />
    </button>
  );
}
