"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { motion, useMotionValue, useAnimationFrame } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface InfiniteCarouselProps {
  children: React.ReactNode[];
  /** Pixels per second scroll speed (default 40) */
  speed?: number;
  /** Gap between cards in px (default 24 = gap-6) */
  gap?: number;
  /** Extra class on the outer wrapper */
  className?: string;
}

const InfiniteCarousel = ({
  children,
  speed = 40,
  gap = 24,
  className = "",
}: InfiniteCarouselProps) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [setWidth, setSetWidth] = useState(0); // width of one "set" of items
  const [isPaused, setIsPaused] = useState(false);
  const x = useMotionValue(0);

  // Measure one set (original items) width
  useEffect(() => {
    if (!trackRef.current) return;
    const track = trackRef.current;
    // The track contains 2x the items. Half is one set.
    const totalWidth = track.scrollWidth;
    setSetWidth(totalWidth / 2);
  }, [children]);

  // Animate: scroll right-to-left continuously
  useAnimationFrame((_, delta) => {
    if (isPaused || setWidth === 0) return;
    const moveBy = (delta / 1000) * speed;
    let next = x.get() - moveBy;

    // When we've scrolled past one full set, jump back
    if (next <= -setWidth) {
      next += setWidth;
    }
    x.set(next);
  });

  // Arrow click handlers — shift by one card width (~320px or calculated)
  const scrollByAmount = useCallback(
    (direction: "left" | "right") => {
      if (setWidth === 0) return;
      // Estimate card width as setWidth / children.length
      const cardWidth =
        children.length > 0 ? setWidth / children.length : 320;
      const shift = cardWidth + gap;
      let next =
        direction === "left" ? x.get() + shift : x.get() - shift;

      // Keep within bounds
      if (next > 0) next = 0;
      if (next <= -setWidth) next += setWidth;
      x.set(next);
    },
    [setWidth, children.length, gap, x]
  );

  // Duplicate children for seamless loop
  const duplicated = [...children, ...children];

  return (
    <div
      className={`relative group ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Left arrow */}
      <button
        onClick={() => scrollByAmount("left")}
        aria-label="Scroll left"
        className="absolute left-2 top-1/2 -translate-y-1/2 z-20
          w-10 h-10 rounded-full
          bg-white/90 backdrop-blur border border-slate-200
          shadow-lg shadow-slate-200/50
          flex items-center justify-center
          text-slate-600 hover:text-slate-900 hover:bg-white
          opacity-0 group-hover:opacity-100
          transition-all duration-300 cursor-pointer
          hover:scale-110 active:scale-95"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Right arrow */}
      <button
        onClick={() => scrollByAmount("right")}
        aria-label="Scroll right"
        className="absolute right-2 top-1/2 -translate-y-1/2 z-20
          w-10 h-10 rounded-full
          bg-white/90 backdrop-blur border border-slate-200
          shadow-lg shadow-slate-200/50
          flex items-center justify-center
          text-slate-600 hover:text-slate-900 hover:bg-white
          opacity-0 group-hover:opacity-100
          transition-all duration-300 cursor-pointer
          hover:scale-110 active:scale-95"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Scrolling track */}
      <div className="overflow-hidden w-full">
        <motion.div
          ref={trackRef}
          className="flex items-stretch"
          style={{ x, gap: `${gap}px` }}
        >
          {duplicated.map((child, i) => (
            <div key={i} className="flex-shrink-0 flex items-stretch">
              {child}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default InfiniteCarousel;
