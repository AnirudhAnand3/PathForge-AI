import express from 'express';
import { getLeaderboard, getMyBadges, getMyStats } from '../controllers/gamification.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();
router.use(protect);

router.get('/leaderboard', getLeaderboard);
router.get('/badges',      getMyBadges);
router.get('/stats',       getMyStats);

export default router;