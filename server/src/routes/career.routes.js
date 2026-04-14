import express from 'express';
import {
  submitOnboarding,
  selectCareerAndGenerateRoadmap,
  completeRoadmapStep,
  getSkillGap,
  getCareerProfile,
} from '../controllers/career.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { aiLimiter } from '../middleware/rateLimit.middleware.js';

const router = express.Router();

router.use(protect);

router.post('/onboarding',          aiLimiter, submitOnboarding);
router.post('/select-career',       aiLimiter, selectCareerAndGenerateRoadmap);
router.patch('/roadmap/:phase/complete', completeRoadmapStep);
router.get('/skill-gap',            aiLimiter, getSkillGap);
router.get('/profile',              getCareerProfile);

export default router;