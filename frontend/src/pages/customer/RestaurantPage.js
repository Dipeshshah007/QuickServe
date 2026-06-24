import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { restaurantAPI } from '../../utils/api';
import MenuItemCard from '../../components/Customer/MenuItemCard';
import { useCart } from '../../context/CartContext';
import { FiStar, FiClock, FiTruck, FiMapPin, FiShoppingCart, FiArrowRight } from 'react-icons/fi';
import styles from './RestaurantPage.module.css';

export default function RestaurantPage() {
  const { id }                        = useParams();
  const { cart, itemCount }           = useCart();
  const [restaurant, setRestaurant]   = useState(null);
  const [menu, setMenu]               = useState({});
  const [loading, setLoading]         = useState(true);
  const [activeCategory, setActiveCategory] = useState('');
  const [vegOnly, setVegOnly]         = useState(false);
  const categoryRefs                  = useRef({});

  useEffect(() => {
    restaurantAPI.getById(id)
      .then(res => {
        setRestaurant(res.data.restaurant);
        setMenu(res.data.menu);
        const cats = Object.keys(res.data.menu);
        if (cats.length) setActiveCategory(cats[0]);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const scrollToCategory = (cat) => {
    setActiveCategory(cat);
    categoryRefs.current[cat]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const cartBelongsHere = !cart?.restaurant || cart?.restaurant === id || cart?.restaurant?._id === id;

  if (loading) return <div className="loading-container"><div className="spinner" /></div>;
  if (!restaurant) return <div className="loading-container"><h3>Restaurant not found.</h3></div>;

  const categories = Object.keys(menu);

  return (
    <div className={styles.page}>
      {/* Cover */}
      <div className={styles.cover}>
        <img
          src={restaurant.coverImage || restaurant.image}
          alt={restaurant.name}
          className={styles.coverImg}
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200'; }}
        />
        <div className={styles.coverOverlay} />
      </div>

      <div className="container">
        {/* Info Card */}
        <div className={`${styles.infoCard} card`}>
          <div className={styles.infoMain}>
            <div className={styles.infoLeft}>
              <img
                src={restaurant.image}
                alt={restaurant.name}
                className={styles.logo}
                onError={e => { e.target.style.display = 'none'; }}
              />
              <div>
                <h1 className={styles.name}>{restaurant.name}</h1>
                <p className={styles.cuisines}>{restaurant.cuisineTypes?.join(' · ')}</p>
                <p className={styles.desc}>{restaurant.description}</p>
              </div>
            </div>

            <div className={styles.infoStats}>
              <div className={styles.statBox}>
                <FiStar size={18} fill="#F59E0B" stroke="#F59E0B" />
                <strong>{restaurant.rating?.average?.toFixed(1)}</strong>
                <span>{restaurant.rating?.count} ratings</span>
              </div>
              <div className={styles.statBox}>
                <FiClock size={18} color="var(--brand)" />
                <strong>{restaurant.deliveryInfo?.estimatedTime}</strong>
                <span>Delivery time</span>
              </div>
              <div className={styles.statBox}>
                <FiTruck size={18} color="var(--success)" />
                <strong>${restaurant.deliveryInfo?.deliveryFee?.toFixed(2)}</strong>
                <span>Delivery fee</span>
              </div>
              <div className={styles.statBox}>
                <FiMapPin size={18} color="var(--info)" />
                <strong>{restaurant.address?.city}</strong>
                <span>{restaurant.address?.state}</span>
              </div>
            </div>
          </div>

          {restaurant.deliveryInfo?.freeDeliveryAbove > 0 && (
            <div className={styles.freeDeliveryBanner}>
              🎉 Free delivery on orders above ${restaurant.deliveryInfo.freeDeliveryAbove}!
            </div>
          )}
        </div>

        <div className={styles.layout}>
          {/* Sidebar Category Nav */}
          <aside className={styles.sidebar}>
            <div className={`${styles.categoryNav} card`}>
              <h3 className={styles.menuTitle}>Menu</h3>
              <label className={styles.vegToggle}>
                <input type="checkbox" checked={vegOnly} onChange={e => setVegOnly(e.target.checked)} />
                <span className={styles.toggleSlider} />
                <span>Veg Only</span>
              </label>
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`${styles.catBtn} ${activeCategory === cat ? styles.active : ''}`}
                  onClick={() => scrollToCategory(cat)}
                >
                  {cat}
                  <span className={styles.catCount}>{menu[cat]?.length}</span>
                </button>
              ))}
            </div>
          </aside>

          {/* Menu Items */}
          <main className={styles.menuMain}>
            {categories.map(cat => {
              const items = vegOnly ? menu[cat].filter(i => i.isVeg) : menu[cat];
              if (!items.length) return null;
              return (
                <section
                  key={cat}
                  ref={el => categoryRefs.current[cat] = el}
                  className={styles.menuSection}
                >
                  <h2 className={styles.catTitle}>{cat} <span>({items.length})</span></h2>
                  <div className={styles.itemsGrid}>
                    {items.map(item => <MenuItemCard key={item._id} item={item} />)}
                  </div>
                </section>
              );
            })}
          </main>
        </div>
      </div>

      {/* Sticky Cart Button */}
      {itemCount > 0 && cartBelongsHere && (
        <div className={styles.stickyCart}>
          <div className="container">
            <Link to="/cart" className={styles.cartBar}>
              <div className={styles.cartLeft}>
                <span className={styles.cartCount}>{itemCount} {itemCount === 1 ? 'item' : 'items'}</span>
                <span>View Cart</span>
              </div>
              <div className={styles.cartRight}>
                <span>${cart?.subtotal?.toFixed(2)}</span>
                <FiArrowRight size={18} />
              </div>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
