import { Router } from 'express';
import userRoutes from './userRoutes';
import courseRoutes from './courseRoutes';
import bookingRoutes from './bookingRoutes';

const router = Router();

router.use('/users', userRoutes);
router.use('/courses', courseRoutes);
router.use('/bookings', bookingRoutes);

export default router;
