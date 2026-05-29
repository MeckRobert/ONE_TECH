// lib/aiService.ts

interface AICaptionOptions {
  tone?: 'professional' | 'casual' | 'funny' | 'emotional' | 'persuasive';
  length?: 'short' | 'medium' | 'long';
  includeEmojis?: boolean;
  includeHashtags?: boolean;
  language?: 'en' | 'sw';
}

interface AIGenerateResponse {
  success: boolean;
  content: string;
  error?: string;
}

interface VideoEditOptions {
  aspectRatio?: '1:1' | '16:9' | '9:16' | '4:5';
  trimStart?: number;
  trimEnd?: number;
  brightness?: number;
  contrast?: number;
  saturation?: number;
}

class AIContentService {
  
  // 1. AUTO CAPTIONS GENERATION
  async generateCaptions(
    productName: string,
    description: string,
    price: number,
    options: AICaptionOptions = {}
  ): Promise<AIGenerateResponse> {
    try {
      const tone = options.tone || 'professional';
      const length = options.length || 'medium';
      const includeEmojis = options.includeEmojis || true;
      const includeHashtags = options.includeHashtags || true;
      const language = options.language || 'en';

      // Simulated AI generation - In production, call OpenAI API or similar
      const captions = this.getCaptionTemplates(tone, length);
      
      let generatedCaption = captions
        .replace('{product}', productName)
        .replace('{description}', description)
        .replace('{price}', price.toLocaleString());

      if (includeEmojis) {
        generatedCaption = this.addEmojis(generatedCaption, tone);
      }

      if (includeHashtags) {
        const hashtags = this.generateHashtags(productName, tone);
        generatedCaption += `\n\n${hashtags}`;
      }

      if (language === 'sw') {
        generatedCaption = await this.translateToSwahili(generatedCaption);
      }

      return {
        success: true,
        content: generatedCaption
      };
    } catch (error) {
      return {
        success: false,
        content: '',
        error: 'Failed to generate captions'
      };
    }
  }

  private getCaptionTemplates(tone: string, length: string): string {
    const templates = {
      professional: {
        short: "✨ {product} - {description} Available now for TSh {price} ✓ Quality guaranteed ✓ Fast delivery",
        medium: "Introducing our premium {product} ✨\n\n{description}\n\n✅ High-quality materials\n✅ Satisfaction guaranteed\n✅ Free delivery on orders over TSh 50,000\n\nPrice: TSh {price}\n\nOrder yours today!",
        long: "🎯 PRODUCT SPOTLIGHT: {product}\n\n{description}\n\n📦 PRODUCT FEATURES:\n• Premium quality guaranteed\n• Locally sourced materials\n• Eco-friendly packaging\n• 30-day return policy\n\n💰 Price: TSh {price}\n\n🚚 Delivery available nationwide\n\n📱 Order via WhatsApp or DM\n\nDon't miss out on this amazing offer! 🔥"
      },
      casual: {
        short: "OMG! {product} just dropped! 🔥 Only TSh {price} ✨",
        medium: "Hey fam! Check out this {product} 😍\n\n{description}\n\nPrice: TSh {price}\n\nGrab yours before they're gone! 💫",
        long: "You guys NEED to see this! 🔥\n\nIntroducing {product} - it's absolutely amazing!\n\n{description}\n\n✨ Why you'll love it:\n• Super high quality\n• Amazing price TSh {price}\n• Fast shipping\n\nTap the link to order! 🛍️"
      },
      funny: {
        short: "Warning: {product} may cause extreme happiness 😂 Only TSh {price}!",
        medium: "POV: You just found the best {product} ever and can't stop smiling 😂\n\n{description}\n\nPrice: TSh {price}\n\nYour wallet might cry but you'll be happy! 💸",
        long: "Breaking News! 📰\n\nLocal person discovers {product} and can't stop talking about it!\n\n{description}\n\nPrice: TSh {price}\n\nSide effects may include: happiness, compliments from friends, and a lighter wallet 😂\n\nOrder now before your self-control kicks in! 🏃‍♂️"
      },
      emotional: {
        short: "Made with love ❤️ {product} - TSh {price}",
        medium: "Every {product} tells a story...\n\n{description}\n\n✨ Handcrafted with care\n💝 Perfect for special moments\n🎁 Makes an amazing gift\n\nPrice: TSh {price}\n\nShare the love! 💕",
        long: "There's something special about {product}...\n\n{description}\n\nEvery piece is created with:\n❤️ Love and dedication\n🤝 Support for local artisans\n🌍 Sustainable practices\n\nPrice: TSh {price}\n\nJoin our family of happy customers! 🌟"
      },
      persuasive: {
        short: "Limited time! {product} only TSh {price} ⏰",
        medium: "ACT FAST! 🔥\n\n{product} is flying off the shelves!\n\n{description}\n\n✅ Premium quality\n✅ Best price TSh {price}\n✅ Limited stock available\n\nDon't miss out - order today! 🎯",
        long: "⚠️ LIMITED STOCK ALERT ⚠️\n\n{product} is selling faster than expected!\n\n{description}\n\nWhy customers love it:\n✓ Unbeatable quality\n✓ Incredible value at TSh {price}\n✓ Fast nationwide delivery\n✓ 100% satisfaction guaranteed\n\nStock running low! Secure yours now! 🏃‍♀️💨"
      }
    };

    return templates[tone as keyof typeof templates][length as keyof typeof templates['professional']];
  }

