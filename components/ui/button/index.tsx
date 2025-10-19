"use client";
import { motion } from "framer-motion";

const theme = {
  primary: "bg-[#A33C13] text-white hover:bg-[#8a2f0f] shadow-lg hover:shadow-xl",
  secondary: "bg-white text-[#A33C13] border border-[#A33C13] hover:bg-[#A33C13] hover:text-white",
};

interface ThemeButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  className?: string;
}

export default function ThemeButton({
  children,
  variant = "primary",
  type = "button",
  onClick,
  className = "",
}: ThemeButtonProps) {
  return (
    <motion.button
      whileHover={{ 
        scale: 1.02,
        boxShadow: variant === "primary" 
          ? "0 20px 25px -5px rgba(163, 60, 19, 0.3)" 
          : "0 10px 25px -5px rgba(163, 60, 19, 0.2)"
      }}
      whileTap={{ scale: 0.98 }}
      type={type}
      onClick={onClick}
      className={`flex justify-center items-center w-full px-8 py-4 rounded-lg font-medium text-lg transition-all min-w-[100px] h-10 whitespace-nowrap duration-300 ${theme[variant]} ${className}`}
    >
      {children}
    </motion.button>
  );
}
