# StudyNest Blog

A simple dark Blogger-style student blog with seven articles, Google-authenticated real followers, MongoDB comments, search, and responsive pages.

## Stack

- HTML, CSS, Bootstrap 5, and vanilla JavaScript
- Node.js and Express
- MongoDB Atlas and Mongoose
- Google Identity Services

## Run locally

From the project folder:

```bash
npm install
npm start
```

Open `http://localhost:3000`.

Create a local `.env` file from `.env.example`:

```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/student-edu-blog
CLIENT_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your_google_web_client_id.apps.googleusercontent.com
```

`GOOGLE_CLIENT_ID` is a public web client ID. Never put the MongoDB connection string in frontend files or commit `.env`.

## Deploy with Render

This project serves the frontend and backend from the same Express service. This is the recommended deployment because it keeps the API and Google Follow flow on one origin.

1. Push the `D:\Blog` project to a GitHub repository. Do not commit `.env` or `node_modules`.
2. Create a MongoDB Atlas cluster and database user.
3. In Atlas, add `0.0.0.0/0` to Network Access for a simple Render deployment, or use Atlas's documented secure network setup.
4. In Render, choose **New > Blueprint** and select the repository. Render will read `render.yaml`.
5. Add these secret environment variables when Render asks:
   - `MONGODB_URI`: the Atlas connection string, including the database name.
   - `GOOGLE_CLIENT_ID`: the Google Web OAuth client ID.
   - `CLIENT_URL`: the final Render URL, for example `https://studynest-blog.onrender.com`.
6. Deploy and verify:
   - `https://YOUR-RENDER-URL/health`
   - `https://YOUR-RENDER-URL/`
   - `https://YOUR-RENDER-URL/api/blogs`

Render uses:

```text
Build command: npm install
Start command: npm start
Health check: /health
```

## Google OAuth production setup

In Google Cloud Console, open the same Web OAuth client used locally and add the exact Render origin under **Authorized JavaScript origins**:

```text
http://localhost:3000
https://YOUR-RENDER-URL
```

Do not add a trailing slash. Save the Google settings and redeploy/restart Render.

## Optional Vercel frontend

The recommended setup is Render-only. If the frontend must be hosted separately on Vercel, the frontend JavaScript needs a runtime `API_BASE` pointing to the Render service, and that Vercel origin must also be added to `CLIENT_URL` and Google Authorized JavaScript origins. Do not deploy the frontend separately without configuring that API URL.

## Seed or update blog content

The current MongoDB database already contains the seven blog posts. To recreate the blog collection locally:

```bash
npm run seed
```

The seed command drops and recreates the database, so do not run it against a production database containing real followers or comments.

## API

- `GET /api/blogs`
- `GET /api/blogs/:id`
- `GET /api/blogs/search?q=skills`
- `GET /api/followers/count`
- `GET /api/followers`
- `POST /api/auth/google`
- `POST /api/follow`
- `GET /api/follow/status`
- `GET /api/comments/:blogId`
- `POST /api/comments`
- `GET /health`

Follower names, verified emails, Google profile images, and follow dates shown in the sidebar come from MongoDB.
