import api from './axios';
export const getCartApi = () => api.get('/cart');
export const addCartItem = (payload) => api.post('/cart', payload);
export const updateCartItem = (id, payload) => api.put(`/cart/${id}`, payload);
export const deleteCartItem = (id) => api.delete(`/cart/${id}`);
export const clearCartApi = () => api.delete('/cart');
