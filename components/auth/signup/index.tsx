"use client"

import Image from 'next/image'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import SignupForm from '@/components/auth/signup/signupForm'
import Link from 'next/link'
import { aclonica } from '@/app/layout'

function SignUpPage() {
  const [tab, setTab] = useState<'tester' | 'owner'>('tester')
  console.log("I am clicked", tab)

  return (
    <div className="min-h-screen flex flex-col md:flex-row overflow-hidden relative">
      {/* Background Image - Same as Login */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0"></div>
        <div className="absolute inset-0">
          <img
            src="/loginBGImage.png"
            alt="Housing community"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Left Side - Welcome Section */}
      <div className='flex flex-col items-center justify-center w-full md:w-1/2 p-6 md:p-16 z-10 relative text-white'>
        <motion.h2
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className={`${aclonica.className} capitalize text-center text-xl mb-4`}>
          Join the Testing Revolution
        </motion.h2>
        <motion.h1
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={`text-5xl font-bold ${aclonica.className} uppercase text-center mb-6`}>
          Start Your <span className="text-4xl font-bold text-amber-800">QA Journey</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className='text-lg mt-4 max-w-md text-center'>
          Create your account and dive into real projects. Earn points, unlock achievements, and showcase your testing skills in our gamified platform.
        </motion.p>
      </div>

      {/* Right Side - Signup Form */}
      <div className='flex flex-col items-center justify-center w-full md:w-1/2 p-6 md:p-16 z-10 relative text-white'>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className='w-full max-w-md rounded-lg shadow-2xl p-8 border border-[#A33C13] relative z-10'>

          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`text-4xl font-bold ${aclonica.className} uppercase text-center mb-4`}>
            Sign Up
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mb-6"
          >
            Choose your role and get started
          </motion.p>

          {/* Tabs */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-row w-full bg-white/10 backdrop-blur-sm rounded-md overflow-hidden mb-6"
          >
            <button
              onClick={() => setTab("tester")}
              type="button"
              className={`w-1/2 py-3 font-medium transition ${tab === "tester"
                ? "bg-[#A33C13] text-white"
                : "text-white/70 hover:text-white"
                }`}
            >
              I&apos;m Tester
            </button>
            <button
              onClick={() => setTab("owner")}
              type="button"
              className={`w-1/2 py-3 font-medium transition ${tab === "owner"
                ? "bg-[#A33C13] text-white"
                : "text-white/70 hover:text-white"
                }`}
            >
              I&apos;m Product Owner
            </button>
          </motion.div>

          {/* Form */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col gap-4"
          >
            {tab === "tester" && (
              <SignupForm
                role="tester"
                onSubmit={(data) => console.log("Tester Signup:", data)}
              />
            )}

            {tab === "owner" && (
              <SignupForm
                role="developer"
                onSubmit={(data) => console.log("Owner Signup:", data)}
              />
            )}

            {/* Divider */}
            <div className="flex items-center my-4">
              <div className="flex-grow border-t border-white/30"></div>
              <span className="mx-3 text-white/70">or</span>
              <div className="flex-grow border-t border-white/30"></div>
            </div>

            {/* Footer */}
            <p className="text-center text-white/70">
              Already a user?{" "}
              <Link href="/signin" className="text-amber-300 hover:text-amber-200 hover:underline">
                Login here
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default SignUpPage
