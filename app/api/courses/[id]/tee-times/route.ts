import { NextResponse } from 'next/server';
import { getCourseById, generateTeeTimes } from '@/lib/mock-data';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date');

  if (!date) {
    return NextResponse.json(
      { error: 'Date parameter is required' },
      { status: 400 }
    );
  }

  const course = getCourseById(id);

  if (!course) {
    return NextResponse.json(
      { error: 'Course not found' },
      { status: 404 }
    );
  }

  const teeTimes = generateTeeTimes(course, date);
  return NextResponse.json(teeTimes);
}
