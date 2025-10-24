'use client'
import ThemeButton from '@/components/ui/button'
import React from 'react'
import { motion } from 'framer-motion'
import { useSidebar } from '@/app/(roles)/layout'

function Footer() {
  const { isExpanded } = useSidebar();

  return (
    <motion.footer 
      className={`bg-[#F3ECE9] border-t border-gray-200 shadow-sm transition-all duration-300 ${
        isExpanded ? 'ml-80' : 'ml-20'
      }`}
      initial={{ y: 100, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true }}
    >
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <motion.div 
            className="col-span-1 md:col-span-2"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            viewport={{ once: true }}
          >
            <motion.div 
              className="flex items-center space-x-2 mb-4"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="w-8 h-8 bg-[#A33C13] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">QA</span>
              </div>
              <h3 className="text-xl font-bold text-[#171717]">QA-VERSE</h3>
            </motion.div>
            <p className="text-[#9C9AA5] mb-6 leading-relaxed">
              Your comprehensive platform for quality assurance and testing solutions.
              Building better software through better testing.
            </p>
            <div className="flex space-x-4">
              <motion.a 
                href="#" 
                className="text-[#9C9AA5] hover:text-[#A33C13] transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                Facebook
              </motion.a>
              <motion.a 
                href="#" 
                className="text-[#9C9AA5] hover:text-[#A33C13] transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                Twitter
              </motion.a>
              <motion.a 
                href="#" 
                className="text-[#9C9AA5] hover:text-[#A33C13] transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                LinkedIn
              </motion.a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h4 className="font-semibold mb-4 text-[#171717]">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <motion.a 
                  href="#" 
                  className="text-[#9C9AA5] hover:text-[#A33C13] transition-colors"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  Home
                </motion.a>
              </li>
              <li>
                <motion.a 
                  href="#" 
                  className="text-[#9C9AA5] hover:text-[#A33C13] transition-colors"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  About
                </motion.a>
              </li>
              <li>
                <motion.a 
                  href="#" 
                  className="text-[#9C9AA5] hover:text-[#A33C13] transition-colors"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  Services
                </motion.a>
              </li>
              <li>
                <motion.a 
                  href="#" 
                  className="text-[#9C9AA5] hover:text-[#A33C13] transition-colors"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  Contact
                </motion.a>
              </li>
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h4 className="font-semibold mb-4 text-[#171717]">Contact</h4>
            <div className="space-y-3 text-[#9C9AA5]">
              <motion.p
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                email@qaverse.com
              </motion.p>
              <motion.p
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                +1 (555) 123-4567
              </motion.p>
              <motion.p
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                123 QA Street, Testing City
              </motion.p>
            </div>
          </motion.div>
        </div>

        {/* Newsletter Signup */}
        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h4 className="font-semibold mb-4 text-[#171717]">Stay Updated</h4>
          <p className="text-[#9C9AA5] mb-6">Get the latest updates on QA trends and testing best practices</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <motion.div 
              className="flex-grow"
              whileFocus={{ scale: 1.02 }}
            >
              <input 
                type="email" 
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-lg border border-[#CBADD7] focus:outline-none focus:ring-2 focus:ring-[#A33C13] focus:border-transparent"
              />
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <ThemeButton variant="primary">
                Subscribe
              </ThemeButton>
            </motion.div>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div 
          className="border-t border-[#CBADD7] mt-8 pt-6 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          viewport={{ once: true }}
        >
          <p className="text-[#9C9AA5]">
            © 2025 QA-VERSE. All rights reserved.
          </p>
        </motion.div>
      </div>
    </motion.footer>
  )
}

export default Footer
