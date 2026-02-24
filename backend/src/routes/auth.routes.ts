import { Router } from 'express';
import { login, logout } from '../controllers/auth.controller.js';
import { asyncHandler } from '../middleware/async.js';
import { validate, loginSchema } from '../middleware/validate.js';

const router = Router();

router.post('/login', validate(loginSchema), asyncHandler(login));

router.post('/logout', asyncHandler(logout));

export default router;
