// ============================================
// VeyraOS — Custom SVG Icon Set
// macOS Big Sur / Sonoma style icons
// ============================================

const VeyraIcons = {
  finder: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="finderBg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#3aa0ff"/><stop offset="100%" stop-color="#0066ee"/>
      </linearGradient>
      <linearGradient id="finderFace" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#e8eef5"/><stop offset="100%" stop-color="#c8d4e0"/>
      </linearGradient>
    </defs>
    <rect width="120" height="120" rx="26" fill="url(#finderBg)"/>
    <path d="M20 30 Q20 20 30 20 L90 20 Q100 20 100 30 L100 90 Q100 100 90 100 L30 100 Q20 100 20 90 Z" fill="url(#finderFace)"/>
    <path d="M35 28 Q35 22 40 22 L80 22 Q85 22 85 28 L82 38 Q82 42 78 42 L42 42 Q38 42 38 38 Z" fill="#3aa0ff" opacity="0.3"/>
    <path d="M60 42 L60 88" stroke="#555" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M60 42 Q48 48 42 56" stroke="#555" stroke-width="3" stroke-linecap="round" fill="none"/>
    <path d="M60 42 Q72 48 78 56" stroke="#555" stroke-width="3" stroke-linecap="round" fill="none"/>
    <ellipse cx="48" cy="62" rx="4" ry="6" fill="#333"/>
    <ellipse cx="72" cy="62" rx="4" ry="6" fill="#333"/>
    <path d="M50 80 Q60 88 70 80" stroke="#333" stroke-width="3" stroke-linecap="round" fill="none"/>
    <rect x="44" y="18" width="3" height="8" rx="1.5" fill="#3aa0ff"/>
    <rect x="49" y="18" width="3" height="8" rx="1.5" fill="#3aa0ff"/>
    <rect x="54" y="18" width="3" height="8" rx="1.5" fill="#3aa0ff"/>
    <rect x="59" y="18" width="3" height="8" rx="1.5" fill="#3aa0ff"/>
    <rect x="64" y="18" width="3" height="8" rx="1.5" fill="#3aa0ff"/>
    <rect x="69" y="18" width="3" height="8" rx="1.5" fill="#3aa0ff"/>
    <rect x="74" y="18" width="3" height="8" rx="1.5" fill="#3aa0ff"/>
  </svg>`,

  browser: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="browserBg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#a855f7"/><stop offset="50%" stop-color="#7c3aed"/><stop offset="100%" stop-color="#6366f1"/>
      </linearGradient>
      <radialGradient id="browserGlobe" cx="0.5" cy="0.4">
        <stop offset="0%" stop-color="#e0d0ff"/><stop offset="60%" stop-color="#b88df0"/><stop offset="100%" stop-color="#8b5cf6"/>
      </radialGradient>
    </defs>
    <rect width="120" height="120" rx="26" fill="url(#browserBg)"/>
    <circle cx="60" cy="58" r="36" fill="url(#browserGlobe)" stroke="rgba(255,255,255,0.4)" stroke-width="1.5"/>
    <ellipse cx="60" cy="58" rx="36" ry="14" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="1.5"/>
    <ellipse cx="60" cy="58" rx="14" ry="36" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="1.5"/>
    <path d="M24 58 L96 58" stroke="rgba(255,255,255,0.4)" stroke-width="1.5"/>
    <path d="M28 42 Q60 36 92 42" stroke="rgba(255,255,255,0.3)" stroke-width="1.5" fill="none"/>
    <path d="M28 74 Q60 80 92 74" stroke="rgba(255,255,255,0.3)" stroke-width="1.5" fill="none"/>
    <path d="M30 42 Q30 38 34 36 L48 30 L72 30 L86 36 Q90 38 90 42 L90 52 Q90 56 86 56 L34 56 Q30 56 30 52 Z" fill="rgba(255,255,255,0.15)"/>
    <rect x="38" y="24" width="44" height="12" rx="3" fill="rgba(255,255,255,0.2)"/>
    <circle cx="60" cy="58" r="5" fill="#fff" opacity="0.8"/>
    <path d="M60 53 L60 63 M55 58 L65 58" stroke="#7c3aed" stroke-width="2" stroke-linecap="round"/>
  </svg>`,

  mail: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="mailBg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#3b82f6"/><stop offset="100%" stop-color="#1d4ed8"/>
      </linearGradient>
    </defs>
    <rect width="120" height="120" rx="26" fill="url(#mailBg)"/>
    <rect x="20" y="34" width="80" height="56" rx="8" fill="#fff"/>
    <path d="M20 42 L60 66 L100 42" stroke="#3b82f6" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M20 42 L20 82 Q20 90 28 90 L92 90 Q100 90 100 82 L100 42 L60 66 Z" fill="rgba(255,255,255,0.3)"/>
    <rect x="20" y="34" width="80" height="56" rx="8" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="1"/>
  </svg>`,

  notes: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="notesBg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#fbbf24"/><stop offset="100%" stop-color="#f59e0b"/>
      </linearGradient>
      <linearGradient id="notesPaper" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#fffbf0"/><stop offset="100%" stop-color="#fff5e0"/>
      </linearGradient>
    </defs>
    <rect width="120" height="120" rx="26" fill="url(#notesBg)"/>
    <rect x="28" y="20" width="64" height="82" rx="6" fill="url(#notesPaper)" stroke="rgba(0,0,0,0.06)" stroke-width="1"/>
    <rect x="28" y="20" width="64" height="14" rx="6" fill="#f59e0b" opacity="0.5"/>
    <line x1="38" y1="48" x2="82" y2="48" stroke="#d4a017" stroke-width="2" stroke-linecap="round"/>
    <line x1="38" y1="58" x2="82" y2="58" stroke="#d4a017" stroke-width="2" stroke-linecap="round"/>
    <line x1="38" y1="68" x2="72" y2="68" stroke="#d4a017" stroke-width="2" stroke-linecap="round"/>
    <line x1="38" y1="78" x2="78" y2="78" stroke="#d4a017" stroke-width="2" stroke-linecap="round"/>
    <line x1="38" y1="88" x2="66" y2="88" stroke="#d4a017" stroke-width="2" stroke-linecap="round"/>
  </svg>`,

  calendar: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="calBg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#fff"/><stop offset="100%" stop-color="#f0f0f5"/>
      </linearGradient>
    </defs>
    <rect width="120" height="120" rx="26" fill="url(#calBg)"/>
    <rect x="18" y="24" width="84" height="72" rx="8" fill="#fff" stroke="#e0e0e8" stroke-width="1"/>
    <rect x="18" y="24" width="84" height="20" rx="8" fill="#ef4444"/>
    <rect x="18" y="36" width="84" height="8" fill="#ef4444"/>
    <text x="60" y="40" text-anchor="middle" fill="#fff" font-size="11" font-family="Inter, sans-serif" font-weight="700">SEPTEMBER</text>
    <text x="60" y="82" text-anchor="middle" fill="#1a1a2e" font-size="36" font-family="Inter, sans-serif" font-weight="300">30</text>
    <rect x="34" y="14" width="6" height="18" rx="3" fill="#999"/>
    <rect x="80" y="14" width="6" height="18" rx="3" fill="#999"/>
  </svg>`,

  photos: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="photosBg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#fff"/><stop offset="100%" stop-color="#f5f5fa"/>
      </linearGradient>
    </defs>
    <rect width="120" height="120" rx="26" fill="url(#photosBg)"/>
    <g transform="translate(60,60)">
      <circle cx="0" cy="-28" r="14" fill="#ff6b6b"/>
      <circle cx="24" cy="-14" r="14" fill="#ff9f0a"/>
      <circle cx="24" cy="14" r="14" fill="#ffd60a"/>
      <circle cx="0" cy="28" r="14" fill="#22c55e"/>
      <circle cx="-24" cy="14" r="14" fill="#0a84ff"/>
      <circle cx="-24" cy="-14" r="14" fill="#bf5af2"/>
      <circle cx="0" cy="0" r="12" fill="#fff"/>
    </g>
  </svg>`,

  music: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="musicBg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#ec4899"/><stop offset="100%" stop-color="#be185d"/>
      </linearGradient>
    </defs>
    <rect width="120" height="120" rx="26" fill="url(#musicBg)"/>
    <path d="M48 30 L48 80 Q48 88 40 88 Q32 88 32 80 Q32 72 40 72 Q44 72 48 74 L48 30 Z" fill="#fff"/>
    <path d="M80 24 L80 74 Q80 82 72 82 Q64 82 64 74 Q64 66 72 66 Q76 66 80 68 L80 24 Z" fill="#fff"/>
    <path d="M48 30 L80 24 L80 36 L48 42 Z" fill="#fff"/>
    <path d="M48 30 L80 24 L80 30 L48 36 Z" fill="rgba(0,0,0,0.08)"/>
  </svg>`,

  appstore: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="appstoreBg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#0a84ff"/><stop offset="100%" stop-color="#0040dd"/>
      </linearGradient>
    </defs>
    <rect width="120" height="120" rx="26" fill="url(#appstoreBg)"/>
    <path d="M42 82 L60 50 L78 82" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M50 68 L70 68" stroke="#fff" stroke-width="4" stroke-linecap="round"/>
    <circle cx="60" cy="46" r="6" fill="#fff"/>
    <path d="M48 84 L54 74 M72 84 L66 74" stroke="rgba(255,255,255,0.5)" stroke-width="3" stroke-linecap="round"/>
  </svg>`,

  calculator: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="calcBg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#4b5563"/><stop offset="100%" stop-color="#1f2937"/>
      </linearGradient>
    </defs>
    <rect width="120" height="120" rx="26" fill="url(#calcBg)"/>
    <rect x="22" y="18" width="76" height="24" rx="6" fill="#1a1a2e"/>
    <text x="90" y="35" text-anchor="end" fill="#4ade80" font-size="16" font-family="SF Mono, monospace" font-weight="500">1,024</text>
    <g fill="#6b7280">
      <circle cx="34" cy="56" r="8"/><circle cx="54" cy="56" r="8"/><circle cx="74" cy="56" r="8"/>
    </g>
    <g fill="#f59e0b">
      <circle cx="94" cy="56" r="8"/>
      <circle cx="94" cy="76" r="8"/><circle cx="94" cy="96" r="8"/>
    </g>
    <g fill="#4b5563">
      <circle cx="34" cy="76" r="8"/><circle cx="54" cy="76" r="8"/><circle cx="74" cy="76" r="8"/>
      <circle cx="34" cy="96" r="8"/><circle cx="54" cy="96" r="8"/><circle cx="74" cy="96" r="8"/>
    </g>
  </svg>`,

  texteditor: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="textBg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#60a5fa"/><stop offset="100%" stop-color="#2563eb"/>
      </linearGradient>
    </defs>
    <rect width="120" height="120" rx="26" fill="url(#textBg)"/>
    <rect x="30" y="20" width="60" height="80" rx="6" fill="#fff"/>
    <rect x="30" y="20" width="60" height="14" rx="6" fill="rgba(0,0,0,0.06)"/>
    <line x1="38" y1="48" x2="82" y2="48" stroke="#cbd5e1" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="38" y1="58" x2="82" y2="58" stroke="#cbd5e1" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="38" y1="68" x2="72" y2="68" stroke="#cbd5e1" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="38" y1="78" x2="82" y2="78" stroke="#cbd5e1" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M78 84 L92 70 L98 76 L84 90 L78 92 L80 86 Z" fill="#f59e0b"/>
    <path d="M78 84 L92 70" stroke="#d97706" stroke-width="1.5"/>
  </svg>`,

  terminal: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="termBg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#2d2d3d"/><stop offset="100%" stop-color="#0d0d1d"/>
      </linearGradient>
    </defs>
    <rect width="120" height="120" rx="26" fill="url(#termBg)"/>
    <rect x="16" y="20" width="88" height="80" rx="8" fill="#0a0a0a" stroke="#333" stroke-width="1"/>
    <rect x="16" y="20" width="88" height="16" rx="8" fill="#1a1a2e"/>
    <circle cx="26" cy="28" r="3" fill="#ff5f57"/>
    <circle cx="38" cy="28" r="3" fill="#ffbd2e"/>
    <circle cx="50" cy="28" r="3" fill="#28c840"/>
    <text x="26" y="56" fill="#22c55e" font-size="14" font-family="SF Mono, monospace" font-weight="600">&gt;_</text>
    <text x="26" y="76" fill="#6b7280" font-size="11" font-family="SF Mono, monospace">veyra@os ~ %</text>
    <rect x="26" y="82" width="8" height="14" fill="#22c55e" opacity="0.6">
      <animate attributeName="opacity" values="0.6;0;0.6" dur="1s" repeatCount="indefinite"/>
    </rect>
  </svg>`,

  settings: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="settingsBg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#9ca3af"/><stop offset="100%" stop-color="#4b5563"/>
      </linearGradient>
    </defs>
    <rect width="120" height="120" rx="26" fill="url(#settingsBg)"/>
    <g transform="translate(60,60)">
      <g fill="#fff">
        <circle cx="0" cy="-32" r="6"/>
        <circle cx="28" cy="-16" r="6"/>
        <circle cx="28" cy="16" r="6"/>
        <circle cx="0" cy="32" r="6"/>
        <circle cx="-28" cy="16" r="6"/>
        <circle cx="-28" cy="-16" r="6"/>
      </g>
      <path d="M-6 -32 L6 -32 L8 -22 L-8 -22 Z" fill="#fff"/>
      <path d="M22 -22 L30 -14 L24 -4 L18 -12 Z" fill="#fff"/>
      <path d="M30 10 L30 22 L22 26 L20 16 Z" fill="#fff"/>
      <path d="M6 32 L-6 32 L-8 22 L8 22 Z" fill="#fff"/>
      <path d="M-22 22 L-30 14 L-24 4 L-18 12 Z" fill="#fff"/>
      <path d="M-30 -10 L-30 -22 L-22 -26 L-20 -16 Z" fill="#fff"/>
      <circle cx="0" cy="0" r="16" fill="#fff"/>
      <circle cx="0" cy="0" r="8" fill="#4b5563"/>
    </g>
  </svg>`,

  downloads: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="dlBg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#0a84ff"/><stop offset="100%" stop-color="#0040dd"/>
      </linearGradient>
    </defs>
    <rect width="120" height="120" rx="26" fill="url(#dlBg)"/>
    <circle cx="60" cy="60" r="32" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="3"/>
    <path d="M60 36 L60 68 M46 54 L60 68 L74 54" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <rect x="42" y="78" width="36" height="6" rx="3" fill="#fff"/>
  </svg>`,

  trash: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="trashBg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#9ca3af"/><stop offset="100%" stop-color="#6b7280"/>
      </linearGradient>
    </defs>
    <rect width="120" height="120" rx="26" fill="url(#trashBg)"/>
    <path d="M36 40 L40 96 Q40 102 46 102 L74 102 Q80 102 80 96 L84 40 Z" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.3)" stroke-width="1.5"/>
    <rect x="30" y="32" width="60" height="8" rx="4" fill="rgba(255,255,255,0.25)"/>
    <rect x="50" y="24" width="20" height="8" rx="3" fill="rgba(255,255,255,0.2)"/>
    <line x1="48" y1="48" x2="50" y2="92" stroke="rgba(255,255,255,0.15)" stroke-width="2"/>
    <line x1="60" y1="48" x2="60" y2="92" stroke="rgba(255,255,255,0.15)" stroke-width="2"/>
    <line x1="72" y1="48" x2="70" y2="92" stroke="rgba(255,255,255,0.15)" stroke-width="2"/>
  </svg>`,

  launchpad: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="launchBg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#6366f1"/><stop offset="100%" stop-color="#8b5cf6"/>
      </linearGradient>
    </defs>
    <rect width="120" height="120" rx="26" fill="url(#launchBg)"/>
    <g fill="rgba(255,255,255,0.9)">
      <rect x="30" y="30" width="22" height="22" rx="5"/>
      <rect x="68" y="30" width="22" height="22" rx="5"/>
      <rect x="30" y="68" width="22" height="22" rx="5"/>
      <rect x="68" y="68" width="22" height="22" rx="5"/>
    </g>
    <g fill="rgba(255,255,255,0.4)">
      <rect x="54" y="30" width="6" height="22" rx="2"/>
      <rect x="30" y="54" width="60" height="6" rx="2"/>
      <rect x="54" y="68" width="6" height="22" rx="2"/>
    </g>
  </svg>`,

  mission: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="missionBg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#374151"/><stop offset="100%" stop-color="#1f2937"/>
      </linearGradient>
    </defs>
    <rect width="120" height="120" rx="26" fill="url(#missionBg)"/>
    <rect x="20" y="24" width="38" height="28" rx="4" fill="rgba(255,255,255,0.8)"/>
    <rect x="62" y="24" width="38" height="28" rx="4" fill="rgba(255,255,255,0.5)"/>
    <rect x="20" y="56" width="38" height="28" rx="4" fill="rgba(255,255,255,0.5)"/>
    <rect x="62" y="56" width="38" height="28" rx="4" fill="rgba(255,255,255,0.8)"/>
    <rect x="20" y="88" width="80" height="10" rx="3" fill="rgba(255,255,255,0.15)"/>
  </svg>`,

  weather: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="weatherBg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#0ea5e9"/><stop offset="100%" stop-color="#0369a1"/>
      </linearGradient>
    </defs>
    <rect width="120" height="120" rx="26" fill="url(#weatherBg)"/>
    <circle cx="44" cy="44" r="16" fill="#fbbf24"/>
    <ellipse cx="70" cy="64" rx="28" ry="16" fill="#fff" opacity="0.9"/>
    <ellipse cx="48" cy="70" rx="20" ry="12" fill="#fff" opacity="0.7"/>
    <ellipse cx="82" cy="66" rx="14" ry="10" fill="#fff" opacity="0.8"/>
  </svg>`,

  maps: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="mapsBg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#22c55e"/><stop offset="100%" stop-color="#15803d"/>
      </linearGradient>
    </defs>
    <rect width="120" height="120" rx="26" fill="url(#mapsBg)"/>
    <path d="M20 40 L40 34 L60 40 L80 34 L100 40 L100 80 L80 86 L60 80 L40 86 L20 80 Z" fill="rgba(255,255,255,0.15)"/>
    <path d="M30 50 L90 50 M30 65 L90 65" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
    <path d="M60 30 L60 90" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
    <path d="M60 28 L52 50 L60 46 L68 50 Z" fill="#ef4444"/>
    <circle cx="60" cy="44" r="5" fill="#ef4444" stroke="#fff" stroke-width="2"/>
  </svg>`,

  reminders: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="remBg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#f59e0b"/><stop offset="100%" stop-color="#d97706"/>
      </linearGradient>
    </defs>
    <rect width="120" height="120" rx="26" fill="url(#remBg)"/>
    <circle cx="60" cy="60" r="30" fill="rgba(255,255,255,0.15)"/>
    <circle cx="60" cy="60" r="24" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="2"/>
    <path d="M48 60 L56 68 L72 52" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,

  podcasts: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="podBg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#a855f7"/><stop offset="100%" stop-color="#7e22ce"/>
      </linearGradient>
    </defs>
    <rect width="120" height="120" rx="26" fill="url(#podBg)"/>
    <circle cx="60" cy="50" r="10" fill="#fff"/>
    <path d="M44 62 Q44 48 60 48 Q76 48 76 62" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round"/>
    <path d="M36 72 Q36 44 60 44 Q84 44 84 72" stroke="rgba(255,255,255,0.5)" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M28 82 Q28 38 60 38 Q92 38 92 82" stroke="rgba(255,255,255,0.25)" stroke-width="3" fill="none" stroke-linecap="round"/>
    <rect x="54" y="64" width="12" height="32" rx="6" fill="#fff"/>
  </svg>`,

  books: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="booksBg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#3b82f6"/><stop offset="100%" stop-color="#1e40af"/>
      </linearGradient>
    </defs>
    <rect width="120" height="120" rx="26" fill="url(#booksBg)"/>
    <rect x="28" y="26" width="64" height="72" rx="4" fill="#fff"/>
    <rect x="28" y="26" width="64" height="12" rx="4" fill="rgba(0,0,0,0.06)"/>
    <line x1="38" y1="52" x2="82" y2="52" stroke="#cbd5e1" stroke-width="2"/>
    <line x1="38" y1="62" x2="82" y2="62" stroke="#cbd5e1" stroke-width="2"/>
    <line x1="38" y1="72" x2="72" y2="72" stroke="#cbd5e1" stroke-width="2"/>
    <line x1="38" y1="82" x2="78" y2="82" stroke="#cbd5e1" stroke-width="2"/>
  </svg>`,

  fitness: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="fitBg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#ef4444"/><stop offset="100%" stop-color="#b91c1c"/>
      </linearGradient>
    </defs>
    <rect width="120" height="120" rx="26" fill="url(#fitBg)"/>
    <circle cx="60" cy="60" r="28" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="6"/>
    <circle cx="60" cy="60" r="28" fill="none" stroke="#fff" stroke-width="6" stroke-dasharray="120 60" stroke-linecap="round" transform="rotate(-90 60 60)"/>
    <path d="M52 48 L52 72 L68 60 Z" fill="#fff"/>
  </svg>`,

  veyraHD: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="hdBg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#6b7280"/><stop offset="100%" stop-color="#374151"/>
      </linearGradient>
    </defs>
    <rect width="120" height="120" rx="26" fill="url(#hdBg)"/>
    <rect x="22" y="36" width="76" height="52" rx="8" fill="#4b5563"/>
    <rect x="22" y="36" width="76" height="14" rx="8" fill="#6b7280"/>
    <circle cx="32" cy="43" r="2" fill="#22c55e"/>
    <rect x="30" y="58" width="60" height="3" rx="1" fill="rgba(255,255,255,0.2)"/>
    <rect x="30" y="66" width="40" height="3" rx="1" fill="rgba(255,255,255,0.15)"/>
    <rect x="30" y="74" width="50" height="3" rx="1" fill="rgba(255,255,255,0.1)"/>
  </svg>`,

  textFile: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <rect width="120" height="120" rx="26" fill="rgba(255,255,255,0.05)"/>
    <path d="M34 20 L70 20 L86 36 L86 100 L34 100 Z" fill="#fff"/>
    <path d="M70 20 L70 36 L86 36 Z" fill="#e0e0e8"/>
    <line x1="42" y1="50" x2="78" y2="50" stroke="#cbd5e1" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="42" y1="60" x2="78" y2="60" stroke="#cbd5e1" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="42" y1="70" x2="68" y2="70" stroke="#cbd5e1" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="42" y1="80" x2="78" y2="80" stroke="#cbd5e1" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="42" y1="90" x2="72" y2="90" stroke="#cbd5e1" stroke-width="2.5" stroke-linecap="round"/>
  </svg>`
};

window.VeyraIcons = VeyraIcons;
