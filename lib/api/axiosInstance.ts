import axios from 'axios';
import { useAuthStore } from '@/store/authStore';

const axiosInstance = axios.create({
    baseURL: 'https://fyp-production-dc9d.up.railway.app/api/v1',
    headers: {
        "Content-Type": "application/json"
    }
});

// 1. Request Interceptor: Attach Access Token from Store
axiosInstance.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().accessToken;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 2. Response Interceptor: Handle Token Expiry
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If error is 401 (Unauthorized) AND we haven't retried yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // Prevent infinite loops

            try {
                // A. Get the refresh token from store (persisted in localStorage)
                const currentRefreshToken = useAuthStore.getState().refreshToken;

                if (!currentRefreshToken) {
                    // No token found? Logout.
                    throw new Error("No refresh token available");
                }

                // B. Call your Backend Refresh Endpoint
                // We use standard 'axios' here to avoid using our interceptors
                const response = await axios.post(
                    'https://fyp-production-dc9d.up.railway.app/api/v1/auth/refresh-token/',
                    {
                        refresh_token: currentRefreshToken
                    }
                );

                // C. Get the new token from response
                const newAccessToken = response.data.access_token;

                // D. Update Zustand Store (only access token, keep refresh token)
                useAuthStore.getState().setAccessToken(newAccessToken);

                // E. Update the header for the FAILED request
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                // F. Retry the original request
                return axiosInstance(originalRequest);

            } catch (refreshError) {
                // If refresh fails, the session is truly dead. Logout the user.
                console.error("Refresh failed:", refreshError);
                
                // Use logout utility with toast notification
                const { logout } = await import('@/lib/api/auth/logout');
                logout();

                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;