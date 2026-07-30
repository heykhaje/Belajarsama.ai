import type { Metadata } from 'next';
import { Space_Grotesk, IBM_Plex_Sans, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';
import Sidebar from '@/components/Sidebar';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-display',
});

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-body',
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['500', '600'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'Belajarsama.ai',
  description: 'Meja belajar digital untuk menandai, merangkum, dan menguasai materi.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="dark">
      <body className={`${spaceGrotesk.variable} ${ibmPlexSans.variable} ${ibmPlexMono.variable} font-body antialiased bg-surface-base text-ink-text`}>
        <Sidebar />
        <main className="ml-14 min-h-screen flex flex-col">
          <div className="flex-1 p-6 lg:p-8">
            {children}
          </div>
          <footer className="border-t border-surface-border px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between max-w-4xl">
              <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted/50">
                Belajarsama.ai
              </span>
              <a
                href="https://adji.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[10px] uppercase tracking-wider text-ink-muted/50 hover:text-ink-muted transition-colors duration-150"
              >
                adji.dev &copy; 2026
              </a>
            </div>
          </footer>
        </main>
      </body>
    </html>
  );
}
