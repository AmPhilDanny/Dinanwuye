import { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_ADMIN_API_URL || 'https://dinanwuye-api.onrender.com/api/v1/admin';

async function apiFetch(path, options = {}) {
  const token = localStorage.getItem('admin_token');
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
    ...options,
  });
  const text = await response.text();
  let data = {};
  try { data = text ? JSON.parse(text) : {}; } catch {}
  if (!response.ok) {
    const message = Array.isArray(data.message) ? data.message[0] : data.message;
    throw new Error(message || `Admin API returned HTTP ${response.status}.`);
  }
  return data;
}

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
  const [stats, setStats] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  useEffect(() => { if (token) localStorage.setItem('admin_token', token); }, [token]);
  useEffect(() => {
    if (!token) return;
    if (section === 'overview') {
      setLoading(true);
      fetch(`${API_URL}/dashboard/stats`, { headers: { Authorization: `Bearer ${token}` } })
        .then((response) => response.ok ? response.json() : Promise.reject(new Error('Could not load dashboard stats.')))
        .then((data) => setStats(data))
        .catch(() => setStats(null))
        .finally(() => setLoading(false));
      return;
    }
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
  }, [token, section, refreshKey]);
  if (!token) return <Login onLogin={setToken} />;
  const signOut = () => { localStorage.removeItem('admin_token'); setToken(null); };
  const refreshSection = () => setRefreshKey((k) => k + 1);
  return <div className="app-shell"><aside><div className="brand"><span className="brand-mark">D</span><span>Dinanwuye<br /><small>operations</small></span></div><nav>{nav.map(([label, value]) => <button className={section === value ? 'nav-item active' : 'nav-item'} onClick={() => setSection(value)} key={value}><span className="nav-dot" />{label}</button>)}</nav><button className="sign-out" onClick={signOut}>Sign out</button></aside><main className="content"><header><div><p className="eyebrow">MONDAY, AUGUST 24, 2026</p><h1>{nav.find((item) => item[1] === section)?.[0]}</h1></div><div className="operator"><span className="status-dot" />Live systems <strong>AD</strong></div></header>{section === 'overview' && <Overview stats={stats} loading={loading} />}{section === 'users' && <Users users={users} loading={loading} />}{section === 'profiles' && <Profiles records={records} loading={loading} />}{section === 'photos' && <Photos records={records} loading={loading} token={token} onRefresh={refreshSection} />}{section === 'matches' && <Matches records={records} loading={loading} />}{section === 'audit' && <Audit records={records} loading={loading} />}</main></div>;
}

