"use client";

import { Moon, SunDim } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { toggleThemeWithRippleFromElement } from "@/lib/theme-utils";

type props = {
  className?: string;
  onToggle?: (isDark: boolean) => void;
};

export const AnimatedThemeToggler = ({ className, onToggle }: props) => {
  // Initialize synchronously from the DOM so the correct icon renders on first paint.
  // Guard against server-side rendering by checking for `typeof window`.
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      if (typeof window === "undefined") return false;
      return document.documentElement.classList.contains("dark");
    } catch (e) {
      return false;
    }
  });

  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const changeTheme = async () => {
    if (!buttonRef.current) return;

    const newDarkState = await toggleThemeWithRippleFromElement(
      buttonRef.current,
      (d) => {
        setIsDarkMode(d);
        onToggle?.(d);
      }
    );

    // Ensure local state is consistent as a fallback
    setIsDarkMode(newDarkState);
  };

  return (
    <motion.button
      ref={buttonRef}
      onClick={changeTheme}
      className={cn(
        "relative flex items-center justify-center w-10 h-10 rounded-full",
        "bg-[var(--icon-background)]/50 hover:bg-[var(--icon-background)]/80",
        "transition-colors duration-200 focus:outline-none",
        className
      )}
      initial={{ opacity: 0, y: -10, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ scale: 1.1, y: -2 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.4, delay: 0.6, ease: "easeOut" }}
    >
      <motion.div
        className="flex items-center justify-center w-5 h-5"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.8, ease: "easeOut" }}
      >
        {isDarkMode ? <SunDim /> : <Moon />}
      </motion.div>
    </motion.button>
  );
};
