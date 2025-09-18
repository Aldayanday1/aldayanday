"use client";

import { cn } from "@/lib/utils";

import React, {
  createContext,
  useState,
  useContext,
  useRef,
  useEffect,
} from "react";

const MouseEnterContext = createContext<
  [boolean, React.Dispatch<React.SetStateAction<boolean>>] | undefined
>(undefined);

export const CardContainer = ({
  children,
  className,
  containerClassName,
  expandedHoverArea = false,
  autoActivate = false,
  disableMouseHandlers = false,
}: {
  children?: React.ReactNode;
  className?: string | undefined;
  containerClassName?: string;
  expandedHoverArea?: boolean;
  autoActivate?: boolean;
  disableMouseHandlers?: boolean;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMouseEntered, setIsMouseEntered] = useState(autoActivate);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(typeof window !== 'undefined' && window.innerWidth <= 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-activate the hover state when autoActivate is true
  useEffect(() => {
    if (autoActivate && !isMobile) {
      setIsMouseEntered(true);
    }
  }, [autoActivate, isMobile]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || isMobile) return;

    if (expandedHoverArea) {
      // Use the entire modal/viewport area for calculations
      const modalElement = e.currentTarget.closest('[class*="modal"]') ||
        e.currentTarget.closest('[class*="expandable"]') ||
        e.currentTarget.closest('.fixed') ||
        document.documentElement;

      const { left, top, width, height } = modalElement.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;

      // Calculate rotation based on full modal area
      const x = (e.clientX - centerX) / 35; // Slightly reduced sensitivity for larger area
      const y = (e.clientY - centerY) / 35;

      containerRef.current.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
    } else {
      // Original behavior for card-only area
      const { left, top, width, height } = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - left - width / 2) / 25;
      const y = (e.clientY - top - height / 2) / 25;
      containerRef.current.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
    }
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile) return;
    setIsMouseEntered(true);
    if (!containerRef.current) return;
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || isMobile) return;
    if (expandedHoverArea) {
      // Only reset when leaving the entire modal area
      const relatedTarget = e.relatedTarget as Element;
      const modalElement = e.currentTarget.closest('[class*="modal"]') ||
        e.currentTarget.closest('[class*="expandable"]') ||
        e.currentTarget.closest('.fixed');

      if (!modalElement?.contains(relatedTarget)) {
        setIsMouseEntered(false);
        containerRef.current.style.transform = `rotateY(0deg) rotateX(0deg)`;
      }
    } else {
      setIsMouseEntered(false);
      containerRef.current.style.transform = `rotateY(0deg) rotateX(0deg)`;
    }
  };
  return (
    <MouseEnterContext.Provider value={[isMouseEntered, setIsMouseEntered]}>
      <div
        className={cn(
          "py-20 flex items-center justify-center",
          containerClassName
        )}
        style={{
          perspective: isMobile ? undefined : "1000px",
        }}
      >
        <div
          ref={containerRef}
          onMouseEnter={disableMouseHandlers ? undefined : handleMouseEnter}
          onMouseMove={disableMouseHandlers ? undefined : handleMouseMove}
          onMouseLeave={disableMouseHandlers ? undefined : handleMouseLeave}
          className={cn(
            "flex items-center justify-center relative transition-all duration-200 ease-linear",
            className
          )}
          style={{
            transformStyle: "preserve-3d",
          }}
        >
          {children}
        </div>
      </div>
    </MouseEnterContext.Provider>
  );
};

export const CardBody = React.forwardRef<
  HTMLDivElement,
  {
    children: React.ReactNode | React.ReactNode[];
    className?: string | undefined;
  }
>(({ children, className }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "h-96 w-96 [transform-style:preserve-3d]  [&>*]:[transform-style:preserve-3d]",
        className
      )}
    >
      {children}
    </div>
  );
});

CardBody.displayName = "CardBody";

export const CardItem = <T extends keyof React.JSX.IntrinsicElements = "div">({
  as: Tag = "div" as T,
  children,
  className,
  translateX = 0,
  translateY = 0,
  translateZ = 0,
  rotateX = 0,
  rotateY = 0,
  rotateZ = 0,
  ...rest
}: {
  as?: T;
  children: React.ReactNode;
  className?: string;
  translateX?: number | string;
  translateY?: number | string;
  translateZ?: number | string;
  rotateX?: number | string;
  rotateY?: number | string;
  rotateZ?: number | string;
} & React.ComponentPropsWithoutRef<T>) => {
  const ref = useRef<React.ElementRef<T>>(null);
  const [isMouseEntered] = useMouseEnter();

  useEffect(() => {
    handleAnimations();
  }, [isMouseEntered]);

  const handleAnimations = () => {
    if (!ref.current) return;
    if (isMouseEntered) {
      (ref.current as unknown as HTMLElement).style.transform = `translateX(${translateX}px) translateY(${translateY}px) translateZ(${translateZ}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`;
    } else {
      (ref.current as unknown as HTMLElement).style.transform = `translateX(0px) translateY(0px) translateZ(0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg)`;
    }
  };

  return (
    <Tag
      ref={ref}
      className={cn("w-fit transition duration-200 ease-linear", className)}
      {...rest}
    >
      {children}
    </Tag>
  );
};

// Create a hook to use the context
export const useMouseEnter = () => {
  const context = useContext(MouseEnterContext);
  if (context === undefined) {
    throw new Error("useMouseEnter must be used within a MouseEnterProvider");
  }
  return context;
};
