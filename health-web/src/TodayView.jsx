import { useState } from 'react';
import { saveEntry, WORKOUT_TYPES, totalWorkoutMins } from './store';
import { Plus, X, CheckCircle } from 'lucide-react';

function MetricCard({ color, icon, title, children }) {
  return (
    <div style={{
      background: '#1e1e2e', borderRadius: 16, padding: 20,
      border: `1px solid ${color}40`, flex: 1, minWidth: 260,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, color }}>
        <span style={{ fontSize: 20 }}>{icon}</span>
        <span style={{ fontWeight: 700, fontSize: 15 }}>{title}</span>
      </div>
      {children}
    </div>
  );
}

function QuickAdd({ label, onClick }) {
  return (
    <button onClick={onClick} style={{
      background: '#2a2a3e', border: '1px solid #3a3a50', borderRadius: 8,
      color: '#ccc', padding: '4px 10px', cursor: 'pointer', fontSize: 13,
    }}>{label}</button>
  );
}

export default function TodayView({ entry, setEntry }) {
  const [showModal, setShowModal] = useState(false);
  const [workoutType, setWorkoutType] = useState(WORKOUT_TYPES[0].id);
  const [workoutMins, setWorkoutMins] = useState('');
  const [saved, setSaved] = useState(false);

  function update(field, value) {
    setEntry(e => ({ ...e, [field]: value }));
    setSaved(false);
  }

  function save() {
    saveEntry(entry);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function addWorkout() {
    const mins = parseInt(workoutMins);
    if (!mins || mins <= 0) return;
    const type = WORKOUT_TYPES.find(t => t.id === workoutType);
    const w = { id: Date.now(), type: workoutType, label: type.label, icon: type.icon, durationMinutes: mins };
    const updated = { ...entry, workouts: [...entry.workouts, w] };
    setEntry(updated);
    saveEntry(updated);
    setWorkoutMins('');
    setShowModal(false);
  }

  function removeWorkout(id) {
    const updated = { ...entry, workouts: entry.workouts.filter(w => w.id !== id) };
    setEntry(updated);
    saveEntry(updated);
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800 }}>Today's Health</h1>
          <p style={{ margin: '4px 0 0', color: '#888', fontSize: 14 }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <button onClick={save} style={{
          background: saved ? '#16a34a' : '#22c55e', color: '#fff', border: 'none',
          borderRadius: 10, padding: '10px 20px', fontWeight: 700, cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, transition: 'background 0.2s',
        }}>
          <CheckCircle size={16} /> {saved ? 'Saved!' : 'Save'}
        </button>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
        {/* Caffeine */}
        <MetricCard color="#a16207" icon="☕" title="Caffeine">
          <div style={{ fontSize: 32, fontWeight: 800, marginBottom: 12 }}>{entry.caffeineMg} <span style={{ fontSize: 16, color: '#888' }}>mg</span></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <button onClick={() => update('caffeineMg', Math.max(0, entry.caffeineMg - 25))} style={stepBtn}>−</button>
            <span style={{ minWidth: 60, textAlign: 'center', fontSize: 14 }}>{entry.caffeineMg} mg</span>
            <button onClick={() => update('caffeineMg', entry.caffeineMg + 25)} style={stepBtn}>+</button>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {[80, 150, 200].map(v => <QuickAdd key={v} label={`+${v}mg`} onClick={() => update('caffeineMg', entry.caffeineMg + v)} />)}
          </div>
        </MetricCard>

        {/* Sleep */}
        <MetricCard color="#6366f1" icon="🌙" title="Sleep">
          <div style={{ fontSize: 32, fontWeight: 800, marginBottom: 12 }}>{entry.sleepHours.toFixed(1)} <span style={{ fontSize: 16, color: '#888' }}>hrs</span></div>
          <input type="range" min={0} max={12} step={0.5}
            value={entry.sleepHours}
            onChange={e => update('sleepHours', parseFloat(e.target.value))}
            style={{ width: '100%', accentColor: '#6366f1', marginBottom: 6 }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#666' }}>
            <span>0h</span><span>6h</span><span>12h</span>
          </div>
        </MetricCard>

        {/* Steps */}
        <MetricCard color="#ea580c" icon="👟" title="Steps">
          <div style={{ fontSize: 32, fontWeight: 800, marginBottom: 12 }}>{entry.steps.toLocaleString()} <span style={{ fontSize: 16, color: '#888' }}>steps</span></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <button onClick={() => update('steps', Math.max(0, entry.steps - 500))} style={stepBtn}>−</button>
            <span style={{ fontSize: 13, color: '#888' }}>±500</span>
            <button onClick={() => update('steps', entry.steps + 500)} style={stepBtn}>+</button>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {[1000, 2500, 5000].map(v => <QuickAdd key={v} label={`+${v >= 1000 ? (v/1000)+'k' : v}`} onClick={() => update('steps', entry.steps + v)} />)}
          </div>
        </MetricCard>

        {/* Workout */}
        <MetricCard color="#dc2626" icon="💪" title="Workout">
          <div style={{ fontSize: 32, fontWeight: 800, marginBottom: 4 }}>{totalWorkoutMins(entry.workouts)} <span style={{ fontSize: 16, color: '#888' }}>min</span></div>
          <div style={{ color: '#888', fontSize: 13, marginBottom: 12 }}>{entry.workouts.length} session{entry.workouts.length !== 1 ? 's' : ''}</div>
          <button onClick={() => setShowModal(true)} style={{
            background: '#dc262620', border: '1px solid #dc2626', color: '#f87171',
            borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontWeight: 600,
            display: 'flex', alignItems: 'center', gap: 6, fontSize: 13,
          }}>
            <Plus size={14} /> Add Workout
          </button>
        </MetricCard>
      </div>

      {/* Workout sessions list */}
      {entry.workouts.length > 0 && (
        <div>
          <h3 style={{ margin: '0 0 12px', fontWeight: 700 }}>Workout Sessions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {entry.workouts.map(w => (
              <div key={w.id} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                background: '#1e1e2e', borderRadius: 10, padding: '10px 16px',
                border: '1px solid #2a2a3e',
              }}>
                <span style={{ fontSize: 20 }}>{w.icon}</span>
                <span style={{ flex: 1, fontWeight: 600 }}>{w.label}</span>
                <span style={{ color: '#888', fontSize: 14 }}>{w.durationMinutes} min</span>
                <button onClick={() => removeWorkout(w.id)} style={{
                  background: 'none', border: 'none', color: '#666', cursor: 'pointer', padding: 4,
                }}>
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add workout modal */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0, background: '#000a', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 100,
        }} onClick={() => setShowModal(false)}>
          <div onClick={e => e.stopPropagation()} style={{
            background: '#1e1e2e', borderRadius: 20, padding: 32,
            width: 360, border: '1px solid #3a3a50',
          }}>
            <h2 style={{ margin: '0 0 20px', fontWeight: 800 }}>Add Workout</h2>
            <label style={labelStyle}>Type</label>
            <select value={workoutType} onChange={e => setWorkoutType(e.target.value)} style={inputStyle}>
              {WORKOUT_TYPES.map(t => <option key={t.id} value={t.id}>{t.icon} {t.label}</option>)}
            </select>
            <label style={labelStyle}>Duration (minutes)</label>
            <input type="number" min={1} max={300} placeholder="e.g. 30"
              value={workoutMins} onChange={e => setWorkoutMins(e.target.value)}
              style={inputStyle}
              onKeyDown={e => e.key === 'Enter' && addWorkout()}
            />
            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button onClick={() => setShowModal(false)} style={{ ...modalBtn, background: '#2a2a3e', color: '#ccc' }}>Cancel</button>
              <button onClick={addWorkout} style={{ ...modalBtn, background: '#22c55e', color: '#fff' }}>Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const stepBtn = {
  background: '#2a2a3e', border: '1px solid #3a3a50', borderRadius: 8,
  color: '#fff', width: 32, height: 32, cursor: 'pointer', fontSize: 18, fontWeight: 700,
};
const labelStyle = { display: 'block', fontSize: 13, color: '#888', marginBottom: 6, marginTop: 14 };
const inputStyle = {
  width: '100%', background: '#12121e', border: '1px solid #3a3a50', borderRadius: 8,
  color: '#fff', padding: '8px 12px', fontSize: 14, boxSizing: 'border-box',
};
const modalBtn = {
  flex: 1, border: 'none', borderRadius: 10, padding: '10px 0',
  fontWeight: 700, cursor: 'pointer', fontSize: 15,
};
