import type { Metadata } from 'next';
import { Montserrat, Petit_Formal_Script, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
});

const petitFormal = Petit_Formal_Script({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-display',
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['500', '600'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'Belajar Sama AI | Meja Belajar Digital Cerdas',
  description: 'Belajar sama AI mempermudah Anda merangkum PDF, membuat kuis otomatis, dan memahami materi dengan bantuan kecerdasan buatan (Google Gemini & Groq).',
  keywords: ['belajar sama ai', 'ai belajar', 'merangkum pdf ai', 'kuis otomatis ai', 'meja belajar digital'],
  openGraph: {
    title: 'Belajar Sama AI | Meja Belajar Digital',
    description: 'Platform cerdas untuk belajar sama AI. Rangkum PDF dan uji pemahaman dengan kuis instan.',
    url: 'https://belajarsamaai.vercel.app',
    siteName: 'Belajarsama.ai',
    locale: 'id_ID',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={`${montserrat.variable} ${petitFormal.variable} ${ibmPlexMono.variable} font-body antialiased bg-surface-base text-ink-text selection:bg-accent-sky/30 selection:text-white`}>
        {children}
      </body>
    </html>
  );
}
