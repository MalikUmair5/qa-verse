'use client'

import React from 'react'
import loginBGImage from "../../../public/loginBGImage.png"
import Image from 'next/image'
import { motion } from 'framer-motion'
import { aclonica } from '@/app/layout'
import ThemeButton from '@/components/ui/button'

function LoginPage() {
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
              type="text"
              placeholder="Email"
              className="mt-4 p-2  w-full bg-transparent border-b-2 active:border-amber-500 focus:border-amber-500 outline-none"
            />
            <input
              type="password"
              placeholder="Password"
              className="mt-4 p-2  mb-4 w-full bg-transparent border-b-2 active:border-amber-500 focus:border-amber-500 outline-none"
            />
            <ThemeButton variant="primary" type="submit">Login</ThemeButton>



            <button>
              Don’t Have An Account? Signup
            </button>



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