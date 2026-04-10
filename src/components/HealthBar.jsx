import './HealthBar.css';

export default function HealthBar({ health }) {
  const color =
    health >= 0.6
      ? 'var(--health-good)'
      : health >= 0.3
        ? 'var(--health-mid)'
        : 'var(--health-bad)';

  return (
    <div className="health-bar" role="progressbar" aria-valuenow={Math.round(health * 100)} aria-valuemin="0" aria-valuemax="100">
      <div
        className="health-bar__fill"
        style={{ width: `${health * 100}%`, background: color }}
      />
    </div>
  );
}
