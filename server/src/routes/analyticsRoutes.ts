import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { analyticsOverview } from '../controllers/analyticsController.js';

const router = Router();
router.use(authMiddleware);
router.get('/overview', analyticsOverview);

export default router;
