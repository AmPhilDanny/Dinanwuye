import { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_ADMIN_API_URL || 'http://localhost:3007/api/v1/admin';

const nav = [
  ['Overview', 'overview'],
  ['Users', 'users'],
  ['Profiles', 'profiles'],
  ['Photo review', 'photos'],
  ['Matches', 'matches'],
  ['Audit log', 'audit'],
];

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const submit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) throw new Error('Unable to sign in with those credentials.');
      const data = await response.json();
      onLogin(data.accessToken || data.token);
    } catch (exception) { setError(exception.message); }
  };
  return <main className="login-page"><div className="login-panel"><p className="eyebrow">DINANWUYE / CONTROL ROOM</p><h1>Keep the community in good hands.</h1><p className="muted">Sign in to review members, safety signals, and the daily health of the platform.</p><form onSubmit={submit}><label>Email<input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} /></label><label>Password<input type="password" required value={password} onChange={(event) => setPassword(event.target.value)} /></label>{error && <p className="error">{error}</p>}<button className="primary" type="submit">Sign in</button></form></div></main>;
}

function App() {
  const [token, setToken] = useState(() => localStorage.getItem('admin_token'));
  const [section, setSection] = useState('overview');
  const [users, setUsers] = useState([]);
  useEffect(() => { if (token) localStorage.setItem('admin_token', token); }, [token]);
  useEffect(() => {
    if (!token || section !== 'users') return;
    fetch(`${API_URL}/users?page=1&limit=8`, { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => response.ok ? response.json() : Promise.reject(new Error('Could not load users.')))
      .then((data) => setUsers(Array.isArray(data) ? data : data.items || []))
      .catch(() => setUsers([]));
  }, [token, section]);
  if (!token) return <Login onLogin={setToken} />;
  const signOut = () => { localStorage.removeItem('admin_token'); setToken(null); };
  return <div className="app-shell"><aside><div className="brand"><span className="brand-mark">D</span><span>Dinanwuye<br /><small>operations</small></span></div><nav>{nav.map(([label, value]) => <button className={section === value ? 'nav-item active' : 'nav-item'} onClick={() => setSection(value)} key={value}><span className="nav-dot" />{label}</button>)}</nav><button className="sign-out" onClick={signOut}>Sign out</button></aside><main className="content"><header><div><p className="eyebrow">MONDAY, AUGUST 24, 2026</p><h1>{nav.find((item) => item[1] === section)?.[0]}</h1></div><div className="operator"><span className="status-dot" />Live systems <strong>AD</strong></div></header>{section === 'overview' && <Overview />}{section === 'users' && <Users users={users} />}{section !== 'overview' && section !== 'users' && <EmptyState section={section} />}</main></div>;
}

function Overview() { return <><section className="metric-grid"><Metric label="Active members" value="12,840" delta="+8.4%" /><Metric label="Profiles to review" value="38" delta="Needs attention" warn /><Metric label="Matches today" value="214" delta="+12.1%" /><Metric label="Reports open" value="7" delta="2 urgent" warn /></section><section className="dashboard-grid"><div className="panel chart-panel"><div className="panel-heading"><div><p className="eyebrow">MEMBER MOMENTUM</p><h2>Healthy growth, steady trust</h2></div><span className="tag">Last 30 days</span></div><div className="chart"><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /></div><div className="axis"><span>Jul 26</span><span>Aug 24</span></div></div><div className="panel"><div className="panel-heading"><div><p className="eyebrow">SAFETY QUEUE</p><h2>Needs a human eye</h2></div><span className="count">7</span></div><div className="queue"><QueueItem title="Profile reports" value="4 waiting" /><QueueItem title="Photos pending" value="38 waiting" /><QueueItem title="Account appeals" value="3 waiting" /></div><button className="text-button">Open moderation queue <span>→</span></button></div></section></>; }
function Metric({ label, value, delta, warn }) { return <div className="metric"><p>{label}</p><strong>{value}</strong><span className={warn ? 'metric-note warn' : 'metric-note'}>{delta}</span></div>; }
function QueueItem({ title, value }) { return <div className="queue-item"><span>{title}</span><strong>{value}</strong></div>; }
function Users({ users }) { return <section className="panel table-panel"><div className="panel-heading"><div><p className="eyebrow">DIRECTORY</p><h2>Member accounts</h2></div><input className="search" placeholder="Search members" /></div><table><thead><tr><th>Member</th><th>Status</th><th>Joined</th><th>Last active</th></tr></thead><tbody>{users.length ? users.map((user) => <tr key={user.id}><td><strong>{user.email || user.name || user.id}</strong></td><td><span className="pill">Active</span></td><td>{formatDate(user.createdAt)}</td><td>{formatDate(user.lastLoginAt || user.updatedAt)}</td></tr>) : <tr><td colSpan="4" className="empty">No accounts returned yet. Connect the admin API to populate this view.</td></tr>}</tbody></table></section>; }
function formatDate(value) { return value ? new Date(value).toLocaleDateString() : '—'; }
function EmptyState({ section }) { return <section className="panel empty-state"><span className="empty-number">0{section === 'photos' ? '3' : '0'}</span><h2>{section[0].toUpperCase() + section.slice(1)} module ready</h2><p>Connect this view to the admin-service endpoint to begin operating it.</p></section>; }

export default App;
