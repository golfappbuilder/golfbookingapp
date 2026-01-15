import { Router, Request, Response } from 'express';
import { courseService } from '../services';
import { CreateCourseDTO } from '../models';

const router = Router();

// Get all courses
router.get('/', (_req: Request, res: Response) => {
  try {
    const courses = courseService.getAllCourses();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

// Get course by ID
router.get('/:id', (req: Request, res: Response) => {
  try {
    const course = courseService.getCourseById(req.params.id);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch course' });
  }
});

// Get available tee times for a course on a specific date
router.get('/:id/tee-times', (req: Request, res: Response) => {
  try {
    const { date } = req.query;

    if (!date || typeof date !== 'string') {
      return res.status(400).json({ error: 'Date query parameter is required (YYYY-MM-DD)' });
    }

    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD' });
    }

    const teeTimes = courseService.getAvailableTeeTimes(req.params.id, date);
    res.json(teeTimes);
  } catch (error) {
    if (error instanceof Error && error.message === 'Course not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to fetch tee times' });
  }
});

// Create new course
router.post('/', (req: Request, res: Response) => {
  try {
    const dto: CreateCourseDTO = req.body;

    if (!dto.name || !dto.greenFee) {
      return res.status(400).json({ error: 'Name and greenFee are required' });
    }

    const course = courseService.createCourse(dto);
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create course' });
  }
});

// Update course
router.put('/:id', (req: Request, res: Response) => {
  try {
    const dto: Partial<CreateCourseDTO> = req.body;
    const course = courseService.updateCourse(req.params.id, dto);

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.json(course);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update course' });
  }
});

// Delete course
router.delete('/:id', (req: Request, res: Response) => {
  try {
    const deleted = courseService.deleteCourse(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete course' });
  }
});

export default router;
