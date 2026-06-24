import { useState } from 'react';
import { loadWeightGoal, saveWeightGoal, generateWorkoutPlan } from './weightGoal';

const WORKOUT_COLORS = {
  hiit: '#ef4444', weights: '#8b5cf6', running: '#f59e0b',
  cycling: '#06b6d4', swimming: '#3b82f6', yoga: '#10b981',
  walking: '#84cc16', other: '#6b7280',
};
const WORKOUT_ICONS = {
  hiit: '⚡', weights: '🏋️', running: '🏃', cycling: '🚴',
  swimming: '🏊', yoga: '🧘', walking: '🚶', other: '🏅',
};

function GoalBadge({ type }) {
  const labels = { lose: '🔥 Weight Loss', gain: '💪 Muscle Gain', maintain: '⚖️ Maintenance' };
  const colors = { lose: '#ef4444', gain: '#8b5cf6', maintain: '#22c55e' };
  return (
    <span style={{
      background: `${colors[type]}20`, color: colors[type],
      border: `1px solid ${colors[type]}60`, borderRadius: 99,
      padding: '4px 14px', fontSize: 13, fontWeight: 700,
    }}>{labels[type]}</span>
  );
}

export default function GoalsView() {
  const saved = loadWeightGoal();
  const [current, setCurrent] = useState(saved?.current || '');
  const [goal, setGoal] = useState(saved?.goal || '');
  const [unit, setUnit] = useState(saved?.unit || 'kg');
  const [plan, setPlan] = useState(saved?.plan || null);
  const [goalMeta, setGoalMeta] = useState(saved?.goalMeta || null);
  const [expandedWeek, setExpandedWeek] = useState(0);
  const [submitted, setSubmitted] = useState(!!saved?.plan);

  function handleGenerate() {
    const c = parseFloat(current);
    const g = parseFloat(goal);
    if (!c || !g || c <= 0 || g <= 0) return;
    const result = generateWorkoutPlan(c, g, unit);
    setPlan(result.plan);
    setGoalMeta(result);
    setSubmitted(true);
    setExpandedWeek(0);
    saveWeightGoal({ current: c, goal: g, unit, plan: result.plan, goalMeta: result });
  }

  function handleReset() {
    setSubmitted(false);
    setPlan(null);
    setGoalMeta(null);
    setCurrent('');
    setGoal('');
    saveWeightGoal(null);
  }

  const totalMins = plan?.reduce((s, w) => s + w.days.reduce((a, d) => a + d.duration, 0), 0);

  return (
    <div>
      <h1 style={{ margin: '0 0 6px', fontSize: 28, fontWeight: 800 }}>Weight & Goals</h1>
      <p style={{ margin: '0 0 28px', color: '#888', fontSize: 14 }}>
        Enter your current and target weight — we'll build a personalised 4-week workout plan.
      </p>

      {/* Input card */}
      <div style={{
        background: '#1e1e2e', borderRadius: 20, padding: 24,
        border: '1px solid #2a2a3e', marginBottom: 28,
      }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ flex: 1, minWidth: 140 }}>
            <label style={labelSt}>Current Weight</label>
            <div style={{ display: 'flex', gap: 6 }}>
              <input type="number" min={1} max={500} placeholder="e.g. 80"
                value={current} onChange={e => setCurrent(e.target.value)}
                style={{ ...inputSt, flex: 1 }} />
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 140 }}>
            <label style={labelSt}>Goal Weight</label>
            <input type="number" min={1} max={500} placeholder="e.g. 70"
              value={goal} onChange={e => setGoal(e.target.value)}
              style={inputSt} />
          </div>
          <div>
            <label style={labelSt}>Unit</label>
            <div style={{ display: 'flex', gap: 0, borderRadius: 10, overflow: 'hidden', border: '1px solid #3a3a50' }}>
              {['kg', 'lbs'].map(u => (
                <button key={u} onClick={() => setUnit(u)} style={{
                  padding: '10px 18px', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 14,
                  background: unit === u ? '#6366f1' : '#12121e',
                  color: unit === u ? '#fff' : '#888',
                }}>{u}</button>
              ))}
            </div>
          </div>
          <button onClick={handleGenerate}
            disabled={!current || !goal}
            style={{
              background: '#6366f1', color: '#fff', border: 'none', borderRadius: 12,
              padding: '11px 24px', fontWeight: 800, fontSize: 15, cursor: 'pointer',
              opacity: (!current || !goal) ? 0.5 : 1,
            }}>
            Generate Plan →
          </button>
          {submitted && (
            <button onClick={handleReset} style={{
              background: 'none', border: '1px solid #3a3a50', borderRadius: 12,
              color: '#888', padding: '11px 16px', cursor: 'pointer', fontSize: 14,
            }}>Reset</button>
          )}
        </div>

        {/* Weight diff preview */}
        {current && goal && (
          <div style={{ marginTop: 16, display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            {[
              { label: 'Current', value: `${current} ${unit}`, color: '#888' },
              { label: 'Goal', value: `${goal} ${unit}`, color: '#6366f1' },
              {
                label: 'Difference',
                value: `${Math.abs(parseFloat(current) - parseFloat(goal)).toFixed(1)} ${unit} to ${parseFloat(current) > parseFloat(goal) ? 'lose' : parseFloat(current) < parseFloat(goal) ? 'gain' : 'maintain'}`,
                color: parseFloat(current) > parseFloat(goal) ? '#ef4444' : parseFloat(current) < parseFloat(goal) ? '#8b5cf6' : '#22c55e',
              },
            ].map(s => (
              <div key={s.label}>
                <div style={{ fontSize: 11, color: '#555', textTransform: 'uppercase', letterSpacing: 1 }}>{s.label}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: s.color }}>{s.value}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Plan */}
      {submitted && plan && goalMeta && (
        <div>
          {/* Summary bar */}
          <div style={{
            background: '#1e1e2e', borderRadius: 16, padding: '16px 24px',
            border: '1px solid #2a2a3e', marginBottom: 20,
            display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'center',
          }}>
            <GoalBadge type={goalMeta.goalType} />
            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
              <Stat label="Intensity" value={goalMeta.intensity.charAt(0).toUpperCase() + goalMeta.intensity.slice(1)} />
              <Stat label="Difference" value={`${goalMeta.diffKg} kg`} />
              <Stat label="Total Weeks" value="4" />
              <Stat label="Total Workout Time" value={`${totalMins} min`} />
            </div>
          </div>

          {/* Week tabs */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            {plan.map((w, i) => (
              <button key={i} onClick={() => setExpandedWeek(i)} style={{
                padding: '8px 18px', borderRadius: 10, border: 'none', cursor: 'pointer',
                background: expandedWeek === i ? '#6366f1' : '#1e1e2e',
                color: expandedWeek === i ? '#fff' : '#888',
                fontWeight: 700, fontSize: 14,
                border: `1px solid ${expandedWeek === i ? '#6366f1' : '#2a2a3e'}`,
              }}>
                Week {w.week}
              </button>
            ))}
          </div>

          {/* Week detail */}
          {plan[expandedWeek] && (
            <div>
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                marginBottom: 14,
              }}>
                <div>
                  <span style={{ fontWeight: 800, fontSize: 18 }}>Week {plan[expandedWeek].week}</span>
                  <span style={{ marginLeft: 10, color: '#6366f1', fontWeight: 600, fontSize: 15 }}>
                    — {plan[expandedWeek].focus}
                  </span>
                </div>
                <span style={{ color: '#888', fontSize: 13 }}>
                  {plan[expandedWeek].days.reduce((s, d) => s + d.duration, 0)} min this week
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {plan[expandedWeek].days.map((d, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    background: '#1e1e2e', borderRadius: 12, padding: '12px 18px',
                    border: `1px solid ${d.duration === 0 ? '#2a2a3e' : WORKOUT_COLORS[d.type] + '30'}`,
                  }}>
                    <div style={{
                      minWidth: 36, fontSize: 12, fontWeight: 700, color: '#555',
                      textTransform: 'uppercase', letterSpacing: 1,
                    }}>{d.day}</div>
                    <div style={{
                      width: 36, height: 36, borderRadius: 10,
                      background: d.duration === 0 ? '#2a2a3e' : `${WORKOUT_COLORS[d.type]}20`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 18, flexShrink: 0,
                    }}>
                      {d.duration === 0 ? '😴' : WORKOUT_ICONS[d.type]}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontWeight: 700, fontSize: 14,
                        color: d.duration === 0 ? '#555' : '#fff',
                      }}>{d.workout}</div>
                      {d.note && (
                        <div style={{ fontSize: 12, color: '#666', marginTop: 2 }}>{d.note}</div>
                      )}
                    </div>
                    {d.duration > 0 && (
                      <div style={{
                        background: `${WORKOUT_COLORS[d.type]}20`,
                        color: WORKOUT_COLORS[d.type],
                        borderRadius: 8, padding: '4px 10px',
                        fontSize: 13, fontWeight: 700, flexShrink: 0,
                      }}>{d.duration} min</div>
                    )}
                    {d.duration === 0 && (
                      <div style={{ color: '#555', fontSize: 13, fontWeight: 600 }}>Rest</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tip */}
          <div style={{
            marginTop: 20, background: '#6366f110', border: '1px solid #6366f130',
            borderRadius: 14, padding: '14px 20px', fontSize: 13, color: '#a5b4fc',
          }}>
            💡 <strong>Tip:</strong> {goalMeta.goalType === 'lose'
              ? 'Combine this plan with a caloric deficit of 300–500 kcal/day for best results. Prioritise protein (1.6g/kg) to preserve muscle.'
              : goalMeta.goalType === 'gain'
              ? 'Eat at a 300–500 kcal surplus daily and hit 1.6–2.2g protein per kg of bodyweight to maximise muscle growth.'
              : 'Maintain your calorie balance and stay consistent. Mix of strength and cardio keeps your body fit and healthy.'}
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div>
      <div style={{ fontSize: 11, color: '#555', textTransform: 'uppercase', letterSpacing: 1 }}>{label}</div>
      <div style={{ fontSize: 15, fontWeight: 700 }}>{value}</div>
    </div>
  );
}

const labelSt = { display: 'block', fontSize: 13, color: '#888', marginBottom: 6 };
const inputSt = {
  width: '100%', background: '#12121e', border: '1px solid #3a3a50',
  borderRadius: 10, color: '#fff', padding: '10px 14px', fontSize: 15,
  boxSizing: 'border-box',
};
