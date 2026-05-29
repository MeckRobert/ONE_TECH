import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';
import { TransactionType, TransactionStatus } from '@prisma/client';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const phone = searchParams.get('phone');
    const walletId = searchParams.get('walletId');

    if (!phone) {
      return NextResponse.json({ success: false, error: 'Phone number is required' }, { status: 400 });
    }

    if (!prisma) {
      const mockTransactions = [
        {
          id: '1',
          amount: 150000,
          type: 'INCOME',
          category: 'Sale',
          description: 'Product sales - Electronics',
          status: 'COMPLETED',
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          amount: 50000,
          type: 'EXPENSE',
          category: 'Expense',
          description: 'Restocking inventory',
          status: 'COMPLETED',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];
      
      return NextResponse.json({ success: true, offline: true, data: mockTransactions });
    }

    const user = await prisma.user.findFirst({
      where: { phone: phone }
    });

    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    const whereClause: any = { userId: user.id };
    if (walletId) {
      whereClause.walletId = parseInt(walletId);
    }

    const transactions = await prisma.transaction.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      take: 50
    });

    return NextResponse.json({ success: true, data: transactions });
  } catch (error: any) {
    console.error('Failed to get transactions:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phone, type, amount, category, description, walletId, status } = body;

    if (!phone || !type || !amount) {
      return NextResponse.json({ 
        success: false, 
        error: 'Phone, type, and amount are required' 
      }, { status: 400 });
    }

    if (!prisma) {
      const mockTransaction = {
        id: Date.now().toString(),
        amount: parseFloat(amount),
        type: type.toUpperCase(),
        category: category || 'General',
        description: description || 'No description',
        status: 'COMPLETED',
        createdAt: new Date().toISOString(),
        offline: true
      };
      
      return NextResponse.json({ success: true, offline: true, transaction: mockTransaction });
    }

    const user = await prisma.user.findFirst({
      where: { phone: phone }
    });

    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    // Map transaction type
    let dbType: TransactionType = TransactionType.INCOME;
    switch (type.toLowerCase()) {
      case 'expense':
        dbType = TransactionType.EXPENSE;
        break;
      case 'saving':
        dbType = TransactionType.SAVING;
        break;
      case 'investment':
        dbType = TransactionType.INVESTMENT;
        break;
      case 'transfer':
        dbType = TransactionType.TRANSFER;
        break;
      default:
        dbType = TransactionType.INCOME;
    }

    const dbStatus = status === 'pending' ? TransactionStatus.PENDING : TransactionStatus.COMPLETED;

    const transaction = await prisma.transaction.create({
      data: {
        amount: parseFloat(amount),
        type: dbType,
        category: category || 'General',
        description: description || 'No description',
        status: dbStatus,
        userId: user.id,
        walletId: walletId ? parseInt(walletId) : null,
      }
    });

    // If it's a wallet transaction, update wallet balance
    if (walletId) {
      const wallet = await prisma.wallet.findFirst({
        where: { id: parseInt(walletId), userId: user.id }
      });
      
      if (wallet) {
        const balanceChange = dbType === TransactionType.INCOME ? parseFloat(amount) : -parseFloat(amount);
        await prisma.wallet.update({
          where: { id: wallet.id },
          data: { balance: wallet.balance + balanceChange }
        });
      }
    }

    return NextResponse.json({ success: true, transaction });
  } catch (error: any) {
    console.error('Failed to create transaction:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}