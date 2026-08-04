'use client';

import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Send, User, Bot, Loader2, X, MessageSquareText } from 'lucide-react';

type Message = {
  role: 'user' | 'ai';
  content: string;
};

export default function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isLoading, isOpen]);

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
    <div className="fixed bottom-24 md:bottom-6 right-4 md:right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="w-[350px] sm:w-[400px] h-[500px] max-h-[calc(100vh-100px)] bg-surface-base border border-surface-border rounded-2xl shadow-2xl flex flex-col mb-4 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="bg-surface-raised px-5 py-3 border-b border-surface-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-accent-sky/20 flex items-center justify-center text-accent-sky">
                <Bot size={18} />
              </div>
              <div>
                <h3 className="font-display font-medium text-ink-text text-sm">JIRA</h3>
                <p className="text-[10px] text-ink-muted">Belajarsama.ai</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-ink-muted hover:text-ink-text p-1 rounded-md hover:bg-white/5 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
          
          {/* Messages */}
          <div className="flex-1 p-5 overflow-y-auto flex flex-col gap-4 bg-surface-base/50">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-ink-muted text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-surface-raised border border-surface-border flex items-center justify-center mb-2">
                  <Bot size={28} className="text-accent-sky opacity-80" />
                </div>
                <p className="text-sm">Halo! Saya JIRA.<br/>Ada yang bisa saya bantu untuk pelajaran hari ini?</p>
              </div>
            ) : (
              messages.map((msg, i) => (
                <div key={i} className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-accent-sky/20 text-accent-sky' : 'bg-surface-raised border border-surface-border text-ink-text'}`}>
                    {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                  </div>
                  <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${msg.role === 'user' ? 'bg-accent-sky text-white rounded-tr-sm' : 'bg-surface-raised border border-surface-border text-white rounded-tl-sm'}`}>
                    {msg.role === 'user' ? (
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    ) : (
                      <div className="prose prose-sm prose-p:leading-relaxed prose-pre:bg-surface-base prose-pre:border prose-pre:border-surface-border prose-p:text-white prose-li:text-white prose-strong:text-white prose-headings:text-white text-white max-w-none text-[13px]">
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
              <div className="flex gap-2.5 flex-row">
                <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 bg-surface-raised border border-surface-border text-ink-text">
                  <Bot size={14} />
                </div>
                <div className="bg-surface-raised border border-surface-border rounded-2xl rounded-tl-sm px-4 py-2.5 flex items-center">
                  <Loader2 size={14} className="animate-spin text-accent-sky" />
                  <span className="text-xs text-ink-muted ml-2">Mengetik...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-surface-raised border-t border-surface-border">
            <form onSubmit={handleSubmit} className="flex gap-2 relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ketik pesan..."
                className="flex-1 bg-surface-base border border-surface-border rounded-full pl-4 pr-10 py-2.5 text-sm text-ink-text focus:outline-none focus:border-accent-sky focus:ring-1 focus:ring-accent-sky transition-all placeholder:text-ink-muted/50"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="absolute right-1 top-1 w-8 h-8 rounded-full bg-accent-sky text-white flex items-center justify-center flex-shrink-0 hover:bg-accent-sky/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={14} className={input.trim() ? 'ml-0.5' : ''} />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${isOpen ? 'bg-surface-raised border border-surface-border text-ink-muted hover:text-ink-text scale-90' : 'bg-accent-sky text-white hover:scale-105 hover:shadow-accent-sky/20 hover:shadow-xl'}`}
      >
        {isOpen ? <X size={24} /> : <MessageSquareText size={24} />}
      </button>
    </div>
  );
}
