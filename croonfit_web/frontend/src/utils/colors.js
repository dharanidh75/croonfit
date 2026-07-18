export const COMMON_COLORS = {
  black: "#000000",
  white: "#ffffff",
  red: "#ff0000",
  green: "#008000",
  blue: "#0000ff",
  yellow: "#ffff00",
  orange: "#ffa500",
  purple: "#800080",
  pink: "#ffc0cb",
  gray: "#808080",
  grey: "#808080",
  brown: "#a52a2a",
  navy: "#000080",
  cyan: "#00ffff",
  teal: "#008080",
  magenta: "#ff00ff",
  silver: "#c0c0c0",
  maroon: "#800000",
  olive: "#808000",
  lime: "#00ff00",
  gold: "#ffd700",
  beige: "#f5f5dc",
  lavender: "#e6e6fa",
  coral: "#ff7f50",
  indigo: "#4b0082",
  violet: "#ee82ee",
  khaki: "#f0e68c",
  plum: "#dda0dd",
  salmon: "#fa8072",
  crimson: "#dc143c",
  navyblue: "#000080",
  lightblue: "#add8e6",
  lightgreen: "#90ee90",
  darkred: "#8b0000",
  darkblue: "#00008b",
  darkgreen: "#006400",
  darkgray: "#a9a9a9",
  charcoal: "#36454f",
  cream: "#fffdd0",
  mustard: "#ffdb58",
  burgundy: "#800020",
  emerald: "#50c878",
  ruby: "#e0115f",
  sapphire: "#0f52ba",
  pearl: "#eae0c8",
  rust: "#b7410e",
  peach: "#ffe5b4",
  mint: "#3eb489",
  lilac: "#c8a2c8",
  fuchsia: "#ff00ff",
  tan: "#d2b48c",
  rose: "#ff007f",
  aqua: "#00ffff"
}

export const HEX_TO_NAME = Object.entries(COMMON_COLORS).reduce((acc, [name, hex]) => {
  if (!acc[hex]) {
    acc[hex] = name.charAt(0).toUpperCase() + name.slice(1)
  }
  return acc
}, {})

export function getHexFromName(name) {
  if (!name) return null
  const normalized = name.toLowerCase().replace(/\s+/g, '')
  return COMMON_COLORS[normalized] || null
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ] : null
}

export function getNameFromHex(hex) {
  if (!hex) return null
  const normalizedHex = hex.toLowerCase()
  
  if (HEX_TO_NAME[normalizedHex]) {
    return HEX_TO_NAME[normalizedHex]
  }

  const rgb = hexToRgb(normalizedHex)
  if (!rgb) return null

  let closestName = "Custom"
  let minDistance = Infinity

  for (const [colorName, colorHex] of Object.entries(COMMON_COLORS)) {
    const compareRgb = hexToRgb(colorHex)
    if (!compareRgb) continue

    const distance = Math.sqrt(
      Math.pow(rgb[0] - compareRgb[0], 2) +
      Math.pow(rgb[1] - compareRgb[1], 2) +
      Math.pow(rgb[2] - compareRgb[2], 2)
    )

    if (distance < minDistance) {
      minDistance = distance
      closestName = colorName.charAt(0).toUpperCase() + colorName.slice(1)
    }
  }

  return minDistance < 60 ? closestName : "Custom"
}
