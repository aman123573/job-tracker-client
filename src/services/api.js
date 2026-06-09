import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000/api',
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }

        if (error.response?.status === 429) {
            alert(`Too many requests. Please try again in ${error.response.data.retry_after_seconds} seconds.`);
        }

        return Promise.reject(error);
    }
);

// Auth
export const register = (data) => api.post('/auth/register', data);
export const login = (data) => api.post('/auth/login', data);

// Applications
export const getApplications = (params = {}) => api.get('/applications', { params });
export const getApplicationById = (id) => api.get(`/applications/${id}`);
export const getStatusHistory = (id) => api.get(`/applications/${id}/history`);
export const createApplication = (data) => api.post('/applications', data);
export const updateApplication = (id, data) => api.put(`/applications/${id}`, data);
export const deleteApplication = (id) => api.delete(`/applications/${id}`);
export const getStats = () => api.get('/applications/stats');