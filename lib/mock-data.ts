// Mock data for Vercel deployment (no database required)

export const mockCourses = [
  {
    id: 'course-1',
    name: 'Cape Cod National Golf Club',
    description: 'A stunning links-style course carved through pine forests with ocean breezes and challenging greens. One of Cape Cod\'s premier golf destinations.',
    address: '99 Crowell Road',
    city: 'Brewster',
    state: 'MA',
    zipCode: '02631',
    phone: '(508) 240-6655',
    email: 'info@capecodgolf.com',
    holes: 18,
    par: 72,
    yardage: 6900,
    greenFee: 85,
    cartFee: 25,
    openTime: '06:00',
    closeTime: '19:00',
    teeTimeInterval: 10,
    maxPlayersPerGroup: 4,
    amenities: JSON.stringify(['Pro Shop', 'Restaurant', 'Driving Range', 'Practice Green', 'Club Rentals']),
    imageUrl: 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=800',
    rating: 4.8,
    region: 'Cape Cod',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'course-2',
    name: 'Cranberry Valley Golf Course',
    description: 'A scenic municipal course winding through cranberry bogs and pine forests. Excellent value with championship-quality conditions.',
    address: '183 Oak Street',
    city: 'Harwich',
    state: 'MA',
    zipCode: '02645',
    phone: '(508) 430-5234',
    email: 'teetimes@cranberryvalley.com',
    holes: 18,
    par: 72,
    yardage: 6745,
    greenFee: 65,
    cartFee: 20,
    openTime: '06:30',
    closeTime: '18:30',
    teeTimeInterval: 10,
    maxPlayersPerGroup: 4,
    amenities: JSON.stringify(['Pro Shop', 'Grill', 'Practice Facility', 'Club Rentals']),
    imageUrl: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800',
    rating: 4.6,
    region: 'Cape Cod',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'course-3',
    name: 'Samoset Resort Golf Club',
    description: 'A spectacular oceanfront course overlooking Penobscot Bay. Seven holes directly on the water with dramatic Maine coastline views.',
    address: '220 Warrenton Street',
    city: 'Rockport',
    state: 'ME',
    zipCode: '04856',
    phone: '(207) 594-1431',
    email: 'golf@samosetresort.com',
    holes: 18,
    par: 70,
    yardage: 6500,
    greenFee: 95,
    cartFee: 30,
    openTime: '07:00',
    closeTime: '18:00',
    teeTimeInterval: 10,
    maxPlayersPerGroup: 4,
    amenities: JSON.stringify(['Pro Shop', 'Fine Dining', 'Resort Lodging', 'Spa', 'Ocean Views']),
    imageUrl: 'https://images.unsplash.com/photo-1592919505780-303950717480?w=800',
    rating: 4.9,
    region: 'Maine Coast',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'course-4',
    name: 'Belgrade Lakes Golf Club',
    description: 'A Clive Clark design featuring dramatic elevation changes and pristine Maine wilderness. Ranked among Maine\'s best.',
    address: '46 Clubhouse Drive',
    city: 'Belgrade Lakes',
    state: 'ME',
    zipCode: '04918',
    phone: '(207) 495-4653',
    email: 'info@belgradelakesgolf.com',
    holes: 18,
    par: 71,
    yardage: 6723,
    greenFee: 79,
    cartFee: 22,
    openTime: '06:30',
    closeTime: '19:00',
    teeTimeInterval: 10,
    maxPlayersPerGroup: 4,
    amenities: JSON.stringify(['Pro Shop', 'Restaurant', 'Driving Range', 'Practice Green', 'Lodging Nearby']),
    imageUrl: 'https://images.unsplash.com/photo-1600005082673-7a5ac0f1b9eb?w=800',
    rating: 4.7,
    region: 'Maine Lakes',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'course-5',
    name: 'Granite Links Golf Club',
    description: 'Built on former quarries with stunning Boston skyline views. A unique links experience just minutes from downtown.',
    address: '100 Quarry Hills Drive',
    city: 'Quincy',
    state: 'MA',
    zipCode: '02171',
    phone: '(617) 689-1900',
    email: 'teetimes@granitelinks.com',
    holes: 27,
    par: 72,
    yardage: 7100,
    greenFee: 110,
    cartFee: 28,
    openTime: '06:00',
    closeTime: '20:00',
    teeTimeInterval: 8,
    maxPlayersPerGroup: 4,
    amenities: JSON.stringify(['Pro Shop', 'Upscale Restaurant', 'Driving Range', 'Boston Skyline Views', 'Event Space']),
    imageUrl: 'https://images.unsplash.com/photo-1611374243147-44a702c2d44c?w=800',
    rating: 4.5,
    region: 'Boston Area',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'course-6',
    name: 'Pinehills Golf Club',
    description: 'Two championship courses - Nicklaus and Jones designs - in the scenic Plymouth pine barrens. A must-play destination.',
    address: '54 Clubhouse Drive',
    city: 'Plymouth',
    state: 'MA',
    zipCode: '02360',
    phone: '(508) 209-3000',
    email: 'golf@pinehillsgolf.com',
    holes: 36,
    par: 72,
    yardage: 7175,
    greenFee: 99,
    cartFee: 25,
    openTime: '06:00',
    closeTime: '19:00',
    teeTimeInterval: 10,
    maxPlayersPerGroup: 4,
    amenities: JSON.stringify(['Pro Shop', 'Tavern Restaurant', 'Two Championship Courses', 'Practice Facility', 'Golf Academy']),
    imageUrl: 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=800',
    rating: 4.8,
    region: 'South Shore',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Mock lodging data for trip planning
export const mockLodging = [
  {
    id: 'lodge-1',
    name: 'Ocean Edge Resort',
    city: 'Brewster',
    state: 'MA',
    region: 'Cape Cod',
    pricePerNight: 229,
    amenities: ['Pool', 'Beach Access', 'Restaurant', 'Golf Packages'],
    rating: 4.6,
  },
  {
    id: 'lodge-2',
    name: 'Chatham Bars Inn',
    city: 'Chatham',
    state: 'MA',
    region: 'Cape Cod',
    pricePerNight: 399,
    amenities: ['Oceanfront', 'Spa', 'Fine Dining', 'Beach Club'],
    rating: 4.9,
  },
  {
    id: 'lodge-3',
    name: 'Samoset Resort',
    city: 'Rockport',
    state: 'ME',
    region: 'Maine Coast',
    pricePerNight: 279,
    amenities: ['On-site Golf', 'Ocean Views', 'Spa', 'Pool'],
    rating: 4.7,
  },
  {
    id: 'lodge-4',
    name: 'Belgrade Lakes Lodge',
    city: 'Belgrade Lakes',
    state: 'ME',
    region: 'Maine Lakes',
    pricePerNight: 159,
    amenities: ['Lake Access', 'Restaurant', 'Fishing', 'Kayaks'],
    rating: 4.4,
  },
  {
    id: 'lodge-5',
    name: 'Boston Marriott Quincy',
    city: 'Quincy',
    state: 'MA',
    region: 'Boston Area',
    pricePerNight: 189,
    amenities: ['Pool', 'Fitness Center', 'Restaurant', 'City Access'],
    rating: 4.3,
  },
  {
    id: 'lodge-6',
    name: 'Hotel 1620 Plymouth',
    city: 'Plymouth',
    state: 'MA',
    region: 'South Shore',
    pricePerNight: 169,
    amenities: ['Waterfront', 'Restaurant', 'Historic District', 'Pool'],
    rating: 4.2,
  },
];

// In-memory bookings store (resets on each deploy, but works for demo)
export const mockBookings: Array<{
  id: string;
  courseId: string;
  email: string;
  date: string;
  teeTime: string;
  numberOfPlayers: number;
  playerNames: string;
  includeCart: boolean;
  totalPrice: number;
  status: string;
  confirmationNumber: string;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  course?: typeof mockCourses[0];
}> = [];

// In-memory trips store
export const mockTrips: Array<{
  id: string;
  email: string;
  prompt: string;
  destination: string;
  groupSize: number;
  nights: number;
  tripType: string;
  courses: typeof mockCourses;
  lodging: typeof mockLodging[0] | null;
  itinerary: Array<{ day: number; activities: string[] }>;
  createdAt: Date;
}> = [];

// User-submitted lodging recommendations
export const lodgingSubmissions: Array<{
  id: string;
  email: string;
  lodgingName: string;
  city: string;
  state: string;
  lodgingType: 'airbnb' | 'vrbo' | 'hotel' | 'house_rental' | 'other';
  sleeps: number;
  pricePerNight: string;
  recommend: 'yes' | 'no' | 'maybe';
  tips: string;
  nearbyCourses: string[];
  createdAt: Date;
}> = [];

// User-submitted trip reviews (giveaway entries)
export const tripReviews: Array<{
  id: string;
  email: string;
  destination: string;
  tripDate: string;
  groupSize: number;
  overallRating: number;
  wouldBookAgain: 'yes' | 'no';
  whatWorked: string;
  whatDidntWork: string;
  suggestedCourses: string;
  coursesPlayed: string[];
  lodgingUsed: string;
  createdAt: Date;
}> = [];

export function getCourseById(id: string) {
  return mockCourses.find(c => c.id === id);
}

export function getCoursesByRegion(region: string) {
  return mockCourses.filter(c => c.region.toLowerCase().includes(region.toLowerCase()));
}

export function getLodgingByRegion(region: string) {
  return mockLodging.filter(l => l.region.toLowerCase().includes(region.toLowerCase()));
}

export function generateTeeTimes(course: typeof mockCourses[0], date: string) {
  const teeTimes = [];
  const [openHour, openMin] = course.openTime.split(':').map(Number);
  const [closeHour, closeMin] = course.closeTime.split(':').map(Number);

  let currentHour = openHour;
  let currentMin = openMin;

  while (currentHour < closeHour || (currentHour === closeHour && currentMin <= closeMin)) {
    const timeStr = `${currentHour.toString().padStart(2, '0')}:${currentMin.toString().padStart(2, '0')}`;

    // Check if this time is already booked
    const existingBooking = mockBookings.find(
      b => b.courseId === course.id && b.date === date && b.teeTime === timeStr && b.status !== 'cancelled'
    );

    teeTimes.push({
      time: timeStr,
      available: !existingBooking,
      availableSlots: existingBooking ? 0 : course.maxPlayersPerGroup,
      price: course.greenFee,
    });

    currentMin += course.teeTimeInterval;
    if (currentMin >= 60) {
      currentHour += Math.floor(currentMin / 60);
      currentMin = currentMin % 60;
    }
  }

  return teeTimes;
}
