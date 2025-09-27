const Room = require('../models/chatRoom');
const rateLimit = {};

const setupSocket = (io) => {
  io.on('connection', (socket) => {
        // console.log('User connected:', socket.id); 
   socket.on('join-room', async (roomId) => {
  socket.join(roomId);

  try {
    const room = await Room.findById(roomId);
    if (room) {
      socket.emit('init', {
        messages: room.messages || [],
        workspace: room.notes || '',
      });
    } else {
      console.warn(`Room ${roomId} not found`);
    }
  } catch (error) {
    console.error(`Error fetching room ${roomId}:`, error);
  }
});

    socket.on('send-message', async ({ roomId, user, text }) => {
      // Rate limiting
      const now = Date.now();
      rateLimit[socket.id] = rateLimit[socket.id] || [];
      rateLimit[socket.id] = rateLimit[socket.id].filter(ts => now - ts < 60000);
      if (rateLimit[socket.id].length >= 5) return;

      rateLimit[socket.id].push(now);

      const message = { user, text, createdAt: new Date() };
      await Room.findByIdAndUpdate(roomId, { $push: { messages: message } });
      io.to(roomId).emit('new-message', message);
    });

    socket.on('update-workspace', async ({ roomId, notes }) => {
      await Room.findByIdAndUpdate(roomId, { notes });
      io.to(roomId).emit('workspace-updated', notes);
    });
  });
};

module.exports = setupSocket;