import { Router } from 'express';
import { asyncHandler } from '../middleware/async.js';
import { authMiddleware } from '../middleware/auth.js';
import {
  getTodos,
  createNewTodo,
  updateExistingTodo,
  deleteExistingTodo,
} from '../controllers/todo.controller.js';

const router = Router();

router.use(authMiddleware);

router.get('/', asyncHandler(getTodos));
router.post('/', asyncHandler(createNewTodo));
router.put('/:id', asyncHandler(updateExistingTodo));
router.delete('/:id', asyncHandler(deleteExistingTodo));

export default router;
