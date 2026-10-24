# Korean Studies Lab (KSL) — Comprehensive Architecture, Layout & Editor Documentation

> **Context**: This document provides a complete, exhaustive record of all changes, refactorings, content updates, styling decisions, and architectural systems implemented for the **Korean Studies Lab (KSL)** website (`https://profkwanminlee.github.io/ksl/`).
> **Purpose**: This file can be fed directly to any AI model, developer, or collaborator to provide 100% full context on the current codebase, design system, and technical behavior.

---

## 1. Project Overview & Repository Infrastructure

* **Organization**: Korean Studies Lab (KSL), Nanyang Technological University (NTU), Singapore
* **Director**: Prof. Kwan Min Lee, Korea Foundation Endowed Chair Professor
* **Platform**: Jekyll static site generator (v4.4.1), hosted on GitHub Pages
* **GitHub Repository**: [profkwanminlee/ksl](https://github.com/profkwanminlee/ksl)
* **Live Website URL**: `https://profkwanminlee.github.io/ksl/`
* **Local Development**:
  * Jekyll Dev Server: `jekyll serve --port 4002 --host 127.0.0.1` (`http://127.0.0.1:4002/ksl/`)
  * Local Git/Editor Backend Bridge: `node tools/editor-service.js` (port `4005`)

### Repository Rename & Configuration Updates (`cksl` &rarr; `ksl`)
The repository was migrated and renamed from `cksl` to `ksl`:
1. **`_config.yml`**:
   * `baseurl: "/ksl"` (previously `"/cksl"`)
   * `url: "https://profkwanminlee.github.io"`
   * `title: "Korean Studies Lab"`
   * `short_title: "Korean Studies Lab"`
   * `acronym: "KSL"`
   * `description`: Updated to reflect Korean Studies Lab at NTU Singapore.
2. **`admin/config.yml`** (Sveltia CMS config):
   * `backend.repo: profkwanminlee/ksl`
   * `site_url: https://profkwanminlee.github.io/ksl/`
   * `logo_url: https://profkwanminlee.github.io/ksl/images/ntu.png`
3. **`tools/editor-service.js`**:
   * Updated `extractPageSlug()` to correctly resolve routes under `/ksl/` as well as `/cksl/`.
4. **Git Remote**:
   * Origin URL set to `https://github.com/profkwanminlee/ksl.git`.

---

## 2. Seven Major Academic Revisions (Mandated by Prof. Kwan Min Lee)

All 7 directives provided by the Lab Director were implemented and verified across the entire repository:

### 1. Removal of Flower Graphics & Decorative Motifs
* **Problem**: Previous designs had flower-shaped vector graphics, plum blossoms, Hanok roof accents, and decorative pavilion badges in page headers, section titles, and dividers.
* **Resolution**:
  * `_includes/korean-title-underline.html`: Replaced flower SVG with `.title-underline-normal` (clean 2px academic rule in red/warm gold).
  * `_includes/korean-divider.html`: Replaced flower SVG divider with `.section-divider-line` (clean 1px hairline horizontal rule).
  * `_includes/korean-hero-accent.html`: Replaced roof crest/flower with `.hero-normal-underline`.
  * `_includes/korean-pavilion.html`: Emptied and removed pavilion badge.
  * Modular block includes (`callout_box.html`, `card_grid.html`, `cta_banner.html`, `director_card.html`, `ornament.html`, `text_block.html`): Cleaned of all decorative motif dependencies.

### 2. Removal of Korean Title ("현대한국학연구소")
* **Problem**: The Korean lab name was displayed beneath English titles on headers, footers, and page heroes.
* **Resolution**:
  * Removed "현대한국학연구소" from `_includes/header.html`, `_includes/footer.html`, `_pages/home.md`, and all layouts.

### 3. Lab Name Uniformity ("Korean Studies Lab" / "KSL")
* **Problem**: Some sections previously used "Contemporary Korean Studies Lab" or "CKSL".
* **Resolution**:
  * Standardized to **"Korean Studies Lab"** (acronym **"KSL"**) across `_config.yml`, navigation, hero titles, footers, meta tags, and all pages.

### 4. Removal of All Korean Headings & Kickers (100% English)
* **Problem**: Pages contained Korean subtitle kickers (e.g., "연구체계", "연구프로젝트", "연구분야", "학술 및 커뮤니티", "학술 교류 협력", "연락처 및 위치").
* **Resolution**:
  * Replaced all Korean kickers with English academic equivalents (e.g., "Academic Initiative", "Core Mission", "Research Themes", "Lab Pathways", "Faculty Network", "Program Archive", "Lab Directorate").
  * **Automated Audit**: 0 Hangul characters remain anywhere in the content files.

### 5. News & Events Menu Consolidation & Program Updates
* **Top Navigation**: Merged separate "Program & Event" and "News" items into a single menu item: `{ title: "News & Events", url: "/events/" }` in `_data/navigation.yml`.
* **Proposal CTA**: Wired "Submit a Program Proposal" button to `mailto:jimin.lee@ntu.edu.sg`.
* **Upcoming Symposium**: Updated to January 2027: **"Korean Studies and Digital Regionalism"**, with button disabled ("Registration Opens Late 2026").
* **Featured Past Event**: Added August 2026 academic exchange:
  * **Title**: *Korean Association for Broadcasting & Telecommunication Studies (KABS)*
  * **Venue/Date**: NTU WKWSCI | August 2026
  * **Description**: Academic collaboration between KABS and WKWSCI covering media effects, policy, K-content, and human-AI interaction.
  * **Media**:
    * Conference poster (`images/events/kabs-keyvisual.jpg`)
    * Delegation group photo (`images/events/kabs-group.jpg`)

### 6. People & Leadership Overhaul
* **Director Card** (`_pages/people.md`):
  * Retained full bio for Director Prof. Kwan Min Lee (Stanford Ph.D., Korea Foundation Endowed Chair Professor, ICA Fellow, former VP at Samsung Electronics, USC tenured professor, SKKU center director).
  * Maintained links to NTU Academic Profile and Personal Website.
* **Affiliate Faculty & Collaborating Scholars** (`_pages/people.md`):
  * Added dedicated profiles for two collaborating faculty members:
    1. **Janghyo Park**: Research Professor, K-Inclusive Society Institute | Kyungpook National University
       * Photo: `images/people/janghyo-park.jpg`
       * Research: *Othering and Belonging in East Asia: Korea, Hallyu, and Cultural Boundaries on Digital Platforms*; *Making “K” Legible / KBS WORLD on Global Platforms / The 2026 #SEAblings Controversy*.
    2. **Inyong Park**: Assistant Professor, Major in Applied AI Content | Seoul Women's University
       * Photo: `images/people/inyong-park.jpg`
       * Research: *The Impact of ‘K-Pop Demon Hunters’ on Interest in Korean Culture and Visits to the National Museum of Korea*; *A Comparative Study of K-pop Idol Perceptions among Gen Z in Korea and the United States*; *User Perceptions and Experiences of Virtual Humans in Digital Cultural Content*.

### 7. Director Email Redaction
* **Problem**: Prof. Kwan Min Lee's personal email (`kwanminlee@ntu.edu.sg`) was displayed on the contact page, footer, and bio cards.
* **Resolution**:
  * Removed all direct email listings for Prof. Lee from `_pages/contact.md`, `_includes/footer.html`, and `_pages/people.md`.
  * Inquiries now route through official institutional channels and `jimin.lee@ntu.edu.sg`.

---

## 3. Layout, Typography & Spacing Fixes

### A. Subpage Content Width Expansion (Reduced Excessive Left/Right Margins)
* **Root Cause**: In `assets/css/main.css`, `.page-content-wrapper` was hardcoded to `max-width: 820px` inside the `1140px` container. On desktop screens, this pinched all subpages into a narrow central strip with over 160px of unused white gap on each side.
* **Fix**:
  * Changed `.page-content-wrapper` to `width: 100%; max-width: 100%; margin: 0 auto;`.
  * Adjusted `.page-container` to `padding-top: 36px; padding-bottom: 64px;`.
  * Subpages (About, Research, Publications, People, News & Events, Contact) now gracefully fill the full 1140px container, harmonizing with the generous layout of the home page.

### B. KABS Poster Whitespace Elimination
* **Root Cause**: In `_pages/programs-events.md`, the 16:9 poster (`kabs-keyvisual.jpg`) and 4:3 group photo (`kabs-group.jpg`) were placed in a CSS grid with `align-items: stretch` (default). This caused the poster figure to stretch to the height of the taller group photo, creating a large empty block between the poster image and its caption.
* **Fix**:
  * Configured `.event-media-grid` with `align-items: start; gap: 20px;`.
  * Configured `.event-media-figure` with `height: fit-content; align-self: start;`.
  * The poster figure now hugs its image and caption with **zero empty whitespace**.

### C. People Card Line Spacing Compaction
* **Root Cause**: Inside `_layouts/page.html`, content is wrapped in `.markdown-body`. Paragraphs and headings inside `.markdown-body` inherited default `margin-bottom: 20px` and `margin-top: 32px`, pushing Name, Role, Title, and Affiliation far apart.
* **Fix**:
  * Implemented high-specificity overrides in `assets/css/main.css`:
    ```css
    .people-card-header {
      display: flex;
      gap: 20px;
      align-items: center;
      margin-bottom: 14px;
    }
    .people-info {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    .people-card .people-info h3,
    .people-card .people-name,
    .markdown-body .people-card h3,
    .markdown-body .people-card .people-name {
      font-size: 1.35rem;
      font-weight: 800;
      color: var(--color-ink);
      margin: 0 0 3px 0 !important;
      line-height: 1.22 !important;
    }
    .people-card .people-info p,
    .markdown-body .people-card .people-info p,
    .people-card .people-role,
    .people-card .people-title,
    .people-card .people-affiliation,
    .people-card .people-subaffiliation {
      margin: 0 0 3px 0 !important;
      line-height: 1.35 !important;
    }
    .people-card .people-info p:last-child,
    .markdown-body .people-card .people-info p:last-child {
      margin-bottom: 0 !important;
    }
    ```
  * Results in clean, natural 3px spacing between lines.

---

## 4. Visual WYSIWYG Editor System (Studio Editor Engine)

The repository includes a custom, zero-dependency in-browser site editor combining paradigms from **Microsoft Word**, **WordPress Block Editor**, and **Figma**.

### Public Isolation & Dormant Safeguards
To ensure public visitors never see editor artifacts, floating handles, or change buttons:
1. **Script Early-Exit Guard**:
   In `assets/js/visual-editor.js`, the very first lines of `init()` check for an explicit edit flag:
   ```javascript
   const urlParams = new URLSearchParams(window.location.search);
   const hasEditParam = urlParams.get('edit') === 'true' || window.location.hash === '#edit';
   if (!hasEditParam) {
     localStorage.removeItem('cksl_editor_active');
     return;
   }
   ```
   If `?edit=true` is not in the URL, the editor script exits immediately. No drag handles, no selection listeners, and no DOM modifications occur.
2. **DOM Wrapper Removal**:
   In `_layouts/default.html`, `#cksl-editor-root` is wrapped in `display: none` and stripped from the DOM immediately unless `?edit=true` is detected.
3. **CSS Strict Scoping**:
   All editor elements (`.cksl-drag-handle`, `.cksl-hero-change-btn`, `#cksl-ribbon`, `#cksl-sidebar`, `#cksl-floating-inspector`, `#cksl-text-selection-toolbar`) are set to `display: none !important;` by default. They can only render when `body.cksl-editor-active` is explicitly added to the document body.
4. **Clean Content Markup**:
   Removed all hardcoded `data-cksl-editable`, `data-cksl-block`, `data-cksl-box`, and `data-cksl-image` attributes from `_pages/home.md` and hero includes.

### How to Access the Editor
* **URL Flag**: Append `?edit=true` to any URL (e.g. `http://127.0.0.1:4002/ksl/?edit=true` or `https://profkwanminlee.github.io/ksl/?edit=true`).
* **Keyboard Shortcut**: Press <kbd>Alt</kbd> + <kbd>E</kbd> (or <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>E</kbd>) to toggle editor mode.

### Editor Subsystems & Capabilities
When activated via `?edit=true`:
1. **Top Minimizable Ribbon** (`#cksl-ribbon`):
   * **Document & Text Tab**: Quick heading styles (H1, H2, H3, P), font selection (Noto Serif KR vs. Plus Jakarta Sans), font size stepping (+2 / -2), text styling (bold, italic, underline, strike, alignment, lists, color picker, link insertion).
   * **Insert Blocks Tab**: Pre-built modular academic blocks (overview lead box, 3-card mission grid, theme cards, callout box, cta banner).
   * **Heritage Motifs Tab**: Authentic Korean vector motifs (plum blossom, cloud, lotus, fan, Dancheong, lattice, Taegeuk, ceramic vase, magpie, etc.) with preview, insertion, color change, and replace capabilities.
   * **Pages & Nav Tab**: Reorder, add, or rename navigation menu items.
   * **Theme & Style Tab**: Live palette switching (Academic Slate, Royal Dancheong, Celadon Jade, Joseon Monochrome) and typography scale controls.
   * **Device Layout Tab**: Switch between Desktop (100%), Laptop (1024px), and Phone (390px) responsive canvas views.
2. **Device Canvas Auto-Fit Engine**:
   * Dynamically resizes the page frame and calculates scale transform (`fitCanvasToScreen()`) so mobile and laptop layouts fit completely within the screen without clipping.
3. **Word-Style Selection Toolbar** (`#cksl-text-selection-toolbar`):
   * Floats directly over any highlighted text selection for instant formatting.
4. **Figma-Style Floating Context Inspector** (`#cksl-floating-inspector`):
   * Draggable HUD showing active element type badge (NAVBAR, CARD, MOTIF, IMAGE, etc.).
   * Card controls: Duplicate (<kbd>Cmd</kbd>+<kbd>D</kbd>), Copy/Paste (<kbd>Cmd</kbd>+<kbd>C</kbd> / <kbd>Cmd</kbd>+<kbd>V</kbd>), Reorder (<kbd>Alt</kbd>+<kbd>ArrowUp/Down</kbd>), and Delete (<kbd>Delete</kbd>).
5. **Image Replacement Modal** (`#cksl-modal-replace-image`):
   * Modal dialog to replace any image via URL input or Korean landscape photo presets.
6. **Git Draft Session Staging Backend** (`tools/editor-service.js`):
   * Communicates with local Node server on `http://127.0.0.1:4005`.
   * Automatically isolates edits in a temporary `draft-session` git branch so the `main` branch remains clean and safe until the user clicks "Merge & Publish to Main".

---

## 5. File Map & Directory Structure

```
koreanstudieslab/
├── _config.yml                    # Jekyll configuration (title, baseurl: /ksl, permalinks)
├── _data/
│   ├── director.yml               # Director metadata (Prof. Kwan Min Lee bio, roles)
│   ├── navigation.yml             # 7 main navigation items (News & Events merged)
│   ├── research_themes.yml        # 3 core research themes and focus points
│   └── theme.yml                  # Theme tokens, font sizes, active color palette
├── _includes/
│   ├── footer.html                # Academic footer (100% English, director email removed)
│   ├── header.html                # Global masthead with NTU brand mark and navigation
│   ├── hero-banner.html           # Subpage hero banner with lattice pattern
│   ├── home-hero.html             # Homepage hero banner (clean, zero editor buttons)
│   ├── korean-divider.html        # Clean horizontal divider line
│   ├── korean-hero-accent.html    # Clean normal underline accent
│   ├── korean-title-underline.html# Clean normal underline rule
│   ├── meta.html                  # SEO, viewport, fonts, and OpenGraph tags
│   └── visual-editor.html         # Studio Editor markup (guarded in hidden root)
├── _layouts/
│   ├── default.html               # Base layout with clean semantic HTML structure
│   └── page.html                  # Subpage layout (expanded 100% width container)
├── _pages/
│   ├── 404.md                     # Not found page
│   ├── about.md                   # About KSL, vision, institutional background
│   ├── contact.md                 # Contact info, location, general inquiry routing
│   ├── home.md                    # Homepage editorial narrative & pathways
│   ├── news.md                    # News archive
│   ├── people.md                  # Leadership & Affiliate Faculty profiles
│   ├── programs-events.md         # News & Events (KABS collaboration + Jan 2027 symposium)
│   ├── publications.md            # Publications archive
│   └── research.md                # Research pillars, themes, and methodology
├── admin/
│   ├── config.yml                 # Sveltia CMS configuration
│   └── index.html                 # CMS entrypoint
├── assets/
│   ├── css/
│   │   ├── main.css               # Core design system, typography, cards, responsive rules
│   │   └── visual-editor.css      # Editor HUD, ribbon, inspector, and device canvas styles
│   └── js/
│       ├── main.js                # Parallax effects, mobile navigation toggle
│       └── visual-editor.js       # Complete Studio Editor engine (guarded by ?edit=true)
├── images/
│   ├── events/
│   │   ├── kabs-group.jpg         # KABS & WKWSCI exchange group photo (optimized 460KB)
│   │   └── kabs-keyvisual.jpg     # KABS event poster key visual (optimized 128KB)
│   ├── people/
│   │   ├── inyong-park.jpg        # Prof. Inyong Park portrait (optimized 148KB)
│   │   └── janghyo-park.jpg       # Prof. Janghyo Park portrait (optimized 128KB)
│   ├── ntu.png                    # NTU Singapore official university mark
│   ├── profkwanportrait.jpeg      # Prof. Kwan Min Lee official portrait
│   └── korea1.jpg                 # Hero background landscape
└── tools/
    └── editor-service.js          # Node.js local git bridge & draft session service (port 4005)
```

---

## 6. Verification & Automated Quality Checks

1. **Jekyll Build**: Compiles cleanly with 0 errors in under 0.20s (`jekyll build`).
2. **HTTP Server Status**: All endpoints (`/ksl/`, `/ksl/events/`, `/ksl/people/`, `/ksl/research/`, `/ksl/contact/`) return `HTTP/1.1 200 OK`.
3. **Hangul Audit**: Audited repository content files — **0 Hangul characters remain**.
4. **Email Audit**: Prof. Kwan Min Lee's email address is completely absent from all public web pages.
5. **Asset Optimization**: All user-supplied photos were scaled with `sips` for rapid web loading without loss of fidelity.
6. **Git Status**: Clean working tree on `main`, fully synchronized with `origin/main` at `https://github.com/profkwanminlee/ksl.git`.
