import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import {
  columnFeed,
  createColumn,
  deleteColumn,
  listColumns,
  reorderColumns,
  updateColumn
} from '../controllers/columnController.js';

const router = Router();
router.use(authMiddleware);
router.get('/', listColumns);
router.post('/', createColumn);
router.put('/:id', updateColumn);
router.delete('/:id', deleteColumn);
router.patch('/reorder', reorderColumns);
router.get('/:id/feed', columnFeed);

export default router;
