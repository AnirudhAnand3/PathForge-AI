import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Upload, FileText, Trash2 } from 'lucide-react';

const ScoreRing = ({ score, size = 80 }) => {
  const r   = size / 2 - 6;
  const circ = 2 * Math.PI * r;
  const pct  = (score / 100) * circ;
  const color = score >= 80 ? '#26de81' : score >= 60 ? '#fd9644' : '#fc5c65';
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" />
      <motion.circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="5"
        strokeLinecap="round" strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: circ - pct }}
        transition={{ duration: 1.2, ease: 'easeOut' }} />
    </svg>
  );
};

const ScoreBar = ({ label, score, suggestion }) => {
  const color = score >= 80 ? '#26de81' : score >= 60 ? '#fd9644' : '#fc5c65';
  return (
    <div style={{ marginBottom: '16px' }}>
      <div className="flex justify-between items-center mb-2">
        <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', textTransform: 'capitalize' }}>{label}</span>
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color }}>{score}/100</span>
      </div>
      <div className="w-full rounded-full overflow-hidden" style={{ height: '4px', background: 'rgba(255,255,255,0.07)' }}>
        <motion.div initial={{ width: 0 }} animate={{ width: `${score}%` }}
          transition={{ duration: 1, delay: 0.3 }}
          className="h-full rounded-full" style={{ background: color }} />
      </div>
      {suggestion && <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.28)', marginTop: '4px' }}>💡 {suggestion}</p>}
    </div>
  );
};

