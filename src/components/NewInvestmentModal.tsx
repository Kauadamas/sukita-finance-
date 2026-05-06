import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, TrendingUp, DollarSign, Calendar, Tag } from 'lucide-react';
import { Investment } from '../types';
import { cn, formatDateInput, formatDateBR } from '../lib/utils';

interface NewInvestmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddInvestment?: (investment: Investment) => void;
  selectedMonth: number;
  selectedYear: number;
}

export function NewInvestmentModal({ isOpen, onClose, onAddInvestment, selectedMonth, selectedYear }: NewInvestmentModalProps) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'fixed' | 'fund' | 'risk'>('fixed');
  const [category, setCategory] = useState('Tesouro Direto');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  // Update date when modal opens based on selected month/year
  React.useEffect(() => {
    if (isOpen) {
      const now = new Date();
      const defaultDate = new Date(selectedYear, selectedMonth, now.getDate());
      setDate(formatDateInput(defaultDate));
    }
  }, [isOpen, selectedMonth, selectedYear]);

  const investmentTypes = [
    { id: 'fixed', label: 'Renda Fixa', color: 'text-brand-purple', bg: 'bg-brand-purple/10' },
    { id: 'fund', label: 'Fundos', color: 'text-brand-orange', bg: 'bg-brand-orange/10' },
    { id: 'risk', label: 'Risco (Ações/Cripto)', color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
  ];

  const categories = {
    fixed: ['Tesouro Direto', 'CDB', 'LCI/LCA', 'Debêntures'],
    fund: ['Fundo Imobiliário (FII)', 'Fundo de Ações', 'Fundo Multimercado'],
    risk: ['Ações', 'Criptomoedas', 'ETFs', 'BDRs'],
  };

  const handleConfirm = () => {
    if (!name || !amount) return;

    const newInvestment: Investment = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      amount: parseFloat(amount),
      currentValue: parseFloat(amount), // Initial current value is the same as amount
      type,
      category,
      date,
      profitability: 0,
    };

    onAddInvestment?.(newInvestment);
    onClose();
    
    // Reset form
    setName('');
    setAmount('');
    setType('fixed');
    setCategory('Tesouro Direto');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
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
          className="relative w-full max-w-sm glass p-6 rounded-[2.5rem] shadow-2xl border border-white/20"
        >
          <button 
            onClick={onClose}
            className="absolute right-6 top-6 p-2 text-slate-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>

          <h3 className="text-xl font-bold mb-6">Novo Investimento</h3>

          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Nome do Ativo</label>
              <div className="relative">
                <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Tesouro Selic 2029"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 outline-none focus:border-brand-purple transition-colors text-sm"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Tipo de Alocação</label>
              <div className="grid grid-cols-3 gap-2">
                {investmentTypes.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setType(t.id as any);
                      setCategory(categories[t.id as keyof typeof categories][0]);
                    }}
                    className={cn(
                      "flex flex-col items-center p-2 rounded-xl transition-all border text-center",
                      type === t.id 
                        ? "bg-white/10 border-white/20" 
                        : "border-transparent hover:bg-white/5"
                    )}
                  >
                    <span className={cn("text-[9px] font-bold uppercase tracking-tighter", t.color)}>{t.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Categoria</label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 outline-none focus:border-brand-purple transition-colors text-slate-300 appearance-none text-sm"
                >
                  {categories[type].map(cat => (
                    <option key={cat} value={cat} className="bg-[#0F172A]">{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Data da Compra</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                  <input 
                    id="dataInvestimento"
                    type="date" 
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 outline-none focus:border-brand-purple transition-colors text-slate-300 text-sm"
                  />
                </div>
                <p className="text-[8px] text-slate-500 mt-1 font-medium ml-4">
                  Formatada: <span className="text-brand-purple">{formatDateBR(date)}</span>
                </p>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Valor Investido</label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0,00"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 outline-none focus:border-brand-purple transition-colors text-sm"
                />
              </div>
            </div>

            <div className="pt-2">
              <button 
                onClick={handleConfirm}
                className="w-full py-3.5 bg-gradient-to-r from-brand-purple to-brand-orange text-white rounded-2xl font-bold text-sm shadow-lg shadow-brand-purple/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Confirmar Investimento
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
