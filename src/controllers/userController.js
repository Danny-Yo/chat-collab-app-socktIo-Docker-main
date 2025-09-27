require('dotenv').config();
const jwt = require("jsonwebtoken");
const User = require("../models/users");

const generateToken = (id) => {
  const secret = process.env.JWT_SECRET;

  console.log("🔐 JWT_SECRET at sign:", secret);
  if (!secret) throw new Error("JWT_SECRET is missing!");

  return jwt.sign({ id }, secret, { expiresIn: "7d" });
};


// Register a new user

const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Create user
    const user = await User.create({ name, email, password, role });

    res.status(201).json({
      success: true,
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (err) {
    console.error("❌ Register error:", err.message); // log the actual error
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};


const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    //Find the user from user collection
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Matching  password
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }
    // Sending response with token
    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      data: error.message,
    });
  }
};

module.exports = {registerUser, loginUser}
