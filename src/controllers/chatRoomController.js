const Room = require('../models/chatRoom');


//creating chat room 
const createRoom = async (req, res) => {
  try {
    const { name, text, messages } = req.body;

    //create user
    const createRoom = new Room({ name:name, text:text, messages:messages });
    await createRoom.save();
    res.status(201).json({
      success: true,
      message: "Request successfull",
      data: createRoom,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
      data: err,
    });
  }
};

//getting chat room data
const getRooms = async (req, res) => {
  try {
     const getChatRoomData = await Room.find();
   
    if (!getChatRoomData) {
      res.status(404).json({
        success: false,
        message: "Data not found",
      });
    }

    // Sending data
   res.status(201).json({
      success: true,
      message: "Request successfull",
      data: getChatRoomData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      data: err,
    });
  }
};

module.exports = {createRoom,getRooms}
