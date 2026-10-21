const http = require('http');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PORT = 4005;
const REPO_ROOT = path.resolve(__dirname, '..');

function runGit(cmd) {
  try {
    return execSync(`git ${cmd}`, { cwd: REPO_ROOT, encoding: 'utf-8' }).trim();
  } catch (err) {
    console.error(`Git command failed: git ${cmd}`, err.message);
    throw err;
  }
}

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
  res.end(JSON.stringify(data));
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        reject(e);
      }
    });
  });
}

const server = http.createServer(async (req, res) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    return res.end();
  }

  const url = new URL(req.url, `http://localhost:${PORT}`);

  try {
    // 1. Session Status
    if (req.method === 'GET' && url.pathname === '/api/status') {
      let currentBranch = 'unknown';
      let statusStr = '';
      try {
        currentBranch = runGit('branch --show-current');
        statusStr = runGit('status --porcelain');
      } catch (e) {}

      const isDraftSession = currentBranch === 'draft-session' || currentBranch.startsWith('draft-');
      const modifiedFiles = statusStr ? statusStr.split('\n').filter(Boolean) : [];

      return sendJson(res, 200, {
        currentBranch,
        isDraftSession,
        modifiedCount: modifiedFiles.length,
        modifiedFiles
      });
    }

    // 2. Initialize Draft Session (Create temp draft branch off main)
    if (req.method === 'POST' && url.pathname === '/api/session/init') {
      let currentBranch = runGit('branch --show-current');
      if (currentBranch !== 'draft-session') {
        // Check if draft-session already exists
        const branches = runGit('branch --list draft-session');
        if (branches.includes('draft-session')) {
          runGit('checkout draft-session');
        } else {
          runGit('checkout -b draft-session');
        }
        currentBranch = 'draft-session';
      }
      return sendJson(res, 200, {
        success: true,
        message: 'Draft session active on temporary branch draft-session. Main repository is untouched.',
        branch: currentBranch
      });
    }

    // 3. Publish & Merge Draft to Main
    if (req.method === 'POST' && url.pathname === '/api/session/publish') {
      const currentBranch = runGit('branch --show-current');
      if (currentBranch === 'draft-session') {
        // Stage and commit all draft changes
        try {
          runGit('add .');
          runGit('commit -m "CKSL Studio Editor: publish updates"');
        } catch (e) {
          // May be clean already
        }

        // Switch to main and merge
        runGit('checkout main');
        runGit('merge draft-session --no-edit');
        
        // Delete temp draft branch
        try {
          runGit('branch -D draft-session');
        } catch (e) {}

        return sendJson(res, 200, {
          success: true,
          message: 'Draft successfully merged into main branch! Changes are now permanent.',
          branch: 'main'
        });
      } else {
        return sendJson(res, 200, {
          success: true,
          message: 'Already on main branch.',
          branch: currentBranch
        });
      }
    }

    // 4. Discard Draft & Revert to Main
    if (req.method === 'POST' && url.pathname === '/api/session/discard') {
      const currentBranch = runGit('branch --show-current');
      if (currentBranch === 'draft-session') {
        // Force checkout main and reset
        runGit('checkout -f main');
        runGit('reset --hard HEAD');
        runGit('clean -fd');
        try {
          runGit('branch -D draft-session');
        } catch (e) {}

        return sendJson(res, 200, {
          success: true,
          message: 'Draft session discarded completely. Main branch is pristine and unaffected.',
          branch: 'main'
        });
      } else {
        runGit('reset --hard HEAD');
        runGit('clean -fd');
        return sendJson(res, 200, {
          success: true,
          message: 'Working changes discarded. Main branch is pristine.',
          branch: 'main'
        });
      }
    }

    // 5. Create New Page File in _pages/
    if (req.method === 'POST' && url.pathname === '/api/page/create') {
      const body = await parseBody(req);
      const { title, slug, kicker, addToNav } = body;

      if (!title || !slug) {
        return sendJson(res, 400, { error: 'Page title and slug are required.' });
      }

      const cleanSlug = slug.replace(/^\/+|\/+$/g, '').toLowerCase().replace(/[^a-z0-9_-]/g, '-');
      const filePath = path.join(REPO_ROOT, '_pages', `${cleanSlug}.md`);

      const content = `---
layout: default
title: "${title.replace(/"/g, '\\"')}"
permalink: /${cleanSlug}/
kicker: "${(kicker || 'CKSL Academic Initiative').replace(/"/g, '\\"')}"
---

<div class="page-content-wrapper">
  <section class="block-section" style="padding: 48px 0; background: var(--color-canvas, #FAF8F5);">
    <div class="container">
      <div class="overview-lead-box" style="padding: 32px; background: #FFFFFF; border: 1.5px solid var(--color-border, #E2DDD6); border-radius: 8px; box-shadow: 0 4px 16px rgba(0,0,0,0.04);">
        <span class="section-kicker" style="display: block; font-size: 0.8rem; font-weight: 700; color: var(--color-yellow-gold, #E5B842); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 8px;">
          ${kicker || 'CKSL Academic Initiative'}
        </span>
        <h1 style="font-family: 'Noto Serif KR', serif; font-size: 2.2rem; color: var(--color-red, #A62B2B); margin: 0 0 16px;">
          ${title}
        </h1>
        <p style="font-size: 1.1rem; line-height: 1.75; color: var(--color-ink-muted, #474D54); margin: 0 0 20px;">
          Welcome to the ${title} page at Contemporary Korean Studies Lab. Click anywhere on this text to edit words, formatting, images, and layout directly.
        </p>
        <div style="display: flex; gap: 12px;">
          <a href="/contact/" class="btn btn-primary" style="background: var(--color-red, #A62B2B); color: #FFF; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: 600;">
            Get Involved &rarr;
          </a>
        </div>
      </div>
    </div>
  </section>
</div>
`;

      fs.writeFileSync(filePath, content, 'utf-8');

      // Add to navigation if requested
      if (addToNav) {
        const navPath = path.join(REPO_ROOT, '_data', 'navigation.yml');
        if (fs.existsSync(navPath)) {
          let navContent = fs.readFileSync(navPath, 'utf-8');
          const newEntry = `  - title: ${title}\n    url: /${cleanSlug}/\n`;
          if (!navContent.includes(`/${cleanSlug}/`)) {
            navContent += newEntry;
            fs.writeFileSync(navPath, navContent, 'utf-8');
          }
        }
      }

      return sendJson(res, 200, {
        success: true,
        message: `Page _pages/${cleanSlug}.md created successfully.`,
        url: `/${cleanSlug}/`
      });
    }

    // 6. Delete Page File from _pages/
    if (req.method === 'POST' && url.pathname === '/api/page/delete') {
      const body = await parseBody(req);
      const { url: pageUrl } = body;

      if (!pageUrl || pageUrl === '/' || pageUrl === '/index.html') {
        return sendJson(res, 400, { error: 'Cannot delete the Home page.' });
      }

      const cleanSlug = pageUrl.replace(/^\/+|\/+$/g, '').toLowerCase();
      const filePath = path.join(REPO_ROOT, '_pages', `${cleanSlug}.md`);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      // Remove from navigation.yml
      const navPath = path.join(REPO_ROOT, '_data', 'navigation.yml');
      if (fs.existsSync(navPath)) {
        let navContent = fs.readFileSync(navPath, 'utf-8');
        const lines = navContent.split('\n');
        const filtered = [];
        let skipNext = false;

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          if (line.includes(`url: /${cleanSlug}/`)) {
            // Remove previous title line if it was part of this item
            if (filtered.length > 0 && filtered[filtered.length - 1].includes('- title:')) {
              filtered.pop();
            }
            continue;
          }
          filtered.push(line);
        }
        fs.writeFileSync(navPath, filtered.join('\n'), 'utf-8');
      }

      return sendJson(res, 200, {
        success: true,
        message: `Page ${cleanSlug} deleted successfully.`
      });
    }

    // 7. Save Navigation Items
    if (req.method === 'POST' && url.pathname === '/api/navigation/save') {
      const body = await parseBody(req);
      const { items } = body;

      if (!Array.isArray(items)) {
        return sendJson(res, 400, { error: 'Items array is required.' });
      }

      let yml = 'main:\n';
      items.forEach(item => {
        yml += `  - title: ${item.title}\n    url: ${item.url}\n`;
      });

      const navPath = path.join(REPO_ROOT, '_data', 'navigation.yml');
      fs.writeFileSync(navPath, yml, 'utf-8');

      return sendJson(res, 200, {
        success: true,
        message: 'Navigation menu updated successfully.'
      });
    }

    // 8. Save Theme Settings
    if (req.method === 'POST' && url.pathname === '/api/theme/save') {
      const body = await parseBody(req);
      const { palette, fontSize, headerImage } = body;

      const themePath = path.join(REPO_ROOT, '_data', 'theme.yml');
      let yml = `# CKSL Studio Editor Theme Settings\n`;
      yml += `active_palette: ${palette || 'dancheong'}\n`;
      yml += `base_font_size: ${fontSize || '16px'}\n`;
      if (headerImage) yml += `header_image: "${headerImage}"\n`;

      fs.writeFileSync(themePath, yml, 'utf-8');

      return sendJson(res, 200, {
        success: true,
        message: 'Theme settings updated.'
      });
    }

    // 404
    sendJson(res, 404, { error: 'Endpoint not found.' });

  } catch (err) {
    console.error('Server error:', err);
    sendJson(res, 500, { error: err.message });
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`CKSL Studio Editor Bridge Service running on http://127.0.0.1:${PORT}`);
});
