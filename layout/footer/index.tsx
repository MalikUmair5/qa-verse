'use client'
import React from 'react'
import { motion } from 'framer-motion'

function Footer() {
  return (
    <motion.footer 
      className="bg-[#F3ECE9] border-t border-gray-200 shadow-sm"
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
                <a href="#" className="text-[#9C9AA5] hover:text-[#A33C13] transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="text-[#9C9AA5] hover:text-[#A33C13] transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="text-[#9C9AA5] hover:text-[#A33C13] transition-colors">
                  Services
                </a>
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
              <p>email@qaverse.com</p>
              <p>+1 (555) 123-4567</p>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#CBADD7] mt-8 pt-6 text-center">
          <p className="text-[#9C9AA5]">
            © {new Date().getFullYear()} QA-VERSE. All rights reserved.
          </p>
        </div>
      </div>
    </motion.footer>
  )
}

export default Footer
