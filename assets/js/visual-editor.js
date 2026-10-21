/* ==============================================================================
   Contemporary Korean Studies Lab (CKSL) — On-Page Visual Editor Engine
   Zero-code, 100% visual WYSIWYG editor for non-technical editors
   ============================================================================== */

(function () {
  'use strict';

  // Available Curated Palettes
  const PALETTES = {
    dancheong: {
      name: "Heritage Dancheong",
      desc: "Vermilion Red & Imperial Warm Gold",
      primary_red: "#A62B2B",
      primary_red_hover: "#8E2222",
      accent_gold: "#E5B842",
      accent_gold_soft: "#F3D580",
      brown_deep: "#4A2E1B",
      brown_light: "#7D5233",
      canvas_bg: "#FAF8F5",
      surface_card: "#FFFFFF",
      surface_warm: "#F4EFEA",
      ink_primary: "#141517",
      ink_muted: "#474D54",
      border_color: "#E2DDD6"
    },
    joseon: {
      name: "Royal Joseon Blue",
      desc: "Deep Cobalt Indigo & Luminous Gold",
      primary_red: "#1B365D",
      primary_red_hover: "#12243F",
      accent_gold: "#D4AF37",
      accent_gold_soft: "#F4E3A1",
      brown_deep: "#2C3E50",
      brown_light: "#4B6584",
      canvas_bg: "#F7F9FB",
      surface_card: "#FFFFFF",
      surface_warm: "#EDF2F7",
      ink_primary: "#0F172A",
      ink_muted: "#475569",
      border_color: "#CBD5E1"
    },
    hanok: {
      name: "Hanok Scholar Timber",
      desc: "Warm Earthen Cedar & Amber",
      primary_red: "#7B3F00",
      primary_red_hover: "#5C2F00",
      accent_gold: "#C68A4C",
      accent_gold_soft: "#E3BF8F",
      brown_deep: "#3D2314",
      brown_light: "#664228",
      canvas_bg: "#FAF7F2",
      surface_card: "#FFFFFF",
      surface_warm: "#F0E9DF",
      ink_primary: "#1C1917",
      ink_muted: "#57534E",
      border_color: "#E7E5E4"
    },
    midnight: {
      name: "Contemporary Midnight",
      desc: "Obsidian Slate & Crimson Accent",
      primary_red: "#C53030",
      primary_red_hover: "#9B2C2C",
      accent_gold: "#D69E2E",
      accent_gold_soft: "#ECC94B",
      brown_deep: "#1A202C",
      brown_light: "#2D3748",
      canvas_bg: "#F8FAFC",
      surface_card: "#FFFFFF",
      surface_warm: "#EDF2F7",
      ink_primary: "#0F172A",
      ink_muted: "#475569",
      border_color: "#E2E8F0"
    }
  };

  // State
  let isEditing = false;
  let currentPaletteKey = 'dancheong';
  let currentFontSize = '16px';
  let ornamentsState = {
    roof: true,
    flowers: true,
    underlines: true,
    lattice: true
  };

  // Check URL or LocalStorage on boot
  function init() {
    const urlParams = new URLSearchParams(window.location.search);
    const hasEditParam = urlParams.has('edit') || window.location.hash === '#edit';
    const storedState = localStorage.getItem('cksl_editor_active');

    // Load saved preferences if any
    const savedPalette = localStorage.getItem('cksl_palette');
    if (savedPalette && PALETTES[savedPalette]) {
      applyPalette(savedPalette, false);
    }

    const savedFont = localStorage.getItem('cksl_font_size');
    if (savedFont) {
      applyFontSize(savedFont, false);
    }

    if (hasEditParam || storedState === 'true') {
      enableEditor();
    }

    // Attach launcher click
    const launcher = document.getElementById('cksl-editor-launcher');
    if (launcher) {
      launcher.addEventListener('click', toggleEditor);
    }

    // Keyboard shortcut: Alt + E or Ctrl + Shift + E
    document.addEventListener('keydown', function (e) {
      if ((e.altKey && e.key.toLowerCase() === 'e') || (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'e')) {
        e.preventDefault();
        toggleEditor();
      }
    });

    setupModals();
    setupBlockWrappers();
  }

  function toggleEditor() {
    if (isEditing) {
      disableEditor();
    } else {
      enableEditor();
    }
  }

  function enableEditor() {
    isEditing = true;
    document.body.classList.add('cksl-editor-active');
    const bar = document.getElementById('cksl-editor-bar');
    if (bar) bar.classList.remove('hidden');

    const launcher = document.getElementById('cksl-editor-launcher');
    if (launcher) launcher.style.display = 'none';

    localStorage.setItem('cksl_editor_active', 'true');
    makeElementsEditable();
    showBlockControls();
  }

  function disableEditor() {
    isEditing = false;
    document.body.classList.remove('cksl-editor-active');
    const bar = document.getElementById('cksl-editor-bar');
    if (bar) bar.classList.add('hidden');

    const launcher = document.getElementById('cksl-editor-launcher');
    if (launcher) launcher.style.display = 'inline-flex';

    localStorage.setItem('cksl_editor_active', 'false');
    removeElementsEditable();
    closeAllModals();
  }

  // Make content elements visually editable
  function makeElementsEditable() {
    const selectors = [
      'h1',
      'h2.section-title',
      '.page-content-wrapper h2',
      'h3.theme-title',
      'h3.project-title',
      'h3.people-name',
      'p.hero-subtitle',
      'span.hero-tag',
      'span.section-kicker',
      'span.kicker-hangul',
      'p.lead',
      'p.theme-tagline',
      'p.theme-description',
      'p.project-desc',
      'p.project-pi',
      'p.people-role',
      '.markdown-body p',
      '.markdown-body li',
      '.markdown-body blockquote',
      '.callout-box p',
      '.cta-banner p',
      '.btn-primary',
      '.btn-secondary',
      '.theme-detail-link'
    ];

    selectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => {
        if (!el.hasAttribute('data-cksl-editable') && !el.closest('#cksl-editor-bar') && !el.closest('.cksl-modal-overlay')) {
          el.setAttribute('contenteditable', 'true');
          el.setAttribute('data-cksl-editable', 'true');
          el.setAttribute('spellcheck', 'false');
        }
      });
    });
  }

  function removeElementsEditable() {
    document.querySelectorAll('[data-cksl-editable]').forEach(el => {
      el.removeAttribute('contenteditable');
      el.removeAttribute('data-cksl-editable');
    });
  }

  // Block wrappers for reordering & deletion
  function setupBlockWrappers() {
    const container = document.querySelector('.page-content-wrapper') || document.querySelector('.main-content');
    if (!container) return;

    // Wrap direct sections
    const children = Array.from(container.children);
    children.forEach(child => {
      if (child.id === 'cksl-editor-bar' || child.classList.contains('cksl-modal-overlay') || child.classList.contains('cksl-insert-divider')) return;
      if (!child.classList.contains('cksl-block-wrapper')) {
        child.classList.add('cksl-block-wrapper');

        // Add action bar
        const controls = document.createElement('div');
        controls.className = 'cksl-block-controls';
        controls.innerHTML = `
          <button type="button" class="cksl-block-btn" data-action="up" title="Move Up">▲</button>
          <button type="button" class="cksl-block-btn" data-action="down" title="Move Down">▼</button>
          <button type="button" class="cksl-block-btn" data-action="delete" title="Delete Section" style="color: #EF4444;">✕</button>
        `;
        child.appendChild(controls);

        controls.querySelector('[data-action="up"]').addEventListener('click', (e) => {
          e.stopPropagation();
          const prev = child.previousElementSibling;
          if (prev && prev.classList.contains('cksl-block-wrapper')) {
            container.insertBefore(child, prev);
          }
        });

        controls.querySelector('[data-action="down"]').addEventListener('click', (e) => {
          e.stopPropagation();
          const next = child.nextElementSibling;
          if (next && next.classList.contains('cksl-block-wrapper')) {
            container.insertBefore(next, child);
          }
        });

        controls.querySelector('[data-action="delete"]').addEventListener('click', (e) => {
          e.stopPropagation();
          if (confirm('Delete this section?')) {
            child.remove();
          }
        });
      }
    });
  }

  function showBlockControls() {
    setupBlockWrappers();
  }

  // Palette Application
  function applyPalette(key, save = true) {
    const p = PALETTES[key];
    if (!p) return;
    currentPaletteKey = key;

    const r = document.documentElement;
    r.style.setProperty('--color-red', p.primary_red);
    r.style.setProperty('--color-red-hover', p.primary_red_hover);
    r.style.setProperty('--color-yellow-gold', p.accent_gold);
    r.style.setProperty('--color-yellow-gold-soft', p.accent_gold_soft);
    r.style.setProperty('--color-brown-deep', p.brown_deep);
    r.style.setProperty('--color-brown-light', p.brown_light);
    r.style.setProperty('--color-canvas', p.canvas_bg);
    r.style.setProperty('--color-surface', p.surface_card);
    r.style.setProperty('--color-surface-warm', p.surface_warm);
    r.style.setProperty('--color-ink', p.ink_primary);
    r.style.setProperty('--color-ink-muted', p.ink_muted);
    r.style.setProperty('--color-border', p.border_color);

    if (save) {
      localStorage.setItem('cksl_palette', key);
    }

    // Update active state in modal
    document.querySelectorAll('.cksl-palette-card').forEach(card => {
      if (card.getAttribute('data-palette') === key) {
        card.classList.add('selected');
      } else {
        card.classList.remove('selected');
      }
    });
  }

  // Font Size Application
  function applyFontSize(size, save = true) {
    currentFontSize = size;
    document.documentElement.style.fontSize = size;
    if (save) {
      localStorage.setItem('cksl_font_size', size);
    }
    document.querySelectorAll('.cksl-type-btn').forEach(btn => {
      if (btn.getAttribute('data-size') === size) {
        btn.classList.add('selected');
      } else {
        btn.classList.remove('selected');
      }
    });
  }

  // Ornaments Application
  function applyOrnamentToggle(ornamentKey, isVisible) {
    ornamentsState[ornamentKey] = isVisible;
    if (ornamentKey === 'roof') {
      document.querySelectorAll('.korean-roof-accent').forEach(el => el.style.display = isVisible ? '' : 'none');
    } else if (ornamentKey === 'flowers') {
      document.querySelectorAll('.korean-divider').forEach(el => el.style.display = isVisible ? '' : 'none');
    } else if (ornamentKey === 'underlines') {
      document.querySelectorAll('.korean-title-underline').forEach(el => el.style.display = isVisible ? '' : 'none');
    } else if (ornamentKey === 'lattice') {
      document.querySelectorAll('.hero-lattice-layer').forEach(el => el.style.display = isVisible ? '' : 'none');
    }
  }

  // Modals management
  function setupModals() {
    // Buttons in top bar
    const themeBtn = document.getElementById('cksl-btn-theme');
    const typeBtn = document.getElementById('cksl-btn-type');
    const ornamentBtn = document.getElementById('cksl-btn-ornaments');
    const addBlockBtn = document.getElementById('cksl-btn-add-block');
    const publishBtn = document.getElementById('cksl-btn-publish');
    const closeBarBtn = document.getElementById('cksl-btn-close-bar');

    if (themeBtn) themeBtn.addEventListener('click', () => openModal('cksl-modal-theme'));
    if (typeBtn) typeBtn.addEventListener('click', () => openModal('cksl-modal-type'));
    if (ornamentBtn) ornamentBtn.addEventListener('click', () => openModal('cksl-modal-ornaments'));
    if (addBlockBtn) addBlockBtn.addEventListener('click', () => openModal('cksl-modal-blocks'));
    if (publishBtn) publishBtn.addEventListener('click', () => openModal('cksl-modal-publish'));
    if (closeBarBtn) closeBarBtn.addEventListener('click', disableEditor);

    // Modal close buttons & background click
    document.querySelectorAll('.cksl-modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal(overlay.id);
      });
      const closeBtn = overlay.querySelector('.cksl-modal-close');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => closeModal(overlay.id));
      }
    });

    // Palette selection events
    document.querySelectorAll('.cksl-palette-card').forEach(card => {
      card.addEventListener('click', () => {
        const pal = card.getAttribute('data-palette');
        applyPalette(pal);
      });
    });

    // Typography selection events
    document.querySelectorAll('.cksl-type-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const size = btn.getAttribute('data-size');
        applyFontSize(size);
      });
    });

    // Ornaments toggle events
    document.querySelectorAll('.cksl-ornament-switch').forEach(input => {
      input.addEventListener('change', () => {
        const key = input.getAttribute('data-ornament');
        applyOrnamentToggle(key, input.checked);
      });
    });

    // Block inserters
    document.querySelectorAll('.cksl-block-card').forEach(card => {
      card.addEventListener('click', () => {
        const type = card.getAttribute('data-block-type');
        insertBlock(type);
        closeModal('cksl-modal-blocks');
      });
    });

    // GitHub publish logic
    const saveTokenBtn = document.getElementById('cksl-btn-save-token');
    const doPublishBtn = document.getElementById('cksl-btn-do-publish');
    const downloadBtn = document.getElementById('cksl-btn-download');

    if (saveTokenBtn) {
      saveTokenBtn.addEventListener('click', saveGitHubToken);
    }
    if (doPublishBtn) {
      doPublishBtn.addEventListener('click', publishToGitHub);
    }
    if (downloadBtn) {
      downloadBtn.addEventListener('click', downloadBackup);
    }

    // Populate saved token
    const tokenInput = document.getElementById('cksl-gh-token');
    if (tokenInput) {
      const saved = localStorage.getItem('cksl_gh_token');
      if (saved) tokenInput.value = saved;
    }
  }

  function openModal(id) {
    closeAllModals();
    const modal = document.getElementById(id);
    if (modal) modal.classList.add('open');
  }

  function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.remove('open');
  }

  function closeAllModals() {
    document.querySelectorAll('.cksl-modal-overlay').forEach(m => m.classList.remove('open'));
  }

  // Insert a new block visually into the page
  function insertBlock(type) {
    const container = document.querySelector('.page-content-wrapper') || document.querySelector('.main-content');
    if (!container) return;

    let html = '';
    if (type === 'text_block') {
      html = `
        <div class="cksl-block-wrapper" style="margin: 36px 0;">
          <div class="kicker-group">
            <span class="section-kicker" contenteditable="true" data-cksl-editable="true">Academic Initiative</span>
            <span class="kicker-hangul" contenteditable="true" data-cksl-editable="true">연구 영역</span>
          </div>
          <h2 class="section-title" contenteditable="true" data-cksl-editable="true" style="margin-top: 6px;">New Section Heading</h2>
          <div class="korean-title-underline"><span class="korean-title-underline-line"></span><span class="korean-title-underline-flower">🌸</span><span class="korean-title-underline-line"></span></div>
          <p class="lead" contenteditable="true" data-cksl-editable="true" style="margin-top: 18px;">Click here to edit this lead highlight paragraph for the section.</p>
          <div class="markdown-body">
            <p contenteditable="true" data-cksl-editable="true">Click here to write detailed text, citations, or scholarly descriptions.</p>
          </div>
        </div>
      `;
    } else if (type === 'flower_divider') {
      html = `
        <div class="cksl-block-wrapper" style="margin: 28px 0;">
          <div class="korean-divider" role="separator">
            <span class="korean-divider-line"></span>
            <span class="korean-divider-flower">🌸</span>
            <span class="korean-divider-line"></span>
          </div>
        </div>
      `;
    } else if (type === 'hanok_roof') {
      html = `
        <div class="cksl-block-wrapper" style="margin: 28px 0; text-align: center;">
          <div class="korean-roof-accent" style="margin: 0 auto;">
            <svg class="korean-roof-svg" viewBox="0 0 120 20" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 120px; height: 20px;">
              <path d="M4 16C28 10 46 7 60 7C74 7 92 10 116 16" stroke="var(--color-yellow-gold, #E5B842)" stroke-width="2.5" stroke-linecap="round"/>
              <circle cx="60" cy="7" r="3.5" fill="var(--color-red, #A62B2B)"/>
            </svg>
          </div>
        </div>
      `;
    } else if (type === 'card_grid') {
      html = `
        <div class="cksl-block-wrapper" style="margin: 36px 0;">
          <div class="kicker-group">
            <span class="section-kicker" contenteditable="true" data-cksl-editable="true">Initiatives</span>
            <span class="kicker-hangul" contenteditable="true" data-cksl-editable="true">사업 분야</span>
          </div>
          <h2 class="section-title" contenteditable="true" data-cksl-editable="true">Project Clusters</h2>
          <div class="projects-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-top: 24px;">
            <div class="project-card" style="background: var(--color-surface, #FFFFFF); border: 1px solid var(--color-border, #E2DDD6); border-radius: 8px; padding: 24px;">
              <span class="project-badge" contenteditable="true" data-cksl-editable="true" style="font-size: 0.76rem; color: var(--color-red, #A62B2B); font-weight: 700;">Active Grant</span>
              <h3 class="project-title" contenteditable="true" data-cksl-editable="true" style="font-size: 1.15rem; margin: 10px 0;">Card Initiative Title 1</h3>
              <p class="project-desc" contenteditable="true" data-cksl-editable="true" style="font-size: 0.92rem; color: var(--color-ink-muted, #474D54);">Click to edit card description.</p>
            </div>
            <div class="project-card" style="background: var(--color-surface, #FFFFFF); border: 1px solid var(--color-border, #E2DDD6); border-radius: 8px; padding: 24px;">
              <span class="project-badge" contenteditable="true" data-cksl-editable="true" style="font-size: 0.76rem; color: var(--color-red, #A62B2B); font-weight: 700;">Colloquium</span>
              <h3 class="project-title" contenteditable="true" data-cksl-editable="true" style="font-size: 1.15rem; margin: 10px 0;">Card Initiative Title 2</h3>
              <p class="project-desc" contenteditable="true" data-cksl-editable="true" style="font-size: 0.92rem; color: var(--color-ink-muted, #474D54);">Click to edit card description.</p>
            </div>
            <div class="project-card" style="background: var(--color-surface, #FFFFFF); border: 1px solid var(--color-border, #E2DDD6); border-radius: 8px; padding: 24px;">
              <span class="project-badge" contenteditable="true" data-cksl-editable="true" style="font-size: 0.76rem; color: var(--color-red, #A62B2B); font-weight: 700;">Fellowship</span>
              <h3 class="project-title" contenteditable="true" data-cksl-editable="true" style="font-size: 1.15rem; margin: 10px 0;">Card Initiative Title 3</h3>
              <p class="project-desc" contenteditable="true" data-cksl-editable="true" style="font-size: 0.92rem; color: var(--color-ink-muted, #474D54);">Click to edit card description.</p>
            </div>
          </div>
        </div>
      `;
    } else if (type === 'callout_box') {
      html = `
        <div class="cksl-block-wrapper" style="margin: 36px 0;">
          <div class="callout-box" style="background: var(--color-surface-warm, #F4EFEA); border-left: 4px solid var(--color-red, #A62B2B); border-radius: 8px; padding: 28px;">
            <h3 contenteditable="true" data-cksl-editable="true" style="font-size: 1.25rem; font-weight: 700; margin-bottom: 12px; color: var(--color-ink);">Institutional Announcement</h3>
            <p contenteditable="true" data-cksl-editable="true" style="margin-bottom: 16px;">Click here to edit this institutional context or mission callout.</p>
            <a href="/cksl/contact/" class="btn btn-primary" contenteditable="true" data-cksl-editable="true">Contact Directorate →</a>
          </div>
        </div>
      `;
    } else if (type === 'cta_banner') {
      html = `
        <div class="cksl-block-wrapper" style="margin: 40px 0;">
          <div class="cta-banner" style="background: linear-gradient(135deg, var(--color-surface-warm, #F4EFEA) 0%, var(--color-canvas, #FAF8F5) 100%); border: 1px solid var(--color-border, #E2DDD6); border-radius: 10px; padding: 36px; text-align: center;">
            <span class="section-kicker" contenteditable="true" data-cksl-editable="true">Scholarly Collaboration</span>
            <h3 contenteditable="true" data-cksl-editable="true" style="font-size: 1.45rem; font-weight: 700; margin: 10px 0 14px;">Partner with Contemporary Korean Studies Lab</h3>
            <p contenteditable="true" data-cksl-editable="true" style="max-width: 680px; margin: 0 auto 20px; color: var(--color-ink-muted);">We welcome visiting researchers, postdoctoral fellows, and academic institutional inquiries.</p>
            <a href="/cksl/contact/" class="btn btn-primary" contenteditable="true" data-cksl-editable="true">Submit an Academic Inquiry →</a>
          </div>
        </div>
      `;
    }

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html.trim();
    const newElement = tempDiv.firstChild;
    container.appendChild(newElement);

    makeElementsEditable();
    setupBlockWrappers();
    newElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  // Save Token
  function saveGitHubToken() {
    const input = document.getElementById('cksl-gh-token');
    if (!input || !input.value.trim()) {
      alert('Please enter a valid GitHub token.');
      return;
    }
    localStorage.setItem('cksl_gh_token', input.value.trim());
    showStatus('Token saved securely in your browser!', 'success');
  }

  // Generate Theme YAML string from current settings
  function generateThemeYAML() {
    const p = PALETTES[currentPaletteKey] || PALETTES.dancheong;
    return `# ==============================================================================
# Contemporary Korean Studies Lab (CKSL) — Theme & Styling Settings
# Auto-generated via CKSL On-Page Visual Editor
# ==============================================================================

colors:
  primary_red: "${p.primary_red}"
  primary_red_hover: "${p.primary_red_hover}"
  accent_gold: "${p.accent_gold}"
  accent_gold_soft: "${p.accent_gold_soft}"
  brown_deep: "${p.brown_deep}"
  brown_light: "${p.brown_light}"
  canvas_bg: "${p.canvas_bg}"
  surface_card: "${p.surface_card}"
  surface_warm: "${p.surface_warm}"
  ink_primary: "${p.ink_primary}"
  ink_muted: "${p.ink_muted}"
  border_color: "${p.border_color}"

typography:
  base_font_size: "${currentFontSize}"
  font_family: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif"

ornaments:
  show_hero_roof_accent: ${ornamentsState.roof}
  show_flower_dividers: ${ornamentsState.flowers}
  show_title_underlines: ${ornamentsState.underlines}
  show_hero_lattice_pattern: ${ornamentsState.lattice}

effects:
  enable_parallax: true
  hero_scrim_opacity: 0.52
`;
  }

  // Download Backup
  function downloadBackup() {
    const yaml = generateThemeYAML();
    const blob = new Blob([yaml], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'theme.yml';
    a.click();
    URL.revokeObjectURL(url);
    showStatus('Downloaded theme.yml successfully!', 'success');
  }

  // Publish Directly to GitHub via REST API
  async function publishToGitHub() {
    const token = localStorage.getItem('cksl_gh_token');
    if (!token) {
      showStatus('Please enter and save your GitHub Personal Access Token above first.', 'error');
      return;
    }

    showStatus('Connecting to GitHub repository profkwanminlee/cksl...', 'loading');

    try {
      const repo = 'profkwanminlee/cksl';
      const branch = 'main';
      const path = '_data/theme.yml';
      const apiUrl = `https://api.github.com/repos/${repo}/contents/${path}?ref=${branch}`;

      // 1. Fetch current file SHA
      let sha = '';
      const getRes = await fetch(apiUrl, {
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      if (getRes.ok) {
        const getData = await getRes.json();
        sha = getData.sha;
      } else if (getRes.status === 401) {
        showStatus('Invalid GitHub Token. Please check token permissions (needs "repo" or contents write access).', 'error');
        return;
      }

      // 2. Put updated content
      const content = generateThemeYAML();
      const utf8Bytes = new TextEncoder().encode(content);
      let binary = '';
      for (let i = 0; i < utf8Bytes.length; i++) {
        binary += String.fromCharCode(utf8Bytes[i]);
      }
      const b64Content = btoa(binary);

      const putRes = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
        method: 'PUT',
        headers: {
          'Authorization': `token ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/vnd.github.v3+json'
        },
        body: JSON.stringify({
          message: `Update theme styling via CKSL Visual Editor [${new Date().toLocaleDateString()}]`,
          content: b64Content,
          branch: branch,
          sha: sha || undefined
        })
      });

      if (putRes.ok) {
        showStatus('🚀 Successfully Published to GitHub! GitHub Pages will automatically deploy your live changes in ~30 seconds.', 'success');
      } else {
        const errData = await putRes.json();
        showStatus(`GitHub API Error: ${errData.message || 'Failed to commit file.'}`, 'error');
      }
    } catch (err) {
      showStatus(`Network Error: ${err.message}`, 'error');
    }
  }

  function showStatus(msg, type) {
    const banner = document.getElementById('cksl-publish-status');
    if (!banner) return;
    banner.textContent = msg;
    banner.className = `cksl-status-banner ${type}`;
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
