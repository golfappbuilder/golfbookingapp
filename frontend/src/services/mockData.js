// Mock data for demo purposes
export const mockCourses = [
  {
    id: 1,
    name: 'Pine Valley Golf Club',
    description: 'A challenging championship course with beautiful pine-lined fairways',
    address: '1 Pine Valley Rd',
    city: 'Pine Valley',
    state: 'NJ',
    zip: '08021',
    phone: '555-0100',
    holes: 18,
    par_total: 72,
    price_weekday: 75.00,
    price_weekend: 95.00,
  },
  {
    id: 2,
    name: 'Oceanview Golf Resort',
    description: 'Stunning coastal views with ocean breeze challenges',
    address: '500 Oceanview Dr',
    city: 'Malibu',
    state: 'CA',
    zip: '90265',
    phone: '555-0200',
    holes: 18,
    par_total: 71,
    price_weekday: 120.00,
    price_weekend: 150.00,
  },
  {
    id: 3,
    name: 'Mountain Ridge Golf Course',
    description: 'Elevated fairways with spectacular mountain vistas',
    address: '2000 Highland Ave',
    city: 'Denver',
    state: 'CO',
    zip: '80202',
    phone: '555-0300',
    holes: 18,
    par_total: 72,
    price_weekday: 55.00,
    price_weekend: 70.00,
  },
  {
    id: 4,
    name: 'Lakeside Links',
    description: 'A serene course featuring water hazards and lakeside holes',
    address: '789 Lake Shore Blvd',
    city: 'Chicago',
    state: 'IL',
    zip: '60601',
    phone: '555-0400',
    holes: 18,
    par_total: 70,
    price_weekday: 65.00,
    price_weekend: 85.00,
  },
  {
    id: 5,
    name: 'Desert Oasis Golf Club',
    description: 'An oasis in the desert with lush green fairways',
    address: '1234 Cactus Way',
    city: 'Scottsdale',
    state: 'AZ',
    zip: '85251',
    phone: '555-0500',
    holes: 18,
    par_total: 72,
    price_weekday: 90.00,
    price_weekend: 110.00,
  },
];

// Generate mock tee times for a given date
export function generateMockTeeTimes(courseId, date) {
  const teeTimes = [];
  const course = mockCourses.find(c => c.id === parseInt(courseId));
  if (!course) return [];

  for (let hour = 6; hour < 18; hour++) {
    for (let minute = 0; minute < 60; minute += 20) {
      teeTimes.push({
        id: parseInt(`${courseId}${hour}${minute}`),
        course_id: courseId,
        tee_date: date,
        tee_time: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00`,
        available_slots: Math.floor(Math.random() * 4) + 1,
        course_name: course.name,
        price_weekday: course.price_weekday,
        price_weekend: course.price_weekend,
      });
    }
  }
  return teeTimes;
}

// Mock bookings storage (in-memory for demo)
let mockBookings = [];
let bookingIdCounter = 1;

export const mockBookingsApi = {
  getAll: () => mockBookings,
  create: (teeTime, players, user) => {
    const isWeekend = new Date(teeTime.tee_date).getDay() % 6 === 0;
    const price = isWeekend ? teeTime.price_weekend : teeTime.price_weekday;
    const booking = {
      id: bookingIdCounter++,
      user_id: user?.id || 1,
      tee_time_id: teeTime.id,
      players,
      total_price: price * players,
      status: 'confirmed',
      tee_date: teeTime.tee_date,
      tee_time: teeTime.tee_time,
      course_name: teeTime.course_name,
      created_at: new Date().toISOString(),
    };
    mockBookings.push(booking);
    return booking;
  },
  cancel: (id) => {
    const booking = mockBookings.find(b => b.id === id);
    if (booking) {
      booking.status = 'cancelled';
    }
    return booking;
  },
};

// Mock user for demo
export const mockUser = {
  id: 1,
  email: 'demo@example.com',
  first_name: 'Demo',
  last_name: 'User',
};
