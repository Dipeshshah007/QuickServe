import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderAPI } from '../../utils/api';
import { FiPackage, FiClock, FiCheck, FiX, FiChevronRight } from 'react-icons/fi';
import styles from './OrdersPage.module.css';

const STATUS_CONFIG = {
  pending:           { label: 'Pending',          color: '#F59E0B', bg: '#FEF3C7', icon: <FiClock size={14} /> },
  confirmed:         { label: 'Confirmed',         color: '#3B82F6', bg: '#DBEAFE', icon: <FiCheck size={14} /> },
  preparing:         { label: 'Preparing',         color: '#8B5CF6', bg: '#EDE9FE', icon: '🍳' },
  out_for_delivery:  { label: 'Out for Delivery',  color: '#F97316', bg: '#FED7AA', icon: '🛵' },
  delivered:         { label: 'Delivered',         color: '#22C55E', bg: '#D1FAE5', icon: <FiCheck size={14} /> },
  cancelled:         { label: 'Cancelled',         color: '#EF4444', bg: '#FEE2E2', icon: <FiX size={14} /> },
};

export default function OrdersPage() {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState('all');

  useEffect(() => {
    orderAPI.getMyOrders()
      .then(res => setOrders(res.data.orders))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'all'
    ? orders
    : orders.filter(o => o.status === filter);

  if (loading) return <div className="loading-container"><div className="spinner" /></div>;

  return (
    <div className={styles.page}>
      <div className="container-sm">
        <h1 className="page-title" style={{ marginBottom: 8 }}>My Orders</h1>
        <p className="text-muted" style={{ marginBottom: 28 }}>{orders.length} total orders</p>

        {/* Filter Tabs */}
        <div className={styles.filters}>
          {['all', 'pending', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'].map(f => (
            <button
              key={f}
              className={`${styles.filterBtn} ${filter === f ? styles.active : ''}`}
              onClick={() => setFilter(f)}
            >
              {f === 'all' ? 'All' : STATUS_CONFIG[f]?.label}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <span className="icon"><FiPackage size={48} /></span>
            <h3>No orders yet</h3>
            <p>When you place an order, it'll show up here.</p>
            <Link to="/restaurants" className="btn btn-primary">Order Now</Link>
          </div>
        ) : (
          <div className={styles.list}>
            {filtered.map(order => {
              const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
              return (
                <Link to={`/orders/${order._id}`} key={order._id} className={`${styles.orderCard} card card-hover`}>
                  <div className={styles.orderHeader}>
                    <div className={styles.orderRestaurant}>
                      {order.restaurant?.image && (
                        <img src={order.restaurant.image} alt="" className={styles.restImg}
                          onError={e => e.target.style.display = 'none'} />
                      )}
                      <div>
                        <h3 className={styles.restName}>{order.restaurant?.name}</h3>
                        <p className={styles.orderId}>#{order.orderNumber}</p>
                      </div>
                    </div>
                    <div className={styles.statusBadge} style={{ color: status.color, background: status.bg }}>
                      {status.icon} {status.label}
                    </div>
                  </div>

                  <div className={styles.orderItems}>
                    {order.items?.slice(0, 3).map((item, i) => (
                      <span key={i} className={styles.item}>{item.quantity}× {item.name}</span>
                    ))}
                    {order.items?.length > 3 && (
                      <span className={styles.moreItems}>+{order.items.length - 3} more</span>
                    )}
                  </div>

                  <div className={styles.orderFooter}>
                    <span className={styles.date}>
                      {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className={styles.total}>${order.pricing?.total?.toFixed(2)}</span>
                    <FiChevronRight size={16} color="var(--text-muted)" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
