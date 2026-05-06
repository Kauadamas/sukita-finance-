import React from 'react';
import { 
  LayoutDashboard, 
  CreditCard, 
  TrendingUp, 
  Receipt, 
  Wrench, 
  MessageSquare, 
  LogOut,
  PieChart,
  BookOpen,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { cn } from '../lib/utils';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  overdueCount: number;
}

export function Sidebar({ activeTab, setActiveTab, overdueCount }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Painel' },
    { id: 'reports', icon: PieChart, label: 'Relatórios' },
    { id: 'paid', icon: CheckCircle2, label: 'Contas Pagas' },
    { id: 'cards', icon: CreditCard, label: 'Cartões' },
    { id: 'investments', icon: TrendingUp, label: 'Investimentos' },
    { id: 'reserve', icon: ShieldCheck, label: 'Reserva' },
    { id: 'bills', icon: Receipt, label: 'Boletos', badge: overdueCount > 0 ? overdueCount : undefined },
    { id: 'extra', icon: Wrench, label: 'Renda Extra' },
    { id: 'library', icon: BookOpen, label: 'Biblioteca' },
    { id: 'ai', icon: MessageSquare, label: 'Agente IA' },
  ];

  return (
    <div className="w-64 h-screen bg-[#0F172A] border-r border-white/10 flex flex-col fixed left-0 top-0 z-50">
      <div className="p-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-brand-purple to-brand-orange bg-clip-text text-transparent">
          SukitaFinançe
        </h1>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group",
              activeTab === item.id 
                ? "bg-brand-purple/20 text-brand-purple border border-brand-purple/30" 
                : "text-slate-400 hover:bg-white/5 hover:text-slate-100"
            )}
          >
            <div className="flex items-center space-x-3">
              <item.icon size={20} className={cn(
                "transition-transform",
                item.badge ? "text-red-500 animate-pulse" : "group-hover:scale-110"
              )} />
              <span className="font-medium">{item.label}</span>
            </div>
            {item.badge && (
              <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-lg shadow-red-500/40">
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10">
        <button className="w-full flex items-center space-x-3 px-4 py-3 text-slate-400 hover:text-red-400 transition-colors">
          <LogOut size={20} />
          <span className="font-medium">Sair</span>
        </button>
      </div>
    </div>
  );
}
