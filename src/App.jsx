import { useState, useEffect, useCallback } from 'react';
import { useTaskStore } from './hooks/useTaskStore';
import Header        from './components/Header';
import Tree          from './components/Tree';
import HealthBar     from './components/HealthBar';
import Stats         from './components/Stats';
import TaskInput     from './components/TaskInput';
import TaskList      from './components/TaskList';
import LevelUpModal  from './components/LevelUpModal';
import './App.css';

const THEME_KEY      = 'mi-arbol-theme';
const CLEAR_DELAY_MS = 400;  // ms after last task completes before showing banner

export default function App() {
  // ── Theme ──────────────────────────────────────────────────────────────────
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    localStorage.setItem(THEME_KEY, darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const fn = (e) => { if (!localStorage.getItem(THEME_KEY)) setDarkMode(e.matches); };
    mq.addEventListener('change', fn);
    return () => mq.removeEventListener('change', fn);
  }, []);

  // ── Store ──────────────────────────────────────────────────────────────────
  const {
    todayTasks, pending, completed,
    health, streak, userState, decayStage, treeStatus,
    addTask, completeTask, deleteTask, completeCycle,
  } = useTaskStore();

  const [showCycleMsg,  setShowCycleMsg]  = useState(false);
  const [clearingTree,  setClearingTree]  = useState(false);
  const [levelUpEvent,  setLevelUpEvent]  = useState(null);

  // Show "Nuevo ciclo" banner when tree becomes full_all_complete
  useEffect(() => {
    if (treeStatus === 'full_all_complete') {
      const t = setTimeout(() => setShowCycleMsg(true), CLEAR_DELAY_MS);
      return () => clearTimeout(t);
    } else {
      setShowCycleMsg(false);
    }
  }, [treeStatus]);

  // ── Complete task immediately ───────────────────────────────────────────────
  const handleComplete = useCallback((id) => {
    completeTask(id);
  }, [completeTask]);

  // ── New cycle ───────────────────────────────────────────────────────────────
  const handleNewCycle = () => {
    setClearingTree(true);
    setShowCycleMsg(false);
    setTimeout(() => {
      const levelUp = completeCycle();
      setClearingTree(false);
      if (levelUp) setLevelUpEvent(levelUp);
    }, 500);
  };

  return (
    <div className="app">
      <Header
        streak={streak}
        treesCompleted={userState.treesCompleted}
        darkMode={darkMode}
        onToggleDark={() => setDarkMode((d) => !d)}
      />

      {/* Tree */}
      <div className={`app__tree-wrap ${clearingTree ? 'app__tree-wrap--clearing' : ''}`}>
        <Tree
          todayTasks={todayTasks}
          decayStage={decayStage}
          onCompleteTask={handleComplete}
        />
      </div>

      {/* "Nuevo ciclo" banner */}
      {showCycleMsg && (
        <div className="cycle-banner">
          <div className="cycle-banner__left">
            <span className="cycle-banner__icon">🌳</span>
            <div>
              <p className="cycle-banner__title">¡Árbol completo!</p>
              <p className="cycle-banner__sub">Todas las tareas completadas.</p>
            </div>
          </div>
          <button className="cycle-banner__btn" onClick={handleNewCycle}>
            Nuevo ciclo
          </button>
        </div>
      )}

      <HealthBar health={health} />

      <Stats
        pending={pending.length}
        completed={completed.length}
        totalLeaves={todayTasks.length}
      />

      <div className="app__divider" />

      <TaskInput
        onAdd={addTask}
        treeStatus={treeStatus}
      />

      <TaskList
        pending={pending}
        completed={completed}
        onComplete={handleComplete}
        onDelete={deleteTask}
      />

      {levelUpEvent && (
        <LevelUpModal
          level={levelUpEvent}
          onContinue={() => setLevelUpEvent(null)}
        />
      )}
    </div>
  );
}
