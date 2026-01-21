import { NextResponse } from 'next/server';
import { mockUser } from '@/lib/mock-data';

export async function POST(request: Request) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json(
      { error: 'Email and password are required' },
      { status: 400 }
    );
  }

  // Demo login - accept demo credentials or any email/password combo
  if (email === 'demo@golfbooking.com' && password === 'demo123') {
    return NextResponse.json({ user: mockUser });
  }

  // For demo purposes, allow any login and create a mock user
  const demoUser = {
    ...mockUser,
    id: 'user-' + Math.random().toString(36).substring(2, 8),
    email: email,
    firstName: email.split('@')[0],
  };

  return NextResponse.json({ user: demoUser });
}
