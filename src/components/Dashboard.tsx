import React from 'react';
import { 
  Plus, 
  Trash2, 
  Download, 
  History, 
  CheckCircle2, 
  Clock,
  Wallet,
  ArrowUpCircle,
  ArrowDownCircle,
  AlertCircle,
  Calendar,
  Edit2
} from 'lucide-react';
import { Transaction, Bill, CreditCard, Investment } from '../types';
import { formatCurrency, formatDateBR, cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface DashboardProps {
  onOpenModal: (cardId?: string, category?: string, description?: string) => void;
  onEditTransaction: (transaction: Transaction) => void;
  transactions: Transaction[];
  allTransactions: Transaction[];
  bills: Bill[];
  cards: CreditCard[];
  investments: Investment[];
  onDeleteTransaction: (id: string) => void;
  onUpdateTransactionStatus: (id: string, status: 'paid' | 'pending' | 'overdue') => void;
  onDeleteAllTransactions: () => void;
  onExportData: () => void;
  setActiveTab: (tab: string) => void;
  onPeriodChange: (month: number, year: number) => void;
  selectedMonth: number;
  selectedYear: number;
}

export function Dashboard({ 
  onOpenModal, 
  onEditTransaction,
  transactions, 
  allTransactions, 
  bills, 
  onUpdateTransactionStatus,
  onDeleteTransaction,
  onDeleteAllTransactions,
  onExportData,
  setActiveTab,
  onPeriodChange,
  selectedMonth, 
  selectedYear 
}: DashboardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);
  const [filterType, setFilterType] = React.useState<'all' | 'inflow' | 'outflow' | 'bills'>('all');
  const [showAll, setShowAll] = React.useState(false);

  // Cálculos Reais
  const accountBalance = allTransactions.reduce((acc, t) => {
    if (t.type === 'inflow') {
      return acc + t.amount;
    } else {
      // Only subtract if the expense (outflow) is marked as 'paid'
      return t.status === 'paid' ? acc - t.amount : acc;
    }
  }, 0);

  const monthlyInflow = transactions
    .filter(t => t.type === 'inflow')
    .reduce((acc, t) => acc + t.amount, 0);

  const monthlyOutflow = transactions
    .filter(t => t.type === 'outflow')
    .reduce((acc, t) => acc + t.amount, 0);

  const pendingBillsCount = bills.filter(b => b.status === 'pending' || b.status === 'overdue').length;
  const overdueBills = bills.filter(b => b.status === 'overdue');
  const totalOverdueAmount = overdueBills.reduce((acc, b) => acc + b.amount, 0);
  
  const pendingBills = bills.filter(b => b.status === 'pending');
  const totalPendingAmount = pendingBills.reduce((acc, b) => acc + b.amount, 0);

  const filteredList = transactions.filter(t => {
    if (filterType === 'all') return true;
    if (filterType === 'inflow') return t.type === 'inflow';
    if (filterType === 'outflow') return t.type === 'outflow';
    if (filterType === 'bills') return t.category === 'Boleto' || bills.some(b => b.id === t.id);
    return true;
  });

  const lastTransactions = [...filteredList]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  const displayTransactions = showAll ? lastTransactions : lastTransactions.slice(0, 8);

  const statusSummary = {
    paid: {
      count: filteredList.filter(t => t.status === 'paid' && t.type === 'outflow').length,
      total: filteredList.filter(t => t.status === 'paid' && t.type === 'outflow').reduce((acc, t) => acc + t.amount, 0)
    },
    pending: {
      count: filteredList.filter(t => t.status === 'pending').length,
      total: filteredList.filter(t => t.status === 'pending').reduce((acc, t) => acc + t.amount, 0)
    },
    overdue: {
      count: filteredList.filter(t => t.status === 'overdue').length,
      total: filteredList.filter(t => t.status === 'overdue').reduce((acc, t) => acc + t.amount, 0)
    }
  };

  const resumo = [
    { titulo: 'Saldo Atual', valor: formatCurrency(accountBalance), detalhe: accountBalance >= 0 ? 'Saldo Positivo' : 'Saldo Negativo', color: 'purple', icon: Wallet },
    { titulo: 'Receitas', valor: formatCurrency(monthlyInflow), detalhe: `${transactions.filter(t => t.type === 'inflow').length} entradas`, color: 'purple', icon: ArrowUpCircle },
    { titulo: 'Despesas', valor: formatCurrency(monthlyOutflow), detalhe: `${transactions.filter(t => t.type === 'outflow').length} saídas`, color: 'gradient', icon: ArrowDownCircle },
    { titulo: 'Contas a Vencer', valor: formatCurrency(bills.reduce((acc, b) => b.status !== 'paid' ? acc + b.amount : acc, 0)), detalhe: `${pendingBillsCount} pendências`, color: 'gradient', icon: AlertCircle },
  ];

  const metas = [
    { nome: 'Reserva de emergência', progresso: 72 },
    { nome: 'Viagem', progresso: 45 },
    { nome: 'Novo notebook', progresso: 30 },
  ];

  const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  return (
    <div className="min-h-screen text-white pb-12">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-end gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <button 
              onClick={() => onOpenModal()}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-brand-purple to-brand-orange text-white font-bold shadow-lg hover:scale-[1.02] transition flex items-center space-x-2 shadow-brand-purple/20"
            >
              <Plus size={18} />
              <span>Novo Lançamento</span>
            </button>
          </div>
        </div>

        {/* Alerta de Contas Atrasadas */}
        <AnimatePresence>
          {overdueBills.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-red-600/20 via-red-900/10 to-transparent border-2 border-red-500/30 p-8 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-2xl animate-pulse-red mb-6"
            >
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10 w-full lg:w-auto">
                <div className="relative">
                  <div className="w-20 h-20 rounded-3xl bg-red-600 flex items-center justify-center text-white shadow-[0_10px_25px_rgba(220,38,38,0.5)] animate-bounce relative z-10">
                    <AlertCircle size={40} />
                  </div>
                  <div className="absolute inset-0 bg-red-600 rounded-3xl blur-2xl opacity-40 animate-pulse" />
                </div>
                <div className="text-center md:text-left flex-1">
                  <div className="flex items-center justify-center md:justify-start space-x-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                    <h3 className="text-2xl font-black text-red-500 uppercase tracking-tighter italic">ALERTA : CONTA ATRASADA</h3>
                  </div>
                  <h4 className="text-3xl font-black text-white">Você tem {overdueBills.length} {overdueBills.length === 1 ? 'pendência vencida' : 'pendências vencidas'}!</h4>
                  <p className="text-red-400/80 font-bold mb-4">
                    Total em atraso: <span className="text-white text-3xl font-black ml-2">{formatCurrency(totalOverdueAmount)}</span>
                  </p>
                </div>
              </div>
              
              <div className="relative z-10 w-full lg:w-auto flex flex-col items-center gap-3">
                <button 
                  onClick={() => setActiveTab('bills')}
                  className="w-full lg:w-auto px-10 py-5 bg-red-600 text-white font-black rounded-2xl hover:bg-red-700 hover:scale-110 active:scale-95 transition-all shadow-[0_15px_30px_rgba(220,38,38,0.4)] text-lg uppercase tracking-widest flex items-center justify-center group"
                >
                  <span>Regularizar Agora</span>
                  <ArrowUpCircle size={24} className="ml-3 group-hover:rotate-45 transition-transform" />
                </button>
              </div>

              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full blur-[100px] -mr-32 -mt-32" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-red-900/40 rounded-full blur-[80px]" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Alerta de Contas a Vencer */}
        <AnimatePresence>
          {pendingBills.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="relative overflow-hidden rounded-[2rem] bg-brand-orange/10 border border-brand-orange/20 p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-2xl shadow-brand-orange/5 mb-8"
            >
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-2xl bg-brand-orange flex items-center justify-center text-white shadow-lg shadow-brand-orange/40">
                  <Clock size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-brand-orange uppercase tracking-tight italic">Próximos Vencimentos</h3>
                  <p className="text-brand-orange/80 text-sm font-medium">
                    <span className="font-bold text-brand-orange">{pendingBills.length}</span> contas a vencer: <span className="text-2xl font-black ml-2 text-white">{formatCurrency(totalPendingAmount)}</span>
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setActiveTab('bills')}
                className="px-6 py-3 bg-brand-orange text-white font-black rounded-xl hover:bg-brand-orange/80 transition-all shadow-lg shadow-brand-orange/20 text-sm uppercase tracking-widest"
              >
                Gerenciar Contas
              </button>
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange/5 rounded-full blur-3xl -mr-16 -mt-16" />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {resumo.map((item) => (
            <div 
              key={item.titulo} 
              className={cn(
                "relative group overflow-hidden rounded-[2.5rem] border p-6 shadow-2xl transition-all hover:scale-[1.02] hover:shadow-brand-purple/10",
                item.color === 'purple' ? "glass-purple border-brand-purple/20" : 
                item.color === 'gradient' ? "bg-gradient-to-br from-brand-purple/10 to-brand-orange/10 backdrop-blur-xl border-brand-orange/20" :
                "glass-orange border-brand-orange/20"
              )}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-12",
                  item.color === 'purple' ? "bg-brand-purple/20 text-brand-purple" : 
                  item.color === 'gradient' ? "bg-gradient-to-br from-brand-purple to-brand-orange text-white shadow-lg shadow-brand-purple/20" :
                  "bg-brand-orange/20 text-brand-orange"
                )}>
                  <item.icon size={24} />
                </div>
                <span className={cn(
                  "text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full",
                  item.color === 'purple' ? "bg-brand-purple/10 text-brand-purple" : 
                  item.color === 'gradient' ? "bg-white/10 text-white" :
                  "bg-brand-orange/10 text-brand-orange"
                )}>
                  {item.detalhe}
                </span>
              </div>
              
              <div>
                <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest">{item.titulo}</p>
                <h2 className={cn(
                  "text-3xl font-black mt-1 tracking-tight",
                  item.color === 'purple' ? "text-white" : "text-white"
                )}>{item.valor}</h2>
              </div>

              {/* Decorative Background Element */}
              <div className={cn(
                "absolute -right-4 -bottom-4 w-24 h-24 rounded-full blur-3xl opacity-20 transition-opacity group-hover:opacity-40",
                item.color === 'purple' ? "bg-brand-purple" : "bg-brand-orange"
              )} />
            </div>
          ))}
        </div>

        {/* Resumo por Status */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-3xl p-5 relative overflow-hidden group">
            <div className="flex items-center justify-between mb-2">
              <span className="text-emerald-400 text-[10px] font-black uppercase tracking-widest">Pagos</span>
              <CheckCircle2 size={16} className="text-emerald-400" />
            </div>
            <h4 className="text-2xl font-black text-white">{formatCurrency(statusSummary.paid.total)}</h4>
            <p className="text-emerald-400/60 text-xs font-bold">{statusSummary.paid.count} lançamentos</p>
            <div className="absolute -right-2 -bottom-2 w-12 h-12 bg-emerald-500/10 rounded-full blur-xl group-hover:scale-150 transition-transform" />
          </div>
          
          <div className="bg-brand-orange/10 border border-brand-orange/20 rounded-3xl p-5 relative overflow-hidden group">
            <div className="flex items-center justify-between mb-2">
              <span className="text-brand-orange text-[10px] font-black uppercase tracking-widest">Pendentes</span>
              <Clock size={16} className="text-brand-orange" />
            </div>
            <h4 className="text-2xl font-black text-white">{formatCurrency(statusSummary.pending.total)}</h4>
            <p className="text-brand-orange/60 text-xs font-bold">{statusSummary.pending.count} lançamentos</p>
            <div className="absolute -right-2 -bottom-2 w-12 h-12 bg-brand-orange/10 rounded-full blur-xl group-hover:scale-150 transition-transform" />
          </div>

          <div className="bg-red-500/10 border border-red-500/20 rounded-3xl p-5 relative overflow-hidden group">
            <div className="flex items-center justify-between mb-2">
              <span className="text-red-400 text-[10px] font-black uppercase tracking-widest">Atrasados</span>
              <AlertCircle size={16} className="text-red-400" />
            </div>
            <h4 className="text-2xl font-black text-white">{formatCurrency(statusSummary.overdue.total)}</h4>
            <p className="text-red-400/60 text-xs font-bold">{statusSummary.overdue.count} lançamentos</p>
            <div className="absolute -right-2 -bottom-2 w-12 h-12 bg-red-500/10 rounded-full blur-xl group-hover:scale-150 transition-transform" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-brand-purple" />
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-xl font-semibold">Últimos lançamentos</h3>
                <p className="text-zinc-400 text-sm">Entradas e saídas de {monthNames[selectedMonth]}</p>
              </div>
              
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                  {[
                    { id: 'all', label: 'Todos' },
                    { id: 'inflow', label: 'Entradas' },
                    { id: 'outflow', label: 'Saídas' },
                    { id: 'bills', label: 'Boletos' }
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setFilterType(f.id as any)}
                      className={cn(
                        "px-4 py-1.5 rounded-lg text-xs font-bold transition-all",
                        filterType === f.id 
                          ? "bg-brand-purple text-white shadow-lg" 
                          : "text-zinc-400 hover:text-white"
                      )}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setShowAll(!showAll)}
                    className={cn(
                      "px-4 py-2 rounded-xl border font-bold transition-all text-sm",
                      showAll 
                        ? "bg-brand-purple/20 border-brand-purple text-brand-purple" 
                        : "bg-white/5 border-white/10 text-zinc-400 hover:border-white/20"
                    )}
                  >
                    {showAll ? 'Ver Menos' : 'Ver Todos'}
                  </button>
                  
                  <div className="flex items-center bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 group hover:border-brand-purple/50 transition-colors">
                    <Calendar size={14} className="text-brand-purple mr-2" />
                    <select 
                      value={selectedMonth}
                      onChange={(e) => onPeriodChange(parseInt(e.target.value), selectedYear)}
                      className="bg-transparent border-none text-xs font-bold text-slate-300 outline-none cursor-pointer appearance-none pr-4"
                    >
                      {monthNames.map((name, i) => (
                        <option key={name} value={i} className="bg-[#0F172A]">{name}</option>
                      ))}
                    </select>
                    <div className="w-[1px] h-3 bg-white/10 mx-1" />
                    <select 
                      value={selectedYear}
                      onChange={(e) => onPeriodChange(selectedMonth, parseInt(e.target.value))}
                      className="bg-transparent border-none text-xs font-bold text-slate-300 outline-none cursor-pointer appearance-none px-2"
                    >
                      {[2024, 2025, 2026].map(y => (
                        <option key={y} value={y} className="bg-[#0F172A]">{y}</option>
                      ))}
                    </select>
                  </div>
                  <button 
                    onClick={() => setShowDeleteConfirm(true)}
                    className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-red-500/10 text-red-400 font-bold border border-red-500/20 hover:bg-red-500/20 transition text-sm"
                  >
                    <Trash2 size={16} />
                    <span className="hidden sm:inline">Limpar</span>
                  </button>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-zinc-400 text-sm border-b border-white/10">
                    <th className="pb-3">Tipo</th>
                    <th className="pb-3">Categoria</th>
                    <th className="pb-3">Data</th>
                    <th className="pb-3">Valor</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {displayTransactions.map((item, index) => (
                    <tr key={index} className="border-b border-white/5 group">
                      <td className="py-4">
                        <div className={cn(
                          "inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                          item.type === 'inflow' ? "bg-brand-purple/10 text-brand-purple" : "bg-brand-orange/10 text-brand-orange"
                        )}>
                          {item.type === 'inflow' ? 'Entrada' : 'Saída'}
                        </div>
                      </td>
                      <td className="py-4">{item.category}</td>
                      <td className="py-4 text-zinc-400">{formatDateBR(item.date)}</td>
                      <td className="py-4 font-semibold">
                        {item.type === 'inflow' ? '+' : '-'} {formatCurrency(item.amount)}
                      </td>
                      <td className="py-4">
                        <div className={cn(
                          "inline-flex items-center px-4 py-1.5 rounded-xl border transition-all",
                          item.status === 'paid' ? "bg-emerald-500/10 border-emerald-500/20" : 
                          item.status === 'overdue' ? "bg-red-500/10 border-red-500/20 animate-pulse-red" : "bg-brand-orange/10 border-brand-orange/20"
                        )}>
                          <div className={cn(
                            "w-1.5 h-1.5 rounded-full mr-2",
                            item.status === 'paid' ? "bg-emerald-500" : 
                            item.status === 'overdue' ? "bg-red-500" : "bg-brand-orange"
                          )} />
                          <select 
                            value={item.status}
                            onChange={(e) => onUpdateTransactionStatus(item.id, e.target.value as any)}
                            className={cn(
                              "bg-transparent border-none text-[10px] font-black uppercase tracking-tighter cursor-pointer outline-none appearance-none",
                              item.status === 'paid' ? "text-emerald-400" : 
                              item.status === 'overdue' ? "text-red-400" : "text-brand-orange"
                            )}
                          >
                            <option value="paid" className="bg-[#1E293B]">Pago</option>
                            <option value="pending" className="bg-[#1E293B]">Pendente</option>
                            <option value="overdue" className="bg-[#1E293B]">Atrasado</option>
                          </select>
                        </div>
                      </td>
                      <td className="py-4 text-right">
                        <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => onEditTransaction(item)}
                            className="p-2 hover:bg-brand-purple/10 rounded-lg text-zinc-400 hover:text-brand-purple transition-colors"
                            title="Editar"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            onClick={() => onDeleteTransaction(item.id)}
                            className="p-2 hover:bg-red-500/10 rounded-lg text-zinc-400 hover:text-red-400 transition-colors"
                            title="Excluir"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-brand-purple" />
            <h3 className="text-xl font-semibold">Contas e vencimentos</h3>
            <p className="text-zinc-400 text-sm mt-1">Alertas importantes do mês</p>
            <div className="mt-5 space-y-4">
              {bills.filter(b => b.status !== 'paid').slice(0, 4).map((conta) => (
                <div key={conta.id} className="flex items-center justify-between rounded-2xl bg-black/20 border border-white/5 p-4 group">
                  <div>
                    <p className="font-medium">{conta.description}</p>
                    <p className="text-sm text-zinc-400">Vencimento: {formatDateBR(conta.dueDate)}</p>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <p className="font-semibold">{formatCurrency(conta.amount)}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`text-xs px-3 py-1 rounded-full ${conta.status === 'overdue' ? 'bg-red-500/15 text-red-400' : 'bg-brand-orange/15 text-brand-orange'}`}>
                        {conta.status === 'overdue' ? 'Atrasada' : 'A vencer'}
                      </span>
                      <button 
                        onClick={() => onUpdateTransactionStatus(conta.id, 'paid')}
                        className="text-[10px] font-black text-white uppercase opacity-0 group-hover:opacity-100 transition-opacity bg-brand-purple/20 px-2 py-1 rounded-lg hover:bg-brand-purple/40"
                      >
                        Pagar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {bills.filter(b => b.status !== 'paid').length === 0 && (
                <p className="text-center text-zinc-500 py-4">Tudo em dia!</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Confirmação de Exclusão */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeleteConfirm(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-[#1E293B] border border-white/10 rounded-3xl p-8 shadow-2xl"
            >
              <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <Trash2 size={32} className="text-red-400" />
              </div>
              <h3 className="text-2xl font-bold text-center mb-2">Excluir tudo?</h3>
              <p className="text-zinc-400 text-center mb-8">
                Esta ação irá apagar permanentemente todos os seus lançamentos e contas. Não é possível desfazer.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="w-full py-4 rounded-2xl bg-white/5 text-white font-bold hover:bg-white/10 transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    onDeleteAllTransactions();
                    setShowDeleteConfirm(false);
                  }}
                  className="w-full py-4 rounded-2xl bg-red-500 text-white font-bold hover:bg-red-600 transition shadow-lg shadow-red-500/20"
                >
                  Sim, Excluir
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
