# Contemporary Korea Studies Lab (KSL)
**Nanyang Technological University, Singapore**

An interdisciplinary research initiative based at Nanyang Technological University, Singapore, advancing scholarship, dialogue, and exchange on contemporary Korea in Singapore and Southeast Asia.

---

## Site Architecture & Page Organization

This website is built with a modular, lightweight Jekyll architecture optimized for **GitHub Pages**. All page content is written in standard Markdown and front matter, making it straightforward for non-technical editors to update directly in GitHub's web interface or any text editor.

```
koreanstudieslab/
├── _config.yml               # Site metadata, settings, and permalinks
├── _data/
│   ├── navigation.yml        # Navigation links (About, Research, Publications, People, Programs & Events, News, Contact)
│   └── research_themes.yml   # The three core research themes and focus points
├── _includes/
│   ├── meta.html             # HTML <head> tags, Google Fonts, and OpenGraph metadata
│   ├── header.html           # Brand wordmark and accessible responsive navigation bar
│   ├── hero-banner.html      # Reusable image hero banner with parallax layers and lattice motif
│   ├── korean-divider.html   # Restrained plum-blossom (Maehwa) line motif divider
│   └── footer.html           # NTU Singapore institutional attribution, navigation, and contact
├── _layouts/
│   ├── default.html          # Base layout shell
│   ├── home.html             # Editorial landing page layout
│   └── page.html             # Content page layout for standard Markdown pages
├── _pages/
│   ├── about.md              # Overview, Mission, and Research Focus (/about/)
│   ├── research.md           # Research Themes and Current Projects (/research/)
│   ├── publications.md       # Featured Publications and Publication List (/publications/)
│   ├── people.md             # Leadership, Affiliate Faculty, and Researchers (/people/)
│   ├── programs-events.md    # Upcoming and Past Events (/programs-events/)
│   ├── news.md               # Announcements and Academic Opportunities (/news/)
│   ├── contact.md            # Location, Enquiries, and Collaboration Proposals (/contact/)
│   └── 404.md                # Page Not Found fallback (/404.html)
├── assets/
│   ├── css/
│   │   └── main.css          # Design system (warm palette, typography, responsive grid, parallax)
│   └── js/
│       └── main.js           # Mobile drawer navigation & clamped parallax fallback
├── images/
│   └── korea1.jpg            # Provided hero/banner image reused with tailored page crops
└── index.md                  # Homepage document (uses home layout)
```

---

## Approved Content & Source of Truth

The website incorporates the approved institutional identity and overview:

- **Mission Statements**:
  1. *Advancing the study of contemporary Korea in Singapore and Southeast Asia.*
  2. *Supporting research, dialogue, and exchange on Korea in Southeast Asia.*
  3. *A hub for research and engagement on contemporary Korea in Southeast Asia.*
- **Three Core Research Areas**:
  1. **Korea’s IT Innovation and Digital Society** (Digital infrastructures, technological ecosystems, and platform transformation)
  2. **Contemporary Korean Culture and the Korean Wave** (Transnational circulation, creative industries, and cultural translation across Singapore and Southeast Asia)
  3. **Human and Cultural Exchange between Korea and Southeast Asia** (Educational mobility, academic networks, and institutional partnerships)
- **Leadership**:
  - Directed by **Prof. Kwan Min Lee (이관민, Ph.D., Stanford)**, inaugural Korea Foundation Endowed Chair Professor in Contemporary Korean Society and New Media at the Wee Kim Wee School of Communication and Information (WKWSCI), NTU Singapore.

---

## Non-Technical Editor Guide

### 1. Editing Page Text on GitHub
1. Open the repository on GitHub in your web browser.
2. Navigate into the `_pages/` directory and click the file you wish to modify (e.g., `publications.md`, `about.md`).
3. Click the **Pencil icon ("Edit this file")** in the upper right.
4. Edit the text using standard Markdown.
5. Click **Commit changes...** at the top right. GitHub Pages will automatically rebuild and deploy the live site in ~30 seconds.

### 2. Adding a New Publication
Open `_pages/publications.md` and add an entry under **Publication List**:
```markdown
- **Author Name(s)** (2026). "Article or Book Title." *Journal or Publisher Name*, 12(3), 45–67. [DOI Link]
```

### 3. Adding an Event
Open `_pages/programs-events.md` and insert an event card:
```html
<div class="event-card upcoming-event">
  <div class="event-date-badge">
    <span class="event-month">NOV</span>
    <span class="event-day">18</span>
    <span class="event-year">2026</span>
  </div>
  <div class="event-details">
    <span class="event-tag">Public Lecture</span>
    <h3 class="event-title">Lecture Title Here</h3>
    <p class="event-meta">
      <strong>Speaker:</strong> Prof. Name (Institution)<br>
      <strong>Time:</strong> 3:00 PM – 4:30 PM (SGT)<br>
      <strong>Venue:</strong> WKWSCI Conference Room &amp; Zoom
    </p>
    <p class="event-abstract">Abstract or summary of the talk.</p>
  </div>
</div>
```

### 4. Updating Contact Details or Room Numbers
Open `_pages/contact.md` and replace the bracketed placeholders:
- Replace `[Room / Floor Placeholder]` with the actual office room (e.g., `WKWSCI #03-XX`).
- Replace `[ksl-enquiries@ntu.edu.sg]` with the designated secretariat email.
- Replace `[Editable Phone Number Placeholder]` with the lab contact number.

---

## Visual Direction & Design Tokens

- **Color Palette**:
  - Warm Canvas: `#FAF8F5`
  - Korean Red (Dancheong vermilion): `#A62B2B` (deep: `#851F1F`)
  - Korean Ochre / Traditional Hwang: `#C68A2C` (light amber: `#F7F0E1`)
  - Burnt Orange / Terracotta: `#C2593F`
  - Charcoal Ink (Meok): `#1D1F21` (muted: `#4A4D52`)
  - Hairline Rules: `#E5DFD5`
- **Typography**:
  - Headings: `Newsreader` (high-contrast editorial serif)
  - Body & Navigation: `Plus Jakarta Sans` (modern clean sans-serif)
  - Korean Glyphs: `Noto Serif KR`
- **Banner Image**:
  - Reuses the supplied `korea1.jpg` across all page headers using tailored CSS `object-position` crops (e.g. `center 20%` for About, `70% 35%` for Research, `center 60%` for Publications).
- **Subtle Parallax**:
  - Utilizes native CSS scroll-driven animations with a clamped JavaScript fallback for older browsers.
  - Strictly respects `@media (prefers-reduced-motion: reduce)`.
