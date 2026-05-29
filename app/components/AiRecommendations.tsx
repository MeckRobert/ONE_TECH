import React from 'react'
import { Sparkles, TrendingUp, Shield, HelpCircle, ArrowRight, Calendar } from 'lucide-react'

export interface DbRecommendation {
  id: number
  message: string
  riskLevel: 'Low' | 'Medium' | 'High' | string | null
  createdAt: string
}

interface AiRecommendationsProps {
  recommendations: DbRecommendation[]
  isLoading: boolean
}

export default function AiRecommendations({ recommendations, isLoading }: AiRecommendationsProps) {
  const getRiskBadgeStyles = (riskLevel: string | null) => {
    switch (riskLevel?.toLowerCase()) {
      case 'low':
        return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
      case 'medium':
        return 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
      case 'high':
        return 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
      default:
        return 'bg-purple-500/10 text-purple-400 border border-purple-500/30'
    }
  }

  if (isLoading) {
    return (
      <div className="glass p-6 rounded-2xl border border-border/50 animate-pulse space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-muted"></div>
          <div className="h-5 bg-muted rounded w-1/3"></div>
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-muted rounded w-full"></div>
          <div className="h-4 bg-muted rounded w-5/6"></div>
          <div className="h-4 bg-muted rounded w-4/5"></div>
        </div>
      </div>
    )
  }

  return (
    <section className="glass rounded-2xl border border-border/50 overflow-hidden relative group">
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/5 via-transparent to-primary/5 pointer-events-none transition-opacity duration-500 opacity-70 group-hover:opacity-100"></div>
      
      <div className="p-6 relative z-10 border-b border-border/40 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-500 to-pink-0 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Sparkles className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-bold tracking-tight flex items-center gap-1 text-foreground">
             Your  AI Investment Advisory
            </h3>
            <p className="text-xs text-muted-foreground">
              Personalized opportunities based on your daily recorded income
            </p>
          </div>
        </div>
        <span className="text-[10px] uppercase font-bold tracking-widest bg-primary/10 text-primary px-2.5 py-1 rounded-full border border-primary/20">
          Powered by ONE TECH
        </span>
      </div>

      <div className="p-6 relative z-10 space-y-6 max-h-[500px] overflow-y-auto">
        {recommendations.length === 0 ? (
          <div className="text-center py-10 px-4 space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400">
              <TrendingUp className="w-8 h-8" />
            </div>
            <div className="max-w-sm mx-auto space-y-1">
              <h4 className="font-semibold text-sm">Unlock Smart Wealth Recommendations</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Log a daily sales or income transaction in the recorder. Our AI will analyze your income level and recommend the best local investment options!
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {recommendations.map((rec, index) => (
              <div 
                key={rec.id || index}
                className="bg-card/40 border border-border/40 hover:border-purple-500/30 rounded-xl p-5 transition-all duration-300 hover:scale-[1.01] relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-purple-500 to-pink-500"></div>
                
                <div className="flex justify-between items-start mb-3 gap-2 flex-wrap">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${getRiskBadgeStyles(rec.riskLevel)}`}>
                    Risk Level: {rec.riskLevel || 'Low'}
                  </span>
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(rec.createdAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>

                <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-line">
                  {rec.message}
                </p>

                <div className="mt-4 pt-3 border-t border-border/30 flex justify-between items-center text-xs">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Shield className="w-3.5 h-3.5 text-primary" />
                    <span>Safe Tanzanian Vehicle</span>
                  </div>
                  <a 
                    href="/invest/options"
                    className="text-primary hover:text-primary/80 font-semibold flex items-center gap-1 transition-colors"
                  >
                    Invest Now <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
