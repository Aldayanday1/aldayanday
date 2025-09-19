import React from "react";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface InteractiveHoverButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isDarkMode?: boolean;
}

export const InteractiveHoverButton = React.forwardRef<
  HTMLButtonElement,
  InteractiveHoverButtonProps
>(({ children, className, isDarkMode = false, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "group relative w-auto cursor-pointer overflow-hidden rounded-full border p-2 px-6 text-center font-semibold transition-all duration-300",
        isDarkMode
          ? "border-neutral-700 bg-black text-white hover:text-black"
          : "border-neutral-200 bg-white text-black hover:text-white",
        className,
      )}
      {...props}
    >
      {/* Background yang mengexpand saat hover */}
      <div className={cn(
        "absolute inset-0 scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100 rounded-full",
        isDarkMode ? "bg-white" : "bg-black"
      )}></div>

      {/* Content container */}
      <div className="relative z-10 flex items-center gap-2">
        {/* Titik yang mengecil saat hover (desktop) */}
        <div className={cn(
          "hidden sm:block h-2 w-2 rounded-full transition-all duration-300 group-hover:scale-0",
          isDarkMode ? "bg-white" : "bg-black"
        )}></div>

        {/* Animated badge for mobile only - pulse color based on theme */}
        <motion.span
          className={cn(
            "block sm:hidden w-2 h-2 rounded-full",
            isDarkMode ? "bg-white" : "bg-black"
          )}
          animate={{
            opacity: [1, 0, 1],
            boxShadow: [
              `0 0 0 0 ${isDarkMode ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.7)"}`,
              `0 0 0 6px ${isDarkMode ? "rgba(255, 255, 255, 0)" : "rgba(0, 0, 0, 0)"}`,
              `0 0 0 0 ${isDarkMode ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.7)"}`
            ]
          }}
          transition={{ repeat: Infinity, duration: 1 }}
        />

        {/* Teks yang slide ke kanan dan fade out saat hover */}
        <span className="inline-block transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0">
          {children}
        </span>
      </div>

      {/* Content yang muncul saat hover (teks + arrow) */}
      <div className="absolute top-0 left-0 z-20 flex h-full w-full translate-x-12 items-center justify-center gap-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
        <span className={cn(
          "font-semibold",
          isDarkMode ? "text-black" : "text-white"
        )}>{children}</span>
        <ArrowRight className={cn(
          "w-4 h-4",
          isDarkMode ? "text-black" : "text-white"
        )} />
      </div>
    </button>
  );
});

InteractiveHoverButton.displayName = "InteractiveHoverButton";
