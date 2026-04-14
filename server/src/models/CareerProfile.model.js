import mongoose from 'mongoose';

const careerProfileSchema = new mongoose.Schema({
  user:               { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  // Onboarding results
  personalityType:    { type: String }, // MBTI-style: INTJ, ENFP, etc.
  dominantSkills:     [String],
  interests:          [String],
  educationLevel:     { type: String },
  currentDomain:      { type: String },
  // AI Analysis results
  recommendedCareers: [{
    title:          String,
    matchScore:     Number,
    description:    String,
    avgSalary:      String,
    growthRate:     String,
    requiredSkills: [String],
  }],
  selectedCareer:     { type: String },
  // Skill assessment
  skillScores: [{
    skill:    String,
    score:    Number,    // 0–100
    category: String,   // technical, soft, domain
  }],
  // Roadmap
  roadmap: [{
    phase:       { type: Number },
    title:       String,
    description: String,
    duration:    String,
    resources:   [{ title: String, url: String, type: String }],
    completed:   { type: Boolean, default: false },
    completedAt: Date,
  }],
  // Progress tracking
  overallProgress:    { type: Number, default: 0 },
  weeklyGoals:        [{ goal: String, completed: Boolean }],
  quizAnswers:        { type: Map, of: mongoose.Schema.Types.Mixed },
}, { timestamps: true });

export default mongoose.model('CareerProfile', careerProfileSchema);