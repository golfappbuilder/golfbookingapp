import { Router, Request, Response } from 'express';
import { bookingService } from '../services';
import { CreateBookingDTO, UpdateBookingDTO } from '../models';

const router = Router();

// Get all bookings
router.get('/', (_req: Request, res: Response) => {
  try {
    const bookings = bookingService.getAllBookings();
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// Get booking by ID
router.get('/:id', (req: Request, res: Response) => {
  try {
    const booking = bookingService.getBookingById(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch booking' });
  }
});

// Get booking with full details (includes course and user info)
router.get('/:id/details', (req: Request, res: Response) => {
  try {
    const booking = bookingService.getBookingWithDetails(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch booking details' });
  }
});

// Look up booking by confirmation number
router.get('/confirmation/:confirmationNumber', (req: Request, res: Response) => {
  try {
    const booking = bookingService.getBookingByConfirmation(req.params.confirmationNumber);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch booking' });
  }
});

// Get bookings for a specific user
router.get('/user/:userId', (req: Request, res: Response) => {
  try {
    const bookings = bookingService.getBookingsByUserId(req.params.userId);
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user bookings' });
  }
});

// Get bookings for a course on a specific date
router.get('/course/:courseId/date/:date', (req: Request, res: Response) => {
  try {
    const { date } = req.params;

    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD' });
    }

    const bookings = bookingService.getBookingsByCourseAndDate(req.params.courseId, date);
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch course bookings' });
  }
});

// Create new booking (sends confirmation email automatically)
router.post('/', async (req: Request, res: Response) => {
  try {
    const dto: CreateBookingDTO = req.body;

    if (!dto.courseId || !dto.userId || !dto.date || !dto.teeTime || !dto.numberOfPlayers) {
      return res.status(400).json({
        error: 'courseId, userId, date, teeTime, and numberOfPlayers are required',
      });
    }

    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dto.date)) {
      return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD' });
    }

    // Validate time format
    const timeRegex = /^\d{2}:\d{2}$/;
    if (!timeRegex.test(dto.teeTime)) {
      return res.status(400).json({ error: 'Invalid time format. Use HH:MM' });
    }

    const booking = await bookingService.createBooking(dto);
    res.status(201).json({
      message: 'Booking confirmed! A confirmation email will be sent shortly.',
      booking,
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Course not found' || error.message === 'User not found') {
        return res.status(404).json({ error: error.message });
      }
      if (error.message.includes('Number of players') || error.message.includes('Not enough')) {
        return res.status(400).json({ error: error.message });
      }
    }
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

// Update booking (sends update email for significant changes)
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const dto: UpdateBookingDTO = req.body;
    const booking = await bookingService.updateBooking(req.params.id, dto);

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json({
      message: 'Booking updated successfully.',
      booking,
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('Cannot modify')) {
        return res.status(400).json({ error: error.message });
      }
    }
    res.status(500).json({ error: 'Failed to update booking' });
  }
});

// Cancel booking (sends cancellation email)
router.post('/:id/cancel', async (req: Request, res: Response) => {
  try {
    const booking = await bookingService.cancelBooking(req.params.id);

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json({
      message: 'Booking cancelled. A cancellation confirmation email will be sent.',
      booking,
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('already cancelled') || error.message.includes('Cannot cancel')) {
        return res.status(400).json({ error: error.message });
      }
    }
    res.status(500).json({ error: 'Failed to cancel booking' });
  }
});

// Trigger reminder emails for tomorrow's bookings (typically called by a scheduler)
router.post('/send-reminders', async (_req: Request, res: Response) => {
  try {
    const sentCount = await bookingService.sendReminderEmails();
    res.json({
      message: `Reminder emails sent successfully`,
      count: sentCount,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send reminder emails' });
  }
});

// Delete booking (admin only, no email sent)
router.delete('/:id', (req: Request, res: Response) => {
  try {
    const deleted = bookingService.deleteBooking(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete booking' });
  }
});

export default router;
