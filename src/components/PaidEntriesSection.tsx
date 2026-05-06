import React from 'react';
import { CheckCircle2, Search, Filter, Calendar } from 'lucide-react';
import { Transaction } from '../types';
import { formatCurrency, formatDateBR, cn } from '../lib/utils';

interface PaidEntriesSectionProps {
  transactions: Transaction[];
  onDeleteTransaction: (id: string) => void;
  onEditTransaction: (transaction: Transaction) => void;
  selectedMonth: number;
  selectedYear: number;
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
}

export function PaidEntriesSection({ 
  transactions, 
  onDeleteTransaction, 
  onEditTransaction,
  selectedMonth,
  selectedYear,
  onMonthChange,
  onYearChange
}: PaidEntriesSectionProps) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterByPeriod, setFilterByPeriod] = React.useState(true);
  
  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i);
  
  const paidTransactions = transactions
    .filter(t => t.status === 'paid')
    .filter(t => {
      const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           t.category.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (!filterByPeriod) return matchesSearch;
      
      const d = new Date(t.date);
      const matchesPeriod = d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
      
      return matchesSearch && matchesPeriod;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const totalPaid = paidTransactions.reduce((acc, t) => acc + t.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <CheckCircle2 className="text-emerald-500" />
            Contas Pagas
          </h2>
          <p className="text-slate-400">Gerenciamento de todos os lançamentos quitados</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Period Filter Toggle */}
          <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setFilterByPeriod(true)}
              className={cn(
                "px-4 py-1.5 rounded-lg text-xs font-bold transition-all",
                filterByPeriod ? "bg-brand-purple text-white shadow-lg" : "text-slate-400 hover:text-slate-200"
              )}
            >
              Por Período
            </button>
            <button
              onClick={() => setFilterByPeriod(false)}
              className={cn(
                "px-4 py-1.5 rounded-lg text-xs font-bold transition-all",
                !filterByPeriod ? "bg-brand-purple text-white shadow-lg" : "text-slate-400 hover:text-slate-200"
              )}
            >
              Todos
            </button>
          </div>

          {filterByPeriod && (
            <div className="flex items-center gap-2">
              <select
                value={selectedMonth}
                onChange={(e) => onMonthChange(parseInt(e.target.value))}
                className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-brand-purple/50"
              >
                {months.map((month, index) => (
                  <option key={month} value={index} className="bg-[#0F172A]">{month}</option>
                ))}
              </select>
              <select
                value={selectedYear}
                onChange={(e) => onYearChange(parseInt(e.target.value))}
                className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-brand-purple/50"
              >
                {years.map((year) => (
                  <option key={year} value={year} className="bg-[#0F172A]">{year}</option>
                ))}
              </select>
            </div>
          )}

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-brand-purple/50 w-48"
            />
          </div>
          <div className="bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-xl text-emerald-400 text-sm font-bold whitespace-nowrap">
            {formatCurrency(totalPaid)}
          </div>
        </div>
      </div>

      <div className="glass rounded-[2rem] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Data</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Descrição</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Categoria</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Valor</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {paidTransactions.length > 0 ? (
                paidTransactions.map((t) => (
                  <tr key={t.id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3 text-slate-400">
                        <Calendar size={14} />
                        <span className="text-sm font-medium">{formatDateBR(t.date)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-white group-hover:text-brand-purple transition-colors">{t.description}</span>
                        {t.cardId && <span className="text-[10px] text-slate-500 uppercase">Cartão de Crédito</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        {t.category}
                      </span>
                    </td>
                    <td className={cn(
                      "px-6 py-4 text-right text-sm font-black",
                      t.type === 'inflow' ? "text-emerald-400" : "text-slate-100"
                    )}>
                      {t.type === 'inflow' ? '+' : '-'} {formatCurrency(t.amount)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center uppercase tracking-tighter">
                        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-[10px] font-black border border-emerald-500/20">
                          PAGO
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <div className="flex flex-col items-center text-slate-500 space-y-3">
                      <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center">
                        <CheckCircle2 size={32} className="opacity-20" />
                      </div>
                      <p className="italic">Nenhum lançamento pago encontrado.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
