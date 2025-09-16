"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { FaReact } from "react-icons/fa";
import { SiNextdotjs, SiTypescript, SiTailwindcss } from "react-icons/si";

export const AnimatedTooltip = ({
  items,
  isDarkMode = false,
}: {
  items: {
    id: number;
    name: string;
    designation: string;
    // Ganti any dengan type spesifik untuk React Icons
    icon: React.ComponentType<{
      className?: string;
      style?: React.CSSProperties;
    }>;
    color: string;
  }[];
  isDarkMode?: boolean;
}) => {
  const refs = useRef<Record<number, HTMLDivElement | null>>({});
  const rafRef = useRef<number | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const [pos, setPos] = useState<{ left: number; top: number; placeAbove: boolean } | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const updatePosFor = (id: number) => {
    const el = refs.current[id];
    if (!el) return;
    const r = el.getBoundingClientRect();
    const centerX = r.left + r.width / 2;
    const topCandidate = r.top; // top of icon
    const bottomCandidate = r.bottom;
    const tooltip = tooltipRef.current;
    const tooltipW = tooltip?.offsetWidth ?? 160;
    const tooltipH = tooltip?.offsetHeight ?? 48;

    // preferred place above, but if not enough space, place below
    const placeAbove = topCandidate > tooltipH + 12;
    // clamp left so tooltip is not clipped at viewport edges
    let left = centerX - tooltipW / 2;
    const pad = 12;
    left = Math.max(pad, Math.min(left, window.innerWidth - tooltipW - pad));

    const top = placeAbove ? topCandidate - tooltipH - 8 : bottomCandidate + 8;
    setPos({ left, top, placeAbove });
  };

  const handleEnter = (id: number) => {
    setHovered(id);
    // delay measurement briefly to allow portal tooltip to mount
    rafRef.current = requestAnimationFrame(() => updatePosFor(id));
  };

  const handleMove = (e: React.MouseEvent, id: number) => {
    // update center based on current element bounding rect to keep tooltip aligned when small layout shifts happen
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => updatePosFor(id));
  };

  const handleLeave = () => {
    setHovered(null);
    setPos(null);
  };

  return (
    <>
      <div className="flex items-center -space-x-6" aria-hidden>
        {items.map((item, idx) => (
          <div
            key={item.id}
            className="relative"
            style={{ zIndex: 10 + idx }}
            onMouseEnter={() => handleEnter(item.id)}
            onMouseMove={(e) => handleMove(e, item.id)}
            onMouseLeave={handleLeave}
          >
            <div
              ref={(el) => { refs.current[item.id] = el; }}
              className="p-2"
              style={{ cursor: "pointer", pointerEvents: "auto" }}
            >
              <div className={`h-9 w-9 flex items-center justify-center rounded-full border-2 shadow-sm transition-all duration-200 ${isDarkMode
                ? 'bg-[var(--card-background)] border-[var(--card-border)]'
                : 'bg-white border-white/60'
                }`}>
                {/* Ganti FontAwesomeIcon ke komponen React Icons */}
                <item.icon className={`text-lg ${isDarkMode ? 'text-[var(--text-primary)]' : 'text-gray-800'
                  }`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {hovered != null && pos && (
              <motion.div
                ref={tooltipRef}
                key={`tooltip-${hovered}`}
                initial={{ opacity: 0, y: pos.placeAbove ? 6 : -6, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: pos.placeAbove ? 6 : -6, scale: 0.95 }}
                transition={{ duration: 0.18 }}
                style={{
                  position: "fixed",
                  left: pos.left,
                  top: pos.top,
                  transform: "translateX(0)",
                  pointerEvents: "none",
                }}
                className="z-[9999] pointer-events-none"
              >
                <div className={`px-3 py-2 rounded-md text-xs shadow-xl ${isDarkMode
                  ? 'bg-[var(--foreground)] text-[var(--card-background)] border-[var(--card-border)]'
                  : 'bg-black text-white'
                  }`}>
                  <div className="font-semibold text-sm">{items.find(i => i.id === hovered)?.name}</div>
                  <div className={`text-xs opacity-80`}>{items.find(i => i.id === hovered)?.designation}</div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
};