export const initSocketService = (io) => {
  const onlineUsers = new Map();

  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on('user:join', (userId) => {
      onlineUsers.set(userId, socket.id);
      socket.join(`user:${userId}`);
      io.emit('users:online', Array.from(onlineUsers.keys()));
    });

    // Real-time mentor matching notification
    socket.on('mentor:request', ({ mentorId, studentId, message }) => {
      const mentorSocket = onlineUsers.get(mentorId);
      if (mentorSocket) {
        io.to(`user:${mentorId}`).emit('mentor:new-request', {
          studentId, message, timestamp: new Date()
        });
      }
    });

    // Leaderboard XP update
    socket.on('xp:gained', ({ userId, xp, newTotal }) => {
      io.emit('leaderboard:update', { userId, xp, newTotal });
    });

    // Roadmap step completion broadcast
    socket.on('roadmap:step-complete', ({ userId, phase, career }) => {
      io.emit('feed:activity', {
        type: 'roadmap_complete',
        userId, phase, career,
        timestamp: new Date()
      });
    });

    socket.on('disconnect', () => {
      for (const [userId, socketId] of onlineUsers) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          break;
        }
      }
      io.emit('users:online', Array.from(onlineUsers.keys()));
    });
  });
};