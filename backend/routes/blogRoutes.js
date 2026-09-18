const express = require('express');
const {
  getAllBlogs,
  getBlogById,
  searchBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
} = require('../controllers/blogController');

const router = express.Router();

router.get('/search', searchBlogs);
router.get('/', getAllBlogs);
router.get('/:id', getBlogById);
router.post('/', createBlog);
router.put('/:id', updateBlog);
router.delete('/:id', deleteBlog);

module.exports = router;
