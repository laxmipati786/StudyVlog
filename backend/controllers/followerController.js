const Follower = require('../models/Follower');
const { isMongoConnected } = require('../config/db');
const { getBearerCredential, verifyGoogleCredential } = require('../config/google');

async function getAuthenticatedGoogleUser(req) {
  if (!isMongoConnected()) {
    const error = new Error('MongoDB is required for real followers.');
    error.statusCode = 503;
    throw error;
  }

  return verifyGoogleCredential(getBearerCredential(req));
}

async function getFollowerCount(req, res) {
  if (!isMongoConnected()) {
    return res.status(503).json({ message: 'MongoDB is required for the follower count.' });
  }

  try {
    const count = await Follower.countDocuments({
      googleId: { $exists: true, $ne: null },
    });
    return res.json({ count });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to fetch follower count.' });
  }
}

async function getFollowers(req, res) {
  if (!isMongoConnected()) {
    return res.status(503).json({ message: 'MongoDB is required for the follower list.' });
  }

  try {
    const followers = await Follower.find(
      { googleId: { $exists: true, $ne: null } },
      { _id: 0, name: 1, email: 1, picture: 1, createdAt: 1 }
    )
      .sort({ createdAt: -1 })
      .lean();

    return res.json({ followers });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to fetch followers.' });
  }
}

async function getFollowStatus(req, res) {
  try {
    const user = await getAuthenticatedGoogleUser(req);
    const follower = await Follower.exists({ googleId: user.googleId });
    return res.json({ following: Boolean(follower) });
  } catch (error) {
    return res.status(error.statusCode || 401).json({ message: error.message });
  }
}

async function followUser(req, res) {
  try {
    const user = await getAuthenticatedGoogleUser(req);
    const existing = await Follower.findOne({ googleId: user.googleId });

    if (existing) {
      return res.json({ following: true, message: 'You are already following this blog.' });
    }

    const follower = await Follower.create(user);
    return res.status(201).json({
      following: true,
      message: 'Followed successfully.',
      user: {
        googleId: follower.googleId,
        email: follower.email,
        name: follower.name,
        picture: follower.picture,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.json({ following: true, message: 'You are already following this blog.' });
    }
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
}

module.exports = { getFollowerCount, getFollowers, getFollowStatus, followUser };
