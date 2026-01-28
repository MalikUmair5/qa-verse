"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ThemeButton from "@/components/ui/button";
import { register, RegisterPayload } from "@/lib/api/auth/register";
import { showToast } from "@/lib/utils/toast";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { signupSchema, SignupFormData } from "@/lib/schemas/auth";

interface SignupFormProps {
  role: "tester" | "developer";
  onSubmit?: (formData: Record<string, string>) => void;
}

export default function SignupForm({ role }: SignupFormProps) {
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const {
    register: registerField,
    handleSubmit,
    formState: { errors, isValid, dirtyFields },
    reset
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: "onChange", // Real-time validation
    defaultValues: {
      fullname: "",
      email: "",
      password: "",
      password2: "",
      bio: "",
      github_url: "",
      linkedin_url: ""
    }
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        showToast.error('Please select an image file');
        return;
      }
      
      // Validate file size (2MB max)
      if (file.size > 2 * 1024 * 1024) {
        showToast.error('Image size must be less than 2MB');
        return;
      }
      
      setAvatar(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: SignupFormData) => {
    setLoading(true);
    
    const loadingToast = showToast.loading('Creating your account...');

    try {
      const payload: RegisterPayload = {
        fullname: data.fullname,
        email: data.email,
        role: role === "tester" ? "tester" : "maintainer",
        password: data.password,
        password2: data.password2,
        bio: data.bio,
        avatar: avatar,
        github_url: data.github_url || "",
        linkedin_url: data.linkedin_url || ""
      };

      const response = await register(payload);
      
      showToast.dismiss(loadingToast);
      showToast.success(response.message);

      // Reset form
      reset();
      setAvatar(null);
      setAvatarPreview(null);
      
      // Since registration doesn't return tokens, redirect to signin
      setTimeout(() => {
        router.push('/signin');
      }, 2000);
      
    } catch (error: unknown) {
      showToast.dismiss(loadingToast);
      
      let errorMessage = 'Registration failed. Please try again.';
      
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status?: number; data?: Record<string, unknown> } };
        
        if (axiosError.response?.status === 400) {
          const errorData = axiosError.response.data;
          if (errorData && typeof errorData === 'object') {
            if ('email' in errorData) {
              errorMessage = 'This email is already registered';
            } else if ('password' in errorData && Array.isArray(errorData.password)) {
              errorMessage = errorData.password[0] || 'Password requirements not met';
            } else if (typeof errorData === 'string') {
              errorMessage = errorData;
            }
          }
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
      {/* Avatar Upload */}
      <div className="flex flex-col items-center space-y-3">
        <div 
          className="relative w-20 h-20 rounded-full border-2 border-[#A33C13] border-dashed flex items-center justify-center cursor-pointer hover:border-amber-500 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          {avatarPreview ? (
            <img 
              src={avatarPreview} 
              alt="Avatar preview" 
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <div className="text-center">
              <div className="text-2xl mb-1">📸</div>
              <div className="text-xs text-white/70">Avatar</div>
            </div>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleAvatarChange}
          className="hidden"
        />
        <p className="text-xs text-white/60 text-center">Click to upload avatar (optional)</p>
      </div>

      {/* Full Name */}
      <div>
        <input
          {...registerField("fullname")}
          type="text"
          placeholder="Full Name"
          className={`w-full p-3 bg-transparent border-b-2 outline-none transition-colors ${
            errors.fullname 
              ? 'border-red-500 focus:border-red-400' 
              : dirtyFields.fullname && !errors.fullname
              ? 'border-green-500 focus:border-green-400'
              : 'border-white/30 focus:border-[#A33C13]'
          }`}
        />
        {errors.fullname && (
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-400 text-sm mt-1"
          >
            {errors.fullname.message}
          </motion.p>
        )}
      </div>

      {/* Email */}
      <div>
        <input
          {...registerField("email")}
          type="email"
          placeholder="Email Address"
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

      {/* Password */}
      <div>
        <input
          {...registerField("password")}
          type="password"
          placeholder="Password"
          className={`w-full p-3 bg-transparent border-b-2 outline-none transition-colors ${
            errors.password 
              ? 'border-red-500 focus:border-red-400' 
              : dirtyFields.password && !errors.password
              ? 'border-green-500 focus:border-green-400'
              : 'border-white/30 focus:border-[#A33C13]'
          }`}
        />
        {errors.password && (
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-400 text-sm mt-1"
          >
            {errors.password.message}
          </motion.p>
        )}
      </div>

      {/* Confirm Password */}
      <div>
        <input
          {...registerField("password2")}
          type="password"
          placeholder="Confirm Password"
          className={`w-full p-3 bg-transparent border-b-2 outline-none transition-colors ${
            errors.password2 
              ? 'border-red-500 focus:border-red-400' 
              : dirtyFields.password2 && !errors.password2
              ? 'border-green-500 focus:border-green-400'
              : 'border-white/30 focus:border-[#A33C13]'
          }`}
        />
        {errors.password2 && (
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-400 text-sm mt-1"
          >
            {errors.password2.message}
          </motion.p>
        )}
      </div>

      {/* Bio */}
      <div>
        <textarea
          {...registerField("bio")}
          placeholder="Tell us about yourself..."
          rows={3}
          className={`w-full p-3 bg-transparent border-2 rounded-md outline-none transition-colors resize-none ${
            errors.bio 
              ? 'border-red-500 focus:border-red-400' 
              : dirtyFields.bio && !errors.bio
              ? 'border-green-500 focus:border-green-400'
              : 'border-white/30 focus:border-[#A33C13]'
          }`}
        />
        {errors.bio && (
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-400 text-sm mt-1"
          >
            {errors.bio.message}
          </motion.p>
        )}
      </div>

      {/* GitHub URL (Optional) */}
      <div>
        <input
          {...registerField("github_url")}
          type="url"
          placeholder="GitHub Profile (optional)"
          className={`w-full p-3 bg-transparent border-b-2 outline-none transition-colors ${
            errors.github_url 
              ? 'border-red-500 focus:border-red-400' 
              : dirtyFields.github_url && !errors.github_url
              ? 'border-green-500 focus:border-green-400'
              : 'border-white/30 focus:border-[#A33C13]'
          }`}
        />
        {errors.github_url && (
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-400 text-sm mt-1"
          >
            {errors.github_url.message}
          </motion.p>
        )}
      </div>

      {/* LinkedIn URL (Optional) */}
      <div>
        <input
          {...registerField("linkedin_url")}
          type="url"
          placeholder="LinkedIn Profile (optional)"
          className={`w-full p-3 bg-transparent border-b-2 outline-none transition-colors ${
            errors.linkedin_url 
              ? 'border-red-500 focus:border-red-400' 
              : dirtyFields.linkedin_url && !errors.linkedin_url
              ? 'border-green-500 focus:border-green-400'
              : 'border-white/30 focus:border-[#A33C13]'
          }`}
        />
        {errors.linkedin_url && (
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-400 text-sm mt-1"
          >
            {errors.linkedin_url.message}
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
            <span>Creating Account...</span>
          </div>
        ) : (
          "Sign Up"
        )}
      </ThemeButton>
    </form>
  );
}
