import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Target, TrendingUp, Info, Lightbulb, ArrowRight, Wallet, Calculator } from 'lucide-react';
import { Transaction } from '../types';
import { cn, formatCurrency } from '../lib/utils';

interface EmergencyReserveSectionProps {
  transactions: Transaction[];
  currentReserve: number;
  onUpdateReserve: (amount: number) => void;
}

export function EmergencyReserveSection({ transactions, currentReserve, onUpdateReserve }: EmergencyReserveSectionProps) {
  const [monthsGoal, setMonthsGoal] = useState(6);
  const [monthlyContribution, setMonthlyContribution] = useState(500);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingTarget, setIsEditingTarget] = useState(false);
  const [tempReserve, setTempReserve] = useState(currentReserve.toString());
  const [manualTarget, setManualTarget] = useState<number | null>(null);
  const [tempTarget, setTempTarget] = useState('');

  // Calculate average monthly expenses from transactions
  const averageMonthlyExpenses = useMemo(() => {
    const outflows = transactions.filter(t => t.type === 'outflow');
    if (outflows.length === 0) return 2000; // Default fallback

    // Group by month/year
    const monthlyTotals: { [key: string]: number } = {};
    outflows.forEach(t => {
      const date = new Date(t.date);
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      monthlyTotals[key] = (monthlyTotals[key] || 0) + t.amount;
    });

    const totals = Object.values(monthlyTotals);
    const sum = totals.reduce((acc, val) => acc + val, 0);
    return sum / totals.length || 2000;
  }, [transactions]);

  const targetAmount = manualTarget || (averageMonthlyExpenses * monthsGoal);
  const progress = Math.min((currentReserve / targetAmount) * 100, 100);
  const remainingAmount = Math.max(targetAmount - currentReserve, 0);
  const monthsToReachGoal = monthlyContribution > 0 ? Math.ceil(remainingAmount / monthlyContribution) : 0;

  const handleSaveReserve = () => {
    onUpdateReserve(parseFloat(tempReserve) || 0);
    setIsEditing(false);
  };

  const handleSaveTarget = () => {
    const val = parseFloat(tempTarget);
    if (!isNaN(val) && val > 0) {
      setManualTarget(val);
    } else {
      setManualTarget(null);
    }
    setIsEditingTarget(false);
  };

  return (
    <div className="space-y-8 pb-12">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Reserva de Emergência</h2>
          <p className="text-slate-400">Sua base de segurança financeira para imprevistos.</p>
        </div>
        <div className="flex items-center space-x-3 bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/20">
          <ShieldCheck className="text-emerald-400" size={20} />
          <span className="text-emerald-400 font-bold text-sm">Status: {progress === 100 ? 'Protegido' : 'Em Construção'}</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Progress Card */}
        <div className="lg:col-span-2 glass p-8 rounded-[2.5rem] relative overflow-hidden">
          <div className="absolute -right-10 -top-10 opacity-5">
            <ShieldCheck size={240} className="text-brand-purple" />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Valor Acumulado</p>
                {isEditing ? (
                  <div className="flex items-center space-x-2 mt-2">
                    <input 
                      type="number"
                      value={tempReserve}
                      onChange={(e) => setTempReserve(e.target.value)}
                      className="bg-white/5 border border-white/10 rounded-xl py-2 px-4 text-2xl font-black outline-none focus:border-brand-purple w-48"
                      autoFocus
                    />
                    <button 
                      onClick={handleSaveReserve}
                      className="bg-brand-purple px-4 py-2 rounded-xl font-bold text-sm"
                    >
                      Salvar
                    </button>
                  </div>
                ) : (
                  <h3 
                    className="text-5xl font-black mt-2 cursor-pointer hover:text-brand-purple transition-colors"
                    onClick={() => {
                      setTempReserve(currentReserve.toString());
                      setIsEditing(true);
                    }}
                  >
                    {formatCurrency(currentReserve)}
                  </h3>
                )}
              </div>
              <div className="text-right">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Meta de Segurança</p>
                {isEditingTarget ? (
                  <div className="flex items-center justify-end space-x-2 mt-2">
                    <input 
                      type="number"
                      value={tempTarget}
                      onChange={(e) => setTempTarget(e.target.value)}
                      placeholder="Valor personalizado"
                      className="bg-white/5 border border-white/10 rounded-xl py-1 px-3 text-right font-bold outline-none focus:border-brand-purple w-32 text-sm"
                      autoFocus
                    />
                    <button 
                      onClick={handleSaveTarget}
                      className="bg-brand-purple px-3 py-1 rounded-lg font-bold text-[10px]"
                    >
                      OK
                    </button>
                  </div>
                ) : (
                  <h4 
                    className="text-2xl font-bold mt-2 text-slate-200 cursor-pointer hover:text-brand-purple transition-colors flex items-center justify-end"
                    onClick={() => {
                      setTempTarget(targetAmount.toString());
                      setIsEditingTarget(true);
                    }}
                  >
                    {formatCurrency(targetAmount)}
                    {manualTarget && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setManualTarget(null);
                        }}
                        className="ml-2 text-[10px] bg-white/10 px-1.5 py-0.5 rounded hover:bg-white/20 text-slate-400"
                        title="Voltar para automático"
                      >
                        Auto
                      </button>
                    )}
                  </h4>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-sm font-bold text-brand-purple">{progress.toFixed(1)}% concluído</span>
                <span className="text-xs text-slate-500">Faltam {formatCurrency(remainingAmount)}</span>
              </div>
              <div className="w-full bg-white/5 h-6 rounded-full overflow-hidden p-1 border border-white/10">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-gradient-to-r from-brand-purple to-brand-orange rounded-full relative"
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse" />
                </motion.div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Gasto Médio Mensal</p>
                <p className="text-lg font-bold">{formatCurrency(averageMonthlyExpenses)}</p>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Meses de Cobertura</p>
                <div className="flex items-center space-x-2">
                  <p className="text-lg font-bold">{monthsGoal} meses</p>
                  <div className="flex space-x-1">
                    {[3, 6, 12].map(m => (
                      <button 
                        key={m}
                        onClick={() => setMonthsGoal(m)}
                        className={cn(
                          "px-2 py-0.5 rounded-md text-[10px] font-bold transition-all",
                          monthsGoal === m ? "bg-brand-purple text-white" : "bg-white/10 text-slate-400 hover:bg-white/20"
                        )}
                      >
                        {m}m
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10">
                <p className="text-[10px] font-bold text-emerald-500 uppercase mb-1">Tempo Estimado</p>
                <p className="text-lg font-bold text-emerald-400">{monthsToReachGoal} meses</p>
              </div>
            </div>
          </div>
        </div>

        {/* Strategy & Suggestions */}
        <div className="space-y-6">
          <div className="glass p-8 rounded-[2.5rem]">
            <h4 className="text-xl font-bold mb-6 flex items-center">
              <TrendingUp size={24} className="mr-2 text-brand-orange" />
              Plano de Ação
            </h4>
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase mb-2 block tracking-widest">Aporte Mensal Sugerido</label>
                <div className="relative">
                  <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                  <input 
                    type="number" 
                    value={monthlyContribution}
                    onChange={(e) => setMonthlyContribution(parseFloat(e.target.value) || 0)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 outline-none focus:border-brand-purple transition-colors text-sm font-bold"
                  />
                </div>
              </div>

              <div className="p-4 bg-brand-orange/5 rounded-2xl border border-brand-orange/10">
                <p className="text-xs text-slate-300 leading-relaxed">
                  Para atingir sua meta de <span className="text-white font-bold">{formatCurrency(targetAmount)}</span>, você precisa guardar <span className="text-brand-orange font-bold">{formatCurrency(monthlyContribution)}</span> por mês durante os próximos <span className="text-white font-bold">{monthsToReachGoal} meses</span>.
                </p>
              </div>

              <button className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-sm font-bold transition-all flex items-center justify-center group">
                <span>Ver onde investir</span>
                <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          <div className="glass-orange p-8 rounded-[2.5rem]">
            <h4 className="text-lg font-bold mb-4 flex items-center text-brand-orange">
              <Lightbulb size={20} className="mr-2" />
              Por que ter uma reserva?
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              A reserva de emergência é o seu "seguro contra a vida". Ela deve ser usada apenas para:
            </p>
            <ul className="mt-4 space-y-2">
              <li className="flex items-center text-[10px] text-slate-300">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-orange mr-2" />
                Perda de emprego ou renda
              </li>
              <li className="flex items-center text-[10px] text-slate-300">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-orange mr-2" />
                Problemas de saúde urgentes
              </li>
              <li className="flex items-center text-[10px] text-slate-300">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-orange mr-2" />
                Consertos essenciais (casa/carro)
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Educational Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass p-8 rounded-[2.5rem] flex items-start space-x-6">
          <div className="w-16 h-16 rounded-2xl bg-brand-purple/20 flex items-center justify-center shrink-0">
            <Calculator size={32} className="text-brand-purple" />
          </div>
          <div>
            <h5 className="text-lg font-bold mb-2">Como calculamos sua meta?</h5>
            <p className="text-sm text-slate-400 leading-relaxed">
              Analisamos seus gastos dos últimos meses para entender seu custo de vida real. 
              Para CLT, sugerimos 6 meses. Para autônomos, 12 meses é o ideal devido à volatilidade da renda.
            </p>
          </div>
        </div>

        <div className="glass p-8 rounded-[2.5rem] flex items-start space-x-6">
          <div className="w-16 h-16 rounded-2xl bg-brand-orange/20 flex items-center justify-center shrink-0">
            <Target size={32} className="text-brand-orange" />
          </div>
          <div>
            <h5 className="text-lg font-bold mb-2">Onde deixar esse dinheiro?</h5>
            <p className="text-sm text-slate-400 leading-relaxed">
              A reserva precisa de <span className="text-white font-bold">Liquidez Diária</span> e <span className="text-white font-bold">Baixo Risco</span>. 
              As melhores opções são: Tesouro Selic, CDBs de grandes bancos com liquidez diária ou Contas Digitais (100% CDI).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
