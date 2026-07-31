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

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
    if (error) setError(error.message);
    setIsLoading(false);
  };

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
      setError(error.message);
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
            <h1 className="font-display text-4xl font-semibold text-ink-text mb-2 tracking-tight">Belajarsama.ai</h1>
            <p className="text-ink-muted text-sm">
              {isSignUp ? 'Buat akun baru untuk mulai belajar' : 'Sign in to your account'}
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 bg-surface-base border border-surface-border hover:bg-white/5 text-ink-text px-4 py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                <path d="M1 1h22v22H1z" fill="none" />
              </svg>
              {isSignUp ? 'Sign up with Google' : 'Continue with Google'}
            </button>

            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-surface-border"></div>
              <span className="flex-shrink-0 mx-4 text-ink-muted text-xs uppercase tracking-wider font-mono">or continue with email</span>
              <div className="flex-grow border-t border-surface-border"></div>
            </div>

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
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <label htmlFor="otp" className="block text-sm font-medium text-ink-muted mb-1.5">Enter access code</label>
                  <input
                    id="otp"
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="12345678"
                    required
                    maxLength={10}
                    className="w-full bg-surface-base border border-surface-border rounded-lg px-4 py-3 text-ink-text text-center text-xl tracking-widest font-mono focus:outline-none focus:border-accent-sky focus:ring-1 focus:ring-accent-sky/30 transition-all placeholder:text-ink-muted/30"
                  />
                  <p className="text-[11px] text-ink-muted mt-2 text-center">
                    We sent a code to <span className="text-ink-text font-medium">{email}</span>
                  </p>
                </div>
                <button
                  type="submit"
                  disabled={isLoading || otp.length < 6}
                  className="w-full btn-academic py-3 flex justify-center items-center"
                >
                  {isLoading ? 'Verifying...' : 'Verify Code'}
                </button>
                <button
                  type="button"
                  onClick={() => { setIsOtpSent(false); setOtp(''); setError(null); }}
                  className="w-full text-xs text-ink-muted hover:text-ink-text transition-colors mt-2"
                >
                  Back to email
                </button>
              </form>
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
