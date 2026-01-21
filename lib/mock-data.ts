// Mock data for Vercel deployment (no database required)

export const mockCourses = [
  {
    id: 'course-1',
    name: 'Pine Valley Golf Club',
    description: 'A beautiful 18-hole championship course nestled in the hills with stunning views and challenging holes.',
    address: '123 Fairway Drive',
    city: 'Pine Valley',
    state: 'CA',
    zipCode: '90210',
    phone: '(555) 123-4567',
    email: 'info@pinevalley.com',
    holes: 18,
    par: 72,
    yardage: 7200,
    greenFee: 75,
    cartFee: 25,
    openTime: '06:00',
    closeTime: '19:00',
    teeTimeInterval: 10,
    maxPlayersPerGroup: 4,
    amenities: JSON.stringify(['Pro Shop', 'Restaurant', 'Driving Range', 'Practice Green', 'Club Rentals']),
    imageUrl: 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=800',
    rating: 4.8,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'course-2',
    name: 'Ocean Breeze Golf Resort',
    description: 'A scenic coastal course featuring ocean views on every hole. Perfect for golfers who appreciate natural beauty.',
    address: '456 Coastal Highway',
    city: 'Seaside',
    state: 'CA',
    zipCode: '93955',
    phone: '(555) 234-5678',
    email: 'teetimes@oceanbreeze.com',
    holes: 18,
    par: 71,
    yardage: 6800,
    greenFee: 95,
    cartFee: 30,
    openTime: '06:30',
    closeTime: '18:30',
    teeTimeInterval: 12,
    maxPlayersPerGroup: 4,
    amenities: JSON.stringify(['Pro Shop', 'Oceanview Restaurant', 'Spa', 'Practice Facility', 'Lodging']),
    imageUrl: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800',
    rating: 4.9,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'course-3',
    name: 'Mountain Peak Golf Club',
    description: 'An elevated mountain course with dramatic elevation changes and breathtaking panoramic views.',
    address: '789 Summit Road',
    city: 'Highland',
    state: 'CO',
    zipCode: '80461',
    phone: '(555) 345-6789',
    email: 'play@mountainpeak.com',
    holes: 18,
    par: 70,
    yardage: 6500,
    greenFee: 65,
    cartFee: 20,
    openTime: '07:00',
    closeTime: '18:00',
    teeTimeInterval: 10,
    maxPlayersPerGroup: 4,
    amenities: JSON.stringify(['Pro Shop', 'Grill', 'Driving Range', 'Golf School']),
    imageUrl: 'https://images.unsplash.com/photo-1592919505780-303950717480?w=800',
    rating: 4.5,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'course-4',
    name: 'Desert Oasis Country Club',
    description: 'A lush oasis in the desert featuring challenging bunkers and pristine greens. An unforgettable experience.',
    address: '321 Palm Springs Blvd',
    city: 'Palm Desert',
    state: 'CA',
    zipCode: '92260',
    phone: '(555) 456-7890',
    email: 'reservations@desertoasis.com',
    holes: 18,
    par: 72,
    yardage: 7100,
    greenFee: 120,
    cartFee: 35,
    openTime: '05:30',
    closeTime: '19:30',
    teeTimeInterval: 8,
    maxPlayersPerGroup: 4,
    amenities: JSON.stringify(['Pro Shop', 'Fine Dining', 'Spa', 'Tennis', 'Pool', 'Caddy Service']),
    imageUrl: 'https://images.unsplash.com/photo-1600005082673-7a5ac0f1b9eb?w=800',
    rating: 4.7,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'course-5',
    name: 'Lakeside Municipal Golf Course',
    description: 'An affordable public course perfect for beginners and families. Beautiful lake views and friendly atmosphere.',
    address: '555 Lakeview Drive',
    city: 'Lakewood',
    state: 'OH',
    zipCode: '44107',
    phone: '(555) 567-8901',
    email: 'info@lakesidemuni.com',
    holes: 9,
    par: 36,
    yardage: 3200,
    greenFee: 25,
    cartFee: 15,
    openTime: '06:00',
    closeTime: '20:00',
    teeTimeInterval: 10,
    maxPlayersPerGroup: 4,
    amenities: JSON.stringify(['Snack Bar', 'Club Rentals', 'Practice Green']),
    imageUrl: 'https://images.unsplash.com/photo-1611374243147-44a702c2d44c?w=800',
    rating: 4.2,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const mockUser = {
  id: 'user-demo',
  email: 'demo@golfbooking.com',
  firstName: 'John',
  lastName: 'Golfer',
  phone: '(555) 987-6543',
  handicap: 15,
  membershipType: 'member',
  createdAt: new Date(),
  updatedAt: new Date(),
};

// In-memory bookings store (resets on each deploy, but works for demo)
export const mockBookings: Array<{
  id: string;
  courseId: string;
  userId: string;
  date: string;
  teeTime: string;
  numberOfPlayers: number;
  playerNames: string;
  includeCart: boolean;
  totalPrice: number;
  status: string;
  confirmationNumber: string;
  notes: string | null;
  emailNotificationSent: boolean;
  reminderSent: boolean;
  createdAt: Date;
  updatedAt: Date;
  course?: typeof mockCourses[0];
}> = [];

export function getCourseById(id: string) {
  return mockCourses.find(c => c.id === id);
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
