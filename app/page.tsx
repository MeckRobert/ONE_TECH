'use client'

import React from 'react'
import Link from 'next/link'
import { useLanguage } from './contexts/LanguageProvider'
import { useTheme } from './contexts/ThemeProvider'

export default function Home() {
  const { t } = useLanguage()
  const { theme } = useTheme()

  const features = [
    {
      icon: '📊',
      title: t('home.feature1.title') || 'Smart Expense Tracking',
      description: t('home.feature1.desc') || 'Record daily expenses and sales effortlessly with AI-powered categorization and real-time insights'
    },
    {
      icon: '🛒',
      title: t('home.feature2.title') || 'Marketplace Connect',
      description: t('home.feature2.desc') || 'Bring customers and sellers together in one trusted platform for seamless transactions'
    },
    {
      icon: '📚',
      title: t('home.feature3.title') || 'Financial Education',
      description: t('home.feature3.desc') || 'Learn how to invest your business profits in stocks, real estate, and other growth sectors'
    },
    {
      icon: '📈',
      title: t('home.feature4.title') || 'Investment Opportunities',
      description: t('home.feature4.desc') || 'Discover curated investment options tailored to your business size and goals'
    },
    {
      icon: '💪',
      title: t('home.feature5.title') || 'Business Growth Tools',
      description: t('home.feature5.desc') || 'Get actionable insights to help your business track progress and identify opportunities'
    },
    {
      icon: '📱',
      title: t('home.feature6.title') || 'Real-time Analytics',
      description: t('home.feature6.desc') || 'Visualize your finances with beautiful charts and reports to make informed decisions'
    }
  ]

  const stats = [
    { value: '10K+', label: t('home.stats.users') || 'Active Users' },
    { value: 'TZS 5B+', label: t('home.stats.transactions') || 'Transaction Volume' },
    { value: '50+', label: t('home.stats.investments') || 'Investment Options' },
    { value: '100%', label: t('home.stats.focus') || 'Commitment to Your Growth' }
  ]

  const investmentSectors = [
    { name: 'Real Estate', icon: '🏠', color: 'from-blue-500 to-cyan-500' },
    { name: 'Stocks', icon: '📈', color: 'from-green-500 to-emerald-500' },
    { name: 'Agriculture', icon: '🌾', color: 'from-yellow-500 to-orange-500' },
    { name: 'Tech Startups', icon: '💻', color: 'from-purple-500 to-pink-500' },
    { name: 'Retail', icon: '🛍️', color: 'from-red-500 to-rose-500' },
    { name: 'Energy', icon: '⚡', color: 'from-indigo-500 to-blue-500' }
  ]

  return (
    <div className="bg-background text-foreground min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-muted/20"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-muted/20 rounded-full blur-[100px] animate-pulse delay-1000"></div>
        
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-primary/10 animate-float"
              style={{
                width: `${Math.random() * 4 + 2}px`,
                height: `${Math.random() * 4 + 2}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${Math.random() * 10 + 5}s`
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-block mb-4 px-4 py-1.5 bg-primary/10 rounded-full">
              <span className="text-primary text-sm font-semibold">{t('home.welcome_badge') || '✨ Build Your Financial Future'}</span>
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-primary via-muted-foreground to-primary bg-clip-text text-transparent animate-gradient">
              {t('hero.title') || 'Track. Connect. Invest.'}
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 font-light leading-relaxed">
              {t('hero.subtitle') || 'All-in-one platform to track expenses, connect with customers, and learn how to invest your business profits wisely'}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
              <Link 
                href="/signUp" 
                className="group px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-full hover:scale-105 transition-all duration-300 w-full sm:w-auto shadow-xl shadow-primary/30 flex items-center gap-2"
              >
                <span>{t('hero.cta') || 'Start Growing Your Business'}</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link 
                href="#features" 
                className="px-8 py-4 bg-muted text-muted-foreground font-semibold rounded-full hover:bg-card hover:text-foreground transition-all duration-300 w-full sm:w-auto border border-border backdrop-blur-sm"
              >
                {t('hero.secondary_cta') || 'Explore Platform'}
              </Link>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 pt-10 border-t border-border/50">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gradient-to-b from-background to-muted/10">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-block mb-4 px-4 py-1.5 bg-primary/10 rounded-full">
              <span className="text-primary text-sm font-semibold">{t('home.features_badge') || 'What We Offer'}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {t('home.features_title') || 'Everything You Need to Succeed'}
            </h2>
            <p className="text-xl text-muted-foreground">
              {t('home.features_subtitle') || 'From tracking daily finances to investing in your future — all in one place'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="group glass p-8 rounded-2xl hover:scale-105 transition-all duration-300 hover:shadow-2xl border border-border hover:border-primary/50 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/5 to-transparent rounded-full -mr-16 -mt-16"></div>
                <div className="text-5xl mb-5 transform group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Investment Sectors Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-block mb-4 px-4 py-1.5 bg-primary/10 rounded-full">
              <span className="text-primary text-sm font-semibold">💰 Investment Opportunities</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t('home.investment_title') || 'Where Can You Invest?'}
            </h2>
            <p className="text-lg text-muted-foreground">
              {t('home.investment_subtitle') || 'Learn how to grow your business profits across different sectors'}
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-6xl mx-auto">
            {investmentSectors.map((sector, idx) => (
              <div
                key={idx}
                className={`group p-6 rounded-2xl text-center transition-all duration-300 hover:scale-105 cursor-pointer ${
                  theme === 'dark' ? 'bg-gray-800/50 hover:bg-gray-800' : 'bg-white/50 hover:bg-white'
                } border border-border hover:border-primary/50`}
              >
                <div className={`text-4xl mb-3 bg-gradient-to-r ${sector.color} bg-clip-text text-transparent`}>
                  {sector.icon}
                </div>
                <h3 className="font-semibold text-sm">{sector.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-b from-muted/10 to-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-block mb-4 px-4 py-1.5 bg-primary/10 rounded-full">
              <span className="text-primary text-sm font-semibold">Simple Process</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t('home.how_it_works_title') || 'Your Journey to Financial Growth'}
            </h2>
            <p className="text-lg text-muted-foreground">
              {t('home.how_it_works_subtitle') || 'Three simple steps to track, grow, and invest'}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className={`p-6 rounded-2xl border text-center transition-all hover:scale-105 ${
              theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white/50 border-gray-200'
            }`}>
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <div className="text-4xl mb-3">📝</div>
              <h3 className="text-xl font-bold mb-2">{t('home.step1_title') || 'Track Daily Finances'}</h3>
              <p className="text-muted-foreground text-sm">{t('home.step1_desc') || 'Record every expense and sale to understand your cash flow'}</p>
            </div>
            <div className={`p-6 rounded-2xl border text-center transition-all hover:scale-105 ${
              theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white/50 border-gray-200'
            }`}>
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <div className="text-4xl mb-3">🤝</div>
              <h3 className="text-xl font-bold mb-2">{t('home.step2_title') || 'Connect & Grow'}</h3>
              <p className="text-muted-foreground text-sm">{t('home.step2_desc') || 'Use our marketplace to find customers or source products'}</p>
            </div>
            <div className={`p-6 rounded-2xl border text-center transition-all hover:scale-105 ${
              theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white/50 border-gray-200'
            }`}>
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <div className="text-4xl mb-3">📚</div>
              <h3 className="text-xl font-bold mb-2">{t('home.step3_title') || 'Learn & Invest'}</h3>
              <p className="text-muted-foreground text-sm">{t('home.step3_desc') || 'Access financial education and start investing wisely'}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Financial Education Preview */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-block mb-4 px-4 py-1.5 bg-primary/10 rounded-full">
                  <span className="text-primary text-sm font-semibold">📚 Financial Literacy</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  {t('home.education_title') || 'Learn to Invest Like a Pro'}
                </h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {t('home.education_desc') || 'Access bite-sized courses, webinars, and articles about stocks, real estate, agriculture, and more. Made simple for business owners.'}
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3">
                    <span className="text-primary">✓</span>
                    <span>Investment basics for beginners</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-primary">✓</span>
                    <span>Real estate investment strategies</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-primary">✓</span>
                    <span>Stock market & mutual funds guide</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-primary">✓</span>
                    <span>Diversification & risk management</span>
                  </li>
                </ul>
                <Link 
                  href="/education"
                  className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
                >
                  Start Learning Free
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
              <div className={`p-8 rounded-2xl border ${theme === 'dark' ? 'bg-gray-800/30 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                <div className="text-center mb-6">
                  <div className="text-6xl mb-3">🎓</div>
                  <h3 className="text-xl font-bold">Coming Soon</h3>
                  <p className="text-muted-foreground text-sm mt-2">Live Webinars with Financial Experts</p>
                </div>
                <div className="space-y-3">
                  {['Stocks 101', 'Real Estate for Beginners', 'Agriculture Investment'].map((topic, i) => (
                    <div key={i} className="flex justify-between items-center p-3 rounded-lg border border-border">
                      <span>{topic}</span>
                      <span className="text-xs text-primary">Register →</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-muted/20"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto glass rounded-3xl p-12 md:p-16 border border-border">
            <div className="text-5xl mb-4">🚀</div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {t('home.cta_title') || 'Ready to Grow Your Business?'}
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              {t('home.cta_subtitle') || 'Join thousands of entrepreneurs tracking expenses, connecting with customers, and learning to invest wisely'}
            </p>
            <Link 
              href="/signUp" 
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-full hover:scale-105 transition-all duration-300 shadow-xl shadow-primary/30"
            >
              <span>{t('home.cta_button') || 'Get Started Free'}</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-20px) translateX(10px); }
        }
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-float {
          animation: float linear infinite;
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.1); }
        }
        .animate-pulse {
          animation: pulse 4s ease-in-out infinite;
        }
        .delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  )
}