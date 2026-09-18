const apiBase = window.API_BASE || '';

async function fetchJson(url, options = {}) {
  const response = await fetch(`${apiBase}${url}`, options);
  if (!response.ok) {
    const payload = await response.json().catch(() => ({ message: 'Request failed.' }));
    throw new Error(payload.message || 'Request failed.');
  }
  return response.json();
}

function formatDate(value) {
  if (!value) return 'Recently';
  return new Date(value).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function escapeHtml(value) {
  return String(value || '').replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }[character]));
}

function showFollowerDetails(follower) {
  const name = escapeHtml(follower.name || 'Google follower');
  const email = escapeHtml(follower.email || 'Not available');
  const picture = escapeHtml(follower.picture || '');
  const joined = follower.createdAt ? formatDate(follower.createdAt) : 'Not available';
  const avatar = picture
    ? `<img src="${picture}" alt="${name}" />`
    : `<span>${escapeHtml((follower.name || 'G').charAt(0).toUpperCase())}</span>`;

  const modal = document.createElement('div');
  modal.className = 'follower-details-modal';
  modal.innerHTML = `
    <div class="follower-details-box" role="dialog" aria-modal="true" aria-label="Follower details">
      <button class="follower-details-close" type="button" aria-label="Close follower details">×</button>
      <div class="follower-details-avatar">${avatar}</div>
      <h3>${name}</h3>
      <div class="follower-detail-row"><strong>Email</strong><span>${email}</span></div>
      <div class="follower-detail-row"><strong>Following since</strong><span>${joined}</span></div>
      <div class="follower-detail-row"><strong>Account</strong><span>Verified Google account</span></div>
    </div>
  `;

  document.body.appendChild(modal);
  const close = () => modal.remove();
  modal.querySelector('.follower-details-close').addEventListener('click', close);
  modal.addEventListener('click', (event) => {
    if (event.target === modal) close();
  });
}

function sharePost(post) {
  const url = `${window.location.origin}/blog.html?id=${post._id}`;
  const shareData = {
    title: post.title,
    text: post.excerpt,
    url,
  };

  if (navigator.share) {
    navigator.share(shareData).catch(() => {});
    return;
  }

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(post.title);
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

function renderPosts(posts) {
  const container = document.getElementById('posts-container');
  if (!container) return;
  if (!posts || posts.length === 0) {
    container.innerHTML = '<div class="empty-state">No blog posts found.</div>';
    return;
  }

  container.innerHTML = posts.map((post) => `
    <article class="post-card" data-blog-link="/blog.html?id=${post._id}">
      <div class="post-image"><img src="${post.image}" alt="${post.title}" /></div>
      <div class="post-content">
        <div class="post-meta">${formatDate(post.date || post.createdAt)} • ${post.category} • By ${post.author}</div>
        <h2>${post.title}</h2>
        <p>${post.excerpt}</p>
        <div class="post-footer">
          <div class="post-actions">
            <a href="/blog.html?id=${post._id}#comments">COMMENT</a>
            <a href="#" data-share="${post._id}">SHARE</a>
          </div>
          <a class="read-more" href="/blog.html?id=${post._id}">READ MORE</a>
        </div>
      </div>
    </article>
  `).join('');

  document.querySelectorAll('[data-share]').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const post = posts.find((item) => item._id === link.dataset.share);
      if (!post) return;
      sharePost(post);
    });
  });

  document.querySelectorAll('[data-blog-link]').forEach((card) => {
    card.addEventListener('click', (event) => {
      if (event.target.closest('.post-actions') || event.target.closest('.read-more')) return;
      window.location.href = card.dataset.blogLink;
    });
  });
}

async function loadPosts() {
  try {
    renderPosts(await fetchJson('/api/blogs'));
  } catch (error) {
    const container = document.getElementById('posts-container');
    if (container) container.innerHTML = `<div class="empty-state">${error.message}</div>`;
  }
}

async function refreshFollowerCount() {
  const countEl = document.getElementById('follower-count');
  if (!countEl) return;
  try {
    const result = await fetchJson('/api/followers/count');
    countEl.textContent = Number(result.count || 0).toLocaleString();
  } catch (error) {
    countEl.textContent = '0';
  }
}

async function refreshFollowers() {
  const list = document.getElementById('followers-list');
  if (!list) return;

  try {
    const result = await fetchJson('/api/followers');
    const followers = Array.isArray(result.followers) ? result.followers : [];
    if (followers.length === 0) {
      list.innerHTML = '<p class="no-followers-message">No real followers yet.</p>';
      return;
    }

    list.innerHTML = followers.map((follower, index) => {
      const name = escapeHtml(follower.name || 'Google follower');
      const email = escapeHtml(follower.email || '');
      const picture = escapeHtml(follower.picture || '');
      const avatar = picture
        ? `<img src="${picture}" alt="${name}" loading="lazy" />`
        : `<span>${escapeHtml((follower.name || 'G').charAt(0).toUpperCase())}</span>`;
      return `
        <button class="follower-item" type="button" data-follower-index="${index}">
          <div class="follower-avatar">${avatar}</div>
          <div class="follower-info">
            <strong>${name}</strong>
            <small>${email}</small>
          </div>
        </button>
      `;
    }).join('');

    list.querySelectorAll('[data-follower-index]').forEach((item) => {
      item.addEventListener('click', () => showFollowerDetails(followers[Number(item.dataset.followerIndex)]));
    });
  } catch (error) {
    list.innerHTML = '<p class="no-followers-message">Unable to load followers.</p>';
  }
}

function getGoogleCredential() {
  return sessionStorage.getItem('study-nest-google-credential') || '';
}

async function fetchFollowStatus() {
  const credential = getGoogleCredential();
  if (!credential) return false;
  const response = await fetch(`${apiBase}/api/follow/status`, {
    headers: { Authorization: 'Bearer ' + credential },
  });
  if (response.status === 401) {
    sessionStorage.removeItem('study-nest-google-credential');
    return false;
  }
  if (!response.ok) throw new Error('Unable to check follow status.');
  return Boolean((await response.json()).following);
}

function setFollowingState(following) {
  const button = document.getElementById('follow-button');
  if (!button) return;
  button.textContent = following ? 'FOLLOWING' : 'FOLLOW';
  button.disabled = following;
  localStorage.setItem('study-nest-following', String(following));
}

async function completeGoogleFollow(credential) {
  const authResult = await fetchJson('/api/auth/google', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ credential }),
  });

  sessionStorage.setItem('study-nest-google-credential', credential);
  sessionStorage.setItem('study-nest-google-user', JSON.stringify(authResult.user));

  await fetchJson('/api/follow', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + credential },
  });

  setFollowingState(true);
  await refreshFollowerCount();
  await refreshFollowers();
}

let googleButtonReady = false;

function renderGoogleButton() {
  if (googleButtonReady || !window.GOOGLE_CLIENT_ID) return;
  if (!window.google || !window.google.accounts || !window.google.accounts.id) return;

  const form = document.getElementById('follow-form');
  const visibleButton = document.getElementById('follow-button');
  if (!form || !visibleButton) return;

  window.google.accounts.id.initialize({
    client_id: window.GOOGLE_CLIENT_ID,
    callback: async (response) => {
      try {
        await completeGoogleFollow(response.credential);
      } catch (error) {
        alert(error.message);
      }
    },
  });

  const googleButton = document.createElement('div');
  googleButton.setAttribute('aria-hidden', 'true');
  googleButton.style.position = 'absolute';
  googleButton.style.left = '0';
  googleButton.style.right = '0';
  googleButton.style.bottom = '0';
  googleButton.style.height = `${visibleButton.offsetHeight || 44}px`;
  googleButton.style.opacity = '0.01';
  googleButton.style.overflow = 'hidden';
  googleButton.style.zIndex = '2';
  form.style.position = 'relative';
  form.appendChild(googleButton);

  window.google.accounts.id.renderButton(googleButton, {
    type: 'standard',
    theme: 'outline',
    size: 'large',
    text: 'continue_with',
    shape: 'rectangular',
    width: Math.max(visibleButton.offsetWidth, 240),
  });

  googleButtonReady = true;
}

function startGoogleSignIn() {
  if (!window.GOOGLE_CLIENT_ID) {
    alert('Google Sign-In is not configured. Add GOOGLE_CLIENT_ID to the server environment.');
    return;
  }
  renderGoogleButton();
}

document.addEventListener('DOMContentLoaded', () => {
  loadPosts();
  refreshFollowerCount();
  refreshFollowers();

  const form = document.getElementById('follow-form');
  const button = document.getElementById('follow-button');
  if (form) form.addEventListener('submit', (event) => {
    event.preventDefault();
    startGoogleSignIn();
  });

  if (button) {
    fetchFollowStatus()
      .then(setFollowingState)
      .catch(() => setFollowingState(false));
  }

  const profileButton = document.getElementById('visit-profile-button');
  const profileDetails = document.getElementById('profile-details');
  const profileCloseButton = document.getElementById('profile-close-button');
  if (profileButton && profileDetails) {
    profileButton.addEventListener('click', () => {
      profileDetails.hidden = false;
    });
  }
  if (profileCloseButton && profileDetails) {
    profileCloseButton.addEventListener('click', () => {
      profileDetails.hidden = true;
    });
  }

  let attempts = 0;
  const waitForGoogle = window.setInterval(() => {
    attempts += 1;
    renderGoogleButton();
    if (googleButtonReady || attempts >= 100) window.clearInterval(waitForGoogle);
  }, 100);

  const searchToggle = document.getElementById('search-toggle');
  const searchBox = document.getElementById('search-box');
  if (searchToggle && searchBox) {
    searchToggle.addEventListener('click', () => searchBox.classList.toggle('active'));
  }

  const searchForm = document.getElementById('search-form');
  if (searchForm) searchForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const term = document.getElementById('search-input').value.trim();
    if (!term) return loadPosts();
    try {
      renderPosts(await fetchJson(`/api/blogs/search?q=${encodeURIComponent(term)}`));
    } catch (error) {
      document.getElementById('posts-container').innerHTML = `<div class="empty-state">${error.message}</div>`;
    }
  });
});
