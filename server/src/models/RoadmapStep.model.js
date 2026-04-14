import mongoose from 'mongoose';

// Standalone roadmap steps if needed separately from CareerProfile
const roadmapStepSchema = new mongoose.Schema({
  user:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  career:      { type: String, required: true },
  phase:       { type: Number, required: true },
  title:       { type: String, required: true },
  description: { type: String },
  duration:    { type: String },
  resources: [{
    title: String,
    url:   String,
    type:  { type: String, enum: ['course', 'book', 'video', 'project', 'article'] },
    free:  Boolean,
  }],
  completed:   { type: Boolean, default: false },
  completedAt: { type: Date },
}, { timestamps: true });

export default mongoose.model('RoadmapStep', roadmapStepSchema);