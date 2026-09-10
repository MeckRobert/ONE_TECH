'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useLanguage } from '../../contexts/LanguageProvider'
import { useTheme } from '../../contexts/ThemeProvider'

export default function InvestmentOptionsPage() {
  const { t } = useLanguage()
  const { theme } = useTheme()
  const [activeCategory, setActiveCategory] = useState('all')

  const investmentCategories = [
    {
      id: 'stocks',
      name: 'Stocks & Equities',
      image: '/investment/stock.jpg',
      color: 'from-green-500 to-emerald-500',
      description: 'Invest in shares of public companies and earn dividends',
      returnRate: '10-15%',
      riskLevel: 'Medium-High',
      minAmount: 'TZS 50,000',
      timeHorizon: '3-5 years',
      agentCount: 12,
      topAgents: ['Amana Capital', 'Tanzania Securities', 'Vertex International'],
      longDescription: 'Stock market investing allows you to own a piece of publicly traded companies. We connect you with licensed stockbrokers and investment advisors.',
      benefits: [
        'Liquidity - easy to buy and sell',
        'Dividend income potential',
        'Portfolio diversification',
        'Ownership in established companies'
      ]
    },
    {
      id: 'realestate',
      name: 'Real Estate',
      image: '/investment/Real-estate.jpg',
      color: 'from-blue-500 to-cyan-500',
      description: 'Property investment for steady appreciation and rental income',
      returnRate: '8-12%',
      riskLevel: 'Medium',
      minAmount: 'TZS 500,000',
      timeHorizon: '5-10 years',
      agentCount: 8,
      topAgents: ['Prime Properties', 'Landmark Realty', 'AfriHomes'],
      longDescription: 'We connect you with verified real estate agents, property developers, and land consultants who can help you find the right property investments.',
      benefits: [
        'Passive rental income',
        'Property value appreciation',
        'Tax benefits',
        'Inflation hedge'
      ]
    },
    {
      id: 'agriculture',
      name: 'Agriculture',
      image: '/investment/investment.jpg',
      color: 'from-yellow-500 to-orange-500',
      description: 'Farm land, crop production, and agribusiness investments',
      returnRate: '12-18%',
      riskLevel: 'Medium',
      minAmount: 'TZS 100,000',
      timeHorizon: '1-3 years',
      agentCount: 15,
      topAgents: ['AgriInvest Tanzania', 'Farm Capital', 'GreenFields Ltd'],
      longDescription: 'Connect with trusted agribusiness consultants, farm managers, and agricultural cooperatives for investment opportunities in farming and agribusiness.',
      benefits: [
        'Essential goods demand',
        'Government support programs',
        'Quick returns on seasonal crops',
        'Land asset appreciation'
      ]
    },
    {
      id: 'tech',
      name: 'Tech Startups',
      image: '/investment/Trading.jpg',
      color: 'from-purple-500 to-pink-500',
      description: 'Invest in innovative African tech companies',
      returnRate: '20-30%',
      riskLevel: 'High',
      minAmount: 'TZS 200,000',
      timeHorizon: '3-7 years',
      agentCount: 6,
      topAgents: ['TechVentures Africa', 'Innovation Capital', 'Startup Connect'],
      longDescription: 'We connect you with vetted tech startup accelerators, angel investor networks, and venture capital firms looking for investors.',
      benefits: [
        'High growth potential',
        'Support innovation',
        'Early entry advantage',
        'Portfolio diversification'
      ]
    },
    {
      id: 'retail',
      name: 'Retail Business',
      image: '/investment/saving.jpg',
      color: 'from-red-500 to-rose-500',
      description: 'Support local retail shops and small businesses',
      returnRate: '8-15%',
      riskLevel: 'Low-Medium',
      minAmount: 'TZS 50,000',
      timeHorizon: '1-2 years',
      agentCount: 20,
      topAgents: ['SME Capital Partners', 'LocalBiz Invest', 'Retail Growth Fund'],
      longDescription: 'Connect with SME investment advisors and business brokers who specialize in retail business investments.',
      benefits: [
        'Steady cash flow',
        'Support local economy',
        'Lower entry barrier',
        'Quick returns'
      ]
    },
    {
      id: 'energy',
      name: 'Renewable Energy',
      image: '/investment/invest.jpg',
      color: 'from-indigo-500 to-blue-500',
      description: 'Solar, wind, and clean energy projects',
      returnRate: '10-14%',
      riskLevel: 'Medium',
      minAmount: 'TZS 300,000',
      timeHorizon: '5-8 years',
      agentCount: 5,
      topAgents: ['GreenEnergy Partners', 'Solar Invest Africa', 'EcoFund'],
      longDescription: 'We connect you with renewable energy project developers, green energy funds, and sustainable investment advisors.',
      benefits: [
        'Sustainable impact',
        'Government incentives',
        'Long-term contracts',
        'Growing demand'
      ]
    }
  ]

  const filteredCategories = activeCategory === 'all' 
    ? investmentCategories 
    : investmentCategories.filter(cat => cat.id === activeCategory)

  const [selectedCategory, setSelectedCategory] = useState(null)

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary/10 via-background to-muted/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-4 px-4 py-1.5 bg-primary/10 rounded-full">
              <span className="text-primary text-sm font-semibold">🔗 Trusted Investment Partners</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Connect with Trusted Investment Agents
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We don't hold your money. We simply connect you with verified, licensed investment agents 
              who can help you grow your wealth securely.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Banner */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className={`p-6 rounded-2xl border ${
              theme === 'dark' ? 'bg-blue-900/20 border-blue-700' : 'bg-blue-50 border-blue-200'
            }`}>
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">🔗</div>
                  <div>
                    <h3 className="font-bold">How It Works</h3>
                    <p className="text-sm text-muted-foreground">
                      Browse sectors → Choose an agent → They handle your investment directly
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-3xl">✅</div>
                  <div>
                    <h3 className="font-bold">Verified Agents</h3>
                    <p className="text-sm text-muted-foreground">
                      All partners are licensed and vetted by our team
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-3xl">💰</div>
                  <div>
                    <h3 className="font-bold">You Hold Your Money</h3>
                    <p className="text-sm text-muted-foreground">
                      We never take custody of your funds
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filters */}
      <section className="py-8 sticky top-0 bg-background/95 backdrop-blur-sm z-20 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-6 py-2 rounded-full transition-all ${
                activeCategory === 'all' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground hover:bg-primary/20'
              }`}
            >
              All Sectors
            </button>
            {investmentCategories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-6 py-2 rounded-full transition-all flex items-center gap-2 ${
                  activeCategory === cat.id 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground hover:bg-primary/20'
                }`}
              >
                <div className="w-5 h-5 rounded-full overflow-hidden relative">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <span className="hidden sm:inline">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Investment Cards Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {filteredCategories.map((category, index) => (
              <div
                key={index}
                className={`group rounded-2xl border overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                  theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white/50 border-gray-200'
                }`}
              >
                {/* Image Header */}
                <div className="h-48 relative overflow-hidden">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-60`}></div>
                  {/* Agent Count Badge */}
                  <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1 text-xs text-white">
                    🤝 {category.agentCount}+ Agents
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{category.name}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{category.description}</p>
                  
                  {/* Investment Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Expected Returns:</span>
                      <span className="font-semibold text-primary">{category.returnRate}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Risk Level:</span>
                      <span className="font-semibold">{category.riskLevel}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Minimum Investment:</span>
                      <span className="font-semibold">{category.minAmount}</span>
                    </div>
                  </div>

                  {/* Featured Agents */}
                  <div className="mb-4 p-3 rounded-lg bg-muted/30">
                    <p className="text-xs font-semibold mb-2">Trusted Agents:</p>
                    <div className="flex flex-wrap gap-2">
                      {category.topAgents.map((agent, idx) => (
                        <span key={idx} className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                          {agent}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Link
                    href={`/invest/agents?category=${category.id}`}
                    className="block w-full text-center py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
                  >
                    Find Investment Agents →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Our Platform Section */}
      <section className="py-20 bg-gradient-to-b from-muted/10 to-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Connect Through Finbrigde Africa Co Ltd?
            </h2>
            <p className="text-lg text-muted-foreground">
              We make it safe and easy to find the right investment partner
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className={`p-6 rounded-2xl border text-center ${
              theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white/50 border-gray-200'
            }`}>
              <div className="text-4xl mb-3">✅</div>
              <h3 className="font-bold mb-2">Verified Agents Only</h3>
              <p className="text-sm text-muted-foreground">
                Every agent on our platform is licensed, vetted, and verified by our team
              </p>
            </div>
            <div className={`p-6 rounded-2xl border text-center ${
              theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white/50 border-gray-200'
            }`}>
              <div className="text-4xl mb-3">🔗</div>
              <h3 className="font-bold mb-2">Direct Connection</h3>
              <p className="text-sm text-muted-foreground">
                We never hold your money. You deal directly with the investment agent
              </p>
            </div>
            <div className={`p-6 rounded-2xl border text-center ${
              theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white/50 border-gray-200'
            }`}>
              <div className="text-4xl mb-3">📋</div>
              <h3 className="font-bold mb-2">Free Matching Service</h3>
              <p className="text-sm text-muted-foreground">
                We help match you with agents that fit your investment goals - no fees
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Investment Comparison Table */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Compare Investment Sectors
            </h2>
            <p className="text-lg text-muted-foreground">
              See which sector matches your investment goals
            </p>
          </div>

          <div className="max-w-6xl mx-auto overflow-x-auto">
            <table className={`w-full rounded-2xl overflow-hidden border ${
              theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <thead className={theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}>
                <tr>
                  <th className="p-4 text-left font-semibold">Sector</th>
                  <th className="p-4 text-left font-semibold">Return Rate</th>
                  <th className="p-4 text-left font-semibold">Risk Level</th>
                  <th className="p-4 text-left font-semibold">Min Investment</th>
                  <th className="p-4 text-left font-semibold">Agents</th>
                </tr>
              </thead>
              <tbody>
                {investmentCategories.map((category, idx) => (
                  <tr key={idx} className={`border-t ${
                    theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                  }`}>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full overflow-hidden relative">
                          <Image
                            src={category.image}
                            alt={category.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span className="font-medium">{category.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-primary font-semibold">{category.returnRate}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        category.riskLevel === 'Low-Medium' ? 'bg-green-500/20 text-green-600' :
                        category.riskLevel === 'Medium' ? 'bg-yellow-500/20 text-yellow-600' :
                        category.riskLevel === 'Medium-High' ? 'bg-orange-500/20 text-orange-600' :
                        'bg-red-500/20 text-red-600'
                      }`}>
                        {category.riskLevel}
                      </span>
                    </td>
                    <td className="p-4">{category.minAmount}</td>
                    <td className="p-4">
                      <span className="font-semibold">{category.agentCount}+</span> agents
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Risk Disclaimer */}
      <section className="py-20 bg-gradient-to-b from-muted/10 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="p-8 rounded-2xl bg-yellow-500/10 border border-yellow-500/20">
              <div className="text-4xl mb-4">⚠️</div>
              <h3 className="text-xl font-bold mb-2">Important Disclaimer</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Finbrigde Africa Co Ltd is a connection platform only. We do not hold, manage, or take custody of any client funds. 
                All investments are made directly with our verified partner agents. Please conduct your own due diligence 
                before making any investment decisions.
              </p>
              <p className="text-muted-foreground text-xs">
                Past performance does not guarantee future returns. All investments carry risk.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-muted/20"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Connect with Trusted Agents?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Browse our verified investment agents and start your investment journey today
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="#investment-options"
                className="px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:scale-105 transition-all duration-300 shadow-lg shadow-primary/30"
              >
                Browse Investment Sectors
              </Link>
              <Link
                href="/education"
                className={`px-8 py-3 border font-semibold rounded-lg hover:scale-105 transition-all duration-300 ${
                  theme === 'dark'
                    ? 'border-gray-600 hover:border-primary hover:text-primary'
                    : 'border-gray-300 hover:border-primary hover:text-primary'
                }`}
              >
                Learn Investment Basics
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}