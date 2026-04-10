import { useEffect } from 'react';
import TreeSprite from './TreeSprite';
import './LevelUpModal.css';

export default function LevelUpModal({ level, onContinue }) {
  // Close on Escape
  useEffect(() => {
    const fn = (e) => { if (e.key === 'Escape') onContinue(); };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [onContinue]);

  return (
    <div className="levelup-overlay" onClick={onContinue}>
      <div className="levelup-modal" onClick={(e) => e.stopPropagation()}>
        {/* Pixel confetti */}
        <div className="levelup-modal__confetti" aria-hidden="true">
          {CONFETTI.map((c, i) => (
            <span
              key={i}
              className="levelup-modal__pixel"
              style={{
                '--px': c.x,
                '--py': c.y,
                '--pc': c.color,
                '--pd': `${c.delay}s`,
              }}
            />
          ))}
        </div>

        <div className="levelup-modal__sprite">
          <TreeSprite level={level.key} size={80} />
        </div>

        <p className="levelup-modal__label">nuevo nivel</p>
        <h2 className="levelup-modal__title">{level.label}</h2>
        <p className="levelup-modal__desc">{level.description}</p>

        <div className="levelup-modal__unlock">
          <span className="levelup-modal__unlock-label">desbloqueado</span>
          <span className="levelup-modal__unlock-value">{level.unlockedFeature}</span>
        </div>

        <button className="levelup-modal__btn" onClick={onContinue}>
          Continuar
        </button>
      </div>
    </div>
  );
}

// Pre-generated confetti pixel positions
const PIXEL_COLORS = ['#5A9216', '#8DCE38', '#378ADD', '#D4537E', '#7F77DD', '#F5A623'];
const CONFETTI = Array.from({ length: 24 }, (_, i) => ({
  x: `${((i * 37 + 11) % 90) + 5}%`,
  y: `${((i * 53 + 7)  % 70) + 5}%`,
  color: PIXEL_COLORS[i % PIXEL_COLORS.length],
  delay: (i * 0.07).toFixed(2),
}));
