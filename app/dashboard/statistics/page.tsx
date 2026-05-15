'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { storage, User, BusinessProfile, Transaction } from '../../../lib/storage'
import { useLanguage } from '../../contexts/LanguageProvider'
import DashboardCharts from '../../components/DashboardCharts'
import AiSuggestions from '../../components/AiSuggestions'
import { getGrowthMetrics } from '../../../lib/analytics'

export default function StatisticsPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const [user, setUser] = useState<User | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const phone = storage.getCurrentUser()
    if (!phone) {
      router.push('/login')
      return
    }

    const fetchedUser = storage.getUser(phone)

    if (!fetchedUser) {
      router.push('/login')
      return
    }

    setUser(fetchedUser)
    setTransactions(storage.getTransactions(phone))
    setIsLoading(false)
  }, [router])

  if (isLoading) return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
      <div className="animate-pulse flex space-x-4">
        <div className="rounded-full bg-border h-12 w-12"></div>
      </div>
    </div>
  )

  const totalSales = transactions.filter(t => t.type === 'sale').reduce((acc, t) => acc + t.amount, 0)
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0)
  const netCashflow = totalSales - totalExpenses
  const metrics = getGrowthMetrics(transactions, 'monthly')

  return (
    <div className="min-h-screen bg-background text-foreground pb-12">
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.back()}
              className="p-2 rounded-full hover:bg-muted transition-colors border border-border"
              aria-label={t('dash.btn.back')}
            >
              <ArrowLeft className="w-5 h-5 text-muted-foreground" />
            </button>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">
                {t('dash.btn.statistics')}
              </h1>
              <p className="text-muted-foreground mt-1">
                {user?.businessName}
              </p>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <DashboardCharts transactions={transactions} />
          </div>
          <div className="space-y-8">
            <AiSuggestions 
              metrics={metrics} 
              netCashflow={netCashflow} 
              totalTransactions={transactions.length} 
            />
          </div>
        </div>
      </main>
    </div>
  )
}