  private addEmojis(text: string, tone: string): string {
    const emojiMap: Record<string, string[]> = {
      professional: ['✨', '✓', '🎯', '📦', '🚚', '💰', '📱', '🔥'],
      casual: ['😍', '🔥', '✨', '💫', '🎉', '😎', '💯', '🙌'],
      funny: ['😂', '🤣', '💀', '😭', '🤡', '💸', '🏃‍♂️', '🎪'],
      emotional: ['❤️', '💕', '💝', '🌟', '🌍', '🎁', '🤝', '✨'],
      persuasive: ['⚠️', '🔥', '🎯', '✓', '🏃‍♀️', '💨', '⏰', '💪']
    };

    const availableEmojis = emojiMap[tone] || emojiMap.casual;
    // Add random emojis at strategic places
    return text.replace(/([.!?])\s/g, (match) => {
      const randomEmoji = availableEmojis[Math.floor(Math.random() * availableEmojis.length)];
      return `${randomEmoji} ${match}`;
    });
  }

  // 2. SMART HASHTAG GENERATION
  generateHashtags(productName: string, tone: string = 'casual'): string {
    const baseHashtags = [
      '#Tanzania', '#DarEsSalaam', '#LocalBusiness', 
      '#SupportLocal', '#AfricanBusiness', '#SmallBizTZ'
    ];
    
    const productHashtags = productName
      .toLowerCase()
      .split(' ')
      .map(word => `#${word.replace(/[^a-z]/g, '')}`)
      .filter(tag => tag.length > 1);
    
    const categoryHashtags = this.getCategoryHashtags(productName);
    const trendingHashtags = this.getTrendingHashtags();
    
    const allHashtags = [...baseHashtags, ...productHashtags, ...categoryHashtags, ...trendingHashtags];
    const uniqueHashtags = [...new Set(allHashtags)];
    
    // Return top 10-15 hashtags
    return uniqueHashtags.slice(0, 12).join(' ');
  }

  private getCategoryHashtags(productName: string): string[] {
    const categories: Record<string, string[]> = {
      food: ['#FreshFood', '#Organic', '#FarmToTable', '#TanzanianFood', '#LocalCuisine'],
      fashion: ['#Fashion', '#Style', '#AfricanFashion', '#OOTD', '#Handmade'],
      electronics: ['#Tech', '#Gadgets', '#Electronics', '#SmartHome', '#Innovation'],
      services: ['#Services', '#Professional', '#QualityService', '#Trusted'],
      retail: ['#Shopping', '#Retail', '#Deals', '#Discounts'],
      default: ['#Quality', '#BestPrice', '#ShopLocal', '#CustomerFavorite']
    };

    for (const [category, hashtags] of Object.entries(categories)) {
      if (productName.toLowerCase().includes(category)) {
        return hashtags;
      }
    }
    return categories.default;
  }

