import api from './axios';
export const getReviews = (params) => api.get('/reviews', { params });
export const createReview = (payload) => api.post('/reviews', payload);
