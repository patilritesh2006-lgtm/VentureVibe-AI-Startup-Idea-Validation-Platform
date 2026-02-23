import { Hono, Context } from 'hono';
import { startupService } from '../services/startupService.ts';
import catchAsync from '../utils/catchAsync.ts';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { authMiddleware } from '../middlewares/authMiddleware.ts';

const startupRoutes = new Hono();

const createSessionSchema = z.object({
  ideaTitle: z.string().min(3).max(100).trim(),
  ideaDescription: z.string().min(10).max(2000).trim(),
  industry: z.string().min(2).max(50).trim(),
  targetMarket: z.string().min(2).max(100).trim(),
});

// Protected routes
startupRoutes.post(
  '/sessions',
  authMiddleware,
  zValidator('json', createSessionSchema),
  catchAsync(async (c: Context) => {
    const userId = c.get('userId');
    const body = await c.req.json();
    const result = await startupService.createSession(userId, body);
    return c.json(result);
  })
);

startupRoutes.get(
  '/sessions',
  authMiddleware,
  catchAsync(async (c: Context) => {
    const userId = c.get('userId');
    const result = await startupService.getSessions(userId);
    return c.json(result);
  })
);

startupRoutes.get(
  '/sessions/:id',
  authMiddleware,
  catchAsync(async (c: Context) => {
    const userId = c.get('userId');
    const id = c.req.param('id');
    const result = await startupService.getSessionById(id, userId);
    return c.json(result);
  })
);

// Public routes
startupRoutes.get(
  '/leaderboard',
  catchAsync(async (c: Context) => {
    const result = await startupService.getLeaderboard();
    return c.json(result);
  })
);

export default startupRoutes;
