'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, HeartHandshake, ArrowRight } from 'lucide-react';
import Image from 'next/image';

export default function DonasiPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex w-full h-[calc(100vh-2rem)] bg-surface-base rounded-2xl overflow-hidden border border-surface-border">
      
      {/* Left Side - Donation Form/Box */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 relative z-10">
        <div className="w-full max-w-md">
          <div className="w-12 h-12 bg-surface-raised border border-surface-border rounded-xl flex items-center justify-center mb-8 text-ink-text shadow-sm">
            <HeartHandshake size={24} strokeWidth={1.5} />
          </div>
          
          <h1 className="font-display text-3xl md:text-4xl font-semibold text-ink-text mb-4 tracking-tight">
            Dukung Misi Kami
          </h1>
          
          <p className="text-ink-muted text-sm md:text-base mb-10 leading-relaxed">
            Platform ini dirancang untuk memajukan sistem pembelajaran modern bagi semua orang. Dukungan Anda membantu kami memelihara infrastruktur server dan terus berinovasi.
          </p>

          <button 
            onClick={() => setIsModalOpen(true)}
            className="group flex items-center justify-between w-full px-6 py-4 font-medium text-sm text-surface-base bg-ink-text rounded-lg hover:opacity-90 transition-opacity shadow-lg shadow-black/5"
          >
            <span>Lanjutkan Pembayaran</span>
            <ArrowRight size={18} className="text-surface-base/70 group-hover:translate-x-1 transition-transform" />
          </button>

          <div className="mt-8 flex items-center gap-2 text-xs text-ink-muted font-mono">
            <ShieldCheck size={14} />
            <span>Transaksi Terlindungi via QRIS</span>
          </div>
        </div>
      </div>

      {/* Right Side - Gradient Illustration */}
      <div className="hidden lg:flex w-1/2 relative bg-surface-base overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-bl from-accent-sky/5 to-transparent z-10 pointer-events-none"></div>
        <div 
          className="absolute inset-0 z-0"
          style={{ 
            WebkitMaskImage: 'linear-gradient(to left, black 50%, transparent 100%)',
            maskImage: 'linear-gradient(to left, black 50%, transparent 100%)'
          }}
        >
          <Image 
            src="/images/donation_illustration_v2.png" 
            alt="Transaction 3D Illustration" 
            fill
            className="object-cover object-right"
            priority
          />
        </div>
      </div>

      {/* QRIS Modal Pop-up */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="relative w-full max-w-sm bg-surface-raised border border-surface-border rounded-xl shadow-2xl overflow-hidden flex flex-col z-10"
            >
              <div className="px-6 py-4 border-b border-surface-border flex items-center justify-between">
                <h3 className="font-medium text-ink-text text-sm">Pindai QR Code</h3>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="text-ink-muted hover:text-ink-text transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-6 text-center bg-surface-base">
                <p className="text-xs text-ink-muted mb-4">
                  Buka aplikasi e-Wallet atau Mobile Banking Anda dan pindai kode di bawah ini.
                </p>
                
                <div className="bg-white p-2 rounded-lg border border-surface-border inline-block w-full">
                  <div className="relative w-full aspect-[3/4]">
                    <Image 
                      src="/images/qris_donasi.jpg" 
                      alt="QRIS Code" 
                      fill
                      className="object-contain"
                      priority
                    />
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-surface-border bg-surface-raised flex justify-end">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg font-medium text-sm text-ink-text border border-surface-border hover:bg-white/5 transition-colors"
                >
                  Selesai
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
