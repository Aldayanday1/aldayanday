import { flushSync } from "react-dom";

export const toggleThemeWithRippleFromElement = async (
  element: HTMLElement,
  onToggle?: (isDark: boolean) => void
): Promise<boolean> => {
  if (!element) return false;

  // Toggle theme and get new state
  let newDarkState = false;
  await document.startViewTransition(() => {
    flushSync(() => {
      const dark = document.documentElement.classList.toggle("dark");
      newDarkState = dark;
      onToggle?.(dark);
    });
  }).ready;

  // Calculate ripple animation from element position
  const { top, left, width, height } = element.getBoundingClientRect();
  const y = top + height / 2;
  const x = left + width / 2;

  const right = window.innerWidth - left;
  const bottom = window.innerHeight - top;
  const maxRad = Math.hypot(Math.max(left, right), Math.max(top, bottom));

  // Apply the ripple animation
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

  return newDarkState;
};