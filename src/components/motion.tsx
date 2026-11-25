"use client";

import { MotionConfig, motion, type Variants } from "motion/react";

/** Honors the OS "reduce motion" setting for every motion component below it. */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

export const EASE_OUT = [0.22, 1, 0.36, 1] as const;

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 28, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: EASE_OUT } },
};

type Tag = "div" | "ul" | "li" | "section";

/** Children fade up and scale in, one after another, the first time the group scrolls into view. */
export function Stagger({ children, className, as = "div" }: { children: React.ReactNode; className?: string; as?: Tag }) {
  const M = motion[as];
  return (
    <M className={className} variants={container} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }}>
      {children}
    </M>
  );
}

export function StaggerItem({ children, className, as = "div" }: { children: React.ReactNode; className?: string; as?: Tag }) {
  const M = motion[as];
  return (
    <M className={className} variants={item}>
      {children}
    </M>
  );
}

/** Single element reveal on scroll. */
export function Reveal({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  );
}
