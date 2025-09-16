"use client";

import React, { useEffect, useId, useRef, useState, ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useOutsideClick } from "@/hooks/use-outside-click";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import { AnimatedTooltip } from "@/components/ui/animated-tooltip";
import { FaReact } from "react-icons/fa";
import { SiNextdotjs, SiTypescript, SiTailwindcss } from "react-icons/si";
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
  const [active, setActive] = useState<CardType | null>(initialCard ?? null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();

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

  return (
    <>
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 h-full w-full z-10 backdrop-blur-lg"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {active && (
          <div className="fixed inset-0 grid place-items-center z-[100]">
            <motion.button
              key={`button-${active.title}-${id}`}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.05 } }}
              className={`flex absolute top-2 right-2 lg:hidden items-center justify-center rounded-full h-6 w-6 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'
                }`}
              onClick={() => {
                if (onClose) onClose();
                else setActive(null);
              }}
            >
              <CloseIcon />
            </motion.button>

            {/* use 3d-card wrapper for subtle layered / floating effect */}
            <CardContainer containerClassName="inter-var py-0">
              <CardBody className={`${isDarkMode
                ? 'bg-[var(--card-background)] border-[var(--card-border)]'
                : 'bg-gray-50 border-black/[0.08]'
                } relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border`}>
                <motion.div
                  layoutId={`card-${active.title}-${id}`}
                  ref={ref}
                  initial={{ opacity: 0, scale: 0.98, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98, y: 8 }}
                  transition={{ duration: 0.28 }}
                  onMouseEnter={() => onHoverEnter?.()}
                  onMouseLeave={() => onHoverLeave?.()}
                  className="project-card"
                >
                  <CardItem translateZ={50} className={`text-xl font-bold ${isDarkMode ? 'text-[var(--text-primary)]' : 'text-neutral-600'
                    }`}>
                    <motion.h3 layoutId={`title-${active.title}-${id}`}>
                      {active.title}
                    </motion.h3>
                  </CardItem>

                  <CardItem
                    as="p"
                    translateZ={60}
                    className={`text-sm max-w-sm mt-2 ${isDarkMode ? 'text-[var(--text-secondary)]' : 'text-neutral-500'
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
                        className="h-60 w-full object-cover rounded-xl group-hover/card:shadow-xl"
                      />
                    </motion.div>
                  </CardItem>

                  <CardItem translateZ={30} className="mt-4">
                    <motion.div
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className={`text-sm ${isDarkMode ? 'text-[var(--text-secondary)]' : 'text-neutral-600'
                        }`}
                    >
                      <div className="space-y-4 max-h-[30vh] overflow-auto pr-2">
                        {typeof active.content === "function"
                          ? active.content()
                          : active.content}
                      </div>
                    </motion.div>
                  </CardItem>

                  <div className="flex justify-between items-center mt-20">
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
        )}
      </AnimatePresence>
    </>
  );
}

export const CloseIcon = () => (
  <motion.svg
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0, transition: { duration: 0.05 } }}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M18 6l-12 12" />
    <path d="M6 6l12 12" />
  </motion.svg>
);
