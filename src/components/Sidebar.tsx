'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, BookOpen, Calendar, BarChart3, GraduationCap } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/my-learning', label: 'My Learning', icon: BookOpen },
  { href: '/schedule', label: 'Schedule', icon: Calendar },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.nav
      className="fixed left-0 top-0 h-full bg-[#0E1116] border-r border-surface-border flex flex-col z-40 overflow-hidden select-none"
      animate={{ width: isHovered ? 240 : 56 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center gap-3 px-4 pt-6 pb-8 min-w-[240px]">
        <div className="w-8 h-8 rounded-md bg-accent-highlighter flex-shrink-0 flex items-center justify-center">
          <GraduationCap size={16} className="text-[#0E1116]" />
        </div>
        <AnimatePresence>
          {isHovered && (
            <motion.span
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.15, delay: 0.05 }}
              className="font-display font-semibold text-sm truncate text-ink-text tracking-tight"
            >
              Belajarsama.ai
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <div className="flex flex-col gap-0.5 px-2 min-w-[240px]">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} aria-label={item.label}>
              <div
                className={`relative flex items-center gap-3 px-3 py-2 rounded-md group cursor-pointer transition-colors duration-150 ${
                  isActive ? 'bg-white/5' : 'hover:bg-white/5'
                }`}
              >
                {isActive && (
                  <span className="absolute left-0 top-1 bottom-1 w-[2.5px] rounded-r-full bg-accent-highlighter" />
                )}
                <Icon
                  size={18}
                  className={`flex-shrink-0 transition-colors duration-150 ${
                    isActive ? 'text-accent-highlighter' : 'text-ink-muted group-hover:text-ink-text'
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
    </motion.nav>
  );
}
