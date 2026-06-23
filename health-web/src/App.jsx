import { useState, useEffect } from 'react';
import { loadToday, getWeek } from './store';
import TodayView from './TodayView';
import SummaryView from './SummaryView';
import HistoryView from './HistoryView';

const NAV = [
  { id: 'today', icon: '☀️', label: 'Today' },
  { id: 'summary', icon: '📊', label: 'Summary' },
  { id: 'history', icon: '📅', label: 'History' },
];

export default function App() {
  const [tab, setTab] = useState('today');
  const [entry, setEntry] = useState(loadToday);
  const [week, setWeek] = useState(getWeek);

  useEffect(() => { setWeek(getWeek()); }, [entry]);

  return (
    <div style={{
      minHeight: '100vh', background: '#12121e', color: '#fff',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      display: 'flex',
    }}>
      {/* Sidebar */}
      <div style={{
        width: 220, background: '#1a1a2e', borderRight: '1px solid #2a2a3e',
        display: 'flex', flexDirection: 'column', padding: '24px 0',
      }}>
        <div style={{ padding: '0 20px 28px', borderBottom: '1px solid #2a2a3e', marginBottom: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: '#6366f1', letterSpacing: 1, textTransform: 'uppercase' }}>
            Health Tracker
          </div>
          <div style={{ fontSize: 11, color: '#555', marginTop: 2 }}>Daily Wellness Log</div>
        </div>
        {NAV.map(n => (
          <button key={n.id} onClick={() => setTab(n.id)} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '12px 20px', border: 'none', borderRadius: 0,
            background: tab === n.id ? '#6366f120' : 'transparent',
            borderLeft: tab === n.id ? '3px solid #6366f1' : '3px solid transparent',
            color: tab === n.id ? '#a5b4fc' : '#888',
            cursor: 'pointer', fontWeight: tab === n.id ? 700 : 400,
            fontSize: 15, textAlign: 'left', width: '100%',
          }}>
            <span style={{ fontSize: 18 }}>{n.icon}</span>
            {n.label}
          </button>
        ))}
      </div>

      {/* Main content */}
      <div style={{ flex: 1, padding: '32px 40px', overflowY: 'auto', maxWidth: 900 }}>
        {tab === 'today' && <TodayView entry={entry} setEntry={setEntry} />}
        {tab === 'summary' && <SummaryView entry={entry} />}
        {tab === 'history' && <HistoryView week={week} />}
      </div>
    </div>
  );
}
