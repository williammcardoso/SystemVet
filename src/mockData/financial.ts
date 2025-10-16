export interface FinancialTransaction {
  id: string;
  date: string;
  description: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  relatedAnimalId?: string;
  relatedClientId?: string;
}

export interface OverallFinancialSummary {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
}

export let mockFinancialTransactions: FinancialTransaction[] = [
  {
    id: "ft1",
    date: "2024-07-20",
    description: "Consulta de Rotina - Totó",
    type: "income",
    amount: 120.00,
    category: "Atendimento",
    relatedAnimalId: "a1",
    relatedClientId: "1",
  },
  {
    id: "ft2",
    date: "2024-07-20",
    description: "Venda de Ração Premium - Totó",
    type: "income",
    amount: 85.00,
    category: "Venda de Produtos",
    relatedAnimalId: "a1",
    relatedClientId: "1",
  },
  {
    id: "ft3",
    date: "2024-07-18",
    description: "Exame de Sangue - Fido",
    type: "income",
    amount: 150.00,
    category: "Exames",
    relatedAnimalId: "a3",
    relatedClientId: "2",
  },
  {
    id: "ft4",
    date: "2024-07-15",
    description: "Pagamento de Aluguel",
    type: "expense",
    amount: 2500.00,
    category: "Despesas Fixas",
  },
  {
    id: "ft5",
    date: "2024-07-10",
    description: "Vacina V8 - Bolinha",
    type: "income",
    amount: 90.00,
    category: "Vacinação",
    relatedAnimalId: "a2",
    relatedClientId: "1",
  },
  {
    id: "ft6",
    date: "2024-07-05",
    description: "Compra de Medicamentos",
    type: "expense",
    amount: 750.00,
    category: "Estoque",
  },
  {
    id: "ft7",
    date: "2024-06-25",
    description: "Consulta de Retorno - Rex",
    type: "income",
    amount: 80.00,
    category: "Atendimento",
    relatedAnimalId: "a5",
    relatedClientId: "3",
  },
];

export const getOverallFinancialSummary = (): OverallFinancialSummary => {
  const totalRevenue = mockFinancialTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = mockFinancialTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netProfit = totalRevenue - totalExpenses;

  return { totalRevenue, totalExpenses, netProfit };
};

// Função para adicionar uma nova transação (para uso no mock)
export const addMockFinancialTransaction = (newTransaction: Omit<FinancialTransaction, 'id'>) => {
  const id = `ft${mockFinancialTransactions.length + 1}`;
  mockFinancialTransactions.push({ ...newTransaction, id });
};