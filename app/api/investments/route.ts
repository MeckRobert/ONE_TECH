import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

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

    const investments = await prisma.investment.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, data: investments });
  } catch (error: any) {
    console.error('Failed to get investments:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phone, investmentType, amount, expectedReturn } = body;

    if (!phone || !investmentType || !amount) {
      return NextResponse.json({ success: false, error: 'Phone, investmentType, and amount are required' }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: { phone: phone }
    });

    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    const investment = await prisma.investment.create({
      data: {
        investmentType,
        amount: parseFloat(amount),
        expectedReturn: expectedReturn ? parseFloat(expectedReturn) : null,
        userId: user.id,
      }
    });

    return NextResponse.json({ success: true, data: investment });
  } catch (error: any) {
    console.error('Failed to record investment:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
