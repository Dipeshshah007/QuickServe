import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderAPI } from '../../utils/api';
import { FiMapPin, FiClock, FiPackage, FiPhone } from 'react-icons/fi';
import styles from './OrderDetailPage.module.css';

const TIMELINE = [
  { key: 'pending',          label: 'Order Placed',    icon: '📋' },
  { key: 'confirmed',        label: 'Confirmed',        icon: '✅' },
  { key: 'preparing',        label: 'Preparing',        icon: '🍳' },
  { key: 'out_for_delivery', label: 'Out for Delivery', icon: '🛵' },
  { key: 'delivered',        label: 'Delivered',        icon: '🎉' },
];

const STATUS_ORDER = ['pending','confirmed','preparing','out_for_delivery','delivered'];

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    orderAPI.getById(id)
      .then(res => setOrder(res.data.order))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleCancel = async () => {
    if (!window.confirm('Cancel this order?')) return;
    setCancelling(true);
    try {
      const res = await orderAPI.cancel(id);
      setOrder(res.data.order);
    } catch (err) {
      alert(err.response?.data?.message || 'Could not cancel order');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) return <div className="loading-container"><div className="spinner" /></div>;
  if (!order)  return <div className="loading-container"><h3>Order not found.</h3></div>;

  const currentIdx = STATUS_ORDER.indexOf(order.status);

  return (
    <div className={styles.page}>
      <div className="container-sm">
        <div className={styles.header}>
          <div>
            <h1 className="page-title">Order #{order.orderNumber}</h1>
            <p className="text-muted">
              Placed on {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
          {['pending','confirmed'].includes(order.status) && (
            <button className={styles.cancelBtn} onClick={handleCancel} disabled={cancelling}>
              {cancelling ? 'Cancelling...' : 'Cancel Order'}
            </button>
          )}
        </div>

        <div className={styles.layout}>
          <div className={styles.main}>
            {/* Timeline */}
            {order.status !== 'cancelled' && (
              <div className={`${styles.card} card`}>
                <h2 className={styles.cardTitle}>Order Status</h2>
                <div className={styles.timeline}>
                  {TIMELINE.map((step, i) => {
                    const done    = i <= currentIdx;
                    const active  = i === currentIdx;
                    return (
                      <div key={step.key} className={`${styles.timelineStep} ${done ? styles.done : ''} ${active ? styles.activeStep : ''}`}>
                        <div className={styles.stepDot}>
                          <span className={styles.stepIcon}>{step.icon}</span>
                        </div>
                        {i < TIMELINE.length - 1 && <div className={`${styles.stepLine} ${done && i < currentIdx ? styles.doneLine : ''}`} />}
                        <span className={styles.stepLabel}>{step.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {order.status === 'cancelled' && (
              <div className={`${styles.cancelledBanner} card`}>
                ❌ This order was cancelled.
              </div>
            )}

            {/* Items */}
            <div className={`${styles.card} card`}>
              <h2 className={styles.cardTitle}>
                <FiPackage size={18} /> Items from {order.restaurant?.name}
              </h2>
              <div className={styles.items}>
                {order.items?.map((item, i) => (
                  <div key={i} className={styles.item}>
                    <div className={styles.itemInfo}>
                      <span className={styles.qty}>{item.quantity}×</span>
                      <div>
                        <p className={styles.itemName}>{item.name}</p>
                        {item.customizations?.length > 0 && (
                          <p className={styles.itemCustom}>{item.customizations.map(c => c.option).join(', ')}</p>
                        )}
                      </div>
                    </div>
                    <span className={styles.itemTotal}>${item.itemTotal?.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Address */}
            <div className={`${styles.card} card`}>
              <h2 className={styles.cardTitle}><FiMapPin size={18} /> Delivery Address</h2>
              <p className={styles.address}>
                {order.deliveryAddress?.street},<br />
                {order.deliveryAddress?.city}, {order.deliveryAddress?.state} {order.deliveryAddress?.zipCode}
              </p>
              {order.instructions && (
                <p className={styles.instructions}>📝 {order.instructions}</p>
              )}
            </div>
          </div>

          {/* Summary */}
          <aside>
            <div className={`${styles.card} card`}>
              <h2 className={styles.cardTitle}>Order Summary</h2>
              <div className={styles.summaryRows}>
                <div className={styles.sumRow}><span>Subtotal</span><span>${order.pricing?.subtotal?.toFixed(2)}</span></div>
                <div className={styles.sumRow}><span>Delivery fee</span><span>${order.pricing?.deliveryFee?.toFixed(2)}</span></div>
                <div className={styles.sumRow}><span>Taxes</span><span>${order.pricing?.taxes?.toFixed(2)}</span></div>
                {order.pricing?.discount > 0 && (
                  <div className={styles.sumRow}><span>Discount</span><span style={{ color: 'var(--success)' }}>-${order.pricing.discount.toFixed(2)}</span></div>
                )}
                <div className={`${styles.sumRow} ${styles.totalRow}`}>
                  <strong>Total</strong>
                  <strong>${order.pricing?.total?.toFixed(2)}</strong>
                </div>
              </div>

              <div className={styles.paymentInfo}>
                <p><strong>Payment:</strong> {order.payment?.method === 'cod' ? 'Cash on Delivery' : 'Card'}</p>
                <p><strong>Status:</strong> <span style={{ color: order.payment?.status === 'paid' ? 'var(--success)' : 'var(--warning)', textTransform: 'capitalize' }}>{order.payment?.status}</span></p>
              </div>
            </div>

            {order.restaurant?.contactPhone && (
              <div className={`${styles.card} card`} style={{ marginTop: 16 }}>
                <h2 className={styles.cardTitle}><FiPhone size={16} /> Restaurant</h2>
                <p style={{ fontSize: '0.9rem' }}><strong>{order.restaurant.name}</strong></p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: 4 }}>{order.restaurant.contactPhone}</p>
              </div>
            )}

            <Link to="/orders" className={styles.backLink}>← Back to all orders</Link>
          </aside>
        </div>
      </div>
    </div>
  );
}
