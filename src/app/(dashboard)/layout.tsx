import Sidebar from '@/components/Sidebar';
import FloatingChatbot from '@/components/FloatingChatbot';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Sidebar />
      <main className="md:ml-14 pb-16 md:pb-0 min-h-screen flex flex-col">
        <div className="flex-1 w-full max-w-[1400px] mx-auto p-4 lg:p-8">
          {children}
        </div>
        <footer className="border-t border-surface-border px-6 lg:px-8 py-4">
          <div className="flex flex-col items-start gap-2">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-display font-semibold text-xs tracking-wide text-ink-text">
                Belajarsama.ai
              </span>
              <span className="text-ink-muted/30 text-[10px] hidden sm:inline">&bull;</span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">
                &copy; 2026 Hak Cipta Dilindungi
              </span>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 md:gap-4 font-mono text-[10px] uppercase tracking-wider text-ink-muted/70">
              <a href="/privacy-policy" className="hover:text-ink-text transition-colors">Privacy Policy</a>
              <span className="text-ink-muted/30">&bull;</span>
              <a href="/terms-of-service" className="hover:text-ink-text transition-colors">Terms of Service</a>
              <span className="text-ink-muted/30">&bull;</span>
              <a
                href="https://adjiprasetyo-lilac.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-ink-text transition-colors flex items-center gap-1"
              >
                Designed by <span className="text-accent-sky font-semibold">adji.dev</span>
              </a>
            </div>
          </div>
        </footer>
        <FloatingChatbot />
      </main>
    </>
  );
}
