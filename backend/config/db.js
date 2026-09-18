const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/student-edu-blog';

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 4000,
    });
    console.log('MongoDB connected successfully.');
  } catch (error) {
    console.warn('MongoDB connection failed. Running in fallback demo mode.');
    console.warn(error.message);
  }
}

function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}

module.exports = { connectDB, isMongoConnected };
