import { useState, useCallback, useEffect, useRef } from 'react';
import {
  loadTasks, saveTasks, createTask,
  loadHistory, saveHistory,
  getTasksForToday, getHealthRatio,
  loadStreak, updateStreak,
  getDecayStage, getTreeStatus,
  MAX_TREE_CAPACITY,
  loadUserState, saveUserState,
} from '../utils/store';
import { checkLevelUp } from '../utils/levels';

export function useTaskStore() {
  const [tasks,      setTasks]      = useState(() => loadTasks());
  const [history,    setHistory]    = useState(() => loadHistory());
  const [streak,     setStreak]     = useState(() => loadStreak());
  const [userState,  setUserState]  = useState(() => loadUserState());
  const [decayStage, setDecayStage] = useState(0);
  const intervalRef = useRef(null);

  // Persist tasks & update streak on every change
  useEffect(() => {
    saveTasks(tasks);
    setStreak(updateStreak(tasks));
  }, [tasks]);

  // Re-evaluate decay stage every minute
  useEffect(() => {
    const tick = () => setDecayStage(getDecayStage(tasks));
    tick();
    intervalRef.current = setInterval(tick, 60_000);
    return () => clearInterval(intervalRef.current);
  }, [tasks]);

  // ── Derived ──────────────────────────────────────────────────────────────────
  const todayTasks = getTasksForToday(tasks);
  const health     = getHealthRatio(tasks);
  const pending    = todayTasks.filter((t) => !t.completed);
  const completed  = todayTasks.filter((t) =>  t.completed);
  const treeStatus = getTreeStatus(todayTasks);

  // ── Actions ──────────────────────────────────────────────────────────────────

  const addTask = useCallback((text, category) => {
    const todayNow = getTasksForToday(loadTasks()); // latest snapshot
    if (todayNow.length >= MAX_TREE_CAPACITY) return null;
    const task = createTask(text, category);
    setTasks((prev) => [...prev, task]);
    return task;
  }, []);

  const completeTask = useCallback((id) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, completed: true, completedAt: Date.now() } : t
      )
    );
  }, []);

  const deleteTask = useCallback((id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  /**
   * Archive tasks, increment treesCompleted, and reset tree for a new cycle.
   * Returns the new level object if a level-up occurred, otherwise null.
   */
  const completeCycle = useCallback(() => {
    const snapshot = loadTasks();
    const newHistory = [
      ...loadHistory(),
      ...snapshot.map((t) => ({ ...t, cycle: Date.now() })),
    ];
    saveHistory(newHistory);
    setHistory(newHistory);

    const prevCompleted = userState.treesCompleted;
    const newCompleted  = prevCompleted + 1;
    const newState      = { ...userState, treesCompleted: newCompleted };
    saveUserState(newState);
    setUserState(newState);
    setTasks([]);

    return checkLevelUp(prevCompleted, newCompleted);
  }, [userState]);

  return {
    tasks,
    todayTasks,
    pending,
    completed,
    history,
    health,
    streak,
    userState,
    decayStage,
    treeStatus,
    addTask,
    completeTask,
    deleteTask,
    completeCycle,
  };
}
