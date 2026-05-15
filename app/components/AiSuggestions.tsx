'use client'

import { useMemo } from 'react'
import { TrendingUp, TrendingDown, AlertTriangle, Lightbulb, CheckCircle2 } from 'lucide-react'
import { generateAiSuggestions } from '../../lib/ai'
import { GrowthMetrics } from '../../lib/analytics'
import { useLanguage } from '../contexts/LanguageProvider'

interface AiSuggestionsProps {
  metrics: GrowthMetrics;
  netCashflow: number;
  totalTransactions: number;
}

export default function AiSuggestions({ metrics, netCashflow, totalTransactions }: AiSuggestionsProps) {
  const { t } = useLanguage()
  
  const suggestions = useMemo(() => {
    return generateAiSuggestions(metrics, netCashflow, totalTransactions);
  }, [metrics, netCashflow, totalTransactions]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'positive':
        return <TrendingUp className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <TrendingDown className="w-5 h-5 text-red-500" />;
      case 'actionable':
        return <Lightbulb className="w-5 h-5 text-amber-500" />;
      default:
        return <CheckCircle2 className="w-5 h-5 text-primary" />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case 'positive':
        return 'bg-green-500/10 border-green-500/20';
      case 'warning':
        return 'bg-red-500/10 border-red-500/20';
      case 'actionable':
        return 'bg-amber-500/10 border-amber-500/20';
      default:
        return 'bg-primary/10 border-primary/20';
    }
  };

  return (
    <section className="glass p-8 rounded-2xl border border-border">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center">
          <Lightbulb className="w-5 h-5" />
        </div>
        <h3 className="text-xl font-bold">{t('dash.ai_insights')}</h3>
      </div>
      
      <div className="space-y-4">
        {suggestions.map((suggestion) => (
          <div 
            key={suggestion.id} 
            className={`p-4 rounded-xl border flex gap-4 items-start hover:scale-[1.01] transition-transform duration-300 ${getBgColor(suggestion.type)}`}
          >
            <div className="mt-1 flex-shrink-0">
              {getIcon(suggestion.type)}
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-1">{suggestion.title}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {suggestion.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
