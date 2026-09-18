const { verifyGoogleCredential } = require('../config/google');

async function authenticateGoogle(req, res) {
  try {
    const user = await verifyGoogleCredential(req.body.credential);
    return res.json({ authenticated: true, user });
  } catch (error) {
    return res.status(error.statusCode || 401).json({ message: error.message });
  }
}

module.exports = { authenticateGoogle };
