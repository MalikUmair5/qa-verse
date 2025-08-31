"use client"

import Image from 'next/image'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import SignupForm from './SignupForm'
import Link from 'next/link'

function SignUpPage() {
  const [tab, setTab] = useState<'tester' | 'owner'>('tester')
  console.log("I am clicked", tab)

  return (
    <div className="flex flex-col min-h-screen md:flex-row">
      {/* Left Side */}
      <div className="flex justify-center items-center w-full md:w-1/2 p-6">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Image src="/bug.png" alt="Bug" width={300} height={300} />
        </motion.div>
      </div>

      {/* Right Side */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 p-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-3xl font-bold uppercase text-center"
          >
            Create an Account
          </motion.h1>

          {/* Tabs */}
          <div className="flex flex-row w-full bg-[#ECF0FF] rounded-md overflow-hidden mb-5">
            <button
              onClick={() => setTab("tester")}
              type="button"
              className={`w-1/2 py-2 font-medium transition ${tab === "tester"
                ? "bg-[#A33C13] text-white"
                : "text-[#9C9AA5]"
                }`}
            >
              I&apos;m Tester
            </button>
            <button
              onClick={() => setTab("owner")}
              type="button"
              className={`w-1/2 py-2 font-medium transition ${tab === "owner"
                ? "bg-[#A33C13] text-white"
                : "text-[#9C9AA5]"
                }`}
            >
              I&apos;m Product Owner
            </button>
          </div>

          {/* Form */}
          <div className="flex flex-col gap-3">
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
              <div className="flex-grow border-t border-[#CBADD7]"></div>
              <span className="mx-3 text-gray-500">or</span>
              <div className="flex-grow border-t border-[#CBADD7]"></div>
            </div>

            {/* Footer */}
            <p className="text-center text-gray-600">
              Already a user?{" "}
              <Link href="/signin" className="text-blue-600 hover:underline">
                Login here
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default SignUpPage
