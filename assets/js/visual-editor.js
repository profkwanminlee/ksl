/* ==============================================================================
   Contemporary Korean Studies Lab (CKSL) — Studio Site Editor Engine
   Word × WordPress × Figma in-browser visual editing workspace.
   Per-word selection formatting, 10 authentic Korean vector SVG motifs,
   Figma card/box controls, landscape gallery, and git draft staging.
   ============================================================================== */

(function () {
  'use strict';

  // API Bridge URL for local git staging & file management
  const API_BASE = 'http://127.0.0.1:4005';

  // State
  let isEditing = false;
  let isRibbonCollapsed = false;
  let isSidebarCollapsed = false;
  let currentDevice = 'desktop';
  let activeElement = null;
  let activeBox = null;
  let copiedBoxHtml = null;
  let isBridgeConnected = false;
  let activeSideTab = 'structure';

  // 10 Authentic Korean Vector SVGs (Zero Emojis!)
  const MOTIF_SVGS = {
    maehwa_blossom: `
      <svg viewBox="0 0 100 100" fill="none" class="cksl-svg-motif" style="width: 48px; height: 48px;" aria-label="Maehwa Plum Blossom">
        <circle cx="50" cy="24" r="14" fill="var(--color-red, #A62B2B)"/>
        <circle cx="74" cy="42" r="14" fill="var(--color-red, #A62B2B)"/>
        <circle cx="65" cy="72" r="14" fill="var(--color-red, #A62B2B)"/>
        <circle cx="35" cy="72" r="14" fill="var(--color-red, #A62B2B)"/>
        <circle cx="26" cy="42" r="14" fill="var(--color-red, #A62B2B)"/>
        <circle cx="50" cy="50" r="10" fill="#8E2222"/>
        <path d="M50 50L50 32M50 50L67 38M50 50L61 65M50 50L39 65M50 50L33 38" stroke="var(--color-yellow-gold, #E5B842)" stroke-width="2.2" stroke-linecap="round"/>
        <circle cx="50" cy="30" r="2.5" fill="var(--color-yellow-gold, #E5B842)"/>
        <circle cx="69" cy="36" r="2.5" fill="var(--color-yellow-gold, #E5B842)"/>
        <circle cx="63" cy="67" r="2.5" fill="var(--color-yellow-gold, #E5B842)"/>
        <circle cx="37" cy="67" r="2.5" fill="var(--color-yellow-gold, #E5B842)"/>
        <circle cx="31" cy="36" r="2.5" fill="var(--color-yellow-gold, #E5B842)"/>
        <circle cx="50" cy="50" r="3.5" fill="var(--color-yellow-gold, #E5B842)"/>
      </svg>
    `,
    flower_divider: `
      <div style="display: flex; align-items: center; justify-content: center; gap: 16px; margin: 32px 0; width: 100%;">
        <svg viewBox="0 0 360 36" fill="none" class="cksl-svg-motif" style="width: 100%; max-width: 440px; height: auto;">
          <line x1="10" y1="18" x2="120" y2="18" stroke="var(--color-border, #E2DDD6)" stroke-width="1.2"/>
          <path d="M120 18C132 18 138 12 144 14C150 16 156 22 164 18" stroke="var(--color-yellow-gold, #E5B842)" stroke-width="1.8" stroke-linecap="round"/>
          <circle cx="144" cy="13" r="2" fill="var(--color-yellow-gold, #E5B842)"/>
          <g transform="translate(180, 18) scale(0.24) translate(-50, -50)">
            <circle cx="50" cy="24" r="14" fill="var(--color-red, #A62B2B)"/>
            <circle cx="74" cy="42" r="14" fill="var(--color-red, #A62B2B)"/>
            <circle cx="65" cy="72" r="14" fill="var(--color-red, #A62B2B)"/>
            <circle cx="35" cy="72" r="14" fill="var(--color-red, #A62B2B)"/>
            <circle cx="26" cy="42" r="14" fill="var(--color-red, #A62B2B)"/>
            <circle cx="50" cy="50" r="9" fill="#8E2222"/>
            <path d="M50 50L50 32M50 50L67 38M50 50L61 65M50 50L39 65M50 50L33 38" stroke="var(--color-yellow-gold, #E5B842)" stroke-width="2.2" stroke-linecap="round"/>
            <circle cx="50" cy="30" r="2.8" fill="var(--color-yellow-gold, #E5B842)"/>
            <circle cx="69" cy="36" r="2.8" fill="var(--color-yellow-gold, #E5B842)"/>
            <circle cx="63" cy="67" r="2.8" fill="var(--color-yellow-gold, #E5B842)"/>
            <circle cx="37" cy="67" r="2.8" fill="var(--color-yellow-gold, #E5B842)"/>
            <circle cx="31" cy="36" r="2.8" fill="var(--color-yellow-gold, #E5B842)"/>
            <circle cx="50" cy="50" r="4" fill="var(--color-yellow-gold, #E5B842)"/>
          </g>
          <path d="M196 18C204 22 210 16 216 14C222 12 228 18 240 18" stroke="var(--color-yellow-gold, #E5B842)" stroke-width="1.8" stroke-linecap="round"/>
          <circle cx="216" cy="13" r="2" fill="var(--color-yellow-gold, #E5B842)"/>
          <line x1="240" y1="18" x2="350" y2="18" stroke="var(--color-border, #E2DDD6)" stroke-width="1.2"/>
        </svg>
      </div>
    `,
    hanok_roof: `
      <svg viewBox="0 0 240 32" fill="none" class="cksl-svg-motif" style="width: 180px; height: auto;" aria-label="Hanok Cheoma Eaves">
        <path d="M8 26C54 13 86 8 120 8C154 8 186 13 232 26" stroke="var(--color-yellow-gold, #E5B842)" stroke-width="3" stroke-linecap="round"/>
        <path d="M24 28C62 17 90 12 120 12C150 12 178 17 216 28" stroke="var(--color-red, #A62B2B)" stroke-width="1.5" stroke-linecap="round" opacity="0.9"/>
        <circle cx="120" cy="8" r="6" fill="var(--color-red, #A62B2B)"/>
        <circle cx="120" cy="8" r="3" fill="var(--color-yellow-gold, #E5B842)"/>
        <circle cx="120" cy="8" r="1.2" fill="var(--color-brown-deep, #4A2E1B)"/>
      </svg>
    `,
    title_underline: `
      <svg viewBox="0 0 120 12" fill="none" class="cksl-svg-motif" style="width: 110px; height: 12px;">
        <line x1="0" y1="6" x2="48" y2="6" stroke="var(--color-red, #A62B2B)" stroke-width="2.5" stroke-linecap="round"/>
        <circle cx="56" cy="6" r="4.5" fill="var(--color-red, #A62B2B)"/>
        <circle cx="56" cy="6" r="2" fill="var(--color-yellow-gold, #E5B842)"/>
        <line x1="64" y1="6" x2="88" y2="6" stroke="var(--color-yellow-gold, #E5B842)" stroke-width="2" stroke-linecap="round"/>
        <circle cx="94" cy="6" r="1.5" fill="var(--color-yellow-gold, #E5B842)"/>
      </svg>
    `,
    cloud_unmun: `
      <svg viewBox="0 0 180 50" fill="none" class="cksl-svg-motif" style="width: 140px; height: auto;" aria-label="Auspicious Cloud Unmun">
        <path d="M24 38C14 38 6 32 10 22C14 12 28 10 34 16C40 8 56 6 66 14C74 6 90 8 96 16C104 10 118 14 120 24C126 24 132 28 130 34C128 40 120 40 114 40L24 40Z" stroke="var(--color-red, #A62B2B)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        <line x1="126" y1="26" x2="158" y2="26" stroke="var(--color-red, #A62B2B)" stroke-width="2" stroke-linecap="round"/>
        <line x1="134" y1="34" x2="168" y2="34" stroke="var(--color-yellow-gold, #E5B842)" stroke-width="2" stroke-linecap="round"/>
        <circle cx="174" cy="26" r="2.5" fill="var(--color-red, #A62B2B)"/>
        <circle cx="178" cy="34" r="3" fill="var(--color-yellow-gold, #E5B842)"/>
        <path d="M38 28C44 24 52 24 58 28" stroke="var(--color-yellow-gold, #E5B842)" stroke-width="1.8" stroke-linecap="round"/>
        <path d="M74 24C80 20 88 20 94 24" stroke="var(--color-yellow-gold, #E5B842)" stroke-width="1.8" stroke-linecap="round"/>
      </svg>
    `,
    pavilion: `
      <div style="display: inline-flex; align-items: center; justify-content: center; width: 68px; height: 68px; background: rgba(166, 43, 43, 0.05); border: 1.5px solid var(--color-border, #E2DDD6); border-radius: 12px; padding: 8px;">
        <svg viewBox="0 0 54 54" fill="none" class="cksl-svg-motif" style="width: 50px; height: 50px;" aria-label="Hanok Palace Pavilion">
          <path d="M5 24C16 17 23 13 27 13C31 13 38 17 49 24" stroke="var(--color-red, #A62B2B)" stroke-width="3" stroke-linecap="round"/>
          <path d="M12 23L16 16H38L42 23" stroke="var(--color-yellow-gold, #E5B842)" stroke-width="2" stroke-linecap="round"/>
          <line x1="16" y1="24" x2="16" y2="40" stroke="var(--color-brown-deep, #4A2E1B)" stroke-width="2" stroke-linecap="round"/>
          <line x1="23" y1="24" x2="23" y2="40" stroke="var(--color-brown-deep, #4A2E1B)" stroke-width="2" stroke-linecap="round"/>
          <line x1="31" y1="24" x2="31" y2="40" stroke="var(--color-brown-deep, #4A2E1B)" stroke-width="2" stroke-linecap="round"/>
          <line x1="38" y1="24" x2="38" y2="40" stroke="var(--color-brown-deep, #4A2E1B)" stroke-width="2" stroke-linecap="round"/>
          <line x1="9" y1="40" x2="45" y2="40" stroke="var(--color-brown-deep, #4A2E1B)" stroke-width="2.8" stroke-linecap="round"/>
          <circle cx="27" cy="10" r="2.5" fill="var(--color-yellow-gold, #E5B842)"/>
        </svg>
      </div>
    `,
    dancheong_corner: `
      <svg viewBox="0 0 50 50" fill="none" class="cksl-svg-motif" style="width: 44px; height: 44px;" aria-label="Dancheong Corner Fret">
        <path d="M3 47V8C3 5.2 5.2 3 8 3H47" stroke="var(--color-red, #A62B2B)" stroke-width="3.5" stroke-linecap="round"/>
        <path d="M11 43V14C11 12.3 12.3 11 14 11H43" stroke="var(--color-yellow-gold, #E5B842)" stroke-width="2" stroke-linecap="round"/>
        <path d="M19 39V22H36" stroke="var(--color-red, #A62B2B)" stroke-width="1.8" stroke-linecap="round"/>
        <rect x="22" y="25" width="8" height="8" fill="var(--color-yellow-gold, #E5B842)"/>
      </svg>
    `,
    korean_fan: `
      <svg viewBox="0 0 90 70" fill="none" class="cksl-svg-motif" style="width: 72px; height: auto;" aria-label="Korean Folding Fan Buchae">
        <path d="M10 42C18 20 40 10 45 10C50 10 72 20 80 42L45 54L10 42Z" fill="rgba(166, 43, 43, 0.12)" stroke="var(--color-red, #A62B2B)" stroke-width="1.8" stroke-linejoin="round"/>
        <line x1="45" y1="54" x2="16" y2="38" stroke="var(--color-red, #A62B2B)" stroke-width="1.4"/>
        <line x1="45" y1="54" x2="28" y2="26" stroke="var(--color-red, #A62B2B)" stroke-width="1.4"/>
        <line x1="45" y1="54" x2="45" y2="12" stroke="var(--color-yellow-gold, #E5B842)" stroke-width="1.6"/>
        <line x1="45" y1="54" x2="62" y2="26" stroke="var(--color-red, #A62B2B)" stroke-width="1.4"/>
        <line x1="45" y1="54" x2="74" y2="38" stroke="var(--color-red, #A62B2B)" stroke-width="1.4"/>
        <circle cx="45" cy="54" r="3.5" fill="var(--color-yellow-gold, #E5B842)"/>
        <line x1="45" y1="57.5" x2="45" y2="68" stroke="var(--color-red, #A62B2B)" stroke-width="1.6" stroke-linecap="round"/>
      </svg>
    `,
    lotus_blossom: `
      <svg viewBox="0 0 70 70" fill="none" class="cksl-svg-motif" style="width: 56px; height: 56px;" aria-label="Royal Lotus Medallion">
        <circle cx="35" cy="35" r="32" stroke="var(--color-border, #E2DDD6)" stroke-width="1.5"/>
        <circle cx="35" cy="35" r="26" stroke="var(--color-yellow-gold, #E5B842)" stroke-width="1.8" stroke-dasharray="2.5 3"/>
        <path d="M35 12C32 22 35 29 35 35C35 29 38 22 35 12Z" fill="var(--color-red, #A62B2B)"/>
        <path d="M35 58C32 48 35 41 35 35C35 41 38 48 35 58Z" fill="var(--color-red, #A62B2B)"/>
        <path d="M12 35C22 32 29 35 35 35C29 35 22 38 12 35Z" fill="var(--color-red, #A62B2B)"/>
        <path d="M58 35C48 32 41 35 35 35C41 35 48 38 58 35Z" fill="var(--color-red, #A62B2B)"/>
        <circle cx="23" cy="23" r="4.5" fill="var(--color-red, #A62B2B)" opacity="0.8"/>
        <circle cx="47" cy="23" r="4.5" fill="var(--color-red, #A62B2B)" opacity="0.8"/>
        <circle cx="23" cy="47" r="4.5" fill="var(--color-red, #A62B2B)" opacity="0.8"/>
        <circle cx="47" cy="47" r="4.5" fill="var(--color-red, #A62B2B)" opacity="0.8"/>
        <circle cx="35" cy="35" r="5" fill="var(--color-yellow-gold, #E5B842)"/>
      </svg>
    `,
    korean_seal: `
      <div style="display: inline-flex; align-items: center; justify-content: center; width: 44px; height: 44px; border: 2.5px solid var(--color-red, #A62B2B); border-radius: 4px; background: rgba(166, 43, 43, 0.05); font-family: 'Noto Serif KR', serif; font-size: 0.82rem; font-weight: 700; color: var(--color-red, #A62B2B); letter-spacing: 0.04em; text-align: center; line-height: 1.15; box-shadow: inset 0 0 0 1px rgba(166, 43, 43, 0.2);">
        한국<br>학연
      </div>
    `
  };

  // Curated Color Palettes
  const PALETTES = {
    dancheong: {
      primary_red: "#A62B2B", primary_red_hover: "#8E2222",
      accent_gold: "#E5B842", accent_gold_soft: "#F3D580",
      brown_deep: "#4A2E1B", brown_light: "#7D5233",
      canvas_bg: "#FAF8F5", surface_card: "#FFFFFF", surface_warm: "#F4EFEA",
      ink_primary: "#141517", ink_muted: "#474D54", border_color: "#E2DDD6"
    },
    joseon: {
      primary_red: "#1B365D", primary_red_hover: "#12243F",
      accent_gold: "#D4AF37", accent_gold_soft: "#F4E3A1",
      brown_deep: "#2C3E50", brown_light: "#4B6584",
      canvas_bg: "#F7F9FB", surface_card: "#FFFFFF", surface_warm: "#EDF2F7",
      ink_primary: "#0F172A", ink_muted: "#475569", border_color: "#CBD5E1"
    },
    hanok: {
      primary_red: "#7B3F00", primary_red_hover: "#5C2F00",
      accent_gold: "#C68A4C", accent_gold_soft: "#E3BF8F",
      brown_deep: "#3D2314", brown_light: "#664228",
      canvas_bg: "#FAF7F2", surface_card: "#FFFFFF", surface_warm: "#F0E9DF",
      ink_primary: "#1C1917", ink_muted: "#57534E", border_color: "#E7E5E4"
    },
    midnight: {
      primary_red: "#C53030", primary_red_hover: "#9B2C2C",
      accent_gold: "#D69E2E", accent_gold_soft: "#ECC94B",
      brown_deep: "#1A202C", brown_light: "#2D3748",
      canvas_bg: "#F8FAFC", surface_card: "#FFFFFF", surface_warm: "#EDF2F7",
      ink_primary: "#0F172A", ink_muted: "#475569", border_color: "#E2E8F0"
    }
  };

  // Entry Point
  function init() {
    const urlParams = new URLSearchParams(window.location.search);
    const hasEditParam = urlParams.has('edit') || window.location.hash === '#edit';
    const storedState = localStorage.getItem('cksl_editor_active');

    // Restore saved palette and font
    const savedPal = localStorage.getItem('cksl_palette');
    if (savedPal && PALETTES[savedPal]) applyPalette(savedPal, false);
    const savedFont = localStorage.getItem('cksl_font_size');
    if (savedFont) applyFontSize(savedFont, false);

    if (hasEditParam || storedState === 'true') {
      enableEditor();
    }

    // Attach launcher
    const launcher = document.getElementById('cksl-editor-launcher');
    if (launcher) launcher.addEventListener('click', enableEditor);

    // Keyboard shortcut: Alt + E
    document.addEventListener('keydown', function (e) {
      if ((e.altKey && e.key.toLowerCase() === 'e') || (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'e')) {
        e.preventDefault();
        isEditing ? disableEditor() : enableEditor();
      }
    });

    setupRibbon();
    setupSidebar();
    setupTextSelectionToolbar();
    setupInspector();
    setupModals();
    setupHeroChanger();
    setupBoxHotkeys();
    checkBridgeStatus();
  }

  // 1. Enable / Disable Editor
  async function enableEditor() {
    isEditing = true;
    document.body.classList.add('cksl-editor-active');

    const ribbon = document.getElementById('cksl-ribbon');
    if (ribbon) ribbon.classList.remove('hidden');

    const sidebar = document.getElementById('cksl-sidebar');
    if (sidebar) sidebar.classList.remove('hidden');

    const launcher = document.getElementById('cksl-editor-launcher');
    if (launcher) launcher.style.display = 'none';

    updateLayoutVariables();
    makeContentEditable();
    buildSidebarOutline();
    localStorage.setItem('cksl_editor_active', 'true');

    // Initialize git draft staging session
    await initDraftSession();
  }

  function disableEditor() {
    isEditing = false;
    document.body.classList.remove('cksl-editor-active');

    const ribbon = document.getElementById('cksl-ribbon');
    if (ribbon) ribbon.classList.add('hidden');

    const sidebar = document.getElementById('cksl-sidebar');
    if (sidebar) sidebar.classList.add('hidden');

    const inspector = document.getElementById('cksl-floating-inspector');
    if (inspector) inspector.classList.add('hidden');

    hideTextSelectionToolbar();

    const launcher = document.getElementById('cksl-editor-launcher');
    if (launcher) launcher.style.display = 'inline-flex';

    removeContentEditable();
    closeAllModals();
    localStorage.setItem('cksl_editor_active', 'false');
  }

  function updateLayoutVariables() {
    const root = document.documentElement;
    const ribbonH = isRibbonCollapsed ? '42px' : '94px';
    const sidebarW = isSidebarCollapsed ? '0px' : '260px';
    root.style.setProperty('--cksl-ribbon-height', ribbonH);
    root.style.setProperty('--cksl-sidebar-width', sidebarW);
  }

  // 2. Draft Session Staging Architecture (Isolates edits on temp draft-session branch)
  async function checkBridgeStatus() {
    try {
      const res = await fetch(`${API_BASE}/api/status`);
      if (res.ok) {
        isBridgeConnected = true;
        const data = await res.json();
        updateDraftBadge(data.currentBranch, data.isDraftSession);
      }
    } catch (e) {
      isBridgeConnected = false;
    }
  }

  async function initDraftSession() {
    try {
      const res = await fetch(`${API_BASE}/api/session/init`, { method: 'POST' });
      if (res.ok) {
        isBridgeConnected = true;
        const data = await res.json();
        updateDraftBadge(data.branch, true);
      }
    } catch (e) {
      // Offline / GitHub Pages fallback
      updateDraftBadge('draft-session', true);
    }
  }

  function updateDraftBadge(branch, isDraft) {
    const badge = document.getElementById('cksl-draft-session-badge');
    if (badge) {
      if (isDraft) {
        badge.innerHTML = `🌿 Draft Session (${branch}) &mdash; Main is safe`;
        badge.style.background = 'rgba(16, 185, 129, 0.15)';
        badge.style.color = '#34D399';
        badge.style.borderColor = 'rgba(16, 185, 129, 0.35)';
      } else {
        badge.innerHTML = `Branch: ${branch}`;
      }
    }
  }

  async function mergeAndPublishDraft() {
    if (isBridgeConnected) {
      try {
        const res = await fetch(`${API_BASE}/api/session/publish`, { method: 'POST' });
        const data = await res.json();
        if (data.success) {
          alert('Success! All edits have been merged into the main git branch.');
          window.location.reload();
          return;
        }
      } catch (e) {}
    }
    // Fallback to GitHub API modal
    openModal('cksl-modal-publish-dialog');
  }

  async function discardDraftSession() {
    if (!confirm('Are you sure you want to discard this editing session?\n\nAll unmerged changes will be deleted and the main branch will remain untouched.')) {
      return;
    }

    if (isBridgeConnected) {
      try {
        const res = await fetch(`${API_BASE}/api/session/discard`, { method: 'POST' });
        const data = await res.json();
        if (data.success) {
          alert('Draft session discarded. Reverting to pristine main branch.');
          window.location.href = window.location.pathname;
          return;
        }
      } catch (e) {}
    }

    // Local fallback
    localStorage.removeItem('cksl_draft_content');
    window.location.href = window.location.pathname;
  }

  // 3. Word-Style Floating Selection Mini-Toolbar (Per-word/per-character formatting)
  function setupTextSelectionToolbar() {
    const toolbar = document.getElementById('cksl-text-selection-toolbar');
    if (!toolbar) return;

    // Track selection changes across the document
    document.addEventListener('selectionchange', handleSelectionChange);

    // Prevent button clicks from collapsing the text selection
    toolbar.querySelectorAll('button, select, input').forEach(ctrl => {
      ctrl.addEventListener('mousedown', (e) => {
        e.preventDefault();
      });
    });

    // Formatting action buttons
    toolbar.querySelectorAll('[data-cmd]').forEach(btn => {
      btn.addEventListener('click', () => {
        const cmd = btn.getAttribute('data-cmd');
        document.execCommand(cmd, false, null);
        updateSelectionToolbarState();
      });
    });

    // Font Size select
    const sizeSel = document.getElementById('cksl-sel-font-size');
    if (sizeSel) {
      sizeSel.addEventListener('change', () => {
        if (!sizeSel.value) return;
        applySelectionStyle('fontSize', sizeSel.value);
        sizeSel.value = '';
      });
    }

    // Color pickers
    const foreColorInput = document.getElementById('cksl-sel-color');
    if (foreColorInput) {
      foreColorInput.addEventListener('input', (e) => {
        document.execCommand('foreColor', false, e.target.value);
      });
    }

    const hiliteColorInput = document.getElementById('cksl-sel-bg-color');
    if (hiliteColorInput) {
      hiliteColorInput.addEventListener('input', (e) => {
        document.execCommand('hiliteColor', false, e.target.value);
      });
    }

    // Link insertion
    const linkBtn = document.getElementById('cksl-sel-btn-link');
    if (linkBtn) {
      linkBtn.addEventListener('click', () => {
        const url = prompt('Enter link URL (e.g. /about/ or https://example.com):', 'https://');
        if (url) document.execCommand('createLink', false, url);
      });
    }
  }

  function handleSelectionChange() {
    if (!isEditing) return;

    const toolbar = document.getElementById('cksl-text-selection-toolbar');
    if (!toolbar) return;

    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || sel.rangeCount === 0) {
      hideTextSelectionToolbar();
      return;
    }

    const text = sel.toString().trim();
    if (!text) {
      hideTextSelectionToolbar();
      return;
    }

    const range = sel.getRangeAt(0);
    const node = range.commonAncestorContainer;
    const editable = node.nodeType === 1 ? node.closest('[data-cksl-editable="true"]') : node.parentElement?.closest('[data-cksl-editable="true"]');

    if (!editable) {
      hideTextSelectionToolbar();
      return;
    }

    // Position floating toolbar right above the selected range
    const rect = range.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) {
      hideTextSelectionToolbar();
      return;
    }

    toolbar.classList.remove('hidden');
    const tbWidth = toolbar.offsetWidth || 340;
    const tbHeight = toolbar.offsetHeight || 38;

    let left = rect.left + (rect.width / 2) - (tbWidth / 2);
    let top = rect.top - tbHeight - 8;

    // Bounds checking
    if (left < 10) left = 10;
    if (left + tbWidth > window.innerWidth - 10) left = window.innerWidth - tbWidth - 10;
    if (top < 10) top = rect.bottom + 8; // flip below if offscreen top

    toolbar.style.left = `${left + window.scrollX}px`;
    toolbar.style.top = `${top + window.scrollY}px`;
  }

  function hideTextSelectionToolbar() {
    const toolbar = document.getElementById('cksl-text-selection-toolbar');
    if (toolbar) toolbar.classList.add('hidden');
  }

  function applySelectionStyle(styleProp, styleVal) {
    const sel = window.getSelection();
    if (!sel.rangeCount) return;
    const range = sel.getRangeAt(0);
    const span = document.createElement('span');
    span.style[styleProp] = styleVal;
    try {
      span.appendChild(range.extractContents());
      range.insertNode(span);
      sel.removeAllRanges();
      const newRange = document.createRange();
      newRange.selectNodeContents(span);
      sel.addRange(newRange);
    } catch (e) {}
  }

  function updateSelectionToolbarState() {
    const toolbar = document.getElementById('cksl-text-selection-toolbar');
    if (!toolbar) return;
    ['bold', 'italic', 'underline', 'strikeThrough'].forEach(cmd => {
      const btn = toolbar.querySelector(`[data-cmd="${cmd}"]`);
      if (btn) {
        document.queryCommandState(cmd) ? btn.classList.add('active') : btn.classList.remove('active');
      }
    });
  }

  // 4. Ribbon Setup
  function setupRibbon() {
    // Tab switching
    document.querySelectorAll('.cksl-ribbon-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const tabKey = tab.getAttribute('data-tab');
        document.querySelectorAll('.cksl-ribbon-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.cksl-shelf-pane').forEach(p => p.classList.remove('active'));

        tab.classList.add('active');
        const pane = document.getElementById(`pane-${tabKey}`);
        if (pane) pane.classList.add('active');

        if (isRibbonCollapsed) toggleRibbon();
      });
    });

    // Minimize / Expand
    const toggleRibbonBtn = document.getElementById('cksl-btn-toggle-ribbon');
    if (toggleRibbonBtn) toggleRibbonBtn.addEventListener('click', toggleRibbon);

    // Exit
    const exitBtn = document.getElementById('cksl-btn-exit-editor');
    if (exitBtn) exitBtn.addEventListener('click', disableEditor);

    // Page Selector
    const pageSel = document.getElementById('cksl-page-selector');
    if (pageSel) {
      pageSel.value = window.location.pathname;
      pageSel.addEventListener('change', () => {
        window.location.href = pageSel.value + '?edit=true';
      });
    }

    // Device View Buttons
    document.querySelectorAll('.cksl-device-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const dev = btn.getAttribute('data-device');
        setDeviceMode(dev);
        document.querySelectorAll('.cksl-device-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    // Color Swatches
    document.querySelectorAll('.cksl-swatch-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        const pal = pill.getAttribute('data-palette');
        applyPalette(pal);
        document.querySelectorAll('.cksl-swatch-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
      });
    });

    // Font Scale Buttons
    document.querySelectorAll('.cksl-font-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const sz = btn.getAttribute('data-size');
        applyFontSize(sz);
        document.querySelectorAll('.cksl-font-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    // Insert Standard Blocks
    document.querySelectorAll('[data-insert]').forEach(btn => {
      btn.addEventListener('click', () => {
        const type = btn.getAttribute('data-insert');
        insertStandardBlock(type);
      });
    });

    // Insert Body Image
    const insertImgBtn = document.getElementById('cksl-btn-insert-body-img');
    if (insertImgBtn) {
      insertImgBtn.addEventListener('click', () => {
        openModal('cksl-modal-landscapes');
      });
    }

    // Merge & Publish
    const pubBtn = document.getElementById('cksl-btn-publish-open');
    if (pubBtn) pubBtn.addEventListener('click', mergeAndPublishDraft);

    // Discard Draft
    const discardBtn = document.getElementById('cksl-btn-discard-draft');
    if (discardBtn) discardBtn.addEventListener('click', discardDraftSession);
  }

  function toggleRibbon() {
    isRibbonCollapsed = !isRibbonCollapsed;
    const ribbon = document.getElementById('cksl-ribbon');
    if (ribbon) ribbon.classList.toggle('collapsed', isRibbonCollapsed);
    updateLayoutVariables();
  }

  function setDeviceMode(mode) {
    currentDevice = mode;
    const viewport = document.getElementById('cksl-canvas-viewport');
    if (!viewport) return;
    viewport.className = `device-${mode}`;
  }

  // 5. Left Sidebar (Multi-Tab: Sections, Motifs, Pages)
  function setupSidebar() {
    const collapseBtn = document.getElementById('cksl-btn-collapse-sidebar');
    if (collapseBtn) collapseBtn.addEventListener('click', toggleSidebar);

    const toggleSidebarBtn = document.getElementById('cksl-btn-toggle-sidebar');
    if (toggleSidebarBtn) toggleSidebarBtn.addEventListener('click', toggleSidebar);

    // Sidebar Tabs
    document.querySelectorAll('.cksl-side-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const tabKey = tab.getAttribute('data-sidetab');
        document.querySelectorAll('.cksl-side-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.cksl-side-pane').forEach(p => p.classList.remove('active'));

        tab.classList.add('active');
        const pane = document.getElementById(`cksl-sidepane-${tabKey}`);
        if (pane) pane.classList.add('active');
      });
    });

    // Add Section button
    const addSecBtn = document.getElementById('cksl-sidebar-add-btn');
    if (addSecBtn) addSecBtn.addEventListener('click', () => insertStandardBlock('text'));

    // Left Sidebar Motifs list clicks
    document.querySelectorAll('.cksl-side-motif-card').forEach(card => {
      card.addEventListener('click', () => {
        const motif = card.getAttribute('data-motif');
        insertMotifWidget(motif);
      });
    });

    // Left Sidebar Pages actions
    const sideNewPage = document.getElementById('cksl-side-btn-new-page');
    if (sideNewPage) sideNewPage.addEventListener('click', () => openModal('cksl-modal-new-page'));

    const sideEditNav = document.getElementById('cksl-side-btn-edit-nav');
    if (sideEditNav) sideEditNav.addEventListener('click', openNavigationManager);

    const sideDelPage = document.getElementById('cksl-side-btn-delete-page');
    if (sideDelPage) sideDelPage.addEventListener('click', deleteCurrentPage);
  }

  function toggleSidebar() {
    isSidebarCollapsed = !isSidebarCollapsed;
    const sidebar = document.getElementById('cksl-sidebar');
    if (sidebar) sidebar.classList.toggle('collapsed', isSidebarCollapsed);
    updateLayoutVariables();
  }

  function buildSidebarOutline() {
    const list = document.getElementById('cksl-sidebar-sections-list');
    const countBadge = document.getElementById('cksl-sections-count');
    if (!list) return;
    list.innerHTML = '';

    const sections = document.querySelectorAll('#cksl-page-frame section, #cksl-page-frame .block-section, #cksl-page-frame .page-content-wrapper > *');
    let validCount = 0;

    sections.forEach((sec, idx) => {
      if (sec.id === 'cksl-ribbon' || sec.id === 'cksl-sidebar' || sec.id === 'cksl-floating-inspector' || sec.classList.contains('cksl-modal-overlay') || sec.tagName.toLowerCase() === 'header' || sec.tagName.toLowerCase() === 'footer') return;

      validCount++;
      const titleEl = sec.querySelector('h1, h2, h3, .section-title, .subsection-title');
      const title = titleEl ? titleEl.textContent.trim() : `Section Block ${validCount}`;

      const item = document.createElement('div');
      item.className = 'cksl-tree-item';
      item.innerHTML = `
        <span class="cksl-tree-item-title">${idx + 1}. ${title}</span>
        <div class="cksl-tree-item-actions">
          <button type="button" class="cksl-tree-action-btn" data-act="up" title="Move Up">▲</button>
          <button type="button" class="cksl-tree-action-btn" data-act="down" title="Move Down">▼</button>
          <button type="button" class="cksl-tree-action-btn" data-act="del" title="Delete" style="color: #EF4444;">✕</button>
        </div>
      `;

      item.addEventListener('click', (e) => {
        if (e.target.closest('.cksl-tree-action-btn')) return;
        document.querySelectorAll('.cksl-tree-item').forEach(it => it.classList.remove('selected'));
        item.classList.add('selected');
        sec.scrollIntoView({ behavior: 'smooth', block: 'center' });
        selectBox(sec);
      });

      item.querySelector('[data-act="up"]').addEventListener('click', (e) => {
        e.stopPropagation();
        const prev = sec.previousElementSibling;
        if (prev && prev.parentNode === sec.parentNode) {
          sec.parentNode.insertBefore(sec, prev);
          buildSidebarOutline();
        }
      });

      item.querySelector('[data-act="down"]').addEventListener('click', (e) => {
        e.stopPropagation();
        const next = sec.nextElementSibling;
        if (next && next.parentNode === sec.parentNode) {
          sec.parentNode.insertBefore(next, sec);
          buildSidebarOutline();
        }
      });

      item.querySelector('[data-act="del"]').addEventListener('click', (e) => {
        e.stopPropagation();
        if (confirm(`Delete "${title}"?`)) {
          sec.remove();
          buildSidebarOutline();
          hideInspector();
        }
      });

      list.appendChild(item);
    });

    if (countBadge) countBadge.textContent = `${validCount} sections`;
  }

  // 6. Figma / Canva Card & Box Controls (Selection, Resize Handles, Duplicate, Copy/Paste)
  function selectBox(box) {
    document.querySelectorAll('[data-cksl-box-selected]').forEach(el => el.removeAttribute('data-cksl-box-selected'));
    document.querySelectorAll('.cksl-resize-handle').forEach(h => h.remove());

    if (!box) {
      activeBox = null;
      return;
    }

    activeBox = box;
    box.setAttribute('data-cksl-box-selected', 'true');

    // Add Figma-style bottom-right resize handle
    const handle = document.createElement('div');
    handle.className = 'cksl-resize-handle cksl-handle-se';
    handle.title = 'Drag to resize box width & padding';
    box.appendChild(handle);

    setupResizeHandle(handle, box);
    renderInspectorForBox(box);
  }

  function setupResizeHandle(handle, box) {
    let isResizing = false;
    let startX, startW;

    handle.addEventListener('mousedown', (e) => {
      e.stopPropagation();
      e.preventDefault();
      isResizing = true;
      startX = e.clientX;
      startW = box.offsetWidth;

      const onMouseMove = (moveEv) => {
        if (!isResizing) return;
        const dx = moveEv.clientX - startX;
        const newW = Math.max(260, startW + dx);
        box.style.maxWidth = `${newW}px`;
        box.style.width = '100%';
        box.style.margin = '0 auto';
      };

      const onMouseUp = () => {
        isResizing = false;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    });
  }

  function setupBoxHotkeys() {
    document.addEventListener('keydown', (e) => {
      if (!isEditing) return;

      // Ignore if user is typing text inside contenteditable
      const activeEl = document.activeElement;
      const isTypingText = activeEl && activeEl.isContentEditable && window.getSelection()?.toString().length === 0;

      // Duplicate: Cmd+D / Ctrl+D
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'd' && activeBox) {
        e.preventDefault();
        duplicateBox(activeBox);
        return;
      }

      // Copy: Cmd+C
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'c' && !isTypingText && activeBox) {
        copiedBoxHtml = activeBox.outerHTML;
        return;
      }

      // Paste: Cmd+V
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'v' && !isTypingText && copiedBoxHtml && activeBox) {
        e.preventDefault();
        const temp = document.createElement('div');
        temp.innerHTML = copiedBoxHtml;
        const clone = temp.firstElementChild;
        activeBox.parentNode.insertBefore(clone, activeBox.nextSibling);
        makeContentEditable();
        selectBox(clone);
        buildSidebarOutline();
        return;
      }

      // Delete: Delete or Backspace when not typing
      if ((e.key === 'Delete' || e.key === 'Backspace') && !isTypingText && activeBox) {
        e.preventDefault();
        deleteBox(activeBox);
      }
    });
  }

  function duplicateBox(box) {
    if (!box) return;
    const clone = box.cloneNode(true);
    clone.removeAttribute('data-cksl-box-selected');
    clone.querySelectorAll('.cksl-resize-handle').forEach(h => h.remove());
    box.parentNode.insertBefore(clone, box.nextSibling);
    makeContentEditable();
    selectBox(clone);
    buildSidebarOutline();
  }

  function deleteBox(box) {
    if (!box) return;
    if (confirm('Delete this card / box?')) {
      box.remove();
      hideInspector();
      buildSidebarOutline();
      activeBox = null;
    }
  }

  // 7. Interactive Motifs (Draggable, Resizable, Colorable, Duplicable)
  function insertMotifWidget(motifKey) {
    const container = document.querySelector('.page-content-wrapper') || document.querySelector('.home-content-area') || document.querySelector('#cksl-page-frame main');
    if (!container) return;

    const svgContent = MOTIF_SVGS[motifKey] || MOTIF_SVGS.maehwa_blossom;

    const widget = document.createElement('div');
    widget.className = 'cksl-motif-widget block-section';
    widget.setAttribute('data-motif', motifKey);
    widget.setAttribute('tabindex', '0');
    widget.style.textAlign = 'center';
    widget.style.width = '100%';

    widget.innerHTML = `
      <div class="cksl-motif-toolbar">
        <button type="button" class="cksl-motif-btn" data-mact="up" title="Move Up">▲</button>
        <button type="button" class="cksl-motif-btn" data-mact="down" title="Move Down">▼</button>
        <button type="button" class="cksl-motif-btn" data-mact="scale-minus" title="Smaller">-</button>
        <button type="button" class="cksl-motif-btn" data-mact="scale-plus" title="Larger">+</button>
        <input type="color" class="cksl-motif-color" value="#A62B2B" title="Change Color">
        <button type="button" class="cksl-motif-btn" data-mact="align-left" title="Align Left">⇦</button>
        <button type="button" class="cksl-motif-btn" data-mact="align-center" title="Align Center">≡</button>
        <button type="button" class="cksl-motif-btn" data-mact="align-right" title="Align Right">⇨</button>
        <button type="button" class="cksl-motif-btn" data-mact="clone" title="Duplicate">⧉</button>
        <button type="button" class="cksl-motif-btn cksl-motif-del" data-mact="del" title="Delete">✕</button>
      </div>
      <div class="cksl-motif-body" style="display: inline-block;">
        ${svgContent}
      </div>
    `;

    bindMotifWidgetEvents(widget);
    container.appendChild(widget);
    buildSidebarOutline();
    widget.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function bindMotifWidgetEvents(widget) {
    // Toolbar actions
    widget.querySelectorAll('[data-mact]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const act = btn.getAttribute('data-mact');
        const svgEl = widget.querySelector('svg');

        if (act === 'up') {
          const prev = widget.previousElementSibling;
          if (prev) widget.parentNode.insertBefore(widget, prev);
          buildSidebarOutline();
        } else if (act === 'down') {
          const next = widget.nextElementSibling;
          if (next) widget.parentNode.insertBefore(next, widget);
          buildSidebarOutline();
        } else if (act === 'scale-plus' && svgEl) {
          const curW = parseInt(svgEl.style.width || svgEl.getAttribute('width') || 60);
          svgEl.style.width = `${Math.min(480, curW + 16)}px`;
        } else if (act === 'scale-minus' && svgEl) {
          const curW = parseInt(svgEl.style.width || svgEl.getAttribute('width') || 60);
          svgEl.style.width = `${Math.max(24, curW - 16)}px`;
        } else if (act === 'align-left') {
          widget.style.textAlign = 'left';
        } else if (act === 'align-center') {
          widget.style.textAlign = 'center';
        } else if (act === 'align-right') {
          widget.style.textAlign = 'right';
        } else if (act === 'clone') {
          const clone = widget.cloneNode(true);
          bindMotifWidgetEvents(clone);
          widget.parentNode.insertBefore(clone, widget.nextSibling);
          buildSidebarOutline();
        } else if (act === 'del') {
          if (confirm('Delete this Korean heritage motif?')) {
            widget.remove();
            buildSidebarOutline();
          }
        }
      });
    });

    // Color picker
    const colorInput = widget.querySelector('.cksl-motif-color');
    if (colorInput) {
      colorInput.addEventListener('input', (e) => {
        const hex = e.target.value;
        widget.querySelectorAll('svg path, svg circle, svg rect').forEach(shape => {
          if (shape.getAttribute('stroke') && shape.getAttribute('stroke') !== 'none') {
            shape.style.stroke = hex;
          }
          if (shape.getAttribute('fill') && shape.getAttribute('fill') !== 'none') {
            shape.style.fill = hex;
          }
        });
      });
    }

    widget.addEventListener('click', (e) => {
      if (e.target.closest('.cksl-motif-toolbar')) return;
      selectBox(widget);
    });
  }

  // 8. Header Image Changer & Landscape Gallery
  function setupHeroChanger() {
    // Top-right hero floating change buttons
    document.querySelectorAll('.cksl-hero-change-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        openModal('cksl-modal-landscapes');
      });
    });

    // Click on hero image directly in editor mode
    document.querySelectorAll('[data-cksl-image="hero"]').forEach(img => {
      img.addEventListener('click', () => {
        if (isEditing) openModal('cksl-modal-landscapes');
      });
    });
  }

  function applyLandscapeImage(src, crop) {
    if (activeElement && activeElement.tagName.toLowerCase() === 'img') {
      activeElement.src = src;
      activeElement.style.objectPosition = crop || 'center center';
      return;
    }

    // Apply to hero image
    const heroImg = document.querySelector('.home-hero-img') || document.querySelector('.hero-img');
    if (heroImg) {
      heroImg.src = src;
      heroImg.style.objectPosition = crop || 'center 35%';
      heroImg.scrollIntoView({ behavior: 'smooth', block: 'start' });

      // Save to theme settings via bridge if connected
      if (isBridgeConnected) {
        fetch(`${API_BASE}/api/theme/save`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ headerImage: src })
        }).catch(() => {});
      }
    }
  }

  // 9. Navigation Menu Manager Modal
  async function openNavigationManager() {
    const listContainer = document.getElementById('cksl-nav-items-list');
    if (!listContainer) return;

    listContainer.innerHTML = '';

    // Collect current navigation links from page navbar
    const navLinks = [];
    document.querySelectorAll('.navbar__links .navbar__link').forEach(a => {
      const title = a.textContent.trim();
      const href = a.getAttribute('href') || '/';
      const cleanUrl = href.replace(/^.*(?=\/[a-z0-9_-]+\/?$)/i, '');
      if (title) navLinks.push({ title, url: cleanUrl || href });
    });

    if (navLinks.length === 0) {
      navLinks.push(
        { title: 'About', url: '/about/' },
        { title: 'Research', url: '/research/' },
        { title: 'Publications', url: '/publications/' },
        { title: 'People', url: '/people/' },
        { title: 'Programs & Events', url: '/programs-events/' },
        { title: 'News', url: '/news/' },
        { title: 'Contact', url: '/contact/' }
      );
    }

    navLinks.forEach((item, index) => {
      appendNavItemRow(listContainer, item.title, item.url, index);
    });

    // Add new link button
    const addBtn = document.getElementById('cksl-btn-add-nav-item');
    if (addBtn) {
      addBtn.onclick = () => {
        appendNavItemRow(listContainer, 'New Link', '/new-page/', listContainer.children.length);
      };
    }

    // Save navigation button
    const saveBtn = document.getElementById('cksl-btn-save-nav-items');
    if (saveBtn) {
      saveBtn.onclick = async () => {
        const updatedItems = [];
        listContainer.querySelectorAll('.cksl-nav-item-row').forEach(row => {
          const t = row.querySelector('.cksl-nav-input-title').value.trim();
          const u = row.querySelector('.cksl-nav-input-url').value.trim();
          if (t && u) updatedItems.push({ title: t, url: u });
        });

        if (isBridgeConnected) {
          try {
            await fetch(`${API_BASE}/api/navigation/save`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ items: updatedItems })
            });
            alert('Navigation menu saved! Reloading page to update navbar.');
            window.location.reload();
            return;
          } catch (e) {}
        }

        closeModal('cksl-modal-nav-manager');
      };
    }

    openModal('cksl-modal-nav-manager');
  }

  function appendNavItemRow(container, title, url, idx) {
    const row = document.createElement('div');
    row.className = 'cksl-nav-item-row';
    row.innerHTML = `
      <input type="text" class="cksl-nav-input-title" value="${title}" placeholder="Link Title">
      <input type="text" class="cksl-nav-input-url" value="${url}" placeholder="URL Path">
      <button type="button" class="cksl-nav-btn" data-act="up" title="Move Up">▲</button>
      <button type="button" class="cksl-nav-btn" data-act="down" title="Move Down">▼</button>
      <button type="button" class="cksl-nav-btn cksl-nav-del" data-act="del" title="Delete Link">✕</button>
    `;

    row.querySelector('[data-act="up"]').onclick = () => {
      const prev = row.previousElementSibling;
      if (prev) row.parentNode.insertBefore(row, prev);
    };

    row.querySelector('[data-act="down"]').onclick = () => {
      const next = row.nextElementSibling;
      if (next) row.parentNode.insertBefore(next, row);
    };

    row.querySelector('[data-act="del"]').onclick = () => {
      row.remove();
    };

    container.appendChild(row);
  }

  // 10. New Page Creation & Deletion
  async function createNewPage() {
    const title = document.getElementById('cksl-new-page-title')?.value.trim();
    const slug = document.getElementById('cksl-new-page-slug')?.value.trim();
    const kicker = document.getElementById('cksl-new-page-kicker')?.value.trim();
    const addToNav = document.getElementById('cksl-new-page-add-nav')?.checked ?? true;

    if (!title || !slug) {
      alert('Please enter both a Page Title and a URL Path.');
      return;
    }

    if (isBridgeConnected) {
      try {
        const res = await fetch(`${API_BASE}/api/page/create`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, slug, kicker, addToNav })
        });
        const data = await res.json();
        if (data.success) {
          alert(`Success! Created page ${data.url} on the draft session branch.`);
          window.location.href = data.url + '?edit=true';
          return;
        }
      } catch (e) {}
    }

    alert('Bridge server not responding. Please ensure tools/editor-service.js is running.');
  }

  async function deleteCurrentPage() {
    const path = window.location.pathname;
    if (path === '/' || path === '/index.html') {
      alert('The Home page cannot be deleted.');
      return;
    }

    if (!confirm(`Are you sure you want to delete this page (${path}) from the draft session?`)) {
      return;
    }

    if (isBridgeConnected) {
      try {
        const res = await fetch(`${API_BASE}/api/page/delete`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: path })
        });
        const data = await res.json();
        if (data.success) {
          alert('Page deleted. Navigating back to Home.');
          window.location.href = '/?edit=true';
          return;
        }
      } catch (e) {}
    }
  }

  // 11. Modals Setup
  function setupModals() {
    // Open Landscapes Gallery
    const galleryBtn = document.getElementById('cksl-btn-open-gallery');
    if (galleryBtn) galleryBtn.addEventListener('click', () => openModal('cksl-modal-landscapes'));

    // Open Motifs Gallery
    const motifsBtn = document.getElementById('cksl-btn-open-motifs');
    if (motifsBtn) motifsBtn.addEventListener('click', () => openModal('cksl-modal-motifs-dialog'));

    // Open New Page Dialog
    const newPageBtn = document.getElementById('cksl-btn-new-page');
    if (newPageBtn) newPageBtn.addEventListener('click', () => openModal('cksl-modal-new-page'));

    const confirmNewPageBtn = document.getElementById('cksl-btn-confirm-create-page');
    if (confirmNewPageBtn) confirmNewPageBtn.addEventListener('click', createNewPage);

    // Open Navigation Manager Dialog
    const editNavBtn = document.getElementById('cksl-btn-edit-nav');
    if (editNavBtn) editNavBtn.addEventListener('click', openNavigationManager);

    // Delete Page button in ribbon
    const deletePageBtn = document.getElementById('cksl-btn-delete-page');
    if (deletePageBtn) deletePageBtn.addEventListener('click', deleteCurrentPage);

    // Close buttons & backdrop
    document.querySelectorAll('.cksl-modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal(overlay.id);
      });
      const close = overlay.querySelector('.cksl-modal-close');
      if (close) close.addEventListener('click', () => closeModal(overlay.id));
    });

    // Landscape selection click
    document.querySelectorAll('.cksl-landscape-card').forEach(card => {
      card.addEventListener('click', () => {
        const src = card.getAttribute('data-src');
        const crop = card.getAttribute('data-crop') || 'center 35%';
        applyLandscapeImage(src, crop);
        closeModal('cksl-modal-landscapes');
      });
    });

    // Custom Image URL apply
    const applyCustomImgBtn = document.getElementById('cksl-btn-apply-custom-img');
    if (applyCustomImgBtn) {
      applyCustomImgBtn.addEventListener('click', () => {
        const urlInput = document.getElementById('cksl-custom-img-url');
        if (urlInput && urlInput.value.trim()) {
          applyLandscapeImage(urlInput.value.trim(), 'center center');
          closeModal('cksl-modal-landscapes');
        }
      });
    }

    // Modal Motif selection click
    document.querySelectorAll('.cksl-motif-option-card').forEach(card => {
      card.addEventListener('click', () => {
        const motif = card.getAttribute('data-motif');
        insertMotifWidget(motif);
        closeModal('cksl-modal-motifs-dialog');
      });
    });
  }

  function openModal(id) {
    closeAllModals();
    const m = document.getElementById(id);
    if (m) m.classList.add('open');
  }

  function closeModal(id) {
    const m = document.getElementById(id);
    if (m) m.classList.remove('open');
  }

  function closeAllModals() {
    document.querySelectorAll('.cksl-modal-overlay').forEach(m => m.classList.remove('open'));
  }

  // 12. Floating Context Inspector (Figma-Style Box Controls)
  function setupInspector() {
    const handle = document.getElementById('cksl-inspector-handle');
    const inspector = document.getElementById('cksl-floating-inspector');
    if (!handle || !inspector) return;

    let isDragging = false;
    let startX, startY, initLeft, initTop;

    handle.addEventListener('mousedown', (e) => {
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      const rect = inspector.getBoundingClientRect();
      initLeft = rect.left;
      initTop = rect.top;
      e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      inspector.style.left = `${Math.max(10, initLeft + dx)}px`;
      inspector.style.top = `${Math.max(60, initTop + dy)}px`;
    });

    document.addEventListener('mouseup', () => { isDragging = false; });
  }

  function renderInspectorForBox(box) {
    const inspector = document.getElementById('cksl-floating-inspector');
    const typeBadge = document.getElementById('cksl-inspector-type');
    const container = document.getElementById('cksl-inspector-controls');
    if (!inspector || !container) return;

    container.innerHTML = '';
    inspector.classList.remove('hidden');

    typeBadge.textContent = 'Box / Card';
    container.innerHTML = `
      <span class="inspector-label">Padding:</span>
      <div class="inspector-btn-group">
        <button type="button" class="inspector-btn" data-bact="pad-plus" title="More Padding">+</button>
        <button type="button" class="inspector-btn" data-bact="pad-minus" title="Less Padding">-</button>
      </div>
      <div class="inspector-btn-group">
        <button type="button" class="inspector-btn" data-bact="bg-white" title="White">White</button>
        <button type="button" class="inspector-btn" data-bact="bg-warm" title="Warm Stone">Warm</button>
        <button type="button" class="inspector-btn" data-bact="bg-dark" title="Dark Ink">Dark</button>
      </div>
      <div class="inspector-btn-group">
        <button type="button" class="inspector-btn" data-bact="round-sm" title="Subtle Radius">▢</button>
        <button type="button" class="inspector-btn" data-bact="round-md" title="Card Radius">▢</button>
      </div>
      <div class="inspector-btn-group">
        <button type="button" class="inspector-btn" data-bact="up" title="Move Up">▲</button>
        <button type="button" class="inspector-btn" data-bact="down" title="Move Down">▼</button>
        <button type="button" class="inspector-btn" data-bact="clone" title="Duplicate (Cmd+D)">⧉</button>
        <button type="button" class="inspector-btn" data-bact="del" title="Delete Box" style="color: #EF4444;">✕</button>
      </div>
    `;

    container.querySelectorAll('[data-bact]').forEach(btn => {
      btn.addEventListener('click', () => {
        const act = btn.getAttribute('data-bact');
        if (act === 'pad-plus') {
          const cur = parseInt(window.getComputedStyle(box).paddingTop) || 24;
          box.style.padding = `${cur + 8}px`;
        } else if (act === 'pad-minus') {
          const cur = parseInt(window.getComputedStyle(box).paddingTop) || 24;
          box.style.padding = `${Math.max(8, cur - 8)}px`;
        } else if (act === 'bg-white') {
          box.style.background = '#FFFFFF';
        } else if (act === 'bg-warm') {
          box.style.background = '#F4EFEA';
        } else if (act === 'bg-dark') {
          box.style.background = '#141517';
          box.style.color = '#FAF8F5';
        } else if (act === 'round-sm') {
          box.style.borderRadius = '6px';
        } else if (act === 'round-md') {
          box.style.borderRadius = '16px';
        } else if (act === 'up') {
          const prev = box.previousElementSibling;
          if (prev) box.parentNode.insertBefore(box, prev);
          buildSidebarOutline();
        } else if (act === 'down') {
          const next = box.nextElementSibling;
          if (next) box.parentNode.insertBefore(next, box);
          buildSidebarOutline();
        } else if (act === 'clone') {
          duplicateBox(box);
        } else if (act === 'del') {
          deleteBox(box);
        }
      });
    });

    positionInspector(box);
  }

  function positionInspector(el) {
    const inspector = document.getElementById('cksl-floating-inspector');
    if (!inspector || !el) return;

    const rect = el.getBoundingClientRect();
    let left = rect.left + 16;
    let top = rect.top - 54;

    if (top < 100) top = rect.bottom + 12;
    if (left + 380 > window.innerWidth) left = window.innerWidth - 390;

    inspector.style.left = `${Math.max(16, left)}px`;
    inspector.style.top = `${Math.max(80, top)}px`;
  }

  function hideInspector() {
    const inspector = document.getElementById('cksl-floating-inspector');
    if (inspector) inspector.classList.add('hidden');
  }

  // 13. ContentEditable & Page Clicks
  function makeContentEditable() {
    const frame = document.getElementById('cksl-page-frame');
    if (!frame) return;

    frame.addEventListener('click', handlePageClick, true);

    const editableSelectors = [
      'h1', 'h2', 'h3', 'h4', 'p', 'li', 'span.section-kicker', 'span.kicker-hangul',
      'span.project-badge', 'span.project-dates', 'span.pathway-tag',
      'a.btn', 'a.btn-primary', 'a.btn-secondary', 'figcaption'
    ];

    editableSelectors.forEach(sel => {
      frame.querySelectorAll(sel).forEach(el => {
        if (!el.closest('#cksl-ribbon') && !el.closest('#cksl-sidebar') && !el.closest('#cksl-floating-inspector') && !el.closest('.cksl-modal-overlay')) {
          el.setAttribute('contenteditable', 'true');
          el.setAttribute('data-cksl-editable', 'true');
          el.setAttribute('spellcheck', 'false');
        }
      });
    });

    // Bind motif widgets currently in DOM
    frame.querySelectorAll('.cksl-motif-widget').forEach(widget => {
      bindMotifWidgetEvents(widget);
    });
  }

  function removeContentEditable() {
    document.querySelectorAll('[data-cksl-editable]').forEach(el => {
      el.removeAttribute('contenteditable');
      el.removeAttribute('data-cksl-editable');
    });
  }

  function handlePageClick(e) {
    if (!isEditing) return;

    // Ignore clicks inside editor tools
    if (e.target.closest('#cksl-ribbon') || e.target.closest('#cksl-sidebar') || e.target.closest('#cksl-floating-inspector') || e.target.closest('#cksl-text-selection-toolbar') || e.target.closest('.cksl-modal-overlay')) {
      return;
    }

    const box = e.target.closest('.project-card, .mission-card, .overview-lead-box, .callout-box, .cta-banner-box, .block-section, .cksl-motif-widget, figure');
    if (box) {
      selectBox(box);
    }
  }

  // 14. Standard Block Inserter
  function insertStandardBlock(type) {
    const container = document.querySelector('.page-content-wrapper') || document.querySelector('.home-content-area') || document.querySelector('#cksl-page-frame main');
    if (!container) return;

    let html = '';

    if (type === 'text') {
      html = `
        <div class="block-section" style="margin: 32px 0;">
          <div class="container">
            <div class="overview-lead-box" style="padding: 28px; background: #FFFFFF; border: 1.5px solid var(--color-border, #E2DDD6); border-radius: 8px;">
              <span class="section-kicker" style="display: block; font-size: 0.8rem; font-weight: 700; color: var(--color-yellow-gold, #E5B842); text-transform: uppercase; margin-bottom: 6px;">New Section Header</span>
              <h2 style="font-family: 'Noto Serif KR', serif; font-size: 1.8rem; color: var(--color-red, #A62B2B); margin: 0 0 12px;">Headline Title Here</h2>
              <p style="font-size: 1.05rem; line-height: 1.7; color: var(--color-ink-muted, #474D54);">Click here to edit this paragraph text. Highlight any word to change font size, bold, italics, or text colors.</p>
            </div>
          </div>
        </div>
      `;
    } else if (type === 'cards') {
      html = `
        <div class="block-section" style="margin: 36px 0;">
          <div class="container">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px;">
              <div class="project-card" style="background: #FFFFFF; border: 1.5px solid var(--color-border, #E2DDD6); border-radius: 8px; padding: 24px;">
                <span class="project-badge" style="color: var(--color-yellow-gold, #E5B842); font-weight: 700; font-size: 0.75rem;">THEME 01</span>
                <h3 style="margin: 10px 0 8px; font-family: 'Noto Serif KR', serif; font-size: 1.25rem;">Card Title One</h3>
                <p style="font-size: 0.95rem; color: var(--color-ink-muted, #474D54); line-height: 1.6;">Description of this academic theme or project initiative.</p>
              </div>
              <div class="project-card" style="background: #FFFFFF; border: 1.5px solid var(--color-border, #E2DDD6); border-radius: 8px; padding: 24px;">
                <span class="project-badge" style="color: var(--color-yellow-gold, #E5B842); font-weight: 700; font-size: 0.75rem;">THEME 02</span>
                <h3 style="margin: 10px 0 8px; font-family: 'Noto Serif KR', serif; font-size: 1.25rem;">Card Title Two</h3>
                <p style="font-size: 0.95rem; color: var(--color-ink-muted, #474D54); line-height: 1.6;">Description of this academic theme or project initiative.</p>
              </div>
              <div class="project-card" style="background: #FFFFFF; border: 1.5px solid var(--color-border, #E2DDD6); border-radius: 8px; padding: 24px;">
                <span class="project-badge" style="color: var(--color-yellow-gold, #E5B842); font-weight: 700; font-size: 0.75rem;">THEME 03</span>
                <h3 style="margin: 10px 0 8px; font-family: 'Noto Serif KR', serif; font-size: 1.25rem;">Card Title Three</h3>
                <p style="font-size: 0.95rem; color: var(--color-ink-muted, #474D54); line-height: 1.6;">Description of this academic theme or project initiative.</p>
              </div>
            </div>
          </div>
        </div>
      `;
    } else if (type === 'callout') {
      html = `
        <div class="block-section" style="margin: 32px 0;">
          <div class="container">
            <div class="callout-box" style="padding: 24px; background: rgba(166, 43, 43, 0.04); border-left: 4px solid var(--color-red, #A62B2B); border-radius: 0 8px 8px 0;">
              <h4 style="font-family: 'Noto Serif KR', serif; margin: 0 0 8px; color: var(--color-red, #A62B2B);">Important Academic Note</h4>
              <p style="margin: 0; font-size: 1rem; color: var(--color-ink-muted, #474D54); line-height: 1.65;">Use this callout box to highlight critical announcements, grant deadlines, or symposium schedules.</p>
            </div>
          </div>
        </div>
      `;
    } else if (type === 'cta') {
      html = `
        <div class="block-section" style="margin: 36px 0;">
          <div class="container">
            <div class="cta-banner-box" style="padding: 36px; background: #141517; color: #FAF8F5; border-radius: 8px; text-align: center;">
              <h3 style="font-family: 'Noto Serif KR', serif; font-size: 1.8rem; color: #FFFFFF; margin: 0 0 12px;">Join the Research Community</h3>
              <p style="font-size: 1.05rem; color: #CBD5E1; max-width: 600px; margin: 0 auto 20px;">Collaborate with scholars across Asia and the globe on contemporary Korean studies.</p>
              <a href="/contact/" class="btn btn-primary" style="background: var(--color-red, #A62B2B); color: #FFF; padding: 10px 24px; border-radius: 6px; text-decoration: none; font-weight: 600;">Contact Lab Directorate &rarr;</a>
            </div>
          </div>
        </div>
      `;
    } else if (type === 'divider') {
      insertMotifWidget('flower_divider');
      return;
    }

    const temp = document.createElement('div');
    temp.innerHTML = html.trim();
    const newEl = temp.firstElementChild;
    container.appendChild(newEl);

    makeContentEditable();
    buildSidebarOutline();
    newEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    selectBox(newEl);
  }

  // 15. Palettes & Fonts
  function applyPalette(key, save = true) {
    const p = PALETTES[key];
    if (!p) return;
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
    if (save) localStorage.setItem('cksl_palette', key);
  }

  function applyFontSize(size, save = true) {
    document.documentElement.style.fontSize = size;
    if (save) localStorage.setItem('cksl_font_size', size);
  }

  // Auto-init on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
