import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { currentUser, twitterCallback, twitterLogin } from '../controllers/authController.js';

const router = Router();
router.get('/twitter/login', twitterLogin);
router.get('/twitter/callback', twitterCallback);
router.get('/me', authMiddleware, currentUser);

export default router;
