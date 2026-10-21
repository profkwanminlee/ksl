/* ==============================================================================
   Contemporary Korean Studies Lab (CKSL) — Studio Site Editor Engine
   Word-meets-WordPress visual in-browser editor with floating inspector,
   responsive device simulation, and authentic Korean landscape gallery.
   ============================================================================== */

(function () {
  'use strict';

  // State
  let isEditing = false;
  let isRibbonCollapsed = false;
  let isSidebarCollapsed = false;
  let currentDevice = 'desktop';
  let activeElement = null;
  let activeBlock = null;

  // Curated Palettes
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

  // Init
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
    setupInspector();
    setupModals();
  }

  // Enable Editor
  function enableEditor() {
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
  }

  // Disable Editor
  function disableEditor() {
    isEditing = false;
    document.body.classList.remove('cksl-editor-active');

    const ribbon = document.getElementById('cksl-ribbon');
    if (ribbon) ribbon.classList.add('hidden');

    const sidebar = document.getElementById('cksl-sidebar');
    if (sidebar) sidebar.classList.add('hidden');

    const inspector = document.getElementById('cksl-floating-inspector');
    if (inspector) inspector.classList.add('hidden');

    const launcher = document.getElementById('cksl-editor-launcher');
    if (launcher) launcher.style.display = 'inline-flex';

    removeContentEditable();
    closeAllModals();
    localStorage.setItem('cksl_editor_active', 'false');
  }

  // Update CSS Variables for Canvas Resizing
  function updateLayoutVariables() {
    const root = document.documentElement;
    const ribbonH = isRibbonCollapsed ? '42px' : '94px';
    const sidebarW = isSidebarCollapsed ? '0px' : '260px';
    root.style.setProperty('--cksl-ribbon-height', ribbonH);
    root.style.setProperty('--cksl-sidebar-width', sidebarW);
  }

  // Ribbon Tab Switching & Controls
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

        // If collapsed, expand when a tab is clicked
        if (isRibbonCollapsed) toggleRibbon();
      });
    });

    // Minimize / Expand Ribbon
    const toggleRibbonBtn = document.getElementById('cksl-btn-toggle-ribbon');
    if (toggleRibbonBtn) {
      toggleRibbonBtn.addEventListener('click', toggleRibbon);
    }

    // Exit Button
    const exitBtn = document.getElementById('cksl-btn-exit-editor');
    if (exitBtn) exitBtn.addEventListener('click', disableEditor);

    // Page Selector
    const pageSel = document.getElementById('cksl-page-selector');
    if (pageSel) {
      // Set current path
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

    // Insert Elements buttons
    document.querySelectorAll('[data-insert]').forEach(btn => {
      btn.addEventListener('click', () => {
        const type = btn.getAttribute('data-insert');
        insertStandardBlock(type);
      });
    });
  }

  function toggleRibbon() {
    isRibbonCollapsed = !isRibbonCollapsed;
    const ribbon = document.getElementById('cksl-ribbon');
    if (ribbon) ribbon.classList.toggle('collapsed', isRibbonCollapsed);
    updateLayoutVariables();
  }

  // Device Framing
  function setDeviceMode(mode) {
    currentDevice = mode;
    const viewport = document.getElementById('cksl-canvas-viewport');
    if (!viewport) return;
    viewport.className = `device-${mode}`;
  }

  // Sidebar Outline
  function setupSidebar() {
    const collapseBtn = document.getElementById('cksl-btn-collapse-sidebar');
    if (collapseBtn) {
      collapseBtn.addEventListener('click', toggleSidebar);
    }
    const toggleSidebarBtn = document.getElementById('cksl-btn-toggle-sidebar');
    if (toggleSidebarBtn) {
      toggleSidebarBtn.addEventListener('click', toggleSidebar);
    }
    const addSectionBtn = document.getElementById('cksl-sidebar-add-btn');
    if (addSectionBtn) {
      addSectionBtn.addEventListener('click', () => insertStandardBlock('text'));
    }
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
      if (sec.id === 'cksl-ribbon' || sec.id === 'cksl-sidebar' || sec.id === 'cksl-floating-inspector' || sec.classList.contains('cksl-modal-overlay')) return;

      validCount++;
      const titleEl = sec.querySelector('h1, h2, h3, .section-title, .subsection-title');
      const title = titleEl ? titleEl.textContent.trim() : `Section ${validCount}`;

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
        selectElement(sec);
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

  // Make Content Editable & Bind Selection
  function makeContentEditable() {
    const frame = document.getElementById('cksl-page-frame');
    if (!frame) return;

    frame.addEventListener('click', handlePageClick, true);

    const editableSelectors = [
      'h1', 'h2', 'h3', 'h4', 'p', 'li', 'span.section-kicker', 'span.kicker-hangul',
      'span.project-badge', 'span.project-dates', 'span.pathway-tag',
      'a.btn', 'a.btn-primary', 'a.btn-secondary', 'a.theme-detail-link', 'a.pathway-link',
      '.overview-lead-text', '.body-para', '.project-desc', '.theme-description'
    ];

    editableSelectors.forEach(sel => {
      frame.querySelectorAll(sel).forEach(el => {
        if (!el.closest('#cksl-ribbon') && !el.closest('#cksl-sidebar') && !el.closest('#cksl-floating-inspector')) {
          el.setAttribute('contenteditable', 'true');
          el.setAttribute('data-cksl-editable', 'true');
          el.setAttribute('spellcheck', 'false');
        }
      });
    });
  }

  function removeContentEditable() {
    document.querySelectorAll('[data-cksl-editable]').forEach(el => {
      el.removeAttribute('contenteditable');
      el.removeAttribute('data-cksl-editable');
    });
  }

  // Selection Handler
  function handlePageClick(e) {
    if (!isEditing) return;

    // Ignore clicks inside editor UI
    if (e.target.closest('#cksl-ribbon') || e.target.closest('#cksl-sidebar') || e.target.closest('#cksl-floating-inspector') || e.target.closest('.cksl-modal-overlay')) {
      return;
    }

    const target = e.target;
    selectElement(target);
  }

  function selectElement(el) {
    document.querySelectorAll('[data-cksl-selected]').forEach(s => s.removeAttribute('data-cksl-selected'));

    activeElement = el;
    activeBlock = el.closest('section, .project-card, .mission-card, .overview-lead-box, .callout-box, .cta-banner-box, .block-section');
    el.setAttribute('data-cksl-selected', 'true');

    renderInspector(el);
    positionInspector(el);
  }

  // Floating Context Inspector (Word-like)
  function setupInspector() {
    // Draggable inspector handle
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

  function renderInspector(el) {
    const inspector = document.getElementById('cksl-floating-inspector');
    const typeBadge = document.getElementById('cksl-inspector-type');
    const container = document.getElementById('cksl-inspector-controls');
    if (!inspector || !container) return;

    container.innerHTML = '';
    inspector.classList.remove('hidden');

    const tagName = el.tagName.toLowerCase();
    const isButton = el.classList.contains('btn') || tagName === 'a';
    const isImage = tagName === 'img' || el.hasAttribute('data-cksl-image');
    const isCard = el.classList.contains('project-card') || el.classList.contains('mission-card') || el.classList.contains('pathway-card');
    const isText = ['h1', 'h2', 'h3', 'h4', 'p', 'span', 'li', 'blockquote'].includes(tagName);

    if (isButton) {
      typeBadge.textContent = 'Button';
      container.innerHTML = `
        <div class="inspector-btn-group">
          <button type="button" class="inspector-btn" data-act="btn-pad-plus" title="Add Padding">Pad +</button>
          <button type="button" class="inspector-btn" data-act="btn-pad-minus" title="Reduce Padding">Pad -</button>
        </div>
        <div class="inspector-btn-group">
          <button type="button" class="inspector-btn" data-act="btn-red" style="color: #A62B2B;">Red</button>
          <button type="button" class="inspector-btn" data-act="btn-gold" style="color: #E5B842;">Gold</button>
          <button type="button" class="inspector-btn" data-act="btn-dark" style="color: #474D54;">Dark</button>
        </div>
        <div class="inspector-btn-group">
          <button type="button" class="inspector-btn" data-act="btn-pill">Pill</button>
          <button type="button" class="inspector-btn" data-act="btn-round">Rounded</button>
        </div>
        <button type="button" class="inspector-btn" data-act="btn-link" title="Change Link URL">Link</button>
      `;
    } else if (isImage) {
      typeBadge.textContent = 'Image';
      container.innerHTML = `
        <button type="button" class="inspector-btn" id="cksl-btn-change-img" style="font-weight: 700; color: var(--color-yellow-gold);">
          Change Landscape Photo &rarr;
        </button>
        <div class="inspector-btn-group">
          <button type="button" class="inspector-btn" data-act="img-crop-top">Top</button>
          <button type="button" class="inspector-btn" data-act="img-crop-center">Center</button>
          <button type="button" class="inspector-btn" data-act="img-crop-bottom">Bottom</button>
        </div>
      `;
      const changeBtn = container.querySelector('#cksl-btn-change-img');
      if (changeBtn) changeBtn.addEventListener('click', () => openModal('cksl-modal-landscapes'));
    } else if (isCard) {
      typeBadge.textContent = 'Card Box';
      container.innerHTML = `
        <span class="inspector-label">Padding:</span>
        <div class="inspector-btn-group">
          <button type="button" class="inspector-btn" data-act="box-pad-plus">+</button>
          <button type="button" class="inspector-btn" data-act="box-pad-minus">-</button>
        </div>
        <div class="inspector-btn-group">
          <button type="button" class="inspector-btn" data-act="box-white">White</button>
          <button type="button" class="inspector-btn" data-act="box-warm">Warm</button>
          <button type="button" class="inspector-btn" data-act="box-border">Border</button>
        </div>
        <div class="inspector-btn-group">
          <button type="button" class="inspector-btn" data-act="box-move-up">▲</button>
          <button type="button" class="inspector-btn" data-act="box-move-down">▼</button>
          <button type="button" class="inspector-btn" data-act="box-delete" style="color: #EF4444;">✕</button>
        </div>
      `;
    } else if (isText) {
      typeBadge.textContent = tagName.toUpperCase();
      container.innerHTML = `
        <span class="inspector-label">Size:</span>
        <div class="inspector-btn-group">
          <button type="button" class="inspector-btn" data-act="size-minus">-</button>
          <button type="button" class="inspector-btn" data-act="size-plus">+</button>
        </div>
        <div class="inspector-btn-group">
          <button type="button" class="inspector-btn" data-act="bold"><strong>B</strong></button>
          <button type="button" class="inspector-btn" data-act="italic"><em>I</em></button>
        </div>
        <div class="inspector-btn-group">
          <button type="button" class="inspector-btn" data-act="align-left">⇤</button>
          <button type="button" class="inspector-btn" data-act="align-center">≡</button>
          <button type="button" class="inspector-btn" data-act="align-right">⇥</button>
        </div>
        <input type="color" class="inspector-color-input" id="cksl-text-color-picker" title="Text Color" value="#141517">
        <div class="inspector-btn-group">
          <button type="button" class="inspector-btn" data-act="pad-plus" title="Add Vertical Spacing">Space +</button>
          <button type="button" class="inspector-btn" data-act="pad-minus" title="Reduce Vertical Spacing">Space -</button>
        </div>
      `;

      const colorPicker = container.querySelector('#cksl-text-color-picker');
      if (colorPicker) {
        colorPicker.addEventListener('input', (e) => {
          el.style.color = e.target.value;
        });
      }
    }

    // Attach actions
    attachInspectorActions(el, container);
  }

  function attachInspectorActions(el, container) {
    container.querySelectorAll('[data-act]').forEach(btn => {
      btn.addEventListener('click', () => {
        const act = btn.getAttribute('data-act');
        const comp = window.getComputedStyle(el);

        // Text Sizing
        if (act === 'size-plus') {
          const cur = parseFloat(comp.fontSize);
          el.style.fontSize = `${cur + 2}px`;
        } else if (act === 'size-minus') {
          const cur = parseFloat(comp.fontSize);
          el.style.fontSize = `${Math.max(11, cur - 2)}px`;
        }
        // Bold & Italic
        else if (act === 'bold') {
          el.style.fontWeight = comp.fontWeight > 500 ? '400' : '700';
        } else if (act === 'italic') {
          el.style.fontStyle = comp.fontStyle === 'italic' ? 'normal' : 'italic';
        }
        // Text Alignment
        else if (act === 'align-left') el.style.textAlign = 'left';
        else if (act === 'align-center') el.style.textAlign = 'center';
        else if (act === 'align-right') el.style.textAlign = 'right';
        // Margins / Spacing
        else if (act === 'pad-plus') {
          const cur = parseFloat(comp.marginTop);
          el.style.marginTop = `${cur + 6}px`;
          el.style.marginBottom = `${cur + 6}px`;
        } else if (act === 'pad-minus') {
          const cur = parseFloat(comp.marginTop);
          el.style.marginTop = `${Math.max(0, cur - 6)}px`;
          el.style.marginBottom = `${Math.max(0, cur - 6)}px`;
        }
        // Button Actions
        else if (act === 'btn-pad-plus') {
          el.style.padding = '12px 28px';
        } else if (act === 'btn-pad-minus') {
          el.style.padding = '6px 14px';
        } else if (act === 'btn-red') {
          el.style.background = 'var(--color-red, #A62B2B)';
          el.style.color = '#FFFFFF';
        } else if (act === 'btn-gold') {
          el.style.background = 'var(--color-yellow-gold, #E5B842)';
          el.style.color = '#141517';
        } else if (act === 'btn-dark') {
          el.style.background = '#141517';
          el.style.color = '#FFFFFF';
        } else if (act === 'btn-pill') {
          el.style.borderRadius = '24px';
        } else if (act === 'btn-round') {
          el.style.borderRadius = '6px';
        } else if (act === 'btn-link') {
          const currentHref = el.getAttribute('href') || '';
          const newHref = prompt('Enter Destination URL / Path:', currentHref);
          if (newHref !== null) el.setAttribute('href', newHref);
        }
        // Card Box Actions
        else if (act === 'box-pad-plus') {
          el.style.padding = '36px 32px';
        } else if (act === 'box-pad-minus') {
          el.style.padding = '16px 18px';
        } else if (act === 'box-white') {
          el.style.background = '#FFFFFF';
        } else if (act === 'box-warm') {
          el.style.background = 'var(--color-surface-warm, #F4EFEA)';
        } else if (act === 'box-border') {
          el.style.border = '2px solid var(--color-red, #A62B2B)';
        } else if (act === 'box-move-up') {
          const prev = el.previousElementSibling;
          if (prev) el.parentNode.insertBefore(el, prev);
        } else if (act === 'box-move-down') {
          const next = el.nextElementSibling;
          if (next) el.parentNode.insertBefore(next, el);
        } else if (act === 'box-delete') {
          if (confirm('Delete this card?')) {
            el.remove();
            hideInspector();
          }
        }
        // Image Crop Actions
        else if (act === 'img-crop-top') el.style.objectPosition = 'center top';
        else if (act === 'img-crop-center') el.style.objectPosition = 'center center';
        else if (act === 'img-crop-bottom') el.style.objectPosition = 'center bottom';
      });
    });
  }

  function positionInspector(el) {
    const inspector = document.getElementById('cksl-floating-inspector');
    if (!inspector) return;

    const rect = el.getBoundingClientRect();
    const inspectorHeight = 54;
    let top = rect.top - inspectorHeight - 8;
    let left = rect.left;

    // Boundary checks
    if (top < 100) top = rect.bottom + 8;
    if (left < 270) left = 270;
    if (left + 360 > window.innerWidth) left = window.innerWidth - 380;

    inspector.style.top = `${top}px`;
    inspector.style.left = `${left}px`;
  }

  function hideInspector() {
    const inspector = document.getElementById('cksl-floating-inspector');
    if (inspector) inspector.classList.add('hidden');
    if (activeElement) activeElement.removeAttribute('data-cksl-selected');
    activeElement = null;
  }

  // Insert Standard Blocks strictly inside container grid
  function insertStandardBlock(type) {
    const container = document.querySelector('.page-content-wrapper') || document.querySelector('.home-content-area') || document.querySelector('#cksl-page-frame main');
    if (!container) return;

    let html = '';
    if (type === 'text') {
      html = `
        <div class="block-section block-text" style="margin: 36px 0;">
          <div class="container">
            <div class="kicker-group">
              <span class="section-kicker" contenteditable="true" data-cksl-editable="true">Academic Initiative</span>
              <span class="kicker-hangul" contenteditable="true" data-cksl-editable="true">연구 영역</span>
            </div>
            <h2 class="section-title" contenteditable="true" data-cksl-editable="true" style="margin-top: 6px;">New Section Heading</h2>
            <div class="korean-motif-wrap korean-motif-underline" style="display: flex; align-items: center; gap: 10px; margin: 10px 0 16px;">
              <span style="width: 38px; height: 2.5px; background: linear-gradient(90deg, var(--color-red, #A62B2B), var(--color-yellow-gold, #E5B842)); border-radius: 2px;"></span>
              <span style="width: 18px; height: 1.5px; background: var(--color-yellow-gold, #E5B842); border-radius: 1px;"></span>
            </div>
            <p class="overview-lead-text" contenteditable="true" data-cksl-editable="true" style="margin-top: 18px;">Click here to edit this lead highlight paragraph for the section.</p>
            <div class="markdown-body">
              <p contenteditable="true" data-cksl-editable="true">Click here to write detailed scholarly text, paragraphs, or bullet points.</p>
            </div>
          </div>
        </div>
      `;
    } else if (type === 'cards') {
      html = `
        <div class="block-section block-card-grid" style="margin: 36px 0;">
          <div class="container">
            <div class="kicker-group">
              <span class="section-kicker" contenteditable="true" data-cksl-editable="true">Initiatives</span>
              <span class="kicker-hangul" contenteditable="true" data-cksl-editable="true">사업 분야</span>
            </div>
            <h2 class="section-title" contenteditable="true" data-cksl-editable="true">Research &amp; Grant Initiatives</h2>
            <div class="projects-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; margin-top: 24px;">
              <div class="project-card" data-cksl-box="card" style="background: var(--color-surface, #FFFFFF); border: 1px solid var(--color-border, #E2DDD6); border-radius: 8px; padding: 24px;">
                <span class="project-badge" contenteditable="true" data-cksl-editable="true" style="font-size: 0.76rem; color: var(--color-red, #A62B2B); font-weight: 700;">Active Grant</span>
                <h3 class="project-title" contenteditable="true" data-cksl-editable="true" style="font-size: 1.15rem; margin: 10px 0;">New Project Initiative 1</h3>
                <p class="project-desc" contenteditable="true" data-cksl-editable="true" style="font-size: 0.92rem; color: var(--color-ink-muted, #474D54);">Click to edit project description.</p>
              </div>
              <div class="project-card" data-cksl-box="card" style="background: var(--color-surface, #FFFFFF); border: 1px solid var(--color-border, #E2DDD6); border-radius: 8px; padding: 24px;">
                <span class="project-badge" contenteditable="true" data-cksl-editable="true" style="font-size: 0.76rem; color: var(--color-red, #A62B2B); font-weight: 700;">Colloquium</span>
                <h3 class="project-title" contenteditable="true" data-cksl-editable="true" style="font-size: 1.15rem; margin: 10px 0;">New Project Initiative 2</h3>
                <p class="project-desc" contenteditable="true" data-cksl-editable="true" style="font-size: 0.92rem; color: var(--color-ink-muted, #474D54);">Click to edit project description.</p>
              </div>
              <div class="project-card" data-cksl-box="card" style="background: var(--color-surface, #FFFFFF); border: 1px solid var(--color-border, #E2DDD6); border-radius: 8px; padding: 24px;">
                <span class="project-badge" contenteditable="true" data-cksl-editable="true" style="font-size: 0.76rem; color: var(--color-red, #A62B2B); font-weight: 700;">Fellowship</span>
                <h3 class="project-title" contenteditable="true" data-cksl-editable="true" style="font-size: 1.15rem; margin: 10px 0;">New Project Initiative 3</h3>
                <p class="project-desc" contenteditable="true" data-cksl-editable="true" style="font-size: 0.92rem; color: var(--color-ink-muted, #474D54);">Click to edit project description.</p>
              </div>
            </div>
          </div>
        </div>
      `;
    } else if (type === 'callout') {
      html = `
        <div class="block-section block-callout" style="margin: 36px 0;">
          <div class="container">
            <div class="institutional-context-card" data-cksl-box="card" style="background: var(--color-surface-warm, #F4EFEA); border-left: 4px solid var(--color-red, #A62B2B); border-radius: 8px; padding: 28px;">
              <h3 contenteditable="true" data-cksl-editable="true" style="font-size: 1.25rem; font-weight: 700; margin-bottom: 12px; color: var(--color-ink);">Institutional Announcement</h3>
              <p contenteditable="true" data-cksl-editable="true" style="margin-bottom: 16px;">Click here to edit this institutional context or mission callout.</p>
              <a href="/cksl/contact/" class="btn btn-primary" contenteditable="true" data-cksl-editable="true">Contact Directorate &rarr;</a>
            </div>
          </div>
        </div>
      `;
    } else if (type === 'cta') {
      html = `
        <div class="block-section block-cta" style="margin: 40px 0;">
          <div class="container">
            <div class="cta-banner-box" data-cksl-box="card" style="background: linear-gradient(135deg, var(--color-surface-warm, #F4EFEA) 0%, var(--color-canvas, #FAF8F5) 100%); border: 1px solid var(--color-border, #E2DDD6); border-radius: 10px; padding: 36px; text-align: center;">
              <span class="section-kicker" contenteditable="true" data-cksl-editable="true">Scholarly Collaboration</span>
              <h3 contenteditable="true" data-cksl-editable="true" style="font-size: 1.45rem; font-weight: 700; margin: 10px 0 14px;">Partner with Contemporary Korean Studies Lab</h3>
              <p contenteditable="true" data-cksl-editable="true" style="max-width: 680px; margin: 0 auto 20px; color: var(--color-ink-muted);">We welcome visiting researchers, postdoctoral fellows, and academic institutional inquiries.</p>
              <a href="/cksl/contact/" class="btn btn-primary" contenteditable="true" data-cksl-editable="true">Submit an Academic Inquiry &rarr;</a>
            </div>
          </div>
        </div>
      `;
    } else if (type === 'divider') {
      html = `
        <div class="block-section block-divider" style="margin: 28px 0;">
          <div class="container">
            <div class="korean-motif-wrap korean-motif-divider" style="display: flex; align-items: center; justify-content: center; gap: 14px; margin: 28px 0;">
              <span style="flex: 1; max-width: 160px; height: 1.5px; background: linear-gradient(to right, transparent, var(--color-border, #E2DDD6), var(--color-yellow-gold, #E5B842));"></span>
              <span style="color: var(--color-red, #A62B2B); font-size: 1.2rem;">🌸</span>
              <span style="flex: 1; max-width: 160px; height: 1.5px; background: linear-gradient(to left, transparent, var(--color-border, #E2DDD6), var(--color-yellow-gold, #E5B842));"></span>
            </div>
          </div>
        </div>
      `;
    }

    const temp = document.createElement('div');
    temp.innerHTML = html.trim();
    const newEl = temp.firstChild;
    container.appendChild(newEl);

    makeContentEditable();
    buildSidebarOutline();
    newEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    selectElement(newEl);
  }

  // Palettes
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

  // Typography Size
  function applyFontSize(size, save = true) {
    document.documentElement.style.fontSize = size;
    if (save) localStorage.setItem('cksl_font_size', size);
  }

  // Modals management
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

    // Open Publish Dialog
    const publishBtn = document.getElementById('cksl-btn-publish-open');
    if (publishBtn) publishBtn.addEventListener('click', () => openModal('cksl-modal-publish-dialog'));

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

    // Motif selection click
    document.querySelectorAll('.cksl-motif-option-card').forEach(card => {
      card.addEventListener('click', () => {
        const motif = card.getAttribute('data-motif');
        insertMotifBlock(motif);
        closeModal('cksl-modal-motifs-dialog');
      });
    });

    // GitHub token input
    const saveTokenBtn = document.getElementById('cksl-btn-save-token-input');
    if (saveTokenBtn) {
      saveTokenBtn.addEventListener('click', () => {
        const input = document.getElementById('cksl-gh-token-input');
        if (input && input.value.trim()) {
          localStorage.setItem('cksl_gh_token', input.value.trim());
          showPubStatus('Token saved privately in your browser!', 'success');
        }
      });
      const saved = localStorage.getItem('cksl_gh_token');
      const input = document.getElementById('cksl-gh-token-input');
      if (saved && input) input.value = saved;
    }

    // Publish execution
    const execPublishBtn = document.getElementById('cksl-btn-execute-publish');
    if (execPublishBtn) execPublishBtn.addEventListener('click', executeGitHubPublish);

    // Download backup
    const dlBtn = document.getElementById('cksl-btn-download-file');
    if (dlBtn) dlBtn.addEventListener('click', downloadCurrentPageBackup);
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

  // Apply Landscape Image to Hero or Selected Image
  function applyLandscapeImage(src, crop) {
    if (activeElement && activeElement.tagName.toLowerCase() === 'img') {
      activeElement.src = src;
      activeElement.style.objectPosition = crop;
      return;
    }

    // Otherwise apply to Hero background image
    const heroImg = document.querySelector('.home-hero-img') || document.querySelector('.hero-img');
    if (heroImg) {
      heroImg.src = src;
      heroImg.style.objectPosition = crop;
      heroImg.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // Insert Motif Block
  function insertMotifBlock(motif) {
    const container = document.querySelector('.page-content-wrapper') || document.querySelector('.home-content-area') || document.querySelector('#cksl-page-frame main');
    if (!container) return;

    const block = document.createElement('div');
    block.className = 'block-section block-ornament';
    block.style.margin = '28px 0';
    block.innerHTML = `
      <div class="container" style="text-align: center;">
        <div class="korean-motif-wrapper" data-motif="${motif}" style="display: inline-block;">
          ${getMotifSVG(motif)}
        </div>
      </div>
    `;

    container.appendChild(block);
    makeContentEditable();
    buildSidebarOutline();
    block.scrollIntoView({ behavior: 'smooth', block: 'center' });
    selectElement(block);
  }

  function getMotifSVG(motif) {
    if (motif === 'hanok_roof') {
      return `<svg viewBox="0 0 160 24" fill="none" style="width: 140px; height: auto;"><path d="M4 20C32 10 56 6 80 6C104 6 128 10 156 20" stroke="var(--color-yellow-gold, #E5B842)" stroke-width="2.5" stroke-linecap="round"/><circle cx="80" cy="6" r="4.5" fill="var(--color-red, #A62B2B)"/></svg>`;
    } else if (motif === 'flower_divider') {
      return `<div style="display: flex; align-items: center; justify-content: center; gap: 14px;"><span style="width: 120px; height: 1.5px; background: var(--color-border);"></span><span style="color: var(--color-red); font-size: 1.2rem;">🌸</span><span style="width: 120px; height: 1.5px; background: var(--color-border);"></span></div>`;
    } else if (motif === 'pavilion') {
      return `<div style="display: inline-flex; width: 64px; height: 64px; background: rgba(166, 43, 43, 0.06); border: 1px solid var(--color-border); border-radius: 12px; padding: 10px;"><svg viewBox="0 0 48 48" fill="none" style="width: 44px; height: 44px;"><path d="M4 22C14 16 20 12 24 12C28 12 34 16 44 22" stroke="var(--color-red)" stroke-width="2.5"/><path d="M15 22V36M33 22V36" stroke="var(--color-brown-deep)" stroke-width="2"/></svg></div>`;
    } else if (motif === 'korean_seal') {
      return `<div style="display: inline-block; padding: 4px 6px; border: 2px solid var(--color-red); border-radius: 4px; color: var(--color-red); font-weight: 700; font-family: 'Noto Serif KR', serif;">한국<br>학연</div>`;
    } else if (motif === 'cloud_unmun') {
      return `<svg viewBox="0 0 100 40" fill="none" style="width: 90px; height: auto;"><path d="M20 28C14 28 8 24 8 18C8 12 14 8 20 8C22 8 24 9 26 10C28 6 34 3 42 3C50 3 56 7 59 12C62 10 66 9 70 9C78 9 84 14 84 20C84 21 83 22 83 23C87 23 91 26 91 30C91 34 87 37 82 37H20C15 37 11 33 11 28" stroke="var(--color-red)" stroke-width="2" fill="none"/></svg>`;
    }
    return `<div style="color: var(--color-red); font-size: 1.5rem;">🌸</div>`;
  }

  // GitHub Publish
  async function executeGitHubPublish() {
    const token = localStorage.getItem('cksl_gh_token');
    if (!token) {
      showPubStatus('Please enter and save your GitHub Personal Access Token above first.', 'error');
      return;
    }

    showPubStatus('Connecting to repository profkwanminlee/cksl on GitHub...', 'loading');

    try {
      const repo = 'profkwanminlee/cksl';
      const branch = 'main';
      const path = '_data/theme.yml';
      const apiUrl = `https://api.github.com/repos/${repo}/contents/${path}?ref=${branch}`;

      // 1. Get current SHA
      let sha = '';
      const getRes = await fetch(apiUrl, {
        headers: { 'Authorization': `token ${token}`, 'Accept': 'application/vnd.github.v3+json' }
      });

      if (getRes.ok) {
        const getData = await getRes.json();
        sha = getData.sha;
      } else if (getRes.status === 401) {
        showPubStatus('Invalid GitHub Token. Please ensure it has repo access.', 'error');
        return;
      }

      // 2. Put updated theme content
      const content = generateThemeContent();
      const utf8Bytes = new TextEncoder().encode(content);
      let binary = '';
      for (let i = 0; i < utf8Bytes.length; i++) binary += String.fromCharCode(utf8Bytes[i]);
      const b64 = btoa(binary);

      const putRes = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
        method: 'PUT',
        headers: {
          'Authorization': `token ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/vnd.github.v3+json'
        },
        body: JSON.stringify({
          message: `Update site styles via CKSL Studio Editor [${new Date().toLocaleDateString()}]`,
          content: b64,
          branch: branch,
          sha: sha || undefined
        })
      });

      if (putRes.ok) {
        showPubStatus('Successfully Published to GitHub! Live site will update in ~30 seconds.', 'success');
      } else {
        const err = await putRes.json();
        showPubStatus(`GitHub API Error: ${err.message || 'Failed to commit.'}`, 'error');
      }
    } catch (err) {
      showPubStatus(`Network Error: ${err.message}`, 'error');
    }
  }

  function generateThemeContent() {
    const palKey = localStorage.getItem('cksl_palette') || 'dancheong';
    const p = PALETTES[palKey];
    const fontSize = localStorage.getItem('cksl_font_size') || '16px';

    return `# ==============================================================================
# Contemporary Korean Studies Lab (CKSL) — Theme & Styling Settings
# Auto-generated via CKSL Studio Editor
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
  base_font_size: "${fontSize}"
  font_family: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif"

ornaments:
  show_hero_roof_accent: true
  show_flower_dividers: true
  show_title_underlines: true
  show_hero_lattice_pattern: true

effects:
  enable_parallax: true
  hero_scrim_opacity: 0.52
`;
  }

  function downloadCurrentPageBackup() {
    const yaml = generateThemeContent();
    const blob = new Blob([yaml], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'theme.yml';
    a.click();
    URL.revokeObjectURL(url);
    showPubStatus('Downloaded theme.yml backup!', 'success');
  }

  function showPubStatus(msg, type) {
    const b = document.getElementById('cksl-pub-status-box');
    if (!b) return;
    b.textContent = msg;
    b.className = `cksl-status-banner ${type}`;
  }

  // Boot
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
