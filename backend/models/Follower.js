const mongoose = require('mongoose');

const followerSchema = new mongoose.Schema(
  {
    googleId: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    name: { type: String, required: true, trim: true },
    picture: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Follower', followerSchema);
