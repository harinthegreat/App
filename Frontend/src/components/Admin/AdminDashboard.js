import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';
import '../../styles/admin.css';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loginHistory, setLoginHistory] = useState([]);
  const [suspiciousLogins, setSuspiciousLogins] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [alertUsername, setAlertUsername] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [groupAlertId, setGroupAlertId] = useState('');
  const [groupAlertMessage, setGroupAlertMessage] = useState('');

  useEffect(() => {
    api.get('/auth/admin/users').then(res => setUsers(res.data)).catch(err => toast.error('Failed to load users'));
    api.get('/auth/admin/suspicious-logins').then(res => setSuspiciousLogins(res.data)).catch(err => toast.error('Failed to load suspicious logins'));
    api.get('/auth/admin/active-users').then(res => setActiveUsers(res.data)).catch(err => toast.error('Failed to load active users'));
    api.get('/auth/admin/groups').then(res => setGroups(res.data)).catch(err => toast.error('Failed to load groups'));
  }, []);

  const handleLoginHistory = async (username) => {
    try {
      const res = await api.get(`/auth/admin/login-history/${username}`);
      setLoginHistory(res.data);
    } catch (err) {
      toast.error('Failed to load login history');
    }
  };

  const handleDisableMfa = async (username) => {
    try {
      await api.post(`/auth/admin/disable-mfa/${username}`);
      toast.success(`MFA disabled for ${username}`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to disable MFA');
    }
  };

  const handleBanUser = async (username) => {
    try {
      await api.post(`/auth/admin/ban-user/${username}`);
      toast.success(`User ${username} banned/unbanned`);
      const res = await api.get('/auth/admin/users');
      setUsers(res.data);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Ban failed');
    }
  };

  const handleSendAlert = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/admin/send-alert', { username: alertUsername, message: alertMessage });
      toast.success('Alert sent!');
      setAlertUsername('');
      setAlertMessage('');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to send alert');
    }
  };

  const handleGroupAlert = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/auth/admin/groups/${groupAlertId}/alert`, { message: groupAlertMessage });
      toast.success('Group alert sent!');
      setGroupAlertId('');
      setGroupAlertMessage('');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to send group alert');
    }
  };

  const handleBanGroup = async (id) => {
    try {
      await api.post(`/auth/admin/groups/${id}/ban`);
      toast.success('Group banned!');
      const res = await api.get('/auth/admin/groups');
      setGroups(res.data);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Ban failed');
    }
  };

  const handleDeleteGroup = async (id) => {
    try {
      await api.delete(`/auth/admin/groups/${id}`);
      toast.success('Group deleted!');
      const res = await api.get('/auth/admin/groups');
      setGroups(res.data);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Delete failed');
    }
  };

  return (
    <div className="admin-dashboard fade-in">
      <div className="admin-section card">
        <h3>Users</h3>
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.username}>
                <td>{u.username}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>
                  <button onClick={() => handleLoginHistory(u.username)}>History</button>
                  <button onClick={() => handleDisableMfa(u.username)}>Disable MFA</button>
                  <button className="danger" onClick={() => handleBanUser(u.username)}>Ban/Unban</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="admin-section card">
        <h3>Login History</h3>
        {loginHistory.length === 0 ? (
          <p>Select a user to view history</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Username</th>
                <th>IP Address</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {loginHistory.map(h => (
                <tr key={h.id}>
                  <td>{h.username}</td>
                  <td>{h.ipAddress}</td>
                  <td>{new Date(h.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <div className="admin-section card">
        <h3>Suspicious Logins</h3>
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>IP Address</th>
              <th>Reason</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {suspiciousLogins.map(s => (
              <tr key={s.id}>
                <td>{s.username}</td>
                <td>{s.ipAddress}</td>
                <td>{s.reason}</td>
                <td>{new Date(s.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="admin-section card">
        <h3>Active Users</h3>
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Last Active</th>
            </tr>
          </thead>
          <tbody>
            {activeUsers.map(u => (
              <tr key={u.id}>
                <td>{u.username}</td>
                <td>{new Date(u.lastActive).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="admin-section card">
        <h3>Send User Alert</h3>
        <form onSubmit={handleSendAlert}>
          <input
            type="text"
            placeholder="Username"
            value={alertUsername}
            onChange={(e) => setAlertUsername(e.target.value)}
          />
          <textarea
            placeholder="Message"
            value={alertMessage}
            onChange={(e) => setAlertMessage(e.target.value)}
          />
          <button className="primary" type="submit">Send</button>
        </form>
      </div>
      <div className="admin-section card">
        <h3>Groups</h3>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Creator</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {groups.map(g => (
              <tr key={g.groupId}>
                <td>{g.name}</td>
                <td>{g.creatorUsername}</td>
                <td>
                  <button onClick={() => handleBanGroup(g.groupId)}>Ban</button>
                  <button className="danger" onClick={() => handleDeleteGroup(g.groupId)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="admin-section card">
        <h3>Send Group Alert</h3>
        <form onSubmit={handleGroupAlert}>
          <input
            type="text"
            placeholder="Group ID"
            value={groupAlertId}
            onChange={(e) => setGroupAlertId(e.target.value)}
          />
          <textarea
            placeholder="Message"
            value={groupAlertMessage}
            onChange={(e) => setGroupAlertMessage(e.target.value)}
          />
          <button className="primary" type="submit">Send</button>
        </form>
      </div>
    </div>
  );
};

export default AdminDashboard;