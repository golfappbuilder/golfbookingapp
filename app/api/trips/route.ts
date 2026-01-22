import { NextResponse } from 'next/server';
import { mockCourses, mockLodging, mockTrips } from '@/lib/mock-data';

// Parse the trip prompt to extract details
function parsePrompt(prompt: string) {
  const lowerPrompt = prompt.toLowerCase();

  // Extract group size
  let groupSize = 4; // default
  const groupMatch = lowerPrompt.match(/(\d+)\s*(guys?|people|person|buddies|friends|players?|men|women)/);
  if (groupMatch) {
    groupSize = parseInt(groupMatch[1]);
  }

  // Extract number of days/nights
  let nights = 2; // default
  const daysMatch = lowerPrompt.match(/(\d+)\s*(days?|nights?)/);
  if (daysMatch) {
    nights = parseInt(daysMatch[1]);
    // If they said "days", nights is typically days - 1, but we'll treat it the same for simplicity
  }

  // Extract number of rounds
  let rounds = nights; // default to one round per day
  const roundsMatch = lowerPrompt.match(/(\d+)\s*rounds?/);
  if (roundsMatch) {
    rounds = parseInt(roundsMatch[1]);
  }

  // Detect destination/region
  let destination = 'Cape Cod'; // default
  let region = 'Cape Cod';

  if (lowerPrompt.includes('cape cod') || lowerPrompt.includes('cape')) {
    destination = 'Cape Cod';
    region = 'Cape Cod';
  } else if (lowerPrompt.includes('maine coast') || lowerPrompt.includes('rockport')) {
    destination = 'Maine Coast';
    region = 'Maine Coast';
  } else if (lowerPrompt.includes('maine') || lowerPrompt.includes('belgrade')) {
    destination = 'Maine';
    region = 'Maine';
  } else if (lowerPrompt.includes('boston') || lowerPrompt.includes('quincy')) {
    destination = 'Boston Area';
    region = 'Boston';
  } else if (lowerPrompt.includes('plymouth') || lowerPrompt.includes('south shore')) {
    destination = 'South Shore';
    region = 'South Shore';
  }

  // Detect trip type
  let tripType = 'Golf Getaway';
  if (lowerPrompt.includes('bachelor')) {
    tripType = 'Bachelor Party';
  } else if (lowerPrompt.includes('corporate') || lowerPrompt.includes('business') || lowerPrompt.includes('company')) {
    tripType = 'Corporate Outing';
  } else if (lowerPrompt.includes('father') || lowerPrompt.includes('son') || lowerPrompt.includes('dad')) {
    tripType = 'Father-Son Trip';
  } else if (lowerPrompt.includes('family')) {
    tripType = 'Family Trip';
  } else if (lowerPrompt.includes('weekend')) {
    tripType = 'Weekend Getaway';
  }

  return {
    groupSize,
    nights,
    rounds,
    destination,
    region,
    tripType,
  };
}

// Generate itinerary based on parsed details
function generateItinerary(
  parsed: ReturnType<typeof parsePrompt>,
  courses: typeof mockCourses,
  lodging: typeof mockLodging[0] | null
) {
  const itinerary: Array<{ day: number; activities: string[] }> = [];

  for (let day = 1; day <= parsed.nights; day++) {
    const activities: string[] = [];

    if (day === 1) {
      activities.push('Check in to ' + (lodging?.name || 'your accommodation'));
      activities.push('Settle in and explore the area');
    }

    // Add golf round if we have courses and rounds remaining
    const courseIndex = (day - 1) % courses.length;
    if (courses[courseIndex] && day <= parsed.rounds + 1) {
      const course = courses[courseIndex];
      activities.push(`Golf at ${course.name} - ${course.city}, ${course.state}`);
    }

    // Add evening activities based on trip type
    if (parsed.tripType === 'Bachelor Party') {
      if (day === 1) activities.push('Welcome dinner and drinks with the crew');
      else if (day === parsed.nights) activities.push('Final night celebration');
      else activities.push('Dinner and evening activities');
    } else if (parsed.tripType === 'Corporate Outing') {
      if (day === 1) activities.push('Team dinner and networking');
      else activities.push('Group dinner');
    } else {
      activities.push('Dinner at local restaurant');
    }

    if (day === parsed.nights) {
      activities.push('Check out and head home');
    }

    itinerary.push({ day, activities });
  }

  return itinerary;
}

export async function POST(request: Request) {
  try {
    const { prompt, email } = await request.json();

    if (!prompt || prompt.trim().length < 5) {
      return NextResponse.json(
        { error: 'Please provide more details about your trip' },
        { status: 400 }
      );
    }

    // Parse the prompt
    const parsed = parsePrompt(prompt);

    // Find matching courses
    let courses = mockCourses.filter(c =>
      c.region.toLowerCase().includes(parsed.region.toLowerCase()) ||
      parsed.region.toLowerCase().includes(c.region.toLowerCase().split(' ')[0])
    );

    // If no exact match, try broader matching
    if (courses.length === 0) {
      if (parsed.region.toLowerCase().includes('maine')) {
        courses = mockCourses.filter(c => c.state === 'ME');
      } else {
        // Default to Cape Cod courses
        courses = mockCourses.filter(c => c.region === 'Cape Cod');
      }
    }

    // If still no courses, use all courses
    if (courses.length === 0) {
      courses = mockCourses.slice(0, 3);
    }

    // Limit to number of rounds needed
    courses = courses.slice(0, Math.max(parsed.rounds, 2));

    // Find matching lodging
    let lodging = mockLodging.find(l =>
      l.region.toLowerCase().includes(parsed.region.toLowerCase()) ||
      parsed.region.toLowerCase().includes(l.region.toLowerCase().split(' ')[0])
    );

    // Broader lodging match
    if (!lodging && parsed.region.toLowerCase().includes('maine')) {
      lodging = mockLodging.find(l => l.state === 'ME');
    }

    if (!lodging) {
      lodging = mockLodging[0];
    }

    // Generate itinerary
    const itinerary = generateItinerary(parsed, courses, lodging);

    // Calculate estimated costs
    const golfCost = courses.reduce((sum, c) => sum + c.greenFee + c.cartFee, 0) * parsed.groupSize;
    const lodgingCost = (lodging?.pricePerNight || 200) * (parsed.nights - 1) * Math.ceil(parsed.groupSize / 2);
    const estimatedTotal = golfCost + lodgingCost;
    const perPerson = Math.round(estimatedTotal / parsed.groupSize);

    // Create trip record
    const tripId = `trip-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const trip = {
      id: tripId,
      email: email || '',
      prompt,
      destination: parsed.destination,
      groupSize: parsed.groupSize,
      nights: parsed.nights,
      tripType: parsed.tripType,
      courses,
      lodging,
      itinerary,
      estimatedCost: {
        golf: golfCost,
        lodging: lodgingCost,
        total: estimatedTotal,
        perPerson,
      },
      createdAt: new Date(),
    };

    // Store trip (in memory)
    mockTrips.push(trip as typeof mockTrips[0]);

    return NextResponse.json(trip);
  } catch (error) {
    console.error('Trip planning error:', error);
    return NextResponse.json(
      { error: 'Failed to plan trip' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (id) {
    const trip = mockTrips.find(t => t.id === id);
    if (!trip) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
    }
    return NextResponse.json(trip);
  }

  const email = searchParams.get('email');
  if (email) {
    const trips = mockTrips.filter(t => t.email === email);
    return NextResponse.json(trips);
  }

  return NextResponse.json([]);
}
