import { healthScore, totalWorkoutMins } from './store';

function Card({ icon, title, value, unit, color, progress, status, statusColor }) {
  return (
    <div style={{
      background: '#1e1e2e', borderRadius: 16, padding: 20,
      border: `1px solid ${color}40`, flex: 1, minWidth: 220,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, color }}>
        <span style={{ fontSize: 18 }}>{icon}</span>
        <span style={{ fontWeight: 700, fontSize: 14 }}>{title}</span>
      </div>
      <div style={{ fontSize: 30, fontWeight: 800, marginBottom: 4 }}>
        {value} <span style={{ fontSize: 15, color: '#888' }}>{unit}</span>
      </div>
      <div style={{ background: '#12121e', borderRadius: 99, height: 6, marginBottom: 8 }}>
        <div style={{
          background: color, borderRadius: 99, height: 6,
          width: `${Math.min(progress * 100, 100)}%`, transition: 'width 0.4s',
        }} />
      </div>
      <div style={{ fontSize: 13, fontWeight: 600, color: statusColor }}>{status}</div>
    </div>
  );
}

function scoreColor(s) {
  if (s >= 75) return '#22c55e';
  if (s >= 50) return '#f59e0b';
  return '#ef4444';
}
function scoreLabel(s) {
  if (s >= 80) return 'Excellent';
  if (s >= 60) return 'Good';
  if (s >= 40) return 'Fair';
  return 'Needs Work';
}

export default function SummaryView({ entry }) {
  const score = healthScore(entry);
  const workoutMins = totalWorkoutMins(entry.workouts);
  const circ = 2 * Math.PI * 52;

  return (
    <div>
      <h1 style={{ margin: '0 0 24px', fontSize: 28, fontWeight: 800 }}>Daily Summary</h1>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 32 }}>
        <Card icon="☕" title="Caffeine" value={entry.caffeineMg} unit="mg" color="#a16207"
          progress={entry.caffeineMg / 400}
          status={entry.caffeineMg === 0 ? 'None logged' : entry.caffeineMg <= 200 ? 'Low' : entry.caffeineMg <= 400 ? 'Moderate' : 'High — consider reducing'}
          statusColor={entry.caffeineMg > 400 ? '#ef4444' : '#22c55e'} />
        <Card icon="🌙" title="Sleep" value={entry.sleepHours.toFixed(1)} unit="hours" color="#6366f1"
          progress={entry.sleepHours / 8}
          status={entry.sleepHours < 6 ? 'Too little' : entry.sleepHours <= 9 ? 'Great' : 'A lot — check consistency'}
          statusColor={entry.sleepHours < 6 || entry.sleepHours > 9 ? '#f59e0b' : '#22c55e'} />
        <Card icon="👟" title="Steps" value={entry.steps.toLocaleString()} unit="steps" color="#ea580c"
          progress={entry.steps / 10000}
          status={entry.steps >= 10000 ? 'Goal reached!' : entry.steps >= 7500 ? 'Almost there!' : entry.steps >= 3000 ? 'Getting there' : 'Very low'}
          statusColor={entry.steps >= 10000 ? '#22c55e' : entry.steps < 3000 ? '#ef4444' : '#f59e0b'} />
        <Card icon="💪" title="Workout" value={workoutMins} unit="minutes" color="#dc2626"
          progress={workoutMins / 30}
          status={entry.workouts.length === 0 ? 'No workout logged' : workoutMins < 20 ? 'Light activity' : workoutMins < 45 ? 'Good effort' : 'Excellent!'}
          statusColor={entry.workouts.length === 0 ? '#ef4444' : workoutMins >= 30 ? '#22c55e' : '#f59e0b'} />
      </div>

      {/* Health score */}
      <div style={{
        background: '#1e1e2e', borderRadius: 20, padding: 32,
        border: '1px solid #2a2a3e', textAlign: 'center',
      }}>
        <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 24 }}>Overall Health Score</div>
        <svg width={140} height={140} viewBox="0 0 120 120" style={{ display: 'block', margin: '0 auto 16px' }}>
          <circle cx={60} cy={60} r={52} fill="none" stroke="#2a2a3e" strokeWidth={12} />
          <circle cx={60} cy={60} r={52} fill="none"
            stroke={scoreColor(score)} strokeWidth={12}
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={circ * (1 - score / 100)}
            transform="rotate(-90 60 60)"
            style={{ transition: 'stroke-dashoffset 0.5s' }}
          />
          <text x={60} y={55} textAnchor="middle" fill="#fff" fontSize={26} fontWeight={800}>{score}</text>
          <text x={60} y={72} textAnchor="middle" fill="#666" fontSize={12}>/ 100</text>
        </svg>
        <div style={{ fontSize: 20, fontWeight: 800, color: scoreColor(score), marginBottom: 8 }}>
          {scoreLabel(score)}
        </div>
        <div style={{ fontSize: 13, color: '#666' }}>
          Based on today's caffeine, sleep, steps, and workout data
        </div>
      </div>
    </div>
  );
}
