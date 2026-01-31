"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import ThemeButton from "@/components/ui/button";
import { verifyAccount } from "@/lib/api/auth/verifyAccount";
import { showToast } from "@/lib/utils/toast";
import { otpSchema, OTPFormData } from "@/lib/schemas/auth";

interface OTPVerificationProps {
  email: string;
  onVerificationSuccess: () => void;
  onBackToSignup: () => void;
}

export default function OTPVerification({ 
  email, 
  onVerificationSuccess, 
  onBackToSignup 
}: OTPVerificationProps) {
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<OTPFormData>({
    resolver: zodResolver(otpSchema),
    mode: "onChange",
    defaultValues: {
      email,
      otp: ""
    }
  });

  const otpValue = watch("otp");
  const isOtpValid = otpValue && otpValue.length === 6 && /^\d{6}$/.test(otpValue);

  // Timer countdown effect
  useEffect(() => {
    if (timeLeft <= 0) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          showToast.error('Verification code expired. Please try signing up again.');
          setTimeout(() => onBackToSignup(), 2000);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onBackToSignup]);

  // Format timer display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const onSubmit = async (data: OTPFormData) => {
    setLoading(true);
    const loadingToast = showToast.loading('Verifying your account...');

    try {
      const response = await verifyAccount(data);
      
      showToast.dismiss(loadingToast);
      showToast.success(response.message);
      
      // Call success callback after a short delay
      setTimeout(() => {
        onVerificationSuccess();
      }, 1500);
      
    } catch (error: unknown) {
      showToast.dismiss(loadingToast);
      
      let errorMessage = 'Verification failed. Please try again.';
      
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status?: number; data?: Record<string, unknown> } };
        
        if (axiosError.response?.status === 400) {
          errorMessage = 'Invalid OTP. Please check and try again.';
        } else if (axiosError.response?.data && typeof axiosError.response.data === 'object' && 'message' in axiosError.response.data) {
          errorMessage = String(axiosError.response.data.message);
        }
      }

      showToast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
    setValue("otp", value);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="text-center">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-2xl font-bold mb-2"
        >
          Verify Your Email
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-white/70 text-sm"
        >
          We&apos;ve sent a 6-digit verification code to
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-amber-300 font-medium"
        >
          {email}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-3"
        >
          <p className="text-sm text-white/60">Time remaining:</p>
          <p className={`text-lg font-mono font-bold ${
            timeLeft <= 60 ? 'text-red-400' : 'text-green-400'
          }`}>
            {formatTime(timeLeft)}
          </p>
        </motion.div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <label htmlFor="otp" className="block text-sm font-medium text-white/80 mb-2">
            Verification Code
          </label>
          <input
            id="otp"
            type="text"
            value={otpValue}
            onChange={handleOtpChange}
            placeholder="000000"
            maxLength={6}
            className={`w-full p-4 text-center text-2xl tracking-widest bg-transparent border-2 rounded-lg outline-none transition-colors placeholder:text-white/30 ${
              errors.otp 
                ? 'border-red-500 focus:border-red-400' 
                : 'border-white/30 focus:border-[#A33C13]'
            }`}
          />
          {errors.otp && (
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-400 text-sm mt-2"
            >
              {errors.otp.message}
            </motion.p>
          )}
          <p className="text-xs text-white/60 text-center mt-2">
            Enter the 6-digit code from your email
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
            disabled={loading || !isOtpValid || timeLeft <= 0}
            className={loading || !isOtpValid || timeLeft <= 0 ? "opacity-75 cursor-not-allowed" : ""}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Verifying...</span>
              </div>
            ) : (
              "Verify Account"
            )}
          </ThemeButton>

          <button
            type="button"
            onClick={onBackToSignup}
            className="text-white/70 hover:text-white hover:underline text-sm transition-colors"
            disabled={loading}
          >
            ← Back to Sign Up
          </button>
        </motion.div>
      </form>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="text-center"
      >
        <p className="text-xs text-white/60">
          Didn&apos;t receive the code? Check your spam folder or try signing up again.
        </p>
      </motion.div>
    </motion.div>
  );
}