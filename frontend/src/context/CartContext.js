import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartAPI } from '../utils/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState(null);
  const [cartLoading, setCartLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!user) { setCart(null); return; }
    try {
      setCartLoading(true);
      const res = await cartAPI.get();
      setCart(res.data.cart);
    } catch { setCart(null); }
    finally { setCartLoading(false); }
  }, [user]);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const addToCart = useCallback(async (menuItemId, quantity = 1, customizations = []) => {
    try {
      const res = await cartAPI.add({ menuItemId, quantity, customizations });
      setCart(res.data.cart);
      toast.success('Added to cart!');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to add to cart';
      toast.error(msg);
      if (err.response?.data?.clearRequired) return 'CLEAR_REQUIRED';
    }
  }, []);

  const updateItem = useCallback(async (itemId, quantity) => {
    try {
      const res = await cartAPI.update(itemId, { quantity });
      setCart(res.data.cart);
    } catch { toast.error('Failed to update cart'); }
  }, []);

  const removeItem = useCallback(async (itemId) => {
    try {
      const res = await cartAPI.remove(itemId);
      setCart(res.data.cart);
      toast.success('Item removed');
    } catch { toast.error('Failed to remove item'); }
  }, []);

  const clearCart = useCallback(async () => {
    try {
      await cartAPI.clear();
      setCart(null);
    } catch { toast.error('Failed to clear cart'); }
  }, []);

  const itemCount = cart?.items?.reduce((sum, i) => sum + i.quantity, 0) || 0;

  return (
    <CartContext.Provider value={{ cart, cartLoading, fetchCart, addToCart, updateItem, removeItem, clearCart, itemCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
