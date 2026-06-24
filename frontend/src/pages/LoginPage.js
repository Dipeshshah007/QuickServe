import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import styles from './AuthPage.module.css';

export function LoginPage() {
  const { login } = useAuth();
  const navigate   = useNavigate();
  const [form, setForm]       = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name.split(' ')[0]}!`);
      navigate(user.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  const fillDemo = (role) => {
    if (role === 'admin')    setForm({ email: 'admin@quickserve.com',    password: 'Admin@123' });
    if (role === 'customer') setForm({ email: 'customer@quickserve.com', password: 'Customer@123' });
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <Link to="/" className={styles.logo}>⚡ Quick<strong>Serve</strong></Link>
        <h1 className={styles.title}>Sign In</h1>
        <p className={styles.subtitle}>Welcome back! Enter your credentials.</p>

        <div className={styles.demoBtns}>
          <button type="button" className={styles.demoBtn} onClick={() => fillDemo('customer')}>
            👤 Try as Customer
          </button>
          <button type="button" className={styles.demoBtn} onClick={() => fillDemo('admin')}>
            🛠️ Try as Admin
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className="input-group">
            <label>Email Address</label>
            <input type="email" className="input" value={form.email} autoFocus required
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              placeholder="you@example.com" />
          </div>
          <div className="input-group">
            <label>Password</label>
            <div className={styles.passwordWrap}>
              <input type={showPw ? 'text' : 'password'} className="input" value={form.password} required
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                placeholder="Your password" />
              <button type="button" className={styles.showPw} onClick={() => setShowPw(!showPw)}>
                {showPw ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className={styles.switchLink}>
          New to QuickServe? <Link to="/register">Create account</Link>
        </p>
      </div>
    </div>
  );
}

export function RegisterPage() {
  const { register } = useAuth();
  const navigate      = useNavigate();
  const [form, setForm]       = useState({ name: '', email: '', password: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      await register(form);
      toast.success('Account created! Welcome to QuickServe 🎉');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <Link to="/" className={styles.logo}>⚡ Quick<strong>Serve</strong></Link>
        <h1 className={styles.title}>Create Account</h1>
        <p className={styles.subtitle}>Join thousands who eat great with QuickServe.</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className="input-group">
            <label>Full Name *</label>
            <input className="input" value={form.name} required autoFocus
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="John Doe" />
          </div>
          <div className="input-group">
            <label>Email Address *</label>
            <input type="email" className="input" value={form.email} required
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="you@example.com" />
          </div>
          <div className="input-group">
            <label>Phone Number</label>
            <input className="input" value={form.phone}
              onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+1-555-0100" />
          </div>
          <div className="input-group">
            <label>Password *</label>
            <div className={styles.passwordWrap}>
              <input type={showPw ? 'text' : 'password'} className="input" value={form.password} required minLength={6}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="Min. 6 characters" />
              <button type="button" className={styles.showPw} onClick={() => setShowPw(!showPw)}>
                {showPw ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className={styles.switchLink}>
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
