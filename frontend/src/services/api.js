import axios from 'axios';
import { mockCourses, generateMockTeeTimes, mockBookingsApi, mockUser } from './mockData';

// Check if we're in demo mode (no backend)
const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true' || !import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Wrap response to match axios format
const mockResponse = (data) => Promise.resolve({ data });

export const authApi = DEMO_MODE ? {
  login: (email, password) => {
    localStorage.setItem('token', 'demo-token');
    return mockResponse({ user: mockUser, token: 'demo-token' });
  },
  register: (userData) => {
    const user = { ...mockUser, ...userData, id: 1 };
    localStorage.setItem('token', 'demo-token');
    return mockResponse({ user, token: 'demo-token' });
  },
  getMe: () => mockResponse(mockUser),
} : {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
};

export const coursesApi = DEMO_MODE ? {
  getAll: () => mockResponse(mockCourses),
  getById: (id) => mockResponse(mockCourses.find(c => c.id === parseInt(id))),
} : {
  getAll: () => api.get('/courses'),
  getById: (id) => api.get(`/courses/${id}`),
};

export const teeTimesApi = DEMO_MODE ? {
  getAvailable: (courseId, date) => mockResponse(generateMockTeeTimes(courseId, date)),
  getById: (id) => mockResponse({ id }),
} : {
  getAvailable: (courseId, date) =>
    api.get('/tee-times/available', { params: { courseId, date } }),
  getById: (id) => api.get(`/tee-times/${id}`),
};

export const bookingsApi = DEMO_MODE ? {
  getAll: () => mockResponse(mockBookingsApi.getAll()),
  getById: (id) => mockResponse(mockBookingsApi.getAll().find(b => b.id === id)),
  create: (teeTimeId, players, teeTimeData) => {
    const booking = mockBookingsApi.create(teeTimeData, players, mockUser);
    return mockResponse(booking);
  },
  cancel: (id) => mockResponse(mockBookingsApi.cancel(id)),
} : {
  getAll: () => api.get('/bookings'),
  getById: (id) => api.get(`/bookings/${id}`),
  create: (teeTimeId, players) => api.post('/bookings', { teeTimeId, players }),
  cancel: (id) => api.delete(`/bookings/${id}`),
};

export default api;
