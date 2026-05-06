import { Transaction, CreditCard, Investment, Bill, ExtraIncome, ServiceOrder, Client } from './types';

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 't1',
    description: 'Aluguel',
    amount: 1500,
    date: '2025-03-01',
    category: 'Moradia',
    type: 'outflow',
    status: 'paid'
  },
  {
    id: 't2',
    description: 'Supermercado',
    amount: 800,
    date: '2025-03-05',
    category: 'Alimentação',
    type: 'outflow',
    status: 'paid'
  },
  {
    id: 't3',
    description: 'Energia',
    amount: 250,
    date: '2025-03-10',
    category: 'Contas',
    type: 'outflow',
    status: 'paid'
  },
  {
    id: 't4',
    description: 'Salário',
    amount: 5000,
    date: '2025-03-01',
    category: 'Salário',
    type: 'inflow',
    status: 'paid'
  }
];

export const MOCK_BILLS: Bill[] = [
  {
    id: 'b1',
    description: 'Internet Fibra',
    amount: 120,
    dueDate: new Date().toISOString().split('T')[0], // Today
    status: 'pending'
  },
  {
    id: 'b2',
    description: 'Condomínio',
    amount: 450,
    dueDate: '2025-03-10', // Past
    status: 'overdue'
  },
  {
    id: 'b3',
    description: 'Seguro Auto',
    amount: 200,
    dueDate: '2025-03-05',
    status: 'paid'
  }
];

export const MOCK_CARDS: CreditCard[] = [];

export const MOCK_INVESTMENTS: Investment[] = [
  {
    id: '1',
    name: 'Tesouro Selic 2029',
    amount: 5000,
    currentValue: 5250,
    type: 'fixed',
    category: 'Tesouro Direto',
    date: '2025-01-15',
    profitability: 5
  },
  {
    id: '2',
    name: 'HGLG11',
    amount: 3000,
    currentValue: 3150,
    type: 'fund',
    category: 'Fundo Imobiliário',
    date: '2025-02-10',
    profitability: 5
  },
  {
    id: '3',
    name: 'Bitcoin',
    amount: 2000,
    currentValue: 2400,
    type: 'risk',
    category: 'Criptomoeda',
    date: '2025-03-05',
    profitability: 20
  }
];

export const MOCK_EXTRA_INCOME: ExtraIncome[] = [];

export const MOCK_SERVICE_ORDERS: ServiceOrder[] = [
  {
    id: 'OS-001',
    clientName: 'João Silva',
    device: 'iPhone 11',
    defect: 'Tela quebrada',
    diagnosis: 'Troca de frontal original',
    status: 'repairing',
    entryDate: '2025-03-10',
    deadline: '2025-03-12',
    price: 550,
    whatsapp: '11999999999'
  },
  {
    id: 'OS-002',
    clientName: 'Maria Souza',
    device: 'Samsung S21',
    defect: 'Não liga',
    diagnosis: 'Reparo no conector de carga',
    status: 'waiting_parts',
    entryDate: '2025-03-11',
    deadline: '2025-03-15',
    price: 250,
    whatsapp: '11988888888'
  },
  {
    id: 'OS-003',
    clientName: 'Pedro Santos',
    device: 'Xiaomi Mi 11',
    defect: 'Bateria inchada',
    diagnosis: 'Troca de bateria',
    status: 'finished',
    entryDate: '2025-03-09',
    deadline: '2025-03-10',
    price: 180,
    whatsapp: '11977777777'
  }
];

export const MOCK_CLIENTS: Client[] = [
  { id: '1', name: 'João Silva', whatsapp: '11999999999', totalSpent: 1200, lastService: '2025-03-10', frequency: 3 },
  { id: '2', name: 'Maria Souza', whatsapp: '11988888888', totalSpent: 450, lastService: '2025-03-11', frequency: 1 },
];

