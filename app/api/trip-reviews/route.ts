import { NextResponse } from 'next/server';
import { tripReviews } from '@/lib/mock-data';

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const {
      email,
      destination,
      tripDate,
      groupSize,
      overallRating,
      wouldBookAgain,
      whatWorked,
      whatDidntWork,
      suggestedCourses,
      coursesPlayed,
      lodgingUsed,
    } = data;

    // Validation
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email is required for giveaway entry' }, { status: 400 });
    }
    if (!destination) {
      return NextResponse.json({ error: 'Destination is required' }, { status: 400 });
    }
    if (!overallRating || overallRating < 1 || overallRating > 5) {
      return NextResponse.json({ error: 'Overall rating (1-5) is required' }, { status: 400 });
    }

    const review = {
      id: `review-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      email,
      destination,
      tripDate: tripDate || '',
      groupSize: parseInt(groupSize) || 4,
      overallRating: parseInt(overallRating),
      wouldBookAgain: wouldBookAgain || 'yes',
      whatWorked: whatWorked || '',
      whatDidntWork: whatDidntWork || '',
      suggestedCourses: suggestedCourses || '',
      coursesPlayed: coursesPlayed || [],
      lodgingUsed: lodgingUsed || '',
      createdAt: new Date(),
    };

    tripReviews.push(review);

    return NextResponse.json({ success: true, id: review.id });
  } catch (error) {
    console.error('Trip review submission error:', error);
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json(tripReviews);
}
