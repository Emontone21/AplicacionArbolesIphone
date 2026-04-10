import { useState } from 'react';
import { CATEGORIES, MAX_TREE_CAPACITY } from '../utils/store';
import './TaskInput.css';

const categoryKeys = Object.keys(CATEGORIES);

const BLOCK_MESSAGES = {
  full_none_complete: `El árbol está lleno (${MAX_TREE_CAPACITY} hojas). Completá alguna tarea para poder agregar más.`,
  full_partial:       `El árbol está lleno. Terminá las tareas pendientes para liberar espacio.`,
};

export default function TaskInput({ onAdd, treeStatus }) {
  const [text,     setText]     = useState('');
  const [category, setCategory] = useState('trabajo');

  const isBlocked =
    treeStatus === 'full_none_complete' ||
    treeStatus === 'full_partial';

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || isBlocked) return;
    onAdd(trimmed, category);
    setText('');
  };

  return (
    <div className="task-input-wrap">
      {/* Blocked notice */}
      {isBlocked && (
        <div className="task-input__blocked">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {BLOCK_MESSAGES[treeStatus]}
        </div>
      )}

      <form className={`task-input ${isBlocked ? 'task-input--blocked' : ''}`} onSubmit={handleSubmit}>
        {/* Category chips */}
        <div className="task-input__categories">
          {categoryKeys.map((key) => (
            <button
              key={key}
              type="button"
              className={`task-input__chip ${category === key ? 'task-input__chip--active' : ''}`}
              onClick={() => setCategory(key)}
              disabled={isBlocked}
              style={{ '--chip-color': CATEGORIES[key].color }}
            >
              {CATEGORIES[key].label}
            </button>
          ))}
        </div>

        {/* Input row */}
        <div className="task-input__row">
          <input
            type="text"
            className="task-input__field"
            placeholder={isBlocked ? 'Árbol lleno…' : 'Nueva tarea…'}
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={isBlocked}
            maxLength={120}
          />
          <button
            type="submit"
            className="task-input__btn"
            disabled={!text.trim() || isBlocked}
            aria-label="Agregar tarea"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5"  y1="12" x2="19" y2="12" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}
