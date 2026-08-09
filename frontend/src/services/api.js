import axios from 'axios';

// ========================================
// BACKEND API URL
// ========================================

const API_URL =
  import.meta.env.VITE_API_URL ||
  'https://studymate-2-ye9j.onrender.com/api';

// ========================================
// AXIOS INSTANCE
// ========================================

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

// ========================================
// REQUEST INTERCEPTOR
// ========================================

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ========================================
// RESPONSE INTERCEPTOR
// ========================================

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// ========================================
// AUTH APIs
// ========================================

export const authAPI = {
  register: (data) => api.post('/auth/register', data),

  login: (data) => api.post('/auth/login', data),

  getMe: () => api.get('/auth/me')
};

// ========================================
// TOPIC APIs
// ========================================

export const topicAPI = {
  generate: (data) => api.post('/topics/generate', data),

  getAll: () => api.get('/topics'),

  getOne: (id) => api.get(`/topics/${id}`)
};

// ========================================
// QUIZ APIs
// ========================================

export const quizAPI = {
  generate: (data) => api.post('/quiz/generate', data),

  submit: (data) => api.post('/quiz/submit', data),

  getHistory: () => api.get('/quiz/history')
};

// ========================================
// EXPORT
// ========================================

export default api;