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
      <svg viewBox="0 0 120 120" fill="none" class="cksl-svg-motif" style="width: 54px; height: auto;" aria-label="Maehwa Plum Blossom">
        <circle cx="60" cy="28" r="20" fill="var(--color-red, #A62B2B)"/>
        <circle cx="90" cy="50" r="20" fill="var(--color-red, #A62B2B)"/>
        <circle cx="79" cy="87" r="20" fill="var(--color-red, #A62B2B)"/>
        <circle cx="41" cy="87" r="20" fill="var(--color-red, #A62B2B)"/>
        <circle cx="30" cy="50" r="20" fill="var(--color-red, #A62B2B)"/>
        <circle cx="60" cy="28" r="14" stroke="var(--color-yellow-gold, #E5B842)" stroke-width="1.4" fill="none" opacity="0.85"/>
        <circle cx="90" cy="50" r="14" stroke="var(--color-yellow-gold, #E5B842)" stroke-width="1.4" fill="none" opacity="0.85"/>
        <circle cx="79" cy="87" r="14" stroke="var(--color-yellow-gold, #E5B842)" stroke-width="1.4" fill="none" opacity="0.85"/>
        <circle cx="41" cy="87" r="14" stroke="var(--color-yellow-gold, #E5B842)" stroke-width="1.4" fill="none" opacity="0.85"/>
        <circle cx="30" cy="50" r="14" stroke="var(--color-yellow-gold, #E5B842)" stroke-width="1.4" fill="none" opacity="0.85"/>
        <circle cx="60" cy="60" r="14" fill="#801E1E"/>
        <circle cx="60" cy="60" r="9" fill="var(--color-red, #A62B2B)"/>
        <path d="M60 60L60 35M60 60L75 40M60 60L83 52M60 60L80 69M60 60L72 80M60 60L60 84M60 60L48 80M60 60L40 69M60 60L37 52M60 60L45 40" stroke="var(--color-yellow-gold, #E5B842)" stroke-width="1.6" stroke-linecap="round"/>
        <circle cx="60" cy="33" r="2.8" fill="var(--color-yellow-gold, #E5B842)"/>
        <circle cx="76" cy="38" r="2.8" fill="var(--color-yellow-gold, #E5B842)"/>
        <circle cx="85" cy="51" r="2.8" fill="var(--color-yellow-gold, #E5B842)"/>
        <circle cx="82" cy="71" r="2.8" fill="var(--color-yellow-gold, #E5B842)"/>
        <circle cx="73" cy="82" r="2.8" fill="var(--color-yellow-gold, #E5B842)"/>
        <circle cx="60" cy="86" r="2.8" fill="var(--color-yellow-gold, #E5B842)"/>
        <circle cx="47" cy="82" r="2.8" fill="var(--color-yellow-gold, #E5B842)"/>
        <circle cx="38" cy="71" r="2.8" fill="var(--color-yellow-gold, #E5B842)"/>
        <circle cx="35" cy="51" r="2.8" fill="var(--color-yellow-gold, #E5B842)"/>
        <circle cx="44" cy="38" r="2.8" fill="var(--color-yellow-gold, #E5B842)"/>
        <circle cx="60" cy="60" r="4.5" fill="var(--color-yellow-gold, #E5B842)"/>
      </svg>
    `,
    flower_divider: `
      <div style="display: flex; align-items: center; justify-content: center; gap: 16px; margin: 36px 0; width: 100%;">
        <svg viewBox="0 0 540 44" fill="none" class="cksl-svg-motif" style="width: 100%; max-width: 520px; height: auto;" preserveAspectRatio="xMidYMid meet">
          <line x1="10" y1="22" x2="160" y2="22" stroke="var(--color-border, #E2DDD6)" stroke-width="1.2"/>
          <path d="M160 22C175 22 182 14 190 16C198 18 204 28 216 22C222 19 226 15 234 18" stroke="var(--color-yellow-gold, #E5B842)" stroke-width="2" stroke-linecap="round"/>
          <circle cx="190" cy="14" r="2.5" fill="var(--color-yellow-gold, #E5B842)"/>
          <circle cx="216" cy="24" r="2" fill="var(--color-red, #A62B2B)"/>
          <circle cx="234" cy="16" r="2.2" fill="var(--color-yellow-gold, #E5B842)"/>
          <g transform="translate(270, 22) scale(0.28) translate(-60, -60)">
            <circle cx="60" cy="28" r="20" fill="var(--color-red, #A62B2B)"/>
            <circle cx="90" cy="50" r="20" fill="var(--color-red, #A62B2B)"/>
            <circle cx="79" cy="87" r="20" fill="var(--color-red, #A62B2B)"/>
            <circle cx="41" cy="87" r="20" fill="var(--color-red, #A62B2B)"/>
            <circle cx="30" cy="50" r="20" fill="var(--color-red, #A62B2B)"/>
            <circle cx="60" cy="28" r="14" stroke="var(--color-yellow-gold, #E5B842)" stroke-width="2" fill="none"/>
            <circle cx="90" cy="50" r="14" stroke="var(--color-yellow-gold, #E5B842)" stroke-width="2" fill="none"/>
            <circle cx="79" cy="87" r="14" stroke="var(--color-yellow-gold, #E5B842)" stroke-width="2" fill="none"/>
            <circle cx="41" cy="87" r="14" stroke="var(--color-yellow-gold, #E5B842)" stroke-width="2" fill="none"/>
            <circle cx="30" cy="50" r="14" stroke="var(--color-yellow-gold, #E5B842)" stroke-width="2" fill="none"/>
            <circle cx="60" cy="60" r="13" fill="#801E1E"/>
            <path d="M60 60L60 36M60 60L75 42M60 60L81 53M60 60L78 69M60 60L71 79M60 60L60 83M60 60L49 79M60 60L42 69M60 60L39 53M60 60L45 42" stroke="var(--color-yellow-gold, #E5B842)" stroke-width="2.5" stroke-linecap="round"/>
            <circle cx="60" cy="34" r="3.2" fill="var(--color-yellow-gold, #E5B842)"/>
            <circle cx="77" cy="40" r="3.2" fill="var(--color-yellow-gold, #E5B842)"/>
            <circle cx="83" cy="52" r="3.2" fill="var(--color-yellow-gold, #E5B842)"/>
            <circle cx="79" cy="71" r="3.2" fill="var(--color-yellow-gold, #E5B842)"/>
            <circle cx="72" cy="81" r="3.2" fill="var(--color-yellow-gold, #E5B842)"/>
            <circle cx="60" cy="85" r="3.2" fill="var(--color-yellow-gold, #E5B842)"/>
            <circle cx="48" cy="81" r="3.2" fill="var(--color-yellow-gold, #E5B842)"/>
            <circle cx="41" cy="71" r="3.2" fill="var(--color-yellow-gold, #E5B842)"/>
            <circle cx="37" cy="52" r="3.2" fill="var(--color-yellow-gold, #E5B842)"/>
            <circle cx="43" cy="40" r="3.2" fill="var(--color-yellow-gold, #E5B842)"/>
            <circle cx="60" cy="60" r="5" fill="var(--color-yellow-gold, #E5B842)"/>
          </g>
          <path d="M306 18C314 15 318 19 324 22C336 28 342 18 350 16C358 14 365 22 380 22" stroke="var(--color-yellow-gold, #E5B842)" stroke-width="2" stroke-linecap="round"/>
          <circle cx="306" cy="16" r="2.2" fill="var(--color-yellow-gold, #E5B842)"/>
          <circle cx="324" cy="24" r="2" fill="var(--color-red, #A62B2B)"/>
          <circle cx="350" cy="14" r="2.5" fill="var(--color-yellow-gold, #E5B842)"/>
          <line x1="380" y1="22" x2="530" y2="22" stroke="var(--color-border, #E2DDD6)" stroke-width="1.2"/>
        </svg>
      </div>
    `,
    hanok_roof: `
      <svg viewBox="0 0 280 40" fill="none" class="cksl-svg-motif" style="width: 200px; height: auto;" aria-label="Hanok Cheoma Eaves">
        <path d="M10 32C65 14 105 8 140 8C175 8 215 14 270 32" stroke="var(--color-yellow-gold, #E5B842)" stroke-width="3.5" stroke-linecap="round"/>
        <path d="M28 35C75 19 108 14 140 14C172 14 205 19 252 35" stroke="var(--color-red, #A62B2B)" stroke-width="2" stroke-linecap="round" opacity="0.9"/>
        <circle cx="140" cy="8" r="7" fill="var(--color-red, #A62B2B)"/>
        <circle cx="140" cy="8" r="4" fill="var(--color-yellow-gold, #E5B842)"/>
        <circle cx="140" cy="8" r="1.5" fill="var(--color-brown-deep, #4A2E1B)"/>
        <circle cx="20" cy="30" r="2.5" fill="var(--color-yellow-gold, #E5B842)"/>
        <circle cx="260" cy="30" r="2.5" fill="var(--color-yellow-gold, #E5B842)"/>
      </svg>
    `,
    title_underline: `
      <svg viewBox="0 0 160 16" fill="none" class="cksl-svg-motif" style="width: 140px; height: 16px;">
        <line x1="2" y1="8" x2="68" y2="8" stroke="var(--color-red, #A62B2B)" stroke-width="3" stroke-linecap="round"/>
        <circle cx="78" cy="8" r="5.5" fill="var(--color-red, #A62B2B)"/>
        <circle cx="78" cy="8" r="2.8" fill="var(--color-yellow-gold, #E5B842)"/>
        <circle cx="78" cy="8" r="1.2" fill="#801E1E"/>
        <line x1="88" y1="8" x2="124" y2="8" stroke="var(--color-yellow-gold, #E5B842)" stroke-width="2.2" stroke-linecap="round"/>
        <circle cx="132" cy="8" r="2.5" fill="var(--color-yellow-gold, #E5B842)"/>
        <circle cx="142" cy="8" r="1.5" fill="var(--color-red, #A62B2B)"/>
      </svg>
    `,
    cloud_unmun: `
      <svg viewBox="0 0 220 90" fill="none" class="cksl-svg-motif" style="width: 160px; height: auto;" aria-label="Auspicious Cloud Unmun">
        <path d="M30 65C18 65 8 55 10 42C12 28 28 22 40 28C46 14 66 10 82 18C92 8 114 8 126 18C138 10 156 14 162 26C174 24 186 32 184 44C182 54 170 60 158 60L130 60C140 54 142 42 134 34C126 26 112 28 106 36C100 28 86 28 80 34C74 26 60 28 54 36C48 30 38 34 36 42C34 50 42 56 50 56L50 65L30 65Z" fill="var(--color-red, #A62B2B)" opacity="0.12"/>
        <path d="M30 65C18 65 8 55 10 42C12 28 28 22 40 28C46 14 66 10 82 18C92 8 114 8 126 18C138 10 156 14 162 26C174 24 186 32 184 44C182 54 170 60 158 60" stroke="var(--color-red, #A62B2B)" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M48 42C44 34 54 28 62 34C70 40 68 50 58 52" stroke="var(--color-yellow-gold, #E5B842)" stroke-width="2" stroke-linecap="round"/>
        <path d="M78 36C74 28 86 22 94 28C102 34 100 46 88 48" stroke="var(--color-yellow-gold, #E5B842)" stroke-width="2" stroke-linecap="round"/>
        <path d="M118 34C114 26 128 22 136 28C144 34 140 46 128 48" stroke="var(--color-yellow-gold, #E5B842)" stroke-width="2" stroke-linecap="round"/>
        <path d="M168 46C182 46 195 40 206 42" stroke="var(--color-red, #A62B2B)" stroke-width="2.2" stroke-linecap="round"/>
        <circle cx="214" cy="42" r="3" fill="var(--color-red, #A62B2B)"/>
        <path d="M158 58C174 58 188 64 200 62" stroke="var(--color-yellow-gold, #E5B842)" stroke-width="2" stroke-linecap="round"/>
        <circle cx="208" cy="62" r="3.2" fill="var(--color-yellow-gold, #E5B842)"/>
      </svg>
    `,
    pavilion: `
      <div style="display: inline-flex; align-items: center; justify-content: center; width: 84px; height: 84px; background: rgba(166, 43, 43, 0.05); border: 1.5px solid var(--color-border, #E2DDD6); border-radius: 12px; padding: 6px;">
        <svg viewBox="0 0 80 80" fill="none" class="cksl-svg-motif" style="width: 72px; height: 72px;" aria-label="Hanok Palace Pavilion">
          <circle cx="40" cy="14" r="3.5" fill="var(--color-yellow-gold, #E5B842)"/>
          <path d="M8 32C24 23 33 18 40 18C47 18 56 23 72 32L65 37H15L8 32Z" fill="var(--color-red, #A62B2B)"/>
          <path d="M8 32C24 23 33 18 40 18C47 18 56 23 72 32" stroke="var(--color-yellow-gold, #E5B842)" stroke-width="2.5" stroke-linecap="round"/>
          <line x1="22" y1="37" x2="22" y2="42" stroke="var(--color-brown-deep, #4A2E1B)" stroke-width="2"/>
          <line x1="34" y1="37" x2="34" y2="42" stroke="var(--color-brown-deep, #4A2E1B)" stroke-width="2"/>
          <line x1="46" y1="37" x2="46" y2="42" stroke="var(--color-brown-deep, #4A2E1B)" stroke-width="2"/>
          <line x1="58" y1="37" x2="58" y2="42" stroke="var(--color-brown-deep, #4A2E1B)" stroke-width="2"/>
          <line x1="16" y1="42" x2="64" y2="42" stroke="var(--color-yellow-gold, #E5B842)" stroke-width="2.5"/>
          <line x1="22" y1="42" x2="22" y2="62" stroke="var(--color-brown-deep, #4A2E1B)" stroke-width="3" stroke-linecap="round"/>
          <line x1="34" y1="42" x2="34" y2="62" stroke="var(--color-brown-deep, #4A2E1B)" stroke-width="2.8" stroke-linecap="round"/>
          <line x1="46" y1="42" x2="46" y2="62" stroke="var(--color-brown-deep, #4A2E1B)" stroke-width="2.8" stroke-linecap="round"/>
          <line x1="58" y1="42" x2="58" y2="62" stroke="var(--color-brown-deep, #4A2E1B)" stroke-width="3" stroke-linecap="round"/>
          <rect x="12" y="62" width="56" height="5" fill="#C5BAAF" stroke="var(--color-brown-deep, #4A2E1B)" stroke-width="1.5" rx="1"/>
          <rect x="8" y="67" width="64" height="5" fill="#8C827A" rx="1"/>
        </svg>
      </div>
    `,
    dancheong_corner: `
      <svg viewBox="0 0 60 60" fill="none" class="cksl-svg-motif" style="width: 52px; height: 52px;" aria-label="Dancheong Meander Corner Fret">
        <path d="M4 56V8C4 5.8 5.8 4 8 4H56" stroke="var(--color-red, #A62B2B)" stroke-width="3.5" stroke-linecap="square"/>
        <path d="M12 56V12H56" stroke="var(--color-yellow-gold, #E5B842)" stroke-width="2.5" stroke-linecap="square"/>
        <path d="M20 56V20H46V36H32V28H40" stroke="var(--color-red, #A62B2B)" stroke-width="2.5" stroke-linecap="square"/>
        <rect x="25" y="42" width="7" height="7" fill="var(--color-yellow-gold, #E5B842)"/>
      </svg>
    `,
    korean_fan: `
      <svg viewBox="0 0 140 100" fill="none" class="cksl-svg-motif" style="width: 110px; height: auto;" aria-label="Traditional Korean Folding Fan">
        <path d="M14 62C26 30 64 16 70 16C76 16 114 30 126 62L70 80L14 62Z" fill="var(--color-red, #A62B2B)" opacity="0.15"/>
        <path d="M14 62C26 30 64 16 70 16C76 16 114 30 126 62" stroke="var(--color-red, #A62B2B)" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="70" y1="80" x2="16" y2="60" stroke="var(--color-red, #A62B2B)" stroke-width="1.8"/>
        <line x1="70" y1="80" x2="30" y2="44" stroke="var(--color-red, #A62B2B)" stroke-width="1.6"/>
        <line x1="70" y1="80" x2="48" y2="28" stroke="var(--color-red, #A62B2B)" stroke-width="1.6"/>
        <line x1="70" y1="80" x2="70" y2="18" stroke="var(--color-yellow-gold, #E5B842)" stroke-width="2"/>
        <line x1="70" y1="80" x2="92" y2="28" stroke="var(--color-red, #A62B2B)" stroke-width="1.6"/>
        <line x1="70" y1="80" x2="110" y2="44" stroke="var(--color-red, #A62B2B)" stroke-width="1.6"/>
        <line x1="70" y1="80" x2="124" y2="60" stroke="var(--color-red, #A62B2B)" stroke-width="1.8"/>
        <path d="M22 55Q44 42 70 42Q96 42 118 55" stroke="var(--color-yellow-gold, #E5B842)" stroke-width="1.4" stroke-dasharray="3 3"/>
        <circle cx="70" cy="80" r="4.5" fill="var(--color-yellow-gold, #E5B842)"/>
        <circle cx="70" cy="80" r="2" fill="#801E1E"/>
        <line x1="70" y1="84.5" x2="70" y2="92" stroke="var(--color-red, #A62B2B)" stroke-width="2"/>
        <circle cx="70" cy="94" r="2.8" fill="var(--color-yellow-gold, #E5B842)"/>
        <path d="M67 96L65 106M70 96L70 107M73 96L75 106" stroke="var(--color-red, #A62B2B)" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
    `,
    lotus_blossom: `
      <svg viewBox="0 0 100 100" fill="none" class="cksl-svg-motif" style="width: 72px; height: 72px;" aria-label="Seigaiha Wave Medallion">
        <circle cx="50" cy="50" r="47" stroke="var(--color-border, #E2DDD6)" stroke-width="2"/>
        <circle cx="50" cy="50" r="44" stroke="var(--color-yellow-gold, #E5B842)" stroke-width="1.8"/>
        <g>
          <circle cx="50" cy="20" r="18" stroke="var(--color-red, #A62B2B)" stroke-width="1.8" fill="none"/>
          <circle cx="50" cy="20" r="12" stroke="var(--color-yellow-gold, #E5B842)" stroke-width="1.5" fill="none"/>
          <circle cx="50" cy="20" r="6" stroke="var(--color-red, #A62B2B)" stroke-width="1.5" fill="none"/>
          <circle cx="20" cy="45" r="18" stroke="var(--color-red, #A62B2B)" stroke-width="1.8" fill="none"/>
          <circle cx="20" cy="45" r="12" stroke="var(--color-yellow-gold, #E5B842)" stroke-width="1.5" fill="none"/>
          <circle cx="20" cy="45" r="6" stroke="var(--color-red, #A62B2B)" stroke-width="1.5" fill="none"/>
          <circle cx="80" cy="45" r="18" stroke="var(--color-red, #A62B2B)" stroke-width="1.8" fill="none"/>
          <circle cx="80" cy="45" r="12" stroke="var(--color-yellow-gold, #E5B842)" stroke-width="1.5" fill="none"/>
          <circle cx="80" cy="45" r="6" stroke="var(--color-red, #A62B2B)" stroke-width="1.5" fill="none"/>
          <circle cx="50" cy="70" r="18" stroke="var(--color-red, #A62B2B)" stroke-width="1.8" fill="none"/>
          <circle cx="50" cy="70" r="12" stroke="var(--color-yellow-gold, #E5B842)" stroke-width="1.5" fill="none"/>
          <circle cx="50" cy="70" r="6" stroke="var(--color-red, #A62B2B)" stroke-width="1.5" fill="none"/>
        </g>
      </svg>
    `,
    korean_seal: `
      <div style="display: inline-flex; align-items: center; justify-content: center; width: 48px; height: 48px; border: 2.5px solid var(--color-red, #A62B2B); border-radius: 4px; background: rgba(166, 43, 43, 0.06); font-family: 'Noto Serif KR', serif; font-size: 0.86rem; font-weight: 700; color: var(--color-red, #A62B2B); letter-spacing: 0.05em; text-align: center; line-height: 1.15; box-shadow: inset 0 0 0 1.5px rgba(166, 43, 43, 0.25), 0 2px 6px rgba(166, 43, 43, 0.15);">
        한국<br>학연
      </div>
    `,
    cloud_bars: `
      <div style="display: flex; justify-content: center; margin: 16px 0; width: 100%;">
        <svg viewBox="0 0 160 50" fill="none" class="cksl-svg-motif" style="width: 140px; height: auto;" aria-label="Horizontal Stylized Clouds">
          <rect x="20" y="8" width="110" height="12" rx="6" fill="var(--color-red, #A62B2B)"/>
          <rect x="50" y="8" width="50" height="12" rx="6" fill="var(--color-yellow-gold, #E5B842)"/>
          <circle cx="14" cy="14" r="4.5" fill="var(--color-red, #A62B2B)"/>
          <circle cx="140" cy="14" r="3.5" fill="var(--color-yellow-gold, #E5B842)"/>
          <rect x="35" y="28" width="95" height="12" rx="6" fill="var(--color-red, #A62B2B)"/>
          <rect x="65" y="28" width="40" height="12" rx="6" fill="var(--color-yellow-gold, #E5B842)"/>
          <circle cx="24" cy="34" r="3.5" fill="var(--color-yellow-gold, #E5B842)"/>
          <circle cx="142" cy="34" r="5" fill="var(--color-red, #A62B2B)"/>
          <circle cx="152" cy="34" r="2.5" fill="var(--color-red, #A62B2B)"/>
        </svg>
      </div>
    `,
    palace_lantern: `
      <div style="display: inline-flex; justify-content: center; margin: 12px 0;">
        <svg viewBox="0 0 70 120" fill="none" class="cksl-svg-motif" style="width: 50px; height: auto;" aria-label="Joseon Silk Lantern">
          <circle cx="35" cy="10" r="5" stroke="var(--color-yellow-gold, #E5B842)" stroke-width="2" fill="none"/>
          <line x1="35" y1="15" x2="35" y2="24" stroke="var(--color-red, #A62B2B)" stroke-width="2"/>
          <rect x="22" y="24" width="26" height="5" rx="2" fill="var(--color-red, #A62B2B)"/>
          <ellipse cx="35" cy="56" rx="26" ry="28" fill="var(--color-red, #A62B2B)" opacity="0.15"/>
          <ellipse cx="35" cy="56" rx="26" ry="28" stroke="var(--color-red, #A62B2B)" stroke-width="2.5"/>
          <path d="M35 28C22 36 22 76 35 84" stroke="var(--color-yellow-gold, #E5B842)" stroke-width="1.8" fill="none"/>
          <path d="M35 28C48 36 48 76 35 84" stroke="var(--color-yellow-gold, #E5B842)" stroke-width="1.8" fill="none"/>
          <line x1="35" y1="28" x2="35" y2="84" stroke="var(--color-yellow-gold, #E5B842)" stroke-width="2"/>
          <ellipse cx="35" cy="56" rx="26" ry="12" stroke="var(--color-yellow-gold, #E5B842)" stroke-width="1.4" stroke-dasharray="3 3"/>
          <rect x="22" y="84" width="26" height="5" rx="2" fill="var(--color-red, #A62B2B)"/>
          <circle cx="35" cy="94" r="3.5" fill="var(--color-yellow-gold, #E5B842)"/>
          <circle cx="35" cy="102" r="2.8" fill="var(--color-red, #A62B2B)"/>
          <path d="M31 106L30 118M35 106L35 119M39 106L40 118" stroke="var(--color-red, #A62B2B)" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </div>
    `,
    shippo_lattice: `
      <div style="display: flex; justify-content: center; margin: 18px 0;">
        <svg viewBox="0 0 100 100" fill="none" class="cksl-svg-motif" style="width: 72px; height: auto;" aria-label="Shippo Lattice Medallion">
          <circle cx="50" cy="50" r="48" stroke="var(--color-border, #E2DDD6)" stroke-width="2"/>
          <circle cx="50" cy="50" r="45" stroke="var(--color-yellow-gold, #E5B842)" stroke-width="2"/>
          <circle cx="50" cy="50" r="24" stroke="var(--color-red, #A62B2B)" stroke-width="1.8" fill="none"/>
          <circle cx="26" cy="50" r="24" stroke="var(--color-red, #A62B2B)" stroke-width="1.8" fill="none"/>
          <circle cx="74" cy="50" r="24" stroke="var(--color-red, #A62B2B)" stroke-width="1.8" fill="none"/>
          <circle cx="50" cy="26" r="24" stroke="var(--color-red, #A62B2B)" stroke-width="1.8" fill="none"/>
          <circle cx="50" cy="74" r="24" stroke="var(--color-red, #A62B2B)" stroke-width="1.8" fill="none"/>
          <circle cx="26" cy="26" r="24" stroke="var(--color-yellow-gold, #E5B842)" stroke-width="1.4" fill="none"/>
          <circle cx="74" cy="26" r="24" stroke="var(--color-yellow-gold, #E5B842)" stroke-width="1.4" fill="none"/>
          <circle cx="26" cy="74" r="24" stroke="var(--color-yellow-gold, #E5B842)" stroke-width="1.4" fill="none"/>
          <circle cx="74" cy="74" r="24" stroke="var(--color-yellow-gold, #E5B842)" stroke-width="1.4" fill="none"/>
          <circle cx="50" cy="50" r="3.5" fill="var(--color-yellow-gold, #E5B842)"/>
        </svg>
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
    setupReplaceMotifModal();
    setupReplaceImageModal();
    setupDragAndDrop();
    checkBridgeStatus();
    window.addEventListener('resize', fitCanvasToScreen);
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
    scanPageMotifs();
    setupDragAndDrop();
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
    // Refit canvas dynamically when sidebar or ribbon geometry changes
    requestAnimationFrame(fitCanvasToScreen);
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
      badge.className = 'ribbon-draft-dot';
      badge.innerHTML = '';
      if (isDraft) {
        badge.style.background = '#10B981';
        badge.title = `Draft Session (${branch}) — Main is safe`;
      } else {
        badge.style.background = '#9CA3AF';
        badge.title = `Branch: ${branch}`;
      }
    }
  }

  // Save current page changes into draft-session markdown file via background service
  async function saveCurrentPageDraft() {
    const saveBtn = document.getElementById('cksl-btn-save-draft');
    const origHtml = saveBtn ? saveBtn.innerHTML : '';
    if (saveBtn) {
      saveBtn.disabled = true;
      saveBtn.innerHTML = `<span>Saving...</span>`;
    }

    try {
      // 1. Gather hero fields if present on this page
      const heroData = {};
      const heroTitleEl = document.querySelector('.hero-title') || document.querySelector('.home-hero-title');
      if (heroTitleEl) heroData.title = heroTitleEl.innerText.trim();

      const heroKickerEl = document.querySelector('.hero-kicker') || document.querySelector('.hero-tag') || document.querySelector('.home-hero-tag');
      if (heroKickerEl) heroData.kicker = heroKickerEl.innerText.trim();

      const heroSubEl = document.querySelector('.hero-subtitle') || document.querySelector('.home-hero-lead');
      if (heroSubEl) heroData.subtitle = heroSubEl.innerText.trim();

      const heroImgEl = document.querySelector('.home-hero-img') || document.querySelector('.hero-img');
      if (heroImgEl) {
        let src = heroImgEl.getAttribute('src') || heroImgEl.src;
        if (src.includes('/images/')) {
          src = '/images/' + src.split('/images/')[1];
        }
        heroData.image = src;
        heroData.crop = heroImgEl.style.objectPosition || 'center 32%';
      }

      // 2. Gather main content HTML
      const mainEl = document.getElementById('main-content') || document.querySelector('main');
      let contentHtml = '';
      if (mainEl) {
        const clone = mainEl.cloneNode(true);
        // Clean clone of all editor artifacts
        clone.querySelectorAll('[contenteditable]').forEach(el => el.removeAttribute('contenteditable'));
        clone.querySelectorAll('[data-cksl-editable]').forEach(el => el.removeAttribute('data-cksl-editable'));
        clone.querySelectorAll('[spellcheck]').forEach(el => el.removeAttribute('spellcheck'));
        clone.querySelectorAll('[data-cksl-box-selected]').forEach(el => el.removeAttribute('data-cksl-box-selected'));
        clone.querySelectorAll('.cksl-resize-handle').forEach(el => el.remove());
        clone.querySelectorAll('.cksl-motif-toolbar').forEach(el => el.remove());
        clone.querySelectorAll('.cksl-box-toolbar').forEach(el => el.remove());
        clone.querySelectorAll('#cksl-bounding-box').forEach(el => el.remove());
        clone.querySelectorAll('.inspector-drag-cue').forEach(el => el.remove());

        contentHtml = clone.innerHTML;
      }

      const res = await fetch(`${API_BASE}/api/page/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pageUrl: window.location.pathname,
          contentHtml,
          heroData
        })
      });

      const data = await res.json();
      if (data.success) {
        if (saveBtn) {
          saveBtn.innerHTML = `<span>Saved to Draft!</span>`;
          saveBtn.style.background = '#059669';
          setTimeout(() => {
            saveBtn.innerHTML = origHtml;
            saveBtn.style.background = '';
            saveBtn.disabled = false;
          }, 2400);
        }
        updateDraftBadge('draft-session', true);
      } else {
        alert('Save notice: ' + (data.error || 'Failed to save to draft'));
        if (saveBtn) {
          saveBtn.innerHTML = origHtml;
          saveBtn.disabled = false;
        }
      }
    } catch (err) {
      console.error(err);
      alert('Could not connect to editor background service. Please ensure the local service is running on port 4005.');
      if (saveBtn) {
        saveBtn.innerHTML = origHtml;
        saveBtn.disabled = false;
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
  let savedSelectionRange = null;

  function setupTextSelectionToolbar() {
    const toolbar = document.getElementById('cksl-text-selection-toolbar');
    if (!toolbar) return;

    // Track selection changes across the document
    document.addEventListener('selectionchange', handleSelectionChange);

    // Also update position when viewport scrolls
    const viewport = document.getElementById('cksl-canvas-viewport');
    if (viewport) {
      viewport.addEventListener('scroll', () => {
        if (!toolbar.classList.contains('hidden') && savedSelectionRange) {
          positionSelectionToolbar(savedSelectionRange);
        }
        if (activeBox) {
          positionInspector(activeBox);
        }
      }, { passive: true });
    }

    // Prevent button/select/input clicks from collapsing the text selection
    toolbar.querySelectorAll('button, select, input, span').forEach(ctrl => {
      ctrl.addEventListener('mousedown', (e) => {
        e.preventDefault();
      });
    });

    // Font Family dropdown
    const fontSelect = document.getElementById('cksl-sel-font-family');
    if (fontSelect) {
      fontSelect.addEventListener('change', (e) => {
        applySelectionFontFamily(e.target.value);
      });
    }

    // Font Size dropdown
    const sizeSelect = document.getElementById('cksl-sel-font-size');
    if (sizeSelect) {
      sizeSelect.addEventListener('change', (e) => {
        applySelectionFontSize(e.target.value);
      });
    }

    // Color picker
    const colorPicker = document.getElementById('cksl-sel-color-picker');
    if (colorPicker) {
      colorPicker.addEventListener('input', (e) => {
        restoreSelection();
        document.execCommand('foreColor', false, e.target.value);
        const sel = window.getSelection();
        if (sel && sel.rangeCount > 0) {
          savedSelectionRange = sel.getRangeAt(0).cloneRange();
        }
      });
    }

    // Formatting action buttons on floating bubble
    toolbar.querySelectorAll('[data-cmd]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        restoreSelection();

        const cmd = btn.getAttribute('data-cmd');
        const val = btn.getAttribute('data-val') || null;
        const step = btn.getAttribute('data-step');

        if (cmd === 'fontSizeStep') {
          adjustSelectionFontSize(parseInt(step, 10) || 2);
        } else if (cmd === 'foreColor') {
          document.execCommand('foreColor', false, val);
        } else if (cmd === 'hiliteColor') {
          document.execCommand('hiliteColor', false, val);
        } else if (cmd === 'formatBlock') {
          document.execCommand('formatBlock', false, val);
        } else {
          document.execCommand(cmd, false, val);
        }

        // Re-save range and reposition toolbar without hiding it
        const sel = window.getSelection();
        if (sel && sel.rangeCount > 0) {
          savedSelectionRange = sel.getRangeAt(0).cloneRange();
          positionSelectionToolbar(savedSelectionRange);
        }
        updateSelectionToolbarState();
      });
    });

    // Link insertion
    const linkBtn = document.getElementById('cksl-sel-btn-link');
    if (linkBtn) {
      linkBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        restoreSelection();
        const url = prompt('Enter link URL (e.g. /about/ or https://example.com):', 'https://');
        if (url) {
          document.execCommand('createLink', false, url);
        }
      });
    }

    // Word Ribbon Document Shelf Buttons (#pane-document)
    const docPane = document.getElementById('pane-document');
    if (docPane) {
      docPane.querySelectorAll('button, input').forEach(ctrl => {
        ctrl.addEventListener('mousedown', (e) => {
          e.preventDefault();
        });
      });

      docPane.querySelectorAll('[data-doc-cmd]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          restoreSelection();

          const cmd = btn.getAttribute('data-doc-cmd');
          const val = btn.getAttribute('data-val') || null;
          const step = btn.getAttribute('data-step');

          if (cmd === 'fontSizeStep') {
            adjustSelectionFontSize(parseInt(step, 10) || 2);
          } else if (cmd === 'fontFamily') {
            applySelectionFontFamily(val);
          } else if (cmd === 'foreColor') {
            document.execCommand('foreColor', false, val);
          } else if (cmd === 'formatBlock') {
            document.execCommand('formatBlock', false, val);
          } else {
            document.execCommand(cmd, false, val);
          }
        });
      });

      const ribbonColorPicker = document.getElementById('cksl-ribbon-color-picker');
      if (ribbonColorPicker) {
        ribbonColorPicker.addEventListener('input', (e) => {
          restoreSelection();
          document.execCommand('foreColor', false, e.target.value);
        });
      }

      const ribbonLinkBtn = document.getElementById('cksl-ribbon-btn-link');
      if (ribbonLinkBtn) {
        ribbonLinkBtn.addEventListener('click', () => {
          restoreSelection();
          const url = prompt('Enter link URL (e.g. /about/ or https://example.com):', 'https://');
          if (url) document.execCommand('createLink', false, url);
        });
      }
    }
  }

  function restoreSelection() {
    if (!savedSelectionRange) return false;
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(savedSelectionRange);
    return true;
  }

  function applySelectionFontFamily(fontFamily) {
    if (!fontFamily) return;
    restoreSelection();
    const sel = window.getSelection();
    if (!sel || !sel.rangeCount || sel.isCollapsed) return;

    const range = sel.getRangeAt(0);
    const span = document.createElement('span');
    span.style.fontFamily = fontFamily;
    try {
      span.appendChild(range.extractContents());
      range.insertNode(span);
      const newRange = document.createRange();
      newRange.selectNodeContents(span);
      sel.removeAllRanges();
      sel.addRange(newRange);
      savedSelectionRange = newRange.cloneRange();
      positionSelectionToolbar(newRange);
    } catch (e) {
      document.execCommand('fontName', false, fontFamily);
    }
  }

  function applySelectionFontSize(sizePx) {
    if (!sizePx) return;
    restoreSelection();
    const sel = window.getSelection();
    if (!sel || !sel.rangeCount || sel.isCollapsed) return;

    const range = sel.getRangeAt(0);
    const span = document.createElement('span');
    span.style.fontSize = sizePx;
    try {
      span.appendChild(range.extractContents());
      range.insertNode(span);
      const newRange = document.createRange();
      newRange.selectNodeContents(span);
      sel.removeAllRanges();
      sel.addRange(newRange);
      savedSelectionRange = newRange.cloneRange();
      positionSelectionToolbar(newRange);
    } catch (e) {
      document.execCommand('fontSize', false, '3');
    }
  }

  function adjustSelectionFontSize(deltaPx) {
    restoreSelection();
    const sel = window.getSelection();
    if (!sel || !sel.rangeCount || sel.isCollapsed) return;

    const range = sel.getRangeAt(0);
    const parent = range.commonAncestorContainer.nodeType === 1 
      ? range.commonAncestorContainer 
      : range.commonAncestorContainer.parentElement;

    const curSize = parseInt(window.getComputedStyle(parent).fontSize, 10) || 16;
    const newSize = Math.max(10, Math.min(96, curSize + deltaPx));

    const span = document.createElement('span');
    span.style.fontSize = `${newSize}px`;
    try {
      span.appendChild(range.extractContents());
      range.insertNode(span);
      const newRange = document.createRange();
      newRange.selectNodeContents(span);
      sel.removeAllRanges();
      sel.addRange(newRange);
      savedSelectionRange = newRange.cloneRange();
      positionSelectionToolbar(newRange);
    } catch (e) {
      document.execCommand('fontSize', false, deltaPx > 0 ? '4' : '2');
    }
  }

  function handleSelectionChange() {
    if (!isEditing) return;

    const toolbar = document.getElementById('cksl-text-selection-toolbar');
    if (!toolbar) return;

    // If active element is inside the toolbar, don't hide
    if (document.activeElement && document.activeElement.closest('#cksl-text-selection-toolbar')) {
      return;
    }

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

    savedSelectionRange = range.cloneRange();
    positionSelectionToolbar(range);
    updateSelectionToolbarState();
  }

  function positionSelectionToolbar(range) {
    const toolbar = document.getElementById('cksl-text-selection-toolbar');
    if (!toolbar || !range) return;

    const rect = range.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) {
      hideTextSelectionToolbar();
      return;
    }

    toolbar.classList.remove('hidden');
    const tbWidth = toolbar.offsetWidth || 440;
    const tbHeight = toolbar.offsetHeight || 38;

    const sidebar = document.getElementById('cksl-sidebar');
    const sidebarOffset = (sidebar && !sidebar.classList.contains('hidden')) ? (sidebar.offsetWidth || 260) : 0;

    let left = rect.left + (rect.width / 2) - (tbWidth / 2);
    let top = rect.top - tbHeight - 10;

    // Bounds checking inside viewport and avoiding sidebar collision
    if (left < sidebarOffset + 12) left = sidebarOffset + 12;
    if (left + tbWidth > window.innerWidth - 12) left = window.innerWidth - tbWidth - 12;
    if (top < 110) top = rect.bottom + 12; // flip below if ribbon is overhead

    toolbar.style.left = `${left}px`;
    toolbar.style.top = `${top}px`;
  }

  function hideTextSelectionToolbar() {
    const toolbar = document.getElementById('cksl-text-selection-toolbar');
    if (toolbar) toolbar.classList.add('hidden');
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

    // Device View Buttons (top quick toggle + shelf 6 buttons)
    document.querySelectorAll('.cksl-device-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const dev = btn.getAttribute('data-device');
        setDeviceMode(dev);
      });
    });

    // Canvas Scaling & Zoom Buttons (Shelf 6)
    document.querySelectorAll('.cksl-zoom-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const zoomVal = btn.getAttribute('data-zoom');
        setCanvasZoom(zoomVal);
        document.querySelectorAll('.cksl-zoom-btn').forEach(b => b.classList.remove('active'));
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

    // Save draft
    const saveBtn = document.getElementById('cksl-btn-save-draft');
    if (saveBtn) saveBtn.addEventListener('click', saveCurrentPageDraft);

    // Merge & Publish
    const pubBtn = document.getElementById('cksl-btn-publish-draft') || document.getElementById('cksl-btn-publish-open');
    if (pubBtn) pubBtn.addEventListener('click', mergeAndPublishDraft);

    // Discard Draft
    const discardBtn = document.getElementById('cksl-btn-discard-draft');
    if (discardBtn) discardBtn.addEventListener('click', discardDraftSession);

    // Quick Insert Motifs in shelf 3
    document.querySelectorAll('[data-insert-motif]').forEach(btn => {
      btn.addEventListener('click', () => {
        const motif = btn.getAttribute('data-insert-motif');
        insertMotifWidget(motif);
      });
    });
  }

  function toggleRibbon() {
    isRibbonCollapsed = !isRibbonCollapsed;
    const ribbon = document.getElementById('cksl-ribbon');
    if (ribbon) ribbon.classList.toggle('collapsed', isRibbonCollapsed);
    updateLayoutVariables();
  }

  let canvasZoomSetting = 'fit';

  function setDeviceMode(mode) {
    currentDevice = mode || 'desktop';
    const viewport = document.getElementById('cksl-canvas-viewport');
    const pageFrame = document.getElementById('cksl-page-frame');
    if (!viewport || !pageFrame) return;

    // Synchronize all device toggle buttons
    document.querySelectorAll('.cksl-device-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-device') === currentDevice);
    });

    viewport.className = `device-${currentDevice}`;

    // Hide any open floating context inspector
    if (typeof hideInspector === 'function') hideInspector();
    const selToolbar = document.getElementById('cksl-text-selection-toolbar');
    if (selToolbar) selToolbar.style.display = 'none';

    // Auto-fit or zoom the canvas
    fitCanvasToScreen();

    // Scroll viewport cleanly to top
    viewport.scrollTop = 0;
  }

  function setCanvasZoom(zoom) {
    canvasZoomSetting = zoom;
    fitCanvasToScreen();
  }

  function fitCanvasToScreen() {
    const viewport = document.getElementById('cksl-canvas-viewport');
    const pageFrame = document.getElementById('cksl-page-frame');
    if (!viewport || !pageFrame) return;

    if (currentDevice === 'desktop') {
      pageFrame.style.zoom = '1';
      pageFrame.style.transform = '';
      return;
    }

    if (canvasZoomSetting !== 'fit') {
      const numZoom = parseFloat(canvasZoomSetting) || 1;
      pageFrame.style.zoom = String(numZoom);
      if (window.getComputedStyle(pageFrame).zoom === '1' && numZoom !== 1) {
        pageFrame.style.transform = `scale(${numZoom})`;
        pageFrame.style.transformOrigin = 'top center';
      } else {
        pageFrame.style.transform = '';
      }
      return;
    }

    // Auto-Fit mode: calculate scale factor based on available viewport width
    const targetWidth = (currentDevice === 'laptop') ? 1024 : 390;
    const padding = (currentDevice === 'laptop') ? 56 : 36;
    const availableWidth = viewport.clientWidth - padding;

    if (availableWidth > 0 && availableWidth < targetWidth) {
      const scale = Math.min(1, Math.max(0.35, +(availableWidth / targetWidth).toFixed(4)));
      pageFrame.style.zoom = String(scale);
      if (window.getComputedStyle(pageFrame).zoom === '1' && scale < 0.99) {
        pageFrame.style.transform = `scale(${scale})`;
        pageFrame.style.transformOrigin = 'top center';
      } else {
        pageFrame.style.transform = '';
      }
    } else {
      pageFrame.style.zoom = '1';
      pageFrame.style.transform = '';
    }
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
        if (tabKey === 'motifs') scanPageMotifs();
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

    // Initial scan of motifs
    scanPageMotifs();
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

    // Top Navigation Item in outline
    const navItem = document.createElement('div');
    navItem.className = 'cksl-tree-item cksl-tree-navbar';
    navItem.style.cssText = 'border-bottom: 1px solid rgba(255,255,255,0.12); padding-bottom: 6px; margin-bottom: 6px; background: rgba(255,255,255,0.03);';
    navItem.innerHTML = `
      <span class="cksl-tree-item-title" style="font-weight: 700; color: #FAF8F5;">Top Navigation Bar</span>
      <div class="cksl-tree-item-actions">
        <button type="button" class="cksl-tree-action-btn" id="cksl-outline-edit-nav-btn" title="Edit Navbar Links" style="font-size: 0.72rem; padding: 2px 7px; color: var(--color-yellow-gold, #E5B842); border-color: rgba(229,184,66,0.3);">Edit</button>
      </div>
    `;
    navItem.querySelector('#cksl-outline-edit-nav-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      openNavigationManager();
    });
    navItem.addEventListener('click', () => {
      const navbar = document.querySelector('.navbar');
      if (navbar) {
        navbar.scrollIntoView({ behavior: 'smooth', block: 'start' });
        selectBox(navbar);
      }
    });
    list.appendChild(navItem);

    const sections = document.querySelectorAll('#cksl-page-frame section, #cksl-page-frame .block-section, #cksl-page-frame .page-content-wrapper > *');
    let validCount = 0;

    sections.forEach((sec, idx) => {
      if (sec.id === 'cksl-ribbon' || sec.id === 'cksl-sidebar' || sec.id === 'cksl-floating-inspector' || sec.classList.contains('cksl-modal-overlay') || sec.tagName.toLowerCase() === 'header' || sec.tagName.toLowerCase() === 'footer') return;

      validCount++;
      const titleEl = sec.querySelector('h1, h2, h3, .section-title, .subsection-title');
      const title = titleEl ? titleEl.textContent.trim() : `Section Block ${validCount}`;

      const item = document.createElement('div');
      item.className = 'cksl-tree-item';
      item.setAttribute('draggable', 'true');
      item.innerHTML = `
        <span class="cksl-tree-grip" title="Drag to reorder" style="cursor: grab; color: #6B7280; margin-right: 4px; user-select: none;">⠿</span>
        <span class="cksl-tree-item-title">${idx + 1}. ${title}</span>
        <div class="cksl-tree-item-actions">
          <button type="button" class="cksl-tree-action-btn" data-act="up" title="Move Up">▲</button>
          <button type="button" class="cksl-tree-action-btn" data-act="down" title="Move Down">▼</button>
          <button type="button" class="cksl-tree-action-btn" data-act="del" title="Delete" style="color: #EF4444;">✕</button>
        </div>
      `;

      item.addEventListener('dragstart', (e) => {
        draggedTreeItem = item;
        draggedTreeSec = sec;
        item.classList.add('cksl-sidebar-dragging');
        e.dataTransfer.setData('text/plain', 'tree');
      });
      item.addEventListener('dragend', () => {
        item.classList.remove('cksl-sidebar-dragging');
        document.querySelectorAll('.cksl-tree-item').forEach(it => it.classList.remove('cksl-drop-target-above', 'cksl-drop-target-below'));
        draggedTreeItem = null;
        draggedTreeSec = null;
      });
      item.addEventListener('dragover', (e) => {
        if (!draggedTreeItem || draggedTreeItem === item) return;
        e.preventDefault();
        const rect = item.getBoundingClientRect();
        if (e.clientY < rect.top + rect.height / 2) {
          item.classList.add('cksl-drop-target-above');
          item.classList.remove('cksl-drop-target-below');
        } else {
          item.classList.add('cksl-drop-target-below');
          item.classList.remove('cksl-drop-target-above');
        }
      });
      item.addEventListener('dragleave', () => {
        item.classList.remove('cksl-drop-target-above', 'cksl-drop-target-below');
      });
      item.addEventListener('drop', (e) => {
        if (!draggedTreeItem || draggedTreeItem === item) return;
        e.preventDefault();
        const isAbove = item.classList.contains('cksl-drop-target-above');
        item.classList.remove('cksl-drop-target-above', 'cksl-drop-target-below');
        if (isAbove) {
          sec.parentNode.insertBefore(draggedTreeSec, sec);
        } else {
          sec.parentNode.insertBefore(draggedTreeSec, sec.nextSibling);
        }
        buildSidebarOutline();
        scanPageMotifs();
        selectBox(draggedTreeSec);
        showNotification('Section reordered');
      });

      item.addEventListener('click', (e) => {
        if (e.target.closest('.cksl-tree-action-btn') || e.target.closest('.cksl-tree-grip')) return;
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
        sec.remove();
        buildSidebarOutline();
        hideInspector();
        showNotification('Section removed');
      });

      list.appendChild(item);
    });

    if (countBadge) countBadge.textContent = `${validCount} sections`;
    scanPageMotifs();
  }

  let currentReplacingMotifEl = null;
  let currentReplacingImgEl = null;

  // Scan and populate the Motifs On This Page list in BOTH sidebar and top ribbon
  function scanPageMotifs() {
    const sidebarContainer = document.getElementById('cksl-page-motifs-list');
    const sidebarCountBadge = document.getElementById('cksl-page-motifs-count');
    const ribbonContainer = document.getElementById('cksl-ribbon-page-motifs');
    const ribbonCountBadge = document.getElementById('cksl-ribbon-motifs-count');

    const motifEls = Array.from(document.querySelectorAll('#cksl-page-frame .korean-roof-accent, #cksl-page-frame .korean-divider, #cksl-page-frame .korean-title-underline, #cksl-page-frame .korean-pavilion-badge, #cksl-page-frame .korean-motif-render, #cksl-page-frame .cksl-motif-widget, #cksl-page-frame [data-cksl-motif], #cksl-page-frame [data-motif]'));

    if (sidebarCountBadge) sidebarCountBadge.textContent = `${motifEls.length} placed`;
    if (ribbonCountBadge) ribbonCountBadge.textContent = `${motifEls.length} placed`;

    if (sidebarContainer) sidebarContainer.innerHTML = '';
    if (ribbonContainer) ribbonContainer.innerHTML = '';

    if (motifEls.length === 0) {
      if (sidebarContainer) {
        sidebarContainer.innerHTML = `
          <div style="font-size: 0.78rem; color: #9CA3AF; padding: 12px 6px; text-align: center;">
            No motifs placed yet.<br>Click "+ Add" below to insert one.
          </div>
        `;
      }
      if (ribbonContainer) {
        ribbonContainer.innerHTML = `
          <div style="font-size: 0.74rem; color: #9CA3AF; padding: 12px 14px; white-space: nowrap;">
            No motifs placed on this page. Pick an authentic Joseon motif from the catalog to insert.
          </div>
        `;
      }
      return;
    }

    motifEls.forEach((el, idx) => {
      el.setAttribute('data-cksl-box', 'motif');
      if (!el.id) el.id = `cksl-motif-el-${idx + 1}`;

      let name = 'Heritage Motif';
      const cls = (typeof el.className === 'string' ? el.className : (el.className?.baseVal || el.getAttribute('class') || '')).toLowerCase();
      const dataMotif = el.getAttribute('data-motif') || el.getAttribute('data-cksl-motif');

      if (dataMotif) {
        name = dataMotif.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      } else if (cls.includes('roof')) {
        name = 'Hanok Roof Eaves';
      } else if (cls.includes('divider')) {
        name = 'Plum Blossom Divider';
      } else if (cls.includes('underline')) {
        name = 'Title Underline';
      } else if (cls.includes('pavilion')) {
        name = 'Palace Pavilion House';
      } else if (cls.includes('blossom') || cls.includes('maehwa')) {
        name = 'Plum Blossom';
      } else if (cls.includes('fan')) {
        name = 'Folding Fan';
      } else if (cls.includes('wave')) {
        name = 'Wave Medallion';
      } else if (cls.includes('cloud')) {
        name = 'Auspicious Cloud';
      } else if (cls.includes('lantern')) {
        name = 'Palace Lantern';
      } else if (cls.includes('shippo')) {
        name = 'Shippo Lattice';
      } else if (cls.includes('seal')) {
        name = 'Scholar Stamp';
      } else if (cls.includes('corner')) {
        name = 'Corner Fret';
      }

      // 1. Sidebar List Row
      if (sidebarContainer) {
        const row = document.createElement('div');
        row.className = 'cksl-page-motif-row';
        row.innerHTML = `
          <div class="cksl-page-motif-meta" title="Click to jump to motif on canvas">
            <span class="cksl-page-motif-thumb">
              <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14" style="color: var(--color-red, #A62B2B);">
                <circle cx="10" cy="10" r="7"/>
              </svg>
            </span>
            <span class="cksl-page-motif-name">${name}</span>
          </div>
          <div class="cksl-page-motif-actions">
            <button type="button" class="cksl-motif-act-btn" data-act="jump" title="Select motif">Jump</button>
            <button type="button" class="cksl-motif-act-btn" data-act="replace" title="Replace with another motif" style="color: var(--color-yellow-gold, #E5B842); font-weight:700;">⇄</button>
            <button type="button" class="cksl-motif-act-btn cksl-motif-act-del" data-act="del" title="Delete motif">✕</button>
          </div>
        `;

        row.querySelector('.cksl-page-motif-meta').addEventListener('click', () => {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          selectBox(el);
        });
        row.querySelector('[data-act="jump"]').addEventListener('click', () => {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          selectBox(el);
        });
        row.querySelector('[data-act="replace"]').addEventListener('click', (e) => {
          e.stopPropagation();
          openReplaceMotifModal(el);
        });
        row.querySelector('[data-act="del"]').addEventListener('click', (e) => {
          e.stopPropagation();
          deleteMotif(el);
        });
        sidebarContainer.appendChild(row);
      }

      // 2. Ribbon Shelf Motifs Reel
      if (ribbonContainer) {
        const card = document.createElement('div');
        card.className = 'cksl-ribbon-motif-card';
        card.innerHTML = `
          <div class="cksl-ribbon-motif-thumb">
            <svg viewBox="0 0 24 24" fill="none" width="18" height="18" stroke="var(--color-yellow-gold, #E5B842)" stroke-width="2">
              <circle cx="12" cy="12" r="9"/>
              <path d="M12 7v10M7 12h10"/>
            </svg>
          </div>
          <div class="cksl-ribbon-motif-meta">
            <span class="cksl-ribbon-motif-name" title="${name}">${name}</span>
            <div class="cksl-ribbon-motif-actions">
              <button type="button" class="cksl-ribbon-motif-btn" data-act="jump" title="Jump &amp; select">Select</button>
              <button type="button" class="cksl-ribbon-motif-btn cksl-motif-rep-btn" data-act="replace" title="Replace motif" style="color: var(--color-yellow-gold, #E5B842); font-weight: 700;">⇄ Replace</button>
              <button type="button" class="cksl-ribbon-motif-btn cksl-motif-del-btn" data-act="del" title="Delete motif" style="color: #F87171;">✕</button>
            </div>
          </div>
        `;

        card.addEventListener('click', (e) => {
          if (e.target.closest('button')) return;
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          selectBox(el);
        });
        card.querySelector('[data-act="jump"]').addEventListener('click', (e) => {
          e.stopPropagation();
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          selectBox(el);
        });
        card.querySelector('[data-act="replace"]').addEventListener('click', (e) => {
          e.stopPropagation();
          openReplaceMotifModal(el);
        });
        card.querySelector('[data-act="del"]').addEventListener('click', (e) => {
          e.stopPropagation();
          deleteMotif(el);
        });
        ribbonContainer.appendChild(card);
      }
    });
  }

  function openReplaceMotifModal(el) {
    currentReplacingMotifEl = el;
    openModal('cksl-modal-replace-motif');
  }

  function deleteMotif(el) {
    if (!el) return;
    el.style.transition = 'all 0.18s ease-out';
    el.style.opacity = '0';
    el.style.transform = 'scale(0.95)';
    setTimeout(() => {
      el.remove();
      if (activeBox === el) {
        activeBox = null;
        hideInspector();
      }
      scanPageMotifs();
      buildSidebarOutline();
      showNotification('Heritage motif removed');
    }, 120);
  }

  function replaceMotif(targetEl, newKey) {
    const motifsMap = typeof MOTIF_SVGS !== 'undefined' ? MOTIF_SVGS : {};
    const newSvg = motifsMap[newKey] || motifsMap.maehwa_blossom || '<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="14" fill="#A62B2B"/></svg>';

    if (!targetEl) return;

    if (targetEl.classList.contains('cksl-motif-widget') && targetEl.querySelector('.cksl-motif-body')) {
      targetEl.querySelector('.cksl-motif-body').innerHTML = newSvg;
      targetEl.setAttribute('data-motif', newKey);
      targetEl.setAttribute('data-cksl-motif', newKey);
    } else {
      const widget = document.createElement('div');
      widget.className = 'cksl-motif-widget korean-motif-render block-section';
      widget.setAttribute('data-motif', newKey);
      widget.setAttribute('data-cksl-motif', newKey);
      widget.setAttribute('data-cksl-box', 'motif');
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
          <button type="button" class="cksl-motif-btn" data-mact="replace" style="color:var(--color-yellow-gold,#E5B842);font-weight:700;" title="Replace Motif">⇄</button>
          <button type="button" class="cksl-motif-btn" data-mact="clone" title="Duplicate">⧉</button>
          <button type="button" class="cksl-motif-btn cksl-motif-del" data-mact="del" title="Delete">✕</button>
        </div>
        <div class="cksl-motif-body" style="display: inline-block;">
          ${newSvg}
        </div>
      `;
      bindMotifWidgetEvents(widget);
      if (targetEl.parentNode) {
        targetEl.parentNode.replaceChild(widget, targetEl);
        targetEl = widget;
      }
    }

    closeModal('cksl-modal-replace-motif');
    currentReplacingMotifEl = null;
    scanPageMotifs();
    buildSidebarOutline();
    selectBox(targetEl);
    showNotification(`Replaced with ${newKey.replace(/_/g, ' ')}`);
  }

  function setupReplaceMotifModal() {
    const modal = document.getElementById('cksl-modal-replace-motif');
    if (!modal) return;
    modal.querySelectorAll('.cksl-motif-option-card').forEach(card => {
      card.addEventListener('click', () => {
        const motifKey = card.getAttribute('data-replace-motif');
        if (currentReplacingMotifEl && motifKey) {
          replaceMotif(currentReplacingMotifEl, motifKey);
        }
      });
    });
  }

  function openReplaceImageModal(el) {
    currentReplacingImgEl = el;
    const urlInput = document.getElementById('cksl-replace-img-url-input');
    if (urlInput && el) {
      urlInput.value = el.getAttribute('src') || '';
    }
    openModal('cksl-modal-replace-image');
  }

  function replaceImageSource(imgEl, newSrc) {
    if (!imgEl || !newSrc) return;
    imgEl.src = newSrc;
    closeModal('cksl-modal-replace-image');
    currentReplacingImgEl = null;
    showNotification('Image updated');
    positionInspector(imgEl);
  }

  function setupReplaceImageModal() {
    const modal = document.getElementById('cksl-modal-replace-image');
    if (!modal) return;

    modal.querySelectorAll('.cksl-landscape-card').forEach(card => {
      card.addEventListener('click', () => {
        const src = card.getAttribute('data-img-src');
        if (currentReplacingImgEl && src) {
          replaceImageSource(currentReplacingImgEl, src);
        }
      });
    });

    const applyBtn = document.getElementById('cksl-btn-confirm-replace-img');
    const urlInput = document.getElementById('cksl-replace-img-url-input');
    if (applyBtn && urlInput) {
      applyBtn.addEventListener('click', () => {
        const val = urlInput.value.trim();
        if (val && currentReplacingImgEl) {
          replaceImageSource(currentReplacingImgEl, val);
        }
      });
    }
  }

  // 6. Figma / Canva Card & Box Controls (Selection, Resize Handles, Duplicate, Copy/Paste)
  function selectBox(box) {
    document.querySelectorAll('[data-cksl-box-selected]').forEach(el => el.removeAttribute('data-cksl-box-selected'));
    document.querySelectorAll('.cksl-resize-handle, .cksl-box-type-tag').forEach(h => h.remove());

    if (!box) {
      activeBox = null;
      hideInspector();
      return;
    }

    activeBox = box;
    box.setAttribute('data-cksl-box-selected', 'true');

    // Determine type label
    let typeName = 'BOX';
    const isNavbar = box.classList.contains('navbar') || box.closest('.navbar');
    const isMotif = box.classList.contains('korean-motif-render') || 
                    box.classList.contains('cksl-motif-widget') || 
                    box.classList.contains('korean-roof-accent') || 
                    box.classList.contains('korean-pavilion-badge') || 
                    box.classList.contains('korean-title-underline') || 
                    box.classList.contains('korean-divider') || 
                    box.hasAttribute('data-cksl-motif') || 
                    box.hasAttribute('data-motif') || 
                    box.getAttribute('data-cksl-box') === 'motif';
    const isImg = (box.tagName.toLowerCase() === 'img') || box.classList.contains('hero-img') || box.hasAttribute('data-cksl-image');

    if (isNavbar) typeName = 'NAVBAR';
    else if (isMotif) typeName = 'HERITAGE MOTIF';
    else if (isImg) typeName = 'IMAGE / PHOTO';
    else if (box.classList.contains('project-card') || box.classList.contains('mission-card') || box.classList.contains('overview-lead-box') || box.classList.contains('callout-box') || box.classList.contains('cta-banner-box')) typeName = 'CARD';
    else if (box.tagName.toLowerCase() === 'section' || box.classList.contains('block-section')) typeName = 'SECTION';

    if (box.tagName.toLowerCase() !== 'img') {
      const tag = document.createElement('div');
      tag.className = 'cksl-box-type-tag';
      tag.textContent = typeName;
      box.appendChild(tag);

      // Multi-directional Figma resize handles
      ['nw', 'ne', 'sw', 'se', 'e', 's'].forEach(dir => {
        const handle = document.createElement('div');
        handle.className = `cksl-resize-handle cksl-handle-${dir}`;
        handle.setAttribute('data-dir', dir);
        box.appendChild(handle);
        setupResizeHandle(handle, box, dir);
      });
    }

    renderInspectorForBox(box);
  }

  function setupResizeHandle(handle, box, dir) {
    let isResizing = false;
    let startX, startY, startW, startH;

    handle.addEventListener('mousedown', (e) => {
      e.stopPropagation();
      e.preventDefault();
      isResizing = true;
      startX = e.clientX;
      startY = e.clientY;
      startW = box.offsetWidth;
      startH = box.offsetHeight;

      const onMouseMove = (moveEv) => {
        if (!isResizing) return;
        const dx = moveEv.clientX - startX;
        const dy = moveEv.clientY - startY;

        if (dir === 'se' || dir === 'e') {
          const newW = Math.max(160, startW + dx);
          box.style.maxWidth = `${newW}px`;
          box.style.width = '100%';
        } else if (dir === 'sw') {
          const newW = Math.max(160, startW - dx);
          box.style.maxWidth = `${newW}px`;
          box.style.width = '100%';
        }
        if (dir === 'se' || dir === 's' || dir === 'sw') {
          const newH = Math.max(30, startH + dy);
          box.style.minHeight = `${newH}px`;
        }
        positionInspector(box);
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
        clone.removeAttribute('data-cksl-box-selected');
        clone.querySelectorAll('.cksl-resize-handle, .cksl-box-type-tag').forEach(h => h.remove());
        activeBox.parentNode.insertBefore(clone, activeBox.nextSibling);
        makeContentEditable();
        selectBox(clone);
        buildSidebarOutline();
        return;
      }

      // Move Up: Alt+ArrowUp
      if (e.altKey && e.key === 'ArrowUp' && activeBox) {
        e.preventDefault();
        const prev = activeBox.previousElementSibling;
        if (prev && prev.parentNode === activeBox.parentNode) {
          activeBox.parentNode.insertBefore(activeBox, prev);
          positionInspector(activeBox);
          scanPageMotifs();
          buildSidebarOutline();
        }
        return;
      }

      // Move Down: Alt+ArrowDown
      if (e.altKey && e.key === 'ArrowDown' && activeBox) {
        e.preventDefault();
        const next = activeBox.nextElementSibling;
        if (next && next.parentNode === activeBox.parentNode) {
          activeBox.parentNode.insertBefore(next, activeBox);
          positionInspector(activeBox);
          scanPageMotifs();
          buildSidebarOutline();
        }
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
    clone.querySelectorAll('.cksl-resize-handle, .cksl-box-type-tag').forEach(h => h.remove());
    box.parentNode.insertBefore(clone, box.nextSibling);
    makeContentEditable();
    selectBox(clone);
    buildSidebarOutline();
  }

  function deleteBox(box) {
    if (!box) return;
    box.style.transition = 'all 0.18s ease-out';
    box.style.opacity = '0';
    box.style.transform = 'scale(0.96)';
    setTimeout(() => {
      box.remove();
      hideInspector();
      buildSidebarOutline();
      scanPageMotifs();
      activeBox = null;
      showNotification('Element removed');
    }, 120);
  }

  // 7. Interactive Motifs (Draggable, Resizable, Colorable, Duplicable)
  function insertMotifWidget(motifKey) {
    const container = document.querySelector('.page-content-wrapper') || document.querySelector('.home-content-area') || document.querySelector('#cksl-page-frame main');
    if (!container) return;

    const svgContent = MOTIF_SVGS[motifKey] || MOTIF_SVGS.maehwa_blossom;

    const widget = document.createElement('div');
    widget.className = 'cksl-motif-widget block-section';
    widget.setAttribute('data-motif', motifKey);
    widget.setAttribute('data-cksl-motif', motifKey);
    widget.setAttribute('data-cksl-box', 'motif');
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
    if (activeBox && activeBox.parentNode && activeBox !== container) {
      activeBox.parentNode.insertBefore(widget, activeBox.nextSibling);
    } else {
      container.appendChild(widget);
    }
    scanPageMotifs();
    buildSidebarOutline();
    selectBox(widget);
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

  function showNotification(msg, type = 'info') {
    let toast = document.getElementById('cksl-editor-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'cksl-editor-toast';
      toast.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        background: #1C1E22;
        color: #FAF8F5;
        border: 1px solid rgba(229, 184, 66, 0.4);
        border-radius: 8px;
        padding: 10px 18px;
        font-size: 0.82rem;
        font-weight: 500;
        box-shadow: 0 10px 30px rgba(0,0,0,0.35);
        z-index: 100000;
        display: flex;
        align-items: center;
        gap: 10px;
        transition: all 0.22s ease-out;
        opacity: 0;
        transform: translateY(12px);
        pointer-events: none;
      `;
      document.body.appendChild(toast);
    }

    toast.innerHTML = `
      <span style="color: var(--color-yellow-gold, #E5B842); font-size: 1.1rem; line-height: 1;">✦</span>
      <span>${msg}</span>
    `;
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';

    if (toast._timer) clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(12px)';
    }, 2400);
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

    const isNavbar = box.classList.contains('navbar') || box.closest('.navbar');
    const isMotif = box.classList.contains('korean-motif-render') || 
                    box.classList.contains('cksl-motif-widget') || 
                    box.classList.contains('korean-roof-accent') || 
                    box.classList.contains('korean-pavilion-badge') || 
                    box.classList.contains('korean-title-underline') || 
                    box.classList.contains('korean-divider') || 
                    box.classList.contains('korean-pavilion-wrap') || 
                    box.classList.contains('title-underline-svg') || 
                    box.hasAttribute('data-cksl-motif') || 
                    box.hasAttribute('data-motif') || 
                    box.getAttribute('data-cksl-box') === 'motif';

    if (isNavbar) {
      typeBadge.textContent = 'Top Navigation Bar';
      container.innerHTML = `
        <div class="inspector-btn-group" style="width: 100%; justify-content: space-between; gap: 6px;">
          <button type="button" class="inspector-btn" id="cksl-insp-nav-edit" style="color: var(--color-yellow-gold, #E5B842); font-weight: 700;">Edit Navbar Links</button>
          <button type="button" class="inspector-btn" id="cksl-insp-nav-addpage">+ Add Page</button>
          <button type="button" class="inspector-btn" id="cksl-insp-nav-close" style="color: #9CA3AF;">Done</button>
        </div>
      `;
      container.querySelector('#cksl-insp-nav-edit').onclick = (e) => {
        e.stopPropagation();
        openNavigationManager();
      };
      container.querySelector('#cksl-insp-nav-addpage').onclick = (e) => {
        e.stopPropagation();
        openModal('cksl-modal-new-page');
      };
      container.querySelector('#cksl-insp-nav-close').onclick = (e) => {
        e.stopPropagation();
        hideInspector();
      };
      positionInspector(box);
      return;
    }

    if (isMotif) {
      typeBadge.textContent = 'Heritage Motif';
      container.innerHTML = `
        <button type="button" class="inspector-btn" data-mact="replace" style="color: var(--color-yellow-gold, #E5B842); font-weight: 700;" title="Replace this motif with another">⇄ Replace</button>
        <span class="inspector-label">Size:</span>
        <div class="inspector-btn-group">
          <button type="button" class="inspector-btn" data-mact="scale-minus" title="Smaller">-</button>
          <button type="button" class="inspector-btn" data-mact="scale-plus" title="Larger">+</button>
        </div>
        <span class="inspector-label">Color:</span>
        <div class="inspector-btn-group">
          <button type="button" class="inspector-btn" data-mact="col-red" style="background:#A62B2B; width:16px; height:16px; min-width:16px; border-radius:50%; padding:0; border:1px solid #fff;" title="Vermilion"></button>
          <button type="button" class="inspector-btn" data-mact="col-gold" style="background:#E5B842; width:16px; height:16px; min-width:16px; border-radius:50%; padding:0; border:1px solid #fff;" title="Gold"></button>
          <button type="button" class="inspector-btn" data-mact="col-dark" style="background:#141517; width:16px; height:16px; min-width:16px; border-radius:50%; padding:0; border:1px solid #fff;" title="Ink"></button>
          <input type="color" id="cksl-insp-motif-color" title="Custom Motif Color" value="#A62B2B" style="width:20px; height:20px; border:none; padding:0; border-radius:50%; cursor:pointer; background:none;">
        </div>
        <div class="inspector-btn-group">
          <button type="button" class="inspector-btn" data-mact="up" title="Move Up">▲</button>
          <button type="button" class="inspector-btn" data-mact="down" title="Move Down">▼</button>
          <button type="button" class="inspector-btn" data-mact="clone" title="Duplicate (Cmd+D)">⧉</button>
          <button type="button" class="inspector-btn" data-mact="del" title="Delete Motif" style="color: #EF4444;">✕</button>
        </div>
      `;

      const motifColorInput = container.querySelector('#cksl-insp-motif-color');
      if (motifColorInput) {
        motifColorInput.addEventListener('input', (e) => {
          applyMotifColor(box, e.target.value);
        });
      }

      container.querySelectorAll('[data-mact]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const act = btn.getAttribute('data-mact');
          const svgEl = box.querySelector('svg');

          if (act === 'replace') {
            openReplaceMotifModal(box);
          } else if (act === 'up') {
            const prev = box.previousElementSibling;
            if (prev) {
              box.parentNode.insertBefore(box, prev);
              scanPageMotifs();
              positionInspector(box);
            }
          } else if (act === 'down') {
            const next = box.nextElementSibling;
            if (next) {
              box.parentNode.insertBefore(next, box);
              scanPageMotifs();
              positionInspector(box);
            }
          } else if (act === 'scale-plus' && svgEl) {
            const curW = parseInt(svgEl.style.width || svgEl.getAttribute('width') || 60);
            svgEl.style.width = `${Math.min(480, curW + 16)}px`;
            positionInspector(box);
          } else if (act === 'scale-minus' && svgEl) {
            const curW = parseInt(svgEl.style.width || svgEl.getAttribute('width') || 60);
            svgEl.style.width = `${Math.max(20, curW - 16)}px`;
            positionInspector(box);
          } else if (act === 'col-red') {
            applyMotifColor(box, '#A62B2B');
          } else if (act === 'col-gold') {
            applyMotifColor(box, '#E5B842');
          } else if (act === 'col-dark') {
            applyMotifColor(box, '#141517');
          } else if (act === 'clone') {
            duplicateBox(box);
            scanPageMotifs();
          } else if (act === 'del') {
            deleteMotif(box);
          }
        });
      });

      positionInspector(box);
      return;
    }

    const isImage = (box.tagName.toLowerCase() === 'img') || box.classList.contains('hero-img') || box.hasAttribute('data-cksl-image') || box.tagName.toLowerCase() === 'figure' || !!box.querySelector('img');

    if (isImage) {
      const targetImg = box.tagName.toLowerCase() === 'img' ? box : (box.querySelector('img') || box);
      typeBadge.textContent = 'Image / Photo';
      container.innerHTML = `
        <button type="button" class="inspector-btn" id="cksl-insp-img-replace" style="color: var(--color-yellow-gold, #E5B842); font-weight: 700;">⇄ Replace Photo</button>
        <span class="inspector-label">Width:</span>
        <div class="inspector-btn-group">
          <button type="button" class="inspector-btn" data-iact="w-25">25%</button>
          <button type="button" class="inspector-btn" data-iact="w-50">50%</button>
          <button type="button" class="inspector-btn" data-iact="w-75">75%</button>
          <button type="button" class="inspector-btn" data-iact="w-100">100%</button>
        </div>
        <span class="inspector-label">Corners:</span>
        <div class="inspector-btn-group">
          <button type="button" class="inspector-btn" data-iact="r-0" title="Sharp 0px">▢</button>
          <button type="button" class="inspector-btn" data-iact="r-8" title="Rounded 8px">▢</button>
          <button type="button" class="inspector-btn" data-iact="r-24" title="Curved 24px">▢</button>
          <button type="button" class="inspector-btn" data-iact="r-circle" title="Circle">◯</button>
        </div>
        <div class="inspector-btn-group">
          <button type="button" class="inspector-btn" data-iact="up" title="Move Up">▲</button>
          <button type="button" class="inspector-btn" data-iact="down" title="Move Down">▼</button>
          <button type="button" class="inspector-btn" data-iact="del" title="Delete Image" style="color: #EF4444;">✕</button>
        </div>
      `;

      container.querySelector('#cksl-insp-img-replace').addEventListener('click', (e) => {
        e.stopPropagation();
        openReplaceImageModal(targetImg);
      });

      container.querySelectorAll('[data-iact]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const act = btn.getAttribute('data-iact');

          if (act === 'w-25') { targetImg.style.width = '25%'; targetImg.style.maxWidth = '25%'; }
          else if (act === 'w-50') { targetImg.style.width = '50%'; targetImg.style.maxWidth = '50%'; }
          else if (act === 'w-75') { targetImg.style.width = '75%'; targetImg.style.maxWidth = '75%'; }
          else if (act === 'w-100') { targetImg.style.width = '100%'; targetImg.style.maxWidth = '100%'; }
          else if (act === 'r-0') { targetImg.style.borderRadius = '0px'; }
          else if (act === 'r-8') { targetImg.style.borderRadius = '8px'; }
          else if (act === 'r-24') { targetImg.style.borderRadius = '24px'; }
          else if (act === 'r-circle') { targetImg.style.borderRadius = '50%'; }
          else if (act === 'up') {
            const p = box.previousElementSibling;
            if (p) box.parentNode.insertBefore(box, p);
            buildSidebarOutline();
          } else if (act === 'down') {
            const n = box.nextElementSibling;
            if (n) box.parentNode.insertBefore(n, box);
            buildSidebarOutline();
          } else if (act === 'del') {
            deleteBox(box);
          }
          positionInspector(box);
        });
      });

      positionInspector(box);
      return;
    }

    typeBadge.textContent = 'Card / Box';
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
        <input type="color" id="cksl-box-bg-picker" title="Custom Background Color" value="#FFFFFF" style="width:22px; height:22px; border:none; padding:0; border-radius:4px; cursor:pointer; background:none;">
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

    const bgPicker = container.querySelector('#cksl-box-bg-picker');
    if (bgPicker) {
      bgPicker.addEventListener('input', (e) => {
        box.style.background = e.target.value;
      });
    }

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

  function applyMotifColor(container, colorHex) {
    container.querySelectorAll('svg path, svg circle, svg rect, svg line').forEach(shape => {
      const fill = shape.getAttribute('fill');
      if (fill && fill !== 'none' && !fill.includes('url')) {
        shape.style.fill = colorHex;
      }
      const stroke = shape.getAttribute('stroke');
      if (stroke && stroke !== 'none') {
        shape.style.stroke = colorHex;
      }
    });
  }

  function positionInspector(el) {
    const inspector = document.getElementById('cksl-floating-inspector');
    if (!inspector || !el) return;

    const sidebar = document.getElementById('cksl-sidebar');
    const sidebarOffset = (sidebar && !sidebar.classList.contains('hidden')) ? (sidebar.offsetWidth || 260) : 0;

    const rect = el.getBoundingClientRect();
    let left = rect.left + 16;
    let top = rect.top - 54;

    if (top < 110) top = rect.bottom + 12;
    if (left < sidebarOffset + 12) left = sidebarOffset + 12;
    if (left + 380 > window.innerWidth - 12) left = window.innerWidth - 392;

    inspector.style.left = `${left}px`;
    inspector.style.top = `${Math.max(90, top)}px`;
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

    setupDragAndDrop();
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

    const box = e.target.closest('.navbar, .korean-motif-render, .korean-roof-accent, .korean-pavilion-badge, .korean-title-underline, .korean-divider, [data-cksl-motif], [data-motif], [data-cksl-box], .project-card, .mission-card, .overview-lead-box, .callout-box, .cta-banner-box, .block-section, .cksl-motif-widget, img, [data-cksl-image], .hero-img, figure, .event-card, .person-card, .publication-item');
    if (box) {
      selectBox(box);
    }
  }

  let draggedCanvasEl = null;

  function setupDragAndDrop() {
    const frame = document.getElementById('cksl-page-frame');
    if (!frame) return;

    const candidateSelectors = [
      '.project-card', '.mission-card', '.overview-lead-box',
      '.block-section', 'section.section', '[data-cksl-block]',
      '.cksl-motif-widget', '.korean-roof-accent', '.korean-pavilion-badge', '.korean-divider'
    ];

    frame.querySelectorAll(candidateSelectors.join(', ')).forEach(box => {
      if (box.closest('#cksl-ribbon') || box.closest('#cksl-sidebar') || box.closest('#cksl-floating-inspector')) return;

      if (!box.querySelector(':scope > .cksl-drag-handle') && box.tagName.toLowerCase() !== 'img') {
        const handle = document.createElement('div');
        handle.className = 'cksl-drag-handle';
        handle.innerHTML = '⠿';
        handle.title = 'Drag to reorder';
        box.prepend(handle);

        handle.addEventListener('mousedown', (e) => {
          e.stopPropagation();
          box.setAttribute('draggable', 'true');
        });
        handle.addEventListener('mouseup', () => {
          box.removeAttribute('draggable');
        });
      }

      box.addEventListener('dragstart', (e) => {
        if (!box.hasAttribute('draggable')) {
          e.preventDefault();
          return;
        }
        draggedCanvasEl = box;
        box.classList.add('cksl-is-dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', box.id || 'canvas-box');
      });

      box.addEventListener('dragend', () => {
        box.classList.remove('cksl-is-dragging');
        box.removeAttribute('draggable');
        document.querySelectorAll('.cksl-drop-target-above, .cksl-drop-target-below').forEach(el => {
          el.classList.remove('cksl-drop-target-above', 'cksl-drop-target-below');
        });
        draggedCanvasEl = null;
      });

      box.addEventListener('dragover', (e) => {
        if (!draggedCanvasEl || draggedCanvasEl === box) return;
        if (draggedCanvasEl.parentNode === box.parentNode || box.closest('main') === draggedCanvasEl.closest('main')) {
          e.preventDefault();
          e.stopPropagation();
          const rect = box.getBoundingClientRect();
          if (e.clientY < rect.top + rect.height / 2) {
            box.classList.add('cksl-drop-target-above');
            box.classList.remove('cksl-drop-target-below');
          } else {
            box.classList.add('cksl-drop-target-below');
            box.classList.remove('cksl-drop-target-above');
          }
        }
      });

      box.addEventListener('dragleave', () => {
        box.classList.remove('cksl-drop-target-above', 'cksl-drop-target-below');
      });

      box.addEventListener('drop', (e) => {
        if (!draggedCanvasEl || draggedCanvasEl === box) return;
        e.preventDefault();
        e.stopPropagation();
        const isAbove = box.classList.contains('cksl-drop-target-above');
        box.classList.remove('cksl-drop-target-above', 'cksl-drop-target-below');
        if (isAbove) {
          box.parentNode.insertBefore(draggedCanvasEl, box);
        } else {
          box.parentNode.insertBefore(draggedCanvasEl, box.nextSibling);
        }
        scanPageMotifs();
        buildSidebarOutline();
        selectBox(draggedCanvasEl);
        showNotification('Item reordered');
      });
    });
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

  // Expose CKSL_EDITOR API on window for external control & testing
  window.CKSL_EDITOR = { setDeviceMode, fitCanvasToScreen, setCanvasZoom, enableEditor, disableEditor };

  // Auto-init on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
