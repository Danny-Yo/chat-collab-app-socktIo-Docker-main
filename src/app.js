// app.js
require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const socketio = require('socket.io');
const rateLimit = require('express-rate-limit');

const authRoutes = require('../src/routes/userRoute');
const roomRoutes = require('../src/routes/chatRoomRoute');
const  setupSocket = require('../src/sockets/socketHandler');
const connectDb = require("../src/config/db");

const app = express();
const server = http.createServer(app);
//const io = socketio(server, { cors: { origin: '*' } });

const io =  socketio(server, {
  cors: {
    origin: "*",       // Allow any origin for dev
    methods: ["GET", "POST"]
  }
});

// ✅ Apply rate limiting middleware (10 requests/min)
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // 10 requests per window per IP
  message: {
    status: 429,
    message: 'Too many requests. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(limiter); // ✅ Rate limiter added here

// Routes
app.use('/user', authRoutes);
app.use('/rooms', roomRoutes);

// Socket.io
setupSocket(io);

// MongoDB Connection
// mongoose.connect(process.env.MONGO_URI)
//   .then(() => {
//     console.log('MongoDB connected');
//     server.listen(process.env.PORT || 9000, () => {
//       console.log(`Server running on port ${process.env.PORT}`);
//     });
//   })
//   .catch(err => console.error('MongoDB connection error:', err));

connectDb();

app.get("/", (req, res) => {
  res.send("🚀 Chat App backend is running!");
});


server.listen(9000, () => {
  console.log("✅ Server is successfully listening on port 9000");
});



// At the bottom of app.js
module.exports = app;
