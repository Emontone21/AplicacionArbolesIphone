import { useEffect, useRef } from 'react';
import { LEAF_POSITIONS, FALLEN_POSITIONS, GW, GH } from '../utils/treeLayout';
import { CATEGORIES } from '../utils/store';
import './Tree.css';

// ── Pixel-art leaf shape (game units, origin top-left) ────────────────────────
// 5 wide × 6 tall. Stem base at (2, 5) — translate so this anchors to twig tip.
const LEAF_BODY = [
  [1,0],[2,0],[3,0],
  [0,1],[1,1],[2,1],[3,1],[4,1],
  [0,2],[1,2],[2,2],[3,2],[4,2],
  [1,3],[2,3],[3,3],
  [2,4],
  [2,5],
];
const LEAF_VEIN = [
  [2,1],[2,2],[2,3],
];

// ── Pending leaf colors per decay stage ──────────────────────────────────────
const PENDING = [
  { outer: '#6E7060', inner: '#A0A28E' },  // 0 healthy
  { outer: '#9A8030', inner: '#C8AA50' },  // 1 yellowing
  { outer: '#7A5020', inner: '#AA7040' },  // 2 browning
  { outer: '#503018', inner: '#784830' },  // 3 dying
];

// ── Tree palette per decay stage ──────────────────────────────────────────────
const PALETTES = [
  { t1:'#8B6F47', t2:'#A07840', t3:'#6B5030', t4:'#7A6038', r1:'#7A5E38', r2:'#5A4020', gnd1:'#C8C0A8', gnd2:'#B8B098', gnd3:'#D8D2C0', gr2:'#5A6030' },
  { t1:'#7A6040', t2:'#8A6830', t3:'#5A4020', t4:'#6A5028', r1:'#6A5030', r2:'#4A3010', gnd1:'#C8C0A8', gnd2:'#B8B098', gnd3:'#D8D2C0', gr2:'#5A6030' },
  { t1:'#6A5035', t2:'#785828', t3:'#4A3018', t4:'#5A4020', r1:'#5A4028', r2:'#3A2008', gnd1:'#C8C0A8', gnd2:'#B8B098', gnd3:'#D8D2C0', gr2:'#5A6030' },
  { t1:'#503025', t2:'#583820', t3:'#382010', t4:'#402818', r1:'#402820', r2:'#280808', gnd1:'#C8C0A8', gnd2:'#B8B098', gnd3:'#D8D2C0', gr2:'#5A6030' },
];

// ── Canvas drawing ────────────────────────────────────────────────────────────