  private getTrendingHashtags(): string[] {
    // Simulated trending hashtags - would come from API in production
    const trending = ['#TrendingNow', '#Viral', '#MustHave', '#TikTokMadeMeBuyIt'];
    return trending.slice(0, Math.floor(Math.random() * 3) + 1);
  }

  // 3. VOICE TRANSLATION (Swahili/English)
  async translateToSwahili(text: string): Promise<string> {
    // Simulated translation - integrate with Google Translate API in production
    const translations: Record<string, string> = {
      'Hello': 'Habari',
      'Welcome': 'Karibu',
      'Product': 'Bidhaa',
      'Price': 'Bei',
      'Quality': 'Ubora',
      'Delivery': 'Uwasilishaji',
      'Order': 'Oda',
      'Available': 'Inapatikana',
      'Limited': 'Ndogo',
      'Special': 'Maalum',
      'Amazing': 'Ajabu',
      'Premium': 'Bora'
    };

    let translated = text;
    for (const [eng, sw] of Object.entries(translations)) {
      translated = translated.replace(new RegExp(eng, 'gi'), sw);
    }
    return translated;
  }

  // 4. CONTENT IDEAS GENERATOR
  async generateContentIdeas(
    niche: string,
    count: number = 5
  ): Promise<Array<{title: string, description: string, type: string, difficulty: string}>> {
    
    const ideas = [
      {
        title: `Behind the Scenes: Making ${niche}`,
        description: `Show your audience how ${niche} is created from start to finish. Raw footage creates authenticity!`,
        type: 'Video',
        difficulty: 'Medium'
      },
      {
        title: `Customer Spotlight: ${niche} Success Stories`,
        description: `Share real customer testimonials and how ${niche} improved their lives or business.`,
        type: 'Carousel',
        difficulty: 'Easy'
      },
      {
        title: `${niche} vs Competitors: Honest Comparison`,
        description: `Build trust by comparing your ${niche} with others. Highlight what makes yours special.`,
        type: 'Video',
        difficulty: 'Hard'
      },
      {
        title: `5 Ways to Use ${niche} You Never Thought Of`,
        description: `Creative tips and hacks for using ${niche} in unexpected ways.`,
        type: 'Carousel',
        difficulty: 'Medium'
      },
      {
        title: `${niche} Q&A: Answering Your Top Questions`,
        description: `Address common customer questions about ${niche} in an engaging format.`,
        type: 'Live/Video',
        difficulty: 'Easy'
      },
      {
        title: `Day in the Life: Creating ${niche}`,
        description: `Documentary-style content showing the craftsmanship behind ${niche}.`,
        type: 'Reel',
        difficulty: 'Hard'
      },
      {
        title: `Why ${niche} is Perfect for [Holiday/Event]`,
        description: `Seasonal marketing content showing why ${niche} makes a great gift.`,
        type: 'Post',
        difficulty: 'Easy'
      },
      {
        title: `${niche} Unboxing & First Impressions`,
        description: `Authentic reaction to receiving your product. Great for social proof!`,
        type: 'Reel',
        difficulty: 'Easy'
      }
    ];
    
    // Shuffle and return requested count
    const shuffled = [...ideas].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  // 5. THUMBNAIL SUGGESTIONS
  generateThumbnailSuggestions(productName: string, category: string): string[] {
    const suggestions = [
      `High-quality product shot of ${productName} on white background`,
      `${productName} being used by happy customer in ${category} setting`,
      `Close-up detail showing quality of ${productName}`,
      `${productName} with price tag overlay: TSh {price}`,
      `Before/after comparison featuring ${productName}`,
      `${productName} gift-wrapped and ready for delivery`,
      `Creative flat lay with ${productName} and complementary items`,
      `${productName} with "Limited Stock" urgency badge`
    ];
    return suggestions;
  }

  // 6. VIDEO EDITING SUGGESTIONS
  getVideoEditingTips(productType: string): string[] {
    return [
      '🎬 Keep first 3 seconds attention-grabbing',
      '📱 Shoot in vertical (9:16) for best engagement',
      '🎵 Use trending audio for better reach',
      '✂️ Cut to the product within 5 seconds',
      '💡 Show product benefits, not just features',
      '🏷️ Add text overlays for silent viewing',
      '⏱️ Optimal length: 15-30 seconds for Reels',
      '🔊 Add captions for accessibility',
      '🎨 Use bright, natural lighting',
      '🔄 Show product from multiple angles'
    ];
  }

  // 7. AI POWERED POST OPTIMIZATION
  async optimizePost(
    caption: string,
    hashtags: string,
    targetAudience: 'youth' | 'professional' | 'family' | 'all' = 'all'
  ): Promise<{optimizedCaption: string; suggestions: string[]}> {
    
    const suggestions = [];
    let optimizedCaption = caption;

    // Check caption length
    if (caption.length < 100) {
      suggestions.push('Add more details about your product benefits');
      optimizedCaption += '\n\n✨ Benefits you\'ll love:\n• High quality guaranteed\n• Fast delivery\n• Best price in town';
    } else if (caption.length > 500) {
      suggestions.push('Consider shortening your caption for better mobile readability');
    }

    // Check emoji usage
    const emojiCount = (caption.match(/[\u{1F600}-\u{1F64F}]/gu) || []).length;
    if (emojiCount < 3 && targetAudience === 'youth') {
      suggestions.push('Add more emojis to make content engaging for younger audience');
      optimizedCaption = this.addEmojis(optimizedCaption, 'casual');
    }

    // Check hashtags
    const hashtagCount = (hashtags.match(/#/g) || []).length;
    if (hashtagCount < 5) {
      suggestions.push('Use 5-10 relevant hashtags for better discoverability');
    }
    if (hashtagCount > 15) {
      suggestions.push('Reduce hashtags to 10-12 for cleaner look');
    }

    // Call to action check
    if (!caption.includes('Order') && !caption.includes('Buy') && !caption.includes('DM') && !caption.includes('WhatsApp')) {
      suggestions.push('Add a clear call-to-action (e.g., "Order via WhatsApp", "DM to buy")');
      optimizedCaption += '\n\n📱 Order now via WhatsApp or DM!';
    }

    return {
      optimizedCaption,
      suggestions
    };
  }

  // 8. TRENDING AUDIO SUGGESTIONS (for Reels)
  getTrendingAudioSuggestions(): Array<{title: string, mood: string, bestFor: string}> {
    return [
      { title: 'Upbeat Afrobeat Mix', mood: 'Energetic', bestFor: 'Product showcases' },
      { title: 'Relaxing Acoustic', mood: 'Calm', bestFor: 'Behind the scenes' },
      { title: 'Corporate Ambient', mood: 'Professional', bestFor: 'Business content' },
      { title: 'Trending TikTok Song', mood: 'Fun', bestFor: 'Young audience' },
      { title: 'Local Bongo Flava', mood: 'Cultural', bestFor: 'Local market content' }
    ];
  }

  // 9. AI POWERED INVESTMENT RECOMMENDATION BASED ON INCOME
  async generateInvestmentRecommendation(
    phone: string,
    incomeAmount: number,
    description: string,
    recentTransactions: any[] = []
  ): Promise<{
    message: string;
    riskLevel: 'Low' | 'Medium' | 'High';
    investmentType: string;
    expectedReturn: number;
  }> {
    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const prompt = `You are an expert financial advisor in Tanzania (ONE TECH fintech platform).
We recorded a new daily income transaction of TSh ${incomeAmount.toLocaleString()} (Description: "${description}").
The user's recent transactions are: ${JSON.stringify(recentTransactions.slice(0, 5))}.

Recommend the absolute best local Tanzanian investment option(s) for them based on this income level.
Be very specific and reference actual Tanzanian investment vehicles:
1. UTT AMIS Mutual Funds (like Umoja Fund, Wekeza Maisha, or Liquid Fund) for lower-risk, low entry options.
2. Government Treasury Bonds (especially 15-year or 20-year bonds) for long-term guaranteed high yield (12-15.4% per annum) for higher incomes.
3. Dar es Salaam Stock Exchange (DSE) stocks (like CRDB Bank, NMB Bank, TPCC Twiga Cement, Vodacom) for moderate risk and dividends.
4. direct business reinvestment (expansion, raw materials, stock restocking).

Provide your response in a clear, professional, and encouraging tone. Keep the recommendation concise (2-3 short paragraphs, max 150 words). Include a suggested risk level (Low, Medium, or High) and estimated annual returns.
Your response MUST be in this exact JSON format so we can parse it easily:
{
  "message": "The full recommendation text here...",
  "riskLevel": "Low" | "Medium" | "High",
  "investmentType": "UTT AMIS" | "Treasury Bonds" | "DSE Stocks" | "Business Reinvestment",
  "expectedReturn": 12.5
}
`;

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: {
                responseMimeType: "application/json"
              }
            }),
          }
        );

