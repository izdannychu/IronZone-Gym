import api from './axios';
export const adminStats = () => api.get('/admin/stats');
export const adminMembers = (params) => api.get('/admin/members', { params });
export const adminTrainers = () => api.get('/admin/trainers');
export const adminEquipment = () => api.get('/admin/equipment');
export const adminMaintenance = () => api.get('/admin/maintenance');
export const adminPromotions = () => api.get('/admin/promotions');
export const adminOrders = () => api.get('/admin/orders');
