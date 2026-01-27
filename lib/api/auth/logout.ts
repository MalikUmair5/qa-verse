import { showToast } from '@/lib/utils/toast';
import { useAuthStore } from '@/store/authStore';

export const logout = () => {
    const loadingToast = showToast.loading('Logging out...');

    try {
        // Clear auth store (this will clear localStorage too)
        useAuthStore.getState().logout();
        
        // Dismiss loading toast
        showToast.dismiss(loadingToast);
        showToast.success('Logged out successfully!');        

    } catch (error) {
        // Dismiss loading toast
        showToast.dismiss(loadingToast);
        showToast.error('Logout failed. Please try again.');
        
        console.error('Logout error:', error);
    }
};

export default logout;