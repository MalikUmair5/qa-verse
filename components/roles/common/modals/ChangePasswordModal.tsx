"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiEye, FiEyeOff } from "react-icons/fi";
import { MdLockOutline } from "react-icons/md";
import { changePassword } from "@/lib/api/auth/changePassword";
import { showToast } from "@/lib/utils/toast";
import { changePasswordSchema, ChangePasswordFormData } from "@/lib/schemas/auth";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChangePasswordModal({ isOpen, onClose }: ChangePasswordModalProps) {
  const [loading, setLoading] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, dirtyFields },
    reset
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    mode: "onChange",
    defaultValues: {
      old_password: "",
      new_password: ""
    }
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    setLoading(true);
    const loadingToast = showToast.loading('Changing your password...');

    try {
      const response = await changePassword(data);
      
      showToast.dismiss(loadingToast);
      showToast.success('Password changed successfully!');
      
      // Reset form and close modal
      reset();
      onClose();
      
    } catch (error: unknown) {
      showToast.dismiss(loadingToast);
      
      let errorMessage = 'Failed to change password. Please try again.';
      
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status?: number; data?: Record<string, unknown> } };
        
        if (axiosError.response?.status === 400) {
          errorMessage = 'Invalid current password. Please check and try again.';
        } else if (axiosError.response?.data && typeof axiosError.response.data === 'object' && 'message' in axiosError.response.data) {
          errorMessage = String(axiosError.response.data.message);
        }
      }

      showToast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      reset();
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#A33C13] rounded-full flex items-center justify-center">
                  <MdLockOutline className="text-white" size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#171717]">Change Password</h2>
                  <p className="text-sm text-gray-600">Update your account password</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                disabled={loading}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiX size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Current Password */}
              <div>
                <label className="block text-sm font-semibold text-[#171717] mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    {...register("old_password")}
                    type={showOldPassword ? "text" : "password"}
                    placeholder="Enter your current password"
                    className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                      errors.old_password 
                        ? 'border-red-500 focus:ring-red-200' 
                        : dirtyFields.old_password && !errors.old_password
                        ? 'border-green-500 focus:ring-green-200'
                        : 'border-gray-300 focus:ring-[#A33C13]/20 focus:border-[#A33C13]'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded transition-colors"
                  >
                    {showOldPassword ? (
                      <FiEyeOff size={18} className="text-gray-500" />
                    ) : (
                      <FiEye size={18} className="text-gray-500" />
                    )}
                  </button>
                </div>
                {errors.old_password && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-sm mt-1"
                  >
                    {errors.old_password.message}
                  </motion.p>
                )}
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-semibold text-[#171717] mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    {...register("new_password")}
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Enter your new password"
                    className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                      errors.new_password 
                        ? 'border-red-500 focus:ring-red-200' 
                        : dirtyFields.new_password && !errors.new_password
                        ? 'border-green-500 focus:ring-green-200'
                        : 'border-gray-300 focus:ring-[#A33C13]/20 focus:border-[#A33C13]'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded transition-colors"
                  >
                    {showNewPassword ? (
                      <FiEyeOff size={18} className="text-gray-500" />
                    ) : (
                      <FiEye size={18} className="text-gray-500" />
                    )}
                  </button>
                </div>
                {errors.new_password && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-sm mt-1"
                  >
                    {errors.new_password.message}
                  </motion.p>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  Password must contain at least 8 characters, including uppercase, lowercase, and a number
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={loading}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !isValid}
                  className="flex-1 px-4 py-3 bg-[#A33C13] text-white rounded-lg hover:bg-[#8B2F10] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Changing...</span>
                    </div>
                  ) : (
                    "Change Password"
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}