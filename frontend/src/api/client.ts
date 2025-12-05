import axios from 'axios';

// Get base URL from environment or use default
const baseURL = import.meta.env.VITE_API_URL || 'http://www.atscs.com.br/';

export const apiClient = axios.create({
    baseURL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor
apiClient.interceptors.request.use(
    (config) => {
        // Add auth token if available
        const userStr = localStorage.getItem('soCdUser');
        if (userStr) {
            try {
                // const user = JSON.parse(userStr);
                // Token handling if needed
            } catch (error) {
                console.error('Failed to parse user data:', error);
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized
            localStorage.removeItem('soCdUser');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);
