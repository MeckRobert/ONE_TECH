import { Transaction } from './storage';

export type ChartDataPoint = {
  name: string;
  sales: number;
  expenses: number;
};

export type GrowthMetrics = {
  salesGrowth: number; // percentage
  expensesGrowth: number; // percentage
  isGrowing: boolean;
};

export function getChartData(transactions: Transaction[], period: 'weekly' | 'monthly'): ChartDataPoint[] {
  const data: ChartDataPoint[] = [];
  const now = new Date();
  const days = period === 'weekly' ? 7 : 30;

  for (let i = days - 1; i >= 0; i--) {
    const targetDate = new Date(now);
    targetDate.setDate(targetDate.getDate() - i);
    const targetDateStr = targetDate.toISOString().split('T')[0];

    const dayTxns = transactions.filter(t => t.date.startsWith(targetDateStr));
    
    const sales = dayTxns.filter(t => t.type === 'sale').reduce((sum, t) => sum + t.amount, 0);
    const expenses = dayTxns.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

    data.push({
      name: targetDate.toLocaleDateString('en-US', { weekday: period === 'weekly' ? 'short' : undefined, day: period === 'monthly' ? 'numeric' : undefined, month: period === 'monthly' ? 'short' : undefined }),
      sales,
      expenses,
    });
  }

  return data;
}

export function getGrowthMetrics(transactions: Transaction[], period: 'weekly' | 'monthly'): GrowthMetrics {
  const days = period === 'weekly' ? 7 : 30;
  const now = new Date();
  
  const currentStart = new Date(now);
  currentStart.setDate(currentStart.getDate() - days);
  
  const previousStart = new Date(now);
  previousStart.setDate(previousStart.getDate() - (days * 2));

  let currentSales = 0;
  let currentExpenses = 0;
  let previousSales = 0;
  let previousExpenses = 0;

  transactions.forEach(t => {
    const tDate = new Date(t.date);
    if (tDate >= currentStart && tDate <= now) {
      if (t.type === 'sale') currentSales += t.amount;
      if (t.type === 'expense') currentExpenses += t.amount;
    } else if (tDate >= previousStart && tDate < currentStart) {
      if (t.type === 'sale') previousSales += t.amount;
      if (t.type === 'expense') previousExpenses += t.amount;
    }
  });

  const salesGrowth = previousSales === 0 ? (currentSales > 0 ? 100 : 0) : ((currentSales - previousSales) / previousSales) * 100;
  const expensesGrowth = previousExpenses === 0 ? (currentExpenses > 0 ? 100 : 0) : ((currentExpenses - previousExpenses) / previousExpenses) * 100;

  return {
    salesGrowth,
    expensesGrowth,
    isGrowing: salesGrowth > expensesGrowth,
  };
}
