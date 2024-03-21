const mongoose = require('mongoose');
const logger = require('../utils/logger');

// MongoDB Connection URI
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mydatabase';
// Connect to MongoDB database
const connectToDatabase = () => {
    mongoose.connect(MONGODB_URI)
        .then(() => {
            logger.info('MongoDB connected');
        })
        .catch((error) => {
            logger.error('Error connecting to MongoDB:', error);
        });
};

module.exports = { connectToDatabase };
