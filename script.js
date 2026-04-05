/* ─────────────────────────────────────────────────────────────
   HARSHA PORTFOLIO — script.js
   GitHub API · typing animation · theme · scroll effects
   ───────────────────────────────────────────────────────────── */

'use strict';

/* ── Config ──────────────────────────────────────────────────── */
const GITHUB_USERNAME = 'harsha4261';
const GITHUB_API      = `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`;
const TOP_FEATURED    = 3; // highlight top N most-starred repos

/* ── Lang dot colour map ─────────────────────────────────────── */
const LANG_COLORS = {
  JavaScript: '#f7df1e',
  TypeScript: '#3178c6',
  Python:     '#3572A5',
  HTML:       '#e34c26',
  CSS:        '#563d7c',
  Java:       '#b07219',
  C:          '#555555',
  'C++':      '#f34b7d',
  Shell:      '#89e051',
  Go:         '#00ADD8',
  Rust:       '#dea584',
  Ruby:       '#701516',
};

/* ── DOM refs ────────────────────────────────────────────────── */
const themeToggle   = document.getElementById('themeToggle');
const hamburger     = document.getElementById('hamburger');
const mobileMenu    = document.getElementById('mobileMenu');
const navbar        = document.getElementById('navbar');
const backToTop     = document.getElementById('backToTop');
const typedTextEl   = document.getElementById('typedText');
const projectsGrid  = document.getElementById('projectsGrid');
const loadingState  = document.getElementById('loadingState');
const filterBar     = document.getElementById('filterBar');
const footerYear    = document.getElementById('footerYear');
const repoCount     = document.getElementById('repoCount');
const copyEmailBtn  = document.getElementById('copyEmailBtn');
const copyFeedback  = document.getElementById('copyFeedback');

/* ════════════════════════════════════════════════════════════════
   1. THEME
   ══════════════════════════════════════════════════════════════ */
(function initTheme() {
  const saved = localStorage.getItem('portfolio-theme') || 'dark';
  applyTheme(saved);
})();

function applyTheme(theme) {
  document.body.dataset.theme = theme;
  themeToggle.querySelector('.theme-icon').textContent = theme === 'dark' ? '🌙' : '☀️';
}

themeToggle.addEventListener('click', () => {
  const next = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  localStorage.setItem('portfolio-theme', next);
});

/* ════════════════════════════════════════════════════════════════
   2. NAVBAR  (scroll + mobile)
   ══════════════════════════════════════════════════════════════ */
window.addEventListener('scroll', onScroll, { passive: true });

function onScroll() {
  /* Sticky shadow */
  navbar.classList.toggle('scrolled', window.scrollY > 20);

  /* Back-to-top visibility */
  backToTop.classList.toggle('visible', window.scrollY > 400);
  backToTop.hidden = window.scrollY <= 400;

  /* Active nav link */
  highlightNav();
}

function highlightNav() {
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  let current = '';

  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 100) current = sec.id;
  });

  navLinks.forEach(link => {
    const href = link.getAttribute('href').replace('#', '');
    link.classList.toggle('active', href === current);
  });
}

/* Mobile menu */
hamburger.addEventListener('click', () => {
  const open = !mobileMenu.hidden;
  mobileMenu.hidden = open;
  hamburger.setAttribute('aria-expanded', String(!open));
});

/* Close mobile menu on link click */
document.querySelectorAll('.mobile-menu .nav-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.hidden = true;
    hamburger.setAttribute('aria-expanded', 'false');
  });
});

/* Back to top */
backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ════════════════════════════════════════════════════════════════
   3. TYPING ANIMATION
   ══════════════════════════════════════════════════════════════ */
(function initTyping() {
  const words = [
    'web experiences.',
    'AI solutions.',
    'clean code.',
    'open-source tools.',
    'full-stack apps.',
  ];
  let wordIdx = 0;
  let charIdx = 0;
  let deleting = false;
  let pause = false;

  function type() {
    if (pause) return;

    const word = words[wordIdx];
    if (!deleting) {
      typedTextEl.textContent = word.slice(0, ++charIdx);
      if (charIdx === word.length) {
        pause = true;
        setTimeout(() => { pause = false; deleting = true; }, 2000);
      }
    } else {
      typedTextEl.textContent = word.slice(0, --charIdx);
      if (charIdx === 0) {
        deleting = false;
        wordIdx = (wordIdx + 1) % words.length;
      }
    }

    const speed = deleting ? 50 : 85;
    setTimeout(type, speed);
  }

  setTimeout(type, 600);
})();

/* ════════════════════════════════════════════════════════════════
   4. SCROLL-REVEAL
   ══════════════════════════════════════════════════════════════ */
(function initReveal() {
  const targets = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    targets.forEach(el => el.classList.add('visible'));
    return;
  }
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  targets.forEach(el => io.observe(el));
})();

/* ════════════════════════════════════════════════════════════════
   5. FOOTER YEAR
   ══════════════════════════════════════════════════════════════ */
footerYear.textContent = `© ${new Date().getFullYear()}`;

/* ════════════════════════════════════════════════════════════════
   6. COPY EMAIL
   ══════════════════════════════════════════════════════════════ */
copyEmailBtn.addEventListener('click', async () => {
  const email = copyEmailBtn.dataset.email;
  try {
    await navigator.clipboard.writeText(email);
  } catch {
    /* Fallback for browsers that don't support the Clipboard API.
       document.execCommand is deprecated but retained for broad compatibility. */
    const ta = document.createElement('textarea');
    ta.value = email;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  }
  showCopyFeedback();
});

