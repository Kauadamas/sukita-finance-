import React from 'react';
import { motion } from 'motion/react';
import { Receipt, Plus, Search, Filter, AlertCircle, CheckCircle2, Clock, ScanLine, Trash2, ShieldAlert, Lightbulb, ArrowRight } from 'lucide-react';
import { Bill } from '../types';
import { cn, formatCurrency, formatDateBR } from '../lib/utils';

interface BillsSectionProps {
  onOpenModal?: () => void;
  bills: Bill[];
  onUpdateTransactionStatus?: (id: string, status: 'paid' | 'pending' | 'overdue') => void;
  onDeleteTransaction?: (id: string) => void;
  onPayAllOverdue?: () => void;
  selectedMonth: number;
}

export function BillsSection({ onOpenModal, bills, onUpdateTransactionStatus, onDeleteTransaction, onPayAllOverdue, selectedMonth }: BillsSectionProps) {
  const [searchTerm, setSearchTerm] = React.useState('');
  
  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const filteredBills = bills.filter(b => 
    b.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalOverdue = bills
    .filter(b => b.status === 'overdue')
    .reduce((acc, b) => acc + b.amount, 0);
  
  const totalPending = bills
    .filter(b => b.status === 'pending')
    .reduce((acc, b) => acc + b.amount, 0);
  
  const totalPaid = bills
    .filter(b => b.status === 'paid')
    .reduce((acc, b) => acc + b.amount, 0);

  const billsDueToday = bills.filter(b => {
    const dueDate = new Date(b.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    return b.status !== 'paid' && dueDate.getTime() === today.getTime();
  });

  const overdueBills = bills.filter(b => b.status === 'overdue');
  const recentlyPaid = bills.filter(b => b.status === 'paid').slice(0, 3);

  return (
    <div className="space-y-8 pb-12">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Boletos e Contas</h2>
          <p className="text-slate-400">Organize seus pagamentos e evite juros e multas.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={onOpenModal}
            className="flex items-center space-x-2 bg-gradient-to-r from-brand-purple to-brand-orange px-6 py-3 rounded-2xl font-bold hover:scale-105 transition-all shadow-lg shadow-brand-purple/20 text-sm"
          >
            <Plus size={20} />
            <span>Novo Boleto</span>
          </button>
          <button 
            className="flex items-center space-x-2 bg-white/5 border border-white/10 px-4 py-2 rounded-xl font-bold hover:bg-white/10 transition-all text-sm text-slate-300"
            onClick={() => alert('Leitura de código de barras será implementada em breve!')}
          >
            <ScanLine size={18} />
            <span>Escanear</span>
          </button>
        </div>
      </header>

      {/* Real-time Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {overdueBills.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center justify-between p-4 bg-red-500/10 border border-red-500/20 rounded-2xl"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white">
                  <ShieldAlert size={18} />
                </div>
                <div>
                  <p className="text-sm font-bold text-red-400">Boleto Vencido</p>
                  <p className="text-xs text-red-400/80">Você tem {overdueBills.length} conta(s) atrasada(s). Pague para evitar juros.</p>
                </div>
              </div>
              <span className="text-xs font-black text-red-400 uppercase tracking-widest">Urgente</span>
            </motion.div>
          )}

          {billsDueToday.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center justify-between p-4 bg-orange-500/10 border border-orange-500/20 rounded-2xl"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white">
                  <Clock size={18} />
                </div>
                <div>
                  <p className="text-sm font-bold text-orange-400">Vence Hoje</p>
                  <p className="text-xs text-orange-400/80">{billsDueToday.length} boleto(s) vencem hoje. Não esqueça de pagar!</p>
                </div>
              </div>
              <span className="text-xs font-black text-orange-400 uppercase tracking-widest">Atenção</span>
            </motion.div>
          )}

          {recentlyPaid.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center justify-between p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                  <CheckCircle2 size={18} />
                </div>
                <div>
                  <p className="text-sm font-bold text-emerald-400">Pago com Sucesso</p>
                  <p className="text-xs text-emerald-400/80">Boletos recentes foram liquidados corretamente.</p>
                </div>
              </div>
              <span className="text-xs font-black text-emerald-400 uppercase tracking-widest">Concluído</span>
            </motion.div>
          )}
        </div>

        <div className="glass p-6 rounded-[2rem] border border-brand-purple/20">
          <h4 className="text-sm font-bold flex items-center text-brand-purple mb-4">
            <Lightbulb size={18} className="mr-2" />
            Estratégia SUKITA
          </h4>
          <ul className="space-y-3">
            <li className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-purple mt-1.5 shrink-0" />
              <p className="text-[10px] text-slate-400 leading-relaxed">Priorize contas com juros altos (ex: Cartão de Crédito) se o orçamento estiver apertado.</p>
            </li>
            <li className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-purple mt-1.5 shrink-0" />
              <p className="text-[10px] text-slate-400 leading-relaxed">Agende seus pagamentos para o dia do recebimento do salário.</p>
            </li>
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass p-6 rounded-3xl border-l-4 border-red-500">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Vencidos</p>
          <h3 className="text-2xl font-bold mt-1">{formatCurrency(totalOverdue)}</h3>
        </div>
        <div className="glass p-6 rounded-3xl border-l-4 border-orange-500">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Pendentes</p>
          <h3 className="text-2xl font-bold mt-1">{formatCurrency(totalPending)}</h3>
        </div>
        <div className="glass p-6 rounded-3xl border-l-4 border-emerald-500">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Pagos ({months[selectedMonth]})</p>
          <h3 className="text-2xl font-bold mt-1">{formatCurrency(totalPaid)}</h3>
        </div>
      </div>

      <div className="glass p-8 rounded-[2rem]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Buscar boleto..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-brand-purple transition-colors"
            />
          </div>
          <div className="flex items-center space-x-3">
            <button className="flex items-center space-x-2 px-4 py-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
              <Filter size={18} />
              <span>Filtros</span>
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {filteredBills.length > 0 ? (
            filteredBills.map((bill) => (
              <div key={bill.id} className="flex items-center justify-between p-6 bg-white/5 rounded-3xl border border-white/5 hover:border-white/10 transition-all group">
                <div className="flex items-center space-x-4">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center",
                    bill.status === 'paid' ? "bg-emerald-500/20 text-emerald-400" :
                    bill.status === 'overdue' ? "bg-red-500/20 text-red-400" : "bg-orange-500/20 text-orange-400"
                  )}>
                    {bill.status === 'paid' ? <CheckCircle2 size={24} /> : 
                     bill.status === 'overdue' ? <AlertCircle size={24} /> : <Clock size={24} />}
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">{bill.description}</h4>
                    <div className="flex items-center space-x-2">
                      <p className="text-sm text-slate-400">Vencimento: {formatDateBR(bill.dueDate)}</p>
                      {new Date(bill.dueDate).getTime() === today.getTime() && bill.status !== 'paid' && (
                        <span className="text-[10px] font-bold text-orange-400 bg-orange-400/10 px-1.5 rounded">Vence Hoje</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-8">
                  <div className="text-right flex flex-col items-end">
                    <p className="text-xl font-bold">{formatCurrency(bill.amount)}</p>
                    <select
                      value={bill.status}
                      onChange={(e) => onUpdateTransactionStatus?.(bill.id, e.target.value as any)}
                      className={cn(
                        "text-[10px] font-bold uppercase tracking-widest bg-transparent outline-none cursor-pointer appearance-none border-none text-right",
                        bill.status === 'paid' ? "text-emerald-400" :
                        bill.status === 'overdue' ? "text-red-400" : "text-orange-400"
                      )}
                    >
                      <option value="paid" className="bg-[#0F172A]">Pago</option>
                      <option value="pending" className="bg-[#0F172A]">Pendente</option>
                      <option value="overdue" className="bg-[#0F172A]">Vencido</option>
                    </select>
                  </div>
                  <button 
                    onClick={() => onDeleteTransaction?.(bill.id)}
                    className="p-3 bg-white/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/10 hover:text-red-400"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-500">Nenhum boleto encontrado</p>
            </div>
          )}
        </div>
      </div>

      <div className="glass-purple p-8 rounded-[2rem] flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className={cn(
            "w-16 h-16 rounded-full flex items-center justify-center",
            totalOverdue > 0 ? "bg-red-500/20 text-red-400" : "bg-brand-purple/20 text-brand-purple"
          )}>
            <AlertCircle size={32} className={totalOverdue > 0 ? "animate-pulse" : ""} />
          </div>
          <div>
            <h4 className="text-xl font-bold">Alertas Inteligentes</h4>
            <p className="text-slate-300 mt-1">
              {totalOverdue > 0 
                ? `🚨 Você tem ${formatCurrency(totalOverdue)} em contas atrasadas! Pague agora para evitar multas.`
                : totalPending > 0
                  ? `📅 Você tem ${formatCurrency(totalPending)} em contas próximas ao vencimento.`
                  : "✅ Tudo em dia! Adicione seus boletos para receber alertas de vencimento."}
            </p>
          </div>
        </div>
        {totalOverdue > 0 && (
          <button 
            onClick={onPayAllOverdue}
            className="px-6 py-3 bg-red-500 text-white rounded-xl font-bold shadow-lg shadow-red-500/20 hover:bg-red-600 transition-colors"
          >
            Pagar Atrasados
          </button>
        )}
      </div>
    </div>
  );
}
