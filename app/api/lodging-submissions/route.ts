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
      region,
      lodgingType,
      sleeps,
      linkUrl,
      tips,
      nearbyCourses,
      recommend,
      canFeature,
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
      region: region || 'Other',
      lodgingType: lodgingType || 'other',
      sleeps: parseInt(sleeps) || 4,
      linkUrl: linkUrl || '',
      tips: tips || '',
      nearbyCourses: nearbyCourses || [],
      recommend: recommend === true || recommend === 'yes',
      canFeature: canFeature === true,
      createdAt: new Date(),
    };

    lodgingSubmissions.push(submission);

    return NextResponse.json({ success: true, id: submission.id });
  } catch (error) {
    console.error('Lodging submission error:', error);
    return NextResponse.json({ error: 'Failed to submit lodging' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  let results = lodgingSubmissions.filter(s => s.canFeature);

  // Filter by region
  const region = searchParams.get('region');
  if (region && region !== 'all') {
    results = results.filter(s => s.region === region);
  }

  // Filter by group size
  const groupSize = searchParams.get('groupSize');
  if (groupSize) {
    if (groupSize === '4-8') {
      results = results.filter(s => s.sleeps >= 4 && s.sleeps <= 8);
    } else if (groupSize === '8-12') {
      results = results.filter(s => s.sleeps > 8 && s.sleeps <= 12);
    } else if (groupSize === '12+') {
      results = results.filter(s => s.sleeps > 12);
    }
  }

  // Filter by type
  const type = searchParams.get('type');
  if (type && type !== 'all') {
    results = results.filter(s => s.lodgingType === type);
  }

  // Only show recommended lodging
  const recommendedOnly = searchParams.get('recommended');
  if (recommendedOnly === 'true') {
    results = results.filter(s => s.recommend);
  }

  return NextResponse.json(results);
}
