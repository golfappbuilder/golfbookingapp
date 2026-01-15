import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: { course: true, user: true },
    });

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(booking);
  } catch (error) {
    console.error('Error fetching booking:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const booking = await prisma.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    // If changing date/time/players, recalculate price
    let updateData = { ...body };

    if (body.numberOfPlayers || body.includeCart !== undefined) {
      const course = await prisma.course.findUnique({
        where: { id: booking.courseId },
      });

      if (course) {
        const numberOfPlayers = body.numberOfPlayers || booking.numberOfPlayers;
        const includeCart = body.includeCart !== undefined ? body.includeCart : booking.includeCart;

        const greenFeeTotal = course.greenFee * numberOfPlayers;
        const cartFeeTotal = includeCart ? course.cartFee * Math.ceil(numberOfPlayers / 2) : 0;
        updateData.totalPrice = greenFeeTotal + cartFeeTotal;
      }
    }

    if (body.playerNames && Array.isArray(body.playerNames)) {
      updateData.playerNames = JSON.stringify(body.playerNames);
    }

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: updateData,
      include: { course: true },
    });

    return NextResponse.json(updatedBooking);
  } catch (error) {
    console.error('Error updating booking:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const booking = await prisma.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Soft delete by setting status to cancelled
    const cancelledBooking = await prisma.booking.update({
      where: { id },
      data: { status: 'cancelled' },
      include: { course: true },
    });

    return NextResponse.json(cancelledBooking);
  } catch (error) {
    console.error('Error cancelling booking:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
