import { createContext, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { addCartItem, deleteCartItem, getCartApi, updateCartItem } from '../api/cart';
import { useAuth } from '../hooks/useAuth';

export const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [], subtotal: 0 });

  const refresh = async () => {
    if (!user || user.type === 'admin') {
      setCart({ items: [], subtotal: 0 });
      return;
    }
    const res = await getCartApi();
    setCart(res.data.data);
  };

  useEffect(() => { refresh().catch(() => {}); }, [user?.id]);

  const add = async (planId, quantity = 1) => {
    if (!user) {
      toast.error('Vui lòng đăng nhập để thêm vào giỏ');
      return false;
    }
    const res = await addCartItem({ plan_id: planId, quantity });
    setCart(res.data.data);
    toast.success('Đã thêm vào giỏ hàng');
    return true;
  };

  const update = async (id, quantity) => {
    const res = await updateCartItem(id, { quantity });
    setCart(res.data.data);
  };

  const remove = async (id) => {
    const res = await deleteCartItem(id);
    setCart(res.data.data);
    toast.success('Đã xóa khỏi giỏ');
  };

  const value = useMemo(() => ({ cart, refresh, add, update, remove, count: cart.items.reduce((s, i) => s + i.quantity, 0) }), [cart]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
