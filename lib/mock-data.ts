// Mock data for Vercel deployment (no database required)

// Simplified course data - no pricing, just link to source
export const mockCourses = [
  {
    id: 'course-1',
    name: 'Cape Cod National Golf Club',
    description: 'A stunning links-style course carved through pine forests with ocean breezes and challenging greens. One of Cape Cod\'s premier golf destinations.',
    city: 'Brewster',
    state: 'MA',
    region: 'Cape Cod',
    type: 'Public' as const,
    holes: 18,
    website: 'https://www.capecodgolfclub.com',
    bookingUrl: 'https://www.capecodgolfclub.com/tee-times',
    imageUrl: 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=800',
    verified: false,
  },
  {
    id: 'course-2',
    name: 'Cranberry Valley Golf Course',
    description: 'A scenic municipal course winding through cranberry bogs and pine forests. Excellent value with championship-quality conditions.',
    city: 'Harwich',
    state: 'MA',
    region: 'Cape Cod',
    type: 'Public' as const,
    holes: 18,
    website: 'https://www.cranberryvalleygolfcourse.com',
    bookingUrl: 'https://www.cranberryvalleygolfcourse.com/tee-times',
    imageUrl: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800',
    verified: false,
  },
  {
    id: 'course-3',
    name: 'Samoset Resort Golf Club',
    description: 'A spectacular oceanfront course overlooking Penobscot Bay. Seven holes directly on the water with dramatic Maine coastline views.',
    city: 'Rockport',
    state: 'ME',
    region: 'Maine',
    type: 'Resort' as const,
    holes: 18,
    website: 'https://www.samosetresort.com/golf',
    bookingUrl: 'https://www.samosetresort.com/golf/tee-times',
    imageUrl: 'https://images.unsplash.com/photo-1592919505780-303950717480?w=800',
    verified: false,
  },
  {
    id: 'course-4',
    name: 'Belgrade Lakes Golf Club',
    description: 'A Clive Clark design featuring dramatic elevation changes and pristine Maine wilderness. Ranked among Maine\'s best.',
    city: 'Belgrade Lakes',
    state: 'ME',
    region: 'Maine',
    type: 'Public' as const,
    holes: 18,
    website: 'https://www.belgradelakesgolf.com',
    bookingUrl: 'https://www.belgradelakesgolf.com/tee-times',
    imageUrl: 'https://images.unsplash.com/photo-1600005082673-7a5ac0f1b9eb?w=800',
    verified: false,
  },
  {
    id: 'course-5',
    name: 'Granite Links Golf Club',
    description: 'Built on former quarries with stunning Boston skyline views. A unique links experience just minutes from downtown.',
    city: 'Quincy',
    state: 'MA',
    region: 'Boston Area',
    type: 'Public' as const,
    holes: 27,
    website: 'https://www.granitelinks.com',
    bookingUrl: 'https://www.granitelinks.com/tee-times',
    imageUrl: 'https://images.unsplash.com/photo-1611374243147-44a702c2d44c?w=800',
    verified: false,
  },
  {
    id: 'course-6',
    name: 'Pinehills Golf Club',
    description: 'Two championship courses - Nicklaus and Jones designs - in the scenic Plymouth pine barrens. A must-play destination.',
    city: 'Plymouth',
    state: 'MA',
    region: 'South Shore',
    type: 'Public' as const,
    holes: 36,
    website: 'https://www.pinehillsgolf.com',
    bookingUrl: 'https://www.pinehillsgolf.com/tee-times',
    imageUrl: 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=800',
    verified: false,
  },
  {
    id: 'course-7',
    name: 'Waverly Oaks Golf Club',
    description: 'Premier public course in Plymouth featuring championship conditions. GPS-equipped carts and range balls included with every round.',
    city: 'Plymouth',
    state: 'MA',
    region: 'South Shore',
    type: 'Public' as const,
    holes: 18,
    website: 'https://www.waverlyoaksgc.com',
    bookingUrl: 'https://www.waverlyoaksgc.com/golf/rates/',
    imageUrl: 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=800',
    verified: true,
  },
];

// Course type definition for TypeScript
export type Course = typeof mockCourses[0];

// In-memory trips store
export const mockTrips: Array<{
  id: string;
  email: string;
  prompt: string;
  destination: string;
  groupSize: number;
  nights: number;
  tripType: string;
  courses: Course[];
  itinerary: Array<{ day: number; activities: string[] }>;
  createdAt: Date;
}> = [];

// User-submitted lodging recommendations (Where to Stay section)
export const lodgingSubmissions: Array<{
  id: string;
  email: string;
  lodgingName: string;
  city: string;
  state: string;
  region: 'Cape Cod' | 'Boston Area' | 'Maine' | 'Vermont' | 'New Hampshire' | 'South Shore' | 'Other';
  lodgingType: 'airbnb' | 'vrbo' | 'hotel' | 'house_rental' | 'other';
  sleeps: number;
  linkUrl: string;
  tips: string;
  nearbyCourses: string[];
  recommend: boolean;
  canFeature: boolean;
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
