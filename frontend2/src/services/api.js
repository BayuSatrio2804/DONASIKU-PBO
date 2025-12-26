import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8081/api', // Ubah port ke 8081
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
  timeout: 30000,
});

// ... (interceptors code remains same, omitted for brevity if using replace_file_content properly, but here I need to be careful not to delete them if I can't match strict context. 
// Actually, I will just replace the specific sections if possible or the whole object definitions).

// New exports defined above.

export const authAPI = {
  register: (data) => api.post('/auth/register', data), // Endpoint backend: /api/auth/register
  login: (data) => api.post('/auth/login', data),       // Endpoint backend: /api/auth/login
  logout: () => api.post('/auth/logout'),               // Assumed endpoint if exists, else client side only
  me: () => api.get('/users/me'),                        // Keep /users/me or check if exists.
};

export const donationAPI = {
  getAll: (params = {}) => api.get('/donasi', { params }),           // /api/donasi
  getById: (id) => api.get(`/donasi/${id}`),                        // /api/donasi/{id}
  create: (data) => api.post('/donasi', data, {                     // /api/donasi (support multipart)
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, data) => api.put(`/donasi/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id) => api.delete(`/donasi/${id}`),
  getMyDonations: (params = {}) => api.get('/donasi', { params }),   // Filter logi handled in frontend or separate endpoint? backend supports filter params on /donasi
  updateStatus: (id, status) => api.put(`/donasi/${id}/status`, null, { params: { status } }), // Backend: @PutMapping("/{id}/status") with param
};

export const chatAPI = {
  getConversations: () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return api.get(`/chat/list/${user?.userId || user?.id}`);
  },
  getMessages: (peerId) => {
    const user = JSON.parse(localStorage.getItem('user'));
    return api.get(`/chat/${peerId}/history`, {
      params: { currentUserId: user?.userId || user?.id }
    });
  },
  sendMessage: (data) => {
    const user = JSON.parse(localStorage.getItem('user'));
    // Backend expects RequestParam: senderId, receiverId, message
    // We can use URLSearchParams for simple key-value pairs which axios mapping automatically to params or form-encoded
    const params = new URLSearchParams();
    params.append('senderId', user?.userId || user?.id);
    params.append('receiverId', data.receiverId || data.receiver_id);
    params.append('message', data.message);

    return api.post('/chat/send', params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
  },
  deleteMessage: (id) => api.delete(`/chat/message/${id}`)
};

export const detailDonasiAPI = {
  getAll: () => api.get('/donasi')
};

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticated');

        processQueue(null, null);

        window.location.href = '/login';

        return Promise.reject(error);
      } catch (err) {
        processQueue(err, null);
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// Legacy exports removed. Using new exports defined above.

export default api;