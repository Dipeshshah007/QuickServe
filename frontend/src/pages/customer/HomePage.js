import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { restaurantAPI, categoryAPI } from '../../utils/api';
import RestaurantCard from '../../components/Customer/RestaurantCard';
import { FiSearch, FiArrowRight, FiShield, FiClock, FiStar } from 'react-icons/fi';
import styles from './HomePage.module.css';

export default function HomePage() {
  const [featured, setFeatured]     = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch]         = useState('');
  const [loading, setLoading]       = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      restaurantAPI.getAll({ featured: 'true', limit: 6 }),
      categoryAPI.getAll(),
    ]).then(([restRes, catRes]) => {
      setFeatured(restRes.data.restaurants);
      setCategories(catRes.data.categories);
    }).finally(() => setLoading(false));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/restaurants?search=${encodeURIComponent(search)}`);
  };

  return (
    <div className={styles.page}>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={`container ${styles.heroContent}`}>
          <div className={styles.heroText}>
            <span className={styles.heroPill}>⚡ Hyperlocal Delivery</span>
            <h1 className={styles.heroTitle}>
              Food Delivered<br />
              <span className={styles.heroAccent}>Fast & Fresh</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Order from the best local restaurants. Real-time tracking, lightning-fast delivery — your neighborhood, at your fingertips.
            </p>

            <form className={styles.searchBar} onSubmit={handleSearch}>
              <FiSearch size={20} className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search restaurants, cuisines, dishes..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className={styles.searchInput}
              />
              <button type="submit" className="btn btn-primary">Search</button>
            </form>

            <div className={styles.heroStats}>
              <div className={styles.stat}><strong>500+</strong><span>Restaurants</span></div>
              <div className={styles.statDivider} />
              <div className={styles.stat}><strong>30min</strong><span>Avg. Delivery</span></div>
              <div className={styles.statDivider} />
              <div className={styles.stat}><strong>4.8★</strong><span>Avg. Rating</span></div>
            </div>
          </div>

          <div className={styles.heroVisual}>
            <div className={styles.heroCard}>
              <img
                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500"
                alt="Delicious food"
                className={styles.heroImg}
              />
              <div className={styles.heroCardBadge}>
                <FiClock size={16} /> <span>25–35 min</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Categories ──────────────────────────────────────────────────────── */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className="section-title">What are you craving?</h2>
            <Link to="/restaurants" className={styles.viewAll}>View all <FiArrowRight /></Link>
          </div>
          <div className={styles.categoriesGrid}>
            {categories.map(cat => (
              <Link
                key={cat.id}
                to={`/restaurants?cuisine=${cat.id}`}
                className={styles.categoryCard}
                style={{ '--cat-color': cat.color }}
              >
                <span className={styles.catIcon}>{cat.icon}</span>
                <span className={styles.catName}>{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Restaurants ─────────────────────────────────────────────── */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className="section-title">⭐ Featured Restaurants</h2>
            <Link to="/restaurants" className={styles.viewAll}>See all <FiArrowRight /></Link>
          </div>
          {loading ? (
            <div className="loading-container"><div className="spinner" /></div>
          ) : (
            <div className={styles.restaurantsGrid}>
              {featured.map(r => <RestaurantCard key={r._id} restaurant={r} />)}
            </div>
          )}
        </div>
      </section>

      {/* ── Why QuickServe ───────────────────────────────────────────────────── */}
      <section className={`${styles.section} ${styles.whySection}`}>
        <div className="container">
          <h2 className="section-title" style={{ textAlign: 'center', marginBottom: 48 }}>
            Why QuickServe?
          </h2>
          <div className={styles.featuresGrid}>
            {[
              { icon: <FiClock size={28} />, title: 'Lightning Fast', desc: 'Average delivery under 30 minutes from top local restaurants near you.' },
              { icon: <FiStar size={28} />,  title: 'Curated Quality', desc: 'Only highly-rated restaurants with consistent food quality make our platform.' },
              { icon: <FiShield size={28} />, title: 'Safe & Secure', desc: 'Encrypted payments, real-time tracking, and contactless delivery options.' },
            ].map((f, i) => (
              <div key={i} className={`${styles.featureCard} card`}>
                <div className={styles.featureIcon}>{f.icon}</div>
                <h3 className={styles.featureTitle}>{f.title}</h3>
                <p className={styles.featureDesc}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────────── */}
      <section className={styles.cta}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 className={styles.ctaTitle}>Ready to order?</h2>
          <p className={styles.ctaSubtitle}>Join thousands who eat great every day with QuickServe.</p>
          <div className={styles.ctaBtns}>
            <Link to="/restaurants" className="btn btn-primary btn-lg">Browse Restaurants</Link>
            <Link to="/register" className="btn btn-outline btn-lg" style={{ borderColor: 'white', color: 'white' }}>
              Create Free Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
