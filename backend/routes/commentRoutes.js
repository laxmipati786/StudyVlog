const express = require('express');
const { getCommentsByBlog, createComment, deleteComment } = require('../controllers/commentController');

const router = express.Router();

router.get('/:blogId', getCommentsByBlog);
router.post('/', createComment);
router.delete('/:id', deleteComment);

module.exports = router;
