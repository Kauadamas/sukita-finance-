import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { CardsSection } from './components/CardsSection';
import { InvestmentsSection } from './components/InvestmentsSection';
import { ExtraIncomeSection } from './components/ExtraIncomeSection';
import { BillsSection } from './components/BillsSection';
import { ReportsSection } from './components/ReportsSection';
import { PaidEntriesSection } from './components/PaidEntriesSection';
import { LibrarySection } from './components/LibrarySection';
import { AIAgent } from './components/AIAgent';
import { NewEntryModal } from './components/NewEntryModal';
import { NewCardModal } from './components/NewCardModal';
import { NewInvestmentModal } from './components/NewInvestmentModal';
import { EmergencyReserveSection } from './components/EmergencyReserveSection';
import { PeriodSelector } from './components/PeriodSelector';
import { Bell, Search, User, Plus, AlertCircle, Maximize2, Minimize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Transaction, Bill, CreditCard, Investment, ServiceOrder, Client } from './types';
import { MOCK_CARDS, MOCK_INVESTMENTS, MOCK_TRANSACTIONS, MOCK_BILLS, MOCK_SERVICE_ORDERS, MOCK_CLIENTS } from './constants';
import { cn } from './lib/utils';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [isInvestmentModalOpen, setIsInvestmentModalOpen] = useState(false);
  const [preselectedCardId, setPreselectedCardId] = useState<string | undefined>(undefined);
  const [preselectedCategory, setPreselectedCategory] = useState<string | undefined>(undefined);
  const [preselectedDescription, setPreselectedDescription] = useState<string | undefined>(undefined);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Synchronize fullscreen state with browser events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  // Local Storage Persistence
  const getInitialData = <T,>(key: string, defaultValue: T): T => {
    const saved = localStorage.getItem(key);
    if (!saved) return defaultValue;
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error(`Error parsing localStorage key "${key}":`, e);
      return defaultValue;
    }
  };

  const [transactions, setTransactions] = useState<Transaction[]>(() => getInitialData('transactions', []));
  const [bills, setBills] = useState<Bill[]>(() => getInitialData('bills', []));
  const [cards, setCards] = useState<CreditCard[]>(() => getInitialData('cards', []));
  const [investments, setInvestments] = useState<Investment[]>(() => getInitialData('investments', []));
  const [serviceOrders, setServiceOrders] = useState<ServiceOrder[]>(() => getInitialData('serviceOrders', []));
  const [clients, setClients] = useState<Client[]>(() => getInitialData('clients', []));
  const [emergencyReserve, setEmergencyReserve] = useState(() => getInitialData('emergencyReserve', 0));

  // Auto-overdue logic: Check all pending bills and mark them as overdue if they are past due
  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let hasChanges = false;
    const updatedBills = bills.map(bill => {
      const dueDate = new Date(bill.dueDate);
      if (bill.status === 'pending' && dueDate < today) {
        hasChanges = true;
        return { ...bill, status: 'overdue' as const };
      }
      return bill;
    });

    if (hasChanges) {
      setBills(updatedBills);
      // Also update associated transactions
      setTransactions(prev => prev.map(t => {
        const correspondingBill = updatedBills.find(b => b.id === t.id);
        if (correspondingBill && correspondingBill.status === 'overdue' && t.status === 'pending') {
          return { ...t, status: 'overdue' as const };
        }
        return t;
      }));
    }
  }, [bills.length]); // Run when bills are added or on load

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('bills', JSON.stringify(bills));
  }, [bills]);

  useEffect(() => {
    localStorage.setItem('cards', JSON.stringify(cards));
  }, [cards]);

  useEffect(() => {
    localStorage.setItem('investments', JSON.stringify(investments));
  }, [investments]);

  useEffect(() => {
    localStorage.setItem('serviceOrders', JSON.stringify(serviceOrders));
  }, [serviceOrders]);

  useEffect(() => {
    localStorage.setItem('clients', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem('emergencyReserve', JSON.stringify(emergencyReserve));
  }, [emergencyReserve]);

  const handleAddEntry = (entry: any) => {
    if (entry.type === 'inflow' || entry.type === 'outflow') {
      const installments = entry.installments || 1;
      const baseAmount = entry.amount / installments;
      
      const newTransactions: Transaction[] = [];
      
      for (let i = 0; i < installments; i++) {
        const date = new Date(entry.purchaseDate);
        date.setMonth(date.getMonth() + i);
        
        const dueDate = new Date(entry.date);
        dueDate.setMonth(dueDate.getMonth() + i);

        newTransactions.push({
          id: i === 0 ? entry.id : `${entry.id}-${i}`,
          description: installments > 1 ? `${entry.description} (${i + 1}/${installments})` : entry.description,
          amount: baseAmount,
          date: date.toISOString().split('T')[0],
          dueDate: dueDate.toISOString().split('T')[0],
          category: entry.category,
          type: entry.type,
          status: i === 0 ? entry.status : 'pending',
          cardId: entry.cardId,
          installments: installments,
          currentInstallment: i + 1
        });
      }

      setTransactions(prev => [...newTransactions, ...prev]);
      
      // If it's an expense, also add the first installment to bills if it's pending/overdue OR explicitly marked as isBill
      if (entry.type === 'outflow' && (entry.status === 'pending' || entry.status === 'overdue' || entry.isBill)) {
        const firstT = newTransactions[0];
        const newBill: Bill = {
          id: firstT.id,
          description: firstT.description,
          amount: firstT.amount,
          dueDate: firstT.dueDate!,
          status: firstT.status!
        };
        setBills(prev => [newBill, ...prev]);
      }
    }
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
    setBills(prev => prev.filter(b => b.id !== id));
  };

  const handleUpdateTransactionStatus = (id: string, status: 'paid' | 'pending' | 'overdue') => {
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, status } : t));
    setBills(prev => prev.map(b => b.id === id ? { ...b, status } : b));
  };

  const handleUpdateEntry = (updatedEntry: any) => {
    setTransactions(prev => prev.map(t => t.id === updatedEntry.id ? updatedEntry : t));
    setBills(prev => prev.map(b => b.id === updatedEntry.id ? {
      ...b,
      description: updatedEntry.description,
      amount: updatedEntry.amount,
      dueDate: updatedEntry.dueDate || updatedEntry.date,
      status: updatedEntry.status
    } : b));
  };

  const handleAddCard = (card: CreditCard) => {
    setCards(prev => [...prev, card]);
  };

  const handleDeleteCard = (id: string) => {
    setCards(prev => prev.filter(c => c.id !== id));
    setTransactions(prev => prev.filter(t => t.cardId !== id));
  };

  const handlePayBill = (cardId: string) => {
    setTransactions(prev => prev.map(t => {
      if (t.cardId === cardId) {
        const d = new Date(t.date);
        if (d.getMonth() === selectedMonth && d.getFullYear() === selectedYear) {
          return { ...t, status: 'paid' as const };
        }
      }
      return t;
    }));
    
    // Also update bills
    setBills(prev => prev.map(b => {
      const t = transactions.find(tr => tr.id === b.id);
      if (t && t.cardId === cardId) {
        const d = new Date(b.dueDate);
        if (d.getMonth() === selectedMonth && d.getFullYear() === selectedYear) {
          return { ...b, status: 'paid' as const };
        }
      }
      return b;
    }));
  };

  const handlePayAllOverdue = () => {
    setTransactions(prev => prev.map(t => t.status === 'overdue' ? { ...t, status: 'paid' as const } : t));
    setBills(prev => prev.map(b => b.status === 'overdue' ? { ...b, status: 'paid' as const } : b));
  };

  const handleUpdateCardLimit = (id: string, limit: number) => {
    setCards(prev => prev.map(c => c.id === id ? { ...c, limit } : c));
  };

  const handleAddInvestment = (investment: Investment) => {
    setInvestments(prev => [investment, ...prev]);
  };

  const handleDeleteInvestment = (id: string) => {
    setInvestments(prev => prev.filter(i => i.id !== id));
  };

  const handleDeleteOrder = (id: string) => {
    setServiceOrders(prev => prev.filter(o => o.id !== id));
  };

  const handleDeleteAllTransactions = () => {
    if (window.confirm('Tem certeza que deseja excluir TODOS os lançamentos? Esta ação não pode ser desfeita.')) {
      setTransactions([]);
      setBills([]);
    }
  };

  const handleExportData = () => {
    const data = {
      transactions,
      bills,
      cards,
      investments,
      exportDate: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `backup_financeiro_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const filteredTransactions = transactions.filter(t => {
    const d = new Date(t.date);
    const isCurrentMonth = d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
    // Include overdue items from any month to ensure alerts are visible
    return isCurrentMonth || t.status === 'overdue';
  });

  const filteredBills = bills.filter(b => {
    const d = new Date(b.dueDate);
    const isCurrentMonth = d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
    // Include overdue items from any month to ensure alerts are visible
    return isCurrentMonth || b.status === 'overdue';
  });

  const globalOverdueCount = bills.filter(b => b.status === 'overdue').length;
  const [showCriticalModal, setShowCriticalModal] = useState(false);

  // Show critical modal on load if there are overdue bills
  React.useEffect(() => {
    if (globalOverdueCount > 0) {
      const timer = setTimeout(() => {
        setShowCriticalModal(true);
        // Vibration for mobile if supported
        if (navigator.vibrate) {
          navigator.vibrate([200, 100, 200]);
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [globalOverdueCount > 0]);

  const handleOpenModal = (cardId?: string, category?: string, description?: string) => {
    setEditingTransaction(null);
    setPreselectedCardId(cardId);
    setPreselectedCategory(category);
    setPreselectedDescription(description);
    setIsModalOpen(true);
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  const renderContent = () => {
    const props = { 
      onOpenModal: handleOpenModal,
      onEditTransaction: handleEditTransaction,
      onOpenCardModal: () => setIsCardModalOpen(true),
      transactions: filteredTransactions,
      allTransactions: transactions,
      bills: filteredBills,
      cards,
      investments,
      onDeleteTransaction: handleDeleteTransaction,
      onDeleteAllTransactions: handleDeleteAllTransactions,
      onExportData: handleExportData,
      onUpdateTransactionStatus: handleUpdateTransactionStatus,
      onDeleteCard: handleDeleteCard,
      onPayBill: handlePayBill,
      onUpdateCardLimit: handleUpdateCardLimit,
      onAddEntry: handleAddEntry,
      onPeriodChange: (m: number, y: number) => {
        setSelectedMonth(m);
        setSelectedYear(y);
      },
      selectedMonth,
      selectedYear
    };
    switch (activeTab) {
      case 'dashboard': return <Dashboard {...props} setActiveTab={setActiveTab} />;
      case 'cards': return <CardsSection {...props} />;
      case 'investments': return (
        <InvestmentsSection 
          onOpenModal={() => setIsInvestmentModalOpen(true)} 
          investments={investments}
          onDeleteInvestment={handleDeleteInvestment}
        />
      );
      case 'reserve': return (
        <EmergencyReserveSection 
          transactions={transactions}
          currentReserve={emergencyReserve}
          onUpdateReserve={setEmergencyReserve}
        />
      );
      case 'extra': return (
        <ExtraIncomeSection 
          {...props} 
          onOpenModal={handleOpenModal}
          serviceOrders={serviceOrders}
          clients={clients}
          onDeleteOrder={handleDeleteOrder}
        />
      );
      case 'bills': return (
        <BillsSection 
          {...props} 
          onDeleteTransaction={handleDeleteTransaction}
          onPayAllOverdue={handlePayAllOverdue}
          onOpenModal={() => handleOpenModal(undefined, 'Boleto')}
        />
      );
      case 'paid': return (
        <PaidEntriesSection 
          transactions={transactions}
          onDeleteTransaction={handleDeleteTransaction}
          onEditTransaction={handleEditTransaction}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          onMonthChange={setSelectedMonth}
          onYearChange={setSelectedYear}
        />
      );
      case 'reports': return <ReportsSection transactions={filteredTransactions} selectedMonth={selectedMonth} selectedYear={selectedYear} />;
      case 'library': return <LibrarySection />;
      case 'ai': return <AIAgent />;
      default: return <Dashboard {...props} setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className={cn("min-h-screen bg-[#0F172A] text-slate-100 flex flex-col transition-all duration-500", globalOverdueCount > 0 && "pt-[40px]")}>
      <AnimatePresence>
        {globalOverdueCount > 0 && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 40, opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="fixed top-0 left-0 w-full bg-gradient-to-r from-[#ff3b3b] via-[#ff7a00] to-[#ff3b3b] bg-[length:200%_auto] animate-[gradient_3s_linear_infinite] text-white py-2 text-center font-black text-sm uppercase tracking-widest z-[100] flex items-center justify-center space-x-2 shadow-xl"
          >
            <span className="animate-blink">🚨</span>
            <span>Você possui {globalOverdueCount} {globalOverdueCount === 1 ? 'conta atrasada' : 'contas atrasadas'}!</span>
            <button 
              onClick={() => setActiveTab('bills')}
              className="ml-4 px-3 py-0.5 bg-black/20 hover:bg-black/40 rounded-full text-[10px] transition-colors border border-white/20"
            >
              Regularizar Agora
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-1">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} overdueCount={globalOverdueCount} />
        
        <main className="flex-1 ml-64 p-8">
        {/* Top Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center space-x-6">
            <div className="relative w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
              <input 
                type="text" 
                placeholder="Buscar transações, cartões..." 
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 outline-none focus:border-brand-purple transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <button 
              onClick={toggleFullscreen}
              className="p-2 text-slate-400 hover:text-white transition-colors group"
              title={isFullscreen ? "Sair da Tela Cheia" : "Tela Cheia"}
            >
              {isFullscreen ? <Minimize2 size={24} /> : <Maximize2 size={24} />}
            </button>
            <button className="relative p-2 text-slate-400 hover:text-white transition-colors group">
              <Bell size={24} className={cn(globalOverdueCount > 0 && "text-red-500 animate-ring")} />
              {globalOverdueCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 rounded-full border-2 border-[#0F172A] text-[10px] font-black flex items-center justify-center animate-bounce shadow-lg shadow-red-600/50">
                  {globalOverdueCount}
                </span>
              )}
              {globalOverdueCount === 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-brand-orange rounded-full border-2 border-[#0F172A]" />}
            </button>
            <div className="flex items-center space-x-3 pl-6 border-l border-white/10">
              <div className="text-right">
                <p className="text-sm font-bold">jcsdamas@gmail.com</p>
                <p className="text-xs text-brand-purple font-medium">Plano Premium</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-purple to-brand-orange p-[2px]">
                <div className="w-full h-full rounded-full bg-[#0F172A] flex items-center justify-center">
                  <User size={20} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Period Selector */}
        <div className="mb-8">
          <PeriodSelector 
            selectedMonth={selectedMonth} 
            selectedYear={selectedYear} 
            onChange={(m, y) => {
              setSelectedMonth(m);
              setSelectedYear(y);
            }} 
          />
        </div>

        {/* Main Content Area */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>

    {/* Critical Alert Modal */}
    <AnimatePresence>
      {showCriticalModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.7, opacity: 0 }}
            className="bg-[#1a1a2e] border-2 border-[#ff3b3b] p-8 rounded-3xl max-w-sm w-full text-center shadow-[0_0_50px_rgba(255,59,59,0.3)]"
          >
            <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center text-white mx-auto mb-6 animate-pulse shadow-lg shadow-red-500/50">
              <AlertCircle size={48} />
            </div>
            <h2 className="text-3xl font-black text-red-500 uppercase tracking-tighter mb-2 italic">⚠️ Atenção!</h2>
            <p className="text-slate-300 font-medium mb-8">
              Você possui <span className="text-white font-bold">{globalOverdueCount}</span> {globalOverdueCount === 1 ? 'conta atrasada' : 'contas atrasadas'}. Regularize o quanto antes para evitar bloqueios ou juros abusivos.
            </p>
            <div className="flex flex-col space-y-3">
              <button 
                onClick={() => {
                  setShowCriticalModal(false);
                  setActiveTab('bills');
                }}
                className="w-full py-4 bg-gradient-to-r from-[#ff3b3b] to-[#ff7a00] text-white font-black rounded-2xl uppercase tracking-widest hover:scale-105 transition-transform"
              >
                Verificar Contas
              </button>
              <button 
                onClick={() => setShowCriticalModal(false)}
                className="w-full py-2 text-slate-500 font-bold hover:text-slate-300 transition-colors uppercase text-xs"
              >
                Entendido
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>

    <NewEntryModal 
      isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setEditingTransaction(null);
          setPreselectedCardId(undefined);
          setPreselectedCategory(undefined);
          setPreselectedDescription(undefined);
        }} 
        onAddEntry={handleAddEntry}
        onUpdateEntry={handleUpdateEntry}
        editData={editingTransaction}
        cards={cards}
        allTransactions={transactions}
        initialCardId={preselectedCardId}
        initialCategory={preselectedCategory}
        initialDescription={preselectedDescription}
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
      />

      <NewCardModal
        isOpen={isCardModalOpen}
        onClose={() => setIsCardModalOpen(false)}
        onAddCard={handleAddCard}
      />

      <NewInvestmentModal
        isOpen={isInvestmentModalOpen}
        onClose={() => setIsInvestmentModalOpen(false)}
        onAddInvestment={handleAddInvestment}
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
      />
    </div>
  );
}
