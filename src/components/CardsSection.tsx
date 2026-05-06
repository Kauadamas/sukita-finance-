import React from 'react';
import { motion } from 'motion/react';
import { Plus, CreditCard as CardIcon, TrendingUp, AlertTriangle, ReceiptText, Trash2, CheckCircle2, Edit2, Check, Bell, Info, ShieldAlert, Calendar } from 'lucide-react';
import { CreditCard, Transaction, Bill } from '../types';
import { MOCK_CARDS } from '../constants';
import { cn, formatCurrency, formatDateBR } from '../lib/utils';

interface CardsSectionProps {
  onOpenModal?: (cardId?: string) => void;
  onOpenCardModal?: () => void;
  transactions: Transaction[];
  allTransactions: Transaction[];
  bills: Bill[];
  cards: CreditCard[];
  onUpdateTransactionStatus?: (id: string, status: 'paid' | 'pending' | 'overdue') => void;
  onDeleteTransaction?: (id: string) => void;
  onDeleteCard?: (id: string) => void;
  onPayBill?: (cardId: string) => void;
  onUpdateCardLimit?: (id: string, limit: number) => void;
  onAddEntry?: (entry: any) => void;
}

export function CardsSection({ 
  onOpenModal, 
  onOpenCardModal, 
  transactions, 
  allTransactions,
  bills, 
  cards, 
  onUpdateTransactionStatus,
  onDeleteTransaction,
  onDeleteCard,
  onPayBill,
  onUpdateCardLimit,
  onAddEntry
}: CardsSectionProps) {
  const [selectedCardId, setSelectedCardId] = React.useState<string | null>(null);
  const [editingLimitId, setEditingLimitId] = React.useState<string | null>(null);
  const [newLimit, setNewLimit] = React.useState<string>('');
  
  // Quick Add State
  const [quickDesc, setQuickDesc] = React.useState('');
  const [quickAmount, setQuickAmount] = React.useState('');

  const cardTransactions = transactions.filter(t => t.cardId === selectedCardId);
  const selectedCard = cards.find(c => c.id === selectedCardId);
  const allCardTransactions = transactions.filter(t => t.cardId);

  const installmentTransactions = allTransactions.filter(t => t.installments && t.installments > 1 && (!selectedCardId || t.cardId === selectedCardId));

  // Calculate the total monthly bill (current month's portion of installments + single purchases)
  const getMonthlyBill = (cardId: string) => {
    return transactions
      .filter(t => t.cardId === cardId && t.type === 'outflow')
      .reduce((acc, t) => acc + t.amount, 0);
  };

  // Calculate total used limit (total debt across all months)
  const getCardUsedLimit = (cardId: string) => {
    return allTransactions
      .filter(t => t.cardId === cardId && t.type === 'outflow')
      .reduce((acc, t) => acc + t.amount, 0);
  };

  const getFutureBill = (cardId: string) => {
    // Sum of all installments that are NOT in the current filtered transactions (future months)
    const currentMonthTransactionsIds = new Set(transactions.map(t => t.id));
    return allTransactions
      .filter(t => t.cardId === cardId && t.type === 'outflow' && !currentMonthTransactionsIds.has(t.id))
      .reduce((acc, t) => acc + t.amount, 0);
  };

  const getAvailableLimit = (card: CreditCard) => {
    return card.limit - getCardUsedLimit(card.id);
  };

  return (
    <div className="space-y-8 pb-12">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Meus Cartões</h2>
          <p className="text-slate-400">Gerencie seus limites e faturas em um só lugar.</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="hidden md:flex items-center space-x-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            <Bell size={14} className="text-brand-orange" />
            <span>{cards.length} Cartões Ativos</span>
          </div>
          <button 
            onClick={onOpenCardModal}
            className="flex items-center space-x-2 bg-brand-purple px-4 py-2 rounded-xl font-bold hover:bg-brand-purple/80 transition-all text-sm"
          >
            <Plus size={18} />
            <span>Novo Cartão</span>
          </button>
        </div>
      </header>

      {/* Notifications & Strategy Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex overflow-x-auto pb-4 scrollbar-hide snap-x gap-6">
            {cards.length > 0 ? (
              cards.map((card, index) => {
                const usedPercent = (getCardUsedLimit(card.id) / card.limit) * 100;
                const isHighUsage = usedPercent > 80;
                
                return (
                  <motion.div
                    key={card.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={cn(
                      "relative min-w-[320px] h-48 rounded-[2.5rem] p-7 text-white shadow-2xl overflow-hidden group cursor-pointer transition-all snap-center",
                      "bg-gradient-to-br",
                      card.color,
                      selectedCardId === card.id ? "ring-4 ring-white/50 scale-[1.02]" : "opacity-90 hover:opacity-100"
                    )}
                    onClick={() => setSelectedCardId(card.id === selectedCardId ? null : card.id)}
                  >
                    {/* Card Shine Effect - Enhanced */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1500 ease-in-out" />
                    <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all" />
                    
                    <div className="relative z-10 h-full flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center space-x-2">
                            <p className="text-white/70 text-[10px] font-bold uppercase tracking-[0.2em]">{card.name}</p>
                            {isHighUsage && <ShieldAlert size={12} className="text-orange-300 animate-pulse" />}
                          </div>
                          <h4 className="text-xl font-bold mt-1 tracking-wider">•••• •••• •••• {card.lastFour}</h4>
                        </div>
                        <div className="flex flex-col items-end space-y-3">
                          <CardIcon size={28} className="text-white/30" />
                          <div className="flex space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteCard?.(card.id);
                              }}
                              className="p-2 bg-red-500/20 hover:bg-red-500/40 rounded-xl transition-colors text-white"
                              title="Excluir Cartão"
                            >
                              <Trash2 size={14} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onOpenModal?.(card.id);
                              }}
                              className="p-2 bg-white/20 hover:bg-white/40 rounded-xl transition-colors"
                              title="Nova Compra"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex justify-between items-end">
                          <div>
                            <p className="text-white/60 text-[9px] font-bold uppercase tracking-widest">Disponível</p>
                            <p className="text-2xl font-black">{formatCurrency(getAvailableLimit(card))}</p>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center justify-end space-x-1 mb-1">
                              <Calendar size={10} className="text-white/50" />
                              <p className="text-white/70 text-[8px] font-bold uppercase">Vence dia {new Date(card.dueDate).getDate()}</p>
                            </div>
                            <p className="text-white/60 text-[9px] font-bold uppercase tracking-widest">Fatura Atual</p>
                            <p className="text-lg font-bold text-white">{formatCurrency(getMonthlyBill(card.id))}</p>
                          </div>
                        </div>
                        
                        <div className="space-y-1.5">
                          <div className="w-full bg-black/20 h-1.5 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.min(100, usedPercent)}%` }}
                              className={cn(
                                "h-full bg-white transition-colors",
                                isHighUsage && "bg-orange-300"
                              )}
                            />
                          </div>
                          <div className="flex justify-between text-[8px] font-bold uppercase tracking-tighter text-white/50">
                            <span>Usado: {formatCurrency(getCardUsedLimit(card.id))}</span>
                            <span>Total: {formatCurrency(card.limit)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="w-full h-48 border-2 border-dashed border-white/10 rounded-[2.5rem] flex flex-col items-center justify-center text-slate-500 space-y-4">
                <CardIcon size={48} className="opacity-20" />
                <p className="font-bold uppercase tracking-widest text-xs">Nenhum cartão cadastrado</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="glass p-6 rounded-[2rem] border-brand-purple/20">
            <h5 className="text-xs font-bold uppercase tracking-widest text-brand-purple mb-4 flex items-center">
              <ShieldAlert size={16} className="mr-2" />
              Estratégia & Alertas
            </h5>
            <div className="space-y-3">
              {cards.map(card => {
                const usedPercent = (getCardUsedLimit(card.id) / card.limit) * 100;
                if (usedPercent > 80) {
                  return (
                    <div key={card.id} className="p-3 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start space-x-3">
                      <AlertTriangle size={16} className="text-red-400 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-[10px] font-bold text-red-400 uppercase tracking-wider">Atenção: {card.name}</p>
                        <p className="text-xs text-slate-300 mt-1">Evite usar este cartão. Limite em {usedPercent.toFixed(0)}%. Risco de bola de neve!</p>
                      </div>
                    </div>
                  );
                }
                if (usedPercent > 50) {
                  return (
                    <div key={card.id} className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-2xl flex items-start space-x-3">
                      <Info size={16} className="text-orange-400 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-[10px] font-bold text-orange-400 uppercase tracking-wider">Sugestão: {card.name}</p>
                        <p className="text-xs text-slate-300 mt-1">Uso moderado ({usedPercent.toFixed(0)}%). Considere priorizar pagamentos aqui.</p>
                      </div>
                    </div>
                  );
                }
                return null;
              })}
              {cards.length === 0 && (
                <p className="text-xs text-slate-500 italic">Adicione um cartão para ver sugestões estratégicas.</p>
              )}
              {cards.every(c => (getCardUsedLimit(c.id) / c.limit) <= 50) && cards.length > 0 && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-start space-x-3">
                  <CheckCircle2 size={16} className="text-emerald-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Tudo Sob Controle</p>
                    <p className="text-xs text-slate-300 mt-1">Seus cartões estão com uso saudável. Continue assim!</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="glass p-6 rounded-[2rem] border-brand-orange/20">
            <h5 className="text-xs font-bold uppercase tracking-widest text-brand-orange mb-4 flex items-center">
              <Bell size={16} className="mr-2" />
              Notificações
            </h5>
            <div className="space-y-3">
              {cards.map(card => {
                const today = new Date();
                const closingDate = new Date(card.closingDate);
                const isClosingToday = today.getDate() === closingDate.getDate();
                
                const monthlyBill = getMonthlyBill(card.id);
                // Assuming a fixed ideal income for notification logic, or we could pass it as prop
                const idealLimit = 2000; // Placeholder for 40% of income logic
                const isAboveIdeal = monthlyBill > idealLimit;

                return (
                  <React.Fragment key={card.id}>
                    {isClosingToday && (
                      <div className="p-3 bg-brand-purple/10 border border-brand-purple/20 rounded-2xl flex items-start space-x-3">
                        <Calendar size={16} className="text-brand-purple mt-0.5 shrink-0" />
                        <div>
                          <p className="text-[10px] font-bold text-brand-purple uppercase tracking-wider">Fechamento Hoje</p>
                          <p className="text-xs text-slate-300 mt-1">A fatura do {card.name} fecha hoje. Evite novas compras até amanhã.</p>
                        </div>
                      </div>
                    )}
                    {isAboveIdeal && (
                      <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start space-x-3">
                        <TrendingUp size={16} className="text-red-400 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-[10px] font-bold text-red-400 uppercase tracking-wider">Alerta de Gastos</p>
                          <p className="text-xs text-slate-300 mt-1">Fatura do {card.name} acima do ideal (40% da renda estimada).</p>
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
              {cards.length > 0 && cards.every(c => {
                const today = new Date();
                const closingDate = new Date(c.closingDate);
                return today.getDate() !== closingDate.getDate() && getMonthlyBill(c.id) <= 2000;
              }) && (
                <p className="text-xs text-slate-500 italic">Sem notificações urgentes no momento.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {selectedCardId ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass p-8 rounded-[2rem] space-y-6"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-xl font-bold flex items-center">
                <CardIcon size={24} className="mr-2 text-brand-purple" />
                Transações: {selectedCard?.name}
              </h4>
              <button 
                onClick={() => onOpenModal?.(selectedCardId!)}
                className="text-xs font-bold text-brand-purple hover:underline flex items-center"
              >
                <Plus size={14} className="mr-1" />
                Nova Compra
              </button>
            </div>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
              {/* Quick Add Form */}
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!quickDesc || !quickAmount) return;
                  onAddEntry?.({
                    id: Math.random().toString(36).substr(2, 9),
                    description: quickDesc,
                    amount: parseFloat(quickAmount),
                    purchaseDate: new Date().toISOString().split('T')[0],
                    date: new Date().toISOString().split('T')[0],
                    category: 'Outros',
                    type: 'outflow',
                    status: 'pending',
                    cardId: selectedCardId,
                    installments: 1
                  });
                  setQuickDesc('');
                  setQuickAmount('');
                }}
                className="p-4 bg-brand-purple/5 rounded-2xl border border-brand-purple/20 flex items-center space-x-3 mb-6"
              >
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="O que você comprou?"
                    value={quickDesc}
                    onChange={(e) => setQuickDesc(e.target.value)}
                    className="w-full bg-transparent border-none outline-none text-sm placeholder:text-slate-500"
                  />
                </div>
                <div className="w-24">
                  <input
                    type="number"
                    placeholder="Valor"
                    value={quickAmount}
                    onChange={(e) => setQuickAmount(e.target.value)}
                    className="w-full bg-transparent border-none outline-none text-sm placeholder:text-slate-500 text-right"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!quickDesc || !quickAmount}
                  className="p-2 bg-brand-purple text-white rounded-xl hover:bg-brand-purple/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus size={16} />
                </button>
              </form>

              {cardTransactions.length > 0 ? (
                cardTransactions.map(t => (
                  <div key={t.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                    <div>
                      <p className="font-bold">{t.description}</p>
                      <p className="text-xs text-slate-400">
                        {formatDateBR(t.date)}
                        {t.installments && t.installments > 1 && (
                          <span className="ml-2 px-1.5 py-0.5 bg-brand-orange/20 text-brand-orange rounded text-[10px] font-bold border border-brand-orange/20">
                            {t.currentInstallment || 1}/{t.installments}
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="text-right flex flex-col items-end">
                      <div className="flex items-center space-x-2">
                        {t.status === 'pending' && (
                          <button
                            onClick={() => onUpdateTransactionStatus?.(t.id, 'paid')}
                            className="p-1 text-emerald-500 hover:bg-emerald-500/10 rounded-lg transition-colors"
                            title="Confirmar Pagamento"
                          >
                            <CheckCircle2 size={16} />
                          </button>
                        )}
                        <p className="font-bold text-red-400">
                          - {formatCurrency(t.installments && t.installments > 1 ? t.amount / t.installments : t.amount)}
                        </p>
                        <button 
                          onClick={() => onDeleteTransaction?.(t.id)}
                          className="p-1 text-slate-500 hover:text-red-400 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      {t.installments && t.installments > 1 && (
                        <p className="text-[10px] text-slate-500">Total: {formatCurrency(t.amount)}</p>
                      )}
                      <select
                        value={t.status}
                        onChange={(e) => onUpdateTransactionStatus?.(t.id, e.target.value as any)}
                        className={cn(
                          "text-[10px] font-bold uppercase tracking-widest bg-transparent outline-none cursor-pointer appearance-none border-none text-right mt-1",
                          t.status === 'paid' ? "text-emerald-400" :
                          t.status === 'overdue' ? "text-red-400" : "text-orange-400"
                        )}
                      >
                        <option value="paid" className="bg-[#0F172A]">Pago</option>
                        <option value="pending" className="bg-[#0F172A]">Pendente</option>
                        <option value="overdue" className="bg-[#0F172A]">Vencido</option>
                      </select>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-slate-500">Nenhuma transação neste cartão</p>
                </div>
              )}
            </div>
            <div className="pt-4 border-t border-white/10 flex justify-between items-center">
              <div className="flex space-x-6">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Fatura Atual</span>
                  <p className="text-lg font-bold text-emerald-400">{formatCurrency(getMonthlyBill(selectedCardId!))}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Fatura Futura</span>
                  <p className="text-lg font-bold text-brand-orange">{formatCurrency(getFutureBill(selectedCardId!))}</p>
                </div>
              </div>
              <button
                onClick={() => onPayBill?.(selectedCardId!)}
                className="flex items-center space-x-2 bg-emerald-500/20 text-emerald-400 px-4 py-2 rounded-xl font-bold hover:bg-emerald-500/30 transition-all text-sm"
              >
                <CheckCircle2 size={18} />
                <span>Pagar Fatura</span>
              </button>
            </div>
          </motion.div>
        ) : (
          <div className="glass p-8 rounded-[2rem] space-y-6">
            <h4 className="text-xl font-bold flex items-center">
              <TrendingUp size={24} className="mr-2 text-brand-purple" />
              Análise de Faturas
            </h4>
            <div className="space-y-4">
              {cards.length > 0 ? (
                cards.map(card => (
                  <div key={card.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                    <div>
                      <p className="font-bold">{card.name}</p>
                      <div className="flex items-center space-x-2">
                        <p className="text-xs text-slate-400">Fecha em {formatDateBR(card.closingDate)}</p>
                        {allTransactions.filter(t => t.cardId === card.id && t.installments && t.installments > 1).length > 0 && (
                          <span className="text-[10px] font-bold text-brand-orange bg-brand-orange/10 px-1.5 rounded">
                            {allTransactions.filter(t => t.cardId === card.id && t.installments && t.installments > 1).length} parcelas ativas
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-emerald-400">Fatura: {formatCurrency(getMonthlyBill(card.id))}</p>
                      <p className="text-[10px] text-slate-500">Total Devido: {formatCurrency(getCardUsedLimit(card.id))}</p>
                      <p className={cn(
                        "text-[10px] font-bold uppercase mt-1",
                        (getCardUsedLimit(card.id) / card.limit) > 0.8 ? "text-orange-400" : "text-emerald-400"
                      )}>
                        {(getCardUsedLimit(card.id) / card.limit) > 0.8 ? 'Risco Alto' : 'Saudável'}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-slate-500">Nenhum dado para análise</p>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="glass p-8 rounded-[2rem] space-y-6">
          <h4 className="text-xl font-bold flex items-center">
            <ReceiptText size={24} className="mr-2 text-brand-purple" />
            Lançamentos do Mês
          </h4>
          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 scrollbar-hide">
            {allCardTransactions.length > 0 ? (
              allCardTransactions.map(t => {
                const card = cards.find(c => c.id === t.cardId);
                return (
                  <div key={t.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                    <div className="flex items-center space-x-3">
                      <div className={cn("w-2 h-8 rounded-full", card?.color || "bg-slate-500")} />
                      <div>
                        <p className="font-bold text-sm">{t.description}</p>
                        <p className="text-[10px] text-slate-400">
                          {card?.name} • {formatDateBR(t.date)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        {t.status === 'pending' && (
                          <button
                            onClick={() => onUpdateTransactionStatus?.(t.id, 'paid')}
                            className="p-1 text-emerald-500 hover:bg-emerald-500/10 rounded-lg transition-colors"
                            title="Confirmar Pagamento"
                          >
                            <CheckCircle2 size={16} />
                          </button>
                        )}
                        <div>
                          <p className="font-bold text-sm text-red-400">- {formatCurrency(t.amount)}</p>
                          {t.installments && t.installments > 1 && (
                            <p className="text-[10px] text-brand-orange font-bold">
                              {t.currentInstallment}/{t.installments}
                            </p>
                          )}
                        </div>
                      </div>
                      <button 
                        onClick={() => onDeleteTransaction?.(t.id)}
                        className="p-1 text-slate-500 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12">
                <p className="text-slate-500">Nenhum lançamento nos cartões</p>
              </div>
            )}
          </div>
        </div>

        <div className="glass-orange p-8 rounded-[2rem] space-y-6">
          <h4 className="text-xl font-bold flex items-center text-brand-orange">
            <TrendingUp size={24} className="mr-2" />
            Compras e Parcelas
          </h4>
          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 scrollbar-hide">
            {installmentTransactions.length > 0 ? (
              installmentTransactions.map(t => (
                <div key={t.id} className="p-4 bg-white/5 rounded-2xl border border-white/5 flex justify-between items-center">
                  <div>
                    <p className="font-bold text-sm">{t.description}</p>
                    <p className="text-[10px] text-slate-400">
                      {t.installments}x de {formatCurrency(t.amount / (t.installments || 1))}
                    </p>
                  </div>
                  <div className="text-right flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      {t.status === 'pending' && (
                        <button
                          onClick={() => onUpdateTransactionStatus?.(t.id, 'paid')}
                          className="p-1 text-emerald-500 hover:bg-emerald-500/10 rounded-lg transition-colors"
                          title="Confirmar Pagamento"
                        >
                          <CheckCircle2 size={16} />
                        </button>
                      )}
                      <div>
                        <div className="px-1.5 py-0.5 bg-brand-orange/20 text-brand-orange rounded text-[10px] font-bold border border-brand-orange/20 inline-block mb-1">
                          {t.currentInstallment || 1}/{t.installments}
                        </div>
                        <p className="text-[10px] text-slate-500">Total: {formatCurrency(t.amount)}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => onDeleteTransaction?.(t.id)}
                      className="p-1 text-slate-500 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 bg-orange-500/10 rounded-2xl border border-orange-500/20">
                <p className="text-sm text-slate-200">
                  Nenhum parcelamento ativo {selectedCardId ? 'neste cartão' : ''}.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
