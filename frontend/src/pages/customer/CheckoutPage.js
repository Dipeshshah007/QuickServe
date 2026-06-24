import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { orderAPI } from '../../utils/api';
import toast from 'react-hot-toast';
import { FiMapPin, FiCreditCard, FiCheck, FiDollarSign } from 'react-icons/fi';
import styles from './CheckoutPage.module.css';

const STEPS = ['Address', 'Payment', 'Review'];

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep]           = useState(0);
  const [loading, setLoading]     = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);

  const defaultAddr = user?.addresses?.find(a => a.isDefault) || user?.addresses?.[0];

  const [address, setAddress] = useState({
    label:   defaultAddr?.label   || 'Home',
    street:  defaultAddr?.street  || '',
    city:    defaultAddr?.city    || '',
    state:   defaultAddr?.state   || '',
    zipCode: defaultAddr?.zipCode || '',
  });
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [instructions, setInstructions]   = useState('');

  if (!cart || !cart.items?.length) {
    navigate('/cart');
    return null;
  }

  const subtotal    = cart.subtotal || 0;
  const deliveryFee = cart.restaurant?.deliveryInfo?.deliveryFee || 0;
  const freeAbove   = cart.restaurant?.deliveryInfo?.freeDeliveryAbove || 0;
  const actualDelivery = subtotal >= freeAbove && freeAbove > 0 ? 0 : deliveryFee;
  const taxes       = Math.round(subtotal * 0.05 * 100) / 100;
  const total       = subtotal + actualDelivery + taxes;

  const handlePlaceOrder = async () => {
    if (!address.street || !address.city) {
      toast.error('Please fill in your delivery address');
      setStep(0);
      return;
    }
    setLoading(true);
    try {
      const res = await orderAPI.place({ deliveryAddress: address, paymentMethod, instructions });
      setPlacedOrder(res.data.order);
      setStep(3); // Success
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  // ── Success Screen ──────────────────────────────────────────────────────────
  if (step === 3 && placedOrder) {
    return (
      <div className={styles.page}>
        <div className="container-sm">
          <div className={`${styles.successCard} card`}>
            <div className={styles.successIcon}><FiCheck size={40} /></div>
            <h1 className={styles.successTitle}>Order Placed! 🎉</h1>
            <p className={styles.successMsg}>
              Your order <strong>#{placedOrder.orderNumber}</strong> has been placed successfully!
              We'll notify you as the restaurant confirms it.
            </p>
            <div className={styles.successMeta}>
              <span>Estimated delivery: <strong>30–45 min</strong></span>
              <span>Total: <strong>${placedOrder.pricing?.total?.toFixed(2)}</strong></span>
            </div>
            <div className={styles.successBtns}>
              <button className="btn btn-primary" onClick={() => navigate(`/orders/${placedOrder._id}`)}>
                Track Order
              </button>
              <button className="btn btn-outline" onClick={() => navigate('/restaurants')}>
                Order More
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className="container">
        <h1 className="page-title" style={{ marginBottom: 32 }}>Checkout</h1>

        {/* Step Indicator */}
        <div className={styles.stepBar}>
          {STEPS.map((s, i) => (
            <React.Fragment key={s}>
              <button
                className={`${styles.stepItem} ${i === step ? styles.activeStep : ''} ${i < step ? styles.doneStep : ''}`}
                onClick={() => i < step && setStep(i)}
              >
                <span className={styles.stepNum}>{i < step ? <FiCheck size={14} /> : i + 1}</span>
                <span className={styles.stepLabel}>{s}</span>
              </button>
              {i < STEPS.length - 1 && <div className={`${styles.stepLine} ${i < step ? styles.doneLine : ''}`} />}
            </React.Fragment>
          ))}
        </div>

        <div className={styles.layout}>
          <div className={styles.main}>

            {/* Step 0: Address */}
            {step === 0 && (
              <div className={`${styles.stepCard} card`}>
                <h2 className={styles.stepTitle}><FiMapPin /> Delivery Address</h2>

                {user?.addresses?.length > 0 && (
                  <div className={styles.savedAddresses}>
                    <p className={styles.savedLabel}>Saved addresses:</p>
                    {user.addresses.map((addr, i) => (
                      <label key={i} className={`${styles.addrOption} ${address.street === addr.street ? styles.selectedAddr : ''}`}>
                        <input
                          type="radio"
                          name="savedAddr"
                          onChange={() => setAddress({ label: addr.label, street: addr.street, city: addr.city, state: addr.state, zipCode: addr.zipCode })}
                          checked={address.street === addr.street}
                        />
                        <div>
                          <strong>{addr.label}</strong>
                          <span>{addr.street}, {addr.city}, {addr.state} {addr.zipCode}</span>
                        </div>
                      </label>
                    ))}
                    <div className={styles.orDivider}><span>or enter a new address</span></div>
                  </div>
                )}

                <div className={styles.formGrid}>
                  <div className="input-group" style={{ gridColumn: '1/-1' }}>
                    <label>Street Address *</label>
                    <input className="input" value={address.street}
                      onChange={e => setAddress(a => ({ ...a, street: e.target.value }))}
                      placeholder="123 Main St, Apt 4B" />
                  </div>
                  <div className="input-group">
                    <label>City *</label>
                    <input className="input" value={address.city}
                      onChange={e => setAddress(a => ({ ...a, city: e.target.value }))}
                      placeholder="New York" />
                  </div>
                  <div className="input-group">
                    <label>State *</label>
                    <input className="input" value={address.state}
                      onChange={e => setAddress(a => ({ ...a, state: e.target.value }))}
                      placeholder="NY" />
                  </div>
                  <div className="input-group">
                    <label>ZIP Code *</label>
                    <input className="input" value={address.zipCode}
                      onChange={e => setAddress(a => ({ ...a, zipCode: e.target.value }))}
                      placeholder="10001" />
                  </div>
                  <div className="input-group">
                    <label>Label</label>
                    <select className="input" value={address.label}
                      onChange={e => setAddress(a => ({ ...a, label: e.target.value }))}>
                      <option>Home</option>
                      <option>Work</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>

                <div className="input-group" style={{ marginTop: 16 }}>
                  <label>Delivery Instructions (optional)</label>
                  <textarea className="input" rows={3} value={instructions}
                    onChange={e => setInstructions(e.target.value)}
                    placeholder="Gate code, leave at door, ring bell..." />
                </div>

                <button
                  className="btn btn-primary"
                  style={{ marginTop: 24 }}
                  onClick={() => { if (!address.street || !address.city) { toast.error('Fill required fields'); return; } setStep(1); }}
                >
                  Continue to Payment →
                </button>
              </div>
            )}

            {/* Step 1: Payment */}
            {step === 1 && (
              <div className={`${styles.stepCard} card`}>
                <h2 className={styles.stepTitle}><FiCreditCard /> Payment Method</h2>

                <div className={styles.paymentOptions}>
                  {[
                    { value: 'cod',    label: 'Cash on Delivery', icon: <FiDollarSign size={20} />, desc: 'Pay when your order arrives' },
                    { value: 'card',   label: 'Credit / Debit Card', icon: <FiCreditCard size={20} />, desc: 'Secure online payment (demo mode)' },
                  ].map(opt => (
                    <label key={opt.value} className={`${styles.payOption} ${paymentMethod === opt.value ? styles.selectedPay : ''}`}>
                      <input type="radio" name="payment" value={opt.value}
                        checked={paymentMethod === opt.value}
                        onChange={() => setPaymentMethod(opt.value)} />
                      <span className={styles.payIcon}>{opt.icon}</span>
                      <div>
                        <strong>{opt.label}</strong>
                        <span>{opt.desc}</span>
                      </div>
                    </label>
                  ))}
                </div>

                {paymentMethod === 'card' && (
                  <div className={styles.cardDemo}>
                    <p>💳 Demo Mode — No real charges. Use any test card.</p>
                    <div className={styles.formGrid}>
                      <div className="input-group" style={{ gridColumn: '1/-1' }}>
                        <label>Card Number</label>
                        <input className="input" placeholder="4242 4242 4242 4242" maxLength={19} />
                      </div>
                      <div className="input-group"><label>Expiry</label><input className="input" placeholder="MM/YY" /></div>
                      <div className="input-group"><label>CVV</label><input className="input" placeholder="123" /></div>
                    </div>
                  </div>
                )}

                <div className={styles.stepNavBtns}>
                  <button className="btn btn-ghost" onClick={() => setStep(0)}>← Back</button>
                  <button className="btn btn-primary" onClick={() => setStep(2)}>Review Order →</button>
                </div>
              </div>
            )}

            {/* Step 2: Review */}
            {step === 2 && (
              <div className={`${styles.stepCard} card`}>
                <h2 className={styles.stepTitle}>Review & Confirm</h2>

                <div className={styles.reviewSection}>
                  <h4>📍 Delivery to</h4>
                  <p>{address.street}, {address.city}, {address.state} {address.zipCode}</p>
                </div>

                <div className={styles.reviewSection}>
                  <h4>💳 Payment</h4>
                  <p>{paymentMethod === 'cod' ? 'Cash on Delivery' : 'Credit/Debit Card'}</p>
                </div>

                <div className={styles.reviewSection}>
                  <h4>🍽️ Items ({cart.items?.length})</h4>
                  {cart.items?.map(item => (
                    <div key={item._id} className={styles.reviewItem}>
                      <span>{item.quantity}× {item.name}</span>
                      <span>${item.itemTotal.toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                {instructions && (
                  <div className={styles.reviewSection}>
                    <h4>📝 Instructions</h4>
                    <p>{instructions}</p>
                  </div>
                )}

                <div className={styles.stepNavBtns}>
                  <button className="btn btn-ghost" onClick={() => setStep(1)}>← Back</button>
                  <button className="btn btn-primary btn-lg" onClick={handlePlaceOrder} disabled={loading}>
                    {loading ? 'Placing Order...' : `Place Order · $${total.toFixed(2)}`}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <aside>
            <div className={`${styles.summaryCard} card`}>
              <h3 className={styles.summaryTitle}>Order Summary</h3>
              <p className={styles.restName}>{cart.restaurantName}</p>

              <div className={styles.summaryItems}>
                {cart.items?.map(item => (
                  <div key={item._id} className={styles.sumItem}>
                    <span>{item.quantity}× {item.name}</span>
                    <span>${item.itemTotal.toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className={styles.summaryDivider} />

              <div className={styles.summaryRows}>
                <div className={styles.sumRow}><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                <div className={styles.sumRow}>
                  <span>Delivery</span>
                  <span style={{ color: actualDelivery === 0 ? 'var(--success)' : 'inherit' }}>
                    {actualDelivery === 0 ? 'FREE' : `$${actualDelivery.toFixed(2)}`}
                  </span>
                </div>
                <div className={styles.sumRow}><span>Taxes (5%)</span><span>${taxes.toFixed(2)}</span></div>
                <div className={`${styles.sumRow} ${styles.totalRow}`}>
                  <strong>Total</strong>
                  <strong style={{ color: 'var(--brand)' }}>${(subtotal + actualDelivery + taxes).toFixed(2)}</strong>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
