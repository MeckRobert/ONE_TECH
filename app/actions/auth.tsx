'use server';

import { z } from 'zod';

const emailSchema = z.string().email('Invalid email format');

export async function sendResetLink(email: string) {
  // Validate email format
  const validation = emailSchema.safeParse(email);
  if (!validation.success) {
    return {
      success: false,
      message: 'Please enter a valid email address',
    };
  }

  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));

  // In production, you would:
  // 1. Check if email exists in your database
  // 2. Generate a secure password reset token
  // 3. Store token with expiration in database
  // 4. Send email with reset link
  
  // Example of checking against your database:
  // const user = await db.user.findUnique({ where: { email } });
  // if (!user) {
  //   // For security, don't reveal if email exists
  //   return { success: true, message: 'If an account exists, you will receive a reset link' };
  // }
  
  // Generate reset token
  // const token = crypto.randomBytes(32).toString('hex');
  // const expires = new Date(Date.now() + 3600000); // 1 hour
  // await db.passwordReset.create({ data: { email, token, expires } });
  
  // Send email (using Resend, Nodemailer, etc.)
  // await sendResetEmail(email, token);

  // For demo purposes, always return success for valid emails
  return {
    success: true,
    message: `We've sent a password reset link to ${email}. Check your inbox (and spam folder).`,
  };
}