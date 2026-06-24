import React, { useState, useEffect } from 'react';
import { orderAPI } from '../../utils/api';
import toast from 'react-hot-toast';
import styles from './AdminPages.module.css';

const STATUS_OPTIONS = ['pending','confirmed','preparing','out_for_delivery','delivered','cancelled'];

const STATUS_COLORS = {
  pending:           { color: '#F59E0B', bg: '#FEF3C7' },
  confirmed:         { color: '#3B82F6', bg: '#DBEAFE' },
  preparing:         { color: '#8B5CF6', bg: '#EDE9FE' },
  out_for_delivery:  { color: '#F97316', bg: '#FED7AA' },
  delivered:         { color: '#22C55E', bg: '#D1FAE5' },
  cancelled:         { color: '#EF4444', bg: '#FEE2E2' },
};

export default function AdminOrders() {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState('');
  const [page, setPage]       = useState(1);
  const [total, setTotal]     = useState(0);

  const load = async () => {
    setLoading(true);
    try {
      const res = await orderAPI.getAllOrders({ status: filter || undefined, page, limit: 20 });
      setOrders(res.data.orders);
      setTotal(res.data.total);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [filter, page]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await orderAPI.updateStatus(orderId, { status: newStatus, note: `Status updated to ${newStatus}` });
      setOrders(os => os.map(o => o._id === orderId ? res.data.order : o));
      toast.success('Status updated!');
    } catch { toast.error('Failed to update status'); }
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Orders</h1>
          <p className={styles.pageSub}>{total} total orders</p>
        </div>
      </div>

      <div className={styles.filterBar}>
        <select className={styles.filterSelect} value={filter} onChange={e => { setFilter(e.target.value); setPage(1); }}>
          <option value="">All Statuses</option>
          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.replace(/_/g,' ')}</option>)}
        </select>
      </div>

      {loading ? <div className="loading-container"><div className="spinner" /></div> : (
        <>
          <div className={styles.tableCard}>
            <table className={styles.table}>
              <thead>
                <tr><th>Order</th><th>Customer</th><th>Restaurant</th><th>Total</th><th>Payment</th><th>Status</th><th>Date</th></tr>
              </thead>
              <tbody>
                {orders.map(order => {
                  const sc = STATUS_COLORS[order.status] || STATUS_COLORS.pending;
                  return (
                    <tr key={order._id}>
                      <td style={{ fontWeight: 700, color: 'var(--brand)' }}>#{order.orderNumber}</td>
                      <td>
                        <div>
                          <p style={{ fontWeight: 600, fontSize: '0.88rem' }}>{order.customer?.name}</p>
                          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{order.customer?.phone}</p>
                        </div>
                      </td>
                      <td style={{ fontSize: '0.88rem' }}>{order.restaurant?.name}</td>
                      <td style={{ fontWeight: 700 }}>${order.pricing?.total?.toFixed(2)}</td>
                      <td>
                        <span className={styles.statusBadge}
                          style={{ background: order.payment?.status === 'paid' ? '#D1FAE5' : '#FEF3C7',
                                   color: order.payment?.status === 'paid' ? '#065F46' : '#92400E' }}>
                          {order.payment?.status} · {order.payment?.method?.toUpperCase()}
                        </span>
                      </td>
                      <td>
                        <select
                          className={styles.statusSelect}
                          value={order.status}
                          onChange={e => handleStatusChange(order._id, e.target.value)}
                          style={{ color: sc.color, borderColor: sc.color }}
                          disabled={order.status === 'delivered' || order.status === 'cancelled'}
                        >
                          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.replace(/_/g,' ')}</option>)}
                        </select>
                      </td>
                      <td style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {total > 20 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 20 }}>
              <button className="btn btn-outline btn-sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Previous</button>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '36px' }}>Page {page}</span>
              <button className="btn btn-outline btn-sm" disabled={orders.length < 20} onClick={() => setPage(p => p + 1)}>Next</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
