const express = require('express');
const { body, validationResult } = require('express-validator');
const Booking = require('../models/Booking');
const TeeTime = require('../models/TeeTime');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get user's bookings
router.get('/', authenticateToken, async (req, res) => {
  try {
    const bookings = await Booking.findByUser(req.user.id);
    res.json(bookings);
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// Get single booking
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    if (booking.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    res.json(booking);
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({ error: 'Failed to fetch booking' });
  }
});

// Create booking
router.post('/', authenticateToken, [
  body('teeTimeId').isInt(),
  body('players').isInt({ min: 1, max: 4 }),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { teeTimeId, players } = req.body;

    // Verify tee time exists and has availability
    const teeTime = await TeeTime.findById(teeTimeId);
    if (!teeTime) {
      return res.status(404).json({ error: 'Tee time not found' });
    }
    if (teeTime.available_slots < players) {
      return res.status(400).json({ error: 'Not enough available slots' });
    }

    // Calculate price
    const date = new Date(teeTime.tee_date);
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const pricePerPlayer = isWeekend ? teeTime.price_weekend : teeTime.price_weekday;
    const totalPrice = pricePerPlayer * players;

    const booking = await Booking.create({
      userId: req.user.id,
      teeTimeId,
      players,
      totalPrice,
    });

    res.status(201).json(booking);
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

// Cancel booking
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    if (booking.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const cancelled = await Booking.cancel(req.params.id);
    res.json(cancelled);
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ error: 'Failed to cancel booking' });
  }
});

module.exports = router;
