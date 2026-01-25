'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { aclonica } from '@/app/layout'
import ThemeButton from '@/components/ui/button'
import Link from 'next/link'
import { login } from '@/lib/api/auth/login'
import { showToast } from '@/lib/utils/toast'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, LoginFormData } from '@/lib/schemas/auth'

function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register: registerField,
    handleSubmit,
    formState: { errors, isValid, dirtyFields }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange", // Real-time validation
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const handleLogin = async (data: LoginFormData) => {

    setLoading(true);
    
    // Show loading toast
    const loadingToast = showToast.loading('Signing you in...');

    try {
      const res = await login(data);
      if (res) {
        // Dismiss loading toast
        showToast.dismiss(loadingToast);
        
        // Show success toast
        showToast.success(`Welcome, ${res.user.fullname}!`);

        // Redirect based on role
        setTimeout(() => {
          if (res.user.role === 'tester') {
            router.push('/tester/dashboard');
          } else if (res.user.role === 'maintainer' || res.user.role === 'project_owner') {
            router.push('/maintainer/dashboard');
          } else {
            router.push('/dashboard'); // fallback route for unknown roles
          }
        }, 1000);
      }
    }
    catch (error: unknown) {
      // Dismiss loading toast
      showToast.dismiss(loadingToast);
      
      // Show error toast
      let errorMessage = 'Login failed. Please try again.';
      
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status?: number; data?: { message?: string } } };
        
        if (axiosError.response?.status === 401) {
          errorMessage = 'Invalid email or password';
        } else if (axiosError.response?.status === 400) {
          errorMessage = 'Please check your credentials';
        } else if (axiosError.response?.data?.message) {
          errorMessage = axiosError.response.data.message;
        }
      } else if (error && typeof error === 'object' && 'message' in error) {
        errorMessage = (error as { message: string }).message;
      }

      showToast.error(errorMessage);
    }
    finally {
      setLoading(false);
    }
  }


  return (
    <>
      <div className="min-h-screen flex flex-col md:flex-row overflow-hidden relative">

        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0"></div>
          <div className="absolute inset-0 ">
            <img
              src="/loginBGImage.png"
              alt="Housing community"
              className="w-full h-full object-cover"
            />
          </div>
        </div>


        {/* Left Side Section */}
        <div className='flex flex-col items-center justify-center w-full md:w-1/2 p-6 md:p-16 z-10 relative text-white'>
          <motion.h2
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className={`${aclonica.className} capitalize text-center`}>Test. Compete. Level Up.</motion.h2>
          <motion.h1
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`text-5xl font-bold ${aclonica.className} uppercase text-center`}>
            Welcome to <span className="text-4xl font-bold text-amber-800">QA Verse</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className='text-lg mt-4 max-w-md text-center'>
            A gamified platform built exclusively for testers. Dive into real projects uploaded by product owners, earn points, unlock achievements, and showcase your testing prowess. Ready to test your limits?
          </motion.p>
        </div >


        {/* Right Side Section */}
        <div className='flex flex-col items-center justify-center w-full md:w-1/2 p-6 md:p-16 z-10 relative text-white '>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className='text-lg mt-4 max-w-md text-center rounded-lg shadow-2xl p-16 border border-[#A33C13] relative z-10'>

            <motion.h1
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className={`text-5xl font-bold ${aclonica.className} uppercase text-center`}>
              Login
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Write your credentials
            </motion.p>

            <input
              {...registerField("email")}
              type="email"
              placeholder="Email"
              className={`mt-4 p-2 w-full bg-transparent border-b-2 outline-none transition-colors ${
                errors.email 
                  ? 'border-red-500 focus:border-red-400' 
                  : dirtyFields.email && !errors.email
                  ? 'border-green-500 focus:border-green-400'
                  : 'border-white/30 focus:border-amber-500'
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
            <input
              {...registerField("password")}
              type="password"
              placeholder="Password"
              className={`mt-4 p-2 mb-4 w-full bg-transparent border-b-2 outline-none transition-colors ${
                errors.password 
                  ? 'border-red-500 focus:border-red-400' 
                  : dirtyFields.password && !errors.password
                  ? 'border-green-500 focus:border-green-400'
                  : 'border-white/30 focus:border-amber-500'
              }`}
            />
            {errors.password && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-sm mt-1 mb-4"
              >
                {errors.password.message}
              </motion.p>
            )}
            <ThemeButton
              variant="primary" 
              type="submit"
              onClick={handleSubmit(handleLogin)}
              disabled={loading || !isValid}
              className={loading || !isValid ? "opacity-75 cursor-not-allowed" : ""}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Signing in...</span>
                </div>
              ) : (
                "Login"
              )}
            </ThemeButton>

            <Link href="/signup" className=" cursor-pointer">
              <button>
                Don’t Have An Account? Signup
              </button>
            </Link>

            <div className="mt-4 text-center text-sm text-white/60">
              <a href="#" className="hover:underline">
                Trouble signing in? Reset password
              </a>
            </div>

          </motion.div>
        </div >



        {/* <style jsx>{`
        .clip-diagonal {
          clip-path: polygon(0 0, 100% 100%, 0% 100%);
          }
          .clip-diagonal-reverse {
          clip-path: polygon(0 0, 100% 0, 100% 100%);
        }
      `}</style> */}
      </div>
    </>
  )
}

export default LoginPage;