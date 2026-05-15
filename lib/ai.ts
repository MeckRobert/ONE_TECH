import { GrowthMetrics } from './analytics';

export type AiSuggestion = {
  id: string;
  type: 'positive' | 'warning' | 'actionable';
  title: string;
  description: string;
};

export function generateAiSuggestions(metrics: GrowthMetrics, netCashflow: number, totalTransactions: number): AiSuggestion[] {
  const suggestions: AiSuggestion[] = [];

  // Suggestion 1: Based on Growth
  if (metrics.salesGrowth > 10) {
    suggestions.push({
      id: 's1',
      type: 'positive',
      title: 'Strong Sales Growth',
      description: `Your sales are up ${metrics.salesGrowth.toFixed(1)}% compared to the previous period. Consider restocking top-selling items to maintain momentum.`,
    });
  } else if (metrics.salesGrowth < -10) {
    suggestions.push({
      id: 's1',
      type: 'warning',
      title: 'Sales Are Slowing Down',
      description: `Sales decreased by ${Math.abs(metrics.salesGrowth).toFixed(1)}%. You might want to run a promotion or reach out to past customers.`,
    });
  }

  // Suggestion 2: Based on Expenses
  if (metrics.expensesGrowth > 20 && !metrics.isGrowing) {
    suggestions.push({
      id: 's2',
      type: 'warning',
      title: 'High Expenses Alert',
      description: `Expenses grew by ${metrics.expensesGrowth.toFixed(1)}% while sales didn't keep up. Review your recent costs to see where you can cut back.`,
    });
  }

  // Suggestion 3: Cashflow
  if (netCashflow < 0) {
    suggestions.push({
      id: 's3',
      type: 'actionable',
      title: 'Negative Cash Flow',
      description: `You spent more than you earned recently. Focus on collecting any pending payments and reducing non-essential spending.`,
    });
  } else if (netCashflow > 100000) { // Assuming TZS context, 100k is a good threshold
    suggestions.push({
      id: 's3',
      type: 'positive',
      title: 'Healthy Cash Reserve',
      description: `You have a strong positive cash flow. Consider setting aside some funds for future investments or an emergency buffer.`,
    });
  }

  // Suggestion 4: General Engagement
  if (totalTransactions < 5) {
    suggestions.push({
      id: 's4',
      type: 'actionable',
      title: 'Record More Transactions',
      description: `Your identity score improves with every record. Make sure to log all daily sales and expenses to build a strong credit profile.`,
    });
  }

  // Fallback if no specific condition met
  if (suggestions.length === 0) {
    suggestions.push({
      id: 's0',
      type: 'positive',
      title: 'Business is Stable',
      description: 'Your business metrics are steady. Keep recording your transactions consistently to unlock better insights.',
    });
  }

  return suggestions.slice(0, 3); // Return top 3 suggestions max
}
