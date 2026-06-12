import { createContext, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import * as authApi from '../api/auth';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('ironzone_user') || 'null'));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('ironzone_token');
    if (!token) return;
    authApi.me().then((res) => {
      setUser(res.data.data);
      localStorage.setItem('ironzone_user', JSON.stringify(res.data.data));
    }).catch(() => logout());
  }, []);

  const signIn = async (payload) => {
    setLoading(true);
    try {
      const res = await authApi.login(payload);
      localStorage.setItem('ironzone_token', res.data.data.token);
      localStorage.setItem('ironzone_user', JSON.stringify(res.data.data.user));
      setUser(res.data.data.user);
      toast.success(res.data.message);
      return res.data.data.user;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Đăng nhập thất bại');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (payload) => {
    setLoading(true);
    try {
      const res = await authApi.register(payload);
      localStorage.setItem('ironzone_token', res.data.data.token);
      localStorage.setItem('ironzone_user', JSON.stringify(res.data.data.user));
      setUser(res.data.data.user);
      toast.success(res.data.message);
      return res.data.data.user;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Đăng ký thất bại');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('ironzone_token');
    localStorage.removeItem('ironzone_user');
    setUser(null);
  };

  const value = useMemo(() => ({ user, loading, signIn, signUp, logout, isAdmin: user?.type === 'admin' }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
