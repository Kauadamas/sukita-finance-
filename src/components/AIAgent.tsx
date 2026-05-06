import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Bot, User, Sparkles, Loader2 } from 'lucide-react';
import { getFinancialAdvice } from '../services/gemini';
import { cn } from '../lib/utils';

interface Message {
  role: 'user' | 'ai';
  content: string;
}

export function AIAgent() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', content: 'Olá! Sou seu Agente Financeiro SukitaFinançe. Como posso te ajudar hoje? Você pode me perguntar sobre investimentos, seu saldo ou planejamento para compras.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      // In a real app, we'd pass actual user data here
      const context = "Usuário tem R$ 15.000,00 de saldo, gasta muito com delivery, tem meta de reserva de R$ 24.000,00 (está em 50%) e trabalha com assistência técnica SukitaFinançe.";
      const result = await getFinancialAdvice(`Pergunta do usuário: ${userMsg}\nContexto: ${context}`);
      
      setMessages(prev => [...prev, { role: 'ai', content: result.advice || "Desculpe, tive um problema ao processar sua solicitação." }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', content: "Erro ao conectar com a inteligência artificial." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col glass rounded-[2rem] overflow-hidden">
      <div className="p-6 border-b border-white/10 bg-brand-purple/10 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-brand-purple flex items-center justify-center">
            <Bot size={24} className="text-white" />
          </div>
          <div>
            <h3 className="font-bold">Agente SukitaFinançe</h3>
            <p className="text-xs text-brand-purple font-medium">Online e pronto para ajudar</p>
          </div>
        </div>
        <Sparkles className="text-brand-purple animate-pulse" />
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide"
      >
        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex items-start space-x-3",
                msg.role === 'user' ? "flex-row-reverse space-x-reverse" : ""
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                msg.role === 'ai' ? "bg-brand-purple/20 text-brand-purple" : "bg-brand-orange/20 text-brand-orange"
              )}>
                {msg.role === 'ai' ? <Bot size={16} /> : <User size={16} />}
              </div>
              <div className={cn(
                "max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed",
                msg.role === 'ai' ? "bg-white/5 border border-white/10" : "bg-brand-purple text-white"
              )}>
                {msg.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && (
          <div className="flex items-center space-x-2 text-slate-400 text-sm">
            <Loader2 size={16} className="animate-spin" />
            <span>SukitaFinançe está pensando...</span>
          </div>
        )}
      </div>

      <div className="p-6 bg-white/5 border-t border-white/10">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Pergunte qualquer coisa sobre suas finanças..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-6 pr-16 outline-none focus:border-brand-purple transition-colors"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-2 top-2 bottom-2 w-12 bg-brand-purple rounded-xl flex items-center justify-center text-white hover:bg-brand-purple/80 transition-colors disabled:opacity-50"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
