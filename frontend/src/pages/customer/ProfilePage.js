import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../utils/api';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiPhone, FiLock, FiMapPin, FiSave } from 'react-icons/fi';
import styles from './ProfilePage.module.css';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [tab, setTab]     = useState('profile');
  const [saving, setSaving] = useState(false);

  const [profile, setProfile] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [newAddress, setNewAddress] = useState({ label: 'Home', street: '', city: '', state: '', zipCode: '', isDefault: false });

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await authAPI.updateProfile(profile);
      updateUser(res.data.user);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally { setSaving(false); }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setSaving(true);
    try {
      await authAPI.changePassword({ currentPassword: passwords.currentPassword, newPassword: passwords.newPassword });
      toast.success('Password changed!');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Change failed');
    } finally { setSaving(false); }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await authAPI.addAddress(newAddress);
      updateUser({ ...user, addresses: res.data.addresses });
      toast.success('Address saved!');
      setNewAddress({ label: 'Home', street: '', city: '', state: '', zipCode: '', isDefault: false });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save address');
    } finally { setSaving(false); }
  };

  return (
    <div className={styles.page}>
      <div className="container-sm">
        <div className={styles.header}>
          <div className={styles.avatarLarge}>{user?.name?.[0]?.toUpperCase()}</div>
          <div>
            <h1 className="page-title">{user?.name}</h1>
            <p className="text-muted">{user?.email} · {user?.role}</p>
          </div>
        </div>

        <div className={styles.tabs}>
          {[
            { key: 'profile',   label: 'Profile',   icon: <FiUser size={16} /> },
            { key: 'security',  label: 'Security',  icon: <FiLock size={16} /> },
            { key: 'addresses', label: 'Addresses', icon: <FiMapPin size={16} /> },
          ].map(t => (
            <button key={t.key} className={`${styles.tab} ${tab === t.key ? styles.activeTab : ''}`} onClick={() => setTab(t.key)}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {tab === 'profile' && (
          <form className={`${styles.card} card`} onSubmit={handleProfileSave}>
            <h2 className={styles.cardTitle}>Personal Information</h2>
            <div className={styles.formGrid}>
              <div className="input-group">
                <label><FiUser size={14} /> Full Name</label>
                <input className="input" value={profile.name}
                  onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
                  placeholder="John Doe" required />
              </div>
              <div className="input-group">
                <label><FiMail size={14} /> Email</label>
                <input className="input" value={user?.email} disabled style={{ opacity: 0.6 }} />
              </div>
              <div className="input-group">
                <label><FiPhone size={14} /> Phone</label>
                <input className="input" value={profile.phone}
                  onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))}
                  placeholder="+1-555-0100" />
              </div>
            </div>
            <button type="submit" className="btn btn-primary" disabled={saving} style={{ marginTop: 24 }}>
              <FiSave size={16} /> {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        )}

        {/* Security Tab */}
        {tab === 'security' && (
          <form className={`${styles.card} card`} onSubmit={handlePasswordChange}>
            <h2 className={styles.cardTitle}>Change Password</h2>
            <div className={styles.formGrid} style={{ gridTemplateColumns: '1fr' }}>
              <div className="input-group">
                <label>Current Password</label>
                <input type="password" className="input" value={passwords.currentPassword}
                  onChange={e => setPasswords(p => ({ ...p, currentPassword: e.target.value }))} required />
              </div>
              <div className="input-group">
                <label>New Password</label>
                <input type="password" className="input" value={passwords.newPassword} minLength={6}
                  onChange={e => setPasswords(p => ({ ...p, newPassword: e.target.value }))} required />
              </div>
              <div className="input-group">
                <label>Confirm New Password</label>
                <input type="password" className="input" value={passwords.confirmPassword}
                  onChange={e => setPasswords(p => ({ ...p, confirmPassword: e.target.value }))} required />
              </div>
            </div>
            <button type="submit" className="btn btn-primary" disabled={saving} style={{ marginTop: 24 }}>
              <FiLock size={16} /> {saving ? 'Updating...' : 'Change Password'}
            </button>
          </form>
        )}

        {/* Addresses Tab */}
        {tab === 'addresses' && (
          <div>
            {user?.addresses?.length > 0 && (
              <div className={`${styles.card} card`} style={{ marginBottom: 20 }}>
                <h2 className={styles.cardTitle}>Saved Addresses</h2>
                <div className={styles.addressList}>
                  {user.addresses.map((addr, i) => (
                    <div key={i} className={styles.addrItem}>
                      <div className={styles.addrIcon}><FiMapPin size={16} /></div>
                      <div>
                        <p><strong>{addr.label}</strong>{addr.isDefault && <span className={styles.defaultBadge}>Default</span>}</p>
                        <p className={styles.addrText}>{addr.street}, {addr.city}, {addr.state} {addr.zipCode}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <form className={`${styles.card} card`} onSubmit={handleAddAddress}>
              <h2 className={styles.cardTitle}>Add New Address</h2>
              <div className={styles.formGrid}>
                <div className="input-group" style={{ gridColumn: '1/-1' }}>
                  <label>Street Address *</label>
                  <input className="input" value={newAddress.street}
                    onChange={e => setNewAddress(a => ({ ...a, street: e.target.value }))} required placeholder="123 Main St" />
                </div>
                <div className="input-group">
                  <label>City *</label>
                  <input className="input" value={newAddress.city}
                    onChange={e => setNewAddress(a => ({ ...a, city: e.target.value }))} required placeholder="New York" />
                </div>
                <div className="input-group">
                  <label>State *</label>
                  <input className="input" value={newAddress.state}
                    onChange={e => setNewAddress(a => ({ ...a, state: e.target.value }))} required placeholder="NY" />
                </div>
                <div className="input-group">
                  <label>ZIP Code *</label>
                  <input className="input" value={newAddress.zipCode}
                    onChange={e => setNewAddress(a => ({ ...a, zipCode: e.target.value }))} required placeholder="10001" />
                </div>
                <div className="input-group">
                  <label>Label</label>
                  <select className="input" value={newAddress.label} onChange={e => setNewAddress(a => ({ ...a, label: e.target.value }))}>
                    <option>Home</option><option>Work</option><option>Other</option>
                  </select>
                </div>
              </div>
              <label className={styles.defaultCheck}>
                <input type="checkbox" checked={newAddress.isDefault}
                  onChange={e => setNewAddress(a => ({ ...a, isDefault: e.target.checked }))} />
                Set as default address
              </label>
              <button type="submit" className="btn btn-primary" disabled={saving} style={{ marginTop: 20 }}>
                <FiMapPin size={16} /> {saving ? 'Saving...' : 'Save Address'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
