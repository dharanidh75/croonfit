import React from 'react'

/**
 * CROONFIT SVG Logotype
 * - Ultra-heavy block lettering (stencil aesthetic)
 * - Letter O: square frame with diagonal slash (custom glyph)
 * - All paths constructed from geometric rects / polygons
 * - Single colour via `currentColor` so it works on dark & light
 */
export function Logo({ className = 'h-8' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 680 100"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Croonfit"
    >
      {/* ── C ───────────────────────────────── x:0–60 */}
      {/* Outer block */}
      <rect x="0"  y="10" width="62" height="16" />  {/* top bar */}
      <rect x="0"  y="74" width="62" height="16" />  {/* bottom bar */}
      <rect x="0"  y="10" width="16" height="80" />  {/* left stem */}

      {/* ── R ───────────────────────────────── x:72–134 */}
      <rect x="72" y="10" width="16" height="80" />  {/* left stem */}
      <rect x="72" y="10" width="62" height="16" />  {/* top */}
      <rect x="72" y="46" width="50" height="14" />  {/* mid bar */}
      <rect x="118" y="10" width="16" height="50" /> {/* right upper */}
      {/* diagonal leg from mid to bottom-right */}
      <polygon points="116,60 134,60 134,90 118,90" />

      {/* ── O ① ─────────────────────────────── x:146–210 */}
      {/* outer square */}
      <rect x="146" y="10" width="64" height="80" />
      {/* punch out inner */}
      <rect x="162" y="26" width="32" height="48" fill="white" />
      {/* diagonal slash — top-left to bottom-right */}
      <line x1="148" y1="12" x2="208" y2="88" stroke="currentColor" strokeWidth="8" />

      {/* ── O ② ─────────────────────────────── x:222–286 */}
      <rect x="222" y="10" width="64" height="80" />
      <rect x="238" y="26" width="32" height="48" fill="white" />
      <line x1="224" y1="12" x2="284" y2="88" stroke="currentColor" strokeWidth="8" />

      {/* ── N ───────────────────────────────── x:298–362 */}
      <rect x="298" y="10" width="16" height="80" />  {/* left stem */}
      <rect x="346" y="10" width="16" height="80" />  {/* right stem */}
      {/* diagonal connector */}
      <polygon points="314,10 330,10 362,80 346,80" />

      {/* ── F ───────────────────────────────── x:374–434 */}
      <rect x="374" y="10" width="16" height="80" />  {/* stem */}
      <rect x="374" y="10" width="60" height="16" />  {/* top bar */}
      <rect x="374" y="46" width="46" height="14" />  {/* mid bar */}

      {/* ── I ───────────────────────────────── x:446–490 */}
      <rect x="446" y="10" width="44" height="16" />  {/* top */}
      <rect x="446" y="74" width="44" height="16" />  {/* bottom */}
      <rect x="457" y="10" width="16" height="80" />  {/* stem */}

      {/* ── T ───────────────────────────────── x:502–566 */}
      <rect x="502" y="10" width="64" height="16" />  {/* top */}
      <rect x="526" y="26" width="16" height="64" />  {/* stem */}
    </svg>
  )
}
