import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FiGrid, FiShoppingBag, FiList, FiPackage, FiUsers,
  FiLogOut, FiMenu, FiX, FiChevronRight
} from 'react-icons/fi';
import styles from './AdminLayout.module.css';

const NAV = [
  { to: '/admin',              icon: <FiGrid size={18} />,       label: 'Dashboard',   end: true },
  { to: '/admin/restaurants',  icon: <FiShoppingBag size={18} />, label: 'Restaurants' },
  { to: '/admin/menu',         icon: <FiList size={18} />,        label: 'Menu Items'  },
  { to: '/admin/orders',       icon: <FiPackage size={18} />,     label: 'Orders'      },
  { to: '/admin/users',        icon: <FiUsers size={18} />,       label: 'Users'       },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div className={styles.layout}>
      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.open : ''}`}>
        <div className={styles.sidebarHeader}>
          <div className={styles.logo}>⚡ <span>Quick<strong>Serve</strong></span></div>
          <span className={styles.adminBadge}>Admin</span>
        </div>

        <nav className={styles.nav}>
          {NAV.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              {item.icon}
              <span>{item.label}</span>
              <FiChevronRight size={14} className={styles.chevron} />
            </NavLink>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.userInfo}>
            <div className={styles.userAvatar}>{user?.name?.[0]}</div>
            <div>
              <p className={styles.userName}>{user?.name}</p>
              <p className={styles.userRole}>Administrator</p>
            </div>
          </div>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            <FiLogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <div className={styles.main}>
        <header className={styles.topbar}>
          <button className={styles.menuBtn} onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
          <div className={styles.topbarRight}>
            <span className={styles.topbarUser}>👋 {user?.name?.split(' ')[0]}</span>
          </div>
        </header>

        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
