"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import ThemeButton from "@/components/ui/button";
import { confirmPasswordReset } from "@/lib/api/auth/passwordReset";
import { showToast } from "@/lib/utils/toast";
import { passwordResetConfirmSchema, PasswordResetConfirmFormData } from "@/lib/schemas/auth";
import { FiEye, FiEyeOff } from "react-icons/fi";

interface ConfirmResetFormProps {
  email: string;
  otp: string;
  onSuccess: () => void;
  onBackToVerify: () => void;
}

export default function ConfirmResetForm({ 
  email, 
  otp, 
  onSuccess, 
  onBackToVerify 
}: ConfirmResetFormProps) {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, dirtyFields }
  } = useForm<PasswordResetConfirmFormData>({
    resolver: zodResolver(passwordResetConfirmSchema),
    mode: "onChange",
    defaultValues: {
      email,
      otp,
      new_password: ""
    }
  });

  const onSubmit = async (data: PasswordResetConfirmFormData) => {
    setLoading(true);
    const loadingToast = showToast.loading('Updating your password...');

    try {
      const response = await confirmPasswordReset(data);
      
      showToast.dismiss(loadingToast);
      showToast.success(response.message);
      
      // Move to success step
      setTimeout(() => {
        onSuccess();
      }, 1500);
      
    } catch (error: unknown) {
      showToast.dismiss(loadingToast);
      
      let errorMessage = 'Failed to reset password. Please try again.';
      
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status?: number; data?: Record<string, unknown> } };
        
        if (axiosError.response?.status === 400) {
          errorMessage = 'Invalid or expired verification code. Please try again.';
        } else if (axiosError.response?.data && typeof axiosError.response.data === 'object' && 'message' in axiosError.response.data) {
          errorMessage = String(axiosError.response.data.message);
        }
      }

      showToast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="text-center">
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-white/70 text-sm"
        >
          Create a strong new password for
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-amber-300 font-medium"
        >
          {email}
        </motion.p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* New Password Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="relative"
        >
          <input
            {...register("new_password")}
            type={showPassword ? "text" : "password"}
            placeholder="Enter new password"
            className={`w-full p-3 pr-12 bg-transparent border-b-2 outline-none transition-colors ${
              errors.new_password 
                ? 'border-red-500 focus:border-red-400' 
                : dirtyFields.new_password && !errors.new_password
                ? 'border-green-500 focus:border-green-400'
                : 'border-white/30 focus:border-[#A33C13]'
            }`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded transition-colors"
          >
            {showPassword ? (
              <FiEyeOff size={18} className="text-white/70" />
            ) : (
              <FiEye size={18} className="text-white/70" />
            )}
          </button>
          {errors.new_password && (
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-400 text-sm mt-1"
            >
              {errors.new_password.message}
            </motion.p>
          )}
          <p className="text-xs text-white/60 mt-2">
            Password must contain at least 8 characters, including uppercase, lowercase, and a number
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col gap-3"
        >
          <ThemeButton
            type="submit"
            variant="primary"
            disabled={loading || !isValid}
            className={loading || !isValid ? "opacity-75 cursor-not-allowed" : ""}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Updating Password...</span>
              </div>
            ) : (
              "Reset Password"
            )}
          </ThemeButton>

          <button
            type="button"
            onClick={onBackToVerify}
            className="text-white/70 hover:text-white hover:underline text-sm transition-colors"
            disabled={loading}
          >
            ← Back to Verification
          </button>
        </motion.div>
      </form>
    </motion.div>
  );
}