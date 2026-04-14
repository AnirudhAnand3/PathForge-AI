import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts';

export default function SkillRadar({ skillScores }) {
  const data = skillScores?.map(s => ({ skill: s.skill, score: s.score })) || [];
  if (!data.length) return null;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RadarChart data={data}>
        <PolarGrid stroke="#1e1e2e" />
        <PolarAngleAxis dataKey="skill" tick={{ fill: '#9ca3af', fontSize: 11 }} />
        <Tooltip contentStyle={{ background: '#111118', border: '1px solid #1e1e2e', borderRadius: 8, color: '#fff' }} />
        <Radar name="Skills" dataKey="score" stroke="#6366f1" fill="#6366f1" fillOpacity={0.25} />
      </RadarChart>
    </ResponsiveContainer>
  );
}