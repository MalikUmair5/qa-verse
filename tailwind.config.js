/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Exact colors from signup page
        primary: '#A33C13', // Brown/orange from buttons
        'primary-dark': '#8a2f0f',
        secondary: '#ECF0FF', // Light blue background from tabs
        accent: '#D67052', // Lighter orange
        muted: '#9C9AA5', // Gray text from inactive tabs
        background: '#FFFCFB', // Very light cream
        foreground: '#171717', // Dark text
        'background-alt': '#F8F4F1', // Alternative background
        border: '#CBADD7', // Purple border from inputs
        'test-green': '#4CAF50', // For test success
        'test-red': '#F44336', // For test failure
        'test-yellow': '#FF9800', // For test warning
        'bug-purple': '#9C27B0', // For bug icons
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-in-out',
        'slide-up': 'slideUp 0.8s ease-out',
        'slide-down': 'slideDown 0.8s ease-out',
        'scale-in': 'scaleIn 0.6s ease-out',
        'bounce-gentle': 'bounceGentle 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'test-flash': 'testFlash 2s infinite',
        'bug-crawl': 'bugCrawl 4s linear infinite',
        'code-scan': 'codeScan 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        testFlash: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.3' },
        },
        bugCrawl: {
          '0%': { transform: 'translateX(-100%) rotate(0deg)' },
          '100%': { transform: 'translateX(100vw) rotate(360deg)' },
        },
        codeScan: {
          '0%': { transform: 'translateX(-100%)' },
          '50%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
  plugins: [],
}
