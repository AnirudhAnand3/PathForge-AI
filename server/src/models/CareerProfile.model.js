import mongoose from 'mongoose';

const careerProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // 🧠 Onboarding results
    personalityType: { type: String }, // MBTI-style: INTJ, ENFP, etc.
    dominantSkills: [String],
    interests: [String],
    educationLevel: { type: String },
    currentDomain: { type: String },

    // 🤖 AI Analysis results
    recommendedCareers: [
      {
        title: String,
        matchScore: Number,
        description: String,
        avgSalary: String,
        growthRate: String,
        requiredSkills: [String],
      },
    ],

    selectedCareer: { type: String },

    // 📊 Skill assessment
    skillScores: [
      {
        skill: String,
        score: Number, // 0–100
        category: String, // technical, soft, domain
      },
    ],

    // 🗺️ Roadmap (FIXED)
    roadmap: [
      {
        phase:       { type: Number },
        title:       { type: String, default: '' },
        description: { type: String, default: '' },
        duration:    { type: String, default: '' },

        resources: [
          {
            title: { type: String, default: '' },
            url:   { type: String, default: '' },
            type:  { 
              type: String, 
              enum: ['course', 'book', 'video', 'project', 'article'], 
              default: 'article' 
            },
            free:  { type: Boolean, default: true },
          },
        ],

        completed:   { type: Boolean, default: false },
        completedAt: { type: Date },
      },
    ],

    // 📈 Progress tracking
    overallProgress: { type: Number, default: 0 },
    weeklyGoals: [
      {
        goal: String,
        completed: Boolean,
      },
    ],

    quizAnswers: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
    },
  },
  { timestamps: true }
);

export default mongoose.model('CareerProfile', careerProfileSchema);