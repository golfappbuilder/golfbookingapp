const express = require('express');
const TeeTime = require('../models/TeeTime');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get available tee times for a course on a specific date
router.get('/available', async (req, res) => {
  try {
    const { courseId, date } = req.query;

    if (!courseId || !date) {
      return res.status(400).json({ error: 'courseId and date are required' });
    }

    const teeTimes = await TeeTime.findAvailable(courseId, date);
    res.json(teeTimes);
  } catch (error) {
    console.error('Get tee times error:', error);
    res.status(500).json({ error: 'Failed to fetch tee times' });
  }
});

// Get single tee time
router.get('/:id', async (req, res) => {
  try {
    const teeTime = await TeeTime.findById(req.params.id);
    if (!teeTime) {
      return res.status(404).json({ error: 'Tee time not found' });
    }
    res.json(teeTime);
  } catch (error) {
    console.error('Get tee time error:', error);
    res.status(500).json({ error: 'Failed to fetch tee time' });
  }
});

// Generate tee times for a date (admin)
router.post('/generate', authenticateToken, async (req, res) => {
  try {
    const { courseId, date, startHour, endHour, intervalMinutes } = req.body;

    if (!courseId || !date) {
      return res.status(400).json({ error: 'courseId and date are required' });
    }

    const teeTimes = await TeeTime.generateForDate(
      courseId,
      date,
      startHour,
      endHour,
      intervalMinutes
    );

    res.status(201).json(teeTimes);
  } catch (error) {
    console.error('Generate tee times error:', error);
    res.status(500).json({ error: 'Failed to generate tee times' });
  }
});

module.exports = router;
