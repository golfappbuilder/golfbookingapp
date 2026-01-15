import express from 'express';
import routes from './routes';
import { emailService } from './services';
import { courseService, userService } from './services';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Request logging middleware
app.use((req, _res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

// Configure email service (optional - uses console logging if not configured)
if (process.env.SMTP_HOST) {
  emailService.configure({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASS || '',
    },
    from: process.env.SMTP_FROM || 'noreply@golfbooking.com',
  });
  console.log('Email service configured with SMTP');
} else {
  console.log('Email service running in demo mode (logging to console)');
}

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api', routes);

// Root endpoint
app.get('/', (_req, res) => {
  res.json({
    name: 'Golf Booking API',
    version: '1.0.0',
    description: 'Golf course tee time booking system with email notifications',
    endpoints: {
      users: '/api/users',
      courses: '/api/courses',
      bookings: '/api/bookings',
      health: '/health',
    },
    features: [
      'User management',
      'Course management with tee time scheduling',
      'Booking system with availability checking',
      'Email notifications for confirmations, updates, and cancellations',
      'Automated booking reminders',
    ],
  });
});

// Error handling middleware
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Initialize with sample data for demonstration
function initializeSampleData() {
  console.log('Initializing sample data...');

  // Create a sample course
  const course = courseService.createCourse({
    name: 'Pine Valley Golf Club',
    description: 'A beautiful 18-hole championship course nestled in the hills.',
    address: '123 Fairway Drive',
    city: 'Golf City',
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
    amenities: ['Pro Shop', 'Restaurant', 'Driving Range', 'Practice Green'],
  });
  console.log(`Created sample course: ${course.name} (ID: ${course.id})`);

  // Create a sample user
  const user = userService.createUser({
    email: 'john.doe@example.com',
    firstName: 'John',
    lastName: 'Doe',
    phone: '(555) 987-6543',
    handicap: 15,
    membershipType: 'member',
  });
  console.log(`Created sample user: ${user.firstName} ${user.lastName} (ID: ${user.id})`);

  console.log('Sample data initialized.');
  console.log('');
  console.log('Try creating a booking with:');
  console.log(`  POST /api/bookings`);
  console.log(`  {`);
  console.log(`    "courseId": "${course.id}",`);
  console.log(`    "userId": "${user.id}",`);
  console.log(`    "date": "2026-01-20",`);
  console.log(`    "teeTime": "09:00",`);
  console.log(`    "numberOfPlayers": 2,`);
  console.log(`    "includeCart": true`);
  console.log(`  }`);
}

// Start server
app.listen(PORT, () => {
  console.log('');
  console.log('='.repeat(60));
  console.log('Golf Booking App - Tee Time Reservation System');
  console.log('='.repeat(60));
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('');

  // Initialize sample data
  initializeSampleData();

  console.log('');
  console.log('Email Notification Features:');
  console.log('- Booking confirmation emails sent automatically');
  console.log('- Update notifications when booking details change');
  console.log('- Cancellation confirmations');
  console.log('- Reminder emails for bookings (POST /api/bookings/send-reminders)');
  console.log('='.repeat(60));
  console.log('');
});

export default app;
