import express from 'express';
import multer from 'multer';
import path from 'path';
import { uploadAndAnalyzeResume, getMyResumes, deleteResume } from '../controllers/resume.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { aiLimiter } from '../middleware/rateLimit.middleware.js';

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename:    (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') cb(null, true);
    else cb(new Error('Only PDF files allowed'), false);
  },
});

const router = express.Router();
router.use(protect);

router.post('/upload',  aiLimiter, upload.single('resume'), uploadAndAnalyzeResume);
router.get('/mine',     getMyResumes);
router.delete('/:id',   deleteResume);

export default router;