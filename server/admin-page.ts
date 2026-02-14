import { Express } from "express";

export function registerAdminPage(app: Express) {
  // Root route - API info page
  app.get("/", (_req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>IvyReader API</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0a0f1a; color: #e2e8f0; min-height: 100vh; display: flex; align-items: center; justify-content: center; }
    .container { text-align: center; padding: 2rem; }
    .logo { font-size: 3rem; margin-bottom: 1rem; }
    h1 { font-size: 2rem; margin-bottom: 0.5rem; color: #fff; }
    p { color: #94a3b8; margin-bottom: 2rem; font-size: 1.1rem; }
    .status { display: inline-flex; align-items: center; gap: 0.5rem; background: #1e293b; padding: 0.75rem 1.5rem; border-radius: 9999px; font-size: 0.9rem; }
    .dot { width: 8px; height: 8px; background: #22c55e; border-radius: 50%; animation: pulse 2s infinite; }
    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
    .links { margin-top: 2rem; display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
    .links a { color: #60a5fa; text-decoration: none; padding: 0.5rem 1rem; border: 1px solid #334155; border-radius: 8px; transition: all 0.2s; }
    .links a:hover { background: #1e293b; border-color: #60a5fa; }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">📚</div>
    <h1>IvyReader API</h1>
    <p>Backend server for the IvyReader mobile app</p>
    <div class="status"><span class="dot"></span> Server Online</div>
    <div class="links">
      <a href="/api/health">Health Check</a>
      <a href="/admin">Admin Dashboard</a>
    </div>
  </div>
</body>
</html>
    `);
  });

  // Admin dashboard page
  app.get("/admin", (_req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>IvyReader Admin</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0a0f1a; color: #e2e8f0; min-height: 100vh; }
    .login-container { min-height: 100vh; display: flex; align-items: center; justify-content: center; }
    .login-box { background: #1e293b; padding: 2rem; border-radius: 16px; width: 100%; max-width: 400px; margin: 1rem; }
    .login-box h1 { font-size: 1.5rem; margin-bottom: 0.5rem; text-align: center; }
    .login-box p { color: #94a3b8; text-align: center; margin-bottom: 1.5rem; font-size: 0.9rem; }
    .form-group { margin-bottom: 1rem; }
    .form-group label { display: block; font-size: 0.85rem; color: #94a3b8; margin-bottom: 0.5rem; }
    .form-group input { width: 100%; padding: 0.75rem; background: #0f172a; border: 1px solid #334155; border-radius: 8px; color: #e2e8f0; font-size: 1rem; outline: none; }
    .form-group input:focus { border-color: #60a5fa; }
    .btn { width: 100%; padding: 0.75rem; background: #3b82f6; color: white; border: none; border-radius: 8px; font-size: 1rem; cursor: pointer; font-weight: 600; }
    .btn:hover { background: #2563eb; }
    .btn:disabled { opacity: 0.5; cursor: not-allowed; }
    .error { color: #f87171; font-size: 0.85rem; margin-top: 0.5rem; text-align: center; }
    
    .dashboard { display: none; padding: 1.5rem; max-width: 1200px; margin: 0 auto; }
    .dashboard.active { display: block; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; padding-bottom: 1rem; border-bottom: 1px solid #334155; }
    .header h1 { font-size: 1.5rem; }
    .header button { padding: 0.5rem 1rem; background: #334155; color: #e2e8f0; border: none; border-radius: 8px; cursor: pointer; }
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
    .stat-card { background: #1e293b; padding: 1.25rem; border-radius: 12px; }
    .stat-card .label { font-size: 0.8rem; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; }
    .stat-card .value { font-size: 2rem; font-weight: 700; margin-top: 0.25rem; }
    .stat-card .value.green { color: #22c55e; }
    .stat-card .value.blue { color: #60a5fa; }
    .stat-card .value.purple { color: #a78bfa; }
    .stat-card .value.amber { color: #fbbf24; }
    
    .section { background: #1e293b; border-radius: 12px; padding: 1.25rem; margin-bottom: 1.5rem; }
    .section h2 { font-size: 1.1rem; margin-bottom: 1rem; }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 0.75rem; text-align: left; border-bottom: 1px solid #334155; font-size: 0.9rem; }
    th { color: #94a3b8; font-weight: 500; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em; }
    .badge { padding: 0.2rem 0.6rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 600; }
    .badge-free { background: #334155; color: #94a3b8; }
    .badge-premium { background: #1e3a5f; color: #60a5fa; }
    .badge-elite { background: #3b1f5e; color: #a78bfa; }
    .badge-admin { background: #3b1f1f; color: #f87171; }
    .action-btn { padding: 0.3rem 0.6rem; border: 1px solid #334155; background: transparent; color: #94a3b8; border-radius: 6px; cursor: pointer; font-size: 0.8rem; margin-right: 0.25rem; }
    .action-btn:hover { border-color: #60a5fa; color: #60a5fa; }
    .action-btn.danger:hover { border-color: #f87171; color: #f87171; }
    
    .conversations { margin-top: 1rem; }
    .conversation { background: #0f172a; border-radius: 8px; padding: 1rem; margin-bottom: 0.75rem; }
    .conversation-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; }
    .conversation-header strong { color: #e2e8f0; }
    .conversation-header .unread { background: #ef4444; color: white; padding: 0.1rem 0.5rem; border-radius: 9999px; font-size: 0.75rem; }
    .messages { max-height: 300px; overflow-y: auto; margin-bottom: 0.75rem; }
    .message { padding: 0.5rem 0.75rem; margin-bottom: 0.5rem; border-radius: 8px; font-size: 0.9rem; }
    .message.user { background: #1e293b; }
    .message.founder { background: #1e3a5f; }
    .message .meta { font-size: 0.75rem; color: #64748b; margin-top: 0.25rem; }
    .reply-box { display: flex; gap: 0.5rem; }
    .reply-box input { flex: 1; padding: 0.5rem; background: #1e293b; border: 1px solid #334155; border-radius: 6px; color: #e2e8f0; font-size: 0.9rem; }
    .reply-box button { padding: 0.5rem 1rem; background: #3b82f6; color: white; border: none; border-radius: 6px; cursor: pointer; }
    
    .loading { text-align: center; padding: 2rem; color: #64748b; }
    .refresh-btn { padding: 0.5rem 1rem; background: #1e293b; color: #60a5fa; border: 1px solid #334155; border-radius: 8px; cursor: pointer; margin-left: 0.5rem; }
    .refresh-btn:hover { background: #334155; }
    
    @media (max-width: 768px) {
      .stats-grid { grid-template-columns: repeat(2, 1fr); }
      table { font-size: 0.8rem; }
      th, td { padding: 0.5rem; }
    }
  </style>
</head>
<body>
  <div class="login-container" id="loginView">
    <div class="login-box">
      <h1>📚 IvyReader Admin</h1>
      <p>Enter admin password to access the dashboard</p>
      <div class="form-group">
        <label>Admin Password</label>
        <input type="password" id="secretKey" placeholder="Enter admin secret" onkeypress="if(event.key==='Enter')login()">
      </div>
      <button class="btn" onclick="login()" id="loginBtn">Sign In</button>
      <div class="error" id="loginError"></div>
    </div>
  </div>

  <div class="dashboard" id="dashboardView">
    <div class="header">
      <h1>📚 IvyReader Admin</h1>
      <div>
        <button class="refresh-btn" onclick="loadDashboard()">↻ Refresh</button>
        <button onclick="logout()">Logout</button>
      </div>
    </div>
    
    <div class="stats-grid" id="statsGrid">
      <div class="loading">Loading stats...</div>
    </div>
    
    <div class="section">
      <h2>Users</h2>
      <div style="overflow-x: auto;">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Tier</th>
              <th>Role</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="usersTable">
            <tr><td colspan="7" class="loading">Loading users...</td></tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <div class="section">
      <h2>Elite Accountability Messages</h2>
      <div class="conversations" id="conversations">
        <div class="loading">Loading conversations...</div>
      </div>
    </div>
  </div>

  <script>
    const API_BASE = window.location.origin;
    let secretKey = '';

    function login() {
      secretKey = document.getElementById('secretKey').value;
      if (!secretKey) {
        document.getElementById('loginError').textContent = 'Please enter the admin password';
        return;
      }
      document.getElementById('loginBtn').disabled = true;
      document.getElementById('loginBtn').textContent = 'Signing in...';
      
      // Test the key by fetching dashboard data
      fetch(API_BASE + '/api/trpc/adminPublic.dashboard?input=' + encodeURIComponent(JSON.stringify({ json: { secretKey } })))
        .then(r => r.json())
        .then(data => {
          if (data.error || (data.result && data.result.error)) {
            throw new Error('Invalid password');
          }
          localStorage.setItem('ivyreader_admin_key', secretKey);
          document.getElementById('loginView').style.display = 'none';
          document.getElementById('dashboardView').classList.add('active');
          loadDashboard();
        })
        .catch(err => {
          document.getElementById('loginError').textContent = 'Invalid admin password. Please try again.';
          document.getElementById('loginBtn').disabled = false;
          document.getElementById('loginBtn').textContent = 'Sign In';
        });
    }

    function logout() {
      localStorage.removeItem('ivyreader_admin_key');
      secretKey = '';
      document.getElementById('loginView').style.display = 'flex';
      document.getElementById('dashboardView').classList.remove('active');
      document.getElementById('secretKey').value = '';
      document.getElementById('loginError').textContent = '';
    }

    async function trpcQuery(path, input) {
      const url = API_BASE + '/api/trpc/' + path + '?input=' + encodeURIComponent(JSON.stringify({ json: input }));
      const res = await fetch(url);
      const data = await res.json();
      if (data.result && data.result.data && data.result.data.json !== undefined) {
        return data.result.data.json;
      }
      throw new Error('API error');
    }

    async function trpcMutation(path, input) {
      const res = await fetch(API_BASE + '/api/trpc/' + path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ json: input })
      });
      const data = await res.json();
      if (data.result && data.result.data && data.result.data.json !== undefined) {
        return data.result.data.json;
      }
      throw new Error('API error');
    }

    async function loadDashboard() {
      try {
        const data = await trpcQuery('adminPublic.dashboard', { secretKey });
        
        // Render stats
        const counts = data.userCounts || {};
        const metrics = data.metrics || {};
        document.getElementById('statsGrid').innerHTML = \`
          <div class="stat-card"><div class="label">Total Users</div><div class="value blue">\${counts.total || 0}</div></div>
          <div class="stat-card"><div class="label">Free Users</div><div class="value">\${counts.free || 0}</div></div>
          <div class="stat-card"><div class="label">Premium Users</div><div class="value green">\${counts.premium || 0}</div></div>
          <div class="stat-card"><div class="label">Elite Users</div><div class="value purple">\${counts.elite || 0}</div></div>
          <div class="stat-card"><div class="label">Books Added</div><div class="value amber">\${metrics.totalBooks || 0}</div></div>
          <div class="stat-card"><div class="label">Reading Sessions</div><div class="value blue">\${metrics.totalSessions || 0}</div></div>
          <div class="stat-card"><div class="label">Social Posts</div><div class="value green">\${metrics.totalPosts || 0}</div></div>
          <div class="stat-card"><div class="label">Notes Created</div><div class="value">\${metrics.totalNotes || 0}</div></div>
        \`;
        
        // Render users table
        const users = data.users || [];
        if (users.length === 0) {
          document.getElementById('usersTable').innerHTML = '<tr><td colspan="7" style="text-align:center;color:#64748b;">No users yet</td></tr>';
        } else {
          document.getElementById('usersTable').innerHTML = users.map(u => \`
            <tr>
              <td>\${u.id}</td>
              <td>\${u.name || '-'}</td>
              <td>\${u.email || '-'}</td>
              <td><span class="badge badge-\${u.subscriptionTier || 'free'}">\${u.subscriptionTier || 'free'}</span></td>
              <td>\${u.role === 'admin' ? '<span class="badge badge-admin">admin</span>' : u.role || 'user'}</td>
              <td>\${u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '-'}</td>
              <td>
                <button class="action-btn" onclick="changeTier(\${u.id}, 'premium')">→ Premium</button>
                <button class="action-btn" onclick="changeTier(\${u.id}, 'elite')">→ Elite</button>
                <button class="action-btn danger" onclick="deleteUser(\${u.id})">Delete</button>
              </td>
            </tr>
          \`).join('');
        }
        
        // Load conversations
        loadConversations();
      } catch (err) {
        console.error('Dashboard load error:', err);
        document.getElementById('statsGrid').innerHTML = '<div class="loading" style="color:#f87171;">Failed to load dashboard. Check your admin password.</div>';
      }
    }

    async function loadConversations() {
      try {
        const convos = await trpcQuery('adminAccountability.getConversations', { secretKey });
        if (!convos || convos.length === 0) {
          document.getElementById('conversations').innerHTML = '<div class="loading">No conversations yet</div>';
          return;
        }
        
        document.getElementById('conversations').innerHTML = convos.map(c => {
          const msgs = (c.messages || []).map(m => \`
            <div class="message \${m.senderType}">
              <div>\${m.content}</div>
              <div class="meta">\${m.senderType === 'founder' ? 'You' : c.userName || 'User'} · \${new Date(m.createdAt).toLocaleString()}</div>
            </div>
          \`).join('');
          
          return \`
            <div class="conversation">
              <div class="conversation-header">
                <strong>\${c.userName || 'User #' + c.userId}</strong>
                \${c.unreadCount > 0 ? '<span class="unread">' + c.unreadCount + ' new</span>' : ''}
              </div>
              <div class="messages">\${msgs || '<div class="loading">No messages</div>'}</div>
              <div class="reply-box">
                <input type="text" placeholder="Reply as founder..." id="reply-\${c.userId}" onkeypress="if(event.key==='Enter')sendReply(\${c.userId})">
                <button onclick="sendReply(\${c.userId})">Send</button>
              </div>
            </div>
          \`;
        }).join('');
      } catch (err) {
        document.getElementById('conversations').innerHTML = '<div class="loading">Failed to load conversations</div>';
      }
    }

    async function changeTier(userId, tier) {
      if (!confirm('Change user #' + userId + ' to ' + tier + '?')) return;
      try {
        await trpcMutation('adminPublic.updateUserTier', { secretKey, userId, tier });
        loadDashboard();
      } catch (err) {
        alert('Failed to update tier');
      }
    }

    async function deleteUser(userId) {
      if (!confirm('Are you sure you want to delete user #' + userId + '? This cannot be undone.')) return;
      try {
        await trpcMutation('adminPublic.deleteUser', { secretKey, userId });
        loadDashboard();
      } catch (err) {
        alert('Failed to delete user');
      }
    }

    async function sendReply(userId) {
      const input = document.getElementById('reply-' + userId);
      const content = input.value.trim();
      if (!content) return;
      try {
        await trpcMutation('adminAccountability.sendResponse', { secretKey, userId, content });
        input.value = '';
        loadConversations();
      } catch (err) {
        alert('Failed to send reply');
      }
    }

    // Auto-login if key is saved
    window.onload = function() {
      const saved = localStorage.getItem('ivyreader_admin_key');
      if (saved) {
        secretKey = saved;
        document.getElementById('loginView').style.display = 'none';
        document.getElementById('dashboardView').classList.add('active');
        loadDashboard();
      }
    };
  </script>
</body>
</html>
    `);
  });
}
