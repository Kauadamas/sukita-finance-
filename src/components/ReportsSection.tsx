import React from 'react';
import { motion } from 'motion/react';
import { PieChart, BarChart, Download, Calendar, ArrowUp, ArrowDown } from 'lucide-react';
import { 
  PieChart as RePieChart, Pie, Cell, ResponsiveContainer, Tooltip as ReTooltip,
  BarChart as ReBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip
} from 'recharts';
import { Transaction } from '../types';
import { formatCurrency, cn } from '../lib/utils';

interface ReportsSectionProps {
  transactions: Transaction[];
  selectedMonth: number;
  selectedYear: number;
}

export function ReportsSection({ transactions, selectedMonth, selectedYear }: ReportsSectionProps) {
  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const monthsShort = [
    'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
    'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
  ];

  const outflows = transactions.filter(t => t.type === 'outflow');
  
  const categoryTotals = outflows.reduce((acc: any, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {});

  const categoryData = Object.keys(categoryTotals).map((name, index) => ({
    name,
    value: categoryTotals[name],
    color: ['#8B5CF6', '#F97316', '#06B6D4', '#EC4899', '#10B981', '#F59E0B'][index % 6]
  }));

  const monthlyEvolution = [
    { month: monthsShort[selectedMonth], gastos: outflows.reduce((acc, t) => acc + t.amount, 0) },
  ];

  return (
    <div className="space-y-8 pb-12">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Relatórios e Análises</h2>
          <p className="text-slate-400">Entenda para onde seu dinheiro está indo.</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center space-x-2 bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-sm font-medium hover:bg-white/10 transition-all">
            <Download size={18} />
            <span>Exportar</span>
          </button>
          <button className="flex items-center space-x-2 bg-brand-purple px-4 py-2 rounded-xl text-sm font-medium hover:bg-brand-purple/80 transition-all">
            <Calendar size={18} />
            <span>{months[selectedMonth]} {selectedYear}</span>
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Breakdown */}
        <div className="glass p-8 rounded-[2rem]">
          <h4 className="text-xl font-bold mb-8">Gastos por Categoria</h4>
          {categoryData.length > 0 ? (
            <>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={110}
                      paddingAngle={8}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ReTooltip 
                      contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px' }}
                    />
                  </RePieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-8">
                {categoryData.map(item => (
                  <div key={item.name} className="flex items-center justify-between p-3 bg-white/5 rounded-2xl">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full mr-3" style={{ backgroundColor: item.color }} />
                      <span className="text-sm text-slate-400">{item.name}</span>
                    </div>
                    <span className="text-sm font-bold">{formatCurrency(item.value)}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-80 flex items-center justify-center border border-dashed border-white/10 rounded-2xl">
              <p className="text-slate-500">Nenhum dado de gastos disponível</p>
            </div>
          )}
        </div>

        {/* Monthly Evolution */}
        <div className="glass p-8 rounded-[2rem]">
          <h4 className="text-xl font-bold mb-8">Evolução Mensal</h4>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ReBarChart data={monthlyEvolution}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px' }}
                />
                <Bar dataKey="gastos" fill="#8B5CF6" radius={[8, 8, 0, 0]} barSize={40} />
              </ReBarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-8 p-6 bg-brand-purple/10 rounded-3xl border border-brand-purple/20">
            <h5 className="font-bold text-brand-purple mb-2 flex items-center">
              <ArrowDown size={18} className="mr-2" />
              Comparativo Mensal
            </h5>
            <p className="text-sm text-slate-300">
              {outflows.length > 0 ? "Continue registrando seus gastos para uma análise comparativa detalhada." : "Comece a registrar seus gastos para ver a evolução mensal."}
            </p>
          </div>
        </div>
      </div>

      {/* Deep Analysis */}
      <div className="glass-purple p-8 rounded-[2rem]">
        <h4 className="text-xl font-bold mb-6">Análise Profunda (IA)</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
            <p className="text-xs font-bold text-brand-purple uppercase tracking-widest mb-2">Vazamento Financeiro</p>
            <p className="text-sm">"Aguardando dados para identificar possíveis economias em suas assinaturas e gastos fixos."</p>
          </div>
          <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
            <p className="text-xs font-bold text-brand-orange uppercase tracking-widest mb-2">Oportunidade</p>
            <p className="text-sm">"Registre sua renda extra para que eu possa sugerir oportunidades de investimento e crescimento."</p>
          </div>
          <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
            <p className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-2">Previsão</p>
            <p className="text-sm">"Em breve poderei prever quando você atingirá sua Reserva de Emergência com base no seu ritmo atual."</p>
          </div>
        </div>
      </div>

      {/* Transaction Details Table */}
      <div className="glass p-8 rounded-[2rem]">
        <div className="flex items-center justify-between mb-8">
          <h4 className="text-xl font-bold">Detalhamento Mensal</h4>
          <span className="px-3 py-1 bg-white/5 rounded-full text-xs font-medium text-slate-400">
            {transactions.length} lançamentos em {months[selectedMonth]}
          </span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5">
                <th className="pb-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Data</th>
                <th className="pb-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Descrição</th>
                <th className="pb-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Categoria</th>
                <th className="pb-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Valor</th>
                <th className="pb-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {transactions.length > 0 ? (
                transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((t) => (
                  <tr key={t.id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 text-sm text-slate-400 whitespace-nowrap">
                      {new Date(t.date).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="py-4">
                      <span className="text-sm font-medium text-white">{t.description}</span>
                    </td>
                    <td className="py-4">
                      <span className="px-2 py-0.5 bg-white/5 rounded-lg text-[10px] text-slate-400">
                        {t.category}
                      </span>
                    </td>
                    <td className={cn(
                      "py-4 text-sm font-bold text-right",
                      t.type === 'inflow' ? "text-emerald-400" : "text-slate-200"
                    )}>
                      {t.type === 'inflow' ? '+' : '-'} {formatCurrency(t.amount)}
                    </td>
                    <td className="py-4 text-center">
                      <span className={cn(
                        "text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full",
                        t.status === 'paid' ? "bg-emerald-500/10 text-emerald-400" :
                        t.status === 'overdue' ? "bg-red-500/10 text-red-400" :
                        "bg-orange-500/10 text-orange-400"
                      )}>
                        {t.status === 'paid' ? 'Pago' : t.status === 'overdue' ? 'Atrasado' : 'Pendente'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500 italic">
                    Nenhum lançamento encontrado para este período.
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
