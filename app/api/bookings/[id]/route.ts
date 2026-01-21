import { NextResponse } from 'next/server';
import { mockBookings, getCourseById } from '@/lib/mock-data';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const booking = mockBookings.find(b => b.id === id);

  if (!booking) {
    return NextResponse.json(
      { error: 'Booking not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({
    ...booking,
    course: getCourseById(booking.courseId),
  });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const bookingIndex = mockBookings.findIndex(b => b.id === id);

  if (bookingIndex === -1) {
    return NextResponse.json(
      { error: 'Booking not found' },
      { status: 404 }
    );
  }

  const booking = mockBookings[bookingIndex];
  const course = getCourseById(booking.courseId);

  // Update booking
  if (body.numberOfPlayers || body.includeCart !== undefined) {
    if (course) {
      const numberOfPlayers = body.numberOfPlayers || booking.numberOfPlayers;
      const includeCart = body.includeCart !== undefined ? body.includeCart : booking.includeCart;

      const greenFeeTotal = course.greenFee * numberOfPlayers;
      const cartFeeTotal = includeCart ? course.cartFee * Math.ceil(numberOfPlayers / 2) : 0;
      body.totalPrice = greenFeeTotal + cartFeeTotal;
    }
  }

  if (body.playerNames && Array.isArray(body.playerNames)) {
    body.playerNames = JSON.stringify(body.playerNames);
  }

  mockBookings[bookingIndex] = {
    ...booking,
    ...body,
    updatedAt: new Date(),
  };

  return NextResponse.json({
    ...mockBookings[bookingIndex],
    course,
  });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const bookingIndex = mockBookings.findIndex(b => b.id === id);

  if (bookingIndex === -1) {
    return NextResponse.json(
      { error: 'Booking not found' },
      { status: 404 }
    );
  }

  // Soft delete by setting status to cancelled
  mockBookings[bookingIndex].status = 'cancelled';
  mockBookings[bookingIndex].updatedAt = new Date();

  return NextResponse.json({
    ...mockBookings[bookingIndex],
    course: getCourseById(mockBookings[bookingIndex].courseId),
  });
}
