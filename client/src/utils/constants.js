export const XP_ACTIONS = {
  ONBOARDING_COMPLETE: 100,
  CAREER_SELECTED:     50,
  RESUME_UPLOADED:     75,
  ROADMAP_STEP:        200,
  DAILY_LOGIN:         10,
  MENTOR_SESSION:      150,
};

export const LEVELS = [
  { level: 1,  title: 'Pathfinder',    minXP: 0 },
  { level: 2,  title: 'Explorer',      minXP: 200 },
  { level: 3,  title: 'Navigator',     minXP: 500 },
  { level: 4,  title: 'Achiever',      minXP: 1000 },
  { level: 5,  title: 'Rising Star',   minXP: 2000 },
  { level: 6,  title: 'Trailblazer',   minXP: 3500 },
  { level: 7,  title: 'Visionary',     minXP: 5500 },
  { level: 8,  title: 'Pioneer',       minXP: 8000 },
  { level: 9,  title: 'Legend',        minXP: 11000 },
  { level: 10, title: 'PathForge Pro', minXP: 15000 },
];

export const CAREER_DOMAINS = [
  'Software Engineering', 'Data Science', 'UI/UX Design',
  'Product Management', 'DevOps / Cloud', 'Cybersecurity',
  'Machine Learning / AI', 'Business Analysis', 'Digital Marketing',
  'Finance / FinTech', 'Healthcare Tech', 'EdTech',
];

export const SKILL_CATEGORIES = {
  technical: ['Python', 'JavaScript', 'Java', 'SQL', 'React', 'Node.js', 'AWS', 'Docker', 'Machine Learning'],
  soft:      ['Communication', 'Leadership', 'Problem Solving', 'Teamwork', 'Time Management'],
  domain:    ['Finance', 'Healthcare', 'Marketing', 'Law', 'Education'],
};

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';