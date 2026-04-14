import express from 'express';
import {
  getAllMentors,
  getMentorById,
  becomeMentor,
  bookSession,
  getMentorMatches,
  reviewMentor,
} from '../controllers/mentor.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();
router.use(protect);

router.get('/',             getAllMentors);
router.get('/matches',      getMentorMatches);
router.get('/:id',          getMentorById);
router.post('/become',      becomeMentor);
router.post('/:id/book',    bookSession);
router.post('/:id/review',  reviewMentor);

export default router;