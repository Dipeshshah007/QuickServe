import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../utils/api';
import toast from 'react-hot-toast';
import { FiSearch } from 'react-icons/fi';
import styles from './AdminPages.module.css';

export default function AdminUsers() {
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');
  const [role, setRole]       = useState('');
  const [total, setTotal]     = useState(0);

  const load = async () => {
    setLoading(true);
    try {
      const res = await adminAPI.getUsers({ search: search || undefined, role: role || undefined, limit: 50 });
      setUsers(res.data.users);
      setTotal(res.data.total);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [role]);

  const handleToggle = async (id) => {
    try {
      const res = await adminAPI.toggleUser(id);
      setUsers(us => us.map(u => u._id === id ? res.data.user : u));
      toast.success('User status updated!');
    } catch { toast.error('Failed'); }
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Users</h1>
          <p className={styles.pageSub}>{total} registered users</p>
        </div>
      </div>

      <div className={styles.filterBar}>
        <div style={{ position: 'relative' }}>
          <FiSearch size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            style={{ paddingLeft: 36 }}
            className={styles.filterSelect}
            placeholder="Search by name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && load()}
          />
        </div>
        <select className={styles.filterSelect} value={role} onChange={e => setRole(e.target.value)}>
          <option value="">All Roles</option>
          <option value="customer">Customers</option>
          <option value="admin">Admins</option>
        </select>
        <button className="btn btn-outline btn-sm" onClick={load}>Search</button>
      </div>

      {loading ? <div className="loading-container"><div className="spinner" /></div> : (
        <div className={styles.tableCard}>
          <table className={styles.table}>
            <thead>
              <tr><th>User</th><th>Phone</th><th>Role</th><th>Joined</th><th>Status</th><th>Action</th></tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id}>
                  <td>
                    <div className={styles.userCell}>
                      <div className={styles.userAvatar}>{user.name?.[0]?.toUpperCase()}</div>
                      <div>
                        <p className={styles.userName}>{user.name}</p>
                        <p className={styles.userEmail}>{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{user.phone || '—'}</td>
                  <td>
                    <span className={`${styles.roleBadge} ${user.role === 'admin' ? styles.roleAdmin : styles.roleCustomer}`}>
                      {user.role}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    <span className={`${styles.statusBadge} ${user.isActive ? styles.active : styles.inactive}`}>
                      {user.isActive ? 'Active' : 'Suspended'}
                    </span>
                  </td>
                  <td>
                    {user.role !== 'admin' && (
                      <button
                        className={`${styles.toggleBtn} ${user.isActive ? styles.toggleActive : styles.toggleInactive}`}
                        onClick={() => handleToggle(user._id)}
                      >
                        {user.isActive ? 'Suspend' : 'Activate'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
