import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import './WateringAnimation.css';

// Drops spread across the tree canopy (% left within the full-width overlay)
const DROPS = [
  { left: '28%' },
  { left: '36%' },
  { left: '44%' },
  { left: '52%' },
  { left: '58%' },
  { left: '32%' },
  { left: '48%' },
];

// No props needed — fixed position over the tree crown
export default function WateringAnimation() {
  const containerRef = useRef(null);

  useEffect(() => {
    const el   = containerRef.current;
    if (!el) return;
    const can  = el.querySelector('.wc__can');
    const drops = el.querySelectorAll('.wc__drop');

    const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

    // 1. Can enters from right, tilts to pour over tree
    tl.fromTo(can,
      { x: 18, y: -24, opacity: 0, rotation: 12 },
      { x: 0,  y: 0,   opacity: 1, rotation: -38, duration: 0.40 }
    );

    // 2. Drops fall from canopy top downward, staggered
    drops.forEach((drop, i) => {
      tl.fromTo(drop,
        { y: 0, opacity: 0.9, scale: 1 },
        { y: 60 + i * 5, opacity: 0, scale: 0.3, duration: 0.50 + i * 0.04,
          ease: 'power1.in' },
        0.40 + i * 0.09
      );
    });

    // 3. Can retreats
    tl.to(can,
      { x: 16, y: -18, opacity: 0, rotation: 5, duration: 0.28,
        ease: 'power2.in' },
      1.32
    );

    return () => tl.kill();
  }, []);

  return (
    <div ref={containerRef} className="wc-overlay" aria-hidden="true">
      {/* Minimalist watering can — body on right, spout angled left */}
      <svg className="wc__can" width="56" height="48" viewBox="0 0 56 48">
        {/* Body */}
        <rect x="18" y="14" width="30" height="24" rx="7"
          fill="var(--text-secondary)" opacity="0.88" />
        {/* Spout — long, curves left and slightly down */}
        <path d="M18,22 C10,22 2,25 -4,30"
          fill="none" stroke="var(--text-secondary)" strokeWidth="3.5"
          strokeLinecap="round" opacity="0.88" />
        {/* Spout tip (rose) */}
        <circle cx="-4" cy="30" r="2.5" fill="var(--text-secondary)" opacity="0.75" />
        {/* Water holes */}
        <circle cx="-6" cy="28" r="1"   fill="var(--water-color)" opacity="0.8" />
        <circle cx="-3" cy="32" r="0.8" fill="var(--water-color)" opacity="0.6" />
        {/* Handle arc (top) */}
        <path d="M24,14 C24,5 38,5 38,14"
          fill="none" stroke="var(--text-secondary)" strokeWidth="2.8"
          strokeLinecap="round" opacity="0.72" />
        {/* Fill neck */}
        <rect x="23" y="6" width="12" height="9" rx="3.5"
          fill="var(--text-muted)" opacity="0.55" />
      </svg>

      {/* Water drops */}
      {DROPS.map((d, i) => (
        <svg
          key={i}
          className="wc__drop"
          width="6" height="10" viewBox="0 0 6 10"
          style={{ left: d.left }}
        >
          <path
            d="M3,0 C3,0 0,4 0,6 C0,8.2 1.3,10 3,10 C4.7,10 6,8.2 6,6 C6,4 3,0 3,0Z"
            fill="var(--water-color)"
          />
        </svg>
      ))}
    </div>
  );
}
