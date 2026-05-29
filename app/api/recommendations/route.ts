import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const phone = searchParams.get('phone');

    if (!phone) {
      return NextResponse.json({ success: false, error: 'Phone number is required' }, { status: 400 });
    }

    // Check if database is available
    if (!prisma) {
      // Return mock recommendations when offline
      const mockRecommendations = [
        {
          id: '1',
          title: 'Track Your Daily Expenses',
          message: 'Regular expense tracking helps you understand your spending patterns. Try to record every transaction to build a strong financial profile.',
          riskLevel: 'low',
          aiScore: 85,
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          title: 'Investment Opportunity: Agriculture',
          message: 'Agriculture investments in Tanzania are showing strong growth. Consider allocating 10-15% of your profits to this sector for diversification.',
          riskLevel: 'medium',
          aiScore: 92,
          createdAt: new Date().toISOString()
        },
        {
          id: '3',
          title: 'Business Growth Insight',
          message: 'Your sales have been consistent. To grow further, consider expanding your product line or reaching new customers through our marketplace.',
          riskLevel: 'low',
          aiScore: 78,
          createdAt: new Date().toISOString()
        }
      ];
      
      return NextResponse.json({ 
        success: true, 
        offline: true,
        data: mockRecommendations 
      });
    }

    const user = await prisma.user.findFirst({
      where: { phone: phone }
    });

    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found in database' }, { status: 404 });
    }

    const recs = await prisma.recommendation.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 20
    });

    return NextResponse.json({ success: true, data: recs });
  } catch (error: any) {
    console.error('Failed to get recommendations:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Failed to fetch recommendations' 
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phone, title, message, riskLevel, aiScore } = body;

    if (!phone || !message) {
      return NextResponse.json({ 
        success: false, 
        error: 'Phone and message are required' 
      }, { status: 400 });
    }

    // Check if database is available
    if (!prisma) {
      const mockRecommendation = {
        id: Date.now().toString(),
        title: title || 'AI Suggestion',
        message,
        riskLevel: riskLevel || 'medium',
        aiScore: aiScore || 85,
        createdAt: new Date().toISOString(),
        offline: true
      };
      
      return NextResponse.json({ 
        success: true, 
        offline: true,
        data: mockRecommendation 
      });
    }

    const user = await prisma.user.findFirst({
      where: { phone: phone }
    });

    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    const recommendation = await prisma.recommendation.create({
      data: {
        title: title || 'AI Investment Suggestion',
        message,
        riskLevel: riskLevel || 'medium',
        aiScore: aiScore || null,
        userId: user.id
      }
    });

    return NextResponse.json({ success: true, data: recommendation });
  } catch (error: any) {
    console.error('Failed to create recommendation:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Failed to create recommendation' 
    }, { status: 500 });
  }
}