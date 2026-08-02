'use client';

import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Send, User, Bot, Loader2 } from 'lucide-react';

type Message = {
  role: 'user' | 'ai';
  content: string;
};

export default function MaterialChatbot({ materialId }: { materialId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, { role: 'user', content: userMsg }],
          materialId,
        }),
      });

      if (!response.ok) throw new Error('Gagal menghubungi AI');
      
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) throw new Error('No reader');

      setMessages(prev => [...prev, { role: 'ai', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        setMessages(prev => {
          const newMsgs = [...prev];
          newMsgs[newMsgs.length - 1].content += chunk;
          return newMsgs;
        });
      }
    } catch (error: any) {
      console.error(error);
      setMessages(prev => [
        ...prev, 
        { role: 'ai', content: 'Maaf, terjadi kesalahan saat menghubungi AI. Silakan coba lagi.' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full mt-10 bg-surface-base border border-surface-border rounded-xl overflow-hidden shadow-sm flex flex-col h-[500px]">
      <div className="bg-surface-raised px-6 py-4 border-b border-surface-border flex items-center gap-2">
        <Bot size={18} className="text-accent-sky" />
        <h3 className="font-display font-medium text-ink-text">Tanya AI tentang Materi Ini</h3>
      </div>
      
      <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-ink-muted text-center space-y-3">
            <Bot size={32} className="opacity-20" />
            <p className="text-sm">Ada bagian yang kurang jelas? <br/>Tanyakan langsung ke Gemini!</p>
          </div>
        ) : (
          messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-accent-sky/20 text-accent-sky' : 'bg-surface-raised border border-surface-border text-ink-text'}`}>
                {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
              </div>
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${msg.role === 'user' ? 'bg-accent-sky text-white rounded-tr-sm' : 'bg-surface-raised border border-surface-border text-ink-text rounded-tl-sm'}`}>
                {msg.role === 'user' ? (
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                ) : (
                  <div className="prose prose-zinc prose-sm prose-p:leading-relaxed prose-pre:bg-surface-base prose-pre:border prose-pre:border-surface-border prose-strong:text-white max-w-none">
                    <ReactMarkdown>
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex gap-3 flex-row">
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-surface-raised border border-surface-border text-ink-text">
              <Bot size={14} />
            </div>
            <div className="bg-surface-raised border border-surface-border rounded-2xl rounded-tl-sm px-4 py-3 flex items-center">
              <Loader2 size={14} className="animate-spin text-accent-sky" />
              <span className="text-xs text-ink-muted ml-2">Gemini sedang mengetik...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-surface-raised border-t border-surface-border">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tanyakan sesuatu..."
            className="flex-1 bg-surface-base border border-surface-border rounded-full px-5 py-2.5 text-sm text-ink-text focus:outline-none focus:border-accent-sky focus:ring-1 focus:ring-accent-sky transition-all placeholder:text-ink-muted/50"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="w-10 h-10 rounded-full bg-accent-sky text-white flex items-center justify-center flex-shrink-0 hover:bg-accent-sky/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={16} className={input.trim() ? 'ml-1' : ''} />
          </button>
        </form>
      </div>
    </div>
  );
}
