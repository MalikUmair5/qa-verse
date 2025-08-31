"use client";
import { motion } from "framer-motion";

const theme = {
  primary: "bg-[#A33C13] text-white",
  secondary: "bg-white text-black",
};

interface ThemeButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
}

export default function ThemeButton({
  children,
  variant = "primary",
  type = "button",
  onClick,
}: ThemeButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      type={type}
      onClick={onClick}
      className={`w-full mb-4 py-2 rounded-md font-medium transition ${theme[variant]}`}
    >
      {children}
    </motion.button>
  );
}
