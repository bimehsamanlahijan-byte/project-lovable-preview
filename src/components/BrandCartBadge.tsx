import type { ComponentType } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import brandGif from "@/assets/brand-logo.gif";

/**
 * Circular badge that alternates between a crisp SVG icon (cart by default)
 * and the animated brand GIF, with a clean flip/cross-fade between them.
 */
export function BrandCartBadge({
  size = 40,
  Icon = ShoppingCart,
  intervalMs = 2600,
  className = "",
  gifUrl,
}: {
  size?: number;
  Icon?: ComponentType<{ className?: string }>;
  intervalMs?: number;
  className?: string;
  gifUrl?: string;
}) {
  const [showGif, setShowGif] = useState(false);

  useEffect(() => {
    const t = window.setInterval(() => setShowGif((v) => !v), Math.max(800, intervalMs));
    return () => window.clearInterval(t);
  }, [intervalMs]);

  return (
    <span
      className={`relative grid place-items-center rounded-full overflow-hidden shrink-0 bg-[linear-gradient(120deg,#b91c1c,#f43f5e)] text-white shadow-md ring-2 ring-white/70 ${className}`}
      style={{ width: size, height: size, perspective: 400 }}
      aria-hidden="true"
    >
      <AnimatePresence initial={false} mode="wait">
        {showGif ? (
          <motion.img
            key="gif"
            src={gifUrl || brandGif}
            alt=""
            className="absolute inset-0 w-full h-full object-cover bg-white"
            initial={{ rotateY: -90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: 90, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          />
        ) : (
          <motion.span
            key="icon"
            className="absolute inset-0 grid place-items-center"
            initial={{ rotateY: -90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: 90, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <Icon className="w-1/2 h-1/2" />
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

export default BrandCartBadge;
