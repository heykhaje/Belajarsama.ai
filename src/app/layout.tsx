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
  title: 'Belajarsama.ai',
  description: 'Meja belajar digital untuk menandai, merangkum, dan menguasai materi.',
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
