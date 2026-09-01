import { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_ADMIN_API_URL || 'https://dinanwuye-api.onrender.com/api/v1/admin';

const nav = [
  ['Overview', 'overview'],
  ['Users', 'users'],
  ['Profiles', 'profiles'],
  ['Photo review', 'photos'],
  ['Matches', 'matches'],
  ['Audit log', 'audit'],
];

const DEMO_CREDENTIALS = {
  email: 'admin@dinanwuye.com',
  password: 'Admin123!',
};

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const fillDemo = () => {
    setEmail(DEMO_CREDENTIALS.email);
    setPassword(DEMO_CREDENTIALS.password);
  };

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const responseText = await response.text();
      let data = {};
      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch {
        data = {};
      }
      if (!response.ok) {
        const message = Array.isArray(data.message) ? data.message[0] : data.message;
        throw new Error(message || `Admin API returned HTTP ${response.status}.`);
      }
      const token = data.accessToken || data.token;
      if (!token) throw new Error('Admin API returned no access token.');
      onLogin(token);
    } catch (exception) { setError(exception.message); }
  };

  return (
    <main className="login-page">
      <div className="login-panel">
        <p className="eyebrow">DINANWUYE / CONTROL ROOM</p>
        <h1>Keep the community in good hands.</h1>
        <p className="muted">Sign in to review members, safety signals, and the daily health of the platform.</p>
        <form onSubmit={submit}>
          <label>
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>
          <label>
            Password
            <input
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>
          {error && <p className="error">{error}</p>}
          <button className="primary" type="submit">Sign in</button>
        </form>
        <div className="demo-credentials">
          <p className="demo-label">Quick access (demo):</p>
          <button type="button" className="demo-fill" onClick={fillDemo}>
            Fill demo credentials
          </button>
          <p className="demo-hint">
            <strong>Email:</strong> {DEMO_CREDENTIALS.email}<br />
            <strong>Password:</strong> {DEMO_CREDENTIALS.password}
          </p>
        </div>
      </div>
    </main>
  );
}

