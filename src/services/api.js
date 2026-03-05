/**
 * API Service - Connect React Frontend to Django Backend
 * Base URL: http://localhost:8000/api
 */

import axios from 'axios';


// API Base URL - Change this for production
const API_BASE_URL = 'http://localhost:8000/api';

// Create axios instance
const api = axios.create({
  baseURL: "http://localhost:8000/api",
  // headers: {
  //   'Content-Type': 'application/json',
  // },
  timeout: 10000, // 10 seconds
});


const fixImageUrl = (url) =>
  url?.startsWith('http') ? url : `http://127.0.0.1:8000${url}`;



api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
   console.log("TOKEN SENT:", token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Refresh token on 401
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refresh = localStorage.getItem("refreshToken");

      if (!refresh) {
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(error);
      }

      try {
        const res = await axios.post(
          "http://localhost:8000/api/auth/token/refresh/",
          { refresh }
        );

        localStorage.setItem("accessToken", res.data.access);
        originalRequest.headers.Authorization =
          `Bearer ${res.data.access}`;

        return api(originalRequest);
      } catch {
        localStorage.clear();
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);


// ==================== AUTHENTICATION API ====================

export const authAPI = {
  /**
   * Register new user
   * @param {Object} userData - {username, email, password, password2, first_name, last_name, phone}
   */
  register: (userData) => api.post('/auth/register/', userData),

  /**
   * Login user
   * @param {Object} credentials - {email, password}
   */
  // login: (credentials) => api.post('/auth/login/', credentials),
  login: (data) => api.post("/auth/login/", data),
  /**
   * Refresh access token
   * @param {string} refreshToken
   */
  refreshToken: (refreshToken) => api.post('/auth/token/refresh/', { refresh: refreshToken }),

  /**
   * Get user profile
   */
  getProfile: () => api.get('/auth/profile/'),

  /**
   * Update user profile
   * @param {Object} profileData
   */
  updateProfile: (profileData) => api.put('/auth/profile/', profileData),

  /**
   * Change password
   * @param {Object} passwords - {old_password, new_password, new_password2}
   */
  changePassword: (passwords) => api.post('/auth/change-password/', passwords),

  /**
   * Get user addresses
   */
  getAddresses: () => api.get('/auth/addresses/'),

  /**
   * Add new address
   * @param {Object} addressData
   */
  addAddress: (addressData) => api.post('/auth/addresses/', addressData),

  /**
   * Update address
   * @param {number} id
   * @param {Object} addressData
   */
  updateAddress: (id, addressData) => api.put(`/auth/addresses/${id}/`, addressData),

  /**
   * Delete address
   * @param {number} id
   */
  deleteAddress: (id) => api.delete(`/auth/addresses/${id}/`),

  logout: () => Promise.resolve(),
};

// ==================== PRODUCTS API ====================

export const productsAPI = {
  /**
   * Get all products with filters
   * @param {Object} params - {search, category__slug, brand__slug, ordering, page}
   */
  getAll: (params = {}) => api.get('/products/', { params }),

  /**
   * Get single product by slug
   * @param {string} slug
   */
  getBySlug: (slug) => api.get(`/products/${slug}/`),

  /**
   * Create product (Admin only)
   * @param {Object} formData
   */
  create: (formData) => api.post('/products/', formData),

  /**
   * Update product (Admin only)
   * @param {string} slug
   * @param {Object} productData
   */
  update: (slug, productData) => api.put(`/products/${slug}/`, productData),

  /**
   * Delete product (Admin only)
   * @param {string} slug
   */
  delete: (slug) => api.delete(`/products/${slug}/`),

  /**
   * Get trending products
   */
  getTrending: () => api.get('/products/trending/'),

  /**
   * Get latest products
   */
  getLatest: () => api.get('/products/latest/'),

  /**
   * Get bestsellers
   */
  getBestsellers: () => api.get('/products/bestsellers/'),

  /**
   * Increment product views
   * @param {string} slug
   */
  incrementViews: (slug) => api.post(`/products/${slug}/increment_views/`),

  /**
   * Get all categories
   */
  getCategories: () => api.get('/products/categories/'),

  /**
   * Get all brands
   */
 getBrands: () => api.get('/products/brands/'),

};

// ==================== CART API ====================

export const cartAPI = {
  /**
   * Get user cart
   */
  // get: () => api.get('/cart/'),
  get: () => api.get("/orders/cart/"),

  /**
   * Add item to cart
   * @param {Object} item - {product_id, quantity}
   */
  // addItem: (item) => api.post('/cart/add/', item),
  addItem: (item) => api.post("/orders/cart/add_item/", item),

  /**
   * Update cart item
   * @param {Object} data - {item_id, quantity}
   */
  // updateItem: (data) => api.patch('/cart/update/', data),

  /**
   * Remove item from cart
   * @param {number} itemId
   */
  // removeItem: (itemId) => api.delete('/cart/remove/', { data: { item_id: itemId } }),
  removeItem: (productId) =>
    api.post("/orders/cart/remove_item/", { product_id: productId }),
  /**
   * Clear cart
   */
  // clear: () => api.delete('/cart/clear/'),
};



// ================= AI API =================
export const getContentBasedRecommendations = async () => {
  try {
    const res = await api.get("/ai/for-you/");
    return res.data || [];
  } catch (err) {
    console.error("ForYou error", err);
    return [];
  }
};

export const getTrendingProducts = async () => {
  try {
    const res = await api.get("/ai/trending/");
    return res.data || [];
  } catch (err) {
    console.error("Trending error", err);
    return [];
  }
};

export const getSimilarUserRecommendations = async () => {
  try {
    const res = await api.get("/ai/similar-users/");
    return res.data || [];
  } catch (err) {
    console.error("Similar error", err);
    return [];
  }
};

export const getFrequentlyBoughtTogether = async (productId) => {
  try {
    const res = await api.get(`/ai/paired/${productId}/`);
    return res.data || [];
  } catch (err) {
    console.error("Paired error", err);
    return [];
  }
};




// ==================== ORDERS API ====================

export const ordersAPI = {
  /**
   * Get all user orders
   * @param {Object} params - {status, page}
   */
  getAll: (params = {}) => api.get('/orders/', { params }),

  /**
   * Get single order
   * @param {number} id
   */
  getById: (id) => api.get(`/orders/${id}/`),

  /**
   * Create new order
   * @param {Object} orderData
   */
  create: (orderData) => api.post('/orders/', orderData),

  /**
   * Update order status (Admin only)
   * @param {number} id
   * @param {string} status
   */
  updateStatus: (id, status) => api.patch(`/orders/${id}/update_status/`, { status }),

  /**
   * Get order statistics (Admin only)
   */
  getStats: () => api.get('/orders/stats/'),
};

// ==================== REVIEWS API ====================

export const reviewsAPI = {
  getAll: (params = {}) => api.get("/reviews/", { params }),
  create: (data) => api.post("/reviews/", data),
  update: (id, data) => api.put(`/reviews/${id}/`, data),
  delete: (id) => api.delete(`/reviews/${id}/`),
};


// ==================== ADMIN API ====================

export const adminAPI = {
  // // USERS (WORKING)
  getAllUsers: (params = {}) =>
    api.get("/auth/admin/users/", { params }),

  getUserById: (id) =>
    api.get(`/auth/admin/users/${id}/`),

  updateUser: (id, data) =>
    api.patch(`/auth/admin/users/${id}/`, data),

  deleteUser: (id) =>
    api.delete(`/auth/admin/users/${id}/`),

  // PRODUCTS (Already working)
  getAllProducts: (params = {}) =>
    api.get("/products/", { params }),

  // ORDERS (USE EXISTING API ONLY)
  getAllOrders: () => api.get("/orders/admin/"),

  getAllReviews: () => api.get("/reviews/"),



  // createProduct: (data) =>api.post("/products/", data),
   createProduct: (formData) =>
    api.post("/products/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),


  deleteProduct: (id) =>api.delete(`/products/${id}/`),


  // ================= DASHBOARD =================
  getDashboardStats: () => api.get("/admin/stats/"),

  // ================= USERS =================
  getAllUsers: () => api.get("/auth/admin/users/"),
  getUserById: (id) => api.get(`/auth/admin/users/${id}/`),
  updateUser: (id, data) => api.patch(`/auth/admin/users/${id}/`, data),
  deleteUser: (id) => api.delete(`/auth/admin/users/${id}/`),

  // ================= ORDERS =================
  getAllOrders: () => api.get("/orders/admin/"),

  // ================= PRODUCTS =================
  getAllProducts: (params = {}) => productsAPI.getAll(params),
};

// ==================== HELPER FUNCTIONS ====================

/**
 * Handle API errors
 * @param {Error} error
 * @returns {string} Error message
 */
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error
    const message = error.response.data?.message
      || error.response.data?.detail
      || error.response.data?.error
      || 'An error occurred';
    return message;
  } else if (error.request) {
    // Request made but no response
    return 'No response from server. Please check your connection.';
  } else {
    // Error in request setup
    return error.message || 'An error occurred';
  }
};

/**
 * Upload image file
 * @param {File} file
 * @param {string} endpoint
 */
export const uploadImage = async (file, endpoint) => {
  const formData = new FormData();
  formData.append('image', file);

  const token = localStorage.getItem('authToken');
  const response = await axios.post(`${API_BASE_URL}${endpoint}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
export default api;