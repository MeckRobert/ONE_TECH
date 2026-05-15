'use client'

import React from 'react'
import Link from 'next/link'
import { useLanguage } from './contexts/LanguageProvider'
import Footer from './components/Footer'

export default function Home() {
  const { t } = useLanguage()

  const features = [
    {
      icon: '',
      title: t('home.feature1.title'),
      description: t('home.feature1.desc')
    },
    {
      icon: '',
      title: t('home.feature2.title'),
      description: t('home.feature2.desc')
    },
    {
      icon: '',
      title: t('home.feature3.title'),
      description: t('home.feature3.desc')
    },
    {
      icon: '',
      title: t('home.feature4.title'),
      description: t('home.feature4.desc')
    },
    {
      icon: '',
      title: t('home.feature5.title'),
      description: t('home.feature5.desc')
    },
    {
      icon: '',
      title: t('home.feature6.title'),
      description: t('home.feature6.desc')
    }
  ]

  const stats = [
    { value: '50K+', label: t('home.stats.users') },
    { value: '$2B+', label: t('home.stats.transactions') },
    { value: '99.9%', label: t('home.stats.uptime') },
    { value: '24/7', label: t('home.stats.support') }
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
              <span className="text-primary text-sm font-semibold">{t('home.welcome_badge')}</span>
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-primary via-muted-foreground to-primary bg-clip-text text-transparent animate-gradient">
              {t('hero.title')}
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 font-light leading-relaxed">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
              <Link 
                href="/signUp" 
                className="group px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-full hover:scale-105 transition-all duration-300 w-full sm:w-auto shadow-xl shadow-primary/30 flex items-center gap-2"
              >
                <span>{t('hero.cta')}</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link 
                href="#features" 
                className="px-8 py-4 bg-muted text-muted-foreground font-semibold rounded-full hover:bg-card hover:text-foreground transition-all duration-300 w-full sm:w-auto border border-border backdrop-blur-sm"
              >
                {t('hero.secondary_cta')}
              </Link>
            </div>

            {/* Stats Section - NOW USING TRANSLATIONS */}
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

      {/* Features Section - NOW USING TRANSLATIONS */}
      <section id="features" className="py-24 bg-gradient-to-b from-background to-muted/10">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-block mb-4 px-4 py-1.5 bg-primary/10 rounded-full">
              <span className="text-primary text-sm font-semibold">{t('home.features_badge')}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {t('home.features_title')}
            </h2>
            <p className="text-xl text-muted-foreground">
              {t('home.features_subtitle')}
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

      {/* CTA Section - NOW USING TRANSLATIONS */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-muted/20"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto glass rounded-3xl p-12 md:p-16 border border-border">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {t('home.cta_title')}
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              {t('home.cta_subtitle')}
            </p>
            <Link 
              href="/signUp" 
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-full hover:scale-105 transition-all duration-300 shadow-xl shadow-primary/30"
            >
              <span>{t('home.cta_button')}</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

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