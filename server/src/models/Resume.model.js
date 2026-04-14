import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
  user:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fileUrl:    { type: String, required: true },
  publicId:   { type: String },
  fileName:   { type: String },
  // AI Analysis
  atsScore:         { type: Number },   // 0–100
  overallScore:     { type: Number },
  extractedText:    { type: String },
  sections: {
    contact:      { found: Boolean, quality: Number },
    summary:      { found: Boolean, quality: Number, suggestion: String },
    experience:   { found: Boolean, quality: Number, suggestion: String },
    education:    { found: Boolean, quality: Number },
    skills:       { found: Boolean, quality: Number, suggestion: String },
    projects:     { found: Boolean, quality: Number },
  },
  strengths:        [String],
  improvements:     [String],
  keywords:         [String],
  missingKeywords:  [String],
  rewrittenSummary: { type: String },
  analysisDate:     { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model('Resume', resumeSchema);