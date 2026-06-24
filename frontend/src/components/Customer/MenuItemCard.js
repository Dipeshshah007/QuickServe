import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiMinus, FiShoppingCart } from 'react-icons/fi';
import styles from './MenuItemCard.module.css';

export default function MenuItemCard({ item }) {
  const { addToCart, cart, updateItem, removeItem } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Find if item already in cart
  const cartItem = cart?.items?.find(i => i.menuItem?._id === item._id || i.menuItem === item._id);
  const qty = cartItem?.quantity || 0;

  const handleAdd = async () => {
    if (!user) return navigate('/login');
    setLoading(true);
    await addToCart(item._id, 1);
    setLoading(false);
  };

  const handleIncrease = () => updateItem(cartItem._id, qty + 1);
  const handleDecrease = () => {
    if (qty === 1) removeItem(cartItem._id);
    else updateItem(cartItem._id, qty - 1);
  };

  const price = item.discountedPrice || item.price;

  return (
    <div className={`${styles.card} card`}>
      <div className={styles.body}>
        <div className={styles.header}>
          {item.isVeg ? (
            <span className={styles.vegDot} title="Vegetarian"><span /></span>
          ) : (
            <span className={`${styles.vegDot} ${styles.nonVeg}`} title="Non-Veg"><span /></span>
          )}
          {item.isBestSeller && <span className="badge badge-best">🏆 Bestseller</span>}
        </div>

        <h4 className={styles.name}>{item.name}</h4>
        {item.description && <p className={styles.desc}>{item.description}</p>}

        <div className={styles.footer}>
          <div className={styles.priceWrap}>
            <span className={styles.price}>${price.toFixed(2)}</span>
            {item.discountedPrice && (
              <span className={styles.originalPrice}>${item.price.toFixed(2)}</span>
            )}
          </div>

          {qty > 0 ? (
            <div className={styles.qtyControl}>
              <button onClick={handleDecrease} className={styles.qtyBtn}><FiMinus size={14} /></button>
              <span className={styles.qty}>{qty}</span>
              <button onClick={handleIncrease} className={styles.qtyBtn}><FiPlus size={14} /></button>
            </div>
          ) : (
            <button
              className={styles.addBtn}
              onClick={handleAdd}
              disabled={loading || !item.isAvailable}
            >
              {loading ? '...' : <><FiPlus size={16} /> ADD</>}
            </button>
          )}
        </div>
      </div>

      {item.image && (
        <div className={styles.imageWrap}>
          <img
            src={item.image}
            alt={item.name}
            className={styles.image}
            onError={e => { e.target.style.display = 'none'; }}
          />
          {!item.isAvailable && <div className={styles.unavailable}>Unavailable</div>}
        </div>
      )}
    </div>
  );
}
