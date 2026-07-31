'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, BookOpen, Calendar, BarChart3, GraduationCap, Settings, LogOut, User, Heart, Edit2, Check, Camera } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase/client';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/my-learning', label: 'My Learning', icon: BookOpen },
  { href: '/schedule', label: 'Schedule', icon: Calendar },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/donasi', label: 'Donasi', icon: Heart },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  
  // Settings Modal State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  // Profile Edit State
  const [isEditingName, setIsEditingName] = useState(false);
  const [editName, setEditName] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function fetchUser() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUserProfile(session.user);
        setEditName(session.user.user_metadata?.full_name || '');
      }
    }
    fetchUser();
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await supabase.auth.signOut();
    router.push('/');
  };

  const handleNameSave = async () => {
    if (!editName.trim()) {
      setIsEditingName(false);
      return;
    }
    setIsSavingProfile(true);
    const { data, error } = await supabase.auth.updateUser({
      data: { full_name: editName.trim() }
    });
    if (!error && data.user) {
      setUserProfile(data.user);
    }
    setIsSavingProfile(false);
    setIsEditingName(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsSavingProfile(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = async () => {
        const canvas = document.createElement('canvas');
        const maxSize = 150;
        let width = img.width;
        let height = img.height;
        
        // Calculate aspect ratio
        if (width > height) {
          if (width > maxSize) {
            height *= maxSize / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width *= maxSize / height;
            height = maxSize;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
          
          const { data, error } = await supabase.auth.updateUser({
            data: { avatar_url: dataUrl }
          });
          
          if (!error && data.user) {
            setUserProfile(data.user);
          }
        }
        setIsSavingProfile(false);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      <motion.nav
        className="fixed left-0 top-0 h-full bg-surface-raised border-r border-surface-border flex flex-col z-40 overflow-hidden select-none"
        animate={{ width: isHovered ? 240 : 56 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex flex-col h-full w-full">
          {/* Logo Section */}
          <div className="flex items-center gap-3 px-4 pt-6 pb-6 min-w-[240px]">
            <div className="w-8 h-8 rounded-md bg-accent-sky flex-shrink-0 flex items-center justify-center">
              <GraduationCap size={16} className="text-surface-base" />
            </div>
            <AnimatePresence>
              {isHovered && (
                <motion.span
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.15, delay: 0.05 }}
                  className="font-display font-semibold text-sm truncate text-ink-text"
                >
                  Belajarsama.ai
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          {/* User Profile Section (Read-only) */}
          <div className="px-4 pb-6 min-w-[240px]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-accent-sky/10 border border-accent-sky/20 flex-shrink-0 flex items-center justify-center overflow-hidden">
                {userProfile?.user_metadata?.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={userProfile.user_metadata.avatar_url} alt="Profile" loading="lazy" decoding="async" className="w-full h-full object-cover" />
                ) : (
                  <User size={16} className="text-accent-sky/60" />
                )}
              </div>
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={{ duration: 0.15, delay: 0.05 }}
                    className="flex flex-col overflow-hidden whitespace-nowrap"
                  >
                    <span className="text-sm font-medium text-ink-text truncate">
                      {userProfile?.user_metadata?.full_name || 'Memuat...'}
                    </span>
                    <span className="text-[10px] text-ink-muted truncate">
                      {userProfile?.email || ''}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col gap-0.5 px-2 min-w-[240px] flex-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href} aria-label={item.label}>
                  <div
                    className={`relative flex items-center gap-3 px-3 py-2 rounded-md group cursor-pointer transition-colors duration-150 ${
                      isActive ? 'bg-accent-soft' : 'hover:bg-white/5'
                    }`}
                  >
                    {isActive && (
                      <span className="absolute left-0 top-1 bottom-1 w-[2.5px] rounded-r-full bg-accent-sky" />
                    )}
                    <Icon
                      size={18}
                      className={`flex-shrink-0 transition-colors duration-150 ${
                        isActive ? 'text-accent-sky' : 'text-ink-muted group-hover:text-ink-text'
                      }`}
                    />
                    <AnimatePresence>
                      {isHovered && (
                        <motion.span
                          initial={{ opacity: 0, x: -6 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -6 }}
                          transition={{ duration: 0.12, delay: 0.04 }}
                          className={`text-xs relative z-10 truncate ${
                            isActive ? 'text-ink-text font-medium' : 'text-ink-muted group-hover:text-ink-text'
                          }`}
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Settings Section (Bottom Left) */}
          <div className="px-2 pb-6 min-w-[240px] mt-auto">
            <div
              onClick={() => setIsSettingsOpen(true)}
              className="relative flex items-center gap-3 px-3 py-2 rounded-md group cursor-pointer transition-colors duration-150 hover:bg-white/5"
            >
              <Settings
                size={18}
                className="flex-shrink-0 text-ink-muted group-hover:text-ink-text transition-colors duration-150"
              />
              <AnimatePresence>
                {isHovered && (
                  <motion.span
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -6 }}
                    transition={{ duration: 0.12, delay: 0.04 }}
                    className="text-xs relative z-10 truncate text-ink-muted group-hover:text-ink-text"
                  >
                    Pengaturan
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Settings Modal Pop-up */}
      <AnimatePresence>
        {isSettingsOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSettingsOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            
            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-sm bg-surface-raised border border-surface-border rounded-xl shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="px-6 py-5 border-b border-surface-border flex items-center gap-3">
                <div className="p-2 rounded-md bg-white/5 text-ink-text">
                  <Settings size={18} />
                </div>
                <h2 className="font-display text-lg font-semibold text-ink-text">Pengaturan Akun</h2>
              </div>
              
              <div className="px-6 py-8 flex flex-col items-center gap-4 relative">
                {isSavingProfile && (
                  <div className="absolute inset-0 bg-surface-raised/80 backdrop-blur-[2px] z-20 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent-sky"></div>
                  </div>
                )}
                
                {/* Profile Avatar Upload */}
                <input 
                  type="file" 
                  accept="image/*"
                  className="hidden" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
                <div 
                  className="relative group cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="w-24 h-24 rounded-full bg-accent-sky/10 flex items-center justify-center border-2 border-accent-sky/20 overflow-hidden">
                    {userProfile?.user_metadata?.avatar_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={userProfile.user_metadata.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <User size={40} className="text-accent-sky/60" />
                    )}
                  </div>
                  <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Camera size={20} className="text-white" />
                  </div>
                </div>

                {/* Profile Info & Edit */}
                <div className="flex flex-col items-center text-center w-full mt-2">
                  <div className="flex items-center gap-2 justify-center w-full">
                    {isEditingName ? (
                      <div className="flex items-center gap-2 w-full max-w-[200px]">
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleNameSave()}
                          autoFocus
                          className="bg-surface-base border border-surface-border text-ink-text text-sm rounded px-3 py-1.5 w-full focus:outline-none focus:border-accent-sky text-center"
                        />
                        <button 
                          onClick={handleNameSave}
                          className="p-1.5 rounded-md bg-accent-sky text-white hover:bg-sky-500 transition-colors"
                        >
                          <Check size={16} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <span className="text-lg font-semibold text-ink-text">
                          {userProfile?.user_metadata?.full_name || 'Pengguna Belajarsama'}
                        </span>
                        <button 
                          onClick={() => setIsEditingName(true)}
                          className="p-1 rounded-md text-ink-muted hover:text-ink-text hover:bg-white/5 transition-colors"
                        >
                          <Edit2 size={14} />
                        </button>
                      </>
                    )}
                  </div>
                  <span className="text-xs text-ink-muted mt-1">
                    {userProfile?.email || 'email@example.com'}
                  </span>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-surface-border bg-black/20 flex justify-end">
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-danger hover:bg-danger/10 border border-transparent hover:border-danger/20 transition-all focus:outline-none"
                >
                  <LogOut size={16} />
                  {isLoggingOut ? 'Keluar...' : 'Logout Akun'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
