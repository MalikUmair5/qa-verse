import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/authStore';

export const logout = () => {
    const loadingToast = toast.loading('Logging out...', {
        style: {
            background: '#2d1810',
            color: '#ffffff',
            border: '1px solid #A33C13',
        },
    });

    try {
        // Clear auth store (this will clear localStorage too)
        useAuthStore.getState().logout();
        
        // Dismiss loading toast
        toast.dismiss(loadingToast);
        
        // Show success toast
        toast.success('Logged out successfully!', {
            duration: 3000,
            style: {
                background: '#1f4a2d',
                color: '#ffffff',
                border: '1px solid #22c55e',
            },
            iconTheme: {
                primary: '#22c55e',
                secondary: '#ffffff',
            },
        });        

    } catch (error) {
        // Dismiss loading toast
        toast.dismiss(loadingToast);
        
        // Show error toast
        toast.error('Logout failed. Please try again.', {
            duration: 4000,
            style: {
                background: '#4a1f1f',
                color: '#ffffff',
                border: '1px solid #ef4444',
            },
            iconTheme: {
                primary: '#ef4444',
                secondary: '#ffffff',
            },
        });
        
        console.error('Logout error:', error);
    }
};

export default logout;