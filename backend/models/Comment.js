const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    blogId: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    comment: { type: String, required: true, trim: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Comment', commentSchema);