export default function ResumeAnalyzer() {
  const [uploading, setUploading] = useState(false);
  const [analysis, setAnalysis]   = useState(null);

  const onDrop = useCallback(async (files) => {
    const file = files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('resume', file);
    setUploading(true);
    const id = toast.loading('🔍 Analyzing your resume with AI...');
    try {
      const { data } = await api.post('/resume/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setAnalysis(data.resume);
      toast.success(`Done! ATS Score: ${data.resume.atsScore}/100`, { id });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed', { id });
    } finally { setUploading(false); }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { 'application/pdf': ['.pdf'] }, maxFiles: 1
  });

  return (
    <div style={{ padding: '32px', maxWidth: '900px', margin: '0 auto' }}>

      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-display font-medium text-white mb-2" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)' }}>
          Resume <span className="font-serif italic font-light" style={{ opacity: 0.7 }}>Intelligence.</span>
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.9rem' }}>
          AI-powered ATS scoring, keyword gap analysis, and professional rewrites
        </p>
      </motion.div>

      {!analysis && (
        <motion.div {...getRootProps()} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          whileHover={{ borderColor: 'rgba(112,161,255,0.3)' }}
          style={{
            border: `2px dashed ${isDragActive ? 'rgba(112,161,255,0.5)' : 'rgba(255,255,255,0.1)'}`,
            background: isDragActive ? 'rgba(112,161,255,0.05)' : 'rgba(255,255,255,0.02)',
            borderRadius: '24px', padding: '80px 24px', textAlign: 'center', cursor: 'pointer',
            transition: 'all 0.3s ease',
          }}>
          <input {...getInputProps()} />
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>{uploading ? '⏳' : '📄'}</div>
          <h3 className="font-display font-medium text-white mb-2" style={{ fontSize: '1.3rem' }}>
            {uploading ? 'Analyzing with GPT-4o...' : isDragActive ? 'Drop it here' : 'Drop your resume'}
          </h3>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem' }}>
            PDF only · Max 10MB · Text-based PDFs only (not scanned)
          </p>
          {!uploading && (
            <button style={{ marginTop: '24px', padding: '10px 24px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', cursor: 'pointer' }}>
              Or click to browse
            </button>
          )}
        </motion.div>
      )}

      <AnimatePresence>
        {analysis && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
            {/* Score cards */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'ATS Score', value: analysis.atsScore, sub: 'Applicant Tracking System' },
                { label: 'Overall Score', value: analysis.overallScore, sub: 'Human recruiter impression' },
              ].map((card, i) => {
                const color = card.value >= 80 ? '#26de81' : card.value >= 60 ? '#fd9644' : '#fc5c65';
                return (
                  <motion.div key={i} initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ delay: i * 0.1 }}
                    style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '28px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ position: 'relative' }}>
                      <ScoreRing score={card.value} />
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: '1.1rem', fontWeight: 700, color }}>{card.value}</span>
                      </div>
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: 'white', fontSize: '1rem' }}>{card.label}</div>
                      <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.78rem', marginTop: '2px' }}>{card.sub}</div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Section analysis */}
            <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '28px' }}>
              <h3 style={{ fontWeight: 600, color: 'white', marginBottom: '20px' }}>Section Analysis</h3>
              {Object.entries(analysis.sections || {}).map(([section, data]) => (
                <ScoreBar key={section}
                  label={section.charAt(0).toUpperCase() + section.slice(1)}
                  score={data.quality || 0}
                  suggestion={data.suggestion} />
              ))}
            </div>

            {/* Strengths + Improvements */}
            <div className="grid grid-cols-2 gap-4">
              <div style={{ background: 'rgba(38,222,129,0.04)', border: '1px solid rgba(38,222,129,0.12)', borderRadius: '20px', padding: '24px' }}>
                <h3 style={{ color: '#26de81', fontWeight: 600, marginBottom: '12px', fontSize: '0.9rem' }}>✅ Strengths</h3>
                {(analysis.strengths || []).length > 0
                  ? analysis.strengths.map((s, i) => <p key={i} style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.83rem', marginBottom: '6px' }}>• {s}</p>)
                  : <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.83rem' }}>Complete more sections</p>}
              </div>
              <div style={{ background: 'rgba(252,92,101,0.04)', border: '1px solid rgba(252,92,101,0.12)', borderRadius: '20px', padding: '24px' }}>
                <h3 style={{ color: '#fc5c65', fontWeight: 600, marginBottom: '12px', fontSize: '0.9rem' }}>⚠️ Improvements</h3>
                {(analysis.improvements || []).length > 0
                  ? analysis.improvements.map((s, i) => <p key={i} style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.83rem', marginBottom: '6px' }}>• {s}</p>)
                  : <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.83rem' }}>Looking good!</p>}
              </div>
            </div>

            {/* Missing keywords */}
            {analysis.missingKeywords?.length > 0 && (
              <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '24px' }}>
                <h3 style={{ fontWeight: 600, color: 'white', marginBottom: '14px', fontSize: '0.9rem' }}>🔑 Add These Keywords</h3>
                <div className="flex flex-wrap gap-2">
                  {analysis.missingKeywords.map((kw, i) => (
                    <span key={i} style={{ padding: '5px 14px', background: 'rgba(253,150,68,0.1)', border: '1px solid rgba(253,150,68,0.2)', borderRadius: '99px', color: '#fd9644', fontSize: '0.8rem' }}>{kw}</span>
                  ))}
                </div>
              </div>
            )}

            {/* AI rewritten summary */}
            {analysis.rewrittenSummary && analysis.rewrittenSummary !== 'Rewritten professional summary' && (
              <div style={{ background: 'linear-gradient(135deg, rgba(112,161,255,0.06), rgba(165,94,234,0.06))', border: '1px solid rgba(112,161,255,0.15)', borderRadius: '20px', padding: '24px' }}>
                <h3 style={{ color: '#70a1ff', fontWeight: 600, marginBottom: '12px', fontSize: '0.9rem' }}>✨ AI-Rewritten Summary</h3>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.88rem', lineHeight: 1.75, fontStyle: 'italic' }}>
                  "{analysis.rewrittenSummary}"
                </p>
              </div>
            )}

            <button onClick={() => setAnalysis(null)}
              style={{ width: '100%', padding: '12px', borderRadius: '12px', background: 'none', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', fontSize: '0.85rem' }}>
              Analyze another resume
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}