import CareerProfile from '../models/CareerProfile.model.js';
import User from '../models/User.model.js';
import { analyzeCareerFit, generateRoadmap, detectSkillGap } from '../services/openai.service.js';

export const submitOnboarding = async (req, res, next) => {
  try {
    const { answers, skills, interests, educationLevel, currentDomain } = req.body;

    const profileData = { answers, skills, interests, educationLevel, currentDomain, userId: req.user.id };

    // Call AI
    const analysis = await analyzeCareerFit(profileData);

    const profile = await CareerProfile.findOneAndUpdate(
      { user: req.user.id },
      {
        personalityType: analysis.personalityType,
        dominantSkills: skills,
        interests,
        educationLevel,
        currentDomain,
        recommendedCareers: analysis.careerRecommendations,
        quizAnswers: answers,
        skillScores: skills.map(s => ({ skill: s, score: Math.floor(60 + Math.random() * 40), category: 'technical' })),
      },
      { new: true }
    );

    // Award XP
    await req.user.addXP(100);

    res.json({ profile, analysis, message: 'Career analysis complete!' });
  } catch (err) {
    next(err);
  }
};

export const selectCareerAndGenerateRoadmap = async (req, res, next) => {
  try {
    const { career } = req.body;
    const profile = await CareerProfile.findOne({ user: req.user.id });

    const roadmapData = await generateRoadmap(career, profile.dominantSkills, profile);

    profile.selectedCareer = career;
    profile.roadmap = roadmapData.roadmap.map((phase, i) => ({ ...phase, phase: i + 1, completed: false }));
    await profile.save();

    await req.user.addXP(50);
    res.json({ roadmap: profile.roadmap, career });
  } catch (err) {
    next(err);
  }
};

export const completeRoadmapStep = async (req, res, next) => {
  try {
    const { phase } = req.params;
    const profile = await CareerProfile.findOne({ user: req.user.id });

    const step = profile.roadmap.find(s => s.phase === parseInt(phase));
    if (!step) return res.status(404).json({ message: 'Step not found' });

    step.completed = true;
    step.completedAt = new Date();

    const completedCount = profile.roadmap.filter(s => s.completed).length;
    profile.overallProgress = Math.round((completedCount / profile.roadmap.length) * 100);

    await profile.save();
    await req.user.addXP(200);

    res.json({ profile, xpEarned: 200, message: `Phase ${phase} complete! +200 XP 🎉` });
  } catch (err) {
    next(err);
  }
};

export const getSkillGap = async (req, res, next) => {
  try {
    const profile = await CareerProfile.findOne({ user: req.user.id });
    const userSkills = profile.dominantSkills || [];
    const targetCareer = profile.selectedCareer || 'Software Engineer';

    const gapAnalysis = await detectSkillGap(userSkills, targetCareer);
    res.json(gapAnalysis);
  } catch (err) {
    next(err);
  }
};
export const getCareerProfile = async (req, res, next) => {
  try {
    const profile = await CareerProfile.findOne({ user: req.user.id });
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    res.json(profile);
  } catch (err) { next(err); }
};