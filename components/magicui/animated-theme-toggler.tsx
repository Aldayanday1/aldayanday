"use client";

import { Moon, SunDim } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { toggleThemeWithRippleFromElement } from "@/lib/theme-utils";

type props = {
  className?: string;
  onToggle?: (isDark: boolean) => void;
};

export const AnimatedThemeToggler = ({ className, onToggle }: props) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false); // Will be set correctly in useEffect
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  // Sync dengan DOM class saat component mount
  useEffect(() => {
    // Check initial theme from DOM, not hardcoded state
    const checkInitialTheme = () => {
      const isDark = document.documentElement.classList.contains("dark");
      setIsDarkMode(isDark);
      onToggle?.(isDark); // Sync parent state immediately
    };
    checkInitialTheme();
  }, [onToggle]);

  const changeTheme = async () => {
    if (!buttonRef.current) return;

    const newDarkState = await toggleThemeWithRippleFromElement(
      buttonRef.current,
      onToggle
    );
    setIsDarkMode(newDarkState);
  };

  return (
    <button ref={buttonRef} onClick={changeTheme} className={cn(className)}>
      {isDarkMode ? <SunDim /> : <Moon />}
    </button>
  );
};
