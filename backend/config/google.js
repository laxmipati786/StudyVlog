const { OAuth2Client } = require('google-auth-library');

function getGoogleClient() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    throw new Error('GOOGLE_CLIENT_ID is not configured.');
  }
  return new OAuth2Client(clientId);
}

async function verifyGoogleCredential(credential) {
  if (!credential) {
    const error = new Error('Google credential is required.');
    error.statusCode = 401;
    throw error;
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    const error = new Error('Google authentication is not configured on the server.');
    error.statusCode = 503;
    throw error;
  }

  const ticket = await getGoogleClient().verifyIdToken({
    idToken: credential,
    audience: clientId,
  });
  const payload = ticket.getPayload();

  if (!payload || !payload.sub || !payload.email || payload.email_verified !== true) {
    const error = new Error('Google account verification failed.');
    error.statusCode = 401;
    throw error;
  }

  return {
    googleId: payload.sub,
    email: payload.email,
    name: payload.name || payload.email,
    picture: payload.picture || '',
  };
}

function getBearerCredential(req) {
  const authorization = req.headers.authorization || '';
  return authorization.startsWith('Bearer ') ? authorization.slice(7) : '';
}

module.exports = { verifyGoogleCredential, getBearerCredential };
