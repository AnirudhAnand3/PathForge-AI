import mongoose from 'mongoose';

const mentorSchema = new mongoose.Schema({
  user:         { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bio:          String,
  expertise:    [String],
  industry:     String,
  experience:   Number, // years
  company:      String,
  title:        String,
  linkedin:     String,
  availability: [{
    day:   String,
    slots: [String], // ['10:00', '14:00', '16:00']
  }],
  rating:       { type: Number, default: 0 },
  totalSessions:{ type: Number, default: 0 },
  reviews: [{
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating:  Number,
    comment: String,
    date:    { type: Date, default: Date.now },
  }],
  isAvailable:  { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model('Mentor', mentorSchema);