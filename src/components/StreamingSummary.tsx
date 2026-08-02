'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Languages, ChevronDown, X, Brain } from 'lucide-react';

function parseThinkingTags(text: string): { visible: string; thinkingBlocks: { id: number; content: string }[] } {
  const blocks: { id: number; content: string }[] = [];
  let counter = 0;

  let visible = text.replace(/<think>([\s\S]*?)<\/think>/g, (_, content) => {
    blocks.push({ id: counter++, content: content.trim() });
    return '';
  });

  // Tag <think> yang belum ditutup (masih streaming) — sembunyikan sampai akhir teks
  visible = visible.replace(/<think>([\s\S]*)$/, (_, content) => {
    blocks.push({ id: counter++, content: content.trim() });
    return '';
  });

  return { visible: visible.trim(), thinkingBlocks: blocks };
}

function ThinkingAccordion({ blocks }: { blocks: { id: number; content: string }[] }) {
  const [openId, setOpenId] = useState<number | null>(null);

  if (blocks.length === 0) return null;

  return (
    <div className="mb-4 space-y-1">
      {blocks.map((block) => (
        <div key={block.id} className="thinking-accordion">
          <button
            type="button"
            className="thinking-accordion-trigger"
            data-state={openId === block.id ? 'open' : 'closed'}
            aria-expanded={openId === block.id}
            onClick={() => setOpenId(openId === block.id ? null : block.id)}
          >
            <span className="flex items-center gap-2">
              <Brain size={13} />
              Pola pemikiran AI
            </span>
            <ChevronDown size={14} className="thinking-accordion-chevron" />
          </button>
          <AnimatePresence initial={false}>
            {openId === block.id && (
              <motion.div
                key="content"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <div className="thinking-accordion-content prose prose-sm prose-zinc prose-p:font-display prose-p:text-ink-muted prose-headings:font-display prose-headings:text-ink-text max-w-none break-words overflow-x-hidden prose-pre:max-w-[85vw] sm:prose-pre:max-w-full prose-pre:overflow-x-auto">
                  <ReactMarkdown>{block.content}</ReactMarkdown>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

export default function StreamingSummary({ 
  materialId, 
  initialSummaryText,
  status 
}: { 
  materialId: string;
  initialSummaryText?: string;
  status: string;
}) {
  const router = useRouter();
  const [completion, setCompletion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [activeLang, setActiveLang] = useState<'original' | 'en' | 'id'>('original');
  
  const hasStarted = useRef(false);

  const startStream = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setCompletion('');
    
    try {
      const res = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ materialId })
      });
      
      if (!res.ok) throw new Error(await res.text());
      
      const reader = res.body?.getReader();
      if (!reader) throw new Error("No reader");
      
      const decoder = new TextDecoder();
      let done = false;
      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          setCompletion(prev => prev + decoder.decode(value, { stream: !done }));
        }
      }
      setIsLoading(false);
      router.refresh();
    } catch (err: any) {
      setError(err);
      setIsLoading(false);
    }
  }, [materialId, router]);

  useEffect(() => {
    if (!initialSummaryText && !hasStarted.current) {
      hasStarted.current = true;
      startStream();
    }
  }, [initialSummaryText, startStream]);

  const handleTranslate = useCallback(async (targetLang: 'en' | 'id') => {
    if (activeLang === targetLang) {
      setActiveLang('original');
      setTranslatedText('');
      return;
    }

    const sourceText = initialSummaryText || completion;
    if (!sourceText) return;

    setActiveLang(targetLang);
    setTranslatedText('');
    setIsTranslating(true);

    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: sourceText, targetLang })
      });

      if (!res.ok) throw new Error(await res.text());

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No reader");

      const decoder = new TextDecoder();
      let done = false;
      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          setTranslatedText(prev => prev + decoder.decode(value, { stream: !done }));
        }
      }
      setIsTranslating(false);
    } catch (err: any) {
      setError(err);
      setIsTranslating(false);
      setActiveLang('original');
    }
  }, [activeLang, initialSummaryText, completion]);

  const originalText = initialSummaryText || completion;
  const displayText = activeLang === 'original' ? originalText : translatedText;
  const parsed = displayText ? parseThinkingTags(displayText) : { visible: '', thinkingBlocks: [] };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {originalText && !isLoading && (
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-surface-border">
          <Languages size={16} className="text-ink-muted" />
          <span className="text-xs text-ink-muted mr-1">Terjemahkan:</span>
          <button
            onClick={() => handleTranslate('id')}
            disabled={isTranslating && activeLang !== 'id'}
            className={`text-xs px-3 py-1.5 rounded-md font-medium transition-all ${
              activeLang === 'id'
                ? 'bg-accent-soft text-accent-sky border border-accent-sky/30'
                : 'bg-surface-raised text-ink-muted border border-surface-border hover:border-accent-sky/50 hover:text-ink-text'
            }`}
          >
            Indonesia
          </button>
          <button
            onClick={() => handleTranslate('en')}
            disabled={isTranslating && activeLang !== 'en'}
            className={`text-xs px-3 py-1.5 rounded-md font-medium transition-all ${
              activeLang === 'en'
                ? 'bg-accent-soft text-accent-sky border border-accent-sky/30'
                : 'bg-surface-raised text-ink-muted border border-surface-border hover:border-accent-sky/50 hover:text-ink-text'
            }`}
          >
            English
          </button>
          {activeLang !== 'original' && (
            <button
              onClick={() => { setActiveLang('original'); setTranslatedText(''); }}
              className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-md font-medium bg-surface-raised text-ink-muted border border-surface-border hover:border-danger/50 hover:text-danger transition-all ml-1"
            >
              <X size={12} />
              Asli
            </button>
          )}
        </div>
      )}

      <div className="prose prose-zinc prose-p:text-ink-muted prose-headings:text-ink-text prose-strong:text-white max-w-none break-words overflow-x-hidden prose-pre:max-w-[85vw] sm:prose-pre:max-w-full prose-pre:overflow-x-auto overflow-y-auto pr-4 pb-20">
        {error && (
          <div className="bg-danger/10 p-4 rounded-lg mb-4 border border-danger/30 flex flex-col gap-3">
            <p className="text-danger text-sm font-medium">Gagal membuat ringkasan: {error.message}</p>
            <button
              onClick={() => startStream()}
              className="self-start text-xs font-semibold px-3 py-1.5 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors"
            >
              Coba Buat Ulang
            </button>
          </div>
        )}
        
        {!originalText && isLoading && (
          <div className="flex items-center gap-2 text-ink-muted animate-pulse">
            <span className="w-2 h-2 bg-accent-sky rounded-full"></span>
            <span className="text-sm">AI sedang membaca dan meringkas dokumen...</span>
          </div>
        )}

        {isTranslating && !translatedText && (
          <div className="flex items-center gap-2 text-ink-muted animate-pulse">
            <span className="w-2 h-2 bg-accent-sky rounded-full"></span>
            <span className="text-sm">AI sedang menerjemahkan...</span>
          </div>
        )}

        {parsed.visible ? (
          <>
            <ThinkingAccordion blocks={parsed.thinkingBlocks} />
            <div className="prose prose-zinc prose-p:font-display prose-p:text-ink-muted prose-headings:font-display prose-headings:text-ink-text prose-strong:text-white max-w-none break-words overflow-x-hidden prose-pre:max-w-[85vw] sm:prose-pre:max-w-full prose-pre:overflow-x-auto">
              <ReactMarkdown>{parsed.visible}</ReactMarkdown>
            </div>
          </>
        ) : !isLoading && !isTranslating ? (
          <div className="flex flex-col items-center justify-center gap-3 py-12 text-ink-muted">
            <p className="text-sm">Ringkasan belum tersedia untuk materi ini.</p>
            <button
              onClick={() => startStream()}
              className="btn-academic text-xs"
            >
              Buat Ringkasan Sekarang
            </button>
          </div>
        ) : null}

        {(isLoading || isTranslating) && displayText && (
          <span className="inline-block w-2 h-4 ml-1 bg-accent-sky animate-pulse align-middle" />
        )}
      </div>
    </div>
  );
}
