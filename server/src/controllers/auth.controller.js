import User from '../models/User.model.js';
import CareerProfile from '../models/CareerProfile.model.js';
import jwt from 'jsonwebtoken';
import { sendOTPEmail } from '../services/email.service.js';

const generateToken = (id) => jwt.sign(
  { id },
  process.env.JWT_SECRET,
  { expiresIn: process.env.JWT_EXPIRE || '7d' }
);

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: 'All fields required' });

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: 'Email already registered' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    const user = await User.create({ name, email, password, otp, otpExpiry });
    const profile = await CareerProfile.create({ user: user._id });
    user.careerProfile = profile._id;
    await user.save();

    sendOTPEmail(email, name, otp).catch(err => console.error('Email error:', err.message));

    return res.status(201).json({
      message: 'Account created. Please verify your email.',
      userId: user._id,
    });
  } catch (err) {
    console.error('Register error:', err.message);
    return res.status(500).json({ message: err.message });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { userId, otp } = req.body;
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.otp !== otp) return res.status(400).json({ message: 'Invalid OTP' });
    if (new Date() > user.otpExpiry) return res.status(400).json({ message: 'OTP expired' });

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    const token = generateToken(user._id);
    return res.json({ token, message: 'Email verified!', needsOnboarding: true });
  } catch (err) {
    console.error('VerifyOTP error:', err.message);
    return res.status(500).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).populate('careerProfile');

    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
    if (!user.isVerified) return res.status(403).json({ message: 'Please verify your email first' });

    const today = new Date();
    const lastActive = new Date(user.lastActive || today);
    const diffDays = Math.floor((today - lastActive) / (1000 * 60 * 60 * 24));
    if (diffDays === 1) user.streak += 1;
    else if (diffDays > 1) user.streak = 0;
    user.lastActive = today;
    await user.save();

    const token = generateToken(user._id);
    return res.json({
      token,
      user: {
        id:              user._id,
        name:            user.name,
        email:           user.email,
        avatar:          user.avatar,
        xp:              user.xp,
        level:           user.level,
        streak:          user.streak,
        careerProfile:   user.careerProfile,
        needsOnboarding: !user.careerProfile?.selectedCareer,
      },
    });
  } catch (err) {
    console.error('Login error:', err.message);
    return res.status(500).json({ message: err.message });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('careerProfile')
      .populate('badges')
      .select('-password -otp');
    return res.json(user);
  } catch (err) {
    console.error('GetMe error:', err.message);
    return res.status(500).json({ message: err.message });
  }
};

export const googleAuth = async (req, res) => {
  try {
    const { access_token } = req.body;
    if (!access_token)
      return res.status(400).json({ message: 'No access token provided' });

    const googleRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    if (!googleRes.ok)
      return res.status(400).json({ message: 'Invalid Google token' });

    const gUser = await googleRes.json();
    if (!gUser.email)
      return res.status(400).json({ message: 'Could not get email from Google' });

    let user = await User.findOne({ email: gUser.email }).populate('careerProfile');

    if (!user) {
      const pwd = `Goo${Math.random().toString(36).slice(2, 10)}gle!`;
      user = await User.create({
        name:       gUser.name || gUser.email.split('@')[0],
        email:      gUser.email,
        password:   pwd,
        avatar:     gUser.picture || '',
        isVerified: true,
      });
      const profile = await CareerProfile.create({ user: user._id });
      user.careerProfile = profile._id;
      await user.save();
      user = await User.findById(user._id).populate('careerProfile');
    }

    const today = new Date();
    const lastActive = new Date(user.lastActive || today);
    const diffDays = Math.floor((today - lastActive) / (1000 * 60 * 60 * 24));
    if (diffDays === 1) user.streak += 1;
    else if (diffDays > 1) user.streak = 0;
    user.lastActive = today;
    await user.save();

    const token = generateToken(user._id);

    return res.status(200).json({
      token,
      user: {
        id:              user._id,
        name:            user.name,
        email:           user.email,
        avatar:          user.avatar,
        xp:              user.xp,
        level:           user.level,
        streak:          user.streak,
        needsOnboarding: !user.careerProfile?.selectedCareer,
      },
    });
  } catch (err) {
    console.error('Google auth error:', err.message, err.stack);
    return res.status(500).json({ message: 'Google auth failed', error: err.message });
  }
};