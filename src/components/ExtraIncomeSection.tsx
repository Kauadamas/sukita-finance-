import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Wrench, 
  Plus, 
  DollarSign, 
  Target, 
  Smartphone, 
  Battery, 
  Zap, 
  LayoutDashboard, 
  ClipboardList, 
  Users, 
  Megaphone, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Search, 
  Filter, 
  MoreVertical, 
  ArrowUpRight, 
  ArrowDownRight,
  ShieldCheck,
  MessageCircle,
  History,
  TrendingUp,
  Calculator,
  Tag,
  Trash2
} from 'lucide-react';
import { Transaction, ServiceOrder, Client, OSStatus } from '../types';
import { MOCK_SERVICE_ORDERS, MOCK_CLIENTS } from '../constants';
import { cn, formatCurrency, formatDateBR } from '../lib/utils';

interface ExtraIncomeSectionProps {
  onOpenModal?: (cardId?: string, category?: string, description?: string) => void;
  transactions: Transaction[];
  selectedMonth: number;
  serviceOrders: ServiceOrder[];
  clients: Client[];
  onDeleteOrder?: (id: string) => void;
}

type SubTab = 'dashboard' | 'orders' | 'clients' | 'pricing' | 'marketing';

export function ExtraIncomeSection({ 
  onOpenModal, 
  transactions, 
  selectedMonth, 
  serviceOrders, 
  clients,
  onDeleteOrder 
}: ExtraIncomeSectionProps) {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('dashboard');
  const [searchTerm, setSearchTerm] = useState('');

  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const extraIncome = transactions.filter(t => {
    const d = new Date(t.date);
    return t.type === 'inflow' && 
           (t.category === 'SukitaFinançe (Serviço)' || t.category === 'Freelance') &&
           d.getMonth() === selectedMonth;
  });
  
  const totalSukitaFinance = extraIncome
    .filter(i => i.category === 'SukitaFinançe (Serviço)')
    .reduce((acc, i) => acc + i.amount, 0);

  const totalLabor = extraIncome
    .filter(i => i.category === 'SukitaFinançe (Serviço)')
    .reduce((acc, i) => acc + (i.laborAmount || 0), 0);

  // Dashboard Stats
  const inMaintenance = serviceOrders.filter(o => o.status === 'repairing' || o.status === 'analyzing').length;
  const finishedToday = serviceOrders.filter(o => o.status === 'finished').length;
  const ticketMedio = totalSukitaFinance / (extraIncome.length || 1);

  const statusConfig: Record<OSStatus, { label: string, color: string, icon: any }> = {
    analyzing: { label: 'Em Análise', color: 'text-blue-400 bg-blue-400/10', icon: Search },
    repairing: { label: 'Em Reparo', color: 'text-yellow-400 bg-yellow-400/10', icon: Wrench },
    finished: { label: 'Concluído', color: 'text-emerald-400 bg-emerald-400/10', icon: CheckCircle2 },
    waiting_parts: { label: 'Aguardando Peça', color: 'text-red-400 bg-red-500/10', icon: Clock },
  };

  const pricingTable = [
    { category: 'Troca de Tela', items: [
      { name: 'Android Básico', price: 'R$ 120 - 250' },
      { name: 'Samsung Intermediário', price: 'R$ 200 - 450' },
      { name: 'iPhone 7/8', price: 'R$ 180 - 300' },
      { name: 'iPhone X / XR', price: 'R$ 300 - 600' },
      { name: 'iPhone 11+', price: 'R$ 500 - 1.200' },
    ]},
    { category: 'Bateria', items: [
      { name: 'Android', price: 'R$ 80 - 180' },
      { name: 'iPhone', price: 'R$ 120 - 300' },
    ]},
    { category: 'Conector de Carga', items: [
      { name: 'Android', price: 'R$ 70 - 150' },
      { name: 'iPhone', price: 'R$ 120 - 250' },
    ]},
  ];

  return (
    <div className="space-y-8 pb-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-white flex items-center">
            SukitaFinançe PRO <span className="ml-3 px-2 py-0.5 bg-brand-orange text-[10px] rounded text-black font-black uppercase tracking-widest">Business</span>
          </h2>
          <p className="text-slate-400 text-sm">Painel Profissional de Assistência Técnica</p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => onOpenModal?.(undefined, 'SukitaFinançe (Serviço)')}
            className="flex items-center space-x-2 bg-gradient-to-r from-brand-purple to-brand-orange text-white px-6 py-3 rounded-2xl font-black hover:scale-105 transition-all text-sm shadow-lg shadow-brand-purple/20"
          >
            <Plus size={18} />
            <span>Nova OS</span>
          </button>
        </div>
      </header>

      {/* Sub-navigation */}
      <nav className="flex items-center space-x-1 bg-white/5 p-1.5 rounded-2xl border border-white/10 overflow-x-auto no-scrollbar">
        {[
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'orders', label: 'Ordens de Serviço', icon: ClipboardList },
          { id: 'clients', label: 'Clientes', icon: Users },
          { id: 'pricing', label: 'Precificação', icon: Tag },
          { id: 'marketing', label: 'Marketing', icon: Megaphone },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as SubTab)}
            className={cn(
              "flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap",
              activeSubTab === tab.id 
                ? "bg-brand-purple text-white shadow-lg shadow-brand-purple/20" 
                : "text-slate-400 hover:text-white hover:bg-white/5"
            )}
          >
            <tab.icon size={18} />
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeSubTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeSubTab === 'dashboard' && (
            <div className="space-y-8">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { label: 'Em Manutenção', value: inMaintenance, icon: Smartphone, color: 'text-brand-purple', bg: 'bg-brand-purple/10' },
                  { label: 'Lucro (Mão de Obra)', value: formatCurrency(totalLabor), icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
                  { label: 'Ticket Médio', value: formatCurrency(ticketMedio), icon: TrendingUp, color: 'text-brand-orange', bg: 'bg-brand-orange/10' },
                ].map((stat, i) => (
                  <div key={i} className="glass p-6 rounded-[2rem] border border-white/5">
                    <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-4", stat.bg, stat.color)}>
                      <stat.icon size={24} />
                    </div>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">{stat.label}</p>
                    <h3 className="text-3xl font-black mt-1">{stat.value}</h3>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Revenue Chart Placeholder */}
                <div className="lg:col-span-2 glass p-8 rounded-[2.5rem] border border-white/5">
                  <div className="flex items-center justify-between mb-8">
                    <h4 className="text-xl font-bold">Faturamento Mensal</h4>
                    <div className="flex items-center space-x-2 text-xs font-bold text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full">
                      <ArrowUpRight size={14} />
                      <span>+12% vs mês anterior</span>
                    </div>
                  </div>
                  <div className="h-64 flex items-end justify-between gap-2 px-4">
                    {[40, 65, 45, 90, 55, 75, 85, 60, 95, 70, 80, 100].map((h, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                        <div 
                          className={cn(
                            "w-full rounded-t-lg transition-all group-hover:opacity-100",
                            i === 11 ? "bg-brand-orange" : "bg-brand-purple/40"
                          )} 
                          style={{ height: `${h}%` }} 
                        />
                        <span className="text-[8px] font-bold text-slate-500 uppercase">{months[i].slice(0, 3)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Services */}
                <div className="glass p-8 rounded-[2.5rem] border border-white/5">
                  <h4 className="text-xl font-bold mb-6 flex items-center">
                    <Zap size={20} className="mr-2 text-brand-orange" />
                    Serviços Rápidos
                  </h4>
                  <div className="grid grid-cols-1 gap-3">
                    {[
                      { name: 'Troca de Tela', icon: Smartphone },
                      { name: 'Troca de Bateria', icon: Battery },
                      { name: 'Conector de Carga', icon: Zap },
                      { name: 'Software / Formatação', icon: History },
                    ].map((s) => (
                      <button 
                        key={s.name}
                        onClick={() => onOpenModal?.(undefined, 'SukitaFinançe (Serviço)', s.name)}
                        className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-brand-orange/30 hover:bg-brand-orange/5 transition-all group"
                      >
                        <div className="flex items-center space-x-3">
                          <s.icon size={18} className="text-brand-orange" />
                          <span className="text-sm font-bold text-slate-300 group-hover:text-white">{s.name}</span>
                        </div>
                        <Plus size={16} className="text-slate-600 group-hover:text-brand-orange" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Business Strategy */}
              <div className="glass-purple p-8 rounded-[2.5rem] flex flex-col justify-between">
                <div>
                  <h4 className="text-xl font-bold mb-4 flex items-center">
                    <Calculator size={24} className="mr-2" />
                    Fórmula de Lucro
                  </h4>
                  <p className="text-sm text-slate-300 leading-relaxed mb-6">
                    Preço = (Custo da peça × 2.5) + Mão de obra
                  </p>
                  <div className="space-y-4">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                      <p className="text-xs font-bold text-brand-orange uppercase mb-1">Dica de Upsell</p>
                      <p className="text-xs text-slate-400">Sempre ofereça película e limpeza interna em trocas de tela.</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                      <p className="text-xs font-bold text-brand-orange uppercase mb-1">Garantia</p>
                      <p className="text-xs text-slate-400">Oferecer 90 dias aumenta a conversão em 35%.</p>
                    </div>
                  </div>
                </div>
                <button className="w-full mt-8 py-4 bg-white text-black rounded-2xl font-black text-sm hover:bg-slate-200 transition-all">
                  Ver Relatório Completo
                </button>
              </div>
            </div>
          )}

          {activeSubTab === 'orders' && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input 
                    type="text" 
                    placeholder="Buscar por cliente, aparelho ou OS..." 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 outline-none focus:border-brand-purple transition-colors"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-3 bg-white/5 rounded-xl border border-white/10 text-slate-400 hover:text-white transition-all">
                    <Filter size={20} />
                  </button>
                  <button className="p-3 bg-white/5 rounded-xl border border-white/10 text-slate-400 hover:text-white transition-all">
                    <History size={20} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {serviceOrders.map((order) => {
                  const status = statusConfig[order.status];
                  return (
                    <div key={order.id} className="glass p-6 rounded-[2rem] border border-white/5 hover:border-white/10 transition-all group">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        <div className="flex items-start space-x-4">
                          <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shrink-0", status.color)}>
                            <status.icon size={28} />
                          </div>
                          <div>
                            <div className="flex items-center space-x-3 mb-1">
                              <span className="text-xs font-black text-brand-orange uppercase tracking-widest">{order.id}</span>
                              <h4 className="font-bold text-lg">{order.clientName}</h4>
                            </div>
                            <p className="text-sm text-slate-300 font-medium mb-1">{order.device} • <span className="text-slate-500">{order.defect}</span></p>
                            <div className="flex items-center space-x-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                              <span className="flex items-center"><Clock size={12} className="mr-1" /> Entrada: {formatDateBR(order.entryDate)}</span>
                              <span className="flex items-center"><Target size={12} className="mr-1" /> Prazo: {formatDateBR(order.deadline!)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between lg:justify-end gap-8">
                          <div className="text-right">
                            <p className="text-xs font-bold text-slate-500 uppercase mb-1">Valor do Serviço</p>
                            <p className="text-xl font-black text-emerald-400">{formatCurrency(order.price || 0)}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button className="p-3 bg-white/5 rounded-xl text-brand-purple hover:bg-brand-purple/10 transition-all">
                              <MessageCircle size={20} />
                            </button>
                            <button 
                              onClick={() => onDeleteOrder?.(order.id)}
                              className="p-3 bg-white/5 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                              title="Excluir OS"
                            >
                              <Trash2 size={20} />
                            </button>
                            <button className="p-3 bg-white/5 rounded-xl text-slate-400 hover:bg-white/10 transition-all">
                              <MoreVertical size={20} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeSubTab === 'pricing' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pricingTable.map((cat, i) => (
                <div key={i} className="glass p-8 rounded-[2.5rem] border border-white/5">
                  <h4 className="text-xl font-black text-brand-orange mb-6 flex items-center">
                    <Tag size={20} className="mr-2" />
                    {cat.category}
                  </h4>
                  <div className="space-y-4">
                    {cat.items.map((item, j) => (
                      <div key={j} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-all">
                        <span className="text-sm font-bold text-slate-300">{item.name}</span>
                        <span className="text-sm font-black text-white">{item.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              
              <div className="glass-purple p-8 rounded-[2.5rem] flex flex-col justify-center items-center text-center">
                <div className="w-16 h-16 rounded-3xl bg-white/10 flex items-center justify-center mb-6">
                  <ShieldCheck size={32} />
                </div>
                <h4 className="text-xl font-bold mb-2">Garantia SukitaFinançe</h4>
                <p className="text-sm text-slate-300 mb-6">Sempre ofereça 90 dias de garantia em peças e 30 dias em mão de obra.</p>
                <div className="w-full p-4 bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest">
                  Padrão de Qualidade
                </div>
              </div>
            </div>
          )}

          {activeSubTab === 'clients' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {clients.map((client) => (
                <div key={client.id} className="glass p-8 rounded-[2.5rem] border border-white/5 hover:border-white/10 transition-all">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-14 h-14 rounded-2xl bg-brand-purple/20 flex items-center justify-center text-brand-purple">
                        <Users size={28} />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold">{client.name}</h4>
                        <p className="text-sm text-slate-500">{client.whatsapp}</p>
                      </div>
                    </div>
                    <button className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl hover:bg-emerald-500/20 transition-all">
                      <MessageCircle size={20} />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-white/5 rounded-2xl">
                      <p className="text-[8px] font-black text-slate-500 uppercase mb-1">Total Gasto</p>
                      <p className="text-sm font-black text-emerald-400">{formatCurrency(client.totalSpent)}</p>
                    </div>
                    <div className="text-center p-3 bg-white/5 rounded-2xl">
                      <p className="text-[8px] font-black text-slate-500 uppercase mb-1">Frequência</p>
                      <p className="text-sm font-black text-white">{client.frequency}x</p>
                    </div>
                    <div className="text-center p-3 bg-white/5 rounded-2xl">
                      <p className="text-[8px] font-black text-slate-500 uppercase mb-1">Último</p>
                      <p className="text-sm font-black text-white">{formatDateBR(client.lastService).slice(0, 5)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeSubTab === 'marketing' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="glass p-8 rounded-[3rem] border border-white/5">
                <h4 className="text-2xl font-black mb-6 flex items-center">
                  <Megaphone size={28} className="mr-3 text-brand-orange" />
                  Campanhas Ativas
                </h4>
                <div className="space-y-4">
                  {[
                    { title: 'Reengajamento Inativos', desc: 'Clientes que não aparecem há 6 meses.', icon: History, color: 'text-brand-purple' },
                    { title: 'Promoção Bateria', desc: 'Desconto de 15% para modelos iPhone 11.', icon: Battery, color: 'text-emerald-400' },
                    { title: 'Checkup Grátis', desc: 'Limpeza interna grátis em qualquer serviço.', icon: ShieldCheck, color: 'text-brand-orange' },
                  ].map((camp, i) => (
                    <div key={i} className="flex items-center justify-between p-6 bg-white/5 rounded-[2rem] border border-white/5 hover:border-white/10 transition-all group cursor-pointer">
                      <div className="flex items-center space-x-4">
                        <div className={cn("w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center", camp.color)}>
                          <camp.icon size={24} />
                        </div>
                        <div>
                          <h5 className="font-bold">{camp.title}</h5>
                          <p className="text-xs text-slate-500">{camp.desc}</p>
                        </div>
                      </div>
                      <ChevronRight size={20} className="text-slate-600 group-hover:translate-x-1 transition-transform" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div className="glass-orange p-8 rounded-[3rem]">
                  <h4 className="text-xl font-bold mb-4">Notificações Automáticas</h4>
                  <p className="text-sm text-slate-200 mb-6">O SukitaFinançe envia mensagens automáticas via WhatsApp para seus clientes.</p>
                  <div className="space-y-3">
                    <div className="p-4 bg-white/10 rounded-2xl text-xs font-medium italic">
                      "Olá [Nome]! Seu [Aparelho] já está pronto para retirada. 📱"
                    </div>
                    <div className="p-4 bg-white/10 rounded-2xl text-xs font-medium italic">
                      "Sua garantia de 90 dias expira em 7 dias. Tudo certo com seu aparelho? 🛡️"
                    </div>
                  </div>
                </div>
                <div className="glass p-8 rounded-[3rem] border border-brand-purple/20">
                  <h4 className="text-xl font-bold mb-2">Dica de Marketing</h4>
                  <p className="text-sm text-slate-400">Clientes que recebem uma mensagem de pós-venda têm 40% mais chance de retornar.</p>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function ChevronRight({ size, className }: { size: number, className?: string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="m9 18 6-6-6-6"/>
    </svg>
  );
}
