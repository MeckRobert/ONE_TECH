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
      // Return mock investment data when offline
      const mockInvestments = [
        {
          id: '1',
          investmentType: 'Stocks & Equities',
          amount: 50000,
          expectedReturn: 15,
          riskLevel: 'Medium-High',
          startDate: new Date().toISOString(),
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          investmentType: 'Real Estate',
          amount: 500000,
          expectedReturn: 12,
          riskLevel: 'Medium',
          startDate: new Date().toISOString(),
          createdAt: new Date().toISOString()
        }
      ];
      
      return NextResponse.json({ 
        success: true, 
        offline: true,
        data: mockInvestments 
      });
    }

    const user = await prisma.user.findFirst({
      where: { phone: phone }
    });

    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found in database' }, { status: 404 });
    }

    const investments = await prisma.investment.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, data: investments });
  } catch (error: any) {
    console.error('Failed to get investments:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Failed to fetch investments' 
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phone, investmentType, amount, expectedReturn, riskLevel, startDate } = body;

    if (!phone || !investmentType || !amount) {
      return NextResponse.json({ 
        success: false, 
        error: 'Phone, investmentType, and amount are required' 
      }, { status: 400 });
    }

    // Check if database is available
    if (!prisma) {
      // Return mock success when offline
      const mockInvestment = {
        id: Date.now().toString(),
        investmentType,
        amount: parseFloat(amount),
        expectedReturn: expectedReturn ? parseFloat(expectedReturn) : null,
        riskLevel: riskLevel || 'Medium',
        startDate: startDate ? new Date(startDate) : new Date(),
        userId: phone,
        createdAt: new Date().toISOString(),
        offline: true
      };
      
      return NextResponse.json({ 
        success: true, 
        offline: true,
        data: mockInvestment 
      });
    }

    const user = await prisma.user.findFirst({
      where: { phone: phone }
    });

    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    // Create investment matching your schema
    const investment = await prisma.investment.create({
      data: {
        investmentType,
        amount: parseFloat(amount),
        expectedReturn: expectedReturn ? parseFloat(expectedReturn) : null,
        riskLevel: riskLevel || 'Medium',
        startDate: startDate ? new Date(startDate) : new Date(),
        userId: user.id,
      }
    });

    return NextResponse.json({ success: true, data: investment });
  } catch (error: any) {
    console.error('Failed to record investment:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Failed to record investment' 
    }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, endDate, expectedReturn, riskLevel } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Investment ID is required' }, { status: 400 });
    }

    if (!prisma) {
      return NextResponse.json({ 
        success: true, 
        offline: true,
        data: { id, endDate, expectedReturn, riskLevel, updatedAt: new Date().toISOString() }
      });
    }

    const investment = await prisma.investment.update({
      where: { id: parseInt(id) },
      data: {
        endDate: endDate ? new Date(endDate) : undefined,
        expectedReturn: expectedReturn ? parseFloat(expectedReturn) : undefined,
        riskLevel: riskLevel,
      }
    });

    return NextResponse.json({ success: true, data: investment });
  } catch (error: any) {
    console.error('Failed to update investment:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Failed to update investment' 
    }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Investment ID is required' }, { status: 400 });
    }

    if (!prisma) {
      return NextResponse.json({ success: true, offline: true });
    }

    await prisma.investment.delete({
      where: { id: parseInt(id) }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Failed to delete investment:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Failed to delete investment' 
    }, { status: 500 });
  }
}