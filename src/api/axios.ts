import axios, { type InternalAxiosRequestConfig } from 'axios';
import { getAccessToken, getRefreshToken, removeTokens, setAccessToken } from '../utils/token';
import { getRefreshTokenApi } from './auth.api';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || '/api/admin',
    withCredentials: true,
});

//Request interceptor
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {

    const token = getAccessToken();

    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    };
    return config;
},

    (error) => Promise.reject(error)
);

//Response interceptor
api.interceptors.response.use(
    (response) => response,
    async (error) => {

        if (error.response?.status === 401) {
            const token = getRefreshToken();
            if (token) {
                const response = await getRefreshTokenApi(token);

                if (response.status === 401) {
                    removeTokens();
                    window.location.href = '/login';
                };

                setAccessToken(response.data.tokens.accessToken)
            };
        };

        return Promise.reject(error);
    }
);


export default api;