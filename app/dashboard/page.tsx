'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { storage, User, BusinessProfile, Transaction } from '../../lib/storage'
import { useLanguage } from '../contexts/LanguageProvider'

export default function DashboardPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<BusinessProfile | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [consentGranted, setConsentGranted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Form state
  const [txnType, setTxnType] = useState<'sale' | 'expense' | 'mobile_money'>('sale')
  const [txnAmount, setTxnAmount] = useState('')
  const [txnDesc, setTxnDesc] = useState('')

  useEffect(() => {
    const phone = storage.getCurrentUser()
    if (!phone) {
      router.push('/login')
      return
    }

    const fetchedUser = storage.getUser(phone)
    const fetchedProfile = storage.getProfile(phone)

    if (!fetchedUser) {
      router.push('/login')
      return
    }

    if (!fetchedProfile) {
      router.push('/profile-setup')
      return
    }

    setUser(fetchedUser)
    setProfile(fetchedProfile)
    setTransactions(storage.getTransactions(phone))
    setConsentGranted(storage.getConsent(phone))
    setIsLoading(false)
  }, [router])

  const handleLogout = () => {
    storage.logout()
    router.push('/login')
  }

  const handleConsentToggle = () => {
    if (!user) return
    const newConsent = !consentGranted
    storage.setConsent(user.phone, newConsent)
    setConsentGranted(newConsent)
  }

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !txnAmount || isNaN(Number(txnAmount))) return

    storage.saveTransaction(user.phone, {
      type: txnType,
      amount: Number(txnAmount),
      date: new Date().toISOString(),
      description: txnDesc || 'No description'
    })

    setTransactions(storage.getTransactions(user.phone))
    setTxnAmount('')
    setTxnDesc('')
  }

  const totalSales = transactions.filter(t => t.type === 'sale').reduce((acc, t) => acc + t.amount, 0)
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0)
  const mmTxns = transactions.filter(t => t.type === 'mobile_money').reduce((acc, t) => acc + t.amount, 0)
  const netCashflow = totalSales - totalExpenses

  const score = Math.min(1000, 300 + (transactions.length * 10) + (netCashflow > 0 ? 50 : 0))

  if (isLoading) return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
      <div className="animate-pulse flex space-x-4">
        <div className="rounded-full bg-border h-12 w-12"></div>
        <div className="flex-1 space-y-4 py-1">
          <div className="h-4 bg-border rounded w-3/4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-border rounded"></div>
            <div className="h-4 bg-border rounded w-5/6"></div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-background text-foreground pb-12">
      
      {/* Dashboard Top Section */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">
                {user?.businessName}
              </h1>
              <p className="text-muted-foreground mt-1">
                {profile?.businessType.charAt(0).toUpperCase()}{profile?.businessType.slice(1)} &bull; {profile?.location}
              </p>
            </div>
            <button 
              onClick={handleLogout}
              className="text-sm px-5 py-2.5 bg-muted text-muted-foreground font-semibold rounded-full hover:bg-foreground hover:text-background transition-colors border border-border shadow-sm"
            >
              {t('btn.logout')}
            </button>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 space-y-8">
        
        {/* Overview Cards */}
        <section>
          <h2 className="text-xl font-bold mb-6 tracking-tight">{t('dash.overview')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: t('dash.total_sales'), value: totalSales, color: 'text-foreground' },
              { label: t('dash.total_expenses'), value: totalExpenses, color: 'text-muted-foreground' },
              { label: t('dash.net_cashflow'), value: netCashflow, color: netCashflow >= 0 ? 'text-primary' : 'text-red-500' },
              { label: t('dash.momo_volume'), value: mmTxns, color: 'text-foreground' },
            ].map((metric, i) => (
              <div key={i} className="glass p-6 rounded-2xl hover:scale-[1.02] transition-transform duration-300">
                <p className="text-sm font-medium text-muted-foreground mb-2">{metric.label}</p>
                <p className={`text-3xl font-bold tracking-tight ${metric.color}`}>
                  TSh {metric.value.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-8">
            {/* Record Transaction */}
            <section className="glass p-8 rounded-2xl border border-border relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
              <h3 className="text-xl font-bold mb-6">{t('dash.record_txn')}</h3>
              
              <form onSubmit={handleAddTransaction} className="flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1 w-full">
                  <label className="block text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">{t('dash.type')}</label>
                  <select 
                    value={txnType} 
                    onChange={(e) => setTxnType(e.target.value as any)}
                    className="block w-full border-border bg-background rounded-lg focus:ring-primary focus:border-primary sm:text-sm py-3 px-4 border"
                  >
                    <option value="sale">Sale / Income</option>
                    <option value="expense">Expense</option>
                    <option value="mobile_money">Mobile Money</option>
                  </select>
                </div>
                <div className="flex-1 w-full">
                  <label className="block text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">{t('dash.amount')}</label>
                  <input 
                    type="number" 
                    step="0.01"
                    required
                    value={txnAmount}
                    onChange={(e) => setTxnAmount(e.target.value)}
                    className="block w-full border-border bg-background rounded-lg focus:ring-primary focus:border-primary sm:text-sm py-3 px-4 border"
                    placeholder="0.00"
                  />
                </div>
                <div className="flex-1 w-full">
                  <label className="block text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">{t('dash.desc')}</label>
                  <input 
                    type="text" 
                    value={txnDesc}
                    onChange={(e) => setTxnDesc(e.target.value)}
                    className="block w-full border-border bg-background rounded-lg focus:ring-primary focus:border-primary sm:text-sm py-3 px-4 border"
                    placeholder="Description"
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full md:w-auto px-8 py-3 bg-primary text-primary-foreground font-bold rounded-lg hover:opacity-90 transition-opacity"
                >
                  {t('dash.record_btn')}
                </button>
              </form>
            </section>

            {/* Transactions Table */}
            <section className="glass p-8 rounded-2xl border border-border">
              <h3 className="text-xl font-bold mb-6">{t('dash.recent_txns')}</h3>
              {transactions.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground bg-muted/30 rounded-xl border border-dashed border-border">
                  No transactions recorded yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="pb-3 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t('dash.date')}</th>
                        <th className="pb-3 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t('dash.type')}</th>
                        <th className="pb-3 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t('dash.desc')}</th>
                        <th className="pb-3 px-2 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t('dash.amount')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {[...transactions].reverse().map(t => (
                        <tr key={t.id} className="hover:bg-muted/50 transition-colors">
                          <td className="py-4 px-2 whitespace-nowrap text-sm text-muted-foreground">
                            {new Date(t.date).toLocaleDateString()}
                          </td>
                          <td className="py-4 px-2 whitespace-nowrap text-sm">
                            <span className={`px-3 py-1 inline-flex text-xs font-bold rounded-full uppercase tracking-wider ${
                              t.type === 'sale' ? 'bg-foreground text-background' :
                              t.type === 'expense' ? 'bg-muted text-muted-foreground border border-border' :
                              'bg-primary text-primary-foreground'
                            }`}>
                              {t.type}
                            </span>
                          </td>
                          <td className="py-4 px-2 whitespace-nowrap text-sm font-medium">{t.description}</td>
                          <td className="py-4 px-2 whitespace-nowrap text-sm text-right font-bold">
                            TSh {t.amount.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </div>

          <div className="space-y-8">
            {/* Identity Score */}
            <section className="bg-foreground text-background p-8 rounded-2xl shadow-xl relative overflow-hidden">
              {/* Abstract shape */}
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-background/10 rounded-full blur-3xl"></div>
              
              <h3 className="text-xl font-bold mb-2 relative z-10">{t('dash.identity')}</h3>
              <p className="text-sm text-background/70 mb-8 relative z-10">
                Score driven by consistent daily recording.
              </p>
              
              <div className="flex flex-col items-center justify-center bg-background rounded-full w-48 h-48 mx-auto border-[8px] border-background/20 relative z-10 shadow-2xl">
                <span className="text-5xl font-black tracking-tighter text-foreground">{score}</span>
                <span className="text-xs font-bold text-muted-foreground mt-2 uppercase tracking-widest">{t('dash.trust_score')}</span>
              </div>
              
              <div className="mt-8 text-sm relative z-10">
                <div className="w-full bg-background/20 rounded-full h-1.5 mb-2 overflow-hidden">
                  <div className="bg-background h-1.5 rounded-full" style={{ width: `${Math.min(100, (transactions.length / 50) * 100)}%` }}></div>
                </div>
                <div className="flex justify-between text-xs font-medium text-background/70 uppercase tracking-wider">
                  <span>Profile Strength</span>
                  <span>{Math.min(100, (transactions.length / 50) * 100).toFixed(0)}%</span>
                </div>
              </div>
            </section>

            {/* Consent Toggle */}
            <section className="glass p-8 rounded-2xl border border-border">
              <h3 className="text-xl font-bold mb-4">{t('dash.lender_vis')}</h3>
              <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
                {t('dash.consent_desc')}
              </p>
              
              <div className="flex items-center justify-between p-5 bg-card rounded-xl border border-border">
                <div>
                  <p className="font-bold text-sm tracking-tight">{t('dash.consent_active')}</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1 font-semibold">
                    {consentGranted ? t('dash.active') : t('dash.inactive')}
                  </p>
                </div>
                <label className="flex items-center cursor-pointer">
                  <div className="relative">
                    <input 
                      type="checkbox" 
                      className="sr-only" 
                      checked={consentGranted}
                      onChange={handleConsentToggle}
                    />
                    <div className={`block w-14 h-8 rounded-full transition-colors duration-300 ${consentGranted ? 'bg-foreground' : 'bg-muted border border-border'}`}></div>
                    <div className={`absolute left-1 top-1 bg-background w-6 h-6 rounded-full transition-transform duration-300 shadow-sm ${consentGranted ? 'transform translate-x-6' : ''}`}></div>
                  </div>
                </label>
              </div>

              {consentGranted && (
                <div className="mt-6 p-4 bg-foreground text-background rounded-xl text-xs font-medium flex items-start gap-3">
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  <p className="leading-relaxed">{t('dash.visible_msg')}</p>
                </div>
              )}
            </section>
          </div>
        </div>

      </main>
    </div>
  )
}
