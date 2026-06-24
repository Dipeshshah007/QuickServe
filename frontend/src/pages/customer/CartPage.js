import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { FiPlus, FiMinus, FiTrash2, FiArrowLeft, FiShoppingBag } from 'react-icons/fi';
import styles from './CartPage.module.css';

export default function CartPage() {
  const { cart, cartLoading, updateItem, removeItem, clearCart } = useCart();
  const navigate = useNavigate();

  if (cartLoading) return <div className="loading-container"><div className="spinner" /></div>;

  if (!cart || cart.items?.length === 0) {
    return (
      <div className="loading-container" style={{ minHeight: '70vh' }}>
        <div className="empty-state">
          <span className="icon">🛒</span>
          <h3>Your cart is empty</h3>
          <p>Add items from a restaurant to get started</p>
          <Link to="/restaurants" className="btn btn-primary">Browse Restaurants</Link>
        </div>
      </div>
    );
  }

  const { items, restaurant, restaurantName, subtotal } = cart;
  const deliveryFee = restaurant?.deliveryInfo?.deliveryFee || 0;
  const taxes = Math.round(subtotal * 0.05 * 100) / 100;
  const total = subtotal + deliveryFee + taxes;
  const freeDeliveryAbove = restaurant?.deliveryInfo?.freeDeliveryAbove || 0;
  const remainingForFree = freeDeliveryAbove - subtotal;

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.header}>
          <button className={styles.backBtn} onClick={() => navigate(-1)}>
            <FiArrowLeft size={18} /> Back
          </button>
          <h1 className="page-title">Your Cart</h1>
          <button className={styles.clearBtn} onClick={clearCart}>
            <FiTrash2 size={15} /> Clear Cart
          </button>
        </div>

        <div className={styles.layout}>
          {/* Cart Items */}
          <div className={styles.itemsSection}>
            <div className={styles.restaurantHeader}>
              <FiShoppingBag size={18} color="var(--brand)" />
              <span>Order from <strong>{restaurantName}</strong></span>
            </div>

            {remainingForFree > 0 && (
              <div className={styles.freeDeliveryHint}>
                🎉 Add <strong>${remainingForFree.toFixed(2)}</strong> more for free delivery!
              </div>
            )}

            <div className={styles.items}>
              {items.map(item => (
                <div key={item._id} className={`${styles.item} card`}>
                  {item.image && (
                    <img src={item.image} alt={item.name} className={styles.itemImg}
                      onError={e => { e.target.style.display = 'none'; }} />
                  )}
                  <div className={styles.itemInfo}>
                    <h4 className={styles.itemName}>{item.name}</h4>
                    {item.customizations?.length > 0 && (
                      <p className={styles.customizations}>
                        {item.customizations.map(c => c.option).join(', ')}
                      </p>
                    )}
                    <span className={styles.itemPrice}>${item.price.toFixed(2)} each</span>
                  </div>
                  <div className={styles.itemActions}>
                    <div className={styles.qtyControl}>
                      <button className={styles.qtyBtn} onClick={() => {
                        if (item.quantity === 1) removeItem(item._id);
                        else updateItem(item._id, item.quantity - 1);
                      }}>
                        {item.quantity === 1 ? <FiTrash2 size={14} /> : <FiMinus size={14} />}
                      </button>
                      <span className={styles.qty}>{item.quantity}</span>
                      <button className={styles.qtyBtn} onClick={() => updateItem(item._id, item.quantity + 1)}>
                        <FiPlus size={14} />
                      </button>
                    </div>
                    <span className={styles.itemTotal}>${item.itemTotal.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <aside className={styles.summary}>
            <div className={`${styles.summaryCard} card`}>
              <h2 className={styles.summaryTitle}>Order Summary</h2>

              <div className={styles.summaryRows}>
                <div className={styles.row}>
                  <span>Subtotal ({items.length} items)</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className={styles.row}>
                  <span>Delivery fee</span>
                  <span className={subtotal >= freeDeliveryAbove && freeDeliveryAbove > 0 ? styles.free : ''}>
                    {subtotal >= freeDeliveryAbove && freeDeliveryAbove > 0
                      ? 'FREE'
                      : `$${deliveryFee.toFixed(2)}`
                    }
                  </span>
                </div>
                <div className={styles.row}>
                  <span>Taxes & fees (5%)</span>
                  <span>${taxes.toFixed(2)}</span>
                </div>
                <div className={`${styles.row} ${styles.totalRow}`}>
                  <span>Total</span>
                  <strong>${(subtotal + (subtotal >= freeDeliveryAbove && freeDeliveryAbove > 0 ? 0 : deliveryFee) + taxes).toFixed(2)}</strong>
                </div>
              </div>

              <Link to="/checkout" className={`btn btn-primary ${styles.checkoutBtn}`}>
                Proceed to Checkout →
              </Link>

              <Link to="/restaurants" className={styles.continueLink}>
                + Add more items
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
