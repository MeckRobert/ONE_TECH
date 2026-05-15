'use client'

import { useState } from 'react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { getChartData } from '../../lib/analytics'
import { Transaction } from '../../lib/storage'
import { useLanguage } from '../contexts/LanguageProvider'

interface DashboardChartsProps {
  transactions: Transaction[];
}

export default function DashboardCharts({ transactions }: DashboardChartsProps) {
  const { t } = useLanguage()
  const [period, setPeriod] = useState<'weekly' | 'monthly'>('weekly')

  const data = getChartData(transactions, period)

  return (
    <section className="glass p-8 rounded-2xl border border-border w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h3 className="text-xl font-bold">{t('dash.analytics')}</h3>
        <div className="flex items-center bg-muted rounded-full p-1 border border-border">
          <button
            onClick={() => setPeriod('weekly')}
            className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-all duration-300 ${
              period === 'weekly' 
                ? 'bg-foreground text-background shadow-md' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {t('dash.weekly')}
          </button>
          <button
            onClick={() => setPeriod('monthly')}
            className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-all duration-300 ${
              period === 'monthly' 
                ? 'bg-foreground text-background shadow-md' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {t('dash.monthly')}
          </button>
        </div>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" opacity={0.1} />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'currentColor', opacity: 0.6, fontSize: 12 }}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'currentColor', opacity: 0.6, fontSize: 12 }}
              tickFormatter={(value) => value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '12px', color: 'hsl(var(--foreground))' }}
              itemStyle={{ color: 'hsl(var(--foreground))' }}
              cursor={{ fill: 'currentColor', opacity: 0.05 }}
            />
            <Line 
              type="monotone" 
              dataKey="sales" 
              name={t('dash.total_sales')} 
              stroke="hsl(var(--foreground))" 
              strokeWidth={3}
              dot={{ r: 4, strokeWidth: 2 }}
              activeDot={{ r: 6 }}
            />
            <Line 
              type="monotone" 
              dataKey="expenses" 
              name={t('dash.total_expenses')} 
              stroke="#ef4444" 
              strokeWidth={3}
              dot={{ r: 4, strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
