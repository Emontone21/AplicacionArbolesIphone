import './Stats.css';

export default function Stats({ pending, completed, totalLeaves }) {
  return (
    <div className="stats">
      <div className="stats__item">
        <span className="stats__value">{pending}</span>
        <span className="stats__label">Pendientes</span>
      </div>
      <div className="stats__divider" />
      <div className="stats__item">
        <span className="stats__value stats__value--completed">{completed}</span>
        <span className="stats__label">Completadas</span>
      </div>
      <div className="stats__divider" />
      <div className="stats__item">
        <span className="stats__value">{totalLeaves}</span>
        <span className="stats__label">Hojas</span>
      </div>
    </div>
  );
}
