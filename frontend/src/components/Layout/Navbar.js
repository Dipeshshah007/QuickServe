import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { FiShoppingCart, FiUser, FiMenu, FiX, FiLogOut, FiPackage, FiSettings } from 'react-icons/fi';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled]         = useState(false);
  const [menuOpen, setMenuOpen]         = useState(false);
  const [profileOpen, setProfileOpen]   = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); setProfileOpen(false); }, [location]);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
      <div className={`container ${styles.inner}`}>
        {/* Logo */}
        <Link to="/" className={styles.logo}>
          <span className={styles.logoIcon}>⚡</span>
          <span>Quick<strong>Serve</strong></span>
        </Link>

        {/* Desktop Nav */}
        <div className={styles.navLinks}>
          <Link to="/" className={location.pathname === '/' ? styles.active : ''}>Home</Link>
          <Link to="/restaurants" className={location.pathname.startsWith('/restaurants') ? styles.active : ''}>Restaurants</Link>
          {isAdmin && <Link to="/admin" className={styles.adminLink}>Admin Panel</Link>}
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          {user ? (
            <>
              <Link to="/cart" className={styles.cartBtn} aria-label="Cart">
                <FiShoppingCart size={20} />
                {itemCount > 0 && <span className={styles.cartBadge}>{itemCount}</span>}
              </Link>

              <div className={styles.profileWrapper}>
                <button className={styles.profileBtn} onClick={() => setProfileOpen(!profileOpen)}>
                  <div className={styles.avatar}>{user.name?.[0]?.toUpperCase()}</div>
                  <span className="hide-mobile">{user.name?.split(' ')[0]}</span>
                </button>

                {profileOpen && (
                  <div className={styles.dropdown}>
                    <div className={styles.dropdownHeader}>
                      <strong>{user.name}</strong>
                      <small>{user.email}</small>
                    </div>
                    <Link to="/profile"><FiUser size={15} /> My Profile</Link>
                    <Link to="/orders"><FiPackage size={15} /> My Orders</Link>
                    {isAdmin && <Link to="/admin"><FiSettings size={15} /> Admin Panel</Link>}
                    <button onClick={handleLogout} className={styles.logoutBtn}><FiLogOut size={15} /> Sign Out</button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className={styles.authBtns}>
              <Link to="/login" className="btn btn-ghost btn-sm">Sign In</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
            </div>
          )}

          <button className={styles.mobileMenu} onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className={styles.mobileNav}>
          <Link to="/">Home</Link>
          <Link to="/restaurants">Restaurants</Link>
          {user ? (
            <>
              <Link to="/cart">Cart {itemCount > 0 && `(${itemCount})`}</Link>
              <Link to="/orders">My Orders</Link>
              <Link to="/profile">Profile</Link>
              {isAdmin && <Link to="/admin">Admin Panel</Link>}
              <button onClick={handleLogout}>Sign Out</button>
            </>
          ) : (
            <>
              <Link to="/login">Sign In</Link>
              <Link to="/register">Get Started</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
