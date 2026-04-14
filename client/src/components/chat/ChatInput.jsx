import { useState } from 'react';

export default function ChatInput({ onSend, loading }) {
  const [value, setValue] = useState('');

  const handleSend = () => {
    if (!value.trim() || loading) return;
    onSend(value);
    setValue('');
  };

  return (
    <div className="flex gap-3">
      <textarea
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
        placeholder="Ask anything about your career..."
        rows={1}
        className="flex-1 bg-dark-card border border-dark-border rounded-xl px-4 py-3 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-brand-500/60 transition-colors resize-none"
      />
      <button onClick={handleSend} disabled={loading || !value.trim()}
        className="px-5 py-3 bg-brand-600 hover:bg-brand-500 disabled:opacity-40 rounded-xl font-medium transition-all text-white">
        {loading ? '⏳' : '→'}
      </button>
    </div>
  );
}