function showCopyFeedback() {
  copyFeedback.hidden = false;
  setTimeout(() => { copyFeedback.hidden = true; }, 2000);
}

/* ════════════════════════════════════════════════════════════════
   7. GITHUB PROJECTS
   ══════════════════════════════════════════════════════════════ */
let allRepos = [];
let activeFilter = 'all';

async function fetchRepos() {
  try {
    const res = await fetch(GITHUB_API);
    if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
    const data = await res.json();

    /* Filter: exclude forks and empty repos */
    allRepos = data
      .filter(r => !r.fork && (r.description || r.stargazers_count > 0))
      .sort((a, b) => b.stargazers_count - a.stargazers_count || new Date(b.updated_at) - new Date(a.updated_at));

    /* Update about stats */
    if (repoCount) repoCount.textContent = data.filter(r => !r.fork).length;

    buildFilterBar();
    renderProjects(allRepos);
  } catch (err) {
    showError(err.message);
  }
}

function buildFilterBar() {
  const languages = [...new Set(allRepos.map(r => r.language).filter(Boolean))];

  languages.slice(0, 8).forEach(lang => {
    const btn = document.createElement('button');
    btn.className = 'filter-btn';
    btn.dataset.lang = lang;
    btn.textContent = lang;
    btn.setAttribute('aria-pressed', 'false');
    btn.addEventListener('click', () => setFilter(lang));
    filterBar.appendChild(btn);
  });
}

function setFilter(lang) {
  activeFilter = lang;

  document.querySelectorAll('.filter-btn').forEach(btn => {
    const active = btn.dataset.lang === lang;
    btn.classList.toggle('active', active);
    btn.setAttribute('aria-pressed', String(active));
  });

  const filtered = lang === 'all'
    ? allRepos
    : allRepos.filter(r => r.language === lang);

  renderProjects(filtered);
}

/* Wire up the "All" button */
filterBar.querySelector('[data-lang="all"]').addEventListener('click', () => setFilter('all'));

function renderProjects(repos) {
  /* Remove loading/existing cards */
  projectsGrid.innerHTML = '';

  if (repos.length === 0) {
    projectsGrid.innerHTML = '<div class="error-state"><p>No projects found for this filter.</p></div>';
    return;
  }

  /* Top-starred repos get "Featured" badge */
  const featuredIds = allRepos.slice(0, TOP_FEATURED).map(r => r.id);

  repos.forEach((repo, idx) => {
    const card = buildCard(repo, featuredIds.includes(repo.id));
    /* Stagger animation */
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = `opacity .4s ease ${idx * 60}ms, transform .4s ease ${idx * 60}ms`;
    projectsGrid.appendChild(card);

    /* Trigger animation next frame */
    requestAnimationFrame(() => requestAnimationFrame(() => {
      card.style.opacity = '1';
      card.style.transform = 'none';
    }));
  });
}

function buildCard(repo, featured) {
  const card = document.createElement('article');
  card.className = 'project-card' + (featured ? ' featured' : '');
  card.setAttribute('aria-label', `Project: ${repo.name}`);

  const langColor = LANG_COLORS[repo.language] || '#6b7280';
  const updated   = formatDate(repo.updated_at);

  card.innerHTML = `
    ${featured ? '<span class="featured-badge" aria-label="Featured project">⭐ Featured</span>' : ''}
    <div class="project-header">
      <h3 class="project-name">${escapeHtml(repo.name)}</h3>
      <a href="${escapeHtml(repo.html_url)}" target="_blank" rel="noopener"
         class="project-link-icon" aria-label="Open ${escapeHtml(repo.name)} on GitHub">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
             width="14" height="14" aria-hidden="true">
          <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
          <polyline points="15 3 21 3 21 9"/>
          <line x1="10" y1="14" x2="21" y2="3"/>
        </svg>
      </a>
    </div>
    <p class="project-description">
      ${repo.description ? escapeHtml(repo.description) : '<em>No description provided.</em>'}
    </p>
    <div class="project-footer">
      ${repo.language
        ? `<span class="project-lang">
             <span class="lang-dot" style="background:${langColor}" aria-hidden="true"></span>
             ${escapeHtml(repo.language)}
           </span>`
        : '<span></span>'}
      <div class="project-stats">
        <span class="project-stat" title="Stars" aria-label="${repo.stargazers_count} stars">
          ⭐ ${repo.stargazers_count}
        </span>
        <span class="project-stat" title="Forks" aria-label="${repo.forks_count} forks">
          🍴 ${repo.forks_count}
        </span>
      </div>
    </div>
    <span class="project-updated" aria-label="Last updated ${updated}">Updated ${updated}</span>
  `;

  return card;
}

function showError(msg) {
  projectsGrid.innerHTML = `
    <div class="error-state" role="alert">
      <p>⚠️ Could not load projects from GitHub.</p>
      <p style="font-size:.85rem;margin-top:.5rem;opacity:.7">${escapeHtml(msg)}</p>
      <a href="https://github.com/${GITHUB_USERNAME}?tab=repositories"
         target="_blank" rel="noopener"
         class="btn btn-outline" style="margin-top:1.5rem;display:inline-flex">
        View on GitHub →
      </a>
    </div>`;
}

/* ── Helpers ────────────────────────────────────────────────── */
function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

/* ── Kick off ───────────────────────────────────────────────── */
fetchRepos();
