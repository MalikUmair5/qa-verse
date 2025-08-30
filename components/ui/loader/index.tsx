import React from 'react'

function Loader() {
  return (
    <div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-amber-150 via-white to-amber-75'>
      <div className="relative">
        {/* Outer spinning ring */}
        <div className="w-16 h-16 border-4 text-amber-500 border-t-transparent rounded-full animate-spin"></div>

        {/* Inner pulsing dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-6 text-amber-800 animate-pulse font-extrabold mr-5 text-xl">QAV</div>
        </div>
      </div>
    </div>
  )
}

export default Loader