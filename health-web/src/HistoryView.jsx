import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { totalWorkoutMins } from './store';

const METRICS = [
  { id: 'caffeineMg', label: 'Caffeine', icon: '☕', color: '#a16207', unit: 'mg', fn: e => e.caffeineMg },
  { id: 'sleepHours', label: 'Sleep', icon: '🌙', color: '#6366f1', unit: 'hrs', fn: e => e.sleepHours },
  { id: 'steps', label: 'Steps', icon: '👟', color: '#ea580c', unit: '', fn: e => e.steps },
  { id: 'workout', label: 'Workout', icon: '💪', color: '#dc2626', unit: 'min', fn: e => totalWorkoutMins(e.workouts) },
];

function shortDay(dateStr) {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'short' });
}

function fmtDate(dateStr) {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function isToday(dateStr) {
  return dateStr === new Date().toISOString().slice(0, 10);
}

export default function HistoryView({ week }) {
  const [selected, setSelected] = useState('sleepHours');
  const metric = METRICS.find(m => m.id === selected);

  const chartData = week.map(e => ({
    day: shortDay(e.date),
    value: metric.fn(e),
    isToday: isToday(e.date),
  }));

  return (
    <div>
      <h1 style={{ margin: '0 0 24px', fontSize: 28, fontWeight: 800 }}>7-Day History</h1>

      {/* Metric selector */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {METRICS.map(m => (
          <button key={m.id} onClick={() => setSelected(m.id)} style={{
            padding: '8px 16px', borderRadius: 10, border: `1px solid ${selected === m.id ? m.color : '#3a3a50'}`,
            background: selected === m.id ? `${m.color}20` : '#1e1e2e',
            color: selected === m.id ? m.color : '#aaa',
            cursor: 'pointer', fontWeight: 600, fontSize: 14,
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            {m.icon} {m.label}
          </button>
        ))}
      </div>

      {/* Bar chart */}
      <div style={{
        background: '#1e1e2e', borderRadius: 16, padding: '24px 16px 8px',
        border: '1px solid #2a2a3e', marginBottom: 24,
      }}>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData} barCategoryGap="30%">
            <XAxis dataKey="day" tick={{ fill: '#888', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#888', fontSize: 11 }} axisLine={false} tickLine={false} width={36} />
            <Tooltip
              contentStyle={{ background: '#1e1e2e', border: `1px solid ${metric.color}`, borderRadius: 8, color: '#fff' }}
              formatter={v => [`${v} ${metric.unit}`, metric.label]}
            />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {chartData.map((d, i) => (
                <Cell key={i} fill={d.isToday ? metric.color : `${metric.color}70`} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Daily list */}
      <div style={{ background: '#1e1e2e', borderRadius: 16, border: '1px solid #2a2a3e', overflow: 'hidden' }}>
        {[...week].reverse().map((e, i, arr) => (
          <div key={e.date} style={{
            display: 'flex', alignItems: 'center', padding: '14px 20px',
            borderBottom: i < arr.length - 1 ? '1px solid #2a2a3e' : 'none',
          }}>
            <div style={{ minWidth: 110 }}>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{fmtDate(e.date)}</div>
              {isToday(e.date) && <div style={{ fontSize: 11, color: '#22c55e', fontWeight: 600 }}>Today</div>}
            </div>
            <div style={{ flex: 1 }} />
            {METRICS.map(m => (
              <div key={m.id} style={{
                display: 'flex', alignItems: 'center', gap: 4,
                minWidth: 70, fontSize: 13, color: '#ccc',
              }}>
                <span>{m.icon}</span>
                <span style={{ fontVariantNumeric: 'tabular-nums' }}>
                  {m.id === 'steps' ? (m.fn(e) / 1000).toFixed(1) + 'k' :
                   m.id === 'sleepHours' ? m.fn(e).toFixed(1) + 'h' :
                   m.fn(e) + (m.unit ? m.unit : '')}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
