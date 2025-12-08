import axios from 'axios';

// Создаем экземпляр axios с базовыми настройками
const api = axios.create({
  baseURL: 'http://localhost:3001/api', // Прямой URL
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Интерцептор для добавления токена авторизации
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Интерцептор для обработки ошибок
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Токен истек или недействителен
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    // Можно добавить обработку других ошибок
    return Promise.reject(error);
  }
);

// API методы для работы с ЖК
export const complexAPI = {
  // Получить все ЖК
  getAll: (params?: { page?: number; limit?: number; filters?: any }) => 
    api.get('/complexes', { params }),
  
  // Получить ЖК по ID
  getById: (id: string | number) => 
    api.get(`/complexes/${id}`),
  
  // Создать ЖК (admin only)
  create: (complexData: any) => 
    api.post('/complexes', complexData),
  
  // Обновить ЖК (admin only)
  update: (id: string | number, complexData: any) => 
    api.put(`/complexes/${id}`, complexData),
  
  // Удалить ЖК (admin only)
  delete: (id: string | number) => 
    api.delete(`/complexes/${id}`),
  
  // Рассчитать стоимость
  calculate: (params: { complexId: number; rooms: number; area: number }) =>
    api.post('/complexes/calculate', params),
  
  // Получить историю цен
  getPriceHistory: (id: string | number) =>
    api.get(`/complexes/${id}/price-history`),
};

// API методы для аутентификации
export const authAPI = {
  // Регистрация
  register: (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
  }) => api.post('/auth/register', userData),
  
  // Вход
  login: (credentials: { email: string; password: string }) =>
    api.post('/auth/login', credentials),
  
  // Получить профиль
  getProfile: () => api.get('/auth/profile'),
  
  // Обновить профиль
  updateProfile: (userData: any) =>
    api.put('/auth/profile', userData),
  
  // Сменить пароль
  changePassword: (passwords: { currentPassword: string; newPassword: string }) =>
    api.post('/auth/change-password', passwords),
};

// API методы для администратора
export const adminAPI = {
  // Получить всех пользователей (admin only)
  getUsers: () => api.get('/admin/users'),
  
  // Изменить роль пользователя
  updateUserRole: (userId: number, role: 'user' | 'admin') =>
    api.put(`/admin/users/${userId}/role`, { role }),
  
  // Блокировка/разблокировка пользователя
  toggleUserStatus: (userId: number) =>
    api.put(`/admin/users/${userId}/toggle-status`),
};

export default api;