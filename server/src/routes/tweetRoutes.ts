import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { cancelScheduled, listScheduled, postTweetNow, scheduleTweet } from '../controllers/tweetController.js';

const router = Router();
router.use(authMiddleware);
router.post('/schedule', scheduleTweet);
router.get('/scheduled', listScheduled);
router.post('/:id/cancel', cancelScheduled);
router.delete('/:id', cancelScheduled);
router.post('/', postTweetNow);

export default router;
