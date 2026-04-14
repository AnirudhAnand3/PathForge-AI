import Mentor from '../models/Mentor.model.js';
import User from '../models/User.model.js';
import CareerProfile from '../models/CareerProfile.model.js';

export const getAllMentors = async (req, res, next) => {
  try {
    const { expertise, industry, page = 1 } = req.query;
    const filter = { isAvailable: true };
    if (expertise) filter.expertise = { $in: [expertise] };
    if (industry)  filter.industry = industry;

    const mentors = await Mentor.find(filter)
      .populate('user', 'name avatar')
      .sort({ rating: -1 })
      .skip((page - 1) * 12)
      .limit(12);

    res.json(mentors);
  } catch (err) { next(err); }
};

export const getMentorById = async (req, res, next) => {
  try {
    const mentor = await Mentor.findById(req.params.id)
      .populate('user', 'name avatar xp level')
      .populate('reviews.student', 'name avatar');
    if (!mentor) return res.status(404).json({ message: 'Mentor not found' });
    res.json(mentor);
  } catch (err) { next(err); }
};

export const becomeMentor = async (req, res, next) => {
  try {
    const { bio, expertise, industry, experience, company, title, linkedin, availability } = req.body;

    const existing = await Mentor.findOne({ user: req.user.id });
    if (existing) return res.status(400).json({ message: 'Already registered as mentor' });

    const mentor = await Mentor.create({
      user: req.user.id,
      bio, expertise, industry, experience,
      company, title, linkedin, availability,
    });

    await User.findByIdAndUpdate(req.user.id, { role: 'mentor' });
    res.status(201).json(mentor);
  } catch (err) { next(err); }
};

export const getMentorMatches = async (req, res, next) => {
  try {
    const profile = await CareerProfile.findOne({ user: req.user.id });
    const userInterests = profile?.interests || [];
    const userSkills    = profile?.dominantSkills || [];
    const targetCareer  = profile?.selectedCareer || '';

    // Find mentors whose expertise overlaps
    const mentors = await Mentor.find({ isAvailable: true })
      .populate('user', 'name avatar xp level')
      .limit(20);

    // Score each mentor
    const scored = mentors.map(mentor => {
      let score = 0;
      if (mentor.expertise.some(e => userSkills.includes(e))) score += 40;
      if (mentor.expertise.some(e => targetCareer.toLowerCase().includes(e.toLowerCase()))) score += 35;
      if (mentor.industry && userInterests.includes(mentor.industry)) score += 25;
      score += mentor.rating * 2;
      return { ...mentor.toObject(), matchScore: Math.min(score, 100) };
    });

    scored.sort((a, b) => b.matchScore - a.matchScore);
    res.json(scored.slice(0, 9));
  } catch (err) { next(err); }
};

export const bookSession = async (req, res, next) => {
  try {
    const { date, slot, message } = req.body;
    const mentor = await Mentor.findById(req.params.id).populate('user', 'name email');
    if (!mentor) return res.status(404).json({ message: 'Mentor not found' });

    // In production: save booking to DB, send email notification
    // For now we return success
    res.json({
      message: 'Session request sent!',
      booking: { mentor: mentor.user.name, date, slot, status: 'pending' }
    });
  } catch (err) { next(err); }
};

export const reviewMentor = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const mentor = await Mentor.findById(req.params.id);
    if (!mentor) return res.status(404).json({ message: 'Mentor not found' });

    mentor.reviews.push({ student: req.user.id, rating, comment });
    // Recalculate average rating
    const avg = mentor.reviews.reduce((sum, r) => sum + r.rating, 0) / mentor.reviews.length;
    mentor.rating = Math.round(avg * 10) / 10;
    await mentor.save();

    res.json({ message: 'Review submitted!', rating: mentor.rating });
  } catch (err) { next(err); }
};