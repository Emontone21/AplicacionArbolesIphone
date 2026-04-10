import { useState } from 'react';
import { CATEGORIES } from '../utils/store';
import './TaskList.css';

export default function TaskList({
  pending,
  completed,
  onComplete,
  onDelete,
}) {
  const [historialOpen, setHistorialOpen] = useState(false);

  const hasCompleted = completed.length > 0;

  return (
    <div className="task-list">
      {/* Empty state */}
      {pending.length === 0 && !hasCompleted && (
        <p className="task-list__empty">
          Agrega una tarea para que crezca una hoja en tu árbol
        </p>
      )}

      {/* ── Pending tasks (main list) ── */}
      {pending.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onComplete={() => onComplete(task.id)}
          onDelete={() => onDelete(task.id)}
        />
      ))}

      {/* ── Historial ── */}
      {hasCompleted && (
        <div className="historial">
          <button
            className="historial__toggle"
            onClick={() => setHistorialOpen((o) => !o)}
            aria-expanded={historialOpen}
          >
            <span className="historial__label">
              Historial de hoy
              <span className="historial__count">{completed.length}</span>
            </span>
            <svg
              className={`historial__chevron ${historialOpen ? 'historial__chevron--open' : ''}`}
              width="16" height="16" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {historialOpen && (
            <div className="historial__list">
              {completed.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onDelete={() => onDelete(task.id)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function TaskItem({ task, onComplete, onDelete }) {
  const cat = CATEGORIES[task.category];

  return (
    <div
      className={`task-item ${task.completed ? 'task-item--done' : ''}`}
    >
      {/* Check button */}
      <button
        className="task-item__check"
        onClick={onComplete}
        disabled={task.completed}
        aria-label={task.completed ? 'Completada' : 'Completar tarea'}
        style={{ '--check-color': cat.color }}
      >
        {task.completed ? (
          <svg width="14" height="14" viewBox="0 0 24 24"
            fill="none" stroke={cat.color} strokeWidth="3"
            strokeLinecap="round" strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          <span className="task-item__circle" />
        )}
      </button>

      {/* Text */}
      <span className="task-item__text">{task.text}</span>

      {/* Category badge */}
      <span
        className="task-item__badge"
        style={{
          color: cat.color,
          background: `color-mix(in srgb, ${cat.color} 12%, transparent)`,
        }}
      >
        {cat.label}
      </span>

      {/* Delete */}
      <button className="task-item__delete" onClick={onDelete} aria-label="Eliminar tarea">
        <svg width="13" height="13" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6"  y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
}
