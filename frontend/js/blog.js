const apiBase = window.API_BASE || '';

async function fetchJson(url, options = {}) {
  const response = await fetch(`${apiBase}${url}`, options);
  if (!response.ok) {
    const payload = await response.json().catch(() => ({ message: 'Request failed.' }));
    throw new Error(payload.message || 'Request failed.');
  }
  return response.json();
}

const params = new URLSearchParams(window.location.search);
const blogId = params.get('id');

function showShareOptions(url, title) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const menu = document.createElement('div');
  menu.className = 'share-options';
  menu.innerHTML = `
    <div class="share-options-box" role="dialog" aria-label="Share this post">
      <strong>Share this post</strong>
      <a href="https://wa.me/?text=${encodedTitle}%20${encodedUrl}" target="_blank" rel="noopener">WhatsApp</a>
      <a href="https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}" target="_blank" rel="noopener">Facebook</a>
      <a href="https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}" target="_blank" rel="noopener">X / Twitter</a>
      <a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}" target="_blank" rel="noopener">LinkedIn</a>
      <a href="mailto:?subject=${encodedTitle}&body=${encodedUrl}">Email</a>
      <button type="button">Close</button>
    </div>
  `;
  document.body.appendChild(menu);
  const close = () => menu.remove();
  menu.querySelector('button').addEventListener('click', close);
  menu.addEventListener('click', (event) => {
    if (event.target === menu) close();
  });
}

function formatDate(value) {
  return new Date(value).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function renderArticle(blog) {
  const root = document.getElementById('blog-detail');
  if (!root) return;

  const paragraphs = (blog.content || '').split('\n\n').map((p) => `<p>${p}</p>`).join('');

  root.innerHTML = `
    <article class="article-box">
      <img src="${blog.image}" alt="${blog.title}" />
      <h1>${blog.title}</h1>
      <div class="article-meta">${formatDate(blog.date || blog.createdAt)} • ${blog.category} • By ${blog.author}</div>
      <div class="article-actions">
        <button class="share-btn" type="button" data-share="copy">Share</button>
        <button class="share-btn" type="button" data-share="twitter">Twitter</button>
      </div>
      <div class="article-content">${paragraphs}</div>
    </article>
  `;

  document.querySelectorAll('[data-share]').forEach((button) => {
    button.addEventListener('click', () => {
      const shareUrl = encodeURIComponent(window.location.href);
      const shareTitle = encodeURIComponent(blog.title);
      if (button.dataset.share === 'copy') {
        const shareData = {
          title: blog.title,
          text: blog.excerpt || blog.title,
          url: window.location.href,
        };
        if (navigator.share) {
          navigator.share(shareData).catch(() => {});
        } else {
          showShareOptions(window.location.href, blog.title);
        }
      }
      if (button.dataset.share === 'twitter') {
        window.open(`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`, '_blank');
      }
    });
  });
}

function renderComments(comments) {
  const container = document.getElementById('comment-list');
  if (!container) return;

  if (!comments || comments.length === 0) {
    container.innerHTML = '<div class="empty-state">No comments yet. Be the first to comment.</div>';
    return;
  }

  container.innerHTML = comments.map((comment) => `
    <div class="comment-item">
      <strong>${comment.name}</strong>
      <span>${formatDate(comment.createdAt)}</span>
      <p>${comment.comment}</p>
    </div>
  `).join('');
}

async function loadBlog() {
  if (!blogId) {
    document.getElementById('blog-detail').innerHTML = '<div class="empty-state">No blog selected.</div>';
    return;
  }

  try {
    const blog = await fetchJson(`/api/blogs/${encodeURIComponent(blogId)}`);
    renderArticle(blog);

    const comments = await fetchJson(`/api/comments/${encodeURIComponent(blogId)}`);
    renderComments(comments);
  } catch (error) {
    document.getElementById('blog-detail').innerHTML = `<div class="empty-state">${error.message}</div>`;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadBlog();

  const form = document.getElementById('comment-form');
  if (!form) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const name = document.getElementById('comment-name').value.trim();
    const comment = document.getElementById('comment-text').value.trim();

    if (!name || !comment) {
      alert('Please enter your name and comment.');
      return;
    }

    try {
      await fetchJson('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blogId, name, comment })
      });

      document.getElementById('comment-text').value = '';
      const updated = await fetchJson(`/api/comments/${encodeURIComponent(blogId)}`);
      renderComments(updated);
    } catch (error) {
      alert(error.message);
    }
  });
});
