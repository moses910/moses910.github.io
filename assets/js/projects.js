/* ==========================================================
   projects.js — Interactive project cards + modal system
   ========================================================== */

'use strict';

/* ===== Project data ===== */
const PROJECTS = [
  {
    id: 'lambda',
    cardId: 'card-lambda',
    name: 'LambdaCostWatchdog',
    slug: 'lambda-cost-watchdog',
    statusClass: 'status-prod',
    dotClass: 'dot-prod',
    statusLabel: 'AWS Grant Submission',
    tagline: 'Serverless AWS cost-optimization tool born from a stray Elastic IP that quietly racked up charges.',
    overview:
      'After discovering an unattached Elastic IP generating unexpected charges, I built LambdaCostWatchdog — a fully serverless system that runs automated cost-optimization checks across <b>14 AWS services</b> on a scheduled cadence. The architecture uses a <b>DRY_RUN safety mode</b> that reports flagged resources without terminating anything, until an operator explicitly flips the switch.',
    challenge:
      'AWS cost leakage is insidious — idle resources accumulate charges silently across regions and services. Existing solutions were either too broad (alert fatigue) or required persistent infrastructure of their own.',
    architecture:
      '<b>Lambda</b> handles all execution logic, triggered by <b>EventBridge cron rules</b>. Each service check runs as a separate handler, reporting via <b>SNS</b> to email/Slack. The DRY_RUN flag is an environment variable, making the switch from report-only to remediation mode a single parameter change.',
    outcomes: [
      { num: '14', label: 'AWS services monitored' },
      { num: '0', label: 'persistent infra needed' },
      { num: '1', label: 'env var to go live' },
    ],
    stack: ['AWS Lambda', 'EventBridge', 'SNS', 'boto3', 'Python 3.11', 'IAM', 'CloudWatch'],
    links: [
      { label: 'View on GitHub', href: 'https://github.com/moses910', type: 'secondary' },
    ],
  },
  {
    id: 'fraud',
    cardId: 'card-fraud',
    name: 'Triqflow Fraud Engine',
    slug: 'triqflow-fraud-engine',
    statusClass: 'status-prod',
    dotClass: 'dot-prod',
    statusLabel: 'Client Deployment',
    tagline: 'Fraud-detection console deployed for Mwalimu National SACCO, Kenya\'s largest teachers\' SACCO.',
    overview:
      'Built for <b>Mwalimu National SACCO</b>, this console gives compliance and fraud staff a live dashboard view of flagged transactions, risk signals, and anomaly patterns across the member base. The initial version was a single-file build delivered under a tight deadline — it\'s currently being refactored into a modular architecture at the client\'s request.',
    challenge:
      'SACCO fraud often looks like normal activity until patterns emerge across accounts over time. The client needed a tool that surfaced those signals quickly, with minimal training overhead for non-technical compliance staff.',
    architecture:
      'The frontend is <b>pure HTML/CSS/JS</b> with a data layer that ingests from a sanitized transaction export. Risk scoring logic runs client-side, with flagged records surfaced in a sortable, filterable table. The refactored version will split risk logic, UI components, and data layers into separate modules.',
    outcomes: [
      { num: 'Live', label: 'in client environment' },
      { num: 'v2', label: 'modular refactor in progress' },
      { num: '0', label: 'server-side deps (v1)' },
    ],
    stack: ['HTML', 'CSS', 'Vanilla JS', 'Fraud Scoring Logic', 'SACCO Data Structures'],
    links: [
      { label: 'Contact for demo', href: 'mailto:nmungai9@gmail.com', type: 'primary' },
    ],
  },
  {
    id: 'savings',
    cardId: 'card-savings',
    name: 'Women of Faith — Savings Tracker',
    slug: 'women-of-faith-savings',
    statusClass: 'status-live',
    dotClass: 'dot-live',
    statusLabel: 'Live & In Use',
    tagline: 'Mobile-first savings group app backed by a live Google Sheet — used weekly by a real 6-member group.',
    overview:
      'A practical financial tool built for a <b>real savings group</b> of six members. The five-tab interface covers contribution logging, loan issuance and repayment tracking, member balances, group summaries, and <b>one-click PDF report generation</b>. All data lives in a Google Sheet that members can also view directly.',
    challenge:
      'The group was tracking everything manually in a physical ledger, with no easy way to calculate running balances or generate reports for meetings. The solution had to be mobile-friendly, require zero technical knowledge to use, and stay free to operate.',
    architecture:
      'The frontend is a <b>Google Apps Script Web App</b> — HTML/CSS/JS served from Google\'s infrastructure at no cost. The data layer talks to <b>Google Sheets API</b> via Apps Script. Dynamic header scanning handles real-world sheet inconsistencies (columns added out of order, renamed headers). PDF reports are generated via a print-layout CSS trick.',
    outcomes: [
      { num: '6', label: 'active members' },
      { num: '5', label: 'app tabs' },
      { num: '£0', label: 'monthly hosting cost' },
    ],
    stack: ['Google Apps Script', 'Google Sheets API', 'HTML/CSS', 'JavaScript', 'PDF via CSS Print'],
    links: [
      { label: 'Contact for demo', href: 'mailto:nmungai9@gmail.com', type: 'primary' },
    ],
  },
  {
    id: 'docscan',
    cardId: 'card-docscan',
    name: 'DocScan',
    slug: 'docscan',
    statusClass: 'status-proto',
    dotClass: 'dot-proto',
    statusLabel: 'Prototype / SaaS Exploration',
    tagline: 'Client-side document intelligence — parse PDFs, Word docs, and scanned images entirely in-browser.',
    overview:
      'DocScan is a document extraction prototype that runs <b>entirely in the browser</b> — no file uploads, no server, no privacy concerns. Users drop in a PDF, Word document, or scanned image and get structured text output they can search, copy, or pipe into other tools. Built as a SaaS concept to validate whether server-free doc parsing could be a viable product.',
    challenge:
      'Most document parsing tools require uploading files to a server, creating privacy risks for users with sensitive documents. The challenge was achieving useful extraction quality using only in-browser libraries, including OCR for scanned pages.',
    architecture:
      '<b>PDF.js</b> handles PDF rendering and text extraction. <b>mammoth.js</b> converts Word docx files to clean HTML. <b>Tesseract.js</b> runs OCR on scanned images directly in a Web Worker, preventing UI blocking. The prototype runs as a single HTML file with no build step.',
    outcomes: [
      { num: '3', label: 'document formats supported' },
      { num: '0', label: 'server uploads required' },
      { num: '1', label: 'HTML file, no build step' },
    ],
    stack: ['PDF.js', 'mammoth.js', 'Tesseract.js', 'Web Workers', 'Vanilla JS', 'FileReader API'],
    links: [
      { label: 'View on GitHub', href: 'https://github.com/moses910', type: 'secondary' },
    ],
  },
];

