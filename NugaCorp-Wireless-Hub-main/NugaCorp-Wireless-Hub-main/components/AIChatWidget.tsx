
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Bot, User } from 'lucide-react';
import { getAISupportResponse } from '../services/geminiService';
import { MOCK_CLIENT } from '../constants';

const AIChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'ai' | 'user', text: string}[]>([
    { role: 'ai', text: '¡Hola! Soy NugaBot. ¿En qué puedo ayudarte hoy con tu servicio de internet?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    
    setIsTyping(true);
    const aiResponse = await getAISupportResponse(userMsg, MOCK_CLIENT);
    setIsTyping(false);
    
    setMessages(prev => [...prev, { role: 'ai', text: aiResponse || 'No pude procesar tu solicitud.' }]);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-indigo-700 transition-all z-50 animate-bounce"
        aria-label="Chat de soporte"
      >
        <MessageSquare size={24} />
      </button>

      {isOpen && (
        <div className="fixed bottom-0 right-0 sm:bottom-24 sm:right-6 w-full sm:w-[400px] h-full sm:h-[550px] sm:max-h-[calc(100vh-120px)] dark-glass border-t sm:border border-slate-700 sm:rounded-3xl shadow-2xl flex flex-col z-50 overflow-hidden text-white transition-all duration-300 animate-in slide-in-from-bottom sm:zoom-in">
          <div className="p-4 border-b border-slate-700 flex items-center justify-between bg-indigo-600 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Bot size={24} />
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base">Soporte Inteligente</h3>
                <p className="text-[10px] opacity-80 uppercase font-black tracking-widest">En línea</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-black/20 p-2 rounded-full transition-all">
              <X size={20} />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900/50 custom-scrollbar">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl flex gap-2 ${
                  m.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-slate-800 text-slate-200 rounded-tl-none'
                }`}>
                  <div className="shrink-0 pt-1">
                    {m.role === 'ai' ? <Bot size={14} /> : <User size={14} />}
                  </div>
                  <p className="text-xs sm:text-sm leading-relaxed">{m.text}</p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-slate-800 p-3 rounded-2xl rounded-tl-none flex gap-2">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{animationDelay: '0s'}}></span>
                    <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                    <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-slate-800/80 border-t border-slate-700 shrink-0">
            <div className="flex items-center gap-2 bg-slate-900 rounded-full pl-4 pr-2 py-1.5 sm:py-2 border border-slate-700 focus-within:border-indigo-500 transition-all">
              <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                type="text" 
                placeholder="Escribe aquí..." 
                className="flex-1 bg-transparent border-none outline-none text-xs sm:text-sm placeholder:text-slate-500"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim()}
                className="w-8 h-8 sm:w-10 sm:h-10 bg-indigo-600 rounded-full flex items-center justify-center hover:bg-indigo-500 transition-all disabled:opacity-50"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChatWidget;
