const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Register = require('../signup/signupModel'); // Assuming your model file is named register.js
const logger = require('../utils/logger');

const registerUser = asyncHandler(async (req, res, next) => {
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
        return res.status(400).json({ error: 'Username, email, and password are required' });
    }

    try {
        // Check if user with provided email already exists
        const userExists = await Register.findOne({ email });
        if (userExists) {
            return res.status(400).json({ error: 'User already exists with this email' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = await Register.create({
            username,
            email,
            password: hashedPassword
        });

        // Return user details
        res.status(201).json({
            id: newUser._id,
            username: newUser.username,
            email: newUser.email
        });
    } catch (error) {
        logger.error('Error registering user:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = { registerUser };
