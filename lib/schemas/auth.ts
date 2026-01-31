import { z } from "zod";

// Login validation schema
export const loginSchema = z.object({
  email: z.string()
    .email("Please enter a valid email address")
    .min(1, "Email is required")
    .toLowerCase(),
  
  password: z.string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
});

// Signup validation schema
export const signupSchema = z.object({
  fullname: z.string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must be less than 100 characters")
    .regex(/^[a-zA-Z\s]+$/, "Full name can only contain letters and spaces"),
  
  email: z.string()
    .email("Please enter a valid email address")
    .toLowerCase(),
  
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 
      "Password must contain at least one lowercase letter, one uppercase letter, and one number"),
  
  password2: z.string(),
  
  bio: z.string()
    .min(10, "Bio must be at least 10 characters")
    .max(500, "Bio must be less than 500 characters"),
  
  github_url: z.string()
    .url("Please enter a valid GitHub URL")
    .optional()
    .or(z.literal("")),
  
  linkedin_url: z.string()
    .url("Please enter a valid LinkedIn URL")
    .optional()
    .or(z.literal("")),
}).refine((data) => data.password === data.password2, {
  message: "Passwords don't match",
  path: ["password2"],
});

// OTP verification schema
export const otpSchema = z.object({
  email: z.string()
    .email("Please enter a valid email address")
    .toLowerCase(),
  
  otp: z.string()
    .length(6, "OTP must be exactly 6 digits")
    .regex(/^\d{6}$/, "OTP must contain only numbers"),
});

// Password reset request schema
export const passwordResetRequestSchema = z.object({
  email: z.string()
    .email("Please enter a valid email address")
    .toLowerCase(),
});

// Password reset confirm schema
export const passwordResetConfirmSchema = z.object({
  email: z.string()
    .email("Please enter a valid email address")
    .toLowerCase(),
  
  otp: z.string()
    .length(6, "OTP must be exactly 6 digits")
    .regex(/^\d{6}$/, "OTP must contain only numbers"),
  
  new_password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 
      "Password must contain at least one lowercase letter, one uppercase letter, and one number"),
});

// Change password schema
export const changePasswordSchema = z.object({
  old_password: z.string()
    .min(1, "Current password is required"),
  
  new_password: z.string()
    .min(8, "New password must be at least 8 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 
      "New password must contain at least one lowercase letter, one uppercase letter, and one number"),
}).refine((data) => data.old_password !== data.new_password, {
  message: "New password must be different from current password",
  path: ["new_password"],
});

// Type exports
export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type OTPFormData = z.infer<typeof otpSchema>;
export type PasswordResetRequestFormData = z.infer<typeof passwordResetRequestSchema>;
export type PasswordResetConfirmFormData = z.infer<typeof passwordResetConfirmSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;