function App() {
  const [token, setToken] = useState(() => localStorage.getItem('admin_token'));
  const [section, setSection] = useState('overview');
  const [users, setUsers] = useState([]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => { if (token) localStorage.setItem('admin_token', token); }, [token]);
  useEffect(() => {
    if (!token || section === 'overview') return;
    const endpoint = section === 'users' ? 'users' : section === 'photos' ? 'photos' : section === 'profiles' ? 'profiles' : section === 'matches' ? 'matches' : section === 'audit' ? 'audit' : 'reports';
    setLoading(true);
    fetch(`${API_URL}/${endpoint}?page=1&limit=50`, { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => response.ok ? response.json() : Promise.reject(new Error(`Could not load ${endpoint}.`)))
      .then((data) => {
        if (section === 'users') setUsers(data.users || []);
        else setRecords(data[endpoint === 'audit' ? 'entries' : endpoint] || []);
      })
      .catch(() => { if (section === 'users') setUsers([]); else setRecords([]); })
      .finally(() => setLoading(false));
  }, [token, section]);
  if (!token) return <Login onLogin={setToken} />;
  const signOut = () => { localStorage.removeItem('admin_token'); setToken(null); };
  return <div className="app-shell"><aside><div className="brand"><span className="brand-mark">D</span><span>Dinanwuye<br /><small>operations</small></span></div><nav>{nav.map(([label, value]) => <button className={section === value ? 'nav-item active' : 'nav-item'} onClick={() => setSection(value)} key={value}><span className="nav-dot" />{label}</button>)}</nav><button className="sign-out" onClick={signOut}>Sign out</button></aside><main className="content"><header><div><p className="eyebrow">MONDAY, AUGUST 24, 2026</p><h1>{nav.find((item) => item[1] === section)?.[0]}</h1></div><div className="operator"><span className="status-dot" />Live systems <strong>AD</strong></div></header>{section === 'overview' && <Overview />}{section === 'users' && <Users users={users} loading={loading} />}{section === 'profiles' && <Profiles records={records} loading={loading} />}{section === 'photos' && <Photos records={records} loading={loading} />}{section === 'matches' && <Matches records={records} loading={loading} />}{section === 'audit' && <Audit records={records} loading={loading} />}</main></div>;
}

function Overview() { return <><section className="metric-grid"><Metric label="Active members" value="12,840" delta="+8.4%" /><Metric label="Profiles to review" value="38" delta="Needs attention" warn /><Metric label="Matches today" value="214" delta="+12.1%" /><Metric label="Reports open" value="7" delta="2 urgent" warn /></section><section className="dashboard-grid"><div className="panel chart-panel"><div className="panel-heading"><div><p className="eyebrow">MEMBER MOMENTUM</p><h2>Healthy growth, steady trust</h2></div><span className="tag">Last 30 days</span></div><div className="chart"><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /></div><div className="axis"><span>Jul 26</span><span>Aug 24</span></div></div><div className="panel"><div className="panel-heading"><div><p className="eyebrow">SAFETY QUEUE</p><h2>Needs a human eye</h2></div><span className="count">7</span></div><div className="queue"><QueueItem title="Profile reports" value="4 waiting" /><QueueItem title="Photos pending" value="38 waiting" /><QueueItem title="Account appeals" value="3 waiting" /></div><button className="text-button">Open moderation queue <span>→</span></button></div></section></>; }
function Metric({ label, value, delta, warn }) { return <div className="metric"><p>{label}</p><strong>{value}</strong><span className={warn ? 'metric-note warn' : 'metric-note'}>{delta}</span></div>; }
function QueueItem({ title, value }) { return <div className="queue-item"><span>{title}</span><strong>{value}</strong></div>; }
function Users({ users, loading }) { return <section className="panel table-panel"><div className="panel-heading"><div><p className="eyebrow">DIRECTORY</p><h2>Member accounts</h2></div><input className="search" placeholder="Search members" /></div><table><thead><tr><th>Member</th><th>Status</th><th>Joined</th><th>Profile</th></tr></thead><tbody>{loading ? <LoadingRow columns="4" /> : users.length ? users.map((user) => <tr key={user.id}><td><strong>{user.email || user.phone || user.id}</strong></td><td><span className="pill">{user.status}</span></td><td>{formatDate(user.createdAt)}</td><td>{user.profile?.name || 'Incomplete'}</td></tr>) : <EmptyRow columns="4" />}</tbody></table></section>; }
function DataTable({ title, eyebrow, headers, rows, loading }) { return <section className="panel table-panel"><div className="panel-heading"><div><p className="eyebrow">{eyebrow}</p><h2>{title}</h2></div></div><table><thead><tr>{headers.map((header) => <th key={header}>{header}</th>)}</tr></thead><tbody>{loading ? <LoadingRow columns={headers.length} /> : rows.length ? rows.map((row, index) => <tr key={row.id || index}>{row.cells.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}</tr>) : <EmptyRow columns={headers.length} />}</tbody></table></section>; }
function LoadingRow({ columns }) { return <tr><td colSpan={columns} className="empty">Loading records...</td></tr>; }
function EmptyRow({ columns }) { return <tr><td colSpan={columns} className="empty">No records returned.</td></tr>; }
function Profiles({ records, loading }) { return <DataTable title="Profile review" eyebrow="PROFILES" headers={['Name', 'Email', 'Gender', 'Location', 'Joined']} loading={loading} rows={records.map((profile) => ({ id: profile.id, cells: [profile.name, profile.user?.email || '—', profile.gender, profile.locationName || '—', formatDate(profile.createdAt)] }))} />; }
function Photos({ records, loading }) { return <DataTable title="Photo review" eyebrow="PHOTOS" headers={['Member', 'Status', 'Uploaded']} loading={loading} rows={records.map((photo) => ({ id: photo.id, cells: [photo.profile?.user?.email || photo.profile?.name || '—', photo.moderationStatus, formatDate(photo.createdAt)] }))} />; }
function Matches({ records, loading }) { return <DataTable title="Matches" eyebrow="MATCHES" headers={['Member A', 'Member B', 'Status', 'Created']} loading={loading} rows={records.map((match) => ({ id: match.id, cells: [match.userA?.email || '—', match.userB?.email || '—', match.status, formatDate(match.createdAt)] }))} />; }
function Audit({ records, loading }) { return <DataTable title="Audit log" eyebrow="AUDIT" headers={['Action', 'Entity', 'Operator', 'Created']} loading={loading} rows={records.map((entry) => ({ id: entry.id, cells: [entry.action, `${entry.entity}${entry.entityId ? ` (${entry.entityId})` : ''}`, entry.admin?.email || '—', formatDate(entry.createdAt)] }))} />; }
function formatDate(value) { return value ? new Date(value).toLocaleDateString() : '—'; }
export default App;
