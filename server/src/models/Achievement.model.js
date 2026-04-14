import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema({
  user:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  badgeId:     { type: String, required: true },
  name:        { type: String, required: true },
  icon:        { type: String, required: true },
  description: { type: String },
  earnedAt:    { type: Date, default: Date.now },
});

export default mongoose.model('Achievement', achievementSchema);