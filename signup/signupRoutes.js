const express = require('express');
const router = express.Router();
const { registerUser } = require('../signup/signupController');

// Register route
router.post('/register', registerUser);

module.exports = router;
