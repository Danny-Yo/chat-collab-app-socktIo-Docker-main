const router = require('express').Router();
const { registerUser, loginUser } = require('../controllers/userController');


//route to create user
router.post('/register', registerUser);

// route for login
router.post('/login', loginUser);

module.exports = router;
