// MODEL: holds all data in one state object. Never touches the DOM or imports a view.
export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
export const PRIORITIES = ['High', 'Medium', 'Low'];
export const AVATAR_COLORS = ['#4573d2', '#d9534f', '#1f8f89', '#b9770e', '#7e57c2'];
export const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'active', label: 'Not done' },
  { id: 'done', label: 'Done' },
  ...PRIORITIES.map((p) => ({ id: p, label: `${p} priority` })),
];
const STORAGE_KEY = 'weekly-todo-board';
const PROFILE_KEY = 'weekly-todo-profile';

export const state = {
  tasks: [], // { id, title, day, priority, minutes, done }
  filter: 'all',
  editingId: null,
  profile: { name: 'Student', color: AVATAR_COLORS[0] },
};

const persist = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.tasks));
  } catch {
    /* storage unavailable: keep working in memory */
  }
};

export const loadState = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (Array.isArray(saved)) state.tasks = saved;
  } catch {
    state.tasks = [];
  }
  try {
    const profile = JSON.parse(localStorage.getItem(PROFILE_KEY));
    if (profile?.name) state.profile = profile;
  } catch {
    /* keep the default profile */
  }
};

// Returns an error message, or null when the data is valid.
export const validateTask = ({ title, day, priority, minutes }) => {
  const clean = String(title ?? '').trim();
  if (!clean) return 'Enter a task title.';
  if (clean.length > 60) return 'Keep the title to 60 characters or fewer.';
  if (!DAYS.includes(day)) return 'Pick a day.';
  if (!PRIORITIES.includes(priority)) return 'Pick a priority.';
  const mins = Number(minutes);
  if (!Number.isInteger(mins) || mins < 5 || mins > 600)
    return 'Enter the estimated time as a whole number from 5 to 600 minutes.';
  const duplicate = state.tasks.some(
    (t) => t.day === day && t.title.toLowerCase() === clean.toLowerCase() && t.id !== state.editingId
  );
  if (duplicate) return `"${clean}" is already on ${day}.`;
  return null;
};

const toFields = ({ title, day, priority, minutes }) => ({
  title: title.trim(),
  day,
  priority,
  minutes: Number(minutes),
});

export const addTask = (data) => {
  state.tasks.push({ id: Date.now(), done: false, ...toFields(data) });
  persist();
};

export const updateTask = (id, data) => {
  const task = state.tasks.find((t) => t.id === id);
  Object.assign(task, toFields(data));
  persist();
};

export const deleteTask = (id) => {
  state.tasks = state.tasks.filter((t) => t.id !== id);
  if (state.editingId === id) state.editingId = null;
  persist();
};

export const toggleDone = (id) => {
  const task = state.tasks.find((t) => t.id === id);
  task.done = !task.done;
  persist();
};

export const startEdit = (id) => (state.editingId = id);
export const cancelEdit = () => (state.editingId = null);
export const setFilter = (filter) => (state.filter = filter);

export const getVisibleTasks = () =>
  state.tasks.filter((t) => {
    if (state.filter === 'all') return true;
    if (state.filter === 'active') return !t.done;
    if (state.filter === 'done') return t.done;
    return t.priority === state.filter;
  });

// Derived values: recomputed from state every time they are asked for.
export const getSummary = () => {
  const total = state.tasks.length;
  const done = state.tasks.filter((t) => t.done).length;
  const sum = (list) => list.reduce((acc, t) => acc + t.minutes, 0);
  return {
    total,
    done,
    percent: total ? Math.round((done / total) * 100) : 0,
    plannedMinutes: sum(state.tasks),
    remainingMinutes: sum(state.tasks.filter((t) => !t.done)),
  };
};

// ---- Profile ----
export const validateProfile = ({ name, color }) => {
  const clean = String(name ?? '').trim();
  if (!clean) return 'Enter your name.';
  if (clean.length < 2 || clean.length > 30) return 'Your name must be 2 to 30 characters.';
  if (!AVATAR_COLORS.includes(color)) return 'Pick an avatar color.';
  return null;
};

export const updateProfile = ({ name, color }) => {
  state.profile = { name: name.trim(), color };
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(state.profile));
  } catch {
    /* storage unavailable: keep working in memory */
  }
};
