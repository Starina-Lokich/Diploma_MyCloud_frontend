import axios from 'axios';

const api = axios.create({
  baseURL: process.env.API_BASE_URL || '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});


// Перехватчик ошибок
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      console.error('Unauthorized access - redirecting to login');
      window.location.href = '/login';
    } else if (error.response?.status === 403) {
      console.error('Forbidden:', error.response.data);
    } else {
      console.error('API error:', error.response?.data || error.message);
    }
    return Promise.reject(error);
  }
);

// Функция для получения CSRF токена
export const getCSRFToken = async () => {
  try {
    await api.get('/auth/csrf/');
  } catch (error) {
    console.error('CSRF token fetch error:', error);
  }
};

interface GetCookie {
  (name: string): string | null;
}

const getCookie: GetCookie = (name: string): string | null => {
  const match: RegExpMatchArray | null = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : null;
};

// Перехватчик для обработки CSRF
api.interceptors.request.use((config) => {

  const token = getCookie('csrftoken');

  if (token && ['post', 'put', 'patch', 'delete'].includes(config.method?.toLowerCase() || '')) {

    if (!(config.headers?.['Content-Type']?.startsWith('multipart/form-data'))) {
        config.headers = {
          ...config.headers,
          'Content-Type': 'application/json',
        };
    }

    config.headers = {
      ...config.headers,
      'X-CSRFToken': token,
    };
  }
  return config;
});


export default api;
