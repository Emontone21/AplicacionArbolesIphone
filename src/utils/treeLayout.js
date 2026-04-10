/**
 * Pixel-art tree layout — game grid 80×110.
 * Leaf positions are the twig endpoint coordinates from the Bresenham tree.
 * Fill order: lower/outer branches first → upper/inner last.
 */

export const GW = 80;   // game grid width
export const GH = 110;  // game grid height

// ── 20 leaf positions (game grid coords, twig tip where stem attaches) ────────
// 5 per level, filling bottom-to-top across all 4 branch levels.
export const LEAF_POSITIONS = [
  // Nivel 1 — widest/lowest branches (5 leaves)
  { x: 17, y: 63 }, { x: 62, y: 62 },
  { x: 19, y: 62 }, { x: 60, y: 61 },
  { x: 21, y: 61 },
  // Nivel 2 — mid branches (5 leaves)
  { x: 19, y: 47 }, { x: 61, y: 46 },
  { x: 21, y: 46 }, { x: 59, y: 45 },
  { x: 26, y: 45 },
  // Nivel 3 — upper branches (5 leaves)
  { x: 25, y: 34 }, { x: 52, y: 36 },
  { x: 27, y: 33 }, { x: 51, y: 32 },
  { x: 29, y: 33 },
  // Nivel 4 — crown branches (5 leaves)
  { x: 30, y: 27 }, { x: 49, y: 26 },
  { x: 33, y: 20 }, { x: 46, y: 19 },
  { x: 39, y: 17 },
];

export const MAX_LEAVES = LEAF_POSITIONS.length; // 20

export function getLeafPosition(index) {
  return LEAF_POSITIONS[index % MAX_LEAVES];
}

// ── Fallen leaves at ground level (decay stages 2-3) ─────────────────────────
export const FALLEN_POSITIONS = [
  { x: 25, y: 104 }, { x: 33, y: 105 },
  { x: 43, y: 104 }, { x: 51, y: 105 },
  { x: 57, y: 104 }, { x: 28, y: 106 },
];
