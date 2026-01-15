import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
};

export const coursesApi = {
  getAll: () => api.get('/courses'),
  getById: (id) => api.get(`/courses/${id}`),
};

export const teeTimesApi = {
  getAvailable: (courseId, date) =>
    api.get('/tee-times/available', { params: { courseId, date } }),
  getById: (id) => api.get(`/tee-times/${id}`),
};

export const bookingsApi = {
  getAll: () => api.get('/bookings'),
  getById: (id) => api.get(`/bookings/${id}`),
  create: (teeTimeId, players) => api.post('/bookings', { teeTimeId, players }),
  cancel: (id) => api.delete(`/bookings/${id}`),
};

export default api;
