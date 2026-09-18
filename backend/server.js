const path = require('path');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const blogRoutes = require('./routes/blogRoutes');
const followerRoutes = require('./routes/followerRoutes');
const commentRoutes = require('./routes/commentRoutes');
const { getFollowStatus, followUser } = require('./controllers/followerController');

dotenv.config({ override: true });

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = (process.env.CLIENT_URL || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin: allowedOrigins.length > 0
    ? (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
        return callback(new Error('Origin is not allowed by CORS.'));
      }
    : true,
  credentials: true,
}));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api/blogs', blogRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/followers', followerRoutes);
app.use('/api/comments', commentRoutes);
app.get('/api/follow/status', getFollowStatus);
app.post('/api/follow', followUser);

const frontendPath = path.join(__dirname, '../frontend');
app.use(express.static(frontendPath));

app.get('/config.js', (req, res) => {
  res.type('application/javascript');
  res.send(`window.GOOGLE_CLIENT_ID = ${JSON.stringify(process.env.GOOGLE_CLIENT_ID || '')};`);
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

app.get('/index.html', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

app.get('/blog.html', (req, res) => {
  res.sendFile(path.join(frontendPath, 'blog.html'));
});

app.get('/about.html', (req, res) => {
  res.sendFile(path.join(frontendPath, 'about.html'));
});

app.get('/contact.html', (req, res) => {
  res.sendFile(path.join(frontendPath, 'contact.html'));
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong on the server.', error: err.message });
});

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer();
