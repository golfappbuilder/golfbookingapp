import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { email, password, firstName, lastName, phone } = await request.json();

  if (!email || !password || !firstName || !lastName) {
    return NextResponse.json(
      { error: 'Email, password, first name, and last name are required' },
      { status: 400 }
    );
  }

  // For demo purposes, create a mock user
  const user = {
    id: 'user-' + Math.random().toString(36).substring(2, 8),
    email,
    firstName,
    lastName,
    phone: phone || null,
    handicap: null,
    membershipType: 'guest',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return NextResponse.json({ user }, { status: 201 });
}
