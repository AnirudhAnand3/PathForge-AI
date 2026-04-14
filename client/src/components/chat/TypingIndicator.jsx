export default function TypingIndicator() {
  return (
    <div className="flex items-center gap-2 px-4 py-3 bg-dark-card border border-dark-border rounded-2xl rounded-bl-sm w-fit">
      {[0, 0.2, 0.4].map((delay, i) => (
        <span key={i} className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
          style={{ animationDelay: `${delay}s` }} />
      ))}
    </div>
  );
}