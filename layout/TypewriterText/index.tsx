'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

interface TypewriterTextProps {
  text: string
  className?: string
  delay?: number
  speed?: number
}

const TypewriterText: React.FC<TypewriterTextProps> = ({ 
  text, 
  className = '', 
  delay = 0,
  speed = 50 
}) => {
  const [displayText, setDisplayText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isStarted, setIsStarted] = useState(false)

  useEffect(() => {
    const startTimer = setTimeout(() => {
      setIsStarted(true)
    }, delay * 1000)

    return () => clearTimeout(startTimer)
  }, [delay])

  useEffect(() => {
    if (!isStarted) return

    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(text.slice(0, currentIndex + 1))
        setCurrentIndex(currentIndex + 1)
      }, speed)

      return () => clearTimeout(timer)
    }
  }, [currentIndex, text, isStarted, speed])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isStarted ? 1 : 0 }}
      className={className}
    >
      {displayText}
      {currentIndex < text.length && (
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.8, repeat: Infinity }}
          className="text-white"
        >
          |
        </motion.span>
      )}
    </motion.div>
  )
}

export default TypewriterText
