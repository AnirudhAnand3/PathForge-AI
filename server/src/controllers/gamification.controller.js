import User from '../models/User.model.js';
import Achievement from '../models/Achievement.model.js';

const BADGES = [
  { id: 'first_login',   name: 'Pathfinder',      icon: '🌟', xpRequired: 0,    desc: 'Started your journey' },
  { id: 'quiz_master',   name: 'Self-Aware',       icon: '🧠', xpRequired: 100,  desc: 'Completed career analysis' },
  { id: 'resume_pro',    name: 'Resume Master',    icon: '📄', xpRequired: 175,  desc: 'Uploaded and improved resume' },
  { id: 'streak_7',      name: '7-Day Warrior',    icon: '🔥', xpRequired: 0,    desc: '7 day login streak' },
  { id: 'roadmap_start', name: 'Road Warrior',     icon: '🗺️', xpRequired: 250,  desc: 'Completed first roadmap phase' },
  { id: 'chat_master',   name: 'Deep Thinker',     icon: '💬', xpRequired: 0,    desc: 'Had 10 AI counselor sessions' },
  { id: 'level_5',       name: 'Rising Star',      icon: '⭐', xpRequired: 0,    desc: 'Reached Level 5' },
  { id: 'top_10',        name: 'Elite Achiever',   icon: '🏆', xpRequired: 0,    desc: 'Reached top 10 leaderboard' },
];

export const getLeaderboard = async (req, res, next) => {
  try {
    const users = await User.find({ isVerified: true })
      .sort({ xp: -1 })
      .limit(50)
      .select('name avatar xp level streak');

    const ranked = users.map((u, i) => ({
      rank: i + 1,
      name: u.name,
      avatar: u.avatar,
      xp: u.xp,
      level: u.level,
      streak: u.streak,
      isCurrentUser: u._id.toString() === req.user.id,
    }));

    res.json(ranked);
  } catch (err) {
    next(err);
  }
};

export const checkAndAwardBadges = async (userId) => {
  const user = await User.findById(userId).populate('badges');
  const earnedBadgeIds = user.badges.map(b => b.badgeId);

  const newBadges = [];

  for (const badge of BADGES) {
    if (earnedBadgeIds.includes(badge.id)) continue;

    let earned = false;
    if (badge.id === 'quiz_master' && user.xp >= 100) earned = true;
    if (badge.id === 'streak_7' && user.streak >= 7) earned = true;
    if (badge.id === 'level_5' && user.level >= 5) earned = true;
    if (badge.id === 'resume_pro' && user.xp >= 175) earned = true;

    if (earned) {
      const achievement = await Achievement.create({
        user: userId,
        badgeId: badge.id,
        name: badge.name,
        icon: badge.icon,
        description: badge.desc,
      });
      user.badges.push(achievement._id);
      newBadges.push(badge);
    }
  }

  if (newBadges.length > 0) await user.save();
  return newBadges;
};
export const getMyBadges = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('badges');
    res.json(user.badges);
  } catch (err) { next(err); }
};

export const getMyStats = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('xp level streak lastActive');
    const rank = await User.countDocuments({ xp: { $gt: user.xp } }) + 1;
    res.json({ ...user.toObject(), rank });
  } catch (err) { next(err); }
};