'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Sparkles, Check, CreditCard, Smartphone, X, Loader2 } from 'lucide-react'
import { storage } from '../../../lib/storage'
import { useLanguage } from '../../contexts/LanguageProvider'

type Plan = {
  id: 'bronze' | 'gold' | 'platinum';
  name: string;
  price: string;
  priceNum: number;
  period: string;
  features: string[];
  color: string;
  badge?: string;
}

export default function PromotePage() {
  const router = useRouter()
  const { t } = useLanguage()
  const [currentUser, setCurrentUser] = useState<string | null>(null)
  
  // Checkout states
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<'momo' | 'card'>('momo')
  const [momoCarrier, setMomoCarrier] = useState<'mpesa' | 'tigopesa' | 'airtel' | 'halopesa'>('mpesa')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [momoPin, setMomoPin] = useState('')
  
  // Card states
  const [cardNumber, setCardNumber] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvv, setCardCvv] = useState('')
  const [cardName, setCardName] = useState('')

  // Processing states
  const [isProcessing, setIsProcessing] = useState(false)
  const [processStep, setProcessStep] = useState(0)
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    const phone = storage.getCurrentUser()
    if (!phone) {
      router.push('/login')
      return
    }
    setCurrentUser(phone)
    setPhoneNumber(phone)
  }, [router])

  const plans: Plan[] = [
    {
      id: 'bronze',
      name: 'Bronze Starter',
      price: '5,000 TSh',
      priceNum: 5000,
      period: 'month',
      color: 'from-amber-600/30 to-amber-700/10 border-amber-500/30',
      features: [
        'Upload up to 3 Active Products',
        'Direct WhatsApp Inquiry Link',
        'Standard Local Search Visibility',
        'Basic Click-Through Analytics'
      ]
    },
    {
      id: 'gold',
      name: 'Gold Growth',
      price: '15,000 TSh',
      priceNum: 15000,
      period: 'month',
      badge: 'Most Popular',
      color: 'from-yellow-600/30 via-amber-500/20 to-yellow-600/10 border-yellow-500/50 shadow-xl shadow-yellow-500/5',
      features: [
        'Unlimited Product Uploads',
        'Verified Trust Score Badge',
        '3x Visual Search Visibility Boost',
        'Direct Mobile Money Payment Button',
        'Detailed Impressions & Lead Analytics',
        'Featured Listings status'
      ]
    },
    {
      id: 'platinum',
      name: 'Platinum Premium',
      price: '35,000 TSh',
      priceNum: 35000,
      period: 'month',
      badge: 'Best Value',
      color: 'from-purple-600/30 via-indigo-600/20 to-blue-600/10 border-indigo-500/50 shadow-2xl shadow-indigo-500/10',
      features: [
        'Everything in Gold Growth',
        'Top Banner Carousel Ads',
        'Automatic Lead Routing via SMS',
        'AI Copywriter for product posts',
        '24/7 VIP Dedicated Account Manager',
        'Custom QR codes for off-app flyers'
      ]
    }
  ]

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedPlan) return

    setIsProcessing(true)
    setProcessStep(0)

    const steps = [
      'Establishing secure handshake...',
      'Initiating gateway protocol...',
      paymentMethod === 'momo' 
        ? `Requesting TSh ${selectedPlan.price} MoMo push to ${phoneNumber}...`
        : 'Authorizing credit card limit & validation checks...',
      paymentMethod === 'momo'
        ? 'Awaiting USSD/OTP security verification from your phone...'
        : 'Securing OTP dynamic authorization token...',
      'Settling funds and updating ledger status...',
      'Completed!'
    ]

    const interval = setInterval(() => {
      setProcessStep(prev => {
        if (prev < steps.length - 1) {
          return prev + 1
        } else {
          clearInterval(interval)
          setIsSuccess(true)
          setTimeout(() => {
            // Save active sub to localStorage
            if (typeof window !== 'undefined' && currentUser) {
              const activeSubs = JSON.parse(localStorage.getItem('showcase_subscriptions') || '{}')
              activeSubs[currentUser] = {
                planId: selectedPlan.id,
                planName: selectedPlan.name,
                active: true,
                date: new Date().toISOString()
              }
              localStorage.setItem('showcase_subscriptions', JSON.stringify(activeSubs))
            }
            setIsProcessing(false)
            setIsSuccess(false)
            setSelectedPlan(null)
            router.push('/dashboard/promote/feed')
          }, 2000)
          return prev
        }
      })
    }, 1200)
  }

  const stepsList = [
    'Establishing secure handshake...',
    'Initiating gateway protocol...',
    paymentMethod === 'momo' 
      ? `Requesting TSh ${selectedPlan?.price} MoMo push to ${phoneNumber}...`
      : 'Authorizing credit card limit & validation checks...',
    paymentMethod === 'momo'
      ? 'Awaiting USSD/OTP security verification from your phone...'
      : 'Securing OTP dynamic authorization token...',
    'Settling funds and updating ledger status...',
    'Completed!'
  ]

  return (
    <div className="min-h-screen bg-background text-foreground pb-20 relative overflow-hidden">
      
      {/* Background radial highlights */}
      <div className="absolute top-1/4 left-1/4 w-[40rem] h-[40rem] bg-indigo-500/5 rounded-full blur-[100px] -z-10 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[35rem] h-[35rem] bg-purple-500/5 rounded-full blur-[100px] -z-10 animate-pulse"></div>

      <header className="border-b border-border bg-card/65 backdrop-blur-md sticky top-0 z-30">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.push('/dashboard')}
              className="p-2.5 rounded-full hover:bg-muted transition-colors border border-border"
              aria-label={t('dash.btn.back')}
            >
              <ArrowLeft className="w-5 h-5 text-muted-foreground" />
            </button>
            <div>
              <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
                {/* <Sparkles className="w-5 h-5 text-indigo-400" /> */}
               Finbrigde Africa Co Ltd Premium
              </h1>
              <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">
                Elevate your SME advertising presence
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold uppercase tracking-wider border border-indigo-500/20">
            Premium Promotion
          </span>
          <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Choose the Perfect Plan for Your Business
          </h2>
          <p className="text-lg text-muted-foreground">
            Get your products featured in the KIM Showcase, unlock verified trust indicators, and grow your sales volume effortlessly.
          </p>
        </div>

        {/* Plan Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan) => (
            <div 
              key={plan.id}
              className={`glass rounded-3xl border p-8 flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl hover:border-indigo-500/40 bg-gradient-to-b ${plan.color}`}
            >
              {plan.badge && (
                <div className="absolute top-5 right-5">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-foreground text-background shadow-md">
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold tracking-tight">{plan.name}</h3>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-4xl font-black tracking-tight">{plan.price}</span>
                    <span className="text-sm font-semibold text-muted-foreground">/{plan.period}</span>
                  </div>
                </div>

                <div className="border-t border-border/60 pt-6">
                  <ul className="space-y-4">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm">
                        <Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-8 pt-6">
                <button
                  onClick={() => setSelectedPlan(plan)}
                  className={`w-full py-4 px-6 rounded-2xl font-bold transition-all duration-300 ${
                    plan.id === 'gold' 
                      ? 'bg-foreground text-background shadow-lg shadow-foreground/10 hover:shadow-xl hover:scale-[1.01]' 
                      : 'bg-muted text-foreground border border-border hover:bg-foreground hover:text-background'
                  }`}
                >
                  Boost with {plan.name.split(' ')[0]}
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Checkout Modal Overlay */}
      {selectedPlan && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-lg flex items-center justify-center p-4 overflow-y-auto">
          <div className="glass rounded-3xl border border-border w-full max-w-xl p-8 relative shadow-2xl bg-card overflow-hidden">
            
            {/* Modal Header */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-black tracking-tight">Checkout Gateways</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Activating <span className="font-semibold text-foreground">{selectedPlan.name}</span> &bull; {selectedPlan.price}
                </p>
              </div>
              <button 
                onClick={() => setSelectedPlan(null)}
                className="p-1.5 rounded-full hover:bg-muted border border-border text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Gateway Selector */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <button
                onClick={() => setPaymentMethod('momo')}
                className={`py-4 px-4 rounded-2xl border flex flex-col items-center gap-2 font-bold transition-all ${
                  paymentMethod === 'momo'
                    ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400'
                    : 'border-border bg-muted/40 hover:bg-muted/80 text-muted-foreground'
                }`}
              >
                <Smartphone className="w-6 h-6" />
                Mobile Money
              </button>
              <button
                onClick={() => setPaymentMethod('card')}
                className={`py-4 px-4 rounded-2xl border flex flex-col items-center gap-2 font-bold transition-all ${
                  paymentMethod === 'card'
                    ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400'
                    : 'border-border bg-muted/40 hover:bg-muted/80 text-muted-foreground'
                }`}
              >
                <CreditCard className="w-6 h-6" />
                Debit / Credit Card
              </button>
            </div>

            {/* Gateway Form */}
            <form onSubmit={handleCheckoutSubmit} className="space-y-6">
              {paymentMethod === 'momo' ? (
                // MOBILE MONEY FLOW
                <div className="space-y-4 text-left">
                  <div>
                    <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Select Carrier Provider</label>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { id: 'mpesa', name: 'M-Pesa' },
                        { id: 'tigopesa', name: 'Tigo Pesa' },
                        { id: 'airtel', name: 'Airtel Money' },
                        { id: 'halopesa', name: 'HaloPesa' }
                      ].map((carrier) => (
                        <button
                          key={carrier.id}
                          type="button"
                          onClick={() => setMomoCarrier(carrier.id as any)}
                          className={`py-2 px-1 text-xs font-bold rounded-lg border transition-all text-center ${
                            momoCarrier === carrier.id
                              ? 'border-foreground bg-foreground text-background'
                              : 'border-border bg-muted/30 text-muted-foreground hover:bg-muted/80'
                          }`}
                        >
                          {carrier.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">MoMo Phone Number</label>
                    <input 
                      type="tel" 
                      required
                      placeholder="e.g. +255 712 345 678"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="block w-full border-border bg-background rounded-xl focus:ring-primary focus:border-primary sm:text-sm py-3 px-4 border"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Carrier PIN Auth</label>
                    <input 
                      type="password" 
                      required
                      maxLength={4}
                      placeholder="••••"
                      value={momoPin}
                      onChange={(e) => setMomoPin(e.target.value)}
                      className="block w-full border-border bg-background rounded-xl focus:ring-primary focus:border-primary sm:text-sm py-3 px-4 border text-center tracking-widest text-lg font-bold"
                    />
                  </div>
                </div>
              ) : (
                // CARD FLOW
                <div className="space-y-4 text-left">
                  <div>
                    <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Cardholder Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Robert Michael Meck"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="block w-full border-border bg-background rounded-xl focus:ring-primary focus:border-primary sm:text-sm py-3 px-4 border"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Card Number</label>
                    <input 
                      type="text" 
                      required
                      placeholder="4000 1234 5678 9010"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="block w-full border-border bg-background rounded-xl focus:ring-primary focus:border-primary sm:text-sm py-3 px-4 border"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Expiration Date</label>
                      <input 
                        type="text" 
                        required
                        placeholder="MM/YY"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="block w-full border-border bg-background rounded-xl focus:ring-primary focus:border-primary sm:text-sm py-3 px-4 border text-center"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">CVV / Security Code</label>
                      <input 
                        type="password" 
                        required
                        maxLength={3}
                        placeholder="123"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="block w-full border-border bg-background rounded-xl focus:ring-primary focus:border-primary sm:text-sm py-3 px-4 border text-center tracking-widest"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="border-t border-border pt-6 mt-6">
                <button
                  type="submit"
                  className="w-full py-4 bg-foreground text-background rounded-2xl font-black hover:scale-[1.01] transition-all flex justify-center items-center gap-2 shadow-lg shadow-foreground/5"
                >
                  Pay TSh {selectedPlan.price.split(' ')[0]} Now
                </button>
              </div>
            </form>

            {/* Simulated payment progress screen overlay inside modal */}
            {isProcessing && (
              <div className="absolute inset-0 bg-background/95 flex flex-col items-center justify-center p-8 z-40">
                {!isSuccess ? (
                  <div className="space-y-6 text-center max-w-sm">
                    <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mx-auto" />
                    <div className="space-y-2">
                      <h4 className="text-xl font-bold tracking-tight">Processing Payment</h4>
                      <p className="text-xs text-muted-foreground uppercase font-black tracking-widest text-indigo-400">
                        Safe & Encrypted Transaction
                      </p>
                    </div>
                    
                    {/* Progress text bar */}
                    <div className="bg-muted rounded-xl p-4 border border-border/50 text-sm font-semibold text-muted-foreground animate-pulse">
                      {stepsList[processStep]}
                    </div>

                    {/* Progress indicator */}
                    <div className="w-full bg-border rounded-full h-1.5 overflow-hidden">
                      <div 
                        className="bg-indigo-500 h-1.5 rounded-full transition-all duration-700" 
                        style={{ width: `${((processStep + 1) / stepsList.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6 text-center animate-bounce">
                    <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/20">
                      <Check className="w-10 h-10 text-white stroke-[4]" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-2xl font-black text-emerald-500 tracking-tight">Success!</h4>
                      <p className="text-sm font-medium text-muted-foreground">
                        Subscription Activated Successfully
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                      Redirecting to Finbrigde Africa Co Ltd Showcase Feed...
                    </p>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  )
}
