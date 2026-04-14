export const levelFromXP = (xp) => Math.floor(1 + Math.sqrt(xp / 100));

export const xpForNextLevel = (level) => (level + 1) * (level + 1) * 100;

export const xpProgress = (xp, level) => {
  const currentLevelXP = level * level * 100;
  const nextLevelXP    = (level + 1) * (level + 1) * 100;
  return Math.round(((xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100);
};

export const formatRelativeTime = (date) => {
  const diff = Date.now() - new Date(date).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins  < 1)   return 'just now';
  if (mins  < 60)  return `${mins}m ago`;
  if (hours < 24)  return `${hours}h ago`;
  return `${days}d ago`;
};

export const getScoreColor = (score) => {
  if (score >= 80) return 'text-green-400';
  if (score >= 60) return 'text-yellow-400';
  return 'text-red-400';
};

export const getScoreBg = (score) => {
  if (score >= 80) return 'bg-green-500';
  if (score >= 60) return 'bg-yellow-500';
  return 'bg-red-500';
};

export const truncate = (str, n = 100) => str?.length > n ? str.substring(0, n) + '...' : str;