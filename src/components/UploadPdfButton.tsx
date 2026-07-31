'use client';

import { useState, useRef } from 'react';
import { uploadMaterial } from '@/app/actions';

export default function UploadPdfButton() {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Hanya file PDF yang diperbolehkan.');
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      alert('Ukuran file maksimal 20MB.');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const material = await uploadMaterial(formData);
      window.location.href = `/my-learning?id=${material.id}`;
    } catch (error: any) {
      alert(`Gagal mengunggah: ${error.message}`);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <>
      <input 
        type="file" 
        accept="application/pdf" 
        className="hidden" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
      />
      <button 
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className="btn-academic px-3.5 py-1.5 text-xs disabled:opacity-50"
      >
        {isUploading ? 'Mengunggah...' : '+ Tambah PDF'}
      </button>
    </>
  );
}
