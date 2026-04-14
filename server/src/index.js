import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { connectDB } from './config/db.js';
import { initSocketService } from './services/socket.service.js';
import authRoutes from './routes/auth.routes.js';
import careerRoutes from './routes/career.routes.js';
import resumeRoutes from './routes/resume.routes.js';
import mentorRoutes from './routes/mentor.routes.js';
import chatRoutes from './routes/chat.routes.js';
import gamificationRoutes from './routes/gamification.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';
import { errorHandler } from './middleware/error.middleware.js';

const app = express();
const httpServer = http.createServer(app);

export const io = new Server(httpServer, {
  cors: { origin: process.env.CLIENT_URL, credentials: true }
});

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

connectDB();
initSocketService(io);

app.use('/api/auth',          authRoutes);
app.use('/api/career',        careerRoutes);
app.use('/api/resume',        resumeRoutes);
app.use('/api/mentors',       mentorRoutes);
app.use('/api/chat',          chatRoutes);
app.use('/api/gamification',  gamificationRoutes);
app.use('/api/analytics',     analyticsRoutes);

app.get('/api/health', (_, res) => res.json({ status: 'PathForge API running 🚀' }));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));