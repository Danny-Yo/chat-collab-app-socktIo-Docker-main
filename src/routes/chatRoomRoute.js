const router = require('express').Router();
const { createRoom, getRooms } = require('../controllers/chatRoomController');
const  {auth}  = require('../middleware/authMiddelware');


//Route to create chatroom
router.post('/createRoom',auth, createRoom);

//route to get chat room data
router.get('/getChatRoomData',auth, getRooms);

console.log("Auth middleware is:", auth);

module.exports = router;


