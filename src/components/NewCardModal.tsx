import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CreditCard as CardIcon, Palette, DollarSign } from 'lucide-react';
import { cn } from '../lib/utils';
import { CreditCard } from '../types';

interface NewCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCard: (card: CreditCard) => void;
}

export function NewCardModal({ isOpen, onClose, onAddCard }: NewCardModalProps) {
  const [name, setName] = useState('');
  const [lastFour, setLastFour] = useState('');
  const [limit, setLimit] = useState('');
  const [dueDate, setDueDate] = useState('10');
  const [closingDate, setClosingDate] = useState('03');
  const [selectedColor, setSelectedColor] = useState('from-brand-purple to-brand-orange');

  const colors = [
    { name: 'Roxo/Laranja', value: 'from-brand-purple to-brand-orange' },
    { name: 'Azul/Ciano', value: 'from-blue-600 to-cyan-400' },
    { name: 'Verde/Esmeralda', value: 'from-emerald-600 to-teal-400' },
    { name: 'Rosa/Roxo', value: 'from-pink-600 to-purple-500' },
    { name: 'Laranja/Amarelo', value: 'from-orange-500 to-yellow-400' },
    { name: 'Escuro/Slate', value: 'from-slate-800 to-slate-600' },
  ];

  const handleConfirm = () => {
    if (!name || !lastFour || !limit) return;

    const newCard: CreditCard = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      lastFour: lastFour.slice(-4),
      limit: parseFloat(limit),
      used: 0,
      dueDate: `2026-04-${dueDate.padStart(2, '0')}`,
      closingDate: `2026-04-${closingDate.padStart(2, '0')}`,
      color: selectedColor,
    };

    onAddCard(newCard);
    onClose();
    
    // Reset
    setName('');
    setLastFour('');
    setLimit('');
    setDueDate('10');
    setClosingDate('03');
    setSelectedColor('from-brand-purple to-brand-orange');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-sm glass p-5 rounded-3xl shadow-2xl border border-white/20"
        >
          <button 
            onClick={onClose}
            className="absolute right-4 top-4 p-2 text-slate-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>

          <h3 className="text-lg font-bold mb-4 flex items-center">
            <CardIcon size={20} className="mr-2 text-brand-purple" />
            Novo Cartão de Crédito
          </h3>

          <div className="space-y-3">
            <div>
              <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Nome do Cartão (Ex: Nubank)</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Visa Platinum..."
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 outline-none focus:border-brand-purple transition-colors text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Últimos 4 Dígitos</label>
                <input 
                  type="text" 
                  maxLength={4}
                  value={lastFour}
                  onChange={(e) => setLastFour(e.target.value.replace(/\D/g, ''))}
                  placeholder="0000"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 outline-none focus:border-brand-purple transition-colors text-sm"
                />
              </div>
              <div>
                <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Limite Total</label>
                <div className="relative">
                  <DollarSign size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input 
                    type="number" 
                    value={limit}
                    onChange={(e) => setLimit(e.target.value)}
                    placeholder="0,00"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-8 pr-4 outline-none focus:border-brand-purple transition-colors text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Dia do Vencimento</label>
                <select 
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 outline-none focus:border-brand-purple transition-colors text-slate-400 appearance-none text-sm"
                >
                  {Array.from({ length: 31 }, (_, i) => (
                    <option key={i + 1} value={String(i + 1)}>{i + 1}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Dia do Fechamento</label>
                <select 
                  value={closingDate}
                  onChange={(e) => setClosingDate(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 outline-none focus:border-brand-purple transition-colors text-slate-400 appearance-none text-sm"
                >
                  {Array.from({ length: 31 }, (_, i) => (
                    <option key={i + 1} value={String(i + 1)}>{i + 1}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Estilo do Cartão</label>
              <div className="grid grid-cols-6 gap-2">
                {colors.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => setSelectedColor(c.value)}
                    className={cn(
                      "w-full aspect-square rounded-lg bg-gradient-to-br transition-all border-2",
                      c.value,
                      selectedColor === c.value ? "border-white scale-110" : "border-transparent opacity-60 hover:opacity-100"
                    )}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            <button 
              onClick={handleConfirm}
              className="w-full py-2.5 bg-gradient-to-r from-brand-purple to-brand-orange text-white rounded-xl font-bold text-sm shadow-lg shadow-brand-purple/20 hover:scale-[1.02] active:scale-[0.98] transition-all mt-1"
            >
              Adicionar Cartão
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
