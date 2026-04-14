export default function LeaderboardRow({ entry, index }) {
  const rankColors = ['text-yellow-400', 'text-gray-300', 'text-amber-600'];
  const rankIcons  = ['🥇', '🥈', '🥉'];

  return (
    <div className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
      entry.isCurrentUser
        ? 'bg-brand-900/30 border border-brand-500/30'
        : 'hover:bg-white/5'
    }`}>
      <div className={`w-8 text-center font-bold ${rankColors[index] || 'text-gray-500'}`}>
        {index < 3 ? rankIcons[index] : `#${entry.rank}`}
      </div>
      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-sm font-bold flex-shrink-0">
        {entry.name?.charAt(0).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-white truncate">
          {entry.name} {entry.isCurrentUser && <span className="text-brand-400 text-xs">(you)</span>}
        </div>
        <div className="text-xs text-gray-400">Level {entry.level} · 🔥 {entry.streak} streak</div>
      </div>
      <div className="text-right">
        <div className="text-sm font-bold text-brand-400">{entry.xp.toLocaleString()}</div>
        <div className="text-xs text-gray-500">XP</div>
      </div>
    </div>
  );
}