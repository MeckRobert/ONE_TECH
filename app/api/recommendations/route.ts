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

    const recs = await prisma.recommendation.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, data: recs });
  } catch (error: any) {
    console.error('Failed to get recommendations:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
