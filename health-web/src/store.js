const STORAGE_KEY = 'health_entries_v1';

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function emptyEntry(dateStr) {
  return { date: dateStr, caffeineMg: 0, sleepHours: 0, steps: 0, workouts: [] };
}

export function loadEntries() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

export function saveEntry(entry) {
  const all = loadEntries();
  all[entry.date] = entry;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

export function loadToday() {
  const all = loadEntries();
  const key = todayKey();
  return all[key] || emptyEntry(key);
}

export function getWeek() {
  const all = loadEntries();
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const key = d.toISOString().slice(0, 10);
    return all[key] || emptyEntry(key);
  });
}

export const WORKOUT_TYPES = [
  { id: 'running', label: 'Running', icon: '🏃' },
  { id: 'cycling', label: 'Cycling', icon: '🚴' },
  { id: 'swimming', label: 'Swimming', icon: '🏊' },
  { id: 'weights', label: 'Weight Lifting', icon: '🏋️' },
  { id: 'yoga', label: 'Yoga', icon: '🧘' },
  { id: 'hiit', label: 'HIIT', icon: '⚡' },
  { id: 'walking', label: 'Walking', icon: '🚶' },
  { id: 'other', label: 'Other', icon: '🏅' },
];

export function totalWorkoutMins(workouts) {
  return workouts.reduce((s, w) => s + (w.durationMinutes || 0), 0);
}

export function healthScore(entry) {
  const sleep = Math.min(entry.sleepHours / 8, 1) * 30;
  const steps = Math.min(entry.steps / 10000, 1) * 30;
  const workout = Math.min(totalWorkoutMins(entry.workouts) / 30, 1) * 25;
  const caff = Math.max(1 - entry.caffeineMg / 800, 0) * 15;
  return Math.round(sleep + steps + workout + caff);
}
