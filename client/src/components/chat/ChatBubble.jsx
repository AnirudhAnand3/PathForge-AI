import ReactMarkdown from 'react-markdown';

export default function ChatBubble({ message }) {
  const isUser = message.role === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-xs mr-2 flex-shrink-0 mt-1">
          🧠
        </div>
      )}
      <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
        isUser
          ? 'bg-brand-600 text-white rounded-br-sm'
          : 'bg-dark-card border border-dark-border text-gray-200 rounded-bl-sm'
      }`}>
        {isUser ? message.content : (
          <div className="prose prose-invert prose-sm max-w-none">
            <ReactMarkdown>{message.content}</ReactMarkdown>
            {message.streaming && (
              <span className="inline-block w-1 h-4 bg-brand-400 animate-pulse ml-1 rounded align-middle" />
            )}
          </div>
        )}
      </div>
    </div>
  );
}