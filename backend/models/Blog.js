const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    excerpt: { type: String, required: true },
    author: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    date: { type: String, default: new Date().toISOString().slice(0, 10) },
    image: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Blog', blogSchema);
