'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function LoginPage() {
  const router = useRouter();
  
  // View state
  const [isSignUp, setIsSignUp] = useState(false);
  
  // Form state
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [dobDate, setDobDate] = useState('');
  const [dobMonth, setDobMonth] = useState('');
  const [dobYear, setDobYear] = useState('');
  const [otp, setOtp] = useState('');
  
  // Request state
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Listen for auth state changes (e.g. user clicks Magic Link or returns from Google OAuth)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        router.push('/dashboard');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    // Validate extra fields for Sign Up
    if (isSignUp) {
      if (!name || !dobDate || !dobMonth || !dobYear) {
        setError('Mohon lengkapi semua data pendaftaran.');
        return;
      }
    }
    
    setIsLoading(true);
    setError(null);
    
    // Prepare metadata if in sign up mode
    const options: any = {
      shouldCreateUser: true,
    };
    
    if (isSignUp) {
      options.data = {
        full_name: name,
        birth_date: `${dobYear}-${dobMonth.padStart(2, '0')}-${dobDate.padStart(2, '0')}`
      };
    }
    
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options
    });

    if (error) {
      setError(error.message || 'Pengiriman gagal. Jika Anda memakai Resend gratis, pastikan email tujuan sama dengan email akun Resend Anda!');
    } else {
      setIsOtpSent(true);
    }
    setIsLoading(false);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) return;

    setIsLoading(true);
    setError(null);

    let verifyResult = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: 'magiclink',
    });

    // Jika gagal, mungkin Supabase menganggap ini user baru (tipe: signup)
    if (verifyResult.error && verifyResult.error.message.includes("expired or is invalid")) {
      verifyResult = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'signup',
      });
    }

    const { error } = verifyResult;

    if (error) {
      setError(error.message);
    } else {
      router.push('/dashboard');
    }
    setIsLoading(false);
  };
  
  // Date helpers
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

  return (
    <div className="min-h-screen flex w-full bg-surface-base">
      {/* Left Side - 3D Illustration */}
      <div className="hidden lg:flex w-1/2 relative bg-surface-base overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent-sky/5 to-transparent z-10 pointer-events-none"></div>
        <div 
          className="absolute inset-0 z-0"
          style={{ 
            WebkitMaskImage: 'linear-gradient(to right, black 50%, transparent 100%)',
            maskImage: 'linear-gradient(to right, black 50%, transparent 100%)'
          }}
        >
          <Image 
            src="/images/login_illustration.png" 
            alt="3D Illustration" 
            fill
            className="object-cover object-left"
            priority
          />
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 bg-surface-base relative z-10">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center">
            <h1 className="font-display text-4xl font-semibold text-ink-text mb-2 tracking-tight">Belajar Sama AI</h1>
            <p className="text-ink-muted text-sm">
              {isSignUp ? 'Buat akun baru untuk mulai belajar sama AI' : 'Sign in to your account'}
            </p>
          </div>

          <div className="space-y-4">
            {error && (
              <div className="bg-danger/10 border border-danger/30 text-danger text-xs p-3 rounded-lg">
                {error}
              </div>
            )}

            {!isOtpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                
                {isSignUp && (
                  <>
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-ink-muted mb-1.5">Nama Lengkap</label>
                      <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        required={isSignUp}
                        className="w-full bg-surface-base border border-surface-border rounded-lg px-4 py-3 text-ink-text focus:outline-none focus:border-accent-sky focus:ring-1 focus:ring-accent-sky/30 transition-all placeholder:text-ink-muted/50"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-ink-muted mb-1.5">Tanggal Lahir</label>
                      <div className="flex gap-2">
                        <select 
                          value={dobDate}
                          onChange={(e) => setDobDate(e.target.value)}
                          required={isSignUp}
                          className="flex-1 bg-surface-base border border-surface-border rounded-lg px-3 py-3 text-ink-text focus:outline-none focus:border-accent-sky appearance-none text-sm"
                        >
                          <option value="" disabled>Tgl</option>
                          {days.map(d => (
                            <option key={d} value={d}>{d}</option>
                          ))}
                        </select>
                        <select 
                          value={dobMonth}
                          onChange={(e) => setDobMonth(e.target.value)}
                          required={isSignUp}
                          className="flex-[2] bg-surface-base border border-surface-border rounded-lg px-3 py-3 text-ink-text focus:outline-none focus:border-accent-sky appearance-none text-sm"
                        >
                          <option value="" disabled>Bulan</option>
                          {months.map((m, i) => (
                            <option key={m} value={i + 1}>{m}</option>
                          ))}
                        </select>
                        <select 
                          value={dobYear}
                          onChange={(e) => setDobYear(e.target.value)}
                          required={isSignUp}
                          className="flex-[1.5] bg-surface-base border border-surface-border rounded-lg px-3 py-3 text-ink-text focus:outline-none focus:border-accent-sky appearance-none text-sm"
                        >
                          <option value="" disabled>Tahun</option>
                          {years.map(y => (
                            <option key={y} value={y}>{y}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-ink-muted mb-1.5">Email address</label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full bg-surface-base border border-surface-border rounded-lg px-4 py-3 text-ink-text focus:outline-none focus:border-accent-sky focus:ring-1 focus:ring-accent-sky/30 transition-all placeholder:text-ink-muted/50"
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isLoading || !email || (isSignUp && (!name || !dobDate || !dobMonth || !dobYear))}
                  className="w-full btn-academic py-3 flex justify-center items-center"
                >
                  {isLoading ? 'Sending...' : 'Send Magic Code'}
                </button>
              </form>
            ) : (
              <div className="space-y-6 bg-surface-raised border border-surface-border rounded-xl p-6 text-center animate-in fade-in zoom-in duration-300">
                <div className="w-16 h-16 bg-accent-sky/10 text-accent-sky rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-ink-text mb-2">Cek Email Anda!</h3>
                  <p className="text-sm text-ink-muted leading-relaxed">
                    Kami telah mengirimkan tautan masuk ke <span className="text-ink-text font-medium">{email}</span>. Silakan klik tautan tersebut untuk melanjutkan.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => { setIsOtpSent(false); setError(null); }}
                  className="w-full text-sm text-ink-muted hover:text-ink-text transition-colors mt-2"
                >
                  Kembali atau gunakan email lain
                </button>
              </div>
            )}
          </div>
          
          <div className="mt-8 pt-6 border-t border-surface-border text-center">
            {isSignUp ? (
              <p className="text-sm text-ink-muted">
                Sudah punya akun?{' '}
                <button 
                  onClick={() => setIsSignUp(false)}
                  className="text-accent-sky hover:underline font-medium focus:outline-none"
                >
                  Sign in
                </button>
              </p>
            ) : (
              <p className="text-sm text-ink-muted">
                Belum punya akun?{' '}
                <button 
                  onClick={() => setIsSignUp(true)}
                  className="text-accent-sky hover:underline font-medium focus:outline-none"
                >
                  Sign up
                </button>
              </p>
            )}
          </div>
          
          <p className="text-center text-[10px] text-ink-muted/60 mt-8 max-w-xs mx-auto">
            By continuing, you agree to Belajarsama.ai's Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
