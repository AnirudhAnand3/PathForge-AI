import fs from 'fs';
import { createRequire } from 'module';
import Resume from '../models/Resume.model.js';
import CareerProfile from '../models/CareerProfile.model.js';
import { analyzeResume } from '../services/openai.service.js';
import { cloudinary } from '../config/cloudinary.js';

const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

export const uploadAndAnalyzeResume = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const pdfBuffer = fs.readFileSync(req.file.path);
    const pdfData = await pdfParse(pdfBuffer);
    const resumeText = pdfData.text;

    const profile = await CareerProfile.findOne({ user: req.user.id });
    const targetCareer = profile?.selectedCareer || 'Software Engineer';

    const analysis = await analyzeResume(resumeText, targetCareer);

    const cloudResult = await cloudinary.uploader.upload(req.file.path, {
      folder: 'pathforge/resumes',
      resource_type: 'raw',
      public_id: `resume_${req.user.id}_${Date.now()}`,
    });

    fs.unlinkSync(req.file.path);

    const resume = await Resume.create({
      user: req.user.id,
      fileUrl: cloudResult.secure_url,
      publicId: cloudResult.public_id,
      fileName: req.file.originalname,
      extractedText: resumeText,
      ...analysis,
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
  } catch (err) {
    next(err);
  }
};

export const deleteResume = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, user: req.user.id });
    if (!resume) return res.status(404).json({ message: 'Resume not found' });
    if (resume.publicId) await cloudinary.uploader.destroy(resume.publicId, { resource_type: 'raw' });
    await resume.deleteOne();
    res.json({ message: 'Resume deleted' });
  } catch (err) {
    next(err);
  }
};