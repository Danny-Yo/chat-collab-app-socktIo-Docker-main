require('dotenv').config({ path: '.env.test' });
const mongoose = require('mongoose');
const { Server } = require('socket.io');
const Client = require('socket.io-client');
const http = require('http');
const setupSocket = require('../src/sockets/socketHandler');
const Room = require('../src/models/chatRoom');

let io, clientSocket, httpServer;

beforeAll(async () => {
  await mongoose.connect("mongodb+srv://abhishekPratap12:1234@cluster0.b55ht8m.mongodb.net/Task-Managment-Database?retryWrites=true&w=majority");

  httpServer = http.createServer();
  io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  setupSocket(io);

  await new Promise((resolve) => httpServer.listen(4001, resolve));

  clientSocket = Client('http://localhost:4001');
  await new Promise((resolve) => clientSocket.on('connect', resolve));
}, 20000); // Allow up to 20s for DB and socket to connect

afterAll(async () => {
  if (clientSocket?.connected) {
    clientSocket.disconnect();
  }

  await new Promise((resolve) => {
    io.close(() => {
      resolve();
    });
  });

  await mongoose.connection.close();

  await new Promise((resolve) => {
    httpServer.close(() => {
      resolve();
    });
  });
}, 15000); // Allow teardown to take up to 15s

test('should receive new message after send-message event', (done) => {
  const mockRoomId = new mongoose.Types.ObjectId().toString();

  Room.create({ _id: mockRoomId, name: 'Test Room', messages: [] })
    .then(() => {
      clientSocket.emit('join-room', mockRoomId);

      clientSocket.on('new-message', (msg) => {
        try {
          expect(msg.text).toBe('Test Message');
          expect(msg.user.name).toBe('Tester');
          done(); // success
        } catch (err) {
          done(err); // failure
        }
      });

      clientSocket.emit('send-message', {
        roomId: mockRoomId,
        user: {
          _id: 'test-user-id',
          name: 'Tester',
        },
        text: 'Test Message',
      });
    })
    .catch(err => done(err));
}, 10000); // 10s timeout for the test
