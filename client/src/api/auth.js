import api from './axios';
export const login = (payload) => api.post('/auth/login', payload);
export const register = (payload) => api.post('/auth/register', payload);
export const me = () => api.get('/auth/me');
export const updateProfile = (payload) => api.put('/auth/profile', payload);
