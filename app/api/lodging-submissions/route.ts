import { NextResponse } from 'next/server';
import { lodgingSubmissions } from '@/lib/mock-data';

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const {
      email,
      lodgingName,
      city,
      state,
      lodgingType,
      sleeps,
      pricePerNight,
      recommend,
      tips,
      nearbyCourses,
    } = data;

    // Validation
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }
    if (!lodgingName || !city || !state) {
      return NextResponse.json({ error: 'Lodging name, city, and state are required' }, { status: 400 });
    }

    const submission = {
      id: `lodging-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      email,
      lodgingName,
      city,
      state,
      lodgingType: lodgingType || 'other',
      sleeps: parseInt(sleeps) || 4,
      pricePerNight: pricePerNight || 'Not specified',
      recommend: recommend || 'maybe',
      tips: tips || '',
      nearbyCourses: nearbyCourses || [],
      createdAt: new Date(),
    };

    lodgingSubmissions.push(submission);

    return NextResponse.json({ success: true, id: submission.id });
  } catch (error) {
    console.error('Lodging submission error:', error);
    return NextResponse.json({ error: 'Failed to submit lodging' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json(lodgingSubmissions);
}
