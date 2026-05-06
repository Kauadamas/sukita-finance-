import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, ArrowUpRight, ArrowDownRight, Receipt, Wrench, CreditCard as CardIcon, DollarSign } from 'lucide-react';
import { Transaction, CreditCard } from '../types';
import { MOCK_CARDS } from '../constants';
import { cn, formatCurrency, formatDateBR, formatDateInput } from '../lib/utils';

interface NewEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddEntry?: (entry: any) => void;
  onUpdateEntry?: (entry: any) => void;
  editData?: any;
  cards: CreditCard[];
  allTransactions: Transaction[];
  initialCardId?: string;
  initialCategory?: string;
  initialDescription?: string;
  selectedMonth: number;
  selectedYear: number;
}

type EntryType = 'expense' | 'income';
type EntryStatus = 'paid' | 'pending' | 'overdue';

export function NewEntryModal({ 
  isOpen, 
  onClose, 
  onAddEntry, 
  onUpdateEntry,
  editData,
  cards, 
  allTransactions, 
  initialCardId, 
  initialCategory, 
  initialDescription,
  selectedMonth,
  selectedYear
}: NewEntryModalProps) {
  const [type, setType] = useState<EntryType>(editData?.type === 'inflow' ? 'income' : 'expense');
  const [status, setStatus] = useState<EntryStatus>(editData?.status || 'pending');
  const [description, setDescription] = useState(editData?.description || initialDescription || '');
  const [amount, setAmount] = useState(editData?.amount?.toString() || '');
  const [date, setDate] = useState(editData?.date || new Date().toISOString().split('T')[0]);
  const [purchaseDate, setPurchaseDate] = useState(editData?.purchaseDate || editData?.date || new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState(editData?.category || initialCategory || 'Outros');
  const [cardId, setCardId] = useState(editData?.cardId || initialCardId || '');
  const [installments, setInstallments] = useState(editData?.installments?.toString() || '1');
  const [serviceType, setServiceType] = useState(editData?.category === 'SukitaFinançe (Serviço)' ? editData.description : (initialDescription || ''));
  const [laborAmount, setLaborAmount] = useState(editData?.laborAmount?.toString() || '');
  const [partsAmount, setPartsAmount] = useState(editData?.partsAmount?.toString() || '');

  const sukitaFinanceServices = [
    { name: 'Troca de Tela', price: '450' },
    { name: 'Troca de Bateria', price: '250' },
    { name: 'Conector de Carga', price: '150' },
    { name: 'Software / Formatação', price: '100' },
    { name: 'Desbloqueio', price: '150' },
    { name: 'Reparo de Placa', price: '450' },
    { name: 'Mão de Obra', price: '100' },
  ];

  // Update cardId and category when initial props change or modal opens
  React.useEffect(() => {
    if (isOpen) {
      if (editData) {
        setType(editData.type === 'inflow' ? 'income' : 'expense');
        setStatus(editData.status || 'pending');
        setDescription(editData.description || '');
        setAmount(editData.amount?.toString() || '');
        setDate(editData.date || '');
        setPurchaseDate(editData.purchaseDate || editData.date || '');
        setCategory(editData.category || 'Outros');
        setCardId(editData.cardId || '');
        setInstallments(editData.installments?.toString() || '1');
        setLaborAmount(editData.laborAmount?.toString() || '');
        setPartsAmount(editData.partsAmount?.toString() || '');
        if (editData.category === 'SukitaFinançe (Serviço)') {
          setServiceType(editData.description);
        }
      } else {
        setCardId(initialCardId || '');
        setCategory(initialCategory || 'Outros');
        setDescription(initialDescription || '');
        setServiceType(initialDescription || '');
        
        // Set default dates based on selected month/year
        const now = new Date();
        const defaultDate = new Date(selectedYear, selectedMonth, now.getDate());
        const dateStr = formatDateInput(defaultDate);
        setDate(dateStr);
        setPurchaseDate(dateStr);
        
        if (initialCategory === 'SukitaFinançe (Serviço)') {
          setType('income');
          setLaborAmount('');
          setPartsAmount('');
          if (initialDescription) {
            const service = sukitaFinanceServices.find(s => s.name === initialDescription);
            if (service) {
              setAmount(service.price);
            }
          }
        } else {
          setType(initialCardId ? 'expense' : 'expense'); // Default to expense
          setAmount('');
        }
      }
    }
  }, [isOpen, initialCardId, initialCategory, initialDescription, editData]);

  const handleServiceChange = (name: string) => {
    setServiceType(name);
    const service = sukitaFinanceServices.find(s => s.name === name);
    if (service) {
      setDescription(service.name);
      setAmount(service.price);
      setLaborAmount(service.price);
      setPartsAmount('0');
    }
  };

  const handleLaborChange = (val: string) => {
    setLaborAmount(val);
    const total = (parseFloat(val) || 0) + (parseFloat(partsAmount) || 0);
    setAmount(total.toString());
  };

  const handlePartsChange = (val: string) => {
    setPartsAmount(val);
    const total = (parseFloat(laborAmount) || 0) + (parseFloat(val) || 0);
    setAmount(total.toString());
  };

  const selectedCard = cards.find(c => c.id === cardId);
  const usedLimit = selectedCard ? allTransactions
    .filter(t => t.cardId === selectedCard.id && t.type === 'outflow' && t.id !== editData?.id)
    .reduce((acc, t) => acc + t.amount, 0) : 0;
  const availableLimit = selectedCard ? selectedCard.limit - usedLimit : 0;

  const types = [
    { id: 'income', label: 'Entrada', icon: ArrowUpRight, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { id: 'expense', label: 'Saída', icon: ArrowDownRight, color: 'text-red-400', bg: 'bg-red-500/10' },
  ];

  const handleConfirm = () => {
    if (!description || !amount) return;
    
    if (editData) {
      const updatedEntry = {
        ...editData,
        description,
        amount: parseFloat(amount),
        date,
        purchaseDate,
        category,
        type: type === 'income' ? 'inflow' : 'outflow',
        status: type === 'expense' ? status : 'paid',
        cardId: cardId || undefined,
        installments: parseInt(installments) || 1,
        laborAmount: category === 'SukitaFinançe (Serviço)' ? parseFloat(laborAmount) : undefined,
        partsAmount: category === 'SukitaFinançe (Serviço)' ? parseFloat(partsAmount) : undefined
      };
      onUpdateEntry?.(updatedEntry);
    } else {
      const newEntry = {
        id: Math.random().toString(36).substr(2, 9),
        description,
        amount: parseFloat(amount),
        date,
        purchaseDate,
        category,
        type: type === 'income' ? 'inflow' : 'outflow',
        status: type === 'expense' ? status : 'paid',
        cardId: cardId || undefined,
        installments: parseInt(installments) || 1,
        currentInstallment: parseInt(installments) > 1 ? 1 : undefined,
        isBill: category === 'Boleto',
        laborAmount: category === 'SukitaFinançe (Serviço)' ? parseFloat(laborAmount) : undefined,
        partsAmount: category === 'SukitaFinançe (Serviço)' ? parseFloat(partsAmount) : undefined
      };
      onAddEntry?.(newEntry);
    }

    onClose();
    
    // Reset form
    if (!editData) {
      setDescription('');
      setAmount('');
      setLaborAmount('');
      setPartsAmount('');
      setType('expense');
      setStatus('pending');
      setCardId('');
      setInstallments('1');
      setServiceType('');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Content */}
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

          <h3 className="text-lg font-bold mb-4">{editData ? 'Editar Lançamento' : 'Novo Lançamento'}</h3>

          {/* Type Selector - Hidden if card is pre-selected or editing */}
          {!initialCardId && !editData && (
            <div className="grid grid-cols-2 gap-2 mb-4">
              {types.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setType(t.id as EntryType)}
                  className={cn(
                    "flex flex-col items-center p-1.5 rounded-xl transition-all border",
                    type === t.id 
                      ? "bg-white/10 border-white/20" 
                      : "border-transparent hover:bg-white/5"
                  )}
                >
                  <div className={cn("p-1 rounded-lg mb-1", t.bg, t.color)}>
                    <t.icon size={16} />
                  </div>
                  <span className="text-[8px] font-bold uppercase tracking-tighter text-slate-400">{t.label}</span>
                </button>
              ))}
            </div>
          )}

          {/* Form */}
          <div className="space-y-3">
            {category === 'SukitaFinançe (Serviço)' && type === 'income' && (
              <div className="space-y-3">
                <div>
                  <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Tipo de Serviço</label>
                  <select 
                    value={serviceType}
                    onChange={(e) => handleServiceChange(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 outline-none focus:border-brand-purple transition-colors text-slate-400 appearance-none text-sm"
                  >
                    <option value="">Selecione um serviço...</option>
                    {sukitaFinanceServices.map(s => (
                      <option key={s.name} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[9px] font-bold text-brand-orange uppercase tracking-widest mb-1 block">Minha Mão de Obra</label>
                    <div className="relative">
                      <DollarSign size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-orange" />
                      <input 
                        type="number" 
                        value={laborAmount}
                        onChange={(e) => handleLaborChange(e.target.value)}
                        placeholder="0,00"
                        className="w-full bg-brand-orange/5 border border-brand-orange/20 rounded-xl py-2.5 pl-8 pr-4 outline-none focus:border-brand-orange transition-colors text-sm text-brand-orange font-bold"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Custo de Peças</label>
                    <div className="relative">
                      <DollarSign size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input 
                        type="number" 
                        value={partsAmount}
                        onChange={(e) => handlePartsChange(e.target.value)}
                        placeholder="0,00"
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-8 pr-4 outline-none focus:border-brand-purple transition-colors text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Descrição</label>
              <input 
                type="text" 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ex: Supermercado..."
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 outline-none focus:border-brand-purple transition-colors text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Data da Compra</label>
                <input 
                  type="date" 
                  value={purchaseDate}
                  onChange={(e) => setPurchaseDate(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 outline-none focus:border-brand-purple transition-colors text-slate-400 text-sm"
                />
              </div>
              <div>
                <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Vencimento</label>
                <input 
                  id="dataLancamento"
                  type="date" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 outline-none focus:border-brand-purple transition-colors text-slate-400 text-sm"
                />
                <p className="text-[8px] text-slate-500 mt-1 font-medium">
                  Formatada: <span id="dataFormatada" className="text-brand-purple">{formatDateBR(date)}</span>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Valor</label>
                <div className="relative">
                  <DollarSign size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input 
                    type="number" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0,00"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-8 pr-4 outline-none focus:border-brand-purple transition-colors text-sm"
                  />
                </div>
              </div>
              <div className={cn("flex flex-col", type === 'income' ? "hidden" : "")}>
                <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Status</label>
                <select 
                  value={status}
                  onChange={(e) => setStatus(e.target.value as EntryStatus)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 outline-none focus:border-brand-purple transition-colors text-slate-400 appearance-none text-sm"
                >
                  <option value="paid">Pago</option>
                  <option value="pending">Pendente</option>
                  <option value="overdue">Atrasada</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Categoria</label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 outline-none focus:border-brand-purple transition-colors text-slate-400 appearance-none text-sm"
              >
                {type === 'income' ? (
                  <>
                    <option value="Salário">Salário</option>
                    <option value="Freelance">Freelance</option>
                    <option value="SukitaFinançe (Serviço)">SukitaFinançe (Serviço)</option>
                    <option value="Investimentos">Investimentos</option>
                    <option value="Outros">Outros</option>
                  </>
                ) : (
                  <>
                    <option value="Boleto">Boleto (Conta)</option>
                    <option value="Alimentação">Alimentação</option>
                    <option value="Moradia">Moradia</option>
                    <option value="Transporte">Transporte</option>
                    <option value="Lazer">Lazer</option>
                    <option value="Saúde">Saúde</option>
                    <option value="Educação">Educação</option>
                    <option value="Outros">Outros</option>
                  </>
                )}
              </select>
            </div>

            {type === 'expense' && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Cartão (Opcional)</label>
                    <select 
                      value={cardId}
                      onChange={(e) => setCardId(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 outline-none focus:border-brand-purple transition-colors text-slate-400 appearance-none text-sm"
                    >
                      <option value="">Nenhum</option>
                      {cards.map(card => (
                        <option key={card.id} value={card.id}>{card.name} (..{card.lastFour})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Parcelas</label>
                    <select 
                      value={installments}
                      onChange={(e) => setInstallments(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 outline-none focus:border-brand-purple transition-colors text-slate-400 appearance-none text-sm"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(n => (
                        <option key={n} value={n}>{n}x</option>
                      ))}
                    </select>
                  </div>
                </div>

                {selectedCard && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-2"
                  >
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-slate-400 uppercase font-bold">Limite Disponível</span>
                      <span className={cn("font-bold", availableLimit < parseFloat(amount || '0') ? "text-red-400" : "text-emerald-400")}>
                        {formatCurrency(availableLimit)}
                      </span>
                    </div>
                    <div className="w-full bg-black/20 h-1 rounded-full overflow-hidden">
                      <div 
                        className={cn("h-full transition-all", (usedLimit / selectedCard.limit) > 0.8 ? "bg-orange-400" : "bg-emerald-400")}
                        style={{ width: `${Math.min(100, (usedLimit / selectedCard.limit) * 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[8px] text-slate-500 uppercase font-bold">
                      <span>Usado: {formatCurrency(usedLimit)}</span>
                      <span>Total: {formatCurrency(selectedCard.limit)}</span>
                    </div>
                  </motion.div>
                )}
              </div>
            )}

            <button 
              onClick={handleConfirm}
              className="w-full py-2.5 bg-gradient-to-r from-brand-purple to-brand-orange text-white rounded-xl font-bold text-sm shadow-lg shadow-brand-purple/20 hover:scale-[1.02] active:scale-[0.98] transition-all mt-1"
            >
              Confirmar Lançamento
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