function drawTree(ctx, C) {
  ctx.clearRect(0, 0, GW, GH);

  function px(x, y, c) {
    if (x < 0 || x >= GW || y < 0 || y >= GH) return;
    ctx.fillStyle = c;
    ctx.fillRect(x, y, 1, 1);
  }

  function line(x0, y0, x1, y1, c, c2) {
    const dx = Math.abs(x1 - x0), dy = Math.abs(y1 - y0);
    const sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
    let err = dx - dy, x = x0, y = y0;
    while (true) {
      px(x, y, c);
      if (c2) px(x, y - 1, c2);
      if (x === x1 && y === y1) break;
      const e2 = 2 * err;
      if (e2 > -dy) { err -= dy; x += sx; }
      if (e2 <  dx) { err += dx; y += sy; }
    }
  }

  // Ground
  for (let x = 0; x < GW; x++) {
    px(x, GH - 4, C.gnd2);
    px(x, GH - 3, C.gnd1);
    px(x, GH - 2, C.gnd3);
    px(x, GH - 1, C.gnd2);
  }
  // Grass
  for (let x = 0; x < GW; x += 3) {
    px(x, GH - 5, C.gr2);
    if (x % 6 === 0) px(x + 1, GH - 6, C.gr2);
  }

  // Roots
  [[37,GH-7],[36,GH-6],[35,GH-5],[34,GH-5],[33,GH-5]].forEach(([x, y]) => {
    px(x, y, C.r1); px(x - 1, y, C.r2);
  });
  [[43,GH-7],[44,GH-6],[45,GH-5],[46,GH-5],[47,GH-5]].forEach(([x, y]) => {
    px(x, y, C.r1); px(x + 1, y, C.r2);
  });

  // Trunk — low section (6px wide)
  for (let y = GH - 24; y < GH - 4; y++) {
    px(37, y, C.t3); px(38, y, C.t1); px(39, y, C.t1);
    px(40, y, C.t2); px(41, y, C.t1); px(42, y, C.t3);
    if (y % 5 === 0) px(38, y, C.t2);
    if (y % 7 === 2) px(41, y, C.t3);
    if (y % 4 === 1) px(39, y, C.t4);
  }
  // Trunk — mid section (4px wide)
  for (let y = GH - 44; y < GH - 24; y++) {
    px(38, y, C.t3); px(39, y, C.t1); px(40, y, C.t2); px(41, y, C.t3);
    if (y % 5 === 0) px(39, y, C.t4);
    if (y % 6 === 3) px(40, y, C.t1);
  }
  // Trunk — upper (2px)
  for (let y = GH - 58; y < GH - 44; y++) {
    px(39, y, C.t1); px(40, y, C.t2);
    if (y % 4 === 0) px(39, y, C.t3);
  }
  // Trunk — very upper (2px)
  for (let y = GH - 68; y < GH - 58; y++) {
    px(39, y, C.t1); px(40, y, C.t3);
  }
  // Crown trunk (2px)
  for (let y = GH - 76; y < GH - 68; y++) {
    px(39, y, C.t2); px(40, y, C.t3);
  }

  // ── Branches level 1 ─────────────────────────────────────────────────────
  line(38, GH-30, 26, GH-38, C.t1, C.t3);
  line(26, GH-38, 20, GH-44, C.t1, C.t3);
  line(26, GH-38, 23, GH-46, C.t4, null);

  line(41, GH-31, 54, GH-39, C.t1, C.t3);
  line(54, GH-39, 60, GH-45, C.t1, C.t3);
  line(54, GH-39, 57, GH-47, C.t4, null);

  // ── Branches level 2 ─────────────────────────────────────────────────────
  line(39, GH-46, 28, GH-54, C.t1, C.t3);
  line(28, GH-54, 22, GH-60, C.t1, C.t3);
  line(28, GH-54, 25, GH-62, C.t4, null);

  line(40, GH-47, 52, GH-55, C.t1, C.t3);
  line(52, GH-55, 58, GH-61, C.t1, C.t3);
  line(52, GH-55, 55, GH-63, C.t4, null);

  // ── Branches level 3 ─────────────────────────────────────────────────────
  line(39, GH-60, 32, GH-67, C.t1, C.t3);
  line(32, GH-67, 27, GH-73, C.t4, null);
  line(32, GH-67, 29, GH-74, C.t3, null);

  line(40, GH-61, 47, GH-68, C.t1, C.t3);
  line(47, GH-68, 52, GH-74, C.t4, null);
  line(47, GH-68, 50, GH-75, C.t3, null);

  // ── Branches level 4 (fine) ───────────────────────────────────────────────
  line(39, GH-69, 35, GH-75, C.t1, C.t3);
  line(35, GH-75, 32, GH-80, C.t4, null);
  line(35, GH-75, 33, GH-81, C.t3, null);

  line(40, GH-70, 44, GH-76, C.t1, C.t3);
  line(44, GH-76, 47, GH-81, C.t4, null);
  line(44, GH-76, 46, GH-82, C.t3, null);

  line(39, GH-76, 37, GH-82, C.t2, C.t3);
  line(37, GH-82, 35, GH-87, C.t4, null);

  line(40, GH-77, 42, GH-83, C.t2, C.t3);
  line(42, GH-83, 44, GH-88, C.t4, null);

  // Central crown shoot
  line(39, GH-77, 39, GH-84, C.t1, null);
  line(39, GH-84, 38, GH-89, C.t4, null);
  line(39, GH-84, 40, GH-89, C.t3, null);

  // ── Twigs (where leaves attach) ───────────────────────────────────────────
  const twigs = [
    [20,GH-44, 17,GH-47], [20,GH-44, 19,GH-48],
    [23,GH-46, 21,GH-49], [23,GH-46, 24,GH-49],
    [60,GH-45, 62,GH-48], [60,GH-45, 60,GH-49],
    [57,GH-47, 58,GH-50], [57,GH-47, 55,GH-50],
    [22,GH-60, 19,GH-63], [22,GH-60, 21,GH-64],
    [25,GH-62, 23,GH-65], [25,GH-62, 26,GH-65],
    [58,GH-61, 61,GH-64], [58,GH-61, 59,GH-65],
    [55,GH-63, 56,GH-66], [55,GH-63, 53,GH-66],
    [27,GH-73, 25,GH-76], [27,GH-73, 28,GH-76],
    [29,GH-74, 27,GH-77], [29,GH-74, 30,GH-77],
    [52,GH-74, 54,GH-77], [50,GH-75, 51,GH-78],
    [32,GH-80, 30,GH-83], [32,GH-80, 33,GH-83],
    [33,GH-81, 31,GH-84], [47,GH-81, 49,GH-84],
    [47,GH-81, 46,GH-84], [35,GH-87, 33,GH-90],
    [35,GH-87, 36,GH-90], [44,GH-88, 46,GH-91],
    [44,GH-88, 43,GH-91], [38,GH-89, 36,GH-92],
    [40,GH-89, 42,GH-92], [39,GH-89, 39,GH-93],
  ];
  twigs.forEach(([x0, y0, x1, y1]) => {
    line(x0, y0, x1, y1, C.t4, null);
    px(x1, y1, C.t3);
  });
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function Tree({ todayTasks, decayStage, onCompleteTask }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    drawTree(ctx, PALETTES[decayStage] ?? PALETTES[0]);
  }, [decayStage]);

  const pd = PENDING[decayStage] ?? PENDING[0];

  const fallenCount = decayStage >= 3 ? FALLEN_POSITIONS.length
                    : decayStage === 2 ? Math.ceil(FALLEN_POSITIONS.length / 2)
                    : 0;

  return (
    <div className="tree-container">
      <div className="tree-pixel-wrap">
        {/* Tree structure — drawn on canvas for pixel-perfect Bresenham lines */}
        <canvas
          ref={canvasRef}
          width={GW}
          height={GH}
          className="tree-canvas"
          aria-hidden="true"
        />

        {/* Leaves — SVG overlay, interactive + animated via CSS */}
        <svg
          viewBox={`0 0 ${GW} ${GH}`}
          className="tree-leaves-svg pixel-tree"
          shapeRendering="crispEdges"
          overflow="visible"
          role="img"
          aria-label="Árbol de productividad"
        >
          {todayTasks.map((task, i) => {
            const pos = LEAF_POSITIONS[i % LEAF_POSITIONS.length];
            const isCompleted = task.completed;
            const cat = CATEGORIES[task.category];

            const outerColor = isCompleted ? cat.color : pd.outer;
            const innerColor = isCompleted ? cat.light  : pd.inner;

            const decayClass = !isCompleted ? `leaf--decay-${decayStage}` : '';
            const doneClass  = isCompleted  ? 'leaf--completed'            : 'leaf--pending';

            const sign   = i % 2 === 0 ? -1 : 1;
            const fallDx = `${sign * (10 + (i % 7) * 5)}px`;
            const fallRot = `${80 + i * 15}deg`;

            return (
              <g
                key={task.id}
                transform={`translate(${pos.x - 2}, ${pos.y - 5})`}
              >
                <g
                  className={`leaf ${doneClass} ${decayClass}`}
                  onClick={!isCompleted ? () => onCompleteTask(task.id) : undefined}
                  style={{
                    cursor: !isCompleted ? 'pointer' : 'default',
                    '--leaf-idx': i,
                    '--fall-dx':  fallDx,
                    '--fall-rot': fallRot,
                  }}
                >
                  {/* transparent hit area */}
                  <rect x={0} y={0} width={5} height={6} fill="transparent" />
                  {LEAF_BODY.map(([px, py]) => (
                    <rect key={`b${px}${py}`} x={px} y={py} width={1} height={1} fill={outerColor} className="leaf__body" />
                  ))}
                  {LEAF_VEIN.map(([px, py]) => (
                    <rect key={`v${px}${py}`} x={px} y={py} width={1} height={1} fill={innerColor} className="leaf__vein" />
                  ))}
                  <title>
                    {task.text} ({cat.label})
                    {!isCompleted ? ' — click para completar' : ' — completada'}
                  </title>
                </g>
              </g>
            );
          })}

          {/* Fallen leaves at ground (decay stages 2–3) */}
          {FALLEN_POSITIONS.slice(0, fallenCount).map((pos, i) => (
            <g key={`fallen-${i}`} transform={`translate(${pos.x - 2}, ${pos.y - 5})`}>
              <g className="leaf leaf--fallen" style={{ '--fallen-delay': `${i * 0.4}s` }}>
                {LEAF_BODY.map(([px, py]) => (
                  <rect key={`fb${px}${py}`} x={px} y={py} width={1} height={1} fill={pd.outer} className="leaf__body" />
                ))}
                {LEAF_VEIN.map(([px, py]) => (
                  <rect key={`fv${px}${py}`} x={px} y={py} width={1} height={1} fill={pd.inner} className="leaf__vein" />
                ))}
              </g>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
