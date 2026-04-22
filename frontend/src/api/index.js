import api from './axiosInstance';

export const authApi = {
  register:       (data)  => api.post('/auth/register', data),
  login:          (data)  => api.post('/auth/login', data),
  getMe:          ()      => api.get('/auth/me'),
  updateProfile:  (data)  => api.put('/auth/profile', data),
  changePassword: (data)  => api.put('/auth/change-password', data),
};

export const productApi = {
  getAll:    (params) => api.get('/products', { params }),
  getBySlug: (slug)   => api.get(`/products/${slug}`),
  compare:   (ids)    => api.get('/products/compare', { params: { ids } }),
};

export const categoryApi = {
  getAll: () => api.get('/categories'),
};

export const brandApi = {
  getAll: () => api.get('/brands'),
};

export const cartApi = {
  get:          ()           => api.get('/cart'),
  add:          (data)       => api.post('/cart/add', data),
  update:       (id, data)   => api.put(`/cart/items/${id}`, data),
  remove:       (id)         => api.delete(`/cart/items/${id}`),
  clear:        ()           => api.delete('/cart/clear'),
  applyVoucher: (data)       => api.post('/cart/apply-voucher', data),
};

export const orderApi = {
  create:    (data)   => api.post('/orders', data),
  getAll:    (params) => api.get('/orders', { params }),
  getById:   (id)     => api.get(`/orders/${id}`),
  cancel:    (id)     => api.put(`/orders/${id}/cancel`),
};

export const voucherApi = {
  getPublic:     ()                        => api.get('/vouchers/public'),
  validate:      (code, cart_total)        => api.get(`/vouchers/validate/${code}`, { params: { cart_total } }),
  getAvailable:  (cart_total)              => api.get('/vouchers/available', { params: { cart_total } }),
  sendWeekly:    (voucher_id)              => api.post('/vouchers/send-weekly', { voucher_id }),
  claim:         (id)                      => api.post(`/vouchers/claim/${id}`),
  getMine:       (params)                  => api.get('/vouchers/mine', { params }),
  validatePromo: (code, cart_total)        => api.post('/vouchers/validate-promo', { code, cart_total }),
};

export const wishlistApi = {
  getAll: ()          => api.get('/wishlist'),
  toggle: async (productId) => {
    const res = await api.post(`/wishlist/toggle/${productId}`);
    window.dispatchEvent(new Event('wishlistChanged'));
    return res;
  },
};

export const reviewApi = {
  create: (data) => api.post('/reviews', data),
  getByProduct: (productId) => api.get(`/reviews/product/${productId}`),
  getMine: () => api.get('/reviews/mine'),
};

export const notificationApi = {
  getAll: () => api.get('/notifications'),
  markRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllRead: () => api.patch('/notifications/read-all'),
};

export const warrantyApi = {
  create:              (data) => api.post('/warranty', data),
  getAll:              ()     => api.get('/warranty'),
  getEligibleProducts: ()     => api.get('/warranty/eligible-products'),
};

export const adminApi = {
  dashboard:         ()            => api.get('/admin/dashboard'),
  revenueReport:     (params)      => api.get('/admin/reports/revenue', { params }),
  inventoryReport:   ()            => api.get('/admin/reports/inventory'),
  getOrders:         (params)      => api.get('/admin/orders', { params }),
  updateOrderStatus: (id, status)  => api.patch(`/admin/orders/${id}/status`, { status }),
  getVouchers:       ()            => api.get('/admin/vouchers'),
  createVoucher:     (data)        => api.post('/admin/vouchers', data),
  updateVoucher:     (id, data)    => api.put(`/admin/vouchers/${id}`, data),
  deleteVoucher:     (id)          => api.delete(`/admin/vouchers/${id}`),
  getUsers:          (params)      => api.get('/admin/users', { params }),
  toggleUser:        (id)          => api.patch(`/admin/users/${id}/toggle`),
  getWarranty:       (params)      => api.get('/admin/warranty', { params }),
  updateWarranty:    (id, data)    => api.patch(`/admin/warranty/${id}/status`, data),
  getCategories:     ()            => api.get('/admin/categories'),
  createCategory:    (data)        => api.post('/admin/categories', data),
  updateCategory:    (id, data)    => api.put(`/admin/categories/${id}`, data),
  createProduct:     (data)        => api.post('/admin/products', data),
  updateProduct:     (id, data)    => api.put(`/admin/products/${id}`, data),
  deleteProduct:     (id)          => api.delete(`/admin/products/${id}`),
  importInventory:   (data)        => api.post('/admin/inventory/import', data),
  getInventoryLogs:  (params)      => api.get('/admin/inventory/logs', { params }),
  getReviews:        (params)      => api.get('/admin/reviews', { params }),
  approveReview:     (id)          => api.patch(`/admin/reviews/${id}/approve`),
  createBrand:       (data)        => api.post('/admin/brands', data),
  updateBrand:       (id, data)    => api.put(`/admin/brands/${id}`, data),
};

export const addressApi = {
  getAll:     ()         => api.get('/addresses'),
  create:     (data)     => api.post('/addresses', data),
  update:     (id, data) => api.put(`/addresses/${id}`, data),
  setDefault: (id)       => api.patch(`/addresses/${id}/default`),
  remove:     (id)       => api.delete(`/addresses/${id}`),
};
