import React from 'react'

interface ThemeInputProps {
  type: string
  placeHolder: string
  size?: string
  label: string
}

function ThemeInput({ type, placeHolder, size, label }: ThemeInputProps) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input type={type} placeholder={placeHolder} className={`input ${size && `w-[${size}]`} w-full border border-[#CBADD7] rounded-md p-2`} />
    </div>
  )
}

export default ThemeInput