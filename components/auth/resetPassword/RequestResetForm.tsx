"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import ThemeButton from "@/components/ui/button";
import { requestPasswordReset } from "@/lib/api/auth/passwordReset";
import { showToast } from "@/lib/utils/toast";
import { passwordResetRequestSchema, PasswordResetRequestFormData } from "@/lib/schemas/auth";

interface RequestResetFormProps {
  onSuccess: (email: string) => void;
}

export default function RequestResetForm({ onSuccess }: RequestResetFormProps) {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, dirtyFields }
  } = useForm<PasswordResetRequestFormData>({
    resolver: zodResolver(passwordResetRequestSchema),
    mode: "onChange",
    defaultValues: {
      email: ""
    }
  });

  const onSubmit = async (data: PasswordResetRequestFormData) => {
    setLoading(true);
    const loadingToast = showToast.loading('Sending reset code...');

    try {
      const response = await requestPasswordReset(data);
      
      showToast.dismiss(loadingToast);
      showToast.success(response.message);
      
      // Move to next step
      onSuccess(data.email);
      
    } catch (error: unknown) {
      showToast.dismiss(loadingToast);
      
      let errorMessage = 'Failed to send reset code. Please try again.';
      
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status?: number; data?: Record<string, unknown> } };
        
        if (axiosError.response?.status === 404) {
          errorMessage = 'No account found with this email address.';
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Email Input */}
      <div>
        <input
          {...register("email")}
          type="email"
          placeholder="Enter your email address"
          className={`w-full p-3 bg-transparent border-b-2 outline-none transition-colors ${
            errors.email 
              ? 'border-red-500 focus:border-red-400' 
              : dirtyFields.email && !errors.email
              ? 'border-green-500 focus:border-green-400'
              : 'border-white/30 focus:border-[#A33C13]'
          }`}
        />
        {errors.email && (
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-400 text-sm mt-1"
          >
            {errors.email.message}
          </motion.p>
        )}
      </div>

      <ThemeButton 
        variant="primary" 
        type="submit"
        disabled={loading || !isValid}
        className={loading || !isValid ? "opacity-75 cursor-not-allowed" : ""}
      >
        {loading ? (
          <div className="flex items-center justify-center gap-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span>Sending Code...</span>
          </div>
        ) : (
          "Send Reset Code"
        )}
      </ThemeButton>
    </form>
  );
}