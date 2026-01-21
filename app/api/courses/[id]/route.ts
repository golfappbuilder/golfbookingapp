import { NextResponse } from 'next/server';
import { getCourseById } from '@/lib/mock-data';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const course = getCourseById(id);

  if (!course) {
    return NextResponse.json(
      { error: 'Course not found' },
      { status: 404 }
    );
  }

  return NextResponse.json(course);
}
