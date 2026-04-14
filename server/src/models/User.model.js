import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name:          { type: String, required: true, trim: true },
  email:         { type: String, required: true, unique: true, lowercase: true },
  password:      { type: String, required: true, minlength: 6 },
  avatar:        { type: String, default: '' },
  role:          { type: String, enum: ['student', 'mentor', 'admin'], default: 'student' },
  isVerified:    { type: Boolean, default: false },
  otp:           { type: String },
  otpExpiry:     { type: Date },
  xp:            { type: Number, default: 0 },
  level:         { type: Number, default: 1 },
  streak:        { type: Number, default: 0 },
  lastActive:    { type: Date, default: Date.now },
  badges:        [{ type: mongoose.Schema.Types.ObjectId, ref: 'Achievement' }],
  careerProfile: { type: mongoose.Schema.Types.ObjectId, ref: 'CareerProfile' },
  following:     [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  followers:     [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

// ✅ NO next() in async hooks — Mongoose 7+ handles promise automatically
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.addXP = async function (points) {
  this.xp += points;
  this.level = Math.floor(1 + Math.sqrt(this.xp / 100));
  await this.save();
};

export default mongoose.model('User', userSchema);