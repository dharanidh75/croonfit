import React from 'react'

/**
 * CROON SVG Logotype
 * - Ultra-heavy block lettering matching reference image
 * - "APPAREL STUDIO" tagline underneath (opt-in via showTagline)
 * - Letter O: square frame with diagonal slash (custom glyph)
 * - Single colour via `currentColor`
 */
export function Logo({ className = 'h-8', showTagline = false }) {
  return (
    <svg
      className={className}
      viewBox={showTagline ? '0 0 362 120' : '0 0 362 100'}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Croon"
    >
      {/* ── C ───────────────────────────────── x:0–62 */}
      <rect x="0"  y="10" width="62" height="16" />
      <rect x="0"  y="74" width="62" height="16" />
      <rect x="0"  y="10" width="16" height="80" />

      {/* ── R ───────────────────────────────── x:72–134 */}
      <rect x="72" y="10" width="16" height="80" />
      <rect x="72" y="10" width="62" height="16" />
      <rect x="72" y="46" width="50" height="14" />
      <rect x="118" y="10" width="16" height="50" />
      <polygon points="116,60 134,60 134,90 118,90" />

      {/* ── O ① ─────────────────────────────── x:146–210 */}
      <rect x="146" y="10" width="64" height="80" />
      <rect x="162" y="26" width="32" height="48" fill="white" />
      <line x1="148" y1="12" x2="208" y2="88" stroke="currentColor" strokeWidth="8" />

      {/* ── O ② ─────────────────────────────── x:222–286 */}
      <rect x="222" y="10" width="64" height="80" />
      <rect x="238" y="26" width="32" height="48" fill="white" />
      <line x1="224" y1="12" x2="284" y2="88" stroke="currentColor" strokeWidth="8" />

      {/* ── N ───────────────────────────────── x:298–362 */}
      <rect x="298" y="10" width="16" height="80" />
      <rect x="346" y="10" width="16" height="80" />
      <polygon points="314,10 330,10 362,80 346,80" />

      {/* ── APPAREL STUDIO tagline (opt-in) ── */}
      {showTagline && (
        <text
          x="181"
          y="112"
          textAnchor="middle"
          fontSize="14"
          fontFamily="'Inter', 'Helvetica Neue', sans-serif"
          fontWeight="600"
          letterSpacing="6"
          fill="currentColor"
          opacity="0.7"
        >
          APPAREL STUDIO
        </text>
      )}
    </svg>
  )
}

/**
 * Croon C-mark icon — standalone geometric C logo
 * from the reference image (double-bar C with inner channels)
 */
export function CroonIcon({ className = 'h-8' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 80 80"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Croon icon"
    >
      {/* Top bar outer */}
      <rect x="18" y="6"  width="46" height="12" />
      {/* Top bar inner channel */}
      <rect x="28" y="15" width="36" height="6" fill="white" />

      {/* Left stem outer */}
      <rect x="6"  y="6"  width="16" height="68" />
      {/* Left stem inner channel */}
      <rect x="15" y="18" width="8"  height="44" fill="white" />

      {/* Bottom bar outer */}
      <rect x="18" y="62" width="46" height="12" />
      {/* Bottom bar inner channel */}
      <rect x="28" y="59" width="36" height="6" fill="white" />
    </svg>
  )
}
