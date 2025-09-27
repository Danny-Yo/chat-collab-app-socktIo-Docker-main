const { io } = require('socket.io-client');

console.log("Script started");

const socket = io('http://localhost:9000');

const roomId = '68364541eb38f03c526a2947'; // Use real room ID if needed
const userId = '683635e1ae79bcbbdd9eefa6';
const username = 'tester';

console.log("Attempting to connect...");

socket.on('connect', () => {
  console.log('Connected to server');

  socket.emit('join-room', roomId);

  socket.on('init', (room) => {
    console.log('Room Data:', room);

    socket.emit('send-message', {
      roomId,
      userId,
      username,
      text: 'Hello from test client!'
    });

    socket.emit('update-workspace', {
      roomId,
      workspace: 'Test update from socket.io-client.'
    });
  });

  socket.on('new-message', (msg) => {
    console.log('New Message:', msg);
  });

  socket.on('workspace-updated', (workspace) => {
    console.log('Workspace Updated:', workspace);
  });

  socket.on('error', (err) => {
    console.error('Socket error:', err);
  });
});

socket.on('connect_error', (err) => {
  console.error('Connection failed:', err.message);
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});

