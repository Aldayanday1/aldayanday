"use client";

import { Moon, SunDim } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { flushSync } from "react-dom";
import { cn } from "@/lib/utils";

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

    await document.startViewTransition(() => {
      flushSync(() => {
        console.log("clicked");
        const dark = document.documentElement.classList.toggle("dark");
        console.log("dark?", dark);
        setIsDarkMode(dark);
        onToggle?.(dark); // Call callback with new state
      });
    }).ready;

    const { top, left, width, height } =
      buttonRef.current.getBoundingClientRect();
    const y = top + height / 2;
    const x = left + width / 2;

    const right = window.innerWidth - left;
    const bottom = window.innerHeight - top;
    const maxRad = Math.hypot(Math.max(left, right), Math.max(top, bottom));

    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${maxRad}px at ${x}px ${y}px)`,
        ],
      },
      {
        duration: 700,
        easing: "ease-in-out",
        pseudoElement: "::view-transition-new(root)",
      },
    );
  };

  return (
    <button ref={buttonRef} onClick={changeTheme} className={cn(className)}>
      {isDarkMode ? <SunDim /> : <Moon />}
    </button>
  );
};
