import TreeSprite from './TreeSprite';
import { getCurrentLevel, getNextLevel } from '../utils/levels';
import './LevelBadge.css';

export default function LevelBadge({ treesCompleted }) {
  const current = getCurrentLevel(treesCompleted);
  const next    = getNextLevel(treesCompleted);

  const progress = next
    ? treesCompleted - current.treesRequired
    : current.treesRequired;
  const total = next
    ? next.treesRequired - current.treesRequired
    : current.treesRequired;

  return (
    <div className="level-badge">
      <TreeSprite level={current.key} size={20} />
      <div className="level-badge__info">
        <span className="level-badge__name">{current.label}</span>
        {next && (
          <span className="level-badge__progress">
            {progress}/{total} árboles
          </span>
        )}
      </div>
    </div>
  );
}
