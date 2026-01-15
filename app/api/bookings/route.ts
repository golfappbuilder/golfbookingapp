import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function generateConfirmationNumber(): string {
  return 'GOLF-' + Math.random().toString(36).substring(2, 8).toUpperCase();
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId parameter is required' },
        { status: 400 }
      );
    }

    const bookings = await prisma.booking.findMany({
      where: { userId },
      include: { course: true },
      orderBy: { date: 'asc' },
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
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

    // Get course to calculate price
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    // Check availability
    const existingBookings = await prisma.booking.findMany({
      where: {
        courseId,
        date,
        teeTime,
        status: { not: 'cancelled' },
      },
    });

    const bookedSlots = existingBookings.reduce((sum, b) => sum + b.numberOfPlayers, 0);
    const availableSlots = course.maxPlayersPerGroup - bookedSlots;

    if (numberOfPlayers > availableSlots) {
      return NextResponse.json(
        { error: `Only ${availableSlots} slots available at this time` },
        { status: 400 }
      );
    }

    // Calculate total price
    const greenFeeTotal = course.greenFee * numberOfPlayers;
    const cartFeeTotal = includeCart ? course.cartFee * Math.ceil(numberOfPlayers / 2) : 0;
    const totalPrice = greenFeeTotal + cartFeeTotal;

    // Create booking
    const booking = await prisma.booking.create({
      data: {
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
        notes,
      },
      include: { course: true },
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
