// app.js
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // frontend vite dev server
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// 🚀 Test route
app.get("/", (req, res) => {
  res.send("🚀 Chat App backend is running!");
});

// Example login route (you can connect to DB later)
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  if (username === "admin" && password === "password") {
    return res.json({ success: true, message: "Login successful!" });
  } else {
    return res.status(401).json({ success: false, message: "Invalid credentials" });
  }
});

// Socket.IO example
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 9000;
server.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});
