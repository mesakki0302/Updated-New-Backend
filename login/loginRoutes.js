const express = require('express');
const router = express.Router();

const { Login } = require('./loginController');

//Post Login
router.post('/login',Login)


module.exports = router;



