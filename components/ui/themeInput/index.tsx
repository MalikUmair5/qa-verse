import React from 'react'

interface ThemeInputProps {
  type: string
  placeHolder: string
  size?: string
  label: string
  variant?: 'default' | 'transparent'
}

function ThemeInput({ type, placeHolder, size, label, variant = 'default' }: ThemeInputProps) {
  const inputClasses = variant === 'transparent' 
    ? "w-full bg-transparent border-b-2 border-white/30 text-white placeholder-white/60 p-2 focus:border-amber-500 outline-none transition-colors"
    : `input ${size && `w-[${size}]`} w-full border border-[#CBADD7] rounded-md p-2 focus:border-[#A33C13] focus:ring-1 focus:ring-[#A33C13] outline-none`;

  const labelClasses = variant === 'transparent'
    ? "block text-sm font-medium mb-1 text-white"
    : "block text-sm font-medium mb-1";

  return (
    <div>
      <label className={labelClasses}>{label}</label>
      <input type={type} placeholder={placeHolder} className={inputClasses} />
    </div>
  )
}

export default ThemeInput