import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import ReactMarkdown from 'react-markdown';

const SUGGESTED = [
  "What career should I choose?",
  "How do I prepare for my first interview?",
  "What skills should I learn in 2025?",
  "How do I negotiate salary?",
  "Should I do an MBA?",
];

export default function AICounselor() {
  const { user } = useSelector(s => s.auth);
  const [messages, setMessages] = useState([{
    role: 'assistant',
    content: `Hi ${user?.name?.split(' ')[0] || 'there'}! 👋 I'm your PathForge AI Counselor. I know your full career profile and I'm here to help you navigate every step of your journey. What's on your mind?`
  }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text = input) => {
    if (!text.trim() || loading) return;
    const userMsg = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    // Add streaming placeholder
    setMessages(prev => [...prev, { role: 'assistant', content: '', streaming: true }]);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/chat/stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ message: text, sessionId }),
      });

      if (!res.ok) throw new Error('Stream failed');
      setSessionId(res.headers.get('X-Session-Id') || sessionId);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(l => l.startsWith('data: '));

        for (const line of lines) {
          const data = line.replace('data: ', '');
          if (data === '[DONE]') break;
          try {
            const { content } = JSON.parse(data);
            fullContent += content;
            setMessages(prev => [
              ...prev.slice(0, -1),
              { role: 'assistant', content: fullContent, streaming: true }
            ]);
          } catch {}
        }
      }

      setMessages(prev => [...prev.slice(0, -1), { role: 'assistant', content: fullContent }]);
    } catch {
      setMessages(prev => [...prev.slice(0, -1), {
        role: 'assistant', content: 'Sorry, something went wrong. Please try again.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] max-w-4xl mx-auto p-6">
      <div className="mb-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-lg">🧠</div>
        <div>
          <h1 className="font-display font-bold text-white">AI Career Counselor</h1>
          <div className="flex items-center gap-2 text-xs text-green-400">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
            Online — knows your full profile
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 scrollbar-thin scrollbar-thumb-dark-border">
        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl px-5 py-3 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-brand-600 text-white rounded-br-sm'
                  : 'bg-dark-card border border-dark-border text-gray-200 rounded-bl-sm'
              }`}>
                {msg.role === 'assistant' ? (
                  <div className="prose prose-invert prose-sm max-w-none">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                    {msg.streaming && <span className="inline-block w-1 h-4 bg-brand-400 animate-pulse ml-1 rounded" />}
                  </div>
                ) : msg.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      {messages.length === 1 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {SUGGESTED.map((s, i) => (
            <button key={i} onClick={() => sendMessage(s)}
              className="text-xs px-3 py-1.5 bg-dark-card border border-dark-border rounded-full text-gray-300 hover:border-brand-500/50 hover:text-white transition-all">
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="flex gap-3">
        <input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
          placeholder="Ask anything about your career..."
          className="flex-1 bg-dark-card border border-dark-border rounded-xl px-4 py-3 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-brand-500/60 transition-colors" />
        <motion.button onClick={() => sendMessage()} disabled={loading || !input.trim()}
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          className="px-5 py-3 bg-brand-600 hover:bg-brand-500 disabled:opacity-40 rounded-xl font-medium transition-all">
          {loading ? '...' : '→'}
        </motion.button>
      </div>
    </div>
  );
}