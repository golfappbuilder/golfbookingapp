import { NextResponse } from 'next/server';
import { mockBookings, getCourseById } from '@/lib/mock-data';

function generateConfirmationNumber(): string {
  return 'GOLF-' + Math.random().toString(36).substring(2, 8).toUpperCase();
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json(
      { error: 'userId parameter is required' },
      { status: 400 }
    );
  }

  const userBookings = mockBookings
    .filter(b => b.userId === userId)
    .map(b => ({
      ...b,
      course: getCourseById(b.courseId),
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return NextResponse.json(userBookings);
}

export async function POST(request: Request) {
  const body = await request.json();
  const {
    courseId,
    userId,
    date,
    teeTime,
    numberOfPlayers,
    playerNames = [],
    includeCart = false,
    notes,
  } = body;

  if (!courseId || !userId || !date || !teeTime || !numberOfPlayers) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    );
  }

  const course = getCourseById(courseId);

  if (!course) {
    return NextResponse.json(
      { error: 'Course not found' },
      { status: 404 }
    );
  }

  // Calculate total price
  const greenFeeTotal = course.greenFee * numberOfPlayers;
  const cartFeeTotal = includeCart ? course.cartFee * Math.ceil(numberOfPlayers / 2) : 0;
  const totalPrice = greenFeeTotal + cartFeeTotal;

  // Create booking
  const booking = {
    id: 'booking-' + Math.random().toString(36).substring(2, 10),
    courseId,
    userId,
    date,
    teeTime,
    numberOfPlayers,
    playerNames: JSON.stringify(playerNames),
    includeCart,
    totalPrice,
    status: 'confirmed',
    confirmationNumber: generateConfirmationNumber(),
    notes: notes || null,
    emailNotificationSent: false,
    reminderSent: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    course,
  };

  mockBookings.push(booking);

  return NextResponse.json(booking, { status: 201 });
}