/* ===== State ===== */
let currentIndex = 0;     // index within PROJECTS
let visibleIds = PROJECTS.map(p => p.id);  // filtered set

/* ===== DOM refs ===== */
const overlay    = document.getElementById('modal-overlay');
const modalBody  = document.getElementById('modal-body');
const breadcrumb = document.getElementById('modal-breadcrumb');
const btnClose   = document.getElementById('modal-close');
const btnPrev    = document.getElementById('modal-prev');
const btnNext    = document.getElementById('modal-next');
const grid       = document.getElementById('projects-grid');

/* ===== Filter logic ===== */
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;
    const cards  = grid.querySelectorAll('.pcard');
    visibleIds   = [];

    cards.forEach(card => {
      const cats = (card.dataset.category || '').split(' ');
      const show = filter === 'all' || cats.includes(filter);
      if (show) {
        card.classList.remove('hidden');
        card.classList.add('fade-in');
        visibleIds.push(card.dataset.project);
        // remove animation class after it's done
        card.addEventListener('animationend', () => card.classList.remove('fade-in'), { once: true });
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

/* ===== Open modal ===== */
function openModal(projectId) {
  const idx = PROJECTS.findIndex(p => p.id === projectId);
  if (idx === -1) return;
  currentIndex = idx;
  renderModal(PROJECTS[idx]);
  overlay.hidden = false;
  document.body.style.overflow = 'hidden';
  modalBody.focus();
}

/* ===== Close modal ===== */
function closeModal() {
  overlay.hidden = true;
  document.body.style.overflow = '';
  // return focus to the card that triggered the modal
  const card = document.getElementById(PROJECTS[currentIndex].cardId);
  if (card) card.focus();
}

/* ===== Navigate between projects ===== */
function navigate(dir) {
  const newIdx = currentIndex + dir;
  if (newIdx < 0 || newIdx >= PROJECTS.length) return;
  currentIndex = newIdx;
  renderModal(PROJECTS[currentIndex], dir);
}

/* ===== Render modal content ===== */
function renderModal(project, dir = 0) {
  // Breadcrumb
  breadcrumb.textContent = `projects / ${project.slug}`;

  // Prev / next button states
  btnPrev.disabled = currentIndex === 0;
  btnNext.disabled = currentIndex === PROJECTS.length - 1;

  // Build HTML
  const linksHtml = project.links.map(l => `
    <a href="${l.href}" class="modal-link modal-link-${l.type}" ${l.href.startsWith('http') ? 'target="_blank" rel="noopener"' : ''}>
      ${l.label}
    </a>
  `).join('');

  const outcomesHtml = project.outcomes.map(o => `
    <div class="outcome-chip">
      <span class="outcome-num">${o.num}</span>
      <span class="outcome-label">${o.label}</span>
    </div>
  `).join('');

  const stackHtml = project.stack.map(s => `<span class="stack-pill">${s}</span>`).join('');

  const html = `
    <div class="modal-status">
      <div class="status ${project.statusClass} mono">
        <span class="dot ${project.dotClass}"></span>${project.statusLabel}
      </div>
    </div>

    <h2 class="modal-title" id="modal-project-title">${project.name}</h2>
    <p class="modal-tagline">${project.tagline}</p>

    <div class="modal-tags tags mono">
      ${project.stack.slice(0, 4).map(s => `<span class="tag">${s}</span>`).join('')}
    </div>

    <hr class="modal-divider">

    <div class="detail-section">
      <p class="detail-label">// overview</p>
      <p class="detail-text">${project.overview}</p>
    </div>

    <div class="detail-section">
      <p class="detail-label">// the problem</p>
      <p class="detail-text">${project.challenge}</p>
    </div>

    <div class="detail-section">
      <p class="detail-label">// architecture</p>
      <p class="detail-text">${project.architecture}</p>
    </div>

    <hr class="modal-divider">

    <div class="detail-section">
      <p class="detail-label">// outcomes</p>
      <div class="outcomes-grid">${outcomesHtml}</div>
    </div>

    <div class="detail-section">
      <p class="detail-label">// full stack</p>
      <div class="stack-list">${stackHtml}</div>
    </div>

    <hr class="modal-divider">

    <div class="modal-links">${linksHtml}</div>
  `;

  // Animate slide direction
  modalBody.classList.remove('modal-body-slide-enter');
  // Force reflow
  void modalBody.offsetWidth;
  modalBody.innerHTML = html;
  modalBody.classList.add('modal-body-slide-enter');
  modalBody.scrollTop = 0;
}

/* ===== Card click / keyboard ===== */
grid.querySelectorAll('.pcard').forEach(card => {
  card.addEventListener('click', () => openModal(card.dataset.project));
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openModal(card.dataset.project);
    }
  });
});

/* ===== Modal controls ===== */
btnClose.addEventListener('click', closeModal);
btnPrev.addEventListener('click', () => navigate(-1));
btnNext.addEventListener('click', () => navigate(1));

// Click backdrop to close
overlay.addEventListener('click', e => {
  if (e.target === overlay) closeModal();
});

// Keyboard: Escape, arrow keys
document.addEventListener('keydown', e => {
  if (overlay.hidden) return;
  if (e.key === 'Escape') { closeModal(); return; }
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); navigate(1); }
  if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   { e.preventDefault(); navigate(-1); }
});

/* ===== URL hash: allow deep-linking e.g. projects.html#lambda ===== */
(function checkHash() {
  const hash = window.location.hash.replace('#', '');
  if (hash && PROJECTS.some(p => p.id === hash)) {
    openModal(hash);
  }
})();
