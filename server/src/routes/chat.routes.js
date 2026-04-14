import express from 'express';
import { streamChat, getChatHistory, getSessions } from '../controllers/chat.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { aiLimiter } from '../middleware/rateLimit.middleware.js';

const router = express.Router();
router.use(protect);

router.post('/stream',   aiLimiter, streamChat);
router.get('/sessions',  getSessions);
router.get('/:sessionId', getChatHistory);

export default router;