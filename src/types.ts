export type TransactionType = 'inflow' | 'outflow';

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  dueDate?: string;
  category: string;
  type: TransactionType;
  status?: 'paid' | 'pending' | 'overdue';
  cardId?: string;
  installments?: number;
  currentInstallment?: number;
  laborAmount?: number;
  partsAmount?: number;
}

export interface CreditCard {
  id: string;
  name: string;
  lastFour: string;
  limit: number;
  used: number;
  dueDate: string;
  closingDate: string;
  color: string;
}

export interface Investment {
  id: string;
  name: string;
  amount: number;
  currentValue: number;
  type: 'fixed' | 'fund' | 'risk';
  category: string;
  date: string;
  profitability: number;
}

export interface Bill {
  id: string;
  description: string;
  amount: number;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue';
}

export interface ExtraIncome {
  id: string;
  service: string;
  amount: number;
  date: string;
  category: 'freelance' | 'sukita';
}

export type OSStatus = 'analyzing' | 'repairing' | 'finished' | 'waiting_parts';

export interface ServiceOrder {
  id: string;
  clientName: string;
  device: string;
  defect: string;
  diagnosis?: string;
  status: OSStatus;
  entryDate: string;
  deadline?: string;
  price?: number;
  whatsapp?: string;
}

export interface Client {
  id: string;
  name: string;
  whatsapp: string;
  totalSpent: number;
  lastService: string;
  frequency: number;
}

export interface FinancialGoal {
  name: string;
  target: number;
  current: number;
}
