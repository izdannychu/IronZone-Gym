import api from './axios';
export const getTrainers = (params) => api.get('/trainers', { params });
export const getTrainer = (id) => api.get(`/trainers/${id}`);
