import CareerProfile from '../models/CareerProfile.model.js';
import User from '../models/User.model.js';
import { analyzeCareerFit, generateRoadmap, detectSkillGap } from '../services/openai.service.js';

// ── Robust resource normalizer ────────────────────────────────────
const normalizeResources = (resources) => {
  if (!resources) return [];
  const result = [];

  const pushItem = (item) => {
    if (!item || typeof item !== 'object' || Array.isArray(item)) return;
    result.push({
      title: String(item.title || ''),
      url:   String(item.url   || ''),
      type:  String(item.type  || 'article'),
      free:  item.free !== undefined ? Boolean(item.free) : true,
    });
  };

  const extractFromString = (str) => {
    // Try JSON first (double quotes)
    try {
      const parsed = JSON.parse(str);
      if (Array.isArray(parsed)) { parsed.forEach(pushItem); return; }
      pushItem(parsed);
      return;
    } catch {}

    // Handle JS object notation (single quotes) via regex
    const titleMatches = [...str.matchAll(/title\s*:\s*['"`]([^'"`\n]+)['"`]/g)];
    const urlMatches   = [...str.matchAll(/url\s*:\s*['"`]([^'"`\n]+)['"`]/g)];
    const typeMatches  = [...str.matchAll(/type\s*:\s*['"`]([^'"`\n]+)['"`]/g)];
    const freeMatches  = [...str.matchAll(/free\s*:\s*(true|false)/g)];

    const count = Math.max(titleMatches.length, urlMatches.length);
    for (let i = 0; i < count; i++) {
      result.push({
        title: titleMatches[i]?.[1] || '',
        url:   urlMatches[i]?.[1]   || '',
        type:  typeMatches[i]?.[1]  || 'article',
        free:  freeMatches[i]?.[1] === 'true',
      });
    }
  };

  const items = Array.isArray(resources) ? resources : [resources];

  for (const r of items) {
    if (typeof r === 'string') {
      extractFromString(r.trim());
    } else if (Array.isArray(r)) {
      r.forEach(pushItem);
    } else {
      pushItem(r);
    }
  }

  return result;
};

// ── Submit Onboarding ─────────────────────────────────────────────
export const submitOnboarding = async (req, res, next) => {
  try {
    const { answers, skills, interests, educationLevel, currentDomain } = req.body;
    const profileData = { answers, skills, interests, educationLevel, currentDomain, userId: req.user.id };

    const analysis = await analyzeCareerFit(profileData);

    const profile = await CareerProfile.findOneAndUpdate(
      { user: req.user.id },
      {
        personalityType:    analysis.personalityType,
        dominantSkills:     skills || [],
        interests:          interests || [],
        educationLevel,
        currentDomain,
        recommendedCareers: analysis.careerRecommendations || analysis.recommendedCareers || [],
        quizAnswers:        answers,
        skillScores:        (skills || []).map(s => ({
          skill:    s,
          score:    Math.floor(60 + Math.random() * 40),
          category: 'technical',
        })),
      },
      { new: true }
    );

    await req.user.addXP(100);
    res.json({ profile, analysis, message: 'Career analysis complete!' });
  } catch (err) { next(err); }
};

// ── Select Career + Generate Roadmap ─────────────────────────────
export const selectCareerAndGenerateRoadmap = async (req, res, next) => {
  try {
    const { career } = req.body;
    const profile = await CareerProfile.findOne({ user: req.user.id });

    const roadmapData = await generateRoadmap(
      career,
      profile.dominantSkills || [],
      profile
    );

    const rawPhases = roadmapData.roadmap || roadmapData.phases || [];

    const phases = rawPhases.map((phase, i) => ({
      phase:       i + 1,
      title:       String(phase.title       || `Phase ${i + 1}`),
      description: String(phase.description || phase.milestone || ''),
      duration:    String(phase.duration    || ''),
      resources:   normalizeResources(phase.resources),
      completed:   false,
    }));

    profile.selectedCareer = career;
    profile.roadmap        = phases;
    await profile.save();

    await req.user.addXP(50);
    res.json({ roadmap: profile.roadmap, career });
  } catch (err) { next(err); }
};

// ── Complete Roadmap Step ─────────────────────────────────────────
export const completeRoadmapStep = async (req, res, next) => {
  try {
    const { phase } = req.params;
    const profile   = await CareerProfile.findOne({ user: req.user.id });

    const step = profile.roadmap.find(s => s.phase === parseInt(phase));
    if (!step) return res.status(404).json({ message: 'Step not found' });

    step.completed   = true;
    step.completedAt = new Date();

    const completedCount    = profile.roadmap.filter(s => s.completed).length;
    profile.overallProgress = Math.round((completedCount / profile.roadmap.length) * 100);

    await profile.save();
    await req.user.addXP(200);

    res.json({ profile, xpEarned: 200, message: `Phase ${phase} complete! +200 XP 🎉` });
  } catch (err) { next(err); }
};

// ── Get Career Profile ────────────────────────────────────────────
export const getCareerProfile = async (req, res, next) => {
  try {
    const profile = await CareerProfile.findOne({ user: req.user.id });
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    res.json(profile);
  } catch (err) { next(err); }
};

// ── Skill Gap ─────────────────────────────────────────────────────
export const getSkillGap = async (req, res, next) => {
  try {
    const profile      = await CareerProfile.findOne({ user: req.user.id });
    const userSkills   = profile?.dominantSkills || [];
    const targetCareer = profile?.selectedCareer || 'Software Engineer';
    const gapAnalysis  = await detectSkillGap(userSkills, targetCareer);
    res.json(gapAnalysis);
  } catch (err) { next(err); }
};