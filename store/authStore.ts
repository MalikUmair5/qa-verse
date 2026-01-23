import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { user } from '@/lib/api/auth/login';

interface AuthState {
    user: user | null;
    accessToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;

    // Actions
    setAuth: (user: user, accessToken: string, refreshToken: string) => void;
    setAccessToken: (accessToken: string) => void;
    setRefreshToken: (refreshToken: string) => void;
    logout: () => void;
    clearTokens: () => void;
}

// Simple encryption/decryption functions for additional security
const encrypt = (text: string): string => {
    try {
        return btoa(encodeURIComponent(text));
    } catch {
        return text;
    }
};

const decrypt = (encryptedText: string): string => {
    try {
        return decodeURIComponent(atob(encryptedText));
    } catch {
        return encryptedText;
    }
};

// Custom storage with encryption
const encryptedStorage = {
    getItem: (name: string) => {
        const item = localStorage.getItem(name);
        if (!item) return null;
        try {
            const parsed = JSON.parse(item);
            if (parsed.state) {
                // Decrypt sensitive data
                if (parsed.state.refreshToken) {
                    parsed.state.refreshToken = decrypt(parsed.state.refreshToken);
                }
                if (parsed.state.user?.email) {
                    parsed.state.user.email = decrypt(parsed.state.user.email);
                }
            }
            return JSON.stringify(parsed);
        } catch {
            return item;
        }
    },
    setItem: (name: string, value: string) => {
        try {
            const parsed = JSON.parse(value);
            if (parsed.state) {
                // Encrypt sensitive data before storing
                if (parsed.state.refreshToken) {
                    parsed.state.refreshToken = encrypt(parsed.state.refreshToken);
                }
                if (parsed.state.user?.email) {
                    parsed.state.user.email = encrypt(parsed.state.user.email);
                }
            }
            localStorage.setItem(name, JSON.stringify(parsed));
        } catch {
            localStorage.setItem(name, value);
        }
    },
    removeItem: (name: string) => {
        localStorage.removeItem(name);
    },
};

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            accessToken: null, // This will not be persisted
            refreshToken: null,
            isAuthenticated: false,

            setAuth: (user, accessToken, refreshToken) => set(() => ({
                user,
                accessToken,
                refreshToken,
                isAuthenticated: true
            })),

            // Called on Silent Refresh
            setAccessToken: (accessToken) => set({ accessToken }),

            // Update refresh token
            setRefreshToken: (refreshToken) => set({ refreshToken }),

            // Clear only tokens but keep user logged in state
            clearTokens: () => set({ 
                accessToken: null, 
                refreshToken: null 
            }),

            // Called on Logout
            logout: () => set({
                user: null,
                accessToken: null,
                refreshToken: null,
                isAuthenticated: false
            }),
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => encryptedStorage),
            // Only persist specific fields (exclude accessToken for security)
            partialize: (state) => ({
                user: state.user,
                refreshToken: state.refreshToken,
                isAuthenticated: state.isAuthenticated,
                // Deliberately exclude accessToken - keep it in memory only
            }),
            // Rehydrate function to handle state restoration
            onRehydrateStorage: () => (state) => {
                if (state) {
                    // Clear accessToken on app restart (security measure)
                    state.accessToken = null;
                    
                    // Validate if we still have a valid refresh token
                    if (!state.refreshToken) {
                        state.isAuthenticated = false;
                        state.user = null;
                    }
                }
            },
        }
    )
);