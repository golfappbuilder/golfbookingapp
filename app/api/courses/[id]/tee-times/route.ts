import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function generateTeeTimes(
  openTime: string,
  closeTime: string,
  interval: number,
  maxPlayers: number,
  greenFee: number,
  existingBookings: { teeTime: string; numberOfPlayers: number }[]
): { time: string; available: boolean; availableSlots: number; price: number }[] {
  const teeTimes: { time: string; available: boolean; availableSlots: number; price: number }[] = [];

  const [openHour, openMin] = openTime.split(':').map(Number);
  const [closeHour, closeMin] = closeTime.split(':').map(Number);

  let currentHour = openHour;
  let currentMin = openMin;

  const closeMinutes = closeHour * 60 + closeMin;

  while (currentHour * 60 + currentMin < closeMinutes - 60) {
    const timeStr = `${currentHour.toString().padStart(2, '0')}:${currentMin.toString().padStart(2, '0')}`;

    // Check existing bookings for this time
    const bookingsAtTime = existingBookings.filter(b => b.teeTime === timeStr);
    const bookedSlots = bookingsAtTime.reduce((sum, b) => sum + b.numberOfPlayers, 0);
    const availableSlots = maxPlayers - bookedSlots;

    teeTimes.push({
      time: timeStr,
      available: availableSlots > 0,
      availableSlots,
      price: greenFee,
    });

    currentMin += interval;
    if (currentMin >= 60) {
      currentHour += Math.floor(currentMin / 60);
      currentMin = currentMin % 60;
    }
  }

  return teeTimes;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    if (!date) {
      return NextResponse.json(
        { error: 'Date parameter is required' },
        { status: 400 }
      );
    }

    const course = await prisma.course.findUnique({
      where: { id },
    });

    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    // Get existing bookings for this date
    const existingBookings = await prisma.booking.findMany({
      where: {
        courseId: id,
        date: date,
        status: { not: 'cancelled' },
      },
      select: {
        teeTime: true,
        numberOfPlayers: true,
      },
    });

    const teeTimes = generateTeeTimes(
      course.openTime,
      course.closeTime,
      course.teeTimeInterval,
      course.maxPlayersPerGroup,
      course.greenFee,
      existingBookings
    );

    return NextResponse.json(teeTimes);
  } catch (error) {
    console.error('Error fetching tee times:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
