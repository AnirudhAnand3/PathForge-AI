import fs from 'fs';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');
import Resume from '../models/Resume.model.js';
import CareerProfile from '../models/CareerProfile.model.js';
import { analyzeResume } from '../services/openai.service.js';
import { cloudinary } from '../config/cloudinary.js';

export const uploadAndAnalyzeResume = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    let resumeText = '';
    try {
      const pdfBuffer = fs.readFileSync(req.file.path);
      const pdfData   = await pdfParse(pdfBuffer);
      resumeText      = pdfData.text || '';
    } catch (e) {
      console.error('PDF parse error:', e.message);
    }

    if (!resumeText || resumeText.trim().length < 50) {
      try { fs.unlinkSync(req.file.path); } catch {}
      return res.status(400).json({
        message: 'Could not extract text from PDF. Please ensure it is a text-based PDF, not a scanned image.'
      });
    }

    const profile      = await CareerProfile.findOne({ user: req.user.id });
    const targetCareer = profile?.selectedCareer || 'Software Engineer';
    const raw          = await analyzeResume(resumeText, targetCareer);

    const safeNum = (v) => (typeof v === 'number' && !isNaN(v)) ? Math.min(100, Math.max(0, v)) : 0;
    const safeArr = (v) => Array.isArray(v) ? v.filter(Boolean).map(String) : [];
    const safeStr = (v) => typeof v === 'string' ? v : '';

    const sections = raw.sections || {};
    const mapSec   = (key) => ({
      found:      Boolean(sections[key]?.found),
      quality:    safeNum(sections[key]?.quality),
      suggestion: safeStr(sections[key]?.suggestion),
    });

    const analysisData = {
      atsScore:         safeNum(raw.atsScore),
      overallScore:     safeNum(raw.overallScore),
      sections: {
        contact:    mapSec('contact'),
        summary:    mapSec('summary'),
        experience: mapSec('experience'),
        education:  mapSec('education'),
        skills:     mapSec('skills'),
        projects:   mapSec('projects'),
      },
      strengths:        safeArr(raw.strengths),
      improvements:     safeArr(raw.improvements),
      keywords:         safeArr(raw.keywords),
      missingKeywords:  safeArr(raw.missingKeywords),
      rewrittenSummary: safeStr(raw.rewrittenSummary),
    };

    const cloudResult = await cloudinary.uploader.upload(req.file.path, {
      folder:        'pathforge/resumes',
      resource_type: 'raw',
      public_id:     `resume_${req.user.id}_${Date.now()}`,
    });

    try { fs.unlinkSync(req.file.path); } catch {}

    const resume = await Resume.create({
      user:          req.user.id,
      fileUrl:       cloudResult.secure_url,
      publicId:      cloudResult.public_id,
      fileName:      req.file.originalname,
      extractedText: resumeText,
      ...analysisData,
    });

    await req.user.addXP(75);
    res.json({ resume, message: 'Resume analyzed! +75 XP' });
  } catch (err) {
    next(err);
  }
};

export const getMyResumes = async (req, res, next) => {
  try {
    const resumes = await Resume.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(resumes);
  } catch (err) { next(err); }
};

export const deleteResume = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, user: req.user.id });
    if (!resume) return res.status(404).json({ message: 'Resume not found' });
    if (resume.publicId) {
      await cloudinary.uploader.destroy(resume.publicId, { resource_type: 'raw' });
    }
    await resume.deleteOne();
    res.json({ message: 'Resume deleted' });
  } catch (err) { next(err); }
};