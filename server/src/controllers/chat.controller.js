import ChatSession from '../models/ChatSession.model.js';
import CareerProfile from '../models/CareerProfile.model.js';
import { streamCounselorResponse } from '../services/openai.service.js';

export const streamChat = async (req, res, next) => {
  try {
    const { message, sessionId } = req.body;

    let session = sessionId
      ? await ChatSession.findById(sessionId)
      : await ChatSession.create({ user: req.user.id, messages: [] });

    // Add user message
    session.messages.push({ role: 'user', content: message, timestamp: new Date() });

    // Build context
    const profile = await CareerProfile.findOne({ user: req.user.id });
    const userContext = {
      name: req.user.name,
      career: profile?.selectedCareer,
      personality: profile?.personalityType,
      skills: profile?.dominantSkills,
      progress: profile?.overallProgress,
      level: req.user.level,
    };

    // Last 20 messages for context window
    const recentMessages = session.messages.slice(-20).map(m => ({
      role: m.role, content: m.content
    }));

    // Stream the response
    await streamCounselorResponse(recentMessages, userContext, res);

    // Save assistant response (non-blocking)
    session.messages.push({ role: 'assistant', content: '[streamed]', timestamp: new Date() });
    session.save();
  } catch (err) {
    next(err);
  }
};
export const getSessions = async (req, res, next) => {
  try {
    const sessions = await ChatSession.find({ user: req.user.id })
      .sort({ updatedAt: -1 })
      .select('title createdAt updatedAt')
      .limit(20);
    res.json(sessions);
  } catch (err) { next(err); }
};

export const getChatHistory = async (req, res, next) => {
  try {
    const session = await ChatSession.findOne({ _id: req.params.sessionId, user: req.user.id });
    if (!session) return res.status(404).json({ message: 'Session not found' });
    res.json(session);
  } catch (err) { next(err); }
};