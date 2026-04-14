import express from 'express';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();
router.use(protect);

router.get('/overview', async (req, res) => {
  try {
    const User = (await import('../models/User.model.js')).default;
    const CareerProfile = (await import('../models/CareerProfile.model.js')).default;

    const [totalUsers, profile] = await Promise.all([
      User.countDocuments({ isVerified: true }),
      CareerProfile.findOne({ user: req.user.id }),
    ]);

    res.json({
      totalUsers,
      completedPhases: profile?.roadmap?.filter(r => r.completed).length || 0,
      totalPhases: profile?.roadmap?.length || 0,
      overallProgress: profile?.overallProgress || 0,
      selectedCareer: profile?.selectedCareer || null,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;