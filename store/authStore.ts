import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import Cookies from 'js-cookie'; // Import js-cookie
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
    updateUser: (userData: Partial<user>) => void;
    logout: () => void;
    clearTokens: () => void;
}

// Simple encryption/decryption functions
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
        (set) => ({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,

            setAuth: (user, accessToken, refreshToken) => {
                // 1. Set Access Token Cookie
                Cookies.set('accessToken', accessToken, {
                    expires: 1,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict'
                });

                // 2. NEW: Set User Role Cookie (So Middleware can see it!)
                if (user.role) {
                    Cookies.set('userRole', user.role, {
                        expires: 1,
                        secure: process.env.NODE_ENV === 'production',
                        sameSite: 'strict'
                    });
                }

                set(() => ({
                    user,
                    accessToken,
                    refreshToken,
                    isAuthenticated: true
                }));
            },

            setAccessToken: (accessToken) => {
                Cookies.set('accessToken', accessToken, {
                    expires: 1,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict'
                });
                set({ accessToken });
            },

            setRefreshToken: (refreshToken) => set({ refreshToken }),

            updateUser: (userData) => set((state) => ({
                user: state.user ? { ...state.user, ...userData } : null
            })),

            clearTokens: () => {
                Cookies.remove('accessToken');
                Cookies.remove('userRole'); // Remove role cookie
                set({
                    accessToken: null,
                    refreshToken: null
                });
            },

            logout: () => {
                Cookies.remove('accessToken');
                Cookies.remove('userRole'); // Remove role cookie
                set({
                    user: null,
                    accessToken: null,
                    refreshToken: null,
                    isAuthenticated: false
                });
            },
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => encryptedStorage),
            partialize: (state) => ({
                user: state.user,
                refreshToken: state.refreshToken,
                isAuthenticated: state.isAuthenticated,
            }),
            onRehydrateStorage: () => (state) => {
                if (state) {
                    state.accessToken = null;
                    if (!state.refreshToken) {
                        state.isAuthenticated = false;
                        state.user = null;
                        Cookies.remove('accessToken');
                        Cookies.remove('userRole'); // Ensure cleanup
                    }
                }
            },
        }
    )
);