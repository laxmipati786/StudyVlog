const express = require('express');
const { getFollowerCount, getFollowers, getFollowStatus, followUser } = require('../controllers/followerController');

const router = express.Router();

router.get('/count', getFollowerCount);
router.get('/', getFollowers);
router.get('/status', getFollowStatus);
router.post('/', followUser);
router.post('/follow', followUser);

module.exports = router;