function Overview({ stats, loading }) { const activeUsers = stats?.activeUsers ?? '—'; const profiles = stats?.totalProfiles ?? '—'; const matches = stats?.totalMatches ?? '—'; const reports = stats?.pendingReports ?? '—'; const pendingPhotos = stats?.pendingPhotos ?? '—'; return <><section className="metric-grid"><Metric label="Active members" value={loading ? '...' : activeUsers} delta="Current total" /><Metric label="Profiles" value={loading ? '...' : profiles} delta="Created profiles" /><Metric label="Matches" value={loading ? '...' : matches} delta="All matches" /><Metric label="Reports open" value={loading ? '...' : reports} delta={`${stats?.totalReports ?? '—'} total`} warn /></section><section className="dashboard-grid"><div className="panel chart-panel"><div className="panel-heading"><div><p className="eyebrow">MEMBER MOMENTUM</p><h2>Healthy growth, steady trust</h2></div><span className="tag">Live database</span></div><div className="chart"><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /></div><div className="axis"><span>Current data</span><span>Now</span></div></div><div className="panel"><div className="panel-heading"><div><p className="eyebrow">SAFETY QUEUE</p><h2>Needs a human eye</h2></div><span className="count">{loading ? '...' : reports}</span></div><div className="queue"><QueueItem title="Reports pending" value={loading ? '...' : reports} /><QueueItem title="Photos pending" value={loading ? '...' : pendingPhotos} /><QueueItem title="Active matches" value={loading ? '...' : matches} /></div><button className="text-button">Open moderation queue <span>→</span></button></div></section></>; }
function Metric({ label, value, delta, warn }) { return <div className="metric"><p>{label}</p><strong>{value}</strong><span className={warn ? 'metric-note warn' : 'metric-note'}>{delta}</span></div>; }
function QueueItem({ title, value }) { return <div className="queue-item"><span>{title}</span><strong>{value}</strong></div>; }
function Users({ users, loading }) { return <section className="panel table-panel"><div className="panel-heading"><div><p className="eyebrow">DIRECTORY</p><h2>Member accounts</h2></div><input className="search" placeholder="Search members" /></div><table><thead><tr><th>Member</th><th>Status</th><th>Joined</th><th>Profile</th></tr></thead><tbody>{loading ? <LoadingRow columns="4" /> : users.length ? users.map((user) => <tr key={user.id}><td><strong>{user.email || user.phone || user.id}</strong></td><td><span className="pill">{user.status}</span></td><td>{formatDate(user.createdAt)}</td><td>{user.profile?.name || 'Incomplete'}</td></tr>) : <EmptyRow columns="4" />}</tbody></table></section>; }
function DataTable({ title, eyebrow, headers, rows, loading }) { return <section className="panel table-panel"><div className="panel-heading"><div><p className="eyebrow">{eyebrow}</p><h2>{title}</h2></div></div><table><thead><tr>{headers.map((header) => <th key={header}>{header}</th>)}</tr></thead><tbody>{loading ? <LoadingRow columns={headers.length} /> : rows.length ? rows.map((row, index) => <tr key={row.id || index}>{row.cells.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}</tr>) : <EmptyRow columns={headers.length} />}</tbody></table></section>; }
function LoadingRow({ columns }) { return <tr><td colSpan={columns} className="empty">Loading records...</td></tr>; }
function EmptyRow({ columns }) { return <tr><td colSpan={columns} className="empty">No records returned.</td></tr>; }
function Profiles({ records, loading }) { return <DataTable title="Profile review" eyebrow="PROFILES" headers={['Name', 'Email', 'Gender', 'Location', 'Joined']} loading={loading} rows={records.map((profile) => ({ id: profile.id, cells: [profile.name, profile.user?.email || '—', profile.gender, profile.locationName || '—', formatDate(profile.createdAt)] }))} />; }
function Photos({ records, loading, token, onRefresh }) {
  const [moderating, setModerating] = useState(null);
  const [reason, setReason] = useState('');
  const [actionPending, setActionPending] = useState(null);

  const moderate = async (photoId, status) => {
    if ((status === 'rejected' || status === 'flagged') && !reason.trim()) {
      alert('Please enter a reason for this action');
      return;
    }
    setActionPending(photoId);
    try {
      const response = await fetch(`${API_URL}/photos/${photoId}/moderation`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status, reason: reason.trim() || undefined }),
      });
      if (!response.ok) throw new Error('Moderation failed');
      setModerating(null);
      setReason('');
      if (onRefresh) onRefresh();
    } catch (err) {
      alert(err.message);
    } finally {
      setActionPending(null);
    }
  };

  const statusColor = (status) => {
    const map = {
      approved: { background: '#d4edda', color: '#155724' },
      rejected: { background: '#f8d7da', color: '#721c24' },
      flagged:  { background: '#fff3cd', color: '#856404' },
    };
    return map[status] || { background: '#e2e3e5', color: '#383d41' };
  };

  return (
    <section className="panel table-panel">
      <div className="panel-heading">
        <div><p className="eyebrow">PHOTOS</p><h2>Photo review</h2></div>
      </div>
      {loading ? (
        <p style={{ padding: 20, color: '#6a7d75' }}>Loading records...</p>
      ) : records.length === 0 ? (
        <p style={{ padding: 20, color: '#6a7d75' }}>No photos to review.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16, padding: 20 }}>
          {records.map((photo) => (
            <div key={photo.id} style={{ background: '#fff', border: '1px solid #e0e7df', borderRadius: 9, overflow: 'hidden' }}>
              <div style={{ position: 'relative', background: '#f5f5f5' }}>
                {photo.s3Key ? (
                  <img
                    src={photo.s3Key}
                    alt="Review"
                    style={{ width: '100%', height: 280, objectFit: 'cover', display: 'block' }}
                  />
                ) : (
                  <div style={{ width: '100%', height: 280, display: 'grid', placeItems: 'center', color: '#999', fontSize: 13 }}>
                    No preview
                  </div>
                )}
                <span style={{
                  position: 'absolute', top: 8, left: 8,
                  padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                  ...statusColor(photo.moderationStatus),
                }}>
                  {photo.moderationStatus}
                </span>
              </div>
              <div style={{ padding: 14 }}>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 600 }}>
                  {photo.profile?.user?.email || photo.profile?.name || 'Unknown member'}
                </p>
                <p style={{ margin: '4px 0 0', fontSize: 11, color: '#6a7d75' }}>
                  {photo.createdAt ? new Date(photo.createdAt).toLocaleDateString() : '—'}
                  {photo.moderationReason && (
                    <span style={{ display: 'block', marginTop: 4, color: '#856404', fontStyle: 'italic' }}>
                      Reason: {photo.moderationReason}
                    </span>
                  )}
                </p>
                {moderating === photo.id ? (
                  <div style={{ marginTop: 10 }}>
                    <input
                      type="text"
                      placeholder="Reason (required for reject/flag)"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      style={{ width: '100%', padding: '8px 10px', border: '1px solid #ddd', borderRadius: 6, fontSize: 12, marginBottom: 8, boxSizing: 'border-box' }}
                    />
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => moderate(photo.id, 'approved')} disabled={actionPending === photo.id}
                        style={{ flex: 1, padding: '7px 0', border: 0, borderRadius: 6, background: '#28a745', color: '#fff', fontWeight: 600, fontSize: 12, cursor: 'pointer' }}>
                        {actionPending === photo.id ? '...' : 'Approve'}
                      </button>
                      <button onClick={() => moderate(photo.id, 'rejected')} disabled={actionPending === photo.id}
                        style={{ flex: 1, padding: '7px 0', border: 0, borderRadius: 6, background: '#dc3545', color: '#fff', fontWeight: 600, fontSize: 12, cursor: 'pointer' }}>
                        {actionPending === photo.id ? '...' : 'Reject'}
                      </button>
                      <button onClick={() => moderate(photo.id, 'flagged')} disabled={actionPending === photo.id}
                        style={{ flex: 1, padding: '7px 0', border: 0, borderRadius: 6, background: '#ffc107', color: '#333', fontWeight: 600, fontSize: 12, cursor: 'pointer' }}>
                        {actionPending === photo.id ? '...' : 'Flag'}
                      </button>
                    </div>
                    <button onClick={() => { setModerating(null); setReason(''); }}
                      style={{ width: '100%', marginTop: 6, padding: '6px 0', border: '1px solid #ddd', borderRadius: 6, background: 'transparent', color: '#666', fontSize: 12, cursor: 'pointer' }}>
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button onClick={() => setModerating(photo.id)}
                    style={{ marginTop: 10, width: '100%', padding: '8px 0', border: '1px solid #172a27', borderRadius: 6, background: 'transparent', color: '#172a27', fontWeight: 600, fontSize: 12, cursor: 'pointer' }}>
                    Review photo
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
function Matches({ records, loading }) { return <DataTable title="Matches" eyebrow="MATCHES" headers={['Member A', 'Member B', 'Status', 'Created']} loading={loading} rows={records.map((match) => ({ id: match.id, cells: [match.userA?.email || '—', match.userB?.email || '—', match.status, formatDate(match.createdAt)] }))} />; }
function Audit({ records, loading }) { return <DataTable title="Audit log" eyebrow="AUDIT" headers={['Action', 'Entity', 'Operator', 'Created']} loading={loading} rows={records.map((entry) => ({ id: entry.id, cells: [entry.action, `${entry.entity}${entry.entityId ? ` (${entry.entityId})` : ''}`, entry.admin?.email || '—', formatDate(entry.createdAt)] }))} />; }
function formatDate(value) { return value ? new Date(value).toLocaleDateString() : '—'; }
export default App;