        if (response.ok) {
          const resData = await response.json();
          const text = resData?.candidates?.[0]?.content?.parts?.[0]?.text || '';
          const parsed = JSON.parse(text.trim());
          if (parsed && parsed.message) {
            return {
              message: parsed.message,
              riskLevel: parsed.riskLevel || 'Low',
              investmentType: parsed.investmentType || 'UTT AMIS',
              expectedReturn: parsed.expectedReturn || 10.0,
            };
          }
        }
      } catch (err) {
        console.error('Failed to get real-time Gemini recommendation, falling back to local model:', err);
      }
    }

    // High fidelity local intelligence fallback
    let message = '';
    let riskLevel: 'Low' | 'Medium' | 'High' = 'Low';
    let investmentType = 'UTT AMIS';
    let expectedReturn = 12.5;

    if (incomeAmount < 100000) {
      message = `Habari! Based on your daily income of TSh ${incomeAmount.toLocaleString()}, the best place for you to invest is in UTT AMIS (specifically the Liquid Fund or Umoja Fund). You can start with as little as TSh 10,000. It offers highly secure capital growth, operates under professional fund management, and currently yields a beautiful 12% to 14% annual return. This is an excellent low-risk way to start turning your daily profits into wealth!`;
      riskLevel = 'Low';
      investmentType = 'UTT AMIS';
      expectedReturn = 13.0;
    } else if (incomeAmount < 1000000) {
      message = `Congratulations on recording an income of TSh ${incomeAmount.toLocaleString()}! We highly recommend investing a portion of this in high-yielding dividend stocks on the Dar es Salaam Stock Exchange (DSE), such as CRDB Bank or NMB Bank, or Twiga Cement (TPCC). These companies have strong financial performance and pay regular dividends. Alternatively, UTT AMIS Wekeza Maisha provides robust compound growth with medium risk and solid 13-15% annual returns.`;
      riskLevel = 'Medium';
      investmentType = 'DSE Stocks';
      expectedReturn = 14.5;
    } else {
      message = `Incredible sales! An income of TSh ${incomeAmount.toLocaleString()} opens premium investment avenues. We highly recommend looking into long-term Government Treasury Bonds (such as the 15-year or 20-year bonds), which are 100% risk-free and offer guaranteed semi-annual interest coupon payouts at a lucrative 12% to 15.4% per annum. You could also reinvest a significant portion back into restocking your business (e.g. buying in wholesale bulk) to boost profit margins even higher!`;
      riskLevel = 'Low';
      investmentType = 'Treasury Bonds';
      expectedReturn = 15.4;
    }

    return { message, riskLevel, investmentType, expectedReturn };
  }
}

export const aiService = new AIContentService();