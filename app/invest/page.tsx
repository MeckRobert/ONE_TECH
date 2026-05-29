'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useLanguage } from '../contexts/LanguageProvider'
import { useTheme } from '../contexts/ThemeProvider'

export default function InvestPage() {
  const { t } = useLanguage()
  const { theme } = useTheme()

  const testimonials = [
    {
      name: 'Sarah Mwenda',
      business: 'Retail Store Owner',
      image: '👩🏾',
      quote: 'ONE TECH taught me how to invest my profits. I started with TZS 100,000 in agriculture and earned TZS 150,000 in just 8 months!',
      rating: 5
    },
    {
      name: 'John Komba',
      business: 'Tech Entrepreneur',
      image: '👨🏾',
      quote: 'The investment education platform is amazing. I now understand stocks and have built a diversified portfolio.',
      rating: 5
    },
    {
      name: 'Aisha Hassan',
      business: 'Fruit Vendor',
      image: '👩🏾',
      quote: 'From tracking daily sales to investing in real estate - ONE TECH changed my financial future completely.',
      rating: 5
    }
  ]

  const features = [
    {
      icon: '',
      title: 'Bite-sized Courses',
      description: 'Learn investing at your own pace with short, easy-to-understand lessons'
    },
    {
      icon: '',
      title: 'Live Market Data',
      description: 'Real-time stock prices, commodity rates, and investment opportunities'
    },
    {
      icon: '',
      title: 'Expert Webinars',
      description: 'Live sessions with successful investors and financial experts'
    },
    {
      icon: '',
      title: 'Mobile Learning',
      description: 'Access all educational content from your phone, anytime'
    },
    {
      icon: '',
      title: 'Community Forum',
      description: 'Connect with other investors, share tips and learn together'
    },
    {
      icon: '',
      title: 'Portfolio Tracker',
      description: 'Monitor your investments and track returns in real-time'
    }
  ]

  const steps = [
    {
      number: '01',
      title: 'Learn the Basics',
      description: 'Start with our free courses on investment fundamentals',
      icon: ''
    },
    {
      number: '02',
      title: 'Explore Options',
      description: 'Browse different investment sectors that match your goals',
      icon: ''
    },
    {
      number: '03',
      title: 'Start Small',
      description: 'Begin with as little as TZS 50,000 and grow over time',
      icon: ''
    },
    {
      number: '04',
      title: 'Track & Grow',
      description: 'Monitor your returns and reinvest your profits',
      icon: ''
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/investment/two.jpg"
            alt="Investment Growth Background"
            fill
            priority
            className="object-cover"
            quality={100}
          />
          <div className="absolute inset-0 bg-black/70"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 text-white">
              Learn and Invest Like a Proffessional
              
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-8 leading-relaxed">
              Transform your business profits into lasting wealth through smart investing. 
              Learn from experts and grow your financial future.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
              <Link 
                href="/education" 
                className="group px-8 py-3 bg-black  text-white font-semibold rounded-full hover:scale-105 transition-all duration-300 shadow-lg shadow-green-500/30 flex items-center gap-2"
              >
                <span>Start Learning Free</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link 
                href="/invest/options" 
                className="px-8 py-3 bg-white backdrop-blur-sm text-black font-semibold rounded-full hover:bg-white/20 transition-all duration-300 border border-white/30"
              >
                Explore Opportunities
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Invest Section */}
      <section className="py-20 bg-gradient-to-b from-background to-muted/10">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-block mb-4 px-4 py-1.5 bg-primary/10 rounded-full">
              <span className="text-primary text-sm font-semibold">Why Invest?</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Turn Your Business Profits into Wealth
            </h2>
            <p className="text-xl text-muted-foreground">
              Investing isn't just for the rich. Start small, learn as you grow, and build lasting financial freedom.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className={`p-8 rounded-2xl border text-center transition-all hover:scale-105 ${
              theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white/50 border-gray-200'
            }`}>
              <div className="text-6xl mb-4"></div>
              <h3 className="text-xl font-bold mb-2">Beat Inflation</h3>
              <p className="text-muted-foreground">
                Protect your money's value by investing in assets that grow faster than inflation
              </p>
            </div>
            <div className={`p-8 rounded-2xl border text-center transition-all hover:scale-105 ${
              theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white/50 border-gray-200'
            }`}>
              <div className="text-6xl mb-4"></div>
              <h3 className="text-xl font-bold mb-2">Build Passive Income</h3>
              <p className="text-muted-foreground">
                Create income streams that work for you while you focus on your business
              </p>
            </div>
            <div className={`p-6 rounded-2xl border text-center transition-all hover:scale-105 ${
              theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white/50 border-gray-200'
            }`}>
              <div className="text-6xl mb-4"></div>
              <h3 className="text-xl font-bold mb-2">Secure Your Future</h3>
              <p className="text-muted-foreground">
                Plan for retirement, children's education, and long-term financial goals
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Preview of Investment Options */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-block mb-4 px-4 py-1.5 bg-primary/10 rounded-full">
              <span className="text-primary text-sm font-semibold">Popular Sectors</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Start Investing in These Sectors
            </h2>
            <p className="text-xl text-muted-foreground">
              Explore our most popular investment opportunities
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className={`p-6 rounded-2xl border text-center ${
              theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white/50 border-gray-200'
            }`}>
              <div className="text-5xl mb-3">📈</div>
              <h3 className="font-bold mb-1">Stocks & Equities</h3>
              <p className="text-sm text-muted-foreground">10-15% returns</p>
            </div>
            <div className={`p-6 rounded-2xl border text-center ${
              theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white/50 border-gray-200'
            }`}>
              <div className="text-5xl mb-3">🏠</div>
              <h3 className="font-bold mb-1">Real Estate</h3>
              <p className="text-sm text-muted-foreground">8-12% returns</p>
            </div>
            <div className={`p-6 rounded-2xl border text-center ${
              theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white/50 border-gray-200'
            }`}>
              <div className="text-5xl mb-3">🌾</div>
              <h3 className="font-bold mb-1">Agriculture</h3>
              <p className="text-sm text-muted-foreground">12-18% returns</p>
            </div>
          </div>

          <div className="text-center mt-8">
            <Link
              href="/invest/options"
              className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
            >
              View All Investment Options
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
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
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Start Investing in 4 Easy Steps
            </h2>
            <p className="text-xl text-muted-foreground">
              No complex jargon. Just clear, actionable steps to begin your investment journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {steps.map((step, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-6">
                  <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto group-hover:scale-110 transition-all">
                    <span className="text-4xl">{step.icon}</span>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">
                    {step.number}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-block mb-4 px-4 py-1.5 bg-primary/10 rounded-full">
              <span className="text-primary text-sm font-semibold">Platform Features</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-muted-foreground">
              Comprehensive tools and resources to help you become a confident investor
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`p-6 rounded-2xl border transition-all hover:scale-105 ${
                  theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white/50 border-gray-200'
                }`}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-muted/10">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-block mb-4 px-4 py-1.5 bg-primary/10 rounded-full">
              <span className="text-primary text-sm font-semibold">Success Stories</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Real Investors, Real Results
            </h2>
            <p className="text-xl text-muted-foreground">
              See how fellow entrepreneurs transformed their businesses through smart investing
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`p-6 rounded-2xl border transition-all hover:scale-105 ${
                  theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white/50 border-gray-200'
                }`}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-4xl">{testimonial.image}</div>
                  <div>
                    <h4 className="font-bold">{testimonial.name}</h4>
                    <p className="text-xs text-muted-foreground">{testimonial.business}</p>
                  </div>
                </div>
                <div className="flex mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-500">★</span>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground italic">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Free Resources Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="inline-block mb-4 px-4 py-1.5 bg-primary/10 rounded-full">
                  <span className="text-primary text-sm font-semibold">Free Resources</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Start Learning Today, Absolutely Free
                </h2>
                <p className="text-muted-foreground mb-6">
                  Get access to our beginner-friendly investment courses, market insights, 
                  and expert tips - no credit card required.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3">
                    <span className="text-primary">✓</span>
                    <span>Investment 101: Complete Beginner's Guide</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-primary">✓</span>
                    <span>Understanding Stocks & Mutual Funds</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-primary">✓</span>
                    <span>Real Estate Investment Strategies</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-primary">✓</span>
                    <span>Risk Management & Portfolio Diversification</span>
                  </li>
                </ul>
                <Link
                  href="/education"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full hover:scale-105 transition-all"
                >
                  Access Free Courses
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
              <div className={`p-8 rounded-2xl border ${
                theme === 'dark' ? 'bg-gray-800/30 border-gray-700' : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="text-center">
                  <div className="text-6xl mb-4">🎓</div>
                  <h3 className="text-2xl font-bold mb-2">Featured Course</h3>
                  <p className="text-muted-foreground mb-4">Investment 101: From Zero to Investor</p>
                  <div className="w-full bg-muted rounded-full h-2 mb-3">
                    <div className="bg-primary h-2 rounded-full w-2/3"></div>
                  </div>
                  <p className="text-sm text-muted-foreground">2,500+ students enrolled</p>
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
            <div className="text-6xl mb-4">💰</div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Ready to Start Your Investment Journey?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of entrepreneurs who are building wealth through smart investing. 
              Your financial freedom starts today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/signUp" 
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-full hover:scale-105 transition-all duration-300 shadow-xl shadow-primary/30"
              >
                <span>Create Free Account</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link 
                href="/education" 
                className="inline-flex items-center gap-2 px-8 py-4 bg-muted text-muted-foreground font-semibold rounded-full hover:bg-card hover:text-foreground transition-all duration-300 border border-border"
              >
                Browse Free Courses
              </Link>
            </div>
            <p className="text-xs text-muted-foreground mt-6">
              No credit card required • Cancel anytime • 100% free to start
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}