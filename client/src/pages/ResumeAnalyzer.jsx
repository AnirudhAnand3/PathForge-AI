import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';
import toast from 'react-hot-toast';

const ScoreBar = ({ label, score, suggestion }) => (
  <div className="mb-4">
    <div className="flex justify-between items-center mb-1">
      <span className="text-sm text-gray-300 font-medium">{label}</span>
      <span className={`text-sm font-bold ${score >= 80 ? 'text-green-400' : score >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>{score}/100</span>
    </div>
    <div className="w-full h-2 bg-dark-border rounded-full overflow-hidden">
      <motion.div initial={{ width: 0 }} animate={{ width: `${score}%` }} transition={{ duration: 1, delay: 0.3 }}
        className={`h-full rounded-full ${score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`} />
    </div>
    {suggestion && <p className="text-xs text-gray-500 mt-1">💡 {suggestion}</p>}
  </div>
);

export default function ResumeAnalyzer() {
  const [uploading, setUploading] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('resume', file);

    setUploading(true);
    const toastId = toast.loading('🔍 Analyzing your resume with AI...');
    try {
      const { data } = await api.post('/resume/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setAnalysis(data.resume);
      toast.success(`Analysis complete! ATS Score: ${data.resume.atsScore}/100`, { id: toastId });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed', { id: toastId });
    } finally {
      setUploading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { 'application/pdf': ['.pdf'] }, maxFiles: 1
  });

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-white mb-2">Resume Intelligence</h1>
        <p className="text-gray-400">AI-powered ATS scoring, keyword optimization, and professional feedback</p>
      </div>

      {/* Dropzone */}
      {!analysis && (
        <motion.div {...getRootProps()} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className={`border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer transition-all ${
            isDragActive ? 'border-brand-500 bg-brand-900/20' : 'border-dark-border hover:border-brand-500/50 hover:bg-dark-card'
          }`}>
          <input {...getInputProps()} />
          <div className="text-5xl mb-4">{uploading ? '⏳' : '📄'}</div>
          <h3 className="text-xl font-semibold text-white mb-2">
            {uploading ? 'Analyzing with AI...' : isDragActive ? 'Drop it here!' : 'Drop your resume (PDF)'}
          </h3>
          <p className="text-gray-400 text-sm">or click to browse • PDF only • Max 10MB</p>
        </motion.div>
      )}

      {/* Analysis Results */}
      <AnimatePresence>
        {analysis && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            {/* Score cards */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'ATS Score', value: analysis.atsScore, desc: 'Applicant Tracking System', color: analysis.atsScore >= 80 ? 'text-green-400' : 'text-yellow-400' },
                { label: 'Overall Score', value: analysis.overallScore, desc: 'Human recruiter impression', color: 'text-brand-400' },
              ].map((card, i) => (
                <motion.div key={i} initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ delay: i * 0.1 }}
                  className="bg-dark-card border border-dark-border rounded-2xl p-6 text-center">
                  <div className={`text-5xl font-bold ${card.color} mb-2`}>{card.value}</div>
                  <div className="text-sm font-semibold text-white">{card.label}</div>
                  <div className="text-xs text-gray-400">{card.desc}</div>
                </motion.div>
              ))}
            </div>

            {/* Section scores */}
            <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
              <h3 className="font-semibold text-white mb-5">Section-by-Section Analysis</h3>
              {Object.entries(analysis.sections || {}).map(([section, data]) => (
                <ScoreBar key={section} label={section.charAt(0).toUpperCase() + section.slice(1)}
                  score={data.quality} suggestion={data.suggestion} />
              ))}
            </div>

            {/* Strengths & improvements */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-dark-card border border-green-500/20 rounded-2xl p-5">
                <h3 className="font-semibold text-green-400 mb-3">✅ Strengths</h3>
                <ul className="space-y-2">
                  {analysis.strengths?.map((s, i) => <li key={i} className="text-sm text-gray-300">• {s}</li>)}
                </ul>
              </div>
              <div className="bg-dark-card border border-red-500/20 rounded-2xl p-5">
                <h3 className="font-semibold text-red-400 mb-3">⚠️ Improvements</h3>
                <ul className="space-y-2">
                  {analysis.improvements?.map((s, i) => <li key={i} className="text-sm text-gray-300">• {s}</li>)}
                </ul>
              </div>
            </div>

            {/* Missing keywords */}
            {analysis.missingKeywords?.length > 0 && (
              <div className="bg-dark-card border border-dark-border rounded-2xl p-5">
                <h3 className="font-semibold text-white mb-3">🔑 Missing Keywords (Add these!)</h3>
                <div className="flex flex-wrap gap-2">
                  {analysis.missingKeywords.map((kw, i) => (
                    <span key={i} className="px-3 py-1 bg-yellow-900/30 border border-yellow-500/30 rounded-full text-yellow-300 text-sm">{kw}</span>
                  ))}
                </div>
              </div>
            )}

            {/* AI-rewritten summary */}
            {analysis.rewrittenSummary && (
              <div className="bg-gradient-to-br from-brand-900/30 to-purple-900/30 border border-brand-500/20 rounded-2xl p-5">
                <h3 className="font-semibold text-brand-300 mb-3">✨ AI-Rewritten Professional Summary</h3>
                <p className="text-gray-200 text-sm leading-relaxed italic">"{analysis.rewrittenSummary}"</p>
              </div>
            )}

            <button onClick={() => setAnalysis(null)}
              className="w-full py-3 border border-dark-border rounded-xl text-gray-400 hover:text-white hover:border-gray-500 transition-all text-sm">
              Analyze another resume
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}