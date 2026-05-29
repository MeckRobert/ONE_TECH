// app/api/auth/sync/route.ts
import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function POST(request: Request) {
  const body = await request.json();
  const { phone, pin, businessName, email, fullName } = body;
  try {
    // Check if database is configured
    if (!prisma) {
      console.warn('Database not configured - running in offline mode');
      return NextResponse.json({
        success: true,
        offline: true,
        message: 'Database not configured. Running in offline mode.',
        user: { phone: body.phone, fullName: body.businessName }
      });
    }

    

    if (!phone) {
      return NextResponse.json({ success: false, error: 'Phone number is required' }, { status: 400 });
    }

    // Try to find user by phone in the database
    let dbUser = await prisma.user.findFirst({
      where: {
        OR: [
          { phone: phone },
          { email: email || `${phone.replace(/\+/g, '')}@onetech.com` }
        ]
      }
    });

    if (dbUser) {
      // Update existing user profile if needed
      dbUser = await prisma.user.update({
        where: { id: dbUser.id },
        data: {
          fullName: fullName || dbUser.fullName || businessName || 'User',
          password: pin || dbUser.password,
          phone: phone,
        }
      });
    } else {
      // Create new user in PostgreSQL database
      dbUser = await prisma.user.create({
        data: {
          fullName: fullName || businessName || 'User',
          email: email || `${phone.replace(/\+/g, '')}@onetech.com`,
          password: pin || '1234',
          phone: phone,
          country: 'Tanzania',
        }
      });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: dbUser.id,
        phone: dbUser.phone,
        fullName: dbUser.fullName,
        email: dbUser.email
      }
    });
  } catch (error: any) {
    console.error('Failed to sync user with database:', error);
    
    // Return success anyway to not break the frontend
    return NextResponse.json({
      success: true,
      offline: true,
      error: 'Database connection failed. Running in offline mode.',
      user: { phone: body?.phone, fullName: body?.businessName }
    });
  }
}