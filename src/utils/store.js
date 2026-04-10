const STORAGE_KEY    = 'mi-arbol-tasks';
const STREAK_KEY     = 'mi-arbol-streak';
const HISTORY_KEY    = 'mi-arbol-history';
const USER_STATE_KEY = 'arbol_user_state';

export const CATEGORIES = {
  trabajo:  { label: 'Trabajo',  color: '#378ADD', vein: '#185FA5', light: '#7AB5F0' },
  personal: { label: 'Personal', color: '#D4537E', vein: '#993556', light: '#F0A0BC' },
  salud:    { label: 'Salud',    color: '#5A9216', vein: '#3B6D11', light: '#96D438' },
  estudio:  { label: 'Estudio',  color: '#7F77DD', vein: '#534AB7', light: '#B8B2F5' },
};

// Max leaves the tree can hold
export const MAX_TREE_CAPACITY = 20;

// Decay stage thresholds (hours without any completion)
const DECAY_HOURS = [0, 24, 48, 72];

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

// ── Tasks ─────────────────────────────────────────────────────────────────────

export function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function saveTasks(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

export function createTask(text, category) {
  return {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    text,
    category,
    completed:   false,
    createdAt:   Date.now(),
    completedAt: null,
  };
}

export function getTasksForToday(tasks) {
  const today = todayKey();
  return tasks.filter((t) => {
    const created   = new Date(t.createdAt).toISOString().slice(0, 10);
    const completed = t.completedAt
      ? new Date(t.completedAt).toISOString().slice(0, 10)
      : null;
    return created === today || completed === today || (!t.completed && created <= today);
  });
}

export function getHealthRatio(tasks) {
  const todayTasks = getTasksForToday(tasks);
  if (todayTasks.length === 0) return 1;
  const completed = todayTasks.filter((t) => t.completed).length;
  return completed / todayTasks.length;
}

// ── History ───────────────────────────────────────────────────────────────────

export function loadHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function saveHistory(history) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

// ── Streak ────────────────────────────────────────────────────────────────────

export function loadStreak() {
  try {
    const raw = localStorage.getItem(STREAK_KEY);
    if (!raw) return { count: 0, lastDate: null };
    return JSON.parse(raw);
  } catch { return { count: 0, lastDate: null }; }
}

export function updateStreak(tasks) {
  const streak     = loadStreak();
  const today      = todayKey();
  const todayTasks = getTasksForToday(tasks);
  const allCompleted = todayTasks.length > 0 && todayTasks.every((t) => t.completed);

  if (!allCompleted || streak.lastDate === today) return streak;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yKey = yesterday.toISOString().slice(0, 10);

  const newStreak = {
    count: streak.lastDate === yKey ? streak.count + 1 : 1,
    lastDate: today,
  };
  localStorage.setItem(STREAK_KEY, JSON.stringify(newStreak));
  return newStreak;
}

// ── Decay ─────────────────────────────────────────────────────────────────────

export function getTimeSinceLastCompletion(tasks) {
  const completed = tasks.filter((t) => t.completedAt);
  if (completed.length === 0) return Infinity;
  const last = Math.max(...completed.map((t) => t.completedAt));
  return Date.now() - last;
}

/**
 * "Last activity" = most recent of: last completion OR last task creation.
 * This resets the decay clock whenever the user adds or completes a task.
 */
function getTimeSinceLastActivity(tasks) {
  if (tasks.length === 0) return 0;
  const timestamps = [
    ...tasks.filter((t) => t.completedAt).map((t) => t.completedAt),
    ...tasks.map((t) => t.createdAt),
  ];
  const last = Math.max(...timestamps);
  return Date.now() - last;
}

/**
 * Decay stage 0–3 based on hours since last activity.
 * ONLY decays when there are pending tasks (nothing to decay if tree is empty
 * or all tasks are complete).
 *
 * 0 = healthy   (<24 h since last activity, or no pending tasks)
 * 1 = yellowing (24–48 h)
 * 2 = withering (48–72 h)
 * 3 = dying     (>72 h)
 */
export function getDecayStage(tasks) {
  const pending = tasks.filter((t) => !t.completed);
  if (pending.length === 0) return 0;          // nothing to decay

  const ms    = getTimeSinceLastActivity(tasks);
  const hours = ms / (1000 * 60 * 60);
  if (hours < DECAY_HOURS[1]) return 0;
  if (hours < DECAY_HOURS[2]) return 1;
  if (hours < DECAY_HOURS[3]) return 2;
  return 3;
}

// ── User state (level progression) ───────────────────────────────────────────

export function loadUserState() {
  try {
    const raw = localStorage.getItem(USER_STATE_KEY);
    if (!raw) return { treesCompleted: 0 };
    return JSON.parse(raw);
  } catch { return { treesCompleted: 0 }; }
}

export function saveUserState(state) {
  localStorage.setItem(USER_STATE_KEY, JSON.stringify(state));
}

// ── Tree status ───────────────────────────────────────────────────────────────

/**
 * 'empty'              – no tasks at all
 * 'has_space'          – tree has room for more tasks
 * 'full_all_complete'  – tree full, every task done → ready for new cycle
 * 'full_none_complete' – tree full, zero tasks done → block new tasks
 * 'full_partial'       – tree full, some done (user must finish remaining)
 */
export function getTreeStatus(todayTasks) {
  const total   = todayTasks.length;
  if (total === 0) return 'empty';

  const completedN = todayTasks.filter((t) => t.completed).length;
  const pending    = total - completedN;

  if (total < MAX_TREE_CAPACITY) return 'has_space';

  if (pending === 0)        return 'full_all_complete';
  if (completedN === 0)     return 'full_none_complete';
  return 'full_partial';
}
