/**
 * Pixel-art tree sprites for each progression level.
 * All sprites use a 32×32 viewBox; scale via the size prop.
 */

const TK = '#7A5230';  // trunk
const TH = '#9B6840';  // trunk highlight
const LG = '#5A9216';  // leaf dark green
const LL = '#8DCE38';  // leaf light green

const sprites = {
  semilla: (
    <>
      <rect x="12" y="19" width="8"  height="7"  fill={TK} />
      <rect x="10" y="22" width="12" height="4"  fill="#5C3A18" />
      <rect x="15" y="13" width="2"  height="7"  fill={LG} />
      <rect x="12" y="13" width="8"  height="4"  fill={LG} />
      <rect x="13" y="14" width="6"  height="2"  fill={LL} />
    </>
  ),

  brote: (
    <>
      <rect x="15" y="17" width="2"  height="9"  fill={TK} />
      <rect x="7"  y="11" width="8"  height="8"  fill={LG} />
      <rect x="9"  y="13" width="4"  height="4"  fill={LL} />
      <rect x="17" y="8"  width="8"  height="8"  fill={LG} />
      <rect x="19" y="10" width="4"  height="4"  fill={LL} />
    </>
  ),

  arbolito: (
    <>
      <rect x="13" y="18" width="6"  height="8"  fill={TK} />
      <rect x="17" y="18" width="2"  height="8"  fill={TH} />
      <rect x="5"  y="15" width="8"  height="3"  fill={TK} />
      <rect x="19" y="15" width="8"  height="3"  fill={TK} />
      <rect x="6"  y="8"  width="10" height="10" fill={LG} />
      <rect x="16" y="8"  width="10" height="10" fill={LG} />
      <rect x="9"  y="4"  width="14" height="11" fill={LG} />
      <rect x="8"  y="10" width="6"  height="5"  fill={LL} />
      <rect x="18" y="10" width="6"  height="5"  fill={LL} />
      <rect x="11" y="6"  width="10" height="6"  fill={LL} />
    </>
  ),

  roble: (
    <>
      <rect x="12" y="19" width="8"  height="7"  fill={TK} />
      <rect x="18" y="19" width="2"  height="7"  fill={TH} />
      <rect x="4"  y="15" width="8"  height="3"  fill={TK} />
      <rect x="20" y="15" width="8"  height="3"  fill={TK} />
      <rect x="2"  y="8"  width="12" height="10" fill={LG} />
      <rect x="4"  y="10" width="7"  height="6"  fill={LL} />
      <rect x="18" y="8"  width="12" height="10" fill={LG} />
      <rect x="20" y="10" width="7"  height="6"  fill={LL} />
      <rect x="8"  y="3"  width="16" height="12" fill={LG} />
      <rect x="10" y="5"  width="12" height="7"  fill={LL} />
    </>
  ),

  centenario: (
    <>
      <rect x="4"  y="22" width="8"  height="3"  fill={TK} />
      <rect x="20" y="22" width="8"  height="3"  fill={TK} />
      <rect x="11" y="14" width="10" height="11" fill={TK} />
      <rect x="19" y="14" width="2"  height="11" fill={TH} />
      <rect x="3"  y="11" width="8"  height="3"  fill={TK} />
      <rect x="21" y="11" width="8"  height="3"  fill={TK} />
      <rect x="1"  y="4"  width="12" height="10" fill={LG} />
      <rect x="3"  y="6"  width="7"  height="6"  fill={LL} />
      <rect x="19" y="4"  width="12" height="10" fill={LG} />
      <rect x="21" y="6"  width="7"  height="6"  fill={LL} />
      <rect x="7"  y="1"  width="18" height="12" fill={LG} />
      <rect x="9"  y="3"  width="14" height="7"  fill={LL} />
    </>
  ),

  bonsai: (
    <>
      <rect x="13" y="19" width="6"  height="7"  fill={TK} />
      <rect x="17" y="19" width="2"  height="7"  fill={TH} />
      <rect x="2"  y="15" width="11" height="3"  fill={TK} />
      <rect x="19" y="15" width="11" height="3"  fill={TK} />
      <rect x="1"  y="8"  width="12" height="10" fill={LG} />
      <rect x="3"  y="10" width="7"  height="6"  fill={LL} />
      <rect x="19" y="8"  width="12" height="10" fill={LG} />
      <rect x="21" y="10" width="7"  height="6"  fill={LL} />
      <rect x="9"  y="5"  width="14" height="10" fill={LG} />
      <rect x="11" y="7"  width="10" height="5"  fill={LL} />
    </>
  ),
};

export default function TreeSprite({ level = 'semilla', size = 24 }) {
  const content = sprites[level] ?? sprites.semilla;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      style={{ imageRendering: 'pixelated', display: 'block', flexShrink: 0 }}
      aria-hidden="true"
    >
      {content}
    </svg>
  );
}
