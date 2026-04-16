// Run with: node seedMentors.js
// Place this file in your server/src/ folder and run once

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import User from './models/User.model.js';
import Mentor from './models/Mentor.model.js';

const mentorData = [
  {
    name: 'Priya Sharma',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
    bio: 'Senior Software Engineer at Google with 8 years of experience in full-stack development and cloud architecture.',
    expertise: ['JavaScript', 'React', 'Node.js', 'AWS', 'System Design'],
    industry: 'Technology',
    experience: 8,
    company: 'Google',
    title: 'Senior Software Engineer',
    linkedin: 'https://linkedin.com',
    rating: 4.9,
  },
  {
    name: 'Rahul Verma',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul',
    bio: 'ML Engineer at Microsoft. Passionate about making AI accessible and helping students break into the field.',
    expertise: ['Python', 'Machine Learning', 'TensorFlow', 'Data Science', 'NLP'],
    industry: 'Artificial Intelligence',
    experience: 6,
    company: 'Microsoft',
    title: 'ML Engineer',
    linkedin: 'https://linkedin.com',
    rating: 4.7,
  },
  {
    name: 'Ananya Krishnan',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ananya',
    bio: 'DevOps Lead at Amazon. Specialise in Kubernetes, CI/CD and cloud-native architectures.',
    expertise: ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Linux'],
    industry: 'Cloud Computing',
    experience: 7,
    company: 'Amazon',
    title: 'DevOps Lead',
    linkedin: 'https://linkedin.com',
    rating: 4.8,
  },
  {
    name: 'Karthik Nair',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Karthik',
    bio: 'Product Manager at Flipkart. Ex-engineer turned PM. Helping engineers transition into product roles.',
    expertise: ['Product Management', 'Agile', 'JavaScript', 'Strategy', 'Analytics'],
    industry: 'E-Commerce',
    experience: 9,
    company: 'Flipkart',
    title: 'Senior Product Manager',
    linkedin: 'https://linkedin.com',
    rating: 4.6,
  },
  {
    name: 'Sneha Reddy',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha',
    bio: 'Cybersecurity Analyst at Infosys. CISSP certified. Passionate about application security and ethical hacking.',
    expertise: ['Cybersecurity', 'Penetration Testing', 'Python', 'Network Security', 'Linux'],
    industry: 'Cybersecurity',
    experience: 5,
    company: 'Infosys',
    title: 'Security Analyst',
    linkedin: 'https://linkedin.com',
    rating: 4.5,
  },
  {
    name: 'Arjun Mehta',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun',
    bio: 'Full-Stack Developer at Razorpay. Fintech specialist with deep expertise in payments and backend systems.',
    expertise: ['Java', 'Spring Boot', 'PostgreSQL', 'React', 'Microservices'],
    industry: 'Fintech',
    experience: 6,
    company: 'Razorpay',
    title: 'Full-Stack Engineer',
    linkedin: 'https://linkedin.com',
    rating: 4.8,
  },
  {
    name: 'Divya Iyer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Divya',
    bio: 'Data Engineer at Swiggy. Building large-scale data pipelines and real-time analytics systems.',
    expertise: ['Python', 'Spark', 'Kafka', 'SQL', 'Data Engineering', 'AWS'],
    industry: 'Technology',
    experience: 5,
    company: 'Swiggy',
    title: 'Data Engineer',
    linkedin: 'https://linkedin.com',
    rating: 4.7,
  },
  {
    name: 'Vikram Patel',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram',
    bio: 'iOS & Android developer at CRED. 50+ apps shipped. Expert in mobile architecture and App Store optimisation.',
    expertise: ['Swift', 'Kotlin', 'React Native', 'Mobile Development', 'Firebase'],
    industry: 'Mobile',
    experience: 7,
    company: 'CRED',
    title: 'Mobile Lead',
    linkedin: 'https://linkedin.com',
    rating: 4.9,
  },
  {
    name: 'Meera Subramanian',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Meera',
    bio: 'Blockchain developer at Polygon. Smart contracts, DeFi, and Web3 are my playground.',
    expertise: ['Solidity', 'Web3', 'Blockchain', 'JavaScript', 'Ethereum'],
    industry: 'Blockchain',
    experience: 4,
    company: 'Polygon',
    title: 'Blockchain Engineer',
    linkedin: 'https://linkedin.com',
    rating: 4.6,
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI);
  console.log('✅ Connected to MongoDB');

  // Clear existing mentor users created by seed (identified by a flag)
  await Mentor.deleteMany({});
  console.log('🗑  Cleared existing mentors');

  for (const data of mentorData) {
    // Create a placeholder user for each mentor
    let user = await User.findOne({ email: `${data.name.replace(/\s/g, '').toLowerCase()}@mentor.pathforge` });
    if (!user) {
      user = await User.create({
        name:       data.name,
        email:      `${data.name.replace(/\s/g, '').toLowerCase()}@mentor.pathforge`,
        avatar:     data.avatar,
        role:       'mentor',
        password:   'SeedPassword@123',
        isVerified: true,
      });
    }

    await Mentor.create({
      user:        user._id,
      bio:         data.bio,
      expertise:   data.expertise,
      industry:    data.industry,
      experience:  data.experience,
      company:     data.company,
      title:       data.title,
      linkedin:    data.linkedin,
      rating:      data.rating,
      isAvailable: true,
      availability: [
        { day: 'Monday',    slots: ['10:00', '14:00', '17:00'] },
        { day: 'Wednesday', slots: ['11:00', '15:00'] },
        { day: 'Friday',    slots: ['10:00', '13:00', '16:00'] },
      ],
    });

    console.log(`✅ Seeded mentor: ${data.name}`);
  }

  console.log('\n🎉 All mentors seeded successfully!');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });