import React from 'react';
import { motion } from 'motion/react';
import { TrendingUp, PieChart, Target, ShieldCheck, ArrowUpRight, Plus, Calculator, Lightbulb, Info, AlertCircle, Trash2, ArrowRight } from 'lucide-react';
import { Investment, Transaction } from '../types';
import { cn, formatCurrency, formatDateBR } from '../lib/utils';
import { PieChart as RePieChart, Pie, Cell, ResponsiveContainer, Tooltip as ReTooltip } from 'recharts';

interface InvestmentsSectionProps {
  onOpenModal?: () => void;
  investments: Investment[];
  onDeleteInvestment?: (id: string) => void;
}

export function InvestmentsSection({ onOpenModal, investments, onDeleteInvestment }: InvestmentsSectionProps) {
  const [showSimulator, setShowSimulator] = React.useState(false);
  const [simAmount, setSimAmount] = React.useState('1000');
  const [simRate, setSimRate] = React.useState('12');
  const [simYears, setSimYears] = React.useState('5');

  const totalInvested = investments.reduce((acc, inv) => acc + inv.amount, 0);
  const totalCurrentValue = investments.reduce((acc, inv) => acc + inv.currentValue, 0);
  const totalProfit = totalCurrentValue - totalInvested;
  const totalProfitPercent = totalInvested > 0 ? (totalProfit / totalInvested) * 100 : 0;

  const allocation = {
    fixed: investments.filter(i => i.type === 'fixed').reduce((acc, i) => acc + i.currentValue, 0),
    fund: investments.filter(i => i.type === 'fund').reduce((acc, i) => acc + i.currentValue, 0),
    risk: investments.filter(i => i.type === 'risk').reduce((acc, i) => acc + i.currentValue, 0),
  };

  const currentAllocationPercent = {
    fixed: totalCurrentValue > 0 ? (allocation.fixed / totalCurrentValue) * 100 : 0,
    fund: totalCurrentValue > 0 ? (allocation.fund / totalCurrentValue) * 100 : 0,
    risk: totalCurrentValue > 0 ? (allocation.risk / totalCurrentValue) * 100 : 0,
  };

  const chartData = [
    { name: 'Renda Fixa', value: currentAllocationPercent.fixed || 0, color: '#8B5CF6', target: 50 },
    { name: 'Fundos', value: currentAllocationPercent.fund || 0, color: '#F97316', target: 30 },
    { name: 'Ações/Cripto', value: currentAllocationPercent.risk || 0, color: '#06B6D4', target: 20 },
  ];

  const calculateSimulation = () => {
    const p = parseFloat(simAmount);
    const r = parseFloat(simRate) / 100 / 12;
    const n = parseFloat(simYears) * 12;
    // Simple monthly contribution simulation: FV = PMT * [((1 + r)^n - 1) / r]
    // For simplicity, let's just do initial amount compound interest: FV = P * (1 + r)^n
    return p * Math.pow(1 + r, n);
  };

  const suggestions = [
    { name: 'Tesouro Selic 2029', type: 'Renda Fixa', desc: 'Ideal para reserva de emergência. Liquidez diária e segurança total.', category: 'fixed' },
    { name: 'CDB 110% CDI', type: 'Renda Fixa', desc: 'Ótima rentabilidade para médio prazo com garantia do FGC.', category: 'fixed' },
    { name: 'FII HGLG11', type: 'Fundos', desc: 'Fundo de logística sólido com dividendos mensais isentos.', category: 'fund' },
    { name: 'IVVB11 (S&P 500)', type: 'Risco', desc: 'Exposição às 500 maiores empresas dos EUA em reais.', category: 'risk' },
  ];

  return (
    <div className="space-y-8 pb-12">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Investimentos</h2>
          <p className="text-slate-400">Acompanhe a rentabilidade e diversificação do seu patrimônio.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Summary Card */}
        <div className="glass p-8 rounded-[2rem] flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -right-4 -top-4 opacity-5">
            <TrendingUp size={160} />
          </div>
          <div>
            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Patrimônio Atual</p>
            <h3 className="text-4xl font-black mt-2">{formatCurrency(totalCurrentValue)}</h3>
            <div className={cn(
              "flex items-center mt-4 text-sm font-bold",
              totalProfit >= 0 ? "text-emerald-400" : "text-red-400"
            )}>
              {totalProfit >= 0 ? <ArrowUpRight size={16} className="mr-1" /> : <ArrowUpRight size={16} className="mr-1 rotate-90" />}
              <span>{formatCurrency(Math.abs(totalProfit))} ({totalProfitPercent.toFixed(2)}%)</span>
            </div>
          </div>
          
          <div className="mt-8 space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400 font-medium">Total Investido</span>
              <span className="text-white font-bold">{formatCurrency(totalInvested)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400 font-medium">Lucro/Prejuízo</span>
              <span className={cn("font-bold", totalProfit >= 0 ? "text-emerald-400" : "text-red-400")}>
                {formatCurrency(totalProfit)}
              </span>
            </div>
          </div>
        </div>

        {/* Strategy Analysis */}
        <div className="glass p-8 rounded-[2rem] lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-xl font-bold flex items-center">
              <Lightbulb size={24} className="mr-2 text-brand-orange" />
              Estratégia SukitaFinançe (50/30/20)
            </h4>
            <div className="px-3 py-1 bg-brand-orange/10 rounded-full border border-brand-orange/20">
              <span className="text-[10px] font-bold text-brand-orange uppercase tracking-widest">Análise de Carteira</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1 h-40">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={55}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </RePieChart>
              </ResponsiveContainer>
            </div>
            <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
              {chartData.map(item => {
                const diff = item.value - item.target;
                return (
                  <div key={item.name} className="p-4 bg-white/5 rounded-2xl border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{item.name}</span>
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                    </div>
                    <div className="flex items-baseline space-x-2">
                      <span className="text-xl font-bold">{item.value.toFixed(1)}%</span>
                      <span className="text-[10px] text-slate-500">Alvo: {item.target}%</span>
                    </div>
                    <div className="mt-3">
                      <div className="w-full bg-black/20 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="h-full transition-all" 
                          style={{ width: `${item.value}%`, backgroundColor: item.color }} 
                        />
                      </div>
                    </div>
                    <p className={cn(
                      "text-[9px] font-bold mt-2 uppercase tracking-tighter",
                      Math.abs(diff) < 5 ? "text-emerald-400" : "text-brand-orange"
                    )}>
                      {Math.abs(diff) < 5 ? '✓ Balanceado' : diff > 0 ? `↑ Reduzir ${diff.toFixed(1)}%` : `↓ Aumentar ${Math.abs(diff).toFixed(1)}%`}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 p-4 bg-brand-purple/5 rounded-2xl border border-brand-purple/10 flex items-start space-x-3">
            <Info size={18} className="text-brand-purple shrink-0 mt-0.5" />
            <p className="text-xs text-slate-300 leading-relaxed">
              Sua carteira ideal deve ter **50% em Renda Fixa** (segurança), **30% em Fundos** (diversificação) e **20% em Risco** (potencial de lucro). 
              {investments.length > 0 ? " Rebalanceie seus aportes para atingir o equilíbrio ideal." : " Comece seu primeiro aporte hoje!"}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Asset List */}
        <div className="lg:col-span-2 glass p-8 rounded-[2rem]">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-xl font-bold flex items-center">
              <PieChart size={24} className="mr-2 text-brand-purple" />
              Meus Ativos
            </h4>
            <div className="flex space-x-2">
              <button 
                onClick={() => setShowSimulator(!showSimulator)}
                className={cn(
                  "flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all",
                  showSimulator ? "bg-brand-purple text-white" : "bg-white/5 text-slate-400 hover:bg-white/10"
                )}
              >
                <Calculator size={14} />
                <span>Simulador</span>
              </button>
            </div>
          </div>

          {showSimulator && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-8 p-6 bg-brand-purple/5 rounded-3xl border border-brand-purple/20"
            >
              <h5 className="text-sm font-bold mb-4 flex items-center text-brand-purple">
                <Calculator size={16} className="mr-2" />
                Simulador de Juros Compostos
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase mb-1.5 block">Aporte Inicial (R$)</label>
                  <input 
                    type="number" 
                    value={simAmount}
                    onChange={(e) => setSimAmount(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-3 text-sm outline-none focus:border-brand-purple"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase mb-1.5 block">Taxa Anual (%)</label>
                  <input 
                    type="number" 
                    value={simRate}
                    onChange={(e) => setSimRate(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-3 text-sm outline-none focus:border-brand-purple"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase mb-1.5 block">Período (Anos)</label>
                  <input 
                    type="number" 
                    value={simYears}
                    onChange={(e) => setSimYears(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-3 text-sm outline-none focus:border-brand-purple"
                  />
                </div>
              </div>
              <div className="mt-6 flex items-center justify-between p-4 bg-white/5 rounded-2xl">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Resultado Estimado</p>
                  <p className="text-2xl font-black text-white">{formatCurrency(calculateSimulation())}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Lucro Bruto</p>
                  <p className="text-lg font-bold text-emerald-400">+ {formatCurrency(calculateSimulation() - parseFloat(simAmount || '0'))}</p>
                </div>
              </div>
            </motion.div>
          )}

          <div className="space-y-4">
            {investments.length > 0 ? (
              investments.map((inv) => (
                <div key={inv.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors group">
                  <div className="flex items-center space-x-4">
                    <div className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center",
                      inv.type === 'fixed' ? "bg-brand-purple/20 text-brand-purple" : 
                      inv.type === 'fund' ? "bg-brand-orange/20 text-brand-orange" : "bg-cyan-500/20 text-cyan-400"
                    )}>
                      <TrendingUp size={24} />
                    </div>
                    <div>
                      <p className="font-bold">{inv.name}</p>
                      <div className="flex items-center space-x-2">
                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">{inv.category}</p>
                        <span className="w-1 h-1 bg-slate-600 rounded-full" />
                        <p className="text-[10px] text-slate-500">{formatDateBR(inv.date)}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="text-right">
                      <p className="font-bold">{formatCurrency(inv.currentValue)}</p>
                      <p className={cn(
                        "text-[10px] font-bold flex items-center justify-end",
                        inv.currentValue >= inv.amount ? "text-emerald-400" : "text-red-400"
                      )}>
                        {inv.currentValue >= inv.amount ? <ArrowUpRight size={10} className="mr-0.5" /> : <ArrowUpRight size={10} className="mr-0.5 rotate-90" />}
                        {((inv.currentValue - inv.amount) / inv.amount * 100).toFixed(2)}%
                      </p>
                    </div>
                    <button 
                      onClick={() => onDeleteInvestment?.(inv.id)}
                      className="p-2 text-slate-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 border-2 border-dashed border-white/5 rounded-[2rem]">
                <AlertCircle size={48} className="mx-auto text-slate-600 mb-4 opacity-20" />
                <p className="text-slate-500 font-medium">Nenhum investimento cadastrado</p>
                <button 
                  onClick={onOpenModal}
                  className="mt-4 text-brand-purple font-bold text-sm hover:underline"
                >
                  Começar a investir agora
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Suggestions & Education */}
        <div className="space-y-8">
          <div className="glass p-8 rounded-[2rem]">
            <h4 className="text-xl font-bold mb-6 flex items-center">
              <Target size={24} className="mr-2 text-brand-orange" />
              Sugestões de Aporte
            </h4>
            <div className="space-y-4">
              {suggestions.map((s) => (
                <div key={s.name} className="p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all cursor-pointer group">
                  <div className="flex items-center justify-between mb-2">
                    <span className={cn(
                      "text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest",
                      s.category === 'fixed' ? "bg-brand-purple/20 text-brand-purple" : 
                      s.category === 'fund' ? "bg-brand-orange/20 text-brand-orange" : "bg-cyan-500/20 text-cyan-400"
                    )}>
                      {s.type}
                    </span>
                    <ArrowRight size={14} className="text-slate-600 group-hover:text-white transition-colors" />
                  </div>
                  <p className="font-bold text-sm">{s.name}</p>
                  <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-orange p-8 rounded-[2rem]">
            <h4 className="text-xl font-bold mb-4 flex items-center text-brand-orange">
              <Lightbulb size={24} className="mr-2" />
              Dica para Iniciantes
            </h4>
            <div className="space-y-4">
              <div className="p-4 bg-white/5 rounded-2xl">
                <p className="text-xs text-slate-200 font-bold mb-2">1. Reserva Primeiro</p>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  Antes de investir em ações, garanta 6 meses de seus gastos em um CDB de liquidez diária ou Tesouro Selic.
                </p>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl">
                <p className="text-xs text-slate-200 font-bold mb-2">2. Diversifique</p>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  Nunca coloque todo seu dinheiro em um único lugar. Siga a regra 50/30/20 para proteger seu patrimônio.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
