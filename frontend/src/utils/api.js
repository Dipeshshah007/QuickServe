import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('qs_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('qs_token');
      localStorage.removeItem('qs_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ── Auth ─────────────────────────────────────────────────────────────────────
export const authAPI = {
  register:       (data) => API.post('/auth/register', data),
  login:          (data) => API.post('/auth/login', data),
  getMe:          ()     => API.get('/auth/me'),
  updateProfile:  (data) => API.put('/auth/update-profile', data),
  changePassword: (data) => API.put('/auth/change-password', data),
  addAddress:     (data) => API.post('/auth/add-address', data),
};

// ── Restaurants ───────────────────────────────────────────────────────────────
export const restaurantAPI = {
  getAll:    (params) => API.get('/restaurants', { params }),
  getById:   (id)     => API.get(`/restaurants/${id}`),
  getCuisines:()      => API.get('/restaurants/cuisines/list'),
  create:    (data)   => API.post('/restaurants', data),
  update:    (id, data) => API.put(`/restaurants/${id}`, data),
  delete:    (id)     => API.delete(`/restaurants/${id}`),
};

// ── Menu ──────────────────────────────────────────────────────────────────────
export const menuAPI = {
  getByRestaurant: (id, params) => API.get(`/menu/restaurant/${id}`, { params }),
  getById:         (id)         => API.get(`/menu/${id}`),
  create:          (data)       => API.post('/menu', data),
  update:          (id, data)   => API.put(`/menu/${id}`, data),
  delete:          (id)         => API.delete(`/menu/${id}`),
};

// ── Cart ──────────────────────────────────────────────────────────────────────
export const cartAPI = {
  get:    ()             => API.get('/cart'),
  add:    (data)         => API.post('/cart/add', data),
  update: (itemId, data) => API.put(`/cart/item/${itemId}`, data),
  remove: (itemId)       => API.delete(`/cart/item/${itemId}`),
  clear:  ()             => API.delete('/cart/clear'),
};

// ── Orders ────────────────────────────────────────────────────────────────────
export const orderAPI = {
  place:        (data)         => API.post('/orders', data),
  getMyOrders:  (params)       => API.get('/orders/my', { params }),
  getById:      (id)           => API.get(`/orders/${id}`),
  cancel:       (id)           => API.put(`/orders/${id}/cancel`),
  rate:         (id, data)     => API.post(`/orders/${id}/rate`, data),
  updateStatus: (id, data)     => API.put(`/orders/${id}/status`, data),
  getAllOrders:  (params)       => API.get('/orders/admin/all', { params }),
};

// ── Admin ─────────────────────────────────────────────────────────────────────
export const adminAPI = {
  getDashboard:    ()          => API.get('/admin/dashboard'),
  getUsers:        (params)    => API.get('/admin/users', { params }),
  toggleUser:      (id)        => API.put(`/admin/users/${id}/toggle`),
};

// ── Categories ────────────────────────────────────────────────────────────────
export const categoryAPI = {
  getAll: () => API.get('/categories'),
};

export default API;
