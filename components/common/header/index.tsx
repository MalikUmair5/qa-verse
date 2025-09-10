'use client'
import ThemeButton from '@/components/ui/button'
import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'

function Header({ authenticated }: { authenticated?: boolean }) {
  return (
    <motion.header
      className="bg-secondary border-b border-gray-200 shadow-sm bg-[#F3ECE9]"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo/Brand */}
          <motion.div
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Image
              src="/headerLogo.png"
              alt="Find Projects"
              width={25}
              height={25}
              className="object-contain"
            />
            <h1 className="text-xl font-bold text-foreground">QA-VERSE</h1>
          </motion.div>

          {authenticated ? (
            <motion.div
              className="flex items-center space-x-2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Image
                src="/trophy.png"
                alt="User Avatar"
                width={40}
                height={40}
                className="rounded-full"
              />
              <span className="text-sm font-medium text-foreground">2,200 XP</span>
              <Image
                src="/userAvatar.png"
                alt="User Avatar"
                width={40}
                height={40}
                className="rounded-full"
              />
            </motion.div>
          ) : (
            <motion.div
              className="flex items-center space-x-2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Link href="/signin">
                <ThemeButton variant="secondary">
                  Login
                </ThemeButton>
              </Link>
              <Link href="/signup">
                <ThemeButton variant="primary">
                  Get Started
                </ThemeButton>
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </motion.header>
  )
}

export default Header