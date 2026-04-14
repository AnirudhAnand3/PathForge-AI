import dotenv from 'dotenv';
dotenv.config();

import OpenAI from 'openai';
import { PROMPTS } from '../utils/prompts.js';

const getClient = () => new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ── Career Analysis ──────────────────────────────────────────────
export const analyzeCareerFit = async (profileData) => {
  const response = await getClient().chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: PROMPTS.CAREER_ANALYSIS_SYSTEM },
      { role: 'user', content: JSON.stringify(profileData) }
    ],
    response_format: { type: 'json_object' },
    temperature: 0.7,
  });
  return JSON.parse(response.choices[0].message.content);
};

// ── Roadmap Generator ────────────────────────────────────────────
export const generateRoadmap = async (career, skills, profile) => {
  const response = await getClient().chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: PROMPTS.ROADMAP_GENERATOR_SYSTEM },
      {
        role: 'user',
        content: `Generate a detailed 6-phase learning roadmap for:
Career Goal: ${career}
Current Skills: ${skills.join(', ')}
Education: ${profile.educationLevel}
Interests: ${profile.interests.join(', ')}
Return valid JSON with phases array.`
      }
    ],
    response_format: { type: 'json_object' },
    temperature: 0.6,
  });
  return JSON.parse(response.choices[0].message.content);
};

// ── Resume Analysis ──────────────────────────────────────────────
export const analyzeResume = async (resumeText, targetCareer) => {
  const response = await getClient().chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: PROMPTS.RESUME_ANALYZER_SYSTEM },
      {
        role: 'user',
        content: `Resume Text:\n${resumeText}\n\nTarget Career: ${targetCareer}\n\nAnalyze and return JSON.`
      }
    ],
    response_format: { type: 'json_object' },
    temperature: 0.4,
  });
  return JSON.parse(response.choices[0].message.content);
};

// ── AI Counselor Chat (Streaming) ────────────────────────────────
export const streamCounselorResponse = async (messages, userContext, res) => {
  const systemPrompt = PROMPTS.COUNSELOR_SYSTEM.replace('{{CONTEXT}}', JSON.stringify(userContext));

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const stream = await getClient().chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'system', content: systemPrompt }, ...messages],
    stream: true,
    temperature: 0.75,
    max_tokens: 1000,
  });

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content || '';
    if (content) res.write(`data: ${JSON.stringify({ content })}\n\n`);
  }
  res.write('data: [DONE]\n\n');
  res.end();
};

// ── Skill Gap Detection ──────────────────────────────────────────
export const detectSkillGap = async (userSkills, targetCareer) => {
  const response = await getClient().chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: PROMPTS.SKILL_GAP_SYSTEM },
      {
        role: 'user',
        content: `Current skills: ${userSkills.join(', ')}\nTarget: ${targetCareer}\nReturn JSON with gaps, courses, timeline.`
      }
    ],
    response_format: { type: 'json_object' },
    temperature: 0.5,
  });
  return JSON.parse(response.choices[0].message.content);
};