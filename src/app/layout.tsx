import type { Metadata } from 'next';
import { Source_Sans_3, Crimson_Pro, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';

const sourceSans3 = Source_Sans_3({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
});

const crimsonPro = Crimson_Pro({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
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
      <body className={`${sourceSans3.variable} ${crimsonPro.variable} ${ibmPlexMono.variable} font-body antialiased bg-surface-base text-ink-text`}>
        {children}
      </body>
    </html>
  );
}
