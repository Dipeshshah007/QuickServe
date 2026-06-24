import React, { useState, useEffect } from 'react';
import { restaurantAPI } from '../../utils/api';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiStar, FiClock } from 'react-icons/fi';
import styles from './AdminPages.module.css';

const EMPTY_RESTAURANT = {
  name: '', description: '', cuisineTypes: '', address: { street: '', city: '', state: '', zipCode: '' },
  contactPhone: '', contactEmail: '',
  deliveryInfo: { minOrder: 0, deliveryFee: 0, estimatedTime: '30-45 min', freeDeliveryAbove: 0 },
  isFeatured: false, isActive: true,
  image: '', coverImage: '',
};

export default function AdminRestaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [showForm, setShowForm]       = useState(false);
  const [editItem, setEditItem]       = useState(null);
  const [form, setForm]               = useState(EMPTY_RESTAURANT);
  const [saving, setSaving]           = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await restaurantAPI.getAll({ limit: 50 });
      setRestaurants(res.data.restaurants);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openAdd  = () => { setForm(EMPTY_RESTAURANT); setEditItem(null); setShowForm(true); };
  const openEdit = (r)  => {
    setForm({ ...r, cuisineTypes: r.cuisineTypes?.join(', ') || '' });
    setEditItem(r._id);
    setShowForm(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, cuisineTypes: form.cuisineTypes.split(',').map(s => s.trim()).filter(Boolean) };
      if (editItem) {
        const res = await restaurantAPI.update(editItem, payload);
        setRestaurants(rs => rs.map(r => r._id === editItem ? res.data.restaurant : r));
        toast.success('Restaurant updated!');
      } else {
        const res = await restaurantAPI.create(payload);
        setRestaurants(rs => [res.data.restaurant, ...rs]);
        toast.success('Restaurant created!');
      }
      setShowForm(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Deactivate this restaurant?')) return;
    try {
      await restaurantAPI.delete(id);
      setRestaurants(rs => rs.filter(r => r._id !== id));
      toast.success('Restaurant deactivated');
    } catch { toast.error('Failed to delete'); }
  };

  const set = (path, val) => {
    setForm(prev => {
      const copy = { ...prev };
      const parts = path.split('.');
      let obj = copy;
      for (let i = 0; i < parts.length - 1; i++) { obj[parts[i]] = { ...obj[parts[i]] }; obj = obj[parts[i]]; }
      obj[parts[parts.length - 1]] = val;
      return copy;
    });
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Restaurants</h1>
          <p className={styles.pageSub}>{restaurants.length} restaurants total</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}><FiPlus size={16} /> Add Restaurant</button>
      </div>

      {showForm && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2 className={styles.modalTitle}>{editItem ? 'Edit' : 'Add'} Restaurant</h2>
            <form onSubmit={handleSave} className={styles.formGrid}>
              <div className="input-group" style={{ gridColumn: '1/-1' }}>
                <label>Restaurant Name *</label>
                <input className="input" value={form.name} onChange={e => set('name', e.target.value)} required />
              </div>
              <div className="input-group" style={{ gridColumn: '1/-1' }}>
                <label>Description *</label>
                <textarea className="input" rows={3} value={form.description} onChange={e => set('description', e.target.value)} required />
              </div>
              <div className="input-group" style={{ gridColumn: '1/-1' }}>
                <label>Cuisine Types (comma separated)</label>
                <input className="input" value={form.cuisineTypes} onChange={e => set('cuisineTypes', e.target.value)} placeholder="Italian, Pizza, Mediterranean" />
              </div>
              <div className="input-group" style={{ gridColumn: '1/-1' }}>
                <label>Street Address</label>
                <input className="input" value={form.address?.street} onChange={e => set('address.street', e.target.value)} />
              </div>
              <div className="input-group">
                <label>City</label>
                <input className="input" value={form.address?.city} onChange={e => set('address.city', e.target.value)} />
              </div>
              <div className="input-group">
                <label>State</label>
                <input className="input" value={form.address?.state} onChange={e => set('address.state', e.target.value)} />
              </div>
              <div className="input-group">
                <label>ZIP</label>
                <input className="input" value={form.address?.zipCode} onChange={e => set('address.zipCode', e.target.value)} />
              </div>
              <div className="input-group">
                <label>Phone</label>
                <input className="input" value={form.contactPhone} onChange={e => set('contactPhone', e.target.value)} />
              </div>
              <div className="input-group">
                <label>Delivery Fee ($)</label>
                <input type="number" className="input" value={form.deliveryInfo?.deliveryFee} onChange={e => set('deliveryInfo.deliveryFee', +e.target.value)} min="0" step="0.01" />
              </div>
              <div className="input-group">
                <label>Estimated Time</label>
                <input className="input" value={form.deliveryInfo?.estimatedTime} onChange={e => set('deliveryInfo.estimatedTime', e.target.value)} />
              </div>
              <div className="input-group" style={{ gridColumn: '1/-1' }}>
                <label>Image URL</label>
                <input className="input" value={form.image} onChange={e => set('image', e.target.value)} placeholder="https://..." />
              </div>
              <div className={styles.checkRow}>
                <label><input type="checkbox" checked={form.isFeatured} onChange={e => set('isFeatured', e.target.checked)} /> Featured restaurant</label>
                <label><input type="checkbox" checked={form.isActive} onChange={e => set('isActive', e.target.checked)} /> Active</label>
              </div>
              <div className={styles.modalBtns} style={{ gridColumn: '1/-1' }}>
                <button type="button" className="btn btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
              </div>
            </form>
          </div>
          <div className={styles.modalOverlay} onClick={() => setShowForm(false)} />
        </div>
      )}

      {loading ? <div className="loading-container"><div className="spinner" /></div> : (
        <div className={styles.tableCard}>
          <table className={styles.table}>
            <thead>
              <tr><th>Restaurant</th><th>Cuisine</th><th>Rating</th><th>Delivery</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {restaurants.map(r => (
                <tr key={r._id}>
                  <td>
                    <div className={styles.restCell}>
                      <img src={r.image} alt="" className={styles.restThumb} onError={e => e.target.style.display='none'} />
                      <div>
                        <p className={styles.restName}>{r.name}</p>
                        <p className={styles.restAddr}>{r.address?.city}, {r.address?.state}</p>
                      </div>
                    </div>
                  </td>
                  <td className={styles.cuisine}>{r.cuisineTypes?.slice(0, 2).join(', ')}</td>
                  <td><span className={styles.rating}><FiStar size={13} fill="#F59E0B" stroke="#F59E0B" /> {r.rating?.average?.toFixed(1)}</span></td>
                  <td><span className={styles.delivery}><FiClock size={13} /> {r.deliveryInfo?.estimatedTime}</span></td>
                  <td>
                    <span className={`${styles.statusBadge} ${r.isActive ? styles.active : styles.inactive}`}>
                      {r.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button className={styles.editBtn} onClick={() => openEdit(r)}><FiEdit2 size={15} /></button>
                      <button className={styles.deleteBtn} onClick={() => handleDelete(r._id)}><FiTrash2 size={15} /></button>
                    </div>
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
