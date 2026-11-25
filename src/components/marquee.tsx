"use client";

import { motion, useAnimationFrame, useMotionValue, useReducedMotion } from "motion/react";
import { useRef } from "react";
import { useI18n } from "./preferences";

const SPEED_PX_PER_MS = 0.045;

/**
 * Seamless ticker. Two identical groups sit side by side; the track moves by
 * exactly one group's width and wraps, so there's no visible jump. It flows
 * with the reading direction (rightwards in Arabic, leftwards in English).
 * Hovering eases the speed down to a stop (and back up) instead of freezing.
 */
export function Marquee({ items, label }: { items: string[]; label: string }) {
  const { dir } = useI18n();
  const sign = dir === "rtl" ? 1 : -1;
  const x = useMotionValue(0);
  const group = useRef<HTMLDivElement>(null);
  const speed = useRef(1);
  const target = useRef(1);
  const reduce = useReducedMotion();

  useAnimationFrame((_, delta) => {
    if (reduce || !group.current) return;
    const dt = Math.min(delta, 64); // tab switches can produce huge deltas
    speed.current += (target.current - speed.current) * Math.min(1, dt / 220);
    const width = group.current.offsetWidth;
    if (width === 0) return;
    let next = Math.abs(x.get()) + SPEED_PX_PER_MS * speed.current * dt;
    if (next >= width) next -= width;
    x.set(sign * next);
  });

  const renderGroup = (hidden: boolean, ref?: React.Ref<HTMLDivElement>) => (
    <div ref={ref} className="flex shrink-0" aria-hidden={hidden || undefined}>
      {items.map((t, i) => (
        <span key={i} className="flex shrink-0 items-center gap-8 whitespace-nowrap pe-8 text-sm text-haze">
          {t}
          <span className="size-1.5 rotate-45 bg-saffron" aria-hidden />
        </span>
      ))}
    </div>
  );

  return (
    <div
      className="overflow-hidden border-b border-steel bg-slab py-2.5 [mask-image:linear-gradient(to_left,transparent,black_6%,black_94%,transparent)]"
      onMouseEnter={() => (target.current = 0)}
      onMouseLeave={() => (target.current = 1)}
      aria-label={label}
      role="region"
    >
      <motion.div className="flex w-max" style={{ x }}>
        {renderGroup(false, group)}
        {renderGroup(true)}
      </motion.div>
    </div>
  );
}
