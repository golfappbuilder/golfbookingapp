import { NextResponse } from 'next/server';
import { mockBookings, getCourseById } from '@/lib/mock-data';

function generateConfirmationNumber(): string {
  return 'GOLF-' + Math.random().toString(36).substring(2, 8).toUpperCase();
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json(
      { error: 'email parameter is required' },
      { status: 400 }
    );
  }

  const userBookings = mockBookings
    .filter(b => b.email?.toLowerCase() === email.toLowerCase())
    .map(b => ({
      ...b,
      course: getCourseById(b.courseId),
    }))
    .sort((a, b) => b.date.localeCompare(a.date));

  return NextResponse.json(userBookings);
}

export async function POST(request: Request) {
  const body = await request.json();
  const {
    courseId,
    email,
    date,
    teeTime,
    numberOfPlayers,
    playerNames = [],
    includeCart = false,
    notes,
  } = body;

  if (!courseId || !email || !date || !teeTime || !numberOfPlayers) {
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
    email,
    date,
    teeTime,
    numberOfPlayers,
    playerNames: JSON.stringify(playerNames),
    includeCart,
    totalPrice,
    status: 'confirmed',
    confirmationNumber: generateConfirmationNumber(),
    notes: notes || null,
    createdAt: new Date(),
    updatedAt: new Date(),
    course,
  };

  mockBookings.push(booking);

  return NextResponse.json(booking, { status: 201 });
}
