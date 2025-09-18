"use client";

import React, { useEffect, useId, useRef, useState, ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { useOutsideClick } from "@/hooks/use-outside-click";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import { AnimatedTooltip } from "@/components/ui/animated-tooltip";
import { FaReact } from "react-icons/fa";
import { SiNextdotjs, SiTypescript, SiTailwindcss } from "react-icons/si";
import { AiOutlineClose } from 'react-icons/ai';
import { FiChevronDown } from 'react-icons/fi';
import { CardContainer, CardBody, CardItem } from "@/components/ui/3d-card";

type CardType = {
  description: string;
  title: string;
  src: string;
  ctaText: string;
  ctaLink: string;
  content: () => ReactNode;
};

interface ExpandableCardDemoProps {
  card?: CardType | null;
  onClose?: () => void;
  onHoverEnter?: () => void;
  onHoverLeave?: () => void;
}

export default function ExpandableCardDemo({
  card: initialCard = null,
  onClose,
  onHoverEnter,
  onHoverLeave,
}: ExpandableCardDemoProps) {
  // Initialize dark mode state immediately to prevent white flicker
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });
  const [active, setActive] = useState<CardType | null>(initialCard ?? null);
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [showScrollHint, setShowScrollHint] = useState(false);
  const [animateHint, setAnimateHint] = useState(true);

  // Ref for the card container to control 3D transforms directly
  const cardContainerRef = useRef<HTMLDivElement>(null);

  // Track mouse movement across the entire modal for 3D effect
  useEffect(() => {
    if (!active) return;

    // Immediately activate smooth cursor when modal opens
    if (onHoverEnter) onHoverEnter();

    const handleModalMouseMove = (e: MouseEvent) => {
      if (!cardContainerRef.current) return;

      // Get the modal container bounds
      const modalElement = document.querySelector('.fixed.inset-0.grid.place-items-center') as HTMLElement;
      if (!modalElement) return;

      const { left, top, width, height } = modalElement.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;

      // Calculate rotation based on cursor position relative to modal center
      const x = (e.clientX - centerX) / 30; // Sensitivity for X rotation
      const y = (e.clientY - centerY) / 30; // Sensitivity for Y rotation

      // Apply transform directly to the card
      cardContainerRef.current.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
    };

    const handleModalMouseLeave = (e: MouseEvent) => {
      if (!cardContainerRef.current) return;

      // Only deactivate if truly leaving the modal area
      const relatedTarget = e.relatedTarget as Element;
      const modalElement = document.querySelector('.fixed.inset-0.grid.place-items-center') as HTMLElement;

      // Check if the mouse is actually leaving the modal bounds
      if (!modalElement || !modalElement.contains(relatedTarget)) {
        // Reset transform when mouse leaves the modal completely
        cardContainerRef.current.style.transform = `rotateY(0deg) rotateX(0deg)`;
        // Deactivate smooth cursor when leaving modal
        if (onHoverLeave) onHoverLeave();
      }
    };

    const handleModalMouseEnter = () => {
      // Ensure smooth cursor stays active when entering any part of modal
      if (onHoverEnter) onHoverEnter();
    };

    // Attach listeners to the modal area
    const modalElement = document.querySelector('.fixed.inset-0.grid.place-items-center') as HTMLElement;
    if (modalElement) {
      modalElement.addEventListener('mousemove', handleModalMouseMove, { passive: true });
      modalElement.addEventListener('mouseleave', handleModalMouseLeave);
      modalElement.addEventListener('mouseenter', handleModalMouseEnter);
    }

    return () => {
      if (modalElement) {
        modalElement.removeEventListener('mousemove', handleModalMouseMove);
        modalElement.removeEventListener('mouseleave', handleModalMouseLeave);
        modalElement.removeEventListener('mouseenter', handleModalMouseEnter);
      }
      // Cleanup: deactivate smooth cursor when modal closes
      if (onHoverLeave) onHoverLeave();
    };
  }, [active, onHoverEnter, onHoverLeave]);  // Detect overflow and scroll position to show/hide and animate the scroll hint
  useEffect(() => {
    const target = contentRef.current;
    if (!target) return;

    function update() {
      const el = contentRef.current;
      if (!el) return;

      const { scrollHeight, clientHeight, scrollTop } = el;
      const isOverflowing = scrollHeight > clientHeight + 1; // allow small tolerance

      // Determine if user scrolled to (or very near) the bottom
      const atBottom = scrollTop + clientHeight >= scrollHeight - 2;

      // Show the hint only when content overflows AND user is NOT at the bottom
      setShowScrollHint(isOverflowing && !atBottom);

      // Keep animate flag in sync: if not overflowing or at bottom, disable animation
      setAnimateHint(isOverflowing && !atBottom);
    }

    // Initial check
    update();

    // Listen for scroll
    target.addEventListener('scroll', update, { passive: true });

    // Also observe size changes (e.g., window resize) to re-evaluate overflow
    const ro = new ResizeObserver(update);
    ro.observe(target);

    // Listen for window resize as well
    window.addEventListener('resize', update);

    return () => {
      target.removeEventListener('scroll', update);
      ro.disconnect();
      window.removeEventListener('resize', update);
    };
  }, [contentRef]);

  useEffect(() => {
    if (initialCard) setActive(initialCard);
  }, [initialCard]);

  // Check theme state
  useEffect(() => {
    const checkTheme = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setIsDarkMode(isDark);
    };

    checkTheme();

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        if (onClose) onClose();
        else setActive(null);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow || "auto";
    };
  }, [active, onClose]);

  useOutsideClick(ref as React.RefObject<HTMLDivElement>, () => {
    if (onClose) onClose();
    else setActive(null);
  });

  if (!active) return null;

  // Tambahkan data untuk AnimatedTooltip (icon/avatar tech stack)
  const techItems = [
    {
      id: 1,
      name: "React",
      designation: "Frontend Library",
      icon: FaReact,
      color: "#61DAFB",
    },
    {
      id: 2,
      name: "Next.js",
      designation: "React Framework",
      icon: SiNextdotjs,
      color: "#000000",
    },
    {
      id: 3,
      name: "TypeScript",
      designation: "Programming Language",
      icon: SiTypescript,
      color: "#3178C6",
    },
    {
      id: 4,
      name: "Tailwind CSS",
      designation: "CSS Framework",
      icon: SiTailwindcss,
      color: "#06B6D4",
    },
  ];

  // Create portal modal content
  const modalContent = (
    <AnimatePresence>
      {active && (
        <>
          {/* Semi-transparent overlay - NOT full black */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 h-full w-full z-[999998] backdrop-blur-sm"
            style={{
              backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.2)'
            }}
          />

          {/* Modal container */}
          <div className="fixed inset-0 grid place-items-center z-[999999] [transform-style:preserve-3d] smooth-cursor-area p-4">
            {/* 3d-card wrapper for effects with expanded hover area */}
            <CardContainer
              containerClassName="inter-var py-0 flex items-center justify-center smooth-cursor-area w-full h-full"
              expandedHoverArea={false}
              autoActivate={true}
              disableMouseHandlers={true}
            >
              <CardBody
                ref={cardContainerRef}
                className={`relative group/card smooth-cursor-area w-auto sm:w-[30rem] h-auto rounded-xl p-6 sm:p-6 border shadow-xl [transform-style:preserve-3d] [&>*]:[transform-style:preserve-3d] ${isDarkMode
                  ? 'bg-[var(--card-background)] border-[var(--card-border)]'
                  : 'bg-white border-gray-200'
                  } sm:mx-0 mx-4`}
              >
                {/* Close button positioned on top-right of the card */}
                <motion.button
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0.05 } }}
                  onClick={() => {
                    if (onClose) onClose();
                    else setActive(null);
                  }}
                  className={`absolute top-3 right-3 project-card-close flex items-center justify-center rounded-full h-8 w-8 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'} shadow-sm`}
                  style={{ zIndex: 50, cursor: 'none' }}
                  aria-hidden={false}
                >
                  <CloseIcon />
                </motion.button>
                <motion.div
                  layoutId={`card-${active.title}-${id}`}
                  ref={ref}
                  initial={{
                    opacity: 0,
                    scale: 0.98,
                    y: 8,
                    backgroundColor: isDarkMode ? 'var(--card-background)' : 'white'
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    backgroundColor: isDarkMode ? 'var(--card-background)' : 'white'
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.98,
                    y: 8
                  }}
                  transition={{ duration: 0.28 }}
                  className="project-card smooth-cursor-area sm:max-h-none max-h-[80vh] sm:overflow-visible overflow-auto"
                  style={{
                    backgroundColor: isDarkMode ? 'var(--card-background)' : 'white'
                  }}
                >
                  <CardItem translateZ={50} className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                    <motion.h3 layoutId={`title-${active.title}-${id}`}>
                      {active.title}
                    </motion.h3>
                  </CardItem>

                  <CardItem
                    as="p"
                    translateZ={60}
                    className={`text-sm max-w-sm mt-2 mb-0 sm:mb-7 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}
                  >
                    <motion.p layoutId={`description-${active.description}-${id}`}>
                      {active.description}
                    </motion.p>
                  </CardItem>

                  <CardItem translateZ={100} className="w-full mt-4">
                    <motion.div layoutId={`image-${active.title}-${id}`}>
                      <img
                        src={active.src}
                        alt={active.title}
                        className="h-40 sm:h-60 w-full object-cover rounded-xl group-hover/card:shadow-xl"
                      />
                    </motion.div>
                  </CardItem>

                  <CardItem translateZ={30} className="mt-4">
                    <motion.div
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className={`text-[15px] ${isDarkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}
                    >
                      {/* Inline styles for the scroll hint animation */}
                      <style>{`
                        @keyframes hint-pulse {
                          0% { opacity: 0; transform: translateY(6px); }
                          10% { opacity: 1; transform: translateY(0); }
                          80% { opacity: 1; transform: translateY(0); }
                          100% { opacity: 0; transform: translateY(-6px); }
                        }
                        .animate-hint {
                          animation: hint-pulse 1.6s ease-in-out infinite;
                        }
                      `}</style>

                      <div>
                        <div
                          id={`expandable-content-${id}`}
                          ref={contentRef}
                          className="space-y-4 sm:max-h-[25vh] max-h-[30vh] overflow-auto pr-2 pb-0 text-[12px] sm:text-sm mt-0 sm:mt-8"
                        >
                          {typeof active.content === "function"
                            ? active.content()
                            : active.content}
                        </div>

                        {/* Reserve a fixed-height area for the hint so layout doesn't jump when it appears/disappears */}
                        <div id={`scroll-hint-wrapper-${id}`} className="mt-3 h-6 flex items-center">
                          <div
                            id={`scroll-hint-${id}`}
                            className={`w-full flex items-center gap-2 text-[12px] select-none justify-start transition-opacity duration-200 ${animateHint ? 'animate-hint' : ''} ${showScrollHint ? 'opacity-100' : 'opacity-0'} ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
                            aria-hidden
                          >
                            <span>Scroll</span>
                            <FiChevronDown className="inline-block h-3.5 w-3.5" aria-hidden />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </CardItem>

                  <div className="flex justify-between items-center mt-3 sm:mt-2">
                    <CardItem translateZ={60} as="div" className="flex items-center gap-2">
                      <AnimatedTooltip items={techItems} isDarkMode={isDarkMode} />
                    </CardItem>

                    <CardItem translateZ={60} as="div">
                      <InteractiveHoverButton
                        isDarkMode={isDarkMode}
                        onClick={() => window.open(active.ctaLink, "_blank")}
                        className="text-xs px-3 py-1"
                      >
                        {active.ctaText}
                      </InteractiveHoverButton>
                    </CardItem>
                  </div>
                </motion.div>
              </CardBody>
            </CardContainer>
          </div>
        </>
      )}
    </AnimatePresence>
  );  // Create or get portal root (simplified)
  let portalRoot = document.getElementById('expandable-modal-root');
  if (!portalRoot) {
    portalRoot = document.createElement('div');
    portalRoot.id = 'expandable-modal-root';
    document.body.appendChild(portalRoot);
  }

  return createPortal(modalContent, portalRoot);
}

export const CloseIcon = () => (
  <motion.span
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0, transition: { duration: 0.05 } }}
    className="inline-flex items-center justify-center h-4 w-4"
    style={{ cursor: 'none' }}
  >
    <AiOutlineClose className="h-4 w-4" aria-hidden />
  </motion.span>
);
