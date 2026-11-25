"use client";

import { useEffect } from "react";
import { useCart } from "@/components/cart";

/** Empties the cart once the order confirmation page renders. */
export function ClearCart() {
  const { clear, ready } = useCart();
  useEffect(() => {
    if (ready) clear();
  }, [ready, clear]);
  return null;
}
