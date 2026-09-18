const Comment = require('../models/Comment');
const { isMongoConnected } = require('../config/db');

const fallbackComments = {
  'blog-1': [
    { _id: 'comment-1', blogId: 'blog-1', name: 'Ananya', comment: 'The communication tips were very practical and relevant.', createdAt: '2025-03-08T08:30:00.000Z' },
  ],
  'blog-2': [],
  'blog-3': [],
  'blog-4': [],
  'blog-5': [],
};

async function getCommentsByBlog(req, res) {
  const { blogId } = req.params;

  if (isMongoConnected()) {
    try {
      const comments = await Comment.find({ blogId }).sort({ createdAt: -1 });
      return res.json(comments);
    } catch (error) {
      return res.status(500).json({ message: 'Unable to fetch comments.', error: error.message });
    }
  }

  const comments = fallbackComments[blogId] || [];
  return res.json(comments);
}

async function createComment(req, res) {
  const { blogId, name, comment } = req.body;

  if (!blogId || !name || !comment) {
    return res.status(400).json({ message: 'Blog ID, name, and comment are required.' });
  }

  if (typeof name !== 'string' || !name.trim() || typeof comment !== 'string' || !comment.trim()) {
    return res.status(400).json({ message: 'Please enter a valid name and comment.' });
  }

  if (isMongoConnected()) {
    try {
      const newComment = await Comment.create({ blogId, name: name.trim(), comment: comment.trim() });
      return res.status(201).json(newComment);
    } catch (error) {
      return res.status(500).json({ message: 'Comment submission failed.', error: error.message });
    }
  }

  const newComment = {
    _id: `comment-${Date.now()}`,
    blogId,
    name: name.trim(),
    comment: comment.trim(),
    createdAt: new Date().toISOString(),
  };

  if (!fallbackComments[blogId]) {
    fallbackComments[blogId] = [];
  }

  fallbackComments[blogId].unshift(newComment);
  return res.status(201).json(newComment);
}

async function deleteComment(req, res) {
  const { id } = req.params;

  if (isMongoConnected()) {
    try {
      const deleted = await Comment.findByIdAndDelete(id);
      if (!deleted) {
        return res.status(404).json({ message: 'Comment not found.' });
      }
      return res.json({ message: 'Comment deleted successfully.' });
    } catch (error) {
      return res.status(500).json({ message: 'Comment deletion failed.', error: error.message });
    }
  }

  let found = false;
  Object.keys(fallbackComments).forEach((blogId) => {
    const index = fallbackComments[blogId].findIndex((comment) => comment._id === id);
    if (index !== -1) {
      fallbackComments[blogId].splice(index, 1);
      found = true;
    }
  });

  if (!found) {
    return res.status(404).json({ message: 'Comment not found.' });
  }

  return res.json({ message: 'Comment deleted successfully.' });
}

module.exports = { getCommentsByBlog, createComment, deleteComment };
