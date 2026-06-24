import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../utils/api';
import { FiUsers, FiShoppingBag, FiPackage, FiDollarSign, FiTrendingUp, FiClock } from 'react-icons/fi';
import styles from './AdminDashboard.module.css';

const STATUS_COLORS = {
  pending:           '#F59E0B',
  confirmed:         '#3B82F6',
  preparing:         '#8B5CF6',
  out_for_delivery:  '#F97316',
  delivered:         '#22C55E',
  cancelled:         '#EF4444',
};

export default function AdminDashboard() {
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getDashboard()
      .then(res => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-container"><div className="spinner" /></div>;

  const { stats, weeklyOrders, recentOrders } = data;

  const statCards = [
    { label: 'Total Users',       value: stats.totalUsers,       icon: <FiUsers size={22} />,       color: '#3B82F6', bg: '#DBEAFE' },
    { label: 'Restaurants',       value: stats.totalRestaurants,  icon: <FiShoppingBag size={22} />, color: '#8B5CF6', bg: '#EDE9FE' },
    { label: 'Total Orders',      value: stats.totalOrders,       icon: <FiPackage size={22} />,     color: '#F59E0B', bg: '#FEF3C7' },
    { label: 'Active Orders',     value: stats.activeOrders,      icon: <FiClock size={22} />,       color: '#F97316', bg: '#FED7AA' },
    { label: 'Total Revenue',     value: `$${(stats.totalRevenue || 0).toFixed(2)}`, icon: <FiDollarSign size={22} />, color: '#22C55E', bg: '#D1FAE5' },
  ];

  // Simple bar chart using divs
  const maxOrders = Math.max(...(weeklyOrders?.map(d => d.count) || [1]));

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Dashboard</h1>
        <p className={styles.pageSubtitle}>Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stat Cards */}
      <div className={styles.statsGrid}>
        {statCards.map((s, i) => (
          <div key={i} className={`${styles.statCard} card`}>
            <div className={styles.statIcon} style={{ color: s.color, background: s.bg }}>{s.icon}</div>
            <div>
              <p className={styles.statValue}>{s.value}</p>
              <p className={styles.statLabel}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.mainGrid}>
        {/* Weekly Chart */}
        <div className={`${styles.chartCard} card`}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}><FiTrendingUp size={18} /> Orders This Week</h2>
          </div>
          {weeklyOrders?.length > 0 ? (
            <div className={styles.barChart}>
              {weeklyOrders.map((day, i) => (
                <div key={i} className={styles.barGroup}>
                  <span className={styles.barValue}>{day.count}</span>
                  <div
                    className={styles.bar}
                    style={{ height: `${(day.count / maxOrders) * 140}px` }}
                  />
                  <span className={styles.barLabel}>{day._id?.slice(5)}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.noData}>No orders this week yet</div>
          )}
        </div>

        {/* Quick Actions */}
        <div className={`${styles.quickActions} card`}>
          <h2 className={styles.cardTitle}>Quick Actions</h2>
          <div className={styles.actionsList}>
            <Link to="/admin/restaurants" className={styles.actionItem}>
              <FiShoppingBag size={20} color="var(--brand)" />
              <div>
                <strong>Manage Restaurants</strong>
                <span>Add or edit restaurant listings</span>
              </div>
            </Link>
            <Link to="/admin/menu" className={styles.actionItem}>
              <FiPackage size={20} color="#8B5CF6" />
              <div>
                <strong>Manage Menu</strong>
                <span>Update items and prices</span>
              </div>
            </Link>
            <Link to="/admin/orders" className={styles.actionItem}>
              <FiClock size={20} color="#F59E0B" />
              <div>
                <strong>Active Orders</strong>
                <span>{stats.activeOrders} orders need attention</span>
              </div>
            </Link>
            <Link to="/admin/users" className={styles.actionItem}>
              <FiUsers size={20} color="#3B82F6" />
              <div>
                <strong>Manage Users</strong>
                <span>View and manage accounts</span>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className={`${styles.recentCard} card`}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Recent Orders</h2>
          <Link to="/admin/orders" className={styles.viewAllLink}>View all →</Link>
        </div>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Order #</th>
                <th>Customer</th>
                <th>Restaurant</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders?.map(order => (
                <tr key={order._id}>
                  <td className={styles.orderId}>#{order.orderNumber}</td>
                  <td>{order.customer?.name}</td>
                  <td>{order.restaurant?.name}</td>
                  <td className={styles.total}>${order.pricing?.total?.toFixed(2)}</td>
                  <td>
                    <span className={styles.statusDot} style={{ background: STATUS_COLORS[order.status] }} />
                    <span style={{ textTransform: 'capitalize' }}>{order.status?.replace(/_/g, ' ')}</span>
                  </td>
                  <td className={styles.date}>{new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
