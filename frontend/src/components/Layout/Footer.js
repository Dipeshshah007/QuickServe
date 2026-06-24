import React from 'react';
import { Link } from 'react-router-dom';
import { FiGithub, FiLinkedin, FiTwitter } from 'react-icons/fi';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.grid}>
          <div className={styles.brand}>
            <div className={styles.logo}>
              <span>⚡</span>
              <span>Quick<strong>Serve</strong></span>
            </div>
            <p>Hyperlocal food delivery — connecting your neighborhood restaurants to your door in minutes.</p>
            <div className={styles.social}>
              <a href="https://github.com" target="_blank" rel="noreferrer"><FiGithub /></a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer"><FiLinkedin /></a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer"><FiTwitter /></a>
            </div>
          </div>

          <div className={styles.links}>
            <h4>Explore</h4>
            <Link to="/">Home</Link>
            <Link to="/restaurants">Restaurants</Link>
            <Link to="/register">Sign Up</Link>
          </div>

          <div className={styles.links}>
            <h4>Account</h4>
            <Link to="/profile">My Profile</Link>
            <Link to="/orders">My Orders</Link>
            <Link to="/cart">Cart</Link>
          </div>

          <div className={styles.links}>
            <h4>Tech Stack</h4>
            <span>React.js</span>
            <span>Node.js + Express</span>
            <span>MongoDB</span>
            <span>JWT Auth</span>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>© 2024 QuickServe. Built as a portfolio project.</p>
          <p>Full Stack | React · Node · MongoDB</p>
        </div>
      </div>
    </footer>
  );
}
