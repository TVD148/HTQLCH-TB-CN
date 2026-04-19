import { createContext, useContext, useState, useEffect } from 'react';
import { cartApi } from '../api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart,      setCart]      = useState({ items: [], subtotal: 0, item_count: 0 });
  const [loading,   setLoading]   = useState(false);
  const [voucher,   setVoucher]   = useState(null); // { voucher_id, code, discount_amount, final_total }

  const fetchCart = async () => {
    if (!user) { setCart({ items: [], subtotal: 0, item_count: 0 }); return; }
    setLoading(true);
    try {
      const res = await cartApi.get();
      setCart(res.data.data);
    } catch (_) {}
    finally { setLoading(false); }
  };

  useEffect(() => { fetchCart(); }, [user]);

  const addToCart = async (productId, quantity = 1) => {
    const res = await cartApi.add({ product_id: productId, quantity });
    await fetchCart();
    return res.data;
  };

  const updateItem = async (id, quantity) => {
    await cartApi.update(id, { quantity });
    await fetchCart();
  };

  const removeItem = async (id) => {
    await cartApi.remove(id);
    await fetchCart();
  };

  const clearCart = async () => {
    await cartApi.clear();
    setCart({ items: [], subtotal: 0, item_count: 0 });
    setVoucher(null);
  };

  const applyVoucher = async (code) => {
    const res = await cartApi.applyVoucher({ code, cart_total: cart.subtotal });
    setVoucher(res.data.data);
    return res.data;
  };

  const removeVoucher = () => setVoucher(null);

  const finalTotal = voucher ? voucher.final_total : cart.subtotal;

  return (
    <CartContext.Provider value={{
      cart, loading, voucher, finalTotal,
      fetchCart, addToCart, updateItem, removeItem, clearCart,
      applyVoucher, removeVoucher,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
