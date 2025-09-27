const mongoose = require('mongoose');
const chatRoomSchema = new mongoose.Schema({
  name: String,
  text: String,
  messages: [{ user: String, text: String, createdAt: Date }]
});
module.exports = mongoose.model('Room', chatRoomSchema);
