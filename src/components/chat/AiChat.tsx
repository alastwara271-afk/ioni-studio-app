import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { ChatMessage } from '../../types';
import {
  MessageSquareCode,
  Send,
  Sparkles,
  Bot,
  User,
  Copy,
  Trash2,
  RefreshCw,
  Lightbulb,
} from 'lucide-react';

export const AiChat: React.FC = () => {
  const { t, language, addToast, recordUsage } = useApp();

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('ioni_chat_history');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return [
      {
        id: 'welcome',
        role: 'assistant',
        content: t.chat.welcomeMessage,
        timestamp: new Date().toLocaleTimeString(),
      },
    ];
  });

  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    localStorage.setItem('ioni_chat_history', JSON.stringify(messages));
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (textToSend?: string) => {
    const msg = (textToSend || input).trim();
    if (!msg || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: msg,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const historyPayload = messages.map((m) => ({
        role: m.role,
        text: m.content,
      }));

      const res = await fetch('/api/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: msg,
          history: historyPayload,
          language: language === 'ar' ? 'ar' : 'en',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to get AI response.');
      }

      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.reply || 'No response returned from model.',
        timestamp: new Date().toLocaleTimeString(),
      };

      setMessages((prev) => [...prev, botMessage]);
      recordUsage('chat');
    } catch (err: any) {
      console.error(err);
      addToast('error', err.message || 'Chat error.');
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Error: ${err.message || 'Unable to communicate with AI server.'} Please check server connection.`,
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    const fresh: ChatMessage[] = [
      {
        id: 'welcome',
        role: 'assistant',
        content: t.chat.welcomeMessage,
        timestamp: new Date().toLocaleTimeString(),
      },
    ];
    setMessages(fresh);
    localStorage.setItem('ioni_chat_history', JSON.stringify(fresh));
    addToast('info', language === 'ar' ? 'تم بدء محادثة جديدة' : 'New chat started');
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    addToast('success', t.common.copied);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-yellow-400 to-amber-500 text-black shadow-md shadow-yellow-400/20">
            <MessageSquareCode className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white">{t.chat.title}</h1>
            <p className="text-xs text-slate-400">{t.chat.subtitle}</p>
          </div>
        </div>

        <button
          onClick={handleClearChat}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>{t.chat.newChat}</span>
        </button>
      </div>

      {/* Quick Spark Prompts */}
      <div className="p-3 rounded-2xl bg-[#090C15] border border-slate-800 flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
          <Lightbulb className="w-3.5 h-3.5 text-yellow-400" />
          {t.chat.quickPromptsTitle}
        </span>
        {t.chat.quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(prompt)}
            className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs transition-colors hover:text-white"
          >
            "{prompt}"
          </button>
        ))}
      </div>

      {/* Chat Messages Log */}
      <div className="h-[460px] overflow-y-auto p-4 rounded-2xl bg-[#090C15] border border-slate-800 space-y-4 shadow-inner">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                isUser ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  isUser
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'bg-yellow-400 text-black shadow-md shadow-yellow-400/20 font-bold'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`group relative max-w-[85%] sm:max-w-[75%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-blue-600/25 border border-blue-500/30 text-white rounded-tr-none'
                    : 'bg-[#121626] border border-slate-800 text-slate-200 rounded-tl-none'
                }`}
              >
                <div className="flex items-center justify-between gap-4 mb-1 text-[10px] text-slate-400">
                  <span className="font-bold uppercase tracking-wider">
                    {isUser ? 'You' : 'IONI Master AI'}
                  </span>
                  <span>{msg.timestamp}</span>
                </div>

                <div className="whitespace-pre-wrap font-sans text-slate-200">
                  {msg.content}
                </div>

                {/* Copy button */}
                <button
                  onClick={() => copyMessage(msg.content)}
                  className="absolute bottom-2 right-2 p-1 rounded-md opacity-0 group-hover:opacity-100 bg-slate-800/80 text-slate-400 hover:text-white transition-opacity"
                  title={t.common.copy}
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-yellow-400 text-black flex items-center justify-center font-bold">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3.5 rounded-2xl bg-[#121626] border border-slate-800 text-xs text-yellow-300 flex items-center gap-2">
              <div className="w-3.5 h-3.5 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
              <span>{t.chat.thinking}</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="relative flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t.chat.inputPlaceholder}
          disabled={isLoading}
          className="flex-1 bg-slate-900 border border-slate-700 rounded-2xl py-3.5 px-4 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-yellow-400"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="py-3.5 px-5 rounded-2xl bg-yellow-400 hover:bg-yellow-300 disabled:opacity-40 text-black font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-yellow-400/20 transition-all shrink-0"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">{t.chat.send}</span>
        </button>
      </form>
    </div>
  );
};
