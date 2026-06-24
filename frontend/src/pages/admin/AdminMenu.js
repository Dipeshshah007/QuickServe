import React, { useState, useEffect } from 'react';
import { menuAPI, restaurantAPI } from '../../utils/api';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import styles from './AdminPages.module.css';

const EMPTY = {
  restaurant: '', name: '', description: '', category: '',
  price: '', discountedPrice: '', image: '',
  isVeg: false, isVegan: false, isGlutenFree: false,
  isBestSeller: false, isFeatured: false, isAvailable: true,
  spiceLevel: 'mild', calories: '', preparationTime: 15,
};

export default function AdminMenu() {
  const [items, setItems]         = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [showForm, setShowForm]   = useState(false);
  const [editId, setEditId]       = useState(null);
  const [form, setForm]           = useState(EMPTY);
  const [saving, setSaving]       = useState(false);
  const [filterRest, setFilterRest] = useState('');

  useEffect(() => {
    Promise.all([
      restaurantAPI.getAll({ limit: 50 }),
    ]).then(([restRes]) => {
      setRestaurants(restRes.data.restaurants);
      if (restRes.data.restaurants.length) {
        const firstId = restRes.data.restaurants[0]._id;
        setFilterRest(firstId);
        return menuAPI.getByRestaurant(firstId);
      }
    }).then(res => {
      if (res) setItems(res.data.items);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const loadItems = async (restId) => {
    setLoading(true);
    try {
      const res = await menuAPI.getByRestaurant(restId);
      setItems(res.data.items);
    } finally { setLoading(false); }
  };

  const handleRestFilter = (id) => { setFilterRest(id); loadItems(id); };

  const openAdd  = () => { setForm({ ...EMPTY, restaurant: filterRest }); setEditId(null); setShowForm(true); };
  const openEdit = (item) => { setForm({ ...item, discountedPrice: item.discountedPrice || '' }); setEditId(item._id); setShowForm(true); };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editId) {
        const res = await menuAPI.update(editId, form);
        setItems(its => its.map(i => i._id === editId ? res.data.item : i));
        toast.success('Item updated!');
      } else {
        const res = await menuAPI.create(form);
        setItems(its => [res.data.item, ...its]);
        toast.success('Item added!');
      }
      setShowForm(false);
    } catch (err) { toast.error(err.response?.data?.message || 'Save failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this item?')) return;
    try {
      await menuAPI.delete(id);
      setItems(its => its.filter(i => i._id !== id));
      toast.success('Item removed');
    } catch { toast.error('Failed'); }
  };

  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Menu Items</h1>
          <p className={styles.pageSub}>{items.length} items</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}><FiPlus size={16} /> Add Item</button>
      </div>

      <div className={styles.filterBar}>
        <select className={styles.filterSelect} value={filterRest} onChange={e => handleRestFilter(e.target.value)}>
          {restaurants.map(r => <option key={r._id} value={r._id}>{r.name}</option>)}
        </select>
      </div>

      {showForm && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2 className={styles.modalTitle}>{editId ? 'Edit' : 'Add'} Menu Item</h2>
            <form onSubmit={handleSave} className={styles.formGrid}>
              <div className="input-group">
                <label>Restaurant *</label>
                <select className="input" value={form.restaurant} onChange={e => f('restaurant', e.target.value)} required>
                  <option value="">Select...</option>
                  {restaurants.map(r => <option key={r._id} value={r._id}>{r.name}</option>)}
                </select>
              </div>
              <div className="input-group">
                <label>Category *</label>
                <input className="input" value={form.category} onChange={e => f('category', e.target.value)} required placeholder="e.g. Burgers, Sides..." />
              </div>
              <div className="input-group" style={{ gridColumn: '1/-1' }}>
                <label>Item Name *</label>
                <input className="input" value={form.name} onChange={e => f('name', e.target.value)} required />
              </div>
              <div className="input-group" style={{ gridColumn: '1/-1' }}>
                <label>Description</label>
                <textarea className="input" rows={2} value={form.description} onChange={e => f('description', e.target.value)} />
              </div>
              <div className="input-group">
                <label>Price ($) *</label>
                <input type="number" className="input" value={form.price} onChange={e => f('price', +e.target.value)} required min="0" step="0.01" />
              </div>
              <div className="input-group">
                <label>Discounted Price ($)</label>
                <input type="number" className="input" value={form.discountedPrice} onChange={e => f('discountedPrice', e.target.value ? +e.target.value : '')} min="0" step="0.01" placeholder="Optional" />
              </div>
              <div className="input-group" style={{ gridColumn: '1/-1' }}>
                <label>Image URL</label>
                <input className="input" value={form.image} onChange={e => f('image', e.target.value)} placeholder="https://..." />
              </div>
              <div className="input-group">
                <label>Spice Level</label>
                <select className="input" value={form.spiceLevel} onChange={e => f('spiceLevel', e.target.value)}>
                  {['mild','medium','hot','extra_hot'].map(s => <option key={s} value={s}>{s.replace('_',' ')}</option>)}
                </select>
              </div>
              <div className="input-group">
                <label>Prep Time (min)</label>
                <input type="number" className="input" value={form.preparationTime} onChange={e => f('preparationTime', +e.target.value)} min="0" />
              </div>
              <div className={styles.checkRow} style={{ gridColumn: '1/-1', flexWrap: 'wrap' }}>
                {[
                  { k: 'isVeg',        l: '🟢 Veg'        },
                  { k: 'isVegan',      l: '🌱 Vegan'      },
                  { k: 'isGlutenFree', l: '🌾 Gluten Free' },
                  { k: 'isBestSeller', l: '🏆 Bestseller'  },
                  { k: 'isAvailable',  l: '✅ Available'   },
                  { k: 'isFeatured',   l: '⭐ Featured'    },
                ].map(({ k, l }) => (
                  <label key={k}><input type="checkbox" checked={!!form[k]} onChange={e => f(k, e.target.checked)} /> {l}</label>
                ))}
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
            <thead><tr><th>Item</th><th>Category</th><th>Price</th><th>Tags</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {items.map(item => (
                <tr key={item._id}>
                  <td>
                    <div className={styles.restCell}>
                      {item.image && <img src={item.image} alt="" className={styles.restThumb} onError={e => e.target.style.display='none'} />}
                      <div>
                        <p className={styles.restName}>{item.name}</p>
                        <p className={styles.restAddr}>{item.description?.slice(0, 50)}...</p>
                      </div>
                    </div>
                  </td>
                  <td className={styles.cuisine}>{item.category}</td>
                  <td>
                    <strong>${item.price.toFixed(2)}</strong>
                    {item.discountedPrice && <s style={{ marginLeft: 6, color: 'var(--text-muted)', fontSize: '0.8rem' }}>${item.discountedPrice.toFixed(2)}</s>}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                      {item.isVeg && <span className="badge badge-veg">Veg</span>}
                      {item.isBestSeller && <span className="badge badge-best">Best</span>}
                    </div>
                  </td>
                  <td><span className={`${styles.statusBadge} ${item.isAvailable ? styles.active : styles.inactive}`}>{item.isAvailable ? 'Available' : 'Unavailable'}</span></td>
                  <td>
                    <div className={styles.actions}>
                      <button className={styles.editBtn} onClick={() => openEdit(item)}><FiEdit2 size={15} /></button>
                      <button className={styles.deleteBtn} onClick={() => handleDelete(item._id)}><FiTrash2 size={15} /></button>
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
