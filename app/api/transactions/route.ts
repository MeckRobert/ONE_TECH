import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';
import { aiService } from '../../../lib/aiService';
import { TransactionType } from '@prisma/client';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const phone = searchParams.get('phone');

    if (!phone) {
      return NextResponse.json({ success: false, error: 'Phone number is required' }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: { phone: phone }
    });

    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found in database' }, { status: 404 });
    }

    const txs = await prisma.transaction.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, data: txs });
  } catch (error: any) {
    console.error('Failed to get transactions:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phone, type, amount, description, date } = body;

    if (!phone || !type || !amount) {
      return NextResponse.json({ success: false, error: 'Phone, type, and amount are required' }, { status: 400 });
    }

    // 1. Get user from DB
    const user = await prisma.user.findFirst({
      where: { phone: phone }
    });

    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    // 2. Map type to TransactionType enum
    let dbType: TransactionType = TransactionType.INCOME;
    if (type === 'expense') {
      dbType = TransactionType.EXPENSE;
    } else if (type === 'saving') {
      dbType = TransactionType.SAVING;
    } else if (type === 'investment') {
      dbType = TransactionType.INVESTMENT;
    }

    // 3. Save transaction to database
    const transaction = await prisma.transaction.create({
      data: {
        amount: parseFloat(amount),
        type: dbType,
        category: type === 'expense' ? 'Expense' : 'Sale',
        description: description || 'No description',
        userId: user.id,
        createdAt: date ? new Date(date) : new Date(),
      }
    });

    // 4. Trigger AI Investment Recommendation if it's an INCOME/SALE transaction!
    let recommendation = null;
    if (dbType === TransactionType.INCOME) {
      // Get recent transactions to build context for AI
      const recentTxs = await prisma.transaction.findMany({
        where: { userId: user.id },
        take: 5,
        orderBy: { createdAt: 'desc' }
      });

      // Generate recommendation
      const aiRec = await aiService.generateInvestmentRecommendation(
        phone,
        parseFloat(amount),
        description || '',
        recentTxs
      );

      // Save recommendation to database
      recommendation = await prisma.recommendation.create({
        data: {
          message: aiRec.message,
          riskLevel: aiRec.riskLevel,
          userId: user.id,
        }
      });
    }

    return NextResponse.json({
      success: true,
      transaction,
      recommendation
    });
  } catch (error: any) {
    console.error('Failed to log transaction:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
