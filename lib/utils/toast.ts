import toast from 'react-hot-toast';

// Toast utility with consistent styling
export class ToastUtil {
  // Loading toast
  static loading(message: string = 'Loading...') {
    return toast.loading(message, {
      style: {
        background: '#2d1810',
        color: '#ffffff',
        border: '1px solid #A33C13',
        borderRadius: '8px',
        padding: '12px 16px',
        fontSize: '14px',
      },
    });
  }

  // Success toast
  static success(message: string, duration: number = 4000) {
    return toast.success(message, {
      duration,
      style: {
        background: '#1f4a2d',
        color: '#ffffff',
        border: '1px solid #22c55e',
        borderRadius: '8px',
        padding: '12px 16px',
        fontSize: '14px',
      },
      iconTheme: {
        primary: '#22c55e',
        secondary: '#ffffff',
      },
    });
  }

  // Error toast
  static error(message: string, duration: number = 5000) {
    return toast.error(message, {
      duration,
      style: {
        background: '#4a1f1f',
        color: '#ffffff',
        border: '1px solid #ef4444',
        borderRadius: '8px',
        padding: '12px 16px',
        fontSize: '14px',
      },
      iconTheme: {
        primary: '#ef4444',
        secondary: '#ffffff',
      },
    });
  }

  // Dismiss specific toast
  static dismiss(toastId: string) {
    return toast.dismiss(toastId);
  }

  // Dismiss all toasts
  static dismissAll() {
    return toast.dismiss();
  }
}

// Alternative functional approach
export const showToast = {
  loading: (message: string = 'Loading...') => ToastUtil.loading(message),
  success: (message: string, duration?: number) => ToastUtil.success(message, duration),
  error: (message: string, duration?: number) => ToastUtil.error(message, duration),
  dismiss: (toastId: string) => ToastUtil.dismiss(toastId),
  dismissAll: () => ToastUtil.dismissAll(),